import { Post } from "@prisma/client";

interface Category {
  id: number;
  name: string;
}

type PostCategory = {
  category: Category;
};

interface PostWithCategory extends Post {
  categories: PostCategory[];
}

export default PostWithCategory;
