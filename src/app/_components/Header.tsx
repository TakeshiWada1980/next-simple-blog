"use client";

import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import AdminMenuButton from "./elements/AdminMenuButton";

interface Props {
  isAdminMenuOpen: boolean;
  setIsAdminMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  adminMenuButtonRef: React.RefObject<HTMLButtonElement>;
}

const Header: React.FC<Props> = ({
  isAdminMenuOpen,
  setIsAdminMenuOpen,
  adminMenuButtonRef,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-slate-800 text-white px-3 sm:px-0 shadow-md z-50">
      <nav className="container mx-auto flex justify-between items-center md:w-2/3 xl:w-1/2">
        <Link href="/" className="py-3 font-bold">
          Blog
        </Link>
        <div className="space-x-4">
          <Link href="/contact" className="py-3">
            <FontAwesomeIcon className="mr-2" icon={faEnvelope} />
            お問い合わせ
          </Link>
          <AdminMenuButton
            isMenuOpen={isAdminMenuOpen}
            setIsMenuOpen={setIsAdminMenuOpen}
            buttonRef={adminMenuButtonRef}
          />
        </div>
      </nav>
    </header>
  );
};

export default Header;
