"use client";

import React from "react";
import PostSummary from "./PostSummary";
import FetchLoading from "@/app/_components/elements/FetchLoading";
import FetchError from "@/app/_components/elements/FetchError";
import usePosts from "../_hooks/usePosts";

const Posts = () => {
  // カスタムフック usePosts で記事一覧を取得
  const { data, error, isLoading, endpoint } = usePosts();

  // Fetch failed
  if (error) {
    return <FetchError apiEndpoint={endpoint} error={error} />;
  }

  // Fetch in progress
  if (isLoading || !data) {
    return <FetchLoading msg="記事一覧を読み込んでいます..." />;
  }

  return (
    <div className="mt-5 flex flex-col justify-center ">
      {data?.contents.map((content) => (
        <PostSummary key={content.id} post={content} />
      ))}
    </div>
  );
};

export default Posts;
