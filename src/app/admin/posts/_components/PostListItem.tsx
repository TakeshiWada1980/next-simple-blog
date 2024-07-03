import React from "react";
import PostWithCategory from "../_types/PostWithCategory";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faEllipsis,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import cn from "classnames";

type Props = {
  post: PostWithCategory;
  selectedPostId: number | null;
  setSelectedPostId: (id: number | null) => void;
};

const fmt = "yyyy/MM/dd HH:mm";
type ButtonEvent =
  | React.MouseEvent<HTMLButtonElement, MouseEvent>
  | React.TouchEvent<HTMLButtonElement>;

const PostListItem: React.FC<Props> = (props) => {
  const { post, selectedPostId, setSelectedPostId } = props;
  const deleteAction = (e: ButtonEvent) => {
    console.log("delete");
  };

  const selectAction = (e: ButtonEvent) => {
    isSelected ? setSelectedPostId(null) : setSelectedPostId(post.id);
  };

  const isSelected = post.id === selectedPostId;
  const buttonStyle = cn(
    "border rounded-md px-2 py-1 text-sm bg-red-500 text-white tracking-wider",
    "animate-jump",
    isSelected ? "block" : "hidden"
  );

  return (
    <div className="border-t border-slate-300 my-1">
      <div className="group flex justify-between pl-2 mt-1 py-2 hover:bg-slate-100 items-center">
        <Link href={`/admin/posts/${post.id}`} className="flex-grow">
          <div className="font-bold text-slate-800">{post.title}</div>
          <div className="text-xs flex items-baseline mt-1 text-slate-500">
            <FontAwesomeIcon icon={faCalendarDays} className="mr-1" />
            <div>{format(post.createdAt, fmt)}</div>
            <div className="ml-2 flex items-center space-x-1">
              {post.categories.map((c) => (
                <div
                  key={c.category.id}
                  className="px-2 border rounded-md  border-slate-500"
                >
                  {c.category.name}
                </div>
              ))}
            </div>
          </div>
        </Link>
        <div className="flex items-center">
          <button onClick={deleteAction} className={buttonStyle}>
            <FontAwesomeIcon icon={faTrashCan} className="mr-1" />
            削除
          </button>
          <button onClick={selectAction}>
            <FontAwesomeIcon
              icon={faEllipsis}
              className="text-slate-500 py-3 px-3"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostListItem;
