"use client";

import React, { ReactNode, useEffect } from "react";
import useGetRequest from "@/app/_hooks/useGetRequest";
import FetchError from "@/app/_components/elements/FetchError";
import FetchLoading from "@/app/_components/elements/FetchLoading";
import composeApiErrorMessage from "@/app/_utils/composeApiErrorMsg";
import PostWithCategory from "@/app/admin/posts/_types/PostWithCategory";
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

type Params = {
  id: string;
};

// スタイル設定
const styles = {
  // label要素、input要素、validateMsg(p)要素のコンテナ
  container: "flex mt-6 flex-col md:flex-row w-full",

  // labelのスタイル
  label: "w-full md:w-2/12 md:mt-3 mb-2",

  // input要素とvalidateMsg(p)要素のコンテナ
  subContainer: "w-full md:w-10/12",

  // テキストボックスとテキストエリアのスタイル
  input:
    "w-full px-3 py-3 border rounded-md duration-200 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent",

  // テキストボックスとテキストエリアののスタイル（無効時）
  disabledInput: "hover:cursor-not-allowed bg-gray-100",

  // 検証エラー表示用のスタイル pタグに適用
  validationMessage: "text-red-500 text-sm mt-1",

  // 「送信」と「クリア」の共通のボタンスタイル
  button: "px-4 py-2 font-bold rounded-md",

  // 「送信」ボタンのスタイル
  submitButton: "bg-slate-600 hover:bg-slate-800 text-white",

  // 「クリア」ボタンのスタイル
  clearButton:
    "bg-slate-300 hover:bg-slate-400 text-slate-700 hover:text-slate-50",

  // 「送信」と「クリア」の共通のボタンスタイル（無効時）
  disabledButton:
    "bg-gray-100 text-gray-400 hover:bg-gray-100 hover:text-gray-400 hover:cursor-not-allowed",
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
  const url = `/api/admin/posts/${params.id}`;
  const { data, error } = useGetRequest<PostWithCategory>(url);

  const title = "記事の編集";

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostRequest.Payload>({
    mode: "onChange",
    resolver: zodResolver(PostRequest.validationSchema),
  });

  useEffect(() => {
    if (data) {
      const post = data.data;
      reset({
        title: post?.title,
        content: post?.content,
        thumbnailUrl: post?.thumbnailUrl,
        categories: post?.categories.map((c) => c.category),
      });
    }
  }, [data, reset]);

  const handleReset = () => {
    reset();
  };

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

  const onSubmit = async (data: PostRequest.Payload) => {
    console.log("■" + JSON.stringify(data));
    try {
      const headers = { Authorization: "token-token" };
      const res = await putFetcher(url, data, headers);
      console.log("■" + JSON.stringify(res));
    } catch (error) {
      alert(`フォーム送信失敗\n${error}`);
    }
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
        {/* クリアボタンと送信ボタン */}
        <div className="mt-4 flex justify-center space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              styles.button,
              styles.submitButton,
              isSubmitting && styles.disabledButton
            )}
          >
            送信
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            className={cn(
              styles.button,
              styles.clearButton,
              isSubmitting && styles.disabledButton
            )}
            onClick={handleReset}
          >
            編集の取り消し
          </button>
        </div>
      </form>
    </PageWrapper>
  );
};

export default page;
