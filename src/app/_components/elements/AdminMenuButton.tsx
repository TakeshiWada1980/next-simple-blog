"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenNib } from "@fortawesome/free-solid-svg-icons";
import cn from "classnames";

interface Props {
  onClick: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

const AdminMenuButton: React.FC<Props> = (props) => {
  const { onClick, buttonRef } = props;
  const style = cn(
    "px-3 py-1",
    "font-bold",
    "text-slate-800 bg-slate-300 border border-slate-800",
    "hover:border-slate-300",
    "rounded-2xl",
    "animate-pulse animate-twice animate-duration-[1200ms] animate-delay-1000 animate-ease-in"
  );

  return (
    <button ref={buttonRef} className={style} onClick={onClick}>
      <FontAwesomeIcon className="mr-2" icon={faPenNib} />
      管理
    </button>
  );
};

export default AdminMenuButton;
