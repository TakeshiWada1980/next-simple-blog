"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import useGetRequest from "@/app/_hooks/useGetRequest";
import CategoryWithPostCount from "@/app/admin/posts/_types/CategoryWithPostCount";
import PageWrapper from "@/app/_components/elements/PageWrapper";
import { isDevelopmentEnv } from "@/app/_utils/envConfig";
import FetchLoading from "@/app/_components/elements/FetchLoading";
import FetchError from "@/app/_components/elements/FetchError";
import composeApiErrorMessage from "@/app/_utils/composeApiErrorMsg";
import { FormProvider } from "react-hook-form";

// ウェブAPI関連
import { ApiResponse } from "@/app/_types/ApiResponse";
import createPutRequest from "@/app/_utils/createPutRequest";
import createDeleteRequest from "@/app/_utils/createDeleteRequest";
import CategoryRequest from "@/app/_types/CategoryRequest";
import AppErrorCode from "@/app/_types/AppErrorCode";
import useAuth from "@/app/_hooks/useAuth";

// フォーム構成関連
import SubmitButton from "@/app/admin/_components/SubmitButton";
import CategoryInputField from "../_components/CategoryInputField";
import DeleteActionDialog from "@/app/_components/elements/DeleteActionDialog";
import useCreateCategoryForm from "../_hooks/useCreateCategoryForm";

const deleteApiCaller = createDeleteRequest<ApiResponse<null>>();

const putApiCaller = createPutRequest<
  CategoryRequest.Payload,
  ApiResponse<CategoryRequest.Payload>
>();

const Page: React.FC = () => {
  const id: string = useParams().id as string;
  let pageTitle = "カテゴリの名前変更";
  const router = useRouter();
  const apiRequestHeader = useAuth().apiRequestHeader;
  const INVALID_apiRequestHeader = { Authorization: useAuth().token + "W" }; // 失敗テスト用

  const [serverErrorMessage, setServerErrorMessage] = useState<string | null>();

  // 記事投稿、カテゴリ一覧取得のAPIエンドポイント
  const categoriesGetEndpoint = `/api/admin/categories?sort=postcount`;
  const categoryPutEndpoint = `/api/admin/categories/${id}`;
  const categoryDeleteEndpoint = `/api/admin/categories/${id}`;

  // prettier-ignore
  const { data: categoriesData, error: categoriesGetError } = 
    useGetRequest<CategoryWithPostCount[]>(categoriesGetEndpoint,apiRequestHeader);

  const onDeleteCall = async () => {
    return await deleteApiCaller(categoryDeleteEndpoint, apiRequestHeader);
  };

  const categoryWithPostCountList = categoriesData?.data;

  const methods = useCreateCategoryForm(categoryWithPostCountList);

  // カテゴリ一覧 の取得に失敗した場合
  if (categoriesGetError) {
    return (
      <PageWrapper pageTitle={pageTitle}>
        <FetchError
          apiEndpoint={categoriesGetEndpoint}
          message={composeApiErrorMessage(categoriesGetError)}
        />
      </PageWrapper>
    );
  }

  // カテゴリ一覧 を取得中の場合
  if (!categoriesData) {
    return (
      <PageWrapper pageTitle={pageTitle}>
        <FetchLoading msg="記事一覧を読み込んでいます..." />
      </PageWrapper>
    );
  }

  // [投稿]ボタンの押下処理
  const onSubmit = async (data: CategoryRequest.Payload) => {
    isDevelopmentEnv && console.log("■ >>> " + JSON.stringify(data));
    let res: ApiResponse<CategoryRequest.Payload> | null = null;
    try {
      res = await putApiCaller(categoryPutEndpoint, data, apiRequestHeader);
      isDevelopmentEnv && console.log("■ <<< " + JSON.stringify(res));

      if (res.success) {
        router.push("/admin/categories");
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

  const oldName = categoryWithPostCountList?.find(
    (c) => c.id === Number(id)
  )?.name;

  if (!oldName) {
    return (
      <PageWrapper pageTitle={pageTitle}>
        <FetchError
          apiEndpoint={categoriesGetEndpoint}
          message={`カテゴリID: ${id} は存在しません。`}
        />
      </PageWrapper>
    );
  }

  const deleteConfTitle = `本当にカテゴリを削除してよいですか？`;
  const deleteConfDescription = `カテゴリ「${oldName}」を削除します。削除後は、元に戻すことはできません。投稿記事が削除されることはありません。`;

  const handleDeleteAction = async ({ isDone }: { isDone: boolean }) => {
    if (isDone) {
      router.push("/admin/categories");
    }
  };

  pageTitle = `カテゴリ「${oldName}」の名前変更`;

  return (
    <PageWrapper pageTitle={pageTitle}>
      <form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
        <FormProvider {...methods}>
          <CategoryInputField
            nameLabel={`新しい名前`}
            serverErrorMessage={serverErrorMessage}
            categoryWithPostCountList={categoryWithPostCountList}
            categoriesGetEndpoint={categoriesGetEndpoint}
            categoriesGetError={categoriesGetError}
          />
        </FormProvider>

        {/* 新規作成ボタン */}
        <div className="mt-5 flex justify-center space-x-4">
          <FormProvider {...methods}>
            <SubmitButton label="名前を変更" />
          </FormProvider>
          <DeleteActionDialog
            className="px-3 font-bold text-base hover:bg-red-500"
            title={deleteConfTitle}
            description={deleteConfDescription}
            // endpoint={categoryDeleteEndpoint}
            handleDeleteAction={handleDeleteAction}
            // deleteApiCaller={deleteApiCaller}
            onDeleteCall={onDeleteCall}
          />
        </div>
      </form>
    </PageWrapper>
  );
};

export default Page;
