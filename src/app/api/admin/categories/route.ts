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
import CategoryRequest from "@/app/_types/CategoryRequest";
import { z } from "zod";
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
    return NextResponse.json(new SuccessResponseBuilder(categories).build());
  } catch (error) {
    const payload = createGetErrorResponse(error);
    return NextResponse.json(payload, { status: payload.httpStatus });
  }
};

// [POST] /api/admin/categories カテゴリを新規作成
export const POST = async (req: NextRequest) => {
  try {
    const body: CategoryRequest.Payload = await req.json();
    const validatedBody = CategoryRequest.serverValidationSchema.parse(body);
    const insertedCategory = await CategoryService.insertCategory(
      validatedBody
    );
    const payload = createPostSuccessResponse(insertedCategory);
    return NextResponse.json(payload, { status: payload.httpStatus });
  } catch (error) {
    const payload = createPostErrorResponse(error);
    return NextResponse.json(payload, { status: payload.httpStatus });
  }
};

// [GET]失敗時のレスポンスを生成
const createGetErrorResponse = (error: unknown): ApiErrorResponse =>
  new ErrorResponseBuilder().setUnknownError(error).build();

// [POST]成功時のレスポンスを生成
const createPostSuccessResponse = (
  category: Category
): ApiSuccessResponse<Category> =>
  new SuccessResponseBuilder(category)
    .setHttpStatus(StatusCodes.CREATED)
    .build();

// [POST]失敗時のレスポンスを生成
const createPostErrorResponse = (error: unknown): ApiErrorResponse => {
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
