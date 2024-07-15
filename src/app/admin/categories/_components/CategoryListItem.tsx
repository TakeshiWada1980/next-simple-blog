"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CategoryWithPostCount from "@/app/admin/posts/_types/CategoryWithPostCount";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import cn from "classnames";
import { ApiResponse } from "@/app/_types/ApiResponse";
import DeleteActionDialog from "@/app/_components/elements/DeleteActionDialog";
import ApiRequestHeader from "@/app/_types/ApiRequestHeader";

type Props = {
  category: CategoryWithPostCount;
  selectedCategoryId: number | null;
  setSelectedCategoryId: (id: number | null) => void;
  handleDeleteAction: ({ isDone }: { isDone: boolean }) => void;
  deleteApiCaller: (
    url: string,
    headers?: ApiRequestHeader
  ) => Promise<ApiResponse<null>>;
};

type ButtonEvent =
  | React.MouseEvent<HTMLButtonElement, MouseEvent>
  | React.TouchEvent<HTMLButtonElement>;

const CategoryListItem: React.FC<Props> = (props) => {
  const { category, selectedCategoryId, setSelectedCategoryId } = props;

  //削除関連
  const deleteConfTitle = `本当にカテゴリを削除してよいですか？`;
  const deleteConfDescription = `選択されたカテゴリ「${category.name}」を削除します。削除後は、元に戻すことはできません。投稿記事が削除されることはありません。`;
  const deleteEndpoint = (id: number) => `/api/admin/categories/${id}`;

  const selectAction = (e: ButtonEvent) => {
    isSelected
      ? setSelectedCategoryId(null)
      : setSelectedCategoryId(category.id);
  };

  const isSelected = category.id === selectedCategoryId;

  return (
    <div className="border-t border-slate-300 my-1">
      <div className="group flex justify-between pl-2 mt-1 hover:bg-slate-100 items-center">
        <Link
          href={`/admin/categories/${category.id}`}
          className="flex-grow py-2"
        >
          <div className="flex items-baseline">
            <div className="font-bold text-slate-800 ml-2">{category.name}</div>
            <div className="ml-4 text-slate-500 text-sm ">
              ( {category.postCount}件の投稿 )
            </div>
          </div>
        </Link>
        <div className="flex items-center">
          <DeleteActionDialog
            className={cn(isSelected ? "block" : "hidden", "animate-jump")}
            title={deleteConfTitle}
            description={deleteConfDescription}
            endpoint={deleteEndpoint(category.id)}
            handleDeleteAction={props.handleDeleteAction}
            deleteApiCaller={props.deleteApiCaller}
          />
          <button onClick={selectAction}>
            <FontAwesomeIcon
              icon={faEllipsis}
              className="text-slate-500 px-3 py-4"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryListItem;
