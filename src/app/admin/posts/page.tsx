"use client";

import PageTitleHeader from "@/app/_components/elements/PageTitleHeader";
import React, { useState } from "react";
import useGetRequest from "@/app/_hooks/useGetRequest";
import FetchError from "@/app/_components/elements/FetchError";
import FetchLoading from "@/app/_components/elements/FetchLoading";
import composeApiErrorMessage from "@/app/_utils/composeApiErrorMsg";
import PostWithCategory from "@/app/admin/posts/_types/PostWithCategory";
import PostListItem from "@/app/admin/posts/_components/PostListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import PageWrapper from "@/app/_components/elements/PageWrapper";

const Page = () => {
  const url = "/api/admin/posts";
  const { data, error } = useGetRequest<PostWithCategory[]>(url);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const title = "記事一覧 (Admin)";

  if (error) {
    return (
      <PageWrapper title={title}>
        <FetchError apiEndpoint={url} message={composeApiErrorMessage(error)} />
      </PageWrapper>
    );
  }
  if (!data) {
    return (
      <PageWrapper title={title}>
        <FetchLoading msg="記事一覧を読み込んでいます..." />
      </PageWrapper>
    );
  }
  if (!data.data?.length) {
    return (
      <PageWrapper title={title}>
        <div>記事は0件です。</div>;
      </PageWrapper>
    );
  }
  const posts = data.data;
  return (
    <PageWrapper title={title}>
      <div className="flex justify-end">
        <button className="flex items-center px-3 py-1 border rounded-md tracking-wider text-white bg-blue-600">
          <FontAwesomeIcon icon={faCirclePlus} className="mr-2" />
          新規作成
        </button>
      </div>
      <div className="mb-2 text-sm text-slate-500">
        記事を選択すると編集画面に移動します。
      </div>
      <div>
        {posts.map((post) => (
          <PostListItem
            key={post.id}
            post={post}
            selectedPostId={selectedPostId}
            setSelectedPostId={setSelectedPostId}
          />
        ))}
      </div>
    </PageWrapper>
  );
};

export default Page;
