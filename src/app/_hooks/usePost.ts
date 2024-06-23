import useSWR from "swr";
import BlogPostResponse from "@/app/_types/blogPostResponse";
import delayedGetFetcher from "@/app/_utils/delayedGetFetcher";
import { isDevelopmentEnv, postsApiEndpoint } from "@/app/_utils/envConfig";

// ブログ記事【単体】を取得するためのカスタムフック
const usePost = (id: string) => {
  const { data, error, isLoading } = useSWR<BlogPostResponse>(
    `${postsApiEndpoint}/${id}`,
    delayedGetFetcher<BlogPostResponse>(isDevelopmentEnv ? 1000 : 0) // 開発環境では動作確認のために遅延させる
  );
  return { data, error, isLoading, endpoint: postsApiEndpoint };
};

export default usePost;
