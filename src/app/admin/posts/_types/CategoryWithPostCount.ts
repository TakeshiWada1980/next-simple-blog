import { Category } from "@prisma/client";

interface PostCount {
  postCount: number;
}

interface CategoryWithPostCount extends Category, PostCount {}

export default CategoryWithPostCount;
