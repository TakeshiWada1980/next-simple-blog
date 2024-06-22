"use client";

import React from "react";
import ArticleSummary from "@/components/ArticleSummary";
import FetchLoading from "@/elements/FetchLoading";
import FetchError from "@/elements/FetchError";
import usePosts from "@/hooks/usePosts";

const Articles = () => {
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
      {data?.posts.map((post) => (
        <ArticleSummary key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Articles;
