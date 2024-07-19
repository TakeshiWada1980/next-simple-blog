"use client";

import React from "react";
import useRouteGuard from "@/app/_hooks/useRouteGuard";

interface Props {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: Props) => {
  const isAuthenticated = useRouteGuard();
  if (!isAuthenticated) {
    return null;
  }
  // ログイン(認証済み)が確認できてから子コンポーネントをレンダリング
  return <>{children}</>;
};

export default AdminLayout;
