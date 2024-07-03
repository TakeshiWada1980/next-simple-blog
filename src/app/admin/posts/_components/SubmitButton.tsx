import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import cn from "classnames";

type Props = {
  isSubmitting: boolean;
};

const SubmitButton: React.FC<Props> = (props) => {
  const { isSubmitting } = props;

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={cn(
        "flex items-center tracking-wider",
        "px-4 py-2 font-bold rounded-md",
        "text-white bg-slate-600",
        "hover:bg-slate-800",
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
      {!isSubmitting ? "送信" : "送信中..."}
    </button>
  );
};

export default SubmitButton;
