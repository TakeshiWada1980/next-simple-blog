import { NextResponse } from "next/server";
import { Post } from "@prisma/client";
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

// [GET] /api/posts 投稿記事一覧(Posts)を取得
export const GET = async () => {
  try {
    const posts = await fetchAllPosts();
    return NextResponse.json(createSuccessResponse(posts));
  } catch (error) {
    const payload = createErrorResponse(error);
    return NextResponse.json(payload, { status: payload.httpStatus });
  }
};

// すべての投稿を取得
const fetchAllPosts = async (): Promise<Post[]> => {
  return await prisma.post.findMany({
    include: {
      // カテゴリーも含めて取得
      categories: {
        // NOTE: include から select に変更
        select: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" }, // 作成日が新しい順
  });
};

// 成功時のレスポンスを生成
const createSuccessResponse = (posts: Post[]): ApiSuccessResponse<Post[]> =>
  new SuccessResponseBuilder(posts).setHttpStatus(StatusCodes.OK).build();

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
