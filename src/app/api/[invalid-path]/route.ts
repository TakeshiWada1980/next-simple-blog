import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import ErrorResponseBuilder from "@/app/api/_helpers/errorResponseBuilder";
import { StatusCodes } from "@/app/_utils/extendedStatusCodes";
import { Origin } from "@/app/_types/ApiResponse";
import AppErrorCode from "@/app/_types/AppErrorCode";

// 存在しないエンドポイントへのリクエストを処理する
// FIXME: /api/admin/hogehoge のような不正なパスは補足できない。
// 共通処理
const handleRequest = (req: NextRequest) => {
  const originalPath = req.nextUrl.pathname;
  const errorResponse = new ErrorResponseBuilder()
    .setHttpStatus(StatusCodes.NOT_FOUND)
    .setOrigin(Origin.CLIENT)
    .setAppErrorCode(AppErrorCode.ENDPOINT_NOT_FOUND)
    .setTechnicalInfo(
      `'${originalPath}' は有効なエンドポイントではありません。`
    )
    .build();
  return NextResponse.json(errorResponse, { status: errorResponse.httpStatus });
};

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;
export const OPTIONS = handleRequest;
