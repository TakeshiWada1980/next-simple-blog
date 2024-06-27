// HttpStatusCodeの正引きと逆引きを行うためのユーティリティ
import { StatusCodes, getReasonPhrase } from "http-status-codes";

type StatusPhrases = {
  [key in keyof typeof StatusCodes]: string;
};

// StatusPhrasesオブジェクトを作成
const StatusPhrases: StatusPhrases = Object.keys(StatusCodes)
  .filter(
    (key) => typeof StatusCodes[key as keyof typeof StatusCodes] === "number"
  )
  .reduce((acc, key) => {
    const code = StatusCodes[key as keyof typeof StatusCodes] as number;
    // @ts-ignore: next-line
    acc[key as keyof typeof StatusCodes] = getReasonPhrase(code);
    return acc;
  }, {} as StatusPhrases);

export { StatusCodes, StatusPhrases };
