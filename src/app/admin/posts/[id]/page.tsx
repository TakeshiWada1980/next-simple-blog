"use client";

import React, { useEffect, useState } from "react";
import useGetRequest from "@/app/_hooks/useGetRequest";
import FetchError from "@/app/_components/elements/FetchError";
import FetchLoading from "@/app/_components/elements/FetchLoading";
import composeApiErrorMessage from "@/app/_utils/composeApiErrorMsg";
import PostWithCategory from "@/app/admin/posts/_types/PostWithCategory";
import CategoryWithPostCount from "@/app/admin/posts/_types/CategoryWithPostCount";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PostRequest from "@/app/_types/PostRequest";
import cn from "classnames";
import ErrorMessage from "@/app/_components/elements/ErrorMessage";
import PageWrapper from "@/app/_components/elements/PageWrapper";
import { ApiResponse } from "@/app/_types/ApiResponse";
import {
  delayedPutFetcher,
  WebApiHeaders,
  Fetcher,
} from "@/app/_utils/delayedPutFetcher";
import CategoryToggleButton from "../_components/CategoryToggleButton";
import ClearButton from "../_components/ClearButton";
import SubmitButton from "../_components/SubmitButton";
import { set } from "date-fns";

type Params = {
  id: string;
};

// スタイル設定
const styles = {
  // label要素、input要素、validateMsg(p)要素のコンテナ
  container: "flex mt-6 flex-col md:flex-row w-full",

  // labelのスタイル
  label: "w-full md:w-2/12 md:mt-3 mb-2 font-bold",

  // input要素とvalidateMsg(p)要素のコンテナ
  subContainer: "w-full md:w-10/12",

  // テキストボックスとテキストエリアのスタイル
  input:
    "w-full px-3 py-3 border rounded-md duration-200 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent",

  // テキストボックスとテキストエリアののスタイル（無効時）
  disabledInput: "hover:cursor-not-allowed bg-gray-100",

  // 検証エラー表示用のスタイル pタグに適用
  validationMessage: "text-red-500 text-sm mt-1",
};

const putFetcher: Fetcher<
  PostRequest.Payload,
  ApiResponse<PostRequest.Payload>,
  WebApiHeaders
> = delayedPutFetcher<
  PostRequest.Payload,
  ApiResponse<PostRequest.Payload>,
  WebApiHeaders
>();

const page: React.FC<{ params: Params }> = ({ params }) => {
  const postApiEndpoint = `/api/admin/posts/${params.id}`;
  const categoriesApiEndpoint = `/api/admin/categories?sort=postcount`;

  // prettier-ignore
  const { data: categoriesData, error: categoriesGetError } = 
    useGetRequest<CategoryWithPostCount[]>(categoriesApiEndpoint);
  const { data: postData, error: postGetError } =
    useGetRequest<PostWithCategory>(postApiEndpoint);

  const title = "記事の編集";

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [categoryPostCounts, setCategoryPostCounts] = useState<
    { id: number; postCount: number }[]
  >([]);

  const {
    reset,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostRequest.Payload>({
    mode: "onChange",
    resolver: zodResolver(PostRequest.clientValidationSchema),
  });

  useEffect(() => {
    if (postData) {
      const post = postData.data;
      reset({
        title: post?.title,
        content: post?.content,
        thumbnailUrl: post?.thumbnailUrl,
        categories: post?.categories.map((c) => c.category),
      });
      setSelectedCategoryIds(post?.categories.map((c) => c.category.id) || []);
    }
    if (categoriesData) {
      if (categoriesData.data) {
        setCategoryPostCounts(
          categoriesData.data.map((c) => ({
            id: c.id,
            postCount: c.postCount,
          }))
        );
      }
    }
  }, [postData, categoriesData, reset]);

  const handleReset = () => {
    reset();
    setSelectedCategoryIds(
      postData?.data?.categories.map((c) => c.category.id) || []
    );
  };

  if (postGetError || categoriesGetError) {
    const error = postGetError || categoriesGetError;
    if (error) {
      return (
        <PageWrapper title={title}>
          <FetchError
            apiEndpoint={postApiEndpoint}
            message={composeApiErrorMessage(error)}
          />
        </PageWrapper>
      );
    }
  }
  if (!postData || !categoriesData) {
    return (
      <PageWrapper title={title}>
        <FetchLoading msg="記事一覧を読み込んでいます..." />
      </PageWrapper>
    );
  }

  const onSubmit = async (data: PostRequest.Payload) => {
    console.log("■" + JSON.stringify(data));
    try {
      const headers = { Authorization: "token-token" };
      const res = await putFetcher(postApiEndpoint, data, headers);
      console.log("■" + JSON.stringify(res));
    } catch (error) {
      alert(`フォーム送信失敗\n${error}`);
    }
  };

  const toggleCategorySelection = (categoryId: number) => {
    let newSelectedCategories: number[] = [];
    if (selectedCategoryIds.includes(categoryId)) {
      newSelectedCategories = selectedCategoryIds.filter(
        (c) => c !== categoryId
      );
      setCategoryPostCounts(
        categoryPostCounts.map((c) => {
          if (c.id === categoryId) {
            return { id: c.id, postCount: c.postCount - 1 };
          }
          return c;
        })
      );
    } else {
      newSelectedCategories = [...selectedCategoryIds, categoryId];
      setCategoryPostCounts(
        categoryPostCounts.map((c) => {
          if (c.id === categoryId) {
            return { id: c.id, postCount: c.postCount + 1 };
          }
          return c;
        })
      );
    }
    setSelectedCategoryIds(newSelectedCategories);
    setValue(
      "categories",
      newSelectedCategories.map((c) => ({ id: c, name: "" }))
    );
  };

  return (
    <PageWrapper title={title}>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        {/* タイトル */}
        <div className={styles.container}>
          <label htmlFor="title" className={styles.label}>
            タイトル
          </label>
          <div className={styles.subContainer}>
            <input
              {...register("title")}
              id="title"
              type="text"
              className={cn(styles.input, isSubmitting && styles.disabledInput)}
              placeholder="タイトルを入力してください。"
              disabled={isSubmitting}
            />
            <ErrorMessage message={errors.title?.message} />
          </div>
        </div>

        {/* 本文 */}
        <div className={styles.container}>
          <label htmlFor="content" className={styles.label}>
            本文
          </label>
          <div className={styles.subContainer}>
            <textarea
              {...register("content")}
              id="content"
              className={cn(styles.input, isSubmitting && styles.disabledInput)}
              rows={6}
              placeholder="本文を入力してください。"
              disabled={isSubmitting}
            />
            <ErrorMessage message={errors.content?.message} />
          </div>
        </div>

        {/* 画像 */}
        <div className={styles.container}>
          <label htmlFor="thumbnailUrl" className={styles.label}>
            画像URL
          </label>
          <div className={styles.subContainer}>
            <input
              {...register("thumbnailUrl")}
              id="thumbnailUrl"
              type="text"
              className={cn(styles.input, isSubmitting && styles.disabledInput)}
              placeholder="画像のURLを入力してください。"
              disabled={isSubmitting}
            />
            <ErrorMessage message={errors.thumbnailUrl?.message} />
          </div>
        </div>

        {/* カテゴリ */}
        <div className={styles.container}>
          <label htmlFor="categories" className={styles.label}>
            カテゴリ
          </label>
          <div className={styles.subContainer}>
            <div className="ml-2 flex flex-wrap md:mt-3">
              {categoriesData.data?.map((c) => (
                <CategoryToggleButton
                  key={c.id}
                  category={c}
                  selectedCategoryIds={selectedCategoryIds}
                  categoryPostCounts={categoryPostCounts}
                  toggleCategorySelection={toggleCategorySelection}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 送信ボタン と 編集を元に戻すボタン */}
        <div className="mt-8 flex justify-center space-x-4">
          <SubmitButton isSubmitting={isSubmitting} />
          <ClearButton
            label="編集を元に戻す"
            isSubmitting={isSubmitting}
            onClick={handleReset}
          />
        </div>
      </form>
    </PageWrapper>
  );
};

export default page;
