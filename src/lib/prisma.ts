import { PrismaClient } from "@prisma/client";

// 参考: これからはじめるReact実践入門 p.592
// グローバルオブジェクトに `prisma` プロパティを追加
declare global {
  var prisma: PrismaClient | undefined;
}

// `prisma` インスタンスを初期化
// const prisma = global.prisma ?? new PrismaClient({ log: ["query"] });
const prisma = global.prisma ?? new PrismaClient();

// 開発環境でのみ `global.prisma` に代入
if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export default prisma;
