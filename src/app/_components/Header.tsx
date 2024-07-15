"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import AdminMenuButton from "./elements/AdminMenuButton";
import useAuth from "@/app/_hooks/useAuth";
import InfoToast from "@/app/_components/elements/InfoToast";

interface Props {
  isAdminMenuOpen: boolean;
  setIsAdminMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  adminMenuButtonRef: React.RefObject<HTMLButtonElement>;
}

const Header: React.FC<Props> = (props) => {
  const { isAdminMenuOpen, setIsAdminMenuOpen, adminMenuButtonRef } = props;
  const { session, isLoading } = useAuth();

  // ログイン状態のトースト表示
  const [toastMsg, setToastMsg] = React.useState("");
  useEffect(() => {
    if (session === null) {
      setToastMsg("ログアウトしました。");
    } else if (session !== undefined) {
      setToastMsg("ログインしました。");
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
      <InfoToast msg={toastMsg} />
    </>
  );
};

export default Header;
