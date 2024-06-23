import MicroCmsPost from "@/app/_types/microCmsPost";

// ブログ記事（一覧）の取得APIのレスポンス
type BlogPostsResponse = {
  contents: MicroCmsPost[];
  totalCount: number;
  offset: number;
  limit: number;
};

export default BlogPostsResponse;
