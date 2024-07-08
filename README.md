
## セットアップ手順

### リポジトリのクローン
GitHubからプロジェクトリポジトリをクローンします。

```bash
git git clone https://github.com/TakeshiWada1980/next-simple-blog.git hoge
cd hoge
```

### ディレクトリに移動
クローンしたディレクトリに移動します。

```bash
cd hoge
```

### 依存関係のインストール
プロジェクトの依存関係をインストールします。`package.json` に記載されている依存関係をすべてインストールします。

```bash
npm npm install
```

### Prismaのセットアップ
Prismaのクライアントを生成します。

```bash
npx prisma generate
```

### 開発サーバーの起動

```bash
npm run dev
```
