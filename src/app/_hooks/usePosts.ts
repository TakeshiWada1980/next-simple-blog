import useSWR from "swr";
import BlogPostsResponse from "@/app/_types/blogPostsResponse";
import delayedGetFetcher from "@/app/_utils/delayedGetFetcher";
import {
  postsApiEndpoint,
  microCmsApiKey,
  apiDelay,
} from "@/app/_utils/envConfig";

// ブログ記事【複数（配列）】を取得するためのカスタムフック
const usePosts = () => {
  const { data, error, isLoading } = useSWR<BlogPostsResponse>(
    postsApiEndpoint,
    delayedGetFetcher<BlogPostsResponse>(apiDelay, microCmsApiKey)
  );
  return { data, error, isLoading, endpoint: postsApiEndpoint };
};

export default usePosts;
