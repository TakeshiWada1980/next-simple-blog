import useSWR from "swr";
import GetPostsResponse from "../_types/GetPostsResponse";
import delayedGetFetcher from "@/app/_utils/delayedGetFetcher";
import {
  postsApiEndpoint,
  microCmsApiKey,
  apiDelay,
} from "@/app/_utils/envConfig";

// ブログ記事【複数（配列）】を取得するためのカスタムフック
const usePosts = () => {
  const { data, error, isLoading } = useSWR<GetPostsResponse>(
    postsApiEndpoint,
    delayedGetFetcher<GetPostsResponse>(apiDelay, microCmsApiKey)
  );
  return { data, error, isLoading, endpoint: postsApiEndpoint };
};

export default usePosts;
