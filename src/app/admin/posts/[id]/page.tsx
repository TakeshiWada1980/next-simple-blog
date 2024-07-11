"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useGetRequest from "@/app/_hooks/useGetRequest";
import FetchError from "@/app/_components/elements/FetchError";
import FetchLoading from "@/app/_components/elements/FetchLoading";
import composeApiErrorMessage from "@/app/_utils/composeApiErrorMsg";
import PostWithCategory from "@/app/admin/posts/_types/PostWithCategory";
import CategoryWithPostCount from "@/app/admin/posts/_types/CategoryWithPostCount";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageWrapper from "@/app/_components/elements/PageWrapper";
import { isDevelopmentEnv } from "@/app/_utils/envConfig";

// ウェブAPI関連
import { ApiResponse, ApiSuccessResponse } from "@/app/_types/ApiResponse";
import createPutRequest from "@/app/_utils/createPutRequest";
import ApiRequestHeader from "@/app/_types/ApiRequestHeader";
import PostRequest from "@/app/_types/PostRequest";
import { useSWRConfig } from "swr";

// フォーム構成関連
import ClearButton from "@/app/admin/_components/ClearButton";
import SubmitButton from "@/app/admin/_components/SubmitButton";
import PostInputField from "../_components/PostInputField";

const putApiCaller = createPutRequest<
  PostRequest.Payload,
  ApiResponse<PostRequest.Payload>,
  ApiRequestHeader
>();

type Params = {
  id: string;
};

const page: React.FC<{ params: Params }> = ({ params }) => {
  const pageTitle = "記事の編集";
  const router = useRouter();

  const { mutate } = useSWRConfig();

  // 記事単体 と カテゴリ一覧 を取得するためのAPIエンドポイント
  const postApiEndpoint = `/api/admin/posts/${params.id}`;
  const categoriesApiEndpoint = `/api/admin/categories?sort=postcount`;

  // prettier-ignore
  const { data: categoriesData, error: categoriesGetError } = 
    useGetRequest<CategoryWithPostCount[]>(categoriesApiEndpoint);
  const { data: postData, error: postGetError } =
    useGetRequest<PostWithCategory>(postApiEndpoint);

  // カテゴリ選択とカテゴリ投稿数の初期値を管理するステート
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [initCategoryPostCounts, setInitCategoryPostCounts] = useState<
    CategoryWithPostCount[] | null
  >(null);

  // フォーム状態管理
  const methods = useForm<PostRequest.Payload>({
    mode: "onChange",
    resolver: zodResolver(PostRequest.clientValidationSchema),
  });

  // カテゴリ選択の状態をリセット
  const resetSelectedCategoryIds = () => {
    setSelectedCategoryIds(
      postData?.data?.categories.map((c) => c.category.id) || []
    );

    if (!categoriesData || !initCategoryPostCounts) {
      // カテゴリ投稿数の初期値が取得できてない場合は何もしない
      return;
    }

    const newCategoriesData = { ...categoriesData };
    newCategoriesData.data = initCategoryPostCounts;
    mutate(categoriesApiEndpoint, newCategoriesData, { revalidate: false });
  };

  // カテゴリ投稿数の初期値を initCategoryPostCounts に保持するための処理
  useEffect(() => {
    if (!initCategoryPostCounts) {
      if (categoriesData?.data) {
        setInitCategoryPostCounts(categoriesData.data);
      }
    }
  }, [categoriesData]);

  // PostDataが取得できたらフォームの初期化
  useEffect(() => {
    if (postData) {
      methods.reset({
        title: postData.data?.title,
        content: postData.data?.content,
        thumbnailUrl: postData.data?.thumbnailUrl,
        categories: postData.data?.categories.map((c) => c.category),
      });
      resetSelectedCategoryIds();
    }
  }, [postData, methods.reset]);

  // 記事単体 もしくは カテゴリ一覧 の取得に失敗した場合
  if (postGetError || categoriesGetError) {
    const error = postGetError || categoriesGetError;
    if (error) {
      return (
        <PageWrapper pageTitle={pageTitle}>
          <FetchError
            apiEndpoint={postApiEndpoint}
            message={composeApiErrorMessage(error)}
          />
        </PageWrapper>
      );
    }
  }

  // 記事単体 もしくは カテゴリ一覧 を取得中の場合
  if (!postData || !categoriesData) {
    return (
      <PageWrapper pageTitle={pageTitle}>
        <FetchLoading msg="記事一覧を読み込んでいます..." />
      </PageWrapper>
    );
  }

  // [編集を元に戻す]ボタンの押下処理
  const handleResetAction = () => {
    methods.reset();
    resetSelectedCategoryIds();
  };

  // [更新]ボタンの押下処理
  const onSubmit = async (data: PostRequest.Payload) => {
    isDevelopmentEnv && console.log("■ >>> " + JSON.stringify(data));
    try {
      const headers = { Authorization: "token-token" };
      const res = await putApiCaller(postApiEndpoint, data, headers);
      isDevelopmentEnv && console.log("■ <<< " + JSON.stringify(res));
      router.push("/admin/posts");
    } catch (error) {
      alert(`フォーム送信失敗\n${error}`);
    }
  };

  let newCategoriesData = { ...categoriesData } as ApiSuccessResponse<
    CategoryWithPostCount[]
  >;

  // カテゴリ選択のトグル処理
  const toggleCategorySelection = (categoryId: number) => {
    let newSelectedCategories: number[] = [];

    if (selectedCategoryIds.includes(categoryId)) {
      // 選択 → 未選択
      newSelectedCategories = selectedCategoryIds.filter(
        (c) => c !== categoryId
      );
      newCategoriesData.data = newCategoriesData.data.map((c) => {
        if (c.id === categoryId) {
          return { ...c, postCount: c.postCount - 1 };
        }
        return c;
      });
      mutate(categoriesApiEndpoint, newCategoriesData, { revalidate: false });
    } else {
      // 未選択 → 選択
      newSelectedCategories = [...selectedCategoryIds, categoryId];
      newCategoriesData.data = newCategoriesData.data.map((c) => {
        if (c.id === categoryId) {
          return { ...c, postCount: c.postCount + 1 };
        }
        return c;
      });
      mutate(categoriesApiEndpoint, newCategoriesData, { revalidate: false });
    }
    setSelectedCategoryIds(newSelectedCategories);
    methods.setValue(
      "categories",
      newSelectedCategories.map((c) => ({ id: c, name: "" }))
    );
  };

  // isDevelopmentEnv && console.log("■ <<< " + JSON.stringify(postData.data));
  // isDevelopmentEnv &&
  //   console.log("■ <<< " + JSON.stringify(categoriesData.data));

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
            toggleCategorySelection={toggleCategorySelection}
          />
          {/* 更新ボタン と 編集を元に戻すボタン */}
          <div className="mt-8 flex justify-center space-x-4">
            <SubmitButton label="更新" />
            <ClearButton label="編集を元に戻す" onClick={handleResetAction} />
          </div>
        </FormProvider>
      </form>
    </PageWrapper>
  );
};

export default page;
