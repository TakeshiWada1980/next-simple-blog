import { NextResponse, NextRequest } from "next/server";
import { ApiErrorResponse, Origin } from "@/app/_types/ApiResponse";
import SuccessResponseBuilder from "@/app/api/_helpers/successResponseBuilder";
import ErrorResponseBuilder from "@/app/api/_helpers/errorResponseBuilder";
import { cookies } from "next/headers";

// Serverでクッキーをチェックするサンプル
// [GET] /api/admin/lab/cookie/check
export const GET = async (req: NextRequest) => {
  const cookieStore = cookies();
  const fooCookie = cookieStore.get("foo");
  const payload = { cookie: fooCookie ? fooCookie.value : "Cookie not found" };
  console.log("■■ " + payload.cookie);
  try {
    return NextResponse.json(new SuccessResponseBuilder(payload).build());
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
