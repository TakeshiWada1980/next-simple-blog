"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Header from "@/app/_components/Header";
import AdminMenu from "@/app/_components/AdminMenu";

type Props = {
  children: React.ReactNode;
};

const MOUSE_DOWN = "mousedown";

const PageContainer = ({ children }: Props) => {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState<boolean>(false);
  const adminMenuRef = useRef<HTMLDivElement>(null);
  const adminMenuButtonRef = useRef<HTMLButtonElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent | TouchEvent) => {
    if (
      adminMenuRef.current &&
      !adminMenuRef.current.contains(e.target as Node) &&
      adminMenuButtonRef.current &&
      !adminMenuButtonRef.current.contains(e.target as Node)
    ) {
      setIsAdminMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isAdminMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isAdminMenuOpen, handleClickOutside]);

  return (
    <>
      <Header
        isAdminMenuOpen={isAdminMenuOpen}
        setIsAdminMenuOpen={setIsAdminMenuOpen}
        adminMenuButtonRef={adminMenuButtonRef}
      />
      <main className="container mx-auto md:w-2/3 xl:w-1/2">
        <div className="relative h-full px-3 mt-16">
          <div>{children}</div>
        </div>
        <AdminMenu
          isOpen={isAdminMenuOpen}
          setIsOpen={setIsAdminMenuOpen}
          adminMenuRef={adminMenuRef}
        />
      </main>
    </>
  );
};

export default PageContainer;
