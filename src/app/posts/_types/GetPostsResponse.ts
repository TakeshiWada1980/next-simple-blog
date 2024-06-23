import MicroCmsPost from "@/app/_types/MicroCmsPost";

// ブログ記事（一覧）の取得APIのレスポンス
type GetPostsResponse = {
  contents: MicroCmsPost[];
  totalCount: number;
  offset: number;
  limit: number;
};

export default GetPostsResponse;
