// MicroCMSのブログ記事データ型
type MicroCmsPost = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  categories: { id: string; name: string }[];
  thumbnail: { url: string; height: number; width: number };
};

export default MicroCmsPost;
