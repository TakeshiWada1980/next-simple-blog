import React from "react";
import ErrorMessage from "@/app/_components/elements/ErrorMessage";
import { FieldErrors, useFormContext } from "react-hook-form";
import CategoryWithPostCount from "@/app/admin/posts/_types/CategoryWithPostCount";
import CategoryToggleButton from "./CategoryToggleButton";

import PostRequest from "@/app/_types/PostRequest";
import cn from "classnames";
import Image from "next/image";
import useThumbnailImage from "@/app/admin/posts/_hooks/useThumbnailImage";

// スタイル設定
const styles = {
  container: "flex mt-6 flex-col md:flex-row w-full",
  label: "w-full md:w-2/12 md:mt-3 mb-2 font-bold",
  subContainer: "w-full md:w-10/12",
  input:
    "w-full px-3 py-3 border rounded-md duration-200 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent",
  disabledInput: "hover:cursor-not-allowed bg-gray-100",
};

type Props = {
  categoryWithPostCountList: CategoryWithPostCount[];
  selectedCategoryIds: number[];
  toggleCategorySelection: (categoryId: number) => void;
};

const PostInputField: React.FC<Props> = (props) => {
  const { register, formState } = useFormContext();
  const { thumbnailImageUrl, handleImageChange } = useThumbnailImage();

  const isSubmitting = formState.isSubmitting;
  const errors = formState.errors as FieldErrors<PostRequest.Payload>;
  const {
    categoryWithPostCountList,
    selectedCategoryIds,
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

      {/* 画像キー */}
      <div className={styles.container}>
        <label htmlFor="thumbnailImageKey" className={styles.label}>
          画像キー
        </label>
        <div className={styles.subContainer}>
          <input
            {...register("thumbnailImageKey")}
            id="thumbnailImageKey"
            type="text"
            className={cn(styles.input, styles.disabledInput, "outline-none")}
            placeholder="(ファイルを選択すると自動生成されます)"
            disabled={isSubmitting}
            readOnly
          />
          <ErrorMessage message={errors.thumbnailImageKey?.message} />
        </div>
      </div>

      {/* ファイル選択ボタン */}
      <div className="flex mt-3 flex-col md:flex-row w-full">
        <div className={styles.label}></div>
        <div className={styles.subContainer}>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/png, image/jpeg"
          />
        </div>
      </div>

      {/* 画像プレビュー領域 */}
      {thumbnailImageUrl && (
        <div className="flex mt-3 flex-col md:flex-row w-full">
          <div className={styles.label}></div>
          <div className={styles.subContainer}>
            <Image
              className="rounded-lg"
              src={thumbnailImageUrl}
              alt="プレビュー画像"
              width={800}
              height={400}
              priority
            />
          </div>
        </div>
      )}

      {/* カテゴリの選択 */}
      <div className={styles.container}>
        <div className={styles.label}>カテゴリ</div>
        <div className={styles.subContainer}>
          <div className="flex flex-wrap md:mt-3 gap-0">
            {categoryWithPostCountList.map((c) => (
              <CategoryToggleButton
                key={c.id}
                category={c}
                selectedCategoryIds={selectedCategoryIds}
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
