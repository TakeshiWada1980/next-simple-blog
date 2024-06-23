"use client";

import React from "react";
import ArticleSummary from "@/app/_components/ArticleSummary";
import FetchLoading from "./elements/FetchLoading";
import FetchError from "./elements/FetchError";
import usePosts from "@/app/_hooks/usePosts";

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
      {data?.contents.map((content) => (
        <ArticleSummary key={content.id} post={content} />
      ))}
    </div>
  );
};

export default Articles;
