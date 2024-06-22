import useSWR from "swr";
import BlogPostsResponse from "@/types/blogPostsResponse";
import delayedGetFetcher from "@/utils/delayedGetFetcher";
import { isDevelopmentEnv, postsApiEndpoint } from "@/utils/envConfig";

// ブログ記事【複数（配列）】を取得するためのカスタムフック
const usePosts = () => {
  const { data, error, isLoading } = useSWR<BlogPostsResponse>(
    postsApiEndpoint,
    delayedGetFetcher<BlogPostsResponse>(isDevelopmentEnv ? 1500 : 0) // 開発環境では動作確認のために遅延させる
  );
  return { data, error, isLoading, endpoint: postsApiEndpoint };
};

export default usePosts;
