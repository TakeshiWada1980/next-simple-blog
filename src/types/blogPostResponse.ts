import Post from "@/types/post";

// ブログ記事（単体）の取得APIのレスポンス
type BlogPostResponse = {
  message: string;
  post: Post;
};

export default BlogPostResponse;
