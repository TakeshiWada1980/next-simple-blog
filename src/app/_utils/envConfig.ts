import { urlPattern } from "@/app/_utils/common";

const validateURL = (url: string): string => {
  if (!urlPattern.test(url)) {
    throw new Error(`${url} is not a valid URL`);
  }
  return url;
};

// お問い合わせ内容を送信(POST)するAPIエンドポイント
export const contactApiEndpoint = validateURL(
  `${process.env.NEXT_PUBLIC_BUBE_API_ENDPOINT}/contacts`
);

// 開発環境かどうか
export const isDevelopmentEnv =
  process.env.NEXT_PUBLIC_IS_DEVELOPMENT_ENV === "true";

// API取得時の遅延時間（ミリ秒）
export const apiDelay = 0;

export const bucketName = "post_thumbnail";
