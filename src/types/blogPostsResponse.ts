import Post from "@/types/post";

// ブログ記事（一覧）の取得APIのレスポンス
type BlogPostsResponse = {
  message: string;
  posts: Post[];
};

export default BlogPostsResponse;
