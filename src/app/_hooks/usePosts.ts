import useSWR from "swr";
import BlogPostsResponse from "@/app/_types/blogPostsResponse";
import delayedGetFetcher from "@/app/_utils/delayedGetFetcher";
import { isDevelopmentEnv, postsApiEndpoint } from "@/app/_utils/envConfig";

// ブログ記事【複数（配列）】を取得するためのカスタムフック
const usePosts = () => {
  const { data, error, isLoading } = useSWR<BlogPostsResponse>(
    postsApiEndpoint,
    delayedGetFetcher<BlogPostsResponse>(isDevelopmentEnv ? 1500 : 0) // 開発環境では動作確認のために遅延させる
  );
  return { data, error, isLoading, endpoint: postsApiEndpoint };
};

export default usePosts;
