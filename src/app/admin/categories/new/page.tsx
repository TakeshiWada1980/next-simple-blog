"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useGetRequest from "@/app/_hooks/useGetRequest";
import CategoryWithPostCount from "@/app/admin/posts/_types/CategoryWithPostCount";
import PageWrapper from "@/app/_components/elements/PageWrapper";
import { isDevelopmentEnv } from "@/app/_utils/envConfig";

// ウェブAPI関連
import { ApiResponse } from "@/app/_types/ApiResponse";
import createPostRequest from "@/app/_utils/createPostRequest";
import CategoryRequest from "@/app/_types/CategoryRequest";
import AppErrorCode from "@/app/_types/AppErrorCode";
import useAuth from "@/app/_hooks/useAuth";

// フォーム構成関連
import SubmitButton from "@/app/admin/_components/SubmitButton";
import CategoryInputField from "../_components/CategoryInputField";
import useCreateCategoryForm from "../_hooks/useCreateCategoryForm";
import { FormProvider } from "react-hook-form";

const postApiCaller = createPostRequest<
  CategoryRequest.Payload,
  ApiResponse<CategoryRequest.Payload>
>();

const page: React.FC = () => {
  const pageTitle = "カテゴリの新規作成";
  const router = useRouter();
  const apiRequestHeader = useAuth().apiRequestHeader;

  const [serverErrorMessage, setServerErrorMessage] = useState<string | null>();

  // 記事投稿、カテゴリ一覧取得のAPIエンドポイント
  const categoriesGetEndpoint = `/api/admin/categories?sort=postcount`;
  const categoryPostEndpoint = `/api/admin/categories`;

  // prettier-ignore
  const { data: categoriesData, error: categoriesGetError } = 
    useGetRequest<CategoryWithPostCount[]>(categoriesGetEndpoint,apiRequestHeader);

  const categoryWithPostCountList = categoriesData?.data;

  const methods = useCreateCategoryForm(categoryWithPostCountList);

  // [投稿]ボタンの押下処理
  const onSubmit = async (data: CategoryRequest.Payload) => {
    isDevelopmentEnv && console.log("■ >>> " + JSON.stringify(data));
    let res: ApiResponse<CategoryRequest.Payload> | null = null;
    try {
      res = await postApiCaller(categoryPostEndpoint, data, apiRequestHeader);
      isDevelopmentEnv && console.log("■ <<< " + JSON.stringify(res));

      if (res.success) {
        router.replace("/admin/categories");
        return;
      }
      if (res.error?.appErrorCode == AppErrorCode.CATEGORY_ALREADY_EXISTS) {
        setServerErrorMessage(`カテゴリ「${data.name}」は既に存在します。`);
      } else {
        setServerErrorMessage(
          `操作に失敗しました。${res.error?.technicalInfo}`
        );
      }
    } catch (error) {
      isDevelopmentEnv && console.log("■ <<< " + JSON.stringify(res));
      setServerErrorMessage(`操作に失敗しました。${error}`);
    }
  };

  return (
    <PageWrapper pageTitle={pageTitle}>
      <form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
        <FormProvider {...methods}>
          <CategoryInputField
            nameLabel="名前"
            serverErrorMessage={serverErrorMessage}
            categoryWithPostCountList={categoryWithPostCountList}
            categoriesGetEndpoint={categoriesGetEndpoint}
            categoriesGetError={categoriesGetError}
          />
        </FormProvider>

        {/* 新規作成ボタン */}
        <FormProvider {...methods}>
          <div className="mt-5 flex justify-center space-x-4">
            <SubmitButton label="新規作成" />
          </div>
        </FormProvider>
      </form>
    </PageWrapper>
  );
};

export default page;
