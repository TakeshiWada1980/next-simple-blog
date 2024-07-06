"use client";

import React from "react";
import PostSummary from "./PostSummary";
import FetchLoading from "@/app/_components/elements/FetchLoading";
import FetchError from "@/app/_components/elements/FetchError";
// import usePosts from "../_hooks/usePosts";

import useGetRequest from "@/app/_hooks/useGetRequest";
import PostWithCategory from "@/app/admin/posts/_types/PostWithCategory";
import { ApiResponse } from "@/app/_types/ApiResponse";
import composeApiErrorMessage from "@/app/_utils/composeApiErrorMsg";

const Posts = () => {
  // カスタムフック usePosts で記事一覧を取得
  // const { data, error, isLoading, endpoint } = usePosts();
  const url = "/api/admin/posts";
  const { data, error } = useGetRequest<PostWithCategory[]>(url);

  // Fetch failed
  if (error) {
    // return <FetchError apiEndpoint={endpoint} message={error.message} />;
    <FetchError apiEndpoint={url} message={composeApiErrorMessage(error)} />;
  }

  // Fetch in progress
  if (!data) {
    return <FetchLoading msg="記事一覧を読み込んでいます..." />;
  }

  if (!data.data?.length) {
    return <div>記事は0件です。</div>;
  }

  return (
    <div className="mt-5 flex flex-col justify-center ">
      {data.data?.map((content) => (
        <PostSummary key={content.id} post={content} />
      ))}
    </div>
  );
};

export default Posts;
