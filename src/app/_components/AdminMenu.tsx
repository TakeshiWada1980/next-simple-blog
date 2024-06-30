"use client";

import React, { forwardRef } from "react";
import Link from "next/link";
import cn from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDoorOpen,
  faUser,
  faPenToSquare,
  faFileLines,
  faTag,
  faTags,
} from "@fortawesome/free-solid-svg-icons";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  adminMenuRef: React.RefObject<HTMLDivElement>;
}

const AdminMenu: React.FC<Props> = ({ isOpen, setIsOpen, adminMenuRef }) => {
  const closeMenu = () => {
    setIsOpen(false);
  };
  const menuStyle = cn(
    "fixed bottom-0",
    "container mx-auto md:w-2/3 xl:w-1/2",
    "max-h-[40vh]",
    "bg-slate-50",
    "border border-slate-300",
    "shadow-lg rounded-t-2xl",
    "transform transition-transform duration-300",
    "overflow-auto",
    isOpen ? "translate-y-0" : "translate-y-full"
  );
  const linkStyle = cn(
    "px-0 py-2 md:px-3 my-1",
    "text-md",
    "hover:bg-slate-200 hover:font-bold",
    "rounded",
    "flex items-center"
  );
  const iconStyle = cn("mr1 md:mr-2", "text-2xl", "w-8", "text-slate-400");

  return (
    <div ref={adminMenuRef} className={menuStyle}>
      <div className="p-5 pt-3">
        <h2 className="text-xl text-center font-bold tracking-wide pb-3 border-b border-slate-300">
          <FontAwesomeIcon className="mr-2 text-slate-400" icon={faUser} />
          管理者メニュー
          <FontAwesomeIcon className="ml-2 text-slate-400" icon={faUser} />
        </h2>
        <nav className="flex flex-col mt-2 mb-4">
          <Link href="/" className={linkStyle} onClick={closeMenu}>
            <FontAwesomeIcon className={iconStyle} icon={faPenToSquare} />
            記事の新規作成
          </Link>
          <Link href="/" className={linkStyle} onClick={closeMenu}>
            <FontAwesomeIcon className={iconStyle} icon={faFileLines} />
            記事の一覧 (編集・削除)
          </Link>
          <Link href="/" className={linkStyle} onClick={closeMenu}>
            <FontAwesomeIcon className={iconStyle} icon={faTag} />
            カテゴリの新規作成
          </Link>
          <Link href="/" className={linkStyle} onClick={closeMenu}>
            <FontAwesomeIcon className={iconStyle} icon={faTags} />
            カテゴリの一覧 (編集・削除)
          </Link>
          <Link href="/" className={linkStyle} onClick={closeMenu}>
            <FontAwesomeIcon className={iconStyle} icon={faDoorOpen} />
            ログアウト
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default AdminMenu;
