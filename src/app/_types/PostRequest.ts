import { z } from "zod";

type MsgType = "server" | "client";

const createValidationSchema = (t: MsgType) => {
  return z.object({
    title: z
      .string({ message: msgsMap.title.required[t] })
      .transform((v) => v.trim())
      .refine((val) => val.length >= 2, {
        message: msgsMap.title.min[t](2),
      }),
    content: z
      .string({ message: msgsMap.content.required[t] })
      .transform((v) => v.trim())
      .refine((val) => val.length >= 2, {
        message: msgsMap.content.min[t](2),
      }),
    thumbnailUrl: z
      .string({ message: msgsMap.thumbnailUrl.required[t] })
      .url(msgsMap.thumbnailUrl.url[t]),
    thumbnailImageKey: z
      .string({
        message: msgsMap.thumbnailImageKey.required[t],
      })
      .transform((v) => v.trim())
      .refine((val) => val.length >= 1, {
        message: msgsMap.thumbnailImageKey.min[t](1),
      }),
    categories: z
      .array(
        z.object({
          id: z
            .number({ message: msgsMap.categories.required[t] })
            .int(msgsMap.categories.required[t]),
          name: z.string(),
        })
      )
      .refine(
        (categories) => {
          const uniqueIds = new Set(categories.map((category) => category.id));
          return uniqueIds.size === categories.length;
        },
        { message: msgsMap.categories.duplication[t] }
      ),
  });
};

const msgsMap = {
  title: {
    required: {
      server: "'string型' の値を持つフィールド 'title' が存在しません。",
      client: "[NO DATA]",
    },
    min: {
      server: (n: number) =>
        `フィールド 'title' は、前後の空白文字を除いて ${n}文字以上 が必要です。`,
      client: (n: number) =>
        `必須入力項目です。前後の空白文字を除いて ${n}文字以上 を入力してください。`,
    },
  },
  content: {
    required: {
      server: "'string型' の値を持つフィールド 'content' が存在しません。",
      client: "[NO DATA]",
    },
    min: {
      server: (n: number) =>
        `フィールド 'content' は、前後の空白文字を除いて ${n}文字以上 が必要です。`,
      client: (n: number) =>
        `必須入力項目です。前後の空白文字を除いて ${n} 文字以上を入力してください。`,
    },
  },
  thumbnailUrl: {
    required: {
      server: "'string型' の値を持つフィールド 'thumbnailUrl' が存在しません。",
      client: "[NO DATA]",
    },
    url: {
      server: "フィールド 'thumbnailUrl' は、無効なURLです。",
      client: "必須入力項目です。有効なURLを入力してください。",
    },
  },
  thumbnailImageKey: {
    required: {
      server:
        "'string型' の値を持つフィールド 'thumbnailImageKey' が存在しません。",
      client: "必須入力項目です。有効なキーを入力してください。",
    },
    min: {
      server: (n: number) =>
        `フィールド 'thumbnailImageKey' は、必須入力項目です。`,
      client: (n: number) => `必須入力項目です。`,
    },
  },
  categories: {
    required: {
      server:
        "フィールド 'categories' の要素に 'int型' の値を持つフィールド 'id' が存在しません。",
      client: "[NO DATA]",
    },
    duplication: {
      server: "フィールド 'categories' に、'id' の重複する要素があります。",
      client: "[NO DATA]",
    },
  },
};

export const postRequestSeverValidationSchema = createValidationSchema(
  "server" as MsgType
);
export const postRequestClientValidationSchema = createValidationSchema(
  "client" as MsgType
);

type PostRequestPayload = z.infer<typeof postRequestSeverValidationSchema>;

class PostRequest {
  static serverValidationSchema = postRequestSeverValidationSchema;
  static clientValidationSchema = postRequestClientValidationSchema;
}

namespace PostRequest {
  export type Payload = PostRequestPayload;
}

export default PostRequest;
