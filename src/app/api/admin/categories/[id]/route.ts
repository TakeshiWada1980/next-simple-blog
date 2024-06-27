import { NextResponse, NextRequest } from "next/server";
import { Category } from "@prisma/client";
import {
  ApiSuccessResponse,
  ApiErrorResponse,
  AppErrorCode,
  Origin,
} from "@/app/_types/ApiResponse";
import { StatusCodes } from "@/app/_utils/extendedStatusCodes";
import SuccessResponseBuilder from "@/app/api/_helpers/successResponseBuilder";
import ErrorResponseBuilder from "@/app/api/_helpers/errorResponseBuilder";
import prisma from "@/lib/prisma";
import { z } from "zod";

type Params = { params: { id: string } };

// [PUT] /api/admin/categories/:id
export const PUT = async (req: NextRequest, { params: { id } }: Params) => {
  try {
    const body: PostPayload = await req.json();
    body.name = body.name ? body.name.trim() : "";
    const validatedBody = postPayloadSchema.parse(body);
    const updatedCategory = await updateCategory(id, validatedBody);
    return NextResponse.json(createSuccessResponse(updatedCategory));
  } catch (error) {
    const payload = createErrorResponse(error);
    return NextResponse.json(payload, { status: payload.httpStatus });
  }
};

// カテゴリの名前を更新するDB操作
const updateCategory = async (id: string, category: PostPayload) => {
  const { name: newName } = category;

  // 指定 id のカテゴリは DB に存在しているかを確認
  const existingCategory = await prisma.category.findUnique({
    where: { id: parseInt(id) },
  });
  if (!existingCategory) {
    throw new CategoryNotFoundError(id);
  }

  // 更新後の名前を持ったカテゴリが既に存在していないかを確認
  const existingCategoryWithNewName = await prisma.category.findUnique({
    where: { name: newName },
  });
  if (existingCategoryWithNewName) {
    throw new CategoryAlreadyExistsError(newName);
  }

  // カテゴリの名前 (nameフィールド) を更新
  return await prisma.category.update({
    where: { id: parseInt(id) },
    data: { name: newName },
  });
};

// カテゴリが既に存在している場合のエラー
class CategoryAlreadyExistsError extends Error {
  appErrorCode: string;
  constructor(categoryName: string) {
    super(
      `は既に DB に '${categoryName}' という名前のカテゴリ存在しています。`
    );
    this.appErrorCode = AppErrorCode.CATEGORY_ALREADY_EXISTS;
  }
}

// 更新対象のカテゴリが存在しない場合のエラー
class CategoryNotFoundError extends Error {
  appErrorCode: string;
  constructor(categoryId: string) {
    super(`DB に id:${categoryId} のカテゴリが存在しません。`);
    this.appErrorCode = AppErrorCode.CATEGORY_NOT_FOUND;
  }
}

// 成功時のレスポンスを生成
const createSuccessResponse = (
  category: Category
): ApiSuccessResponse<Category> =>
  new SuccessResponseBuilder(category).setHttpStatus(StatusCodes.OK).build();

// 失敗時のレスポンスを生成
const createErrorResponse = (error: unknown): ApiErrorResponse => {
  const errorResponseBuilder = new ErrorResponseBuilder();
  if (error instanceof z.ZodError) {
    const msg =
      "POSTリクエストのデータ(JSON)において、" +
      error.errors.map((e) => e.message).join("");
    errorResponseBuilder
      .setHttpStatus(StatusCodes.BAD_REQUEST)
      .setOrigin(Origin.CLIENT)
      .setAppErrorCode(AppErrorCode.INVALID_POST_DATA)
      .setTechnicalInfo(msg);
  } else if (
    error instanceof CategoryNotFoundError ||
    error instanceof CategoryAlreadyExistsError
  ) {
    errorResponseBuilder
      .setHttpStatus(StatusCodes.BAD_REQUEST)
      .setOrigin(Origin.CLIENT)
      .setAppErrorCode(error.appErrorCode)
      .setTechnicalInfo(error.message);
  } else {
    errorResponseBuilder
      .setOrigin(Origin.SERVER)
      .setHttpStatus(StatusCodes.INTERNAL_SERVER_ERROR)
      .setAppErrorCode(AppErrorCode.UNKNOWN_ERROR)
      .setTechnicalInfo(error instanceof Error ? error.message : "");
  }
  return errorResponseBuilder.build();
};

// リクエストデータのバリデーションスキーマ
const requiredMsg = (field: string, type: string) =>
  `${type}型の値を持つフィールド '${field}' が存在しません。`;
const minMsg = (item: string, min: number) =>
  `フィールド '${item}' には${min}文字以上を設定してください。`;
const postPayloadSchema = z.object({
  name: z
    .string({ message: requiredMsg("name", "string") })
    .min(1, minMsg("name", 1)),
});

type PostPayload = z.infer<typeof postPayloadSchema>;
