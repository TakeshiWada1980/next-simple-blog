import { NextResponse, NextRequest } from "next/server";
import { Post } from "@prisma/client";
import {
  ApiSuccessResponse,
  ApiErrorResponse,
  Origin,
} from "@/app/_types/ApiResponse";
import { StatusCodes } from "@/app/_utils/extendedStatusCodes";
import SuccessResponseBuilder from "@/app/api/_helpers/successResponseBuilder";
import ErrorResponseBuilder from "@/app/api/_helpers/errorResponseBuilder";
import PostService from "@/app/_services/postService";
import AppErrorCode from "@/app/_types/AppErrorCode";

type Params = { params: { id: string } };

// [GET] /api/posts/:id
export const GET = async (req: NextRequest, { params: { id } }: Params) => {
  try {
    const post = await PostService.fetchPostById(id);
    return NextResponse.json(createSuccessResponse(post));
  } catch (error) {
    const payload = createErrorResponse(error);
    return NextResponse.json(payload, { status: payload.httpStatus });
  }
};

// 成功時のレスポンスを生成
const createSuccessResponse = (post: Post): ApiSuccessResponse<Post> =>
  new SuccessResponseBuilder(post).setHttpStatus(StatusCodes.OK).build();

// 失敗時のレスポンスを生成
const createErrorResponse = (error: unknown): ApiErrorResponse => {
  const errorResponseBuilder = new ErrorResponseBuilder();
  if (error instanceof PostService.NotFoundError) {
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
