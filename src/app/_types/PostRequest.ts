import { z } from "zod";

// リクエストボディのバリデーションスキーマ
const requiredMsg = (field: string, type: string) =>
  `${type}型の値を持つフィールド '${field}' が存在しません。`;
const minMsg = (item: string, min: number) =>
  `フィールド '${item}' には${min}文字以上を設定してください。..`;

export const postRequestValidationSchema = z.object({
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

type PostRequestPayload = z.infer<typeof postRequestValidationSchema>;

class PostRequest {
  static validationSchema = postRequestValidationSchema;
}

namespace PostRequest {
  export type Payload = PostRequestPayload;
}

export default PostRequest;
