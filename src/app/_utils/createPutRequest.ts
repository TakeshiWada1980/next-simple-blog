import axios, { AxiosError, AxiosResponse } from "axios";
import { isDevelopmentEnv, apiDelay } from "@/app/_utils/envConfig";
import ApiRequestHeader from "@/app/_types/ApiRequestHeader";

const createPutRequest = <RequestBody, Response>() => {
  return async (
    url: string,
    data: RequestBody,
    headers?: ApiRequestHeader
  ): Promise<Response> => {
    const options = headers ? { headers } : {};
    let res: AxiosResponse<Response, any> | null = null;
    try {
      res = await axios.put<Response>(url, data, options);
      res = res as AxiosResponse<Response, any>;
      // 開発環境では、動作検証のためにDelayを設定
      if (isDevelopmentEnv && apiDelay > 0) {
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

export default createPutRequest;
