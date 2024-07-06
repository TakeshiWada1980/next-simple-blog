"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useGetRequest from "@/app/_hooks/useGetRequest";
import FetchError from "@/app/_components/elements/FetchError";
import FetchLoading from "@/app/_components/elements/FetchLoading";
import composeApiErrorMessage from "@/app/_utils/composeApiErrorMsg";
import PostWithCategory from "@/app/admin/posts/_types/PostWithCategory";
import PostListItem from "@/app/admin/posts/_components/PostListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import PageWrapper from "@/app/_components/elements/PageWrapper";
import { ApiResponse } from "@/app/_types/ApiResponse";
import createDelayedDeleteRequest from "@/app/_utils/createDelayedDeleteRequest";
import { useSWRConfig } from "swr";

const deleteApiCaller = createDelayedDeleteRequest<ApiResponse<null>>();

const Page = () => {
  const url = "/api/admin/posts";
  const { data, error } = useGetRequest<PostWithCategory[]>(url);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const title = "記事一覧 (Admin)";
  const { mutate } = useSWRConfig();
  const router = useRouter();

  const handleDeleteAction = async ({ isDone }: { isDone: boolean }) => {
    if (isDone) {
      setUpdating(true);
      await mutate(url);
      setUpdating(false);
    }
  };

  if (error) {
    return (
      <PageWrapper pageTitle={title}>
        <FetchError apiEndpoint={url} message={composeApiErrorMessage(error)} />
      </PageWrapper>
    );
  }
  if (!data) {
    return (
      <PageWrapper pageTitle={title}>
        <FetchLoading msg="記事一覧を読み込んでいます..." />
      </PageWrapper>
    );
  }
  if (!data.data?.length) {
    return (
      <PageWrapper pageTitle={title}>
        <div>記事は0件です。</div>
      </PageWrapper>
    );
  }

  const newPostAction = () => {
    router.push("/admin/posts/new");
  };

  const posts = data.data;
  return (
    <PageWrapper pageTitle={title}>
      <div className="flex justify-end">
        <button
          className="flex items-center px-2 py-1 mb-1 md:px-3 border rounded-md tracking-wider text-white bg-blue-600"
          onClick={newPostAction}
        >
          <FontAwesomeIcon icon={faCirclePlus} className="mr-2" />
          新規作成
        </button>
      </div>
      <div className="mb-2 text-sm text-slate-500">
        {!updating ? (
          <div>記事を選択すると [編集画面] に移動します</div>
        ) : (
          <div>
            <FontAwesomeIcon
              icon={faSpinner}
              className="animate-spin animate-duration-[2000ms] mr-2"
            />
            記事一覧の更新中...
          </div>
        )}
      </div>
      <div>
        {posts.map((post) => (
          <PostListItem
            key={post.id}
            post={post}
            selectedPostId={selectedPostId}
            setSelectedPostId={setSelectedPostId}
            handleDeleteAction={handleDeleteAction}
            deleteApiCaller={deleteApiCaller}
          />
        ))}
      </div>
    </PageWrapper>
  );
};

export default Page;
