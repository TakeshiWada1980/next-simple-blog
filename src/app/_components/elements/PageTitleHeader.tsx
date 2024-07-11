"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
};

const PageTitleHeader: React.FC<Props> = ({ children }) => {
  return <h1 className="text-2xl text-slate-800 font-bold">{children}</h1>;
};

export default PageTitleHeader;
