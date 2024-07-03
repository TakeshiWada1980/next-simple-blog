import axios from "axios";
import { isDevelopmentEnv, apiDelay } from "../_utils/envConfig";

export type WebApiHeaders = {
  Authorization: string;
};

export type Fetcher<RequestBody, Response, Headers> = (
  url: string,
  data: RequestBody,
  headers?: Headers
) => Promise<Response>;

export const delayedPutFetcher = <
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
    const response = await axios.put<Response>(url, data, options);
    // 開発環境では、動作検証のためにDelayを設定
    if (isDevelopmentEnv) {
      await new Promise((resolve) => setTimeout(resolve, apiDelay));
    }
    return response.data;
  };
};
