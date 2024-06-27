import { NextResponse } from "next/server";
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

// [GET] /api/admin/categories カテゴリ一覧の取得
export const GET = async () => {
  try {
    const categories = await fetchAllCategories();
    return NextResponse.json(createSuccessResponse(categories));
  } catch (error) {
    const payload = createErrorResponse(error);
    return NextResponse.json(payload, { status: payload.httpStatus });
  }
};

// すべてのカテゴリを取得
const fetchAllCategories = async (): Promise<Category[]> => {
  return await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
};

// 成功時のレスポンスを生成
const createSuccessResponse = (
  categories: Category[]
): ApiSuccessResponse<Category[]> =>
  new SuccessResponseBuilder(categories).setHttpStatus(StatusCodes.OK).build();

// 失敗時のレスポンスを生成
const createErrorResponse = (error: unknown): ApiErrorResponse => {
  const errorResponse = new ErrorResponseBuilder()
    .setHttpStatus(StatusCodes.INTERNAL_SERVER_ERROR)
    .setOrigin(Origin.SERVER)
    .setAppErrorCode(AppErrorCode.UNKNOWN_ERROR)
    .setTechnicalInfo(error instanceof Error ? error.message : "")
    .build();
  return errorResponse;
};
