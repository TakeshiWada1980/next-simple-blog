import { z } from "zod";

export const validationSchema = z.object({
  email: z.string().email("メールアドレスの形式で入力してください。"),
  password: z.string().min(6, "6文字以上で入力してください。"),
});

export type LoginFormData = z.infer<typeof validationSchema>;
