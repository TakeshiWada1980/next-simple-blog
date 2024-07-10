"use client";

import React from "react";
import CategoryWithPostCount from "@/app/admin/posts/_types/CategoryWithPostCount";
import cn from "classnames";

type Props = {
  category: CategoryWithPostCount;
};

const CategoryTag: React.FC<Props> = (props) => {
  const { category: data } = props;

  return (
    <div
      className={cn(
        "px-2 mr-2 mb-2",
        "text-slate-800",
        "border rounded-md border-slate-500",
        "flex flex-row items-center",
        "cursor-default"
      )}
    >
      <div>{data.name}</div>
      <div className="text-xs ml-1">({data.postCount})</div>
    </div>
  );
};

export default CategoryTag;
