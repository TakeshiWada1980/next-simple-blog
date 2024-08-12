import { NextResponse, NextRequest } from "next/server";
import { ApiErrorResponse } from "@/app/_types/ApiResponse";
import SuccessResponseBuilder from "@/app/api/_helpers/successResponseBuilder";
import ErrorResponseBuilder from "@/app/api/_helpers/errorResponseBuilder";
import { cookies } from "next/headers";

// // Serverでクッキーをセットするサンプル
// [GET] /api/admin/lab/cookie/set
export const GET = async (req: NextRequest) => {
  const cookieStore = cookies();

  cookieStore.set("foo", "Sever2", {
    // httpOnly: true,
    // secure: process.env.NODE_ENV !== 'development',
    // sameSite: 'strict',
    maxAge: 24 * 60 * 60, // 24時間（秒単位）
    path: "/",
  });

  try {
    return NextResponse.json(new SuccessResponseBuilder(null).build());
  } catch (error) {
    const payload = createGetErrorResponse(error);
    return NextResponse.json(payload, { status: payload.httpStatus });
  }
};

// [GET]失敗時のレスポンスを生成
const createGetErrorResponse = (error: unknown): ApiErrorResponse => {
  const errorResponseBuilder = new ErrorResponseBuilder();
  errorResponseBuilder.setUnknownError(error);
  return errorResponseBuilder.build();
};
