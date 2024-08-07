"use client";

import React from "react";
import CategoryWithPostCount from "@/app/admin/posts/_types/CategoryWithPostCount";
import cn from "classnames";

type Props = {
  category: CategoryWithPostCount;
  selectedCategoryIds: number[];
  toggleCategorySelection: (id: number) => void;
};

const CategoryToggleButton: React.FC<Props> = (props) => {
  const {
    category: data,
    selectedCategoryIds,
    toggleCategorySelection,
  } = props;

  return (
    <button
      type="button"
      onClick={() => toggleCategorySelection(data.id)}
      className={cn(
        "px-2 mr-2 mb-2",
        "border rounded-md",
        "border-slate-500",
        "flex flex-row items-center",
        selectedCategoryIds.includes(data.id) && [
          "bg-slate-800",
          "text-slate-100",
        ]
      )}
    >
      <div>{data.name}</div>
      <div className="text-xs ml-1">({data.postCount})</div>
    </button>
  );
};

export default CategoryToggleButton;
