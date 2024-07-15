import axios, { AxiosError, AxiosResponse } from "axios";
import { isDevelopmentEnv, apiDelay } from "@/app/_utils/envConfig";
import ApiRequestHeader from "@/app/_types/ApiRequestHeader";

export const createDeleteRequest = <Response>() => {
  return async (url: string, headers?: ApiRequestHeader): Promise<Response> => {
    const options = headers ? { headers } : {};
    //   const response = await axios.delete<Response>(url, options);
    //   // 開発環境では、動作検証のためにDelayを設定
    //   if (isDevelopmentEnv && apiDelay > 0) {
    //     await new Promise((resolve) => setTimeout(resolve, apiDelay));
    //   }
    //   return response.data;
    // };
    let res: AxiosResponse<Response, any> | null = null;
    try {
      res = await axios.delete<Response>(url, options);
      res = res as AxiosResponse<Response, any>;
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

export default createDeleteRequest;
