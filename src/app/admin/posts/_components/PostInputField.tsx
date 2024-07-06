import React from "react";
import ErrorMessage from "@/app/_components/elements/ErrorMessage";
import { useForm, UseFormRegister, FieldErrors } from "react-hook-form";
import CategoryWithPostCount from "@/app/admin/posts/_types/CategoryWithPostCount";
import CategoryToggleButton from "./CategoryToggleButton";

import PostRequest from "@/app/_types/PostRequest";
import cn from "classnames";

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

  // // 検証エラー表示用のスタイル pタグに適用
  // validationMessage: "text-red-500 text-sm mt-1",
};

type Props = {
  isSubmitting: boolean;
  register: UseFormRegister<PostRequest.Payload>;
  errors: FieldErrors<PostRequest.Payload>;
  categoryWithPostCountList: CategoryWithPostCount[];
  selectedCategoryIds: number[];
  categoryPostCounts: { id: number; postCount: number }[];
  toggleCategorySelection: (categoryId: number) => void;
};

const PostInputField: React.FC<Props> = (props) => {
  const {
    isSubmitting,
    register,
    errors,
    categoryWithPostCountList,
    selectedCategoryIds,
    categoryPostCounts,
    toggleCategorySelection,
  } = props;
  return (
    <>
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

      <div className={styles.container}>
        <label htmlFor="categories" className={styles.label}>
          カテゴリ
        </label>
        <div className={styles.subContainer}>
          <div className="flex flex-wrap md:mt-3 gap-0">
            {categoryWithPostCountList.map((c) => (
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
    </>
  );
};
export default PostInputField;
