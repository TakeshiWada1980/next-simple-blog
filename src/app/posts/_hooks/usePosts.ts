import useSWR from "swr";
import GetPostsResponse from "../_types/GetPostsResponse";
import delayedGetFetcher from "@/app/_utils/delayedGetFetcher";
import {
  postsApiEndpoint,
  microCmsApiKey,
  apiDelay,
  isDevelopmentEnv,
} from "@/app/_utils/envConfig";

// ブログ記事【複数（配列）】を取得するためのカスタムフック
const usePosts = () => {
  const delay = isDevelopmentEnv ? apiDelay : 0;
  const { data, error, isLoading } = useSWR<GetPostsResponse>(
    postsApiEndpoint,
    delayedGetFetcher<GetPostsResponse>(delay, microCmsApiKey)
  );
  return { data, error, isLoading, endpoint: postsApiEndpoint };
};

export default usePosts;
