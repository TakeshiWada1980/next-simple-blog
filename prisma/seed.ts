// prisma/dev.db の初期化、次のコマンドで実行
// npx ts-node prisma/seed.ts

const { PrismaClient } = require("@prisma/client");

// 変数名を prisma にすると、src/lib/prisma.ts の global.prisma と競合するので注意
const p = new PrismaClient();

const main = async () => {
  // 既存データの削除
  await p.postCategory?.deleteMany();
  await p.post?.deleteMany();
  await p.category?.deleteMany();

  // カテゴリデータの作成
  const cReact = await p.category.create({ data: { name: "React" } });
  const cNextJs = await p.category.create({ data: { name: "Next.js" } });
  const cCSharp = await p.category.create({ data: { name: "C#" } });
  const cAzure = await p.category.create({ data: { name: "Azure" } });

  // ブログ記事データの作成
  const post1 = await p.post.create({
    data: {
      title: "砂浜のノマドライフ",
      content:
        "今日は久しぶりに海岸でのんびり過ごした。<br>仕事を持ち出して、ビーチでノートパソコンを広げたけれど...",
      thumbnailUrl: "https://placehold.jp/800x400.png",
      categories: {
        create: [{ categoryId: cReact.id }, { categoryId: cNextJs.id }],
      },
    },
  });

  const post2 = await p.post.create({
    data: {
      title: "ピクニックバスケットとノートPC",
      content:
        "素敵な一日でした。<br>晴れた空の下、青々とした草原にシートを広げ今日は久しぶりに海岸でのんびり過ごした。<br>仕事を持ち出して、ビーチでノートパソコンを広げたけれど...",
      thumbnailUrl: "https://placehold.jp/800x400.png",
      categories: {
        create: [{ categoryId: cReact.id }],
      },
    },
  });

  const post3 = await p.post.create({
    data: {
      title: "没頭の代償",
      content:
        "雪原でPC作業に没頭していました。<br>夢中になりすぎて周りが見えなくなってしまいました。気づけばすっかり雪に埋もれ...",
      thumbnailUrl: "https://placehold.jp/800x400.png",
      categories: {
        create: [{ categoryId: cCSharp.id }, { categoryId: cAzure.id }],
      },
    },
  });

  console.log({ post1, post2, post3 });
};

main()
  .then(async () => {
    await p.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await p.$disconnect();
    process.exit(1);
  });
