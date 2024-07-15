import { GET as getPost } from "@/app/api/posts/[id]/route";
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
import {
  validateAuthToken,
  InvalidTokenError,
} from "@/app/api/_helpers/validateAuthToken";

type Params = { params: { id: string } };

// [GET] /api/admin/post/:id
export const GET = getPost;

// [PUT] /api/admin/posts/:id
export const PUT = async (req: NextRequest, { params: { id } }: Params) => {
  try {
    await validateAuthToken(req.headers.get("Authorization") ?? "");
    const body: PostRequest.Payload = await req.json();
    const validatedBody = PostRequest.serverValidationSchema.parse(body);
    const updatedCategory = await PostService.updatePost(id, validatedBody);
    return NextResponse.json(createSuccessPutResponse(updatedCategory));
  } catch (error) {
    const payload = createErrorResponse(error);
    return NextResponse.json(payload, { status: payload.httpStatus });
  }
};

// [DELETE] /api/admin/posts/:id
// `req: NextRequest` がないと param が適切に取得できないので注意
export const DELETE = async (req: NextRequest, { params: { id } }: Params) => {
  try {
    await validateAuthToken(req.headers.get("Authorization") ?? "");
    await PostService.deletePost(id);
    return NextResponse.json(createSuccessDeleteResponse());
  } catch (error) {
    const payload = createErrorResponse(error);
    return NextResponse.json(payload, { status: payload.httpStatus });
  }
};

// [PUT]成功時のレスポンスを生成
const createSuccessPutResponse = (post: Post): ApiSuccessResponse<Post> =>
  new SuccessResponseBuilder(post).setHttpStatus(StatusCodes.OK).build();

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
  } else if (error instanceof PostService.NotFoundError) {
    errorResponseBuilder
      .setHttpStatus(StatusCodes.BAD_REQUEST)
      .setOrigin(Origin.CLIENT)
      .setAppErrorCode(error.appErrorCode)
      .setTechnicalInfo(error.message);
  } else if (error instanceof PostService.CategoryNotFoundError) {
    errorResponseBuilder
      .setHttpStatus(StatusCodes.BAD_REQUEST)
      .setOrigin(Origin.CLIENT)
      .setAppErrorCode(error.appErrorCode)
      .setTechnicalInfo(error.message);
  } else if (error instanceof InvalidTokenError) {
    errorResponseBuilder
      .setHttpStatus(StatusCodes.UNAUTHORIZED)
      .setOrigin(Origin.CLIENT)
      .setAppErrorCode(error.appErrorCode)
      .setTechnicalInfo(error.message);
  } else {
    errorResponseBuilder.setUnknownError(error);
  }
  return errorResponseBuilder.build();
};
