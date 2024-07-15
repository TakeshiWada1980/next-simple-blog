"use client";

import React, { useState } from "react";
import cn from "classnames";
import {
  faDoorOpen,
  faPenToSquare,
  faFileLines,
  faTag,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import AdminMenuLink from "./elements/AdminMenuLink";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { set } from "date-fns";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  adminMenuRef: React.RefObject<HTMLDivElement>;
}

const AdminMenu: React.FC<Props> = (props: Props) => {
  const { isOpen, setIsOpen, adminMenuRef } = props;
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const menuStyle = cn(
    "fixed bottom-0",
    "container mx-auto md:w-2/3 xl:w-1/2",
    "max-h-[60vh]",
    "text-slate-800 bg-white",
    "border border-slate-300",
    "shadow-lg rounded-t-2xl",
    "transform transition-transform duration-300",
    "overflow-auto",
    isOpen ? "translate-y-0" : "translate-y-full"
  );
  const router = useRouter();
  const closeMenu = () => setIsOpen(false);
  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoggingOut(false);
    }
    // NOTE:トーストを出す
    closeMenu();
    router.replace("/");
  };

  return (
    <div ref={adminMenuRef} className={menuStyle}>
      <div className="p-5 pt-3">
        <h2 className="text-xl text-center tracking-wide pb-3 mt-2 border-b border-slate-300">
          管理者メニュー
        </h2>
        <nav className="flex flex-col gap-2">
          <div className="pt-2">
            <AdminMenuLink
              title="記事の新規作成"
              href="/admin/posts/new"
              icon={faPenToSquare}
              onClick={closeMenu}
            />
            <AdminMenuLink
              title="記事の一覧 (編集・削除)"
              href="/admin/posts"
              icon={faFileLines}
              onClick={closeMenu}
            />
          </div>
          <div className="pt-2 border-t border-slate-300">
            <AdminMenuLink
              title="カテゴリの新規作成"
              href="/admin/categories/new"
              icon={faTag}
              onClick={closeMenu}
            />
            <AdminMenuLink
              title="カテゴリの一覧 (編集・削除)"
              href="/admin/categories"
              icon={faTags}
              onClick={closeMenu}
            />
          </div>
          <div className="pt-2 border-t border-slate-300">
            <AdminMenuLink
              title={"ログアウト" + (isLoggingOut ? "処理..." : "")}
              href="#"
              icon={faDoorOpen}
              onClick={logout}
            />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AdminMenu;
