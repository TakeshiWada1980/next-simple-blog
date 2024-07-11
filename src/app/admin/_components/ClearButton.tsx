"use client";

import React from "react";
import cn from "classnames";
import { useFormContext } from "react-hook-form";

type Props = {
  label: string;
  onClick: () => void;
};

const style = [
  "px-4 py-2",
  "font-bold rounded-md",
  "text-slate-700 bg-slate-300",
  "hover:bg-slate-400 hover:text-slate-50",
];

const ClearButton: React.FC<Props> = (props) => {
  const { label, onClick } = props;
  const { formState } = useFormContext();
  const isSubmitting = formState.isSubmitting;

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
