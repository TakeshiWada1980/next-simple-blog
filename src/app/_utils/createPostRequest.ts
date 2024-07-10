import axios, { AxiosError, AxiosResponse } from "axios";
import { isDevelopmentEnv, apiDelay } from "@/app/_utils/envConfig";

const createPostRequest = <
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
    let res: AxiosResponse<Response, any> | null = null;
    try {
      res = await axios.post<Response>(url, data, options);
      res = res as AxiosResponse<Response, any>;
      // 開発環境では、動作検証のためにDelayを設定
      if (isDevelopmentEnv) {
        await new Promise((resolve) => setTimeout(resolve, apiDelay));
      }
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return error?.response?.data;
      }
      throw error;
    }
  };
};

export default createPostRequest;
