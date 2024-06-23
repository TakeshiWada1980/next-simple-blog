import { formatIso8601ToJpDateTime } from "@/app/_utils/dateTimeUtils";
import DOMPurify from "isomorphic-dompurify";
import Tag from "./elements/Tag";
import FetchLoading from "./elements/FetchLoading";
import FetchError from "./elements/FetchError";
import usePost from "@/app/_hooks/usePost";
import Image from "next/image";

type Props = {
  id: string;
};

const Article: React.FC<Props> = ({ id }) => {
  // usePostフックで指定のエンドポイントからデータを取得
  const { data, error, isLoading, endpoint } = usePost(id);

  // Fetch failed
  if (error) {
    return <FetchError apiEndpoint={endpoint} error={error} />;
  }

  // Fetch in progress
  if (isLoading || !data) {
    return <FetchLoading msg="記事を読み込んでいます..." />;
  }

  // Fetch succeeded
  const createdAt = formatIso8601ToJpDateTime(data.post.createdAt);
  const content: string = DOMPurify.sanitize(data.post.content);
  const { thumbnailUrl, categories, title } = data.post;
  return (
    <div className="mt-5 flex flex-col justify-center">
      {/* サムネイル */}
      <Image
        src={thumbnailUrl}
        alt="サムネイル画像"
        width={800}
        height={400}
        priority
      />
      {/* 日付 & カテゴリ*/}
      <div className="sm:px-4">
        {/* 日付 & カテゴリ*/}
        <div className="mt-3 flex justify-between items-center">
          <div className="text-xs text-stone-500">{createdAt}</div>
          <div className="flex items-center space-x-1">
            {categories.map((category) => (
              <Tag name={category} key={category} />
            ))}
          </div>
        </div>
        {/* タイトル */}
        <div className="mt-3 text-2xl">{title}</div>
        {/* 本文 */}
        <section
          className="mt-4"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default Article;
