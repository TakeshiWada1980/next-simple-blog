import axios from "axios";
import { isDevelopmentEnv, apiDelay } from "@/app/_utils/envConfig";

export const createDeleteRequest = <
  Response,
  Headers extends Record<string, string> | undefined = undefined
>() => {
  return async (url: string, headers?: Headers): Promise<Response> => {
    const options = headers ? { headers } : {};
    const response = await axios.delete<Response>(url, options);
    // 開発環境では、動作検証のためにDelayを設定
    if (isDevelopmentEnv) {
      await new Promise((resolve) => setTimeout(resolve, apiDelay));
    }
    return response.data;
  };
};

export default createDeleteRequest;
