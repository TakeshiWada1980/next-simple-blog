import axios from "axios";
import { isDevelopmentEnv, apiDelay } from "../_utils/envConfig";

// 「お問い合わせ」用。今後破棄予定

export type WebApiHeaders = {
  Authorization: string;
};

export const delayedPostFetcher = <
  RequestBody,
  Response,
  Headers extends Record<string, string> | undefined = undefined
>() => {
  return async (
    url: string,
    data: RequestBody,
    headers?: Headers
  ): Promise<Response> => {
    const options = headers ? { headers } : {};
    const response = await axios.post<Response>(url, data, options);
    // 開発環境では、動作検証のためにDelayを設定
    if (isDevelopmentEnv) {
      await new Promise((resolve) => setTimeout(resolve, apiDelay));
    }
    return response.data;
  };
};
