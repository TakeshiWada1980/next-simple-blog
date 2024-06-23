"use client";

import React from "react";
import Post from "./_components/Post";

type Params = {
  id: string;
};

const Page: React.FC<{ params: Params }> = ({ params }) => {
  return (
    <main>
      <Post id={params.id} />
    </main>
  );
};

export default Page;
