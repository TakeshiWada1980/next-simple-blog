"use client";

import React from "react";
import { useParams } from "next/navigation";
import Post from "./_components/Post";

const Page: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <article>
      <Post id={id} />
    </article>
  );
};

export default Page;
