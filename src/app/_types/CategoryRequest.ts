import { z } from "zod";

// リクエストデータのバリデーションスキーマ
const requiredMsg = (field: string, type: string) =>
  `${type}型の値を持つフィールド '${field}' が存在しません。`;
const minMsg = (item: string, min: number) =>
  `フィールド '${item}' には${min}文字以上を設定してください。`;

const categoryRequestValidationSchema = z.object({
  name: z
    .string({ message: requiredMsg("name", "string") })
    .min(1, minMsg("name", 1)),
});

type CategoryRequestPayload = z.infer<typeof categoryRequestValidationSchema>;

class CategoryRequest {
  static validationSchema = categoryRequestValidationSchema;
}

namespace CategoryRequest {
  export type Payload = CategoryRequestPayload;
}

export default CategoryRequest;
