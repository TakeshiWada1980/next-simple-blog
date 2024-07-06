"use client";

import React from "react";
import cn from "classnames";

type Props = {
  label: string;
  isSubmitting: boolean;
  onClick: () => void;
};

const style = [
  "px-4 py-2 font-bold rounded-md bg-slate-300 hover:bg-slate-400 text-slate-700 hover:text-slate-50",
];

const ClearButton: React.FC<Props> = (props) => {
  const { label, isSubmitting, onClick } = props;

  return (
    <button
      type="button"
      disabled={isSubmitting}
      className={cn(
        style,
        isSubmitting &&
          "bg-gray-100 text-gray-400 hover:bg-gray-100 hover:text-gray-400 hover:cursor-not-allowed"
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default ClearButton;
