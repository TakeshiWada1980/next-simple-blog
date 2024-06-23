import axios from "axios";

/**
 * 遅延時間後にデータを返すFetcherを得る高階関数
 * @param delay 遅延時間（ミリ秒）
 * @returns (url: string, data: RequestBody) => Promise<Response>
 */
const delayedPostFetcher = <RequestBody, Response>(delay: number = 2000) => {
  return async (url: string, data: RequestBody): Promise<Response> => {
    const response = await axios.post<Response>(url, data);
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay)); // 遅延演出
    }
    return response.data;
  };
};

export default delayedPostFetcher;
