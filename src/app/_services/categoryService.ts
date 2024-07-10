import { Category } from "@prisma/client";
import prisma from "@/lib/prisma";
import CategoryRequest from "@/app/_types/CategoryRequest";
import AppErrorCode from "@/app/_types/AppErrorCode";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// [カテゴリ]対象のビジネスロジックとDB関連の処理担当のサービスクラス
class CategoryService {
  // [GET] すべて取得
  public static async fetchAllCategories(): Promise<Category[]> {
    return await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  // [GET] すべて取得（投稿数付き）
  public static async fetchAllCategoriesWithPostCount(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      include: { posts: { select: { id: true } } },
    });
    const categoriesWithPostCount = categories
      .map((category) => {
        return {
          id: category.id,
          name: category.name,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
          postCount: category.posts.length,
        };
      })
      .sort((a, b) => b.postCount - a.postCount);
    await wait(3000);
    return categoriesWithPostCount;
  }

  // [POST] 新規作成
  public static async insertCategory(
    category: CategoryRequest.Payload
  ): Promise<Category> {
    const { name } = category;

    // 同じ名前を持ったカテゴリが既に DB に存在していないか確認
    if (await prisma.category.findUnique({ where: { name } })) {
      throw new this.AlreadyExistsError(name);
    }
    return await prisma.category.create({ data: { name } });
  }

  // [PUT] idを指定して更新
  public static async updateCategory(
    id: string,
    category: CategoryRequest.Payload
  ) {
    //
    const { name: newName } = category;

    // 更新操作対象のカテゴリが DB に存在しているか確認
    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingCategory) {
      throw new this.NotFoundError(id);
    }

    // 更新後の名前を持つカテゴリが既に DB に存在していないか確認
    const existingCategoryWithNewName = await prisma.category.findUnique({
      where: { name: newName },
    });
    if (existingCategoryWithNewName) {
      throw new this.AlreadyExistsError(newName);
    }

    // 更新
    return await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name: newName },
    });
  }

  // [DELETE] idを指定して削除
  public static async deleteCategory(id: string): Promise<Category> {
    // 削除操作対象のカテゴリが DB に存在しているか確認
    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingCategory) {
      throw new this.NotFoundError(id);
    }

    return await prisma.category.delete({
      where: { id: parseInt(id) },
    });
  }

  // カテゴリが既に存在している場合のエラー
  public static AlreadyExistsError = class extends Error {
    readonly appErrorCode: string = AppErrorCode.CATEGORY_ALREADY_EXISTS;
    constructor(categoryName: string) {
      super(`カテゴリ '${categoryName}' は既に DB に存在しています。`);
    }
  };

  // 更新対象のカテゴリが存在しない場合のエラー
  public static NotFoundError = class extends Error {
    readonly appErrorCode: string = AppErrorCode.CATEGORY_NOT_FOUND;
    constructor(categoryId: string) {
      super(`DB に id:${categoryId} のカテゴリが存在しません。`);
    }
  };
}

export default CategoryService;
