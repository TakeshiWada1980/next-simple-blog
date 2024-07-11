import axios, { AxiosError } from "axios";
import useSWR from "swr";
import { ApiErrorResponse, ApiResponse } from "../_types/ApiResponse";
import { isDevelopmentEnv, apiDelay } from "../_utils/envConfig";

type Headers = {
  Authorization?: string;
};

const useGetRequest = <T>(endpoint: string, headers?: Headers) => {
  const fetcher = async (url: string) => {
    const res = await axios.get(url, {
      headers: {
        Authorization: headers?.Authorization,
      },
    });
    // 開発環境では、動作検証のためにDelayを設定
    if (isDevelopmentEnv) {
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
