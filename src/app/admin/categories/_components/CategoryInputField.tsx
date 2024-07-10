"use client";

import React from "react";
import ErrorMessage from "@/app/_components/elements/ErrorMessage";
import { UseFormRegister, FieldErrors, useFormContext } from "react-hook-form";
import CategoryWithPostCount from "@/app/admin/posts/_types/CategoryWithPostCount";
import CategoryTag from "./CategoryTag";
import FetchError from "@/app/_components/elements/FetchError";
import FetchLoading from "@/app/_components/elements/FetchLoading";
import composeApiErrorMessage from "@/app/_utils/composeApiErrorMsg";
import cn from "classnames";
import CategoryRequest from "@/app/_types/CategoryRequest";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/app/_types/ApiResponse";

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
};

type Props = {
  nameLabel: string;
  serverErrorMessage?: string | null;
  categoryWithPostCountList: CategoryWithPostCount[] | null | undefined;
  categoriesGetEndpoint: string;
  categoriesGetError: AxiosError<ApiErrorResponse, any> | undefined;
};

const CategoryInputField: React.FC<Props> = (props) => {
  const { register, formState } = useFormContext();
  const isSubmitting = formState.isSubmitting;
  const errors = formState.errors as FieldErrors<CategoryRequest.Payload>;
  const {
    nameLabel,
    serverErrorMessage,
    categoryWithPostCountList,
    categoriesGetEndpoint,
    categoriesGetError,
  } = props;

  return (
    <>
      <div className={styles.container}>
        <label htmlFor="name" className={styles.label}>
          {nameLabel}
        </label>
        <div className={styles.subContainer}>
          <input
            {...register("name")}
            id="name"
            type="text"
            className={cn(styles.input, isSubmitting && styles.disabledInput)}
            placeholder="カテゴリの名前を入力してください。"
            disabled={isSubmitting}
          />
          <ErrorMessage message={errors.name?.message} />
          <ErrorMessage message={serverErrorMessage ?? serverErrorMessage} />
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.label}>既存カテゴリ</div>

        <div className={styles.subContainer}>
          <div className="flex flex-wrap md:mt-3 gap-0">
            {categoryWithPostCountList ? (
              categoryWithPostCountList.map((c) => (
                <CategoryTag key={c.id} category={c} />
              ))
            ) : categoriesGetError ? (
              <FetchError
                className="my-0"
                apiEndpoint={categoriesGetEndpoint}
                message={composeApiErrorMessage(categoriesGetError)}
              />
            ) : (
              <FetchLoading
                className="my-0"
                msg="カテゴリ一覧を読み込んでいます..."
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryInputField;
