"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useGetRequest from "@/app/_hooks/useGetRequest";
import FetchError from "@/app/_components/elements/FetchError";
import FetchLoading from "@/app/_components/elements/FetchLoading";
import composeApiErrorMessage from "@/app/_utils/composeApiErrorMsg";
import CategoryWithPostCount from "@/app/admin/posts/_types/CategoryWithPostCount";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageWrapper from "@/app/_components/elements/PageWrapper";
import { isDevelopmentEnv } from "@/app/_utils/envConfig";

// ウェブAPI関連
import { ApiResponse } from "@/app/_types/ApiResponse";
import createPostRequest from "@/app/_utils/createPostRequest";
import ApiRequestHeader from "@/app/_types/ApiRequestHeader";
import PostRequest from "@/app/_types/PostRequest";

// フォーム構成関連
import ClearButton from "@/app/admin/_components/ClearButton";
import SubmitButton from "@/app/admin/_components/SubmitButton";
import PostInputField from "../_components/PostInputField";

const postApiCaller = createPostRequest<
  PostRequest.Payload,
  ApiResponse<PostRequest.Payload>,
  ApiRequestHeader
>();

const page: React.FC = () => {
  const pageTitle = "記事の新規作成";
  const router = useRouter();

  // 記事投稿、カテゴリ一覧取得のAPIエンドポイント
  const postApiEndpoint = `/api/admin/posts`;
  const categoriesApiEndpoint = `/api/admin/categories?sort=postcount`;

  // prettier-ignore
  const { data: categoriesData, error: categoriesGetError } = 
    useGetRequest<CategoryWithPostCount[]>(categoriesApiEndpoint);

  // カテゴリ選択(複数)の状態と数を管理するステート
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [categoryPostCounts, setCategoryPostCounts] = useState<
    { id: number; postCount: number }[]
  >([]);

  // フォーム状態管理
  const methods = useForm<PostRequest.Payload>({
    mode: "onChange",
    resolver: zodResolver(PostRequest.clientValidationSchema),
  });

  // カテゴリ選択状態をリセット
  const resetSelectedCategoryIds = () => {
    setSelectedCategoryIds([]);
  };

  // カテゴリ選択数をリセット
  const resetCategoryPostCounts = () => {
    setCategoryPostCounts(
      categoriesData?.data?.map((c) => ({
        id: c.id,
        postCount: c.postCount,
      })) || []
    );
  };

  useEffect(() => {
    categoriesData && resetCategoryPostCounts();
    methods.reset({
      title: "",
      content: "",
      thumbnailUrl: "",
      // カテゴリ初期値が null だとエラーになるため空配列をセット
      categories: [],
    });
  }, [categoriesData, methods.reset]);

  // カテゴリ一覧 の取得に失敗した場合
  if (categoriesGetError) {
    const error = categoriesGetError;
    if (error) {
      return (
        <PageWrapper pageTitle={pageTitle}>
          <FetchError
            apiEndpoint={categoriesApiEndpoint}
            message={composeApiErrorMessage(error)}
          />
        </PageWrapper>
      );
    }
  }

  // カテゴリ一覧 を取得中の場合
  if (!categoriesData) {
    return (
      <PageWrapper pageTitle={pageTitle}>
        <FetchLoading msg="カテゴリ一覧を読み込んでいます..." />
      </PageWrapper>
    );
  }

  // [リセット]ボタンの押下処理
  const handleResetAction = () => {
    methods.reset();
    resetSelectedCategoryIds();
    resetCategoryPostCounts();
  };

  // [投稿]ボタンの押下処理
  const onSubmit = async (data: PostRequest.Payload) => {
    isDevelopmentEnv && console.log("■ >>> " + JSON.stringify(data));
    try {
      const headers = {
        Authorization: "token-token",
        "Content-Type": "application/json",
      };
      const res = await postApiCaller(postApiEndpoint, data, headers);
      isDevelopmentEnv && console.log("■ <<< " + JSON.stringify(res));
      router.push("/admin/posts");
    } catch (error) {
      alert(`フォーム送信失敗\n${error}`);
    }
  };

  // カテゴリ選択のトグル処理
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
    methods.setValue(
      "categories",
      newSelectedCategories.map((c) => ({ id: c, name: "" }))
    );
  };

  const categoryWithPostCountList = categoriesData.data as NonNullable<
    typeof categoriesData.data
  >;

  return (
    <PageWrapper pageTitle={pageTitle}>
      <form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
        <FormProvider {...methods}>
          {/* タイトル・本文・画像・カテゴリに関するフォーム */}
          <PostInputField
            categoryWithPostCountList={categoryWithPostCountList}
            selectedCategoryIds={selectedCategoryIds}
            categoryPostCounts={categoryPostCounts}
            toggleCategorySelection={toggleCategorySelection}
          />

          {/* 投稿ボタン と リセットボタン */}
          <div className="mt-8 flex justify-center space-x-4">
            <SubmitButton label="投稿" />
            <ClearButton label="リセット" onClick={handleResetAction} />
          </div>
        </FormProvider>
      </form>
    </PageWrapper>
  );
};

export default page;
