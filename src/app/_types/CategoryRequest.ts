import { z } from "zod";

type MsgType = "server" | "client";

const createValidationSchema = (t: MsgType) => {
  return z.object({
    name: z
      .string({ message: msgsMap.name.required[t] })
      .transform((v) => v.trim())
      .refine((val) => val.length >= 1, {
        message: msgsMap.name.min[t](1),
      }),
  });
};

const msgsMap = {
  name: {
    required: {
      server: "'string型' の値を持つフィールド 'name' が存在しません。",
      client: "[NO DATA]",
    },
    min: {
      server: (n: number) =>
        `フィールド 'name' は、前後の空白文字を除いて ${n}文字以上 が必要です。`,
      client: (n: number) =>
        `必須入力項目です。前後の空白文字を除いて ${n}文字以上 を入力してください。`,
    },
  },
};

export const categoryRequestSeverValidationSchema = createValidationSchema(
  "server" as MsgType
);
export const categoryRequestClientValidationSchema = createValidationSchema(
  "client" as MsgType
);

type CategoryRequestPayload = z.infer<
  typeof categoryRequestSeverValidationSchema
>;

class CategoryRequest {
  static serverValidationSchema = categoryRequestSeverValidationSchema;
  static clientValidationSchema = categoryRequestClientValidationSchema;
}

namespace CategoryRequest {
  export type Payload = CategoryRequestPayload;
}

export default CategoryRequest;
