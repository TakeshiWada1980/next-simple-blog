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
import AppErrorCode from "@/app/_types/AppErrorCode";
import CategoryService from "@/app/_services/categoryService";
import CategoryRequest from "@/app/_types/CategoryRequest";

type Params = { params: { id: string } };

// [PUT] /api/admin/categories/:id
export const PUT = async (req: NextRequest, params: Params) => {
  const { id } = params.params;
  try {
    const body: CategoryRequest.Payload = await req.json();
    const validatedBody = CategoryRequest.serverValidationSchema.parse(body);
    const updatedCategory = await CategoryService.updateCategory(
      id,
      validatedBody
    );
    return NextResponse.json(createSuccessPutResponse(updatedCategory));
  } catch (error) {
    const payload = createErrorResponse(error);
    return NextResponse.json(payload, { status: payload.httpStatus });
  }
};

// [DELETE] /api/admin/categories/:id
// NOTE:`req: NextRequest` がないと param が適切に取得できないので注意
export const DELETE = async (req: NextRequest, params: Params) => {
  const { id } = params.params;
  try {
    await CategoryService.deleteCategory(id);
    return NextResponse.json(createSuccessDeleteResponse());
  } catch (error) {
    const payload = createErrorResponse(error);
    return NextResponse.json(payload, { status: payload.httpStatus });
  }
};

// [PUT]成功時のレスポンスを生成
const createSuccessPutResponse = (
  category: Category
): ApiSuccessResponse<Category> =>
  new SuccessResponseBuilder(category).setHttpStatus(StatusCodes.OK).build();

// [DELETE]成功時のレスポンスを生成
const createSuccessDeleteResponse = (): ApiSuccessResponse<null> =>
  new SuccessResponseBuilder(null).setHttpStatus(StatusCodes.OK).build();

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
    error instanceof CategoryService.AlreadyExistsError ||
    error instanceof CategoryService.NotFoundError
  ) {
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
