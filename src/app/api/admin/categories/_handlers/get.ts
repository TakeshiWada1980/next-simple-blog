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
import CategoryService from "@/app/_services/categoryService";
import AppErrorCode from "@/app/_types/AppErrorCode";

// [GET] /api/admin/categories カテゴリ一覧の取得
// [GET] /api/admin/categories?sort=postcount
export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const sort = searchParams.get("sort");
    let categories: Category[];
    if (sort === "postcount") {
      categories = await CategoryService.fetchAllCategoriesWithPostCount();
    } else {
      categories = await CategoryService.fetchAllCategories();
    }
    return NextResponse.json(createSuccessResponse(categories));
  } catch (error) {
    const payload = createErrorResponse(error);
    return NextResponse.json(payload, { status: payload.httpStatus });
  }
};

// 成功時のレスポンスを生成
const createSuccessResponse = (
  categories: Category[]
): ApiSuccessResponse<Category[]> =>
  new SuccessResponseBuilder(categories).setHttpStatus(StatusCodes.OK).build();

// 失敗時のレスポンスを生成
const createErrorResponse = (error: unknown): ApiErrorResponse =>
  new ErrorResponseBuilder().setUnknownError(error).build();
