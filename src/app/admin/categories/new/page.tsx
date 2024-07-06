"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useGetRequest from "@/app/_hooks/useGetRequest";
import CategoryWithPostCount from "@/app/admin/posts/_types/CategoryWithPostCount";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageWrapper from "@/app/_components/elements/PageWrapper";
import { isDevelopmentEnv } from "@/app/_utils/envConfig";

// ウェブAPI関連
import { ApiResponse } from "@/app/_types/ApiResponse";
import createDelayedPostRequest from "@/app/_utils/createDelayedPostRequest";
import ApiRequestHeader from "@/app/_types/ApiRequestHeader";
import CategoryRequest from "@/app/_types/CategoryRequest";
import AppErrorCode from "@/app/_types/AppErrorCode";

// フォーム構成関連
import SubmitButton from "@/app/admin/_components/SubmitButton";
import CategoryInputField from "../_components/CategoryInputField";

const postApiCaller = createDelayedPostRequest<
  CategoryRequest.Payload,
  ApiResponse<CategoryRequest.Payload>,
  ApiRequestHeader
>();

const page: React.FC = () => {
  const pageTitle = "カテゴリの新規作成";
  const router = useRouter();

  const [serverErrorMessage, setServerErrorMessage] = useState<string | null>();

  // 記事投稿、カテゴリ一覧取得のAPIエンドポイント
  const categoriesGetEndpoint = `/api/admin/categories?sort=postcount`;
  const categoryPostEndpoint = `/api/admin/categories`;

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

  // [投稿]ボタンの押下処理
  const onSubmit = async (data: CategoryRequest.Payload) => {
    isDevelopmentEnv && console.log("■ >>> " + JSON.stringify(data));
    let res: ApiResponse<CategoryRequest.Payload> | null = null;
    try {
      const headers = {
        Authorization: "token-token",
        "Content-Type": "application/json",
      };
      res = await postApiCaller(categoryPostEndpoint, data, headers);
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

  return (
    <PageWrapper pageTitle={pageTitle}>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <CategoryInputField
          nameLabel="名前"
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
          <SubmitButton label="新規作成" isSubmitting={isSubmitting} />
        </div>
      </form>
    </PageWrapper>
  );
};

export default page;
