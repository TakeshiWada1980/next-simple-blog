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
import { z } from "zod";
import PostRequest from "@/app/_types/PostRequest";
import PostService from "@/app/_services/postService";
import AppErrorCode from "@/app/_types/AppErrorCode";

// [GET] /api/admin/posts
export const GET = async () => {
  try {
    const posts = await PostService.fetchAllPosts();
    return NextResponse.json(new SuccessResponseBuilder(posts).build());
  } catch (error) {
    const payload = new ErrorResponseBuilder().setUnknownError(error).build();
    return NextResponse.json(payload, { status: payload.httpStatus });
  }
};

// [POST] /api/admin/posts
export const POST = async (req: NextRequest) => {
  try {
    const body: PostRequest.Payload = await req.json();
    const validatedBody = PostRequest.serverValidationSchema.parse(body);
    const insertedPost = await PostService.insertPostWithCategories(
      validatedBody
    );
    const payload = createPostSuccessResponse(insertedPost);
    return NextResponse.json(payload, { status: payload.httpStatus });
  } catch (error) {
    const payload = createPostErrorResponse(error);
    return NextResponse.json(payload, { status: payload.httpStatus });
  }
};

// [POST]成功時のレスポンス(201)を生成
const createPostSuccessResponse = (post: Post): ApiSuccessResponse<Post> =>
  new SuccessResponseBuilder(post).setHttpStatus(StatusCodes.CREATED).build();

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
