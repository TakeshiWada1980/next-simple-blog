"use client";

import Link from "next/link";
import React from "react";
import { format } from "date-fns";
import DOMPurify from "isomorphic-dompurify";
import CategoryTag from "@/app/posts/_components/CategoryTag";
import PostWithCategory from "@/app/admin/posts/_types/PostWithCategory";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";

type Props = {
  post: PostWithCategory;
};

const PostSummary: React.FC<Props> = (props) => {
  const { id, title, createdAt, categories, content } = props.post;

  const sanitizedContent: string = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ["br"],
  });

  return (
    <Link
      className="block mb-3 border border-slate-400 hover:border-slate-700"
      href={`/posts/${id}`}
    >
      <div className="p-3">
        <div className="flex justify-between items-center">
          {/* 日付 */}
          <div className="text-sm text-slate-500 mr-2">
            <FontAwesomeIcon icon={faCalendarDays} className="mr-1" />

            {format(createdAt, "yyyy/MM/dd HH:mm")}
          </div>
          {/* カテゴリ */}
          <div className="flex flex-wrap gap-1 items-center">
            {categories.map((c) => (
              <CategoryTag name={c.category.name} key={c.category.id} />
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

export default PostSummary;
