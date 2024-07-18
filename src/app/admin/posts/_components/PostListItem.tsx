"use client";

import React from "react";
import PostWithCategory from "../_types/PostWithCategory";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import cn from "classnames";
import { ApiResponse } from "@/app/_types/ApiResponse";
import DeleteActionDialog from "@/app/_components/elements/DeleteActionDialog";
import ApiRequestHeader from "@/app/_types/ApiRequestHeader";
import useAuth from "@/app/_hooks/useAuth";

type Props = {
  post: PostWithCategory;
  selectedPostId: number | null;
  setSelectedPostId: (id: number | null) => void;
  handleDeleteAction: ({ isDone }: { isDone: boolean }) => void;
  deleteApiCaller: (
    url: string,
    headers?: ApiRequestHeader
  ) => Promise<ApiResponse<null>>;
};

const fmt = "yyyy/MM/dd HH:mm";
type ButtonEvent =
  | React.MouseEvent<HTMLButtonElement, MouseEvent>
  | React.TouchEvent<HTMLButtonElement>;

const PostListItem: React.FC<Props> = (props) => {
  const { post, selectedPostId, deleteApiCaller, setSelectedPostId } = props;

  //削除関連
  const deleteConfTitle = "本当に記事を削除してよいですか？";
  const deleteConfDescription =
    "選択された記事を削除します。削除後は、元に戻すことはできません。";
  const deleteEndpoint = `/api/admin/posts/${post.id}`;
  const apiRequestHeader = useAuth().apiRequestHeader;
  const onDeleteCall = async () =>
    await deleteApiCaller(deleteEndpoint, apiRequestHeader);

  const selectAction = (e: ButtonEvent) => {
    isSelected ? setSelectedPostId(null) : setSelectedPostId(post.id);
  };

  const isSelected = post.id === selectedPostId;

  return (
    <div className="border-t border-slate-300 my-1">
      <div className="group flex justify-between pl-2 mt-1 hover:bg-slate-100 items-center">
        <Link href={`/admin/posts/${post.id}`} className="flex-grow py-2">
          <div className="font-bold text-slate-800">{post.title}</div>
          <div className="text-xs flex items-baseline mt-1 text-slate-500">
            <FontAwesomeIcon icon={faCalendarDays} className="mr-1" />
            <div>{format(post.createdAt, fmt)}</div>
            <div className="ml-2 flex flex-wrap items-center gap-1">
              {post.categories.map((c) => (
                <div
                  key={c.category.id}
                  className="px-2 border rounded-md border-slate-500"
                >
                  {c.category.name}
                </div>
              ))}
            </div>
          </div>
        </Link>
        <div className="flex items-center">
          <DeleteActionDialog
            className={cn(isSelected ? "block" : "hidden", "animate-jump")}
            title={deleteConfTitle}
            description={deleteConfDescription}
            handleDeleteAction={props.handleDeleteAction}
            onDeleteCall={onDeleteCall}
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

export default PostListItem;
