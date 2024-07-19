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
import { ApiResponse, ApiSuccessResponse } from "@/app/_types/ApiResponse";
import createPostRequest from "@/app/_utils/createPostRequest";
import PostRequest from "@/app/_types/PostRequest";
import { useSWRConfig } from "swr";
import useAuth from "@/app/_hooks/useAuth";

// フォーム構成関連
import ClearButton from "@/app/admin/_components/ClearButton";
import SubmitButton from "@/app/admin/_components/SubmitButton";
import PostInputField from "../_components/PostInputField";

const postApiCaller = createPostRequest<
  PostRequest.Payload,
  ApiResponse<PostRequest.Payload>
>();

const Page: React.FC = () => {
  const pageTitle = "記事の新規作成";
  const router = useRouter();
  const apiRequestHeader = useAuth().apiRequestHeader;

  const { mutate } = useSWRConfig();

  // 記事投稿、カテゴリ一覧取得のAPIエンドポイント
  const postApiEndpoint = `/api/admin/posts`;
  const categoriesApiEndpoint = `/api/admin/categories?sort=postcount`;

  // prettier-ignore
  const { data: categoriesData, error: categoriesGetError } = 
    useGetRequest<CategoryWithPostCount[]>(categoriesApiEndpoint,apiRequestHeader);

  // カテゴリ選択とカテゴリ投稿数の初期値を管理するステート
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [initCategoryPostCounts, setInitCategoryPostCounts] = useState<
    CategoryWithPostCount[] | null
  >(null);

  const defaultValues = {
    title: "",
    content: "",
    thumbnailImageKey: "",
    categories: [],
  };

  // フォーム状態管理
  const methods = useForm<PostRequest.Payload>({
    mode: "onChange",
    resolver: zodResolver(PostRequest.clientValidationSchema),
    defaultValues,
  });

  // カテゴリ選択の状態をリセット
  const resetSelectedCategoryIds = () => {
    setSelectedCategoryIds([]);

    // カテゴリ投稿数の初期値が取得できてない場合は何もしない
    if (!categoriesData || !initCategoryPostCounts) {
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

  // カテゴリ一覧の取得に失敗のときのレスポンス
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

  // カテゴリ一覧を取得中のときのレスポンス
  if (!categoriesData) {
    return (
      <PageWrapper pageTitle={pageTitle}>
        <FetchLoading msg="カテゴリ一覧を読み込んでいます..." />
      </PageWrapper>
    );
  }

  // [リセット]ボタンの押下処理 thumbnailImageKey のみ維持
  const handleResetAction = () => {
    const thumbnailImageKey = methods.watch("thumbnailImageKey");
    methods.reset({ ...defaultValues, thumbnailImageKey });
    resetSelectedCategoryIds();
  };

  // [投稿]ボタンの押下処理
  const onSubmit = async (data: PostRequest.Payload) => {
    isDevelopmentEnv && console.log("■ >>> " + JSON.stringify(data));
    try {
      const res = await postApiCaller(postApiEndpoint, data, apiRequestHeader);
      isDevelopmentEnv && console.log("■ <<< " + JSON.stringify(res));
      if (res.success) {
        router.push(res.data.id ? `/posts/${res.data.id}` : "/posts");
      } else {
        alert(`フォーム送信失敗\n${res.error.technicalInfo}`);
      }
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

          {/* 投稿ボタン と リセットボタン */}
          <div className="my-8 flex justify-center space-x-4">
            <SubmitButton label="投稿" />
            <ClearButton label="リセット" onClick={handleResetAction} />
          </div>
        </FormProvider>
      </form>
    </PageWrapper>
  );
};

export default Page;
