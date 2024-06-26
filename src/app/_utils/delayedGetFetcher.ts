import axios from "axios";

/**
 * 遅延時間後にデータを返すFetcherを得る高階関数
 * @param number
 * @returns (url: string) => Promise<Response>
 */
const delayedGetFetcher = <Response>(
  delay: number = 0,
  apiKey: string = ""
) => {
  return async (url: string): Promise<Response> => {
    const { data } = await axios.get(url, {
      headers: {
        "X-MICROCMS-API-KEY": apiKey,
      },
    });
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay)); // 遅延演出
    }
    return data;
  };
};

export default delayedGetFetcher;
