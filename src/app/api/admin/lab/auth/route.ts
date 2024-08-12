import { NextResponse, NextRequest } from "next/server";
import { ApiErrorResponse, Origin } from "@/app/_types/ApiResponse";
import { StatusCodes } from "@/app/_utils/extendedStatusCodes";
import SuccessResponseBuilder from "@/app/api/_helpers/successResponseBuilder";
import ErrorResponseBuilder from "@/app/api/_helpers/errorResponseBuilder";
import { InvalidTokenError } from "@/app/api/_helpers/validateAuthToken";

import { supabase } from "@/utils/supabase";
import { assert } from "console";

const email = "takeshi.wada@live.jp";
const password = "dummy=202407=D";

// ■ Case1
const case1 = async () => {
  await supabase.auth.signOut();
  await supabase.auth.signInWithPassword({ email, password });
  const { data } = await supabase.auth.getSession();
  const jwt1 = data.session?.access_token;

  await new Promise((resolve) => setTimeout(resolve, 1000)); // 少し待つ

  // トークンを使ってユーザ情報を取得
  const res = await supabase.auth.getUser(jwt1);
  if (res.error) {
    throw new Error("Invalid token");
  }
};

// ■ Case2
const case2 = async () => {
  await supabase.auth.signOut();
  await supabase.auth.signInWithPassword({ email, password });
  const jwt1 = (await supabase.auth.getSession()).data.session?.access_token;
  // await supabase.auth.signOut();

  await new Promise((resolve) => setTimeout(resolve, 1000));
  await supabase.auth.signInWithPassword({ email, password });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await supabase.auth.signInWithPassword({ email, password });

  const jwt2 = (await supabase.auth.getSession()).data.session?.access_token;

  // トークンを使ってユーザ情報を取得
  const res = await supabase.auth.getUser(jwt1);
  if (res.error) {
    throw new Error("Invalid token");
  }
};

// [GET] /api/admin/lab/auth
export const GET = async (req: NextRequest) => {
  try {
    // await case1();
    await case2();
    return NextResponse.json(new SuccessResponseBuilder(null).build());
  } catch (error) {
    const payload = createGetErrorResponse(error);
    return NextResponse.json(payload, { status: payload.httpStatus });
  }
};

// [GET]失敗時のレスポンスを生成
const createGetErrorResponse = (error: unknown): ApiErrorResponse => {
  const errorResponseBuilder = new ErrorResponseBuilder();
  if (error instanceof InvalidTokenError) {
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
