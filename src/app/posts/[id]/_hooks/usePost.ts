import useSWR from "swr";
import GetPostResponse from "../_types/GetPostResponse";
import delayedGetFetcher from "@/app/_utils/delayedGetFetcher";
import {
  postsApiEndpoint,
  microCmsApiKey,
  apiDelay,
  isDevelopmentEnv,
} from "@/app/_utils/envConfig";

// ブログ記事【単体】を取得するためのカスタムフック
const usePost = (id: string) => {
  const delay = isDevelopmentEnv ? apiDelay : 0;

  const { data, error, isLoading } = useSWR<GetPostResponse>(
    `${postsApiEndpoint}/${id}`,
    delayedGetFetcher<GetPostResponse>(delay, microCmsApiKey)
  );
  return { data, error, isLoading, endpoint: postsApiEndpoint };
};

export default usePost;
