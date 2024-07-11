"use client";

import React from "react";
import useGetRequest from "@/app/_hooks/useGetRequest";
import PostWithCategory from "@/app/admin/posts/_types/PostWithCategory";
import composeApiErrorMessage from "@/app/_utils/composeApiErrorMsg";
import PostSummary from "./PostSummary";
import FetchLoading from "@/app/_components/elements/FetchLoading";
import FetchError from "@/app/_components/elements/FetchError";

const Posts = () => {
  const url = "/api/admin/posts";
  const { data, error } = useGetRequest<PostWithCategory[]>(url);

  // Fetch failed
  if (error) {
    <FetchError apiEndpoint={url} message={composeApiErrorMessage(error)} />;
  }

  // Fetch in progress
  if (!data) {
    return <FetchLoading msg="記事一覧を読み込んでいます..." />;
  }

  if (!data.data?.length) {
    return <div>記事は0件です。</div>;
  }

  const posts = data.data as NonNullable<PostWithCategory[]>;

  return (
    <div className="mt-5 flex flex-col justify-center ">
      {posts.map((post) => (
        <PostSummary key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
