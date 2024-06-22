import { z } from "zod";

// お問い合わせフォームのバリデーションスキーマ(Zod)
const requiredMsg = "必須入力の項目です。";
const validationSchema = z.object({
  // 名前
  name: z
    .string()
    .min(1, requiredMsg)
    .max(30, "30文字以内で入力してください。"),
  // メールアドレス
  email: z
    .string()
    .min(1, requiredMsg)
    .email("メールアドレスの形式で入力してください。"),
  // 本文
  message: z
    .string()
    .min(1, requiredMsg)
    .max(500, "500文字以内で入力してください。"),
});

export default validationSchema;
