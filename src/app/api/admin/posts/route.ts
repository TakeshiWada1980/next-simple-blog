import { NextResponse, NextRequest } from "next/server";
import { Post } from "@prisma/client";
import {
  ApiSuccessResponse,
  ApiErrorResponse,
  AppErrorCode,
  Origin,
} from "@/app/_types/ApiResponse";
import { StatusCodes } from "@/app/_utils/extendedStatusCodes";
import SuccessResponseBuilder from "@/app/api/_helpers/successResponseBuilder";
import ErrorResponseBuilder from "@/app/api/_helpers/errorResponseBuilder";
import prisma from "@/lib/prisma";
import { GET as getPosts } from "@/app/api/posts/route";
import { z } from "zod";

// [GET] /api/admin/posts
// NOTE:現状で /apy/posts と同じ処理
export const GET = getPosts;

// [POST] /api/admin/posts
export const POST = async (req: NextRequest) => {
  try {
    const body: PostPayload = await req.json();

    // タイトルとサムネイルURLの前後の空白を削除
    body.title = body.title ? body.title.trim() : "";
    body.thumbnailUrl = body.thumbnailUrl ? body.thumbnailUrl.trim() : "";

    // バリデーションに問題があれば z.ZodError が Throw
    const validatedBody = postPayloadSchema.parse(body);

    // DB関連で問題があればエラーが Throw
    const insertedPost = await insertPostWithCategories(validatedBody);

    const payload = createSuccessResponse(insertedPost);
    return NextResponse.json(payload, { status: payload.httpStatus });
  } catch (error) {
    const payload = createErrorResponse(error);
    return NextResponse.json(payload, { status: payload.httpStatus });
  }
};

// DBに投稿データを挿入
const insertPostWithCategories = async (post: PostPayload) => {
  const { title, content, thumbnailUrl, categories } = post;

  // categories に含まれるIDのカテゴリは存在するかをチェック
  for (const category of categories) {
    const existingCategory = await prisma.category.findUnique({
      where: { id: category.id },
    });
    if (!existingCategory) {
      throw new CategoryNotFoundError(category.id, category.name);
    }
  }

  // Postテーブルに追加
  const data = await prisma.post.create({
    data: { title, content, thumbnailUrl },
  });

  // PostCategoryテーブルに挿入 (sqliteではcreateManyが使えない）
  for (const category of categories) {
    await prisma.postCategory.create({
      data: { categoryId: category.id, postId: data.id },
    });
  }

  return data;
};

//存在しないカテゴリIDが指定された場合のエラー
class CategoryNotFoundError extends Error {
  constructor(categoryId: number, categoryName: string) {
    super(
      `フィールド 'categories' で指定される id:${categoryId} に該当するカテゴリは DB に存在しません。`
    );
  }
}

// 成功時のレスポンスを生成
const createSuccessResponse = (post: Post): ApiSuccessResponse<Post> =>
  new SuccessResponseBuilder(post).setHttpStatus(StatusCodes.CREATED).build();

// 失敗時のレスポンスを生成
const createErrorResponse = (error: unknown): ApiErrorResponse => {
  const errorResponseBuilder = new ErrorResponseBuilder();
  if (error instanceof z.ZodError) {
    const msg =
      "POSTリクエストのデータ(JSON)において、" +
      error.errors.map((e) => e.message).join("");
    errorResponseBuilder
      .setHttpStatus(StatusCodes.BAD_REQUEST)
      .setOrigin(Origin.CLIENT)
      .setAppErrorCode(AppErrorCode.INVALID_POST_DATA)
      .setTechnicalInfo(msg);
  } else if (error instanceof CategoryNotFoundError) {
    errorResponseBuilder
      .setHttpStatus(StatusCodes.BAD_REQUEST)
      .setOrigin(Origin.CLIENT)
      .setAppErrorCode(AppErrorCode.INVALID_POST_DATA)
      .setTechnicalInfo(error.message);
  } else {
    errorResponseBuilder
      .setOrigin(Origin.SERVER)
      .setHttpStatus(StatusCodes.INTERNAL_SERVER_ERROR)
      .setAppErrorCode(AppErrorCode.UNKNOWN_ERROR)
      .setTechnicalInfo(error instanceof Error ? error.message : "");
  }
  return errorResponseBuilder.build();
};

// リクエストボディのバリデーションスキーマ
const requiredMsg = (field: string, type: string) =>
  `${type}型の値を持つフィールド '${field}' が存在しません。`;
const minMsg = (item: string, min: number) =>
  `フィールド '${item}' には${min}文字以上を設定してください。`;
const postPayloadSchema = z.object({
  title: z
    .string({ message: requiredMsg("title", "string") })
    .min(1, minMsg("title", 1)),
  content: z
    .string({ message: requiredMsg("content", "string") })
    .min(1, minMsg("content", 1)),
  thumbnailUrl: z
    .string({ message: requiredMsg("thumbnailUrl", "string") })
    .url("フィールド 'thumbnailUrl' は無効なURLです。"),
  categories: z
    .array(
      z.object({
        id: z
          .number({
            message:
              "フィールド 'categories' の要素に" + requiredMsg("id", "number"),
          })
          .int(
            "フィールド 'categories' の要素のフィールド 'id' は整数である必要があります。"
          ),
        name: z.string(),
      })
    )
    .refine(
      (categories) => {
        const uniqueIds = new Set(categories.map((category) => category.id));
        return uniqueIds.size === categories.length;
      },
      {
        message:
          "フィールド 'categories' の要素に、'id' が重複するものがあります。",
      }
    ),
});
type PostPayload = z.infer<typeof postPayloadSchema>;
