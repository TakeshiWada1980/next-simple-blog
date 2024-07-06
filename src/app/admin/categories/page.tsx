"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useGetRequest from "@/app/_hooks/useGetRequest";
import FetchError from "@/app/_components/elements/FetchError";
import FetchLoading from "@/app/_components/elements/FetchLoading";
import composeApiErrorMessage from "@/app/_utils/composeApiErrorMsg";
import CategoryWithPostCount from "../posts/_types/CategoryWithPostCount";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import PageWrapper from "@/app/_components/elements/PageWrapper";
import { ApiResponse } from "@/app/_types/ApiResponse";
import createDelayedDeleteRequest from "@/app/_utils/createDelayedDeleteRequest";
import { useSWRConfig } from "swr";
import CategoryListItem from "./_components/CategoryListItem";

const deleteApiCaller = createDelayedDeleteRequest<ApiResponse<null>>();

const page = () => {
  const url = "/api/admin/categories?sort=postcount";
  const { data, error } = useGetRequest<CategoryWithPostCount[]>(url);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [updating, setUpdating] = useState<boolean>(false);
  const pageTitle = "カテゴリ一覧";
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
      <PageWrapper pageTitle={pageTitle}>
        <FetchError apiEndpoint={url} message={composeApiErrorMessage(error)} />
      </PageWrapper>
    );
  }
  if (!data) {
    return (
      <PageWrapper pageTitle={pageTitle}>
        <FetchLoading msg="カテゴリの一覧を読み込んでいます..." />
      </PageWrapper>
    );
  }
  if (!data.data?.length) {
    return (
      <PageWrapper pageTitle={pageTitle}>
        <div>カテゴリが存在しません。カテゴリを新規作成してください。</div>
      </PageWrapper>
    );
  }

  const newPostAction = () => {
    router.push("/admin/posts/new");
  };

  const categories = data.data;
  return (
    <PageWrapper pageTitle={pageTitle}>
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
          <div>カテゴリを選択すると [名前の変更画面] に移動します</div>
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
        {categories.map((category) => (
          <CategoryListItem
            key={category.id}
            category={category}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
            handleDeleteAction={handleDeleteAction}
            deleteApiCaller={deleteApiCaller}
          />
        ))}
      </div>
    </PageWrapper>
  );
};

export default page;
