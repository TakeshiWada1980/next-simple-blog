import axios, { AxiosError } from "axios";
import useSWR from "swr";
import { ApiErrorResponse, ApiResponse } from "../_types/ApiResponse";
import { isDevelopmentEnv, apiDelay } from "../_utils/envConfig";
import ApiRequestHeader from "@/app/_types/ApiRequestHeader";

const useGetRequest = <T>(endpoint: string, headers?: ApiRequestHeader) => {
  const fetcher = async (url: string) => {
    // const options = headers ? { headers } : {};
    const options = {
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    const res = await axios.get(url, options);
    // 開発環境では、動作検証のためにDelayを設定
    if (isDevelopmentEnv && apiDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, apiDelay));
    }
    return res.data;
  };
  return useSWR<ApiResponse<T>, AxiosError<ApiErrorResponse>>(
    endpoint,
    fetcher
  );
};

export default useGetRequest;
