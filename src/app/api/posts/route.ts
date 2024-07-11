import { NextResponse } from "next/server";
import { Post } from "@prisma/client";
import { ApiSuccessResponse, ApiErrorResponse } from "@/app/_types/ApiResponse";
import { StatusCodes } from "@/app/_utils/extendedStatusCodes";
import SuccessResponseBuilder from "@/app/api/_helpers/successResponseBuilder";
import ErrorResponseBuilder from "@/app/api/_helpers/errorResponseBuilder";
import PostService from "@/app/_services/postService";

// [GET] /api/posts 記事一覧の取得
export const GET = async () => {
  try {
    const posts = await PostService.fetchAllPosts();
    return NextResponse.json(createSuccessResponse(posts));
  } catch (error) {
    const payload = createErrorResponse(error);
    return NextResponse.json(payload, { status: payload.httpStatus });
  }
};

// 成功時のレスポンスを生成
const createSuccessResponse = (posts: Post[]): ApiSuccessResponse<Post[]> =>
  new SuccessResponseBuilder(posts).setHttpStatus(StatusCodes.OK).build();

// 失敗時のレスポンスを生成
const createErrorResponse = (error: unknown): ApiErrorResponse =>
  new ErrorResponseBuilder().setUnknownError(error).build();
