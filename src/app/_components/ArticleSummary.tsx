"use client";

import Link from "next/link";
import React from "react";
import Post from "@/app/_types/post";
import { formatIso8601ToJpDateTime } from "@/app/_utils/dateTimeUtils";
import DOMPurify from "isomorphic-dompurify";
import Tag from "@/app/_elements/Tag";

type Props = {
  post: Post;
};

const ArticleSummary: React.FC<Props> = (props) => {
  const { id, title, createdAt, categories, content } = props.post;

  const createdAt2 = formatIso8601ToJpDateTime(createdAt);
  const sanitizedContent: string = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ["br"],
  });

  return (
    <Link
      className="block mb-4 border border-stone-500 hover:border-stone-700"
      href={`/articles/${id}`}
    >
      <div className="p-3">
        <div className="flex justify-between items-center">
          {/* 日付 */}
          <div className="text-xs text-stone-500">{createdAt2}</div>
          {/* カテゴリ */}
          <div className="flex items-center space-x-1">
            {categories.map((category) => (
              <Tag name={category} key={category} />
            ))}
          </div>
        </div>
        {/* タイトル */}
        <div className="text-xl font-bold mb-3">{title}</div>
        {/* 本文 */}
        <div
          className="mx-3 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </div>
    </Link>
  );
};

export default ArticleSummary;
