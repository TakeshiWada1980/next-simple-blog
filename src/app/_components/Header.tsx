"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import AdminMenuButton from "./elements/AdminMenuButton";
import useAuth from "@/app/_hooks/useAuth";
import * as Toast from "@radix-ui/react-toast";

interface Props {
  isAdminMenuOpen: boolean;
  setIsAdminMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  adminMenuButtonRef: React.RefObject<HTMLButtonElement>;
}

const Header: React.FC<Props> = (props) => {
  const { isAdminMenuOpen, setIsAdminMenuOpen, adminMenuButtonRef } = props;
  const { session, isLoading } = useAuth();

  // トースト表示
  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastMsg, setToastMsg] = React.useState("");

  useEffect(() => {
    if (session === null) {
      setToastMsg("ログアウトしました");
      setToastOpen(true);
    } else if (session !== undefined) {
      setToastMsg("ログインしました");
      setToastOpen(true);
    }
  }, [session]);

  const onClick = () => {
    setIsAdminMenuOpen(!isAdminMenuOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-slate-800 text-white px-3 sm:px-0 shadow-md z-10">
        <nav className="container mx-auto flex justify-between items-center md:w-2/3 xl:w-1/2">
          <Link href="/" className="py-3 font-bold" tabIndex={-1}>
            Next.js Simple Blog
          </Link>
          {!isLoading && (
            <div className="space-x-4">
              {session ? (
                <AdminMenuButton
                  onClick={onClick}
                  buttonRef={adminMenuButtonRef}
                />
              ) : (
                <div className="flex gap-x-4">
                  <Link href="/login" className="py-3" tabIndex={-1}>
                    <FontAwesomeIcon className="mr-2" icon={faCircleUser} />
                    ログイン
                  </Link>
                  <Link href="/contact" className="py-3" tabIndex={-1}>
                    <FontAwesomeIcon className="mr-2" icon={faEnvelope} />
                    お問い合わせ
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>
      </header>

      <Toast.Provider swipeDirection="right" duration={3000}>
        <Toast.Root
          className="bg-slate-100 border border-slate-800 rounded-xl shadow-md data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
          open={toastOpen}
          onOpenChange={setToastOpen}
        >
          <Toast.Title className="px-4 py-2">{toastMsg}</Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px]  max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
      </Toast.Provider>
    </>
  );
};

export default Header;
