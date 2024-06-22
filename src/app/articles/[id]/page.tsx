"use client";

import React from "react";
import Article from "@/components/Article";

type Params = {
  id: string;
};

const Page: React.FC<{ params: Params }> = ({ params }) => {
  return (
    <main>
      <Article id={params.id} />
    </main>
  );
};

export default Page;
