"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useGetRequest from "@/app/_hooks/useGetRequest";
import CategoryWithPostCount from "@/app/admin/posts/_types/CategoryWithPostCount";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageWrapper from "@/app/_components/elements/PageWrapper";
import { isDevelopmentEnv } from "@/app/_utils/envConfig";
import FetchLoading from "@/app/_components/elements/FetchLoading";
import FetchError from "@/app/_components/elements/FetchError";
import composeApiErrorMessage from "@/app/_utils/composeApiErrorMsg";

// ウェブAPI関連
import { ApiResponse } from "@/app/_types/ApiResponse";
import createDelayedPutRequest from "@/app/_utils/createDelayedPutRequest";
import createDelayedDeleteRequest from "@/app/_utils/createDelayedDeleteRequest";
import ApiRequestHeader from "@/app/_types/ApiRequestHeader";
import CategoryRequest from "@/app/_types/CategoryRequest";
import AppErrorCode from "@/app/_types/AppErrorCode";

// フォーム構成関連
import SubmitButton from "@/app/admin/_components/SubmitButton";
import CategoryInputField from "../_components/CategoryInputField";
import DeleteActionDialog from "@/app/_components/elements/DeleteActionDialog";

const deleteApiCaller = createDelayedDeleteRequest<ApiResponse<null>>();

const putApiCaller = createDelayedPutRequest<
  CategoryRequest.Payload,
  ApiResponse<CategoryRequest.Payload>,
  ApiRequestHeader
>();

type Params = {
  id: string;
};

const page: React.FC<{ params: Params }> = ({ params }) => {
  let pageTitle = "カテゴリの名前変更";
  const router = useRouter();

  const [serverErrorMessage, setServerErrorMessage] = useState<string | null>();

  // 記事投稿、カテゴリ一覧取得のAPIエンドポイント
  const categoriesGetEndpoint = `/api/admin/categories?sort=postcount`;
  const categoryPutEndpoint = `/api/admin/categories/${params.id}`;

  // prettier-ignore
  const { data: categoriesData, error: categoriesGetError } = 
    useGetRequest<CategoryWithPostCount[]>(categoriesGetEndpoint);

  const categoryWithPostCountList = categoriesData?.data;

  const useFormOptions = {
    // prettier-ignore
    mode: "onChange" as | "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all",
    resolver: zodResolver(CategoryRequest.clientValidationSchema),
  };

  if (categoryWithPostCountList) {
    const forbiddenNames = categoryWithPostCountList.map((c) => c.name);
    const extendedNameValidation =
      CategoryRequest.clientValidationSchema.shape.name.refine(
        (n) => !forbiddenNames.includes(n),
        { message: `この名前を持ったカテゴリは既に存在します。` }
      );
    useFormOptions.resolver = zodResolver(
      CategoryRequest.clientValidationSchema.extend({
        name: extendedNameValidation,
      })
    );
  }

  // フォーム状態管理
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryRequest.Payload>(useFormOptions);

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
      const headers = {
        Authorization: "token-token",
        "Content-Type": "application/json",
      };
      res = await putApiCaller(categoryPutEndpoint, data, headers);
      isDevelopmentEnv && console.log("■ <<< " + JSON.stringify(res));

      if (res.success) {
        router.push("/admin/categories");
      }
      if (res.error?.appErrorCode == AppErrorCode.CATEGORY_ALREADY_EXISTS) {
        setServerErrorMessage(`カテゴリ「${data.name}」は既に存在します。`);
      }
    } catch (error) {
      isDevelopmentEnv && console.log("■ <<< " + JSON.stringify(res));
    }
  };

  const oldName = categoryWithPostCountList?.find(
    (c) => c.id === Number(params.id)
  )?.name;

  if (!oldName) {
    return (
      <PageWrapper pageTitle={pageTitle}>
        <FetchError
          apiEndpoint={categoriesGetEndpoint}
          message={`カテゴリID: ${params.id} は存在しません。`}
        />
      </PageWrapper>
    );
  }

  const deleteConfTitle = `本当にカテゴリを削除してよいですか？`;
  const deleteConfDescription = `カテゴリ「${oldName}」を削除します。削除後は、元に戻すことはできません。投稿記事が削除されることはありません。`;
  const deleteEndpoint = `/api/admin/categories/${params.id}`;

  const handleDeleteAction = async ({ isDone }: { isDone: boolean }) => {
    if (isDone) {
      router.push("/admin/categories");
    }
  };

  pageTitle = `カテゴリ「${oldName}」の名前変更`;

  return (
    <PageWrapper pageTitle={pageTitle}>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <CategoryInputField
          nameLabel={`新しい名前`}
          isSubmitting={isSubmitting}
          register={register}
          errors={errors}
          serverErrorMessage={serverErrorMessage}
          categoryWithPostCountList={categoryWithPostCountList}
          categoriesGetEndpoint={categoriesGetEndpoint}
          categoriesGetError={categoriesGetError}
        />

        {/* 新規作成ボタン */}
        <div className="mt-5 flex justify-center space-x-4">
          <SubmitButton label="名前を変更" isSubmitting={isSubmitting} />
          <DeleteActionDialog
            className="px-3 font-bold text-base"
            title={deleteConfTitle}
            description={deleteConfDescription}
            endpoint={deleteEndpoint}
            handleDeleteAction={handleDeleteAction}
            deleteApiCaller={deleteApiCaller}
          />
        </div>
      </form>
    </PageWrapper>
  );
};

export default page;
