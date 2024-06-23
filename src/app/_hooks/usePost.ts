import useSWR from "swr";
import BlogPostResponse from "@/app/_types/blogPostResponse";
import delayedGetFetcher from "@/app/_utils/delayedGetFetcher";
import {
  postsApiEndpoint,
  microCmsApiKey,
  apiDelay,
} from "@/app/_utils/envConfig";

// ブログ記事【単体】を取得するためのカスタムフック
const usePost = (id: string) => {
  const { data, error, isLoading } = useSWR<BlogPostResponse>(
    `${postsApiEndpoint}/${id}`,
    delayedGetFetcher<BlogPostResponse>(apiDelay, microCmsApiKey)
  );
  return { data, error, isLoading, endpoint: postsApiEndpoint };
};

export default usePost;
