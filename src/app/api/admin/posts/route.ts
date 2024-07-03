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
import { GET as getPosts } from "@/app/api/posts/route";
import { z } from "zod";
import PostRequest from "@/app/_types/PostRequest";
import PostService from "@/app/_services/postService";
import AppErrorCode from "@/app/_types/AppErrorCode";

// [GET] /api/admin/posts
// NOTE:現状で /apy/posts と同じ処理
export const GET = getPosts;

// [POST] /api/admin/posts
export const POST = async (req: NextRequest) => {
  try {
    const body: PostRequest.Payload = await req.json();

    // バリデーションに問題があれば z.ZodError が Throw
    const validatedBody = PostRequest.serverValidationSchema.parse(body);

    // DB関連で問題があればエラーが Throw
    const insertedPost = await PostService.insertPostWithCategories(
      validatedBody
    );

    const payload = createSuccessResponse(insertedPost);
    return NextResponse.json(payload, { status: payload.httpStatus });
  } catch (error) {
    const payload = createErrorResponse(error);
    return NextResponse.json(payload, { status: payload.httpStatus });
  }
};

// 成功時のレスポンスを生成
const createSuccessResponse = (post: Post): ApiSuccessResponse<Post> =>
  new SuccessResponseBuilder(post).setHttpStatus(StatusCodes.CREATED).build();

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
  } else if (error instanceof PostService.CategoryNotFoundError) {
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
