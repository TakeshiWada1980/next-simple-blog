"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useFormContext } from "react-hook-form";
import cn from "classnames";

type Props = {
  label: string;
};

const SubmitButton: React.FC<Props> = (props) => {
  const { label } = props;
  const { formState } = useFormContext();
  const isSubmitting = formState.isSubmitting;

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={cn(
        "flex items-center tracking-wider",
        "px-4 py-2 font-bold rounded-md",
        "text-white bg-slate-500",
        "hover:bg-slate-700",
        isSubmitting && [
          "bg-slate-800 text-gray-400",
          "hover:cursor-not-allowed",
        ]
      )}
    >
      <FontAwesomeIcon
        icon={faSpinner}
        className={cn(
          "animate-spin animate-duration-[2000ms]",
          "mr-2",
          isSubmitting ? "block" : "hidden"
        )}
      />
      {!isSubmitting ? label : `${label}中...`}
    </button>
  );
};

export default SubmitButton;
