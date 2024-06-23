import useSWR from "swr";
import GetPostResponse from "../_types/GetPostResponse";
import delayedGetFetcher from "@/app/_utils/delayedGetFetcher";
import {
  postsApiEndpoint,
  microCmsApiKey,
  apiDelay,
} from "@/app/_utils/envConfig";

// ブログ記事【単体】を取得するためのカスタムフック
const usePost = (id: string) => {
  const { data, error, isLoading } = useSWR<GetPostResponse>(
    `${postsApiEndpoint}/${id}`,
    delayedGetFetcher<GetPostResponse>(apiDelay, microCmsApiKey)
  );
  return { data, error, isLoading, endpoint: postsApiEndpoint };
};

export default usePost;
