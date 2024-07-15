import { supabase } from "@/utils/supabase";
import AppErrorCode from "@/app/_types/AppErrorCode";

export const validateAuthToken = async (token: string) => {
  const { error } = await supabase.auth.getUser(token);
  if (error) {
    throw new InvalidTokenError();
  }
};

export const InvalidTokenError = class extends Error {
  readonly appErrorCode: string = AppErrorCode.INVALID_TOKEN;
  constructor() {
    super(
      "リクエストヘッダの Authorization に不正なトークンが指定されています"
    );
  }
};
