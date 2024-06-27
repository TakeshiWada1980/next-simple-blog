import { NextResponse, NextRequest } from "next/server";
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

type Params = { params: { id: string } };

// [GET] /api/posts/:id
export const GET = async (req: NextRequest, { params: { id } }: Params) => {
  try {
    const post = await fetchPostById(id);
    return NextResponse.json(createSuccessResponse(post));
  } catch (error) {
    const payload = createErrorResponse(error);
    return NextResponse.json(payload, { status: payload.httpStatus });
  }
};

// IDから投稿を取得
const fetchPostById = async (id: string): Promise<Post> => {
  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(id),
    },
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
  });
  if (!post) {
    throw new PostNotFoundError(id);
  }
  return post;
};

class PostNotFoundError extends Error {
  constructor(postId: string) {
    super(`ID '${postId}' に該当する記事は存在しません。`);
  }
}

// 成功時のレスポンスを生成
const createSuccessResponse = (post: Post): ApiSuccessResponse<Post> =>
  new SuccessResponseBuilder(post).setHttpStatus(StatusCodes.OK).build();

// 失敗時のレスポンスを生成
const createErrorResponse = (error: unknown): ApiErrorResponse => {
  const errorResponseBuilder = new ErrorResponseBuilder();
  if (error instanceof PostNotFoundError) {
    errorResponseBuilder
      .setHttpStatus(StatusCodes.BAD_REQUEST)
      .setOrigin(Origin.CLIENT)
      .setAppErrorCode(AppErrorCode.POST_NOT_FOUND)
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
