import { NextResponse, NextRequest } from "next/server";
import { Category } from "@prisma/client";
import {
  ApiSuccessResponse,
  ApiErrorResponse,
  Origin,
} from "@/app/_types/ApiResponse";
import { StatusCodes } from "@/app/_utils/extendedStatusCodes";
import SuccessResponseBuilder from "@/app/api/_helpers/successResponseBuilder";
import ErrorResponseBuilder from "@/app/api/_helpers/errorResponseBuilder";
import { z } from "zod";
import CategoryService from "@/app/_services/categoryService";
import AppErrorCode from "@/app/_types/AppErrorCode";
import CategoryRequest from "@/app/_types/CategoryRequest";

// [POST] /api/admin/categories カテゴリを新規作成
export const POST = async (req: NextRequest) => {
  try {
    const body: CategoryRequest.Payload = await req.json();

    // カテゴリ名の前後の空白を削除
    body.name = body.name ? body.name.trim() : "";

    // バリデーションに問題があれば z.ZodError が Throw
    const validatedBody = CategoryRequest.validationSchema.parse(body);

    // DB関連で問題があればエラーが Throw
    const insertedCategory = await CategoryService.insertCategory(
      validatedBody
    );

    const payload = createSuccessResponse(insertedCategory);
    return NextResponse.json(payload, { status: payload.httpStatus });
  } catch (error) {
    const payload = createErrorResponse(error);
    return NextResponse.json(payload, { status: payload.httpStatus });
  }
};

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
  } else if (error instanceof CategoryService.AlreadyExistsError) {
    errorResponseBuilder
      .setHttpStatus(StatusCodes.BAD_REQUEST)
      .setOrigin(Origin.CLIENT)
      .setAppErrorCode(error.appErrorCode)
      .setTechnicalInfo(error.message);
  } else {
    errorResponseBuilder.setUnknownError(error);
  }
  return errorResponseBuilder.build();
};
