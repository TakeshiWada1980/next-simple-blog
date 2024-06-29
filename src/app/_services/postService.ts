import { Post } from "@prisma/client";
import prisma from "@/lib/prisma";
import AppErrorCode from "@/app/_types/AppErrorCode";
import PostRequest from "@/app/_types/PostRequest";

type Category = {
  id: number;
  name: string;
};

// [投稿]対象のビジネスロジックとDB関連の処理担当のサービスクラス
class PostService {
  // 投稿記事を取得する際にカテゴリーも取得するための「includeオプション」
  private static readonly CATEGORY_INCLUDE = {
    categories: {
      select: {
        category: {
          select: { id: true, name: true },
        },
      },
    },
  };

  // 投稿に関連づけるカテゴリの存在確認
  private static async checkCategoryExistence(categories: Category[]) {
    for (const category of categories) {
      const existingCategory = await prisma.category.findUnique({
        where: { id: category.id },
      });
      if (!existingCategory) {
        throw new this.CategoryNotFoundError(category.id);
      }
    }
  }

  // [GET] すべて取得
  public static async fetchAllPosts(): Promise<Post[]> {
    return await prisma.post.findMany({
      include: this.CATEGORY_INCLUDE,
      orderBy: { createdAt: "desc" },
    });
  }

  // [GET] idを指定して取得
  public static async fetchPostById(id: string): Promise<Post> {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: this.CATEGORY_INCLUDE,
    });
    if (!post) {
      throw new this.NotFoundError(id);
    }
    return post;
  }

  // [POST] 新規作成
  public static insertPostWithCategories = async (
    post: PostRequest.Payload
  ) => {
    const { title, content, thumbnailUrl, categories } = post;
    await this.checkCategoryExistence(categories);

    // Postテーブルに追加
    const data = await prisma.post.create({
      data: { title, content, thumbnailUrl },
    });

    // PostCategoryテーブルに挿入 (sqliteではcreateManyが使えない）
    for (const category of categories) {
      await prisma.categoriesOnPosts.create({
        data: { categoryId: category.id, postId: data.id },
      });
    }

    return data;
  };

  // [PUT] idを指定して更新
  public static async updatePost(id: string, post: PostRequest.Payload) {
    // 更新操作対象の投稿記事が DB に存在しているか確認
    const existingPost = await prisma.post.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingPost) {
      throw new this.NotFoundError(id);
    }

    // 更新
    const { title, content, thumbnailUrl, categories } = post;
    await this.checkCategoryExistence(categories);

    const data = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { title, content, thumbnailUrl },
    });

    await prisma.categoriesOnPosts.deleteMany({
      where: {
        postId: parseInt(id),
      },
    });

    // PostCategoryテーブルに挿入 (sqliteではcreateManyが使えない）
    for (const category of categories) {
      await prisma.categoriesOnPosts.create({
        data: { categoryId: category.id, postId: data.id },
      });
    }
    return data;
  }

  // [DELETE] idを指定して削除
  public static async deletePost(id: string): Promise<Post> {
    // 削除操作対象の記事が DB に存在しているか確認
    const existingPost = await prisma.post.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingPost) {
      throw new this.NotFoundError(id);
    }

    return await prisma.post.delete({
      where: { id: parseInt(id) },
    });
  }

  public static NotFoundError = class extends Error {
    readonly appErrorCode: string = AppErrorCode.POST_NOT_FOUND;
    constructor(postId: string) {
      super(`ID '${postId}' に該当する記事は存在しません。`);
    }
  };

  public static CategoryNotFoundError = class extends Error {
    readonly appErrorCode: string = AppErrorCode.CATEGORY_NOT_FOUND;
    constructor(categoryId: number) {
      super(
        `フィールド 'categories' で指定される id:${categoryId} に該当するカテゴリは DB に存在しません。`
      );
    }
  };
}

export default PostService;
