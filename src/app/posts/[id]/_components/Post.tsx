"use client";

import React, { useEffect, useState, useCallback } from "react";
import { format, set } from "date-fns";
import DOMPurify from "isomorphic-dompurify";

import Image from "next/image";
import CategoryTag from "@/app/posts/_components/CategoryTag";
import FetchError from "@/app/_components/elements/FetchError";
import FetchLoading from "@/app/_components/elements/FetchLoading";

import useGetRequest from "@/app/_hooks/useGetRequest";
import PostWithCategory from "@/app/admin/posts/_types/PostWithCategory";
import composeApiErrorMessage from "@/app/_utils/composeApiErrorMsg";
import { supabase } from "@/utils/supabase";
import { bucketName } from "@/app/_utils/envConfig";

const Post: React.FC<{ id: string }> = ({ id }) => {
  const url = `/api/admin/posts/${id}`;
  const { data, error } = useGetRequest<PostWithCategory>(url);
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string>("");
  // const [thumbnailImageKey, setThumbnailImageKey] = useState<string>("");

  const fetchThumbnailUrl = useCallback(async (imageKey: string) => {
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(imageKey);
    setThumbnailImageUrl(publicUrl);
  }, []);

  useEffect(() => {
    if (data?.data?.thumbnailImageKey) {
      fetchThumbnailUrl(data.data.thumbnailImageKey);
    }
  }, [data, fetchThumbnailUrl]);

  if (error) {
    return (
      <FetchError apiEndpoint={url} message={composeApiErrorMessage(error)} />
    );
  }

  if (!data) {
    return <FetchLoading msg="記事を読み込んでいます..." />;
  }

  // Fetch succeeded
  const post = data.data as NonNullable<PostWithCategory>;
  const createdAt = format(post.createdAt, "yyyy/MM/dd HH:mm");
  const content = DOMPurify.sanitize(post.content, { ALLOWED_TAGS: ["br"] });
  const categories = post.categories.map((c) => c.category.name);
  const title = post.title;

  return (
    <div className="mt-5 flex flex-col justify-center">
      {/* サムネイル画像 */}
      <div className="flex justify-center items-center">
        {thumbnailImageUrl && (
          <Image
            className="rounded-lg border border-slate-300"
            src={thumbnailImageUrl}
            alt="サムネイル画像"
            width={800}
            height={400}
            priority
          />
        )}
      </div>
      <div className="sm:px-4">
        {/* 日付 & カテゴリ*/}
        <div className="mt-3 flex justify-between items-center">
          <div className="text-xs text-stone-500">{createdAt}</div>
          <div className="flex items-center space-x-1">
            {categories.map((category) => (
              <CategoryTag name={category} key={category} />
            ))}
          </div>
        </div>
        {/* タイトル */}
        <div className="mt-3 text-2xl font-bold">{title}</div>
        {/* 本文 */}
        <section
          className="mt-4"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default Post;
