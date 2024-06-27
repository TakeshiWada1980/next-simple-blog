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

// [POST] /api/admin/categories カテゴリを新規作成
export const POST = async (req: NextRequest) => {
  try {
    const body: PostPayload = await req.json();

    // カテゴリ名の前後の空白を削除
    body.name = body.name ? body.name.trim() : "";

    // バリデーションに問題があれば z.ZodError が Throw
    const validatedBody = postPayloadSchema.parse(body);

    // DB関連で問題があればエラーが Throw
    const insertedCategory = await insertCategory(validatedBody);

    const payload = createSuccessResponse(insertedCategory);
    return NextResponse.json(payload, { status: payload.httpStatus });
  } catch (error) {
    const payload = createErrorResponse(error);
    return NextResponse.json(payload, { status: payload.httpStatus });
  }
};

// データベースにカテゴリデータを挿入
const insertCategory = async (category: PostPayload) => {
  const { name } = category;
  // 当該のカテゴリが既に存在していないか？
  if (await prisma.category.findUnique({ where: { name } })) {
    throw new CategoryAlreadyExistsError(name);
  }
  const data = await prisma.category.create({ data: { name } });
  return data;
};

// カテゴリが既に存在している場合のエラー
class CategoryAlreadyExistsError extends Error {
  appErrorCode: string;
  constructor(categoryName: string) {
    super(`カテゴリ '${categoryName}' は既に DB に存在しています。`);
    this.appErrorCode = AppErrorCode.CATEGORY_ALREADY_EXISTS;
  }
}

// 成功時のレスポンスを生成
const createSuccessResponse = (
  category: Category
): ApiSuccessResponse<Category> =>
  new SuccessResponseBuilder(category)
    .setHttpStatus(StatusCodes.CREATED)
    .build();

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
  } else if (error instanceof CategoryAlreadyExistsError) {
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
    .min(1, minMsg("title", 1)),
});

type PostPayload = z.infer<typeof postPayloadSchema>;
