"use client";

import React from "react";
import CategoryWithPostCount from "@/app/admin/posts/_types/CategoryWithPostCount";
import cn from "classnames";
import Link from "next/link";

type Props = {
  category: CategoryWithPostCount;
};

const CategoryTag: React.FC<Props> = (props) => {
  const { category: data } = props;

  return (
    <Link
      href={`/admin/categories/${data.id}`}
      className="focus:outline-none"
      tabIndex={-1}
    >
      <div
        className={cn(
          "px-2 mr-2 mb-2",
          "text-slate-800",
          "border rounded-md border-slate-500",
          "flex flex-row items-center",
          "hover:bg-slate-200"
        )}
      >
        <div>{data.name}</div>
        <div className="text-xs ml-1">({data.postCount})</div>
      </div>
    </Link>
  );
};

export default CategoryTag;
