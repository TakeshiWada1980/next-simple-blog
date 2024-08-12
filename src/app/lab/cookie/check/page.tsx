"use client";

import React from "react";
import useGetRequest from "@/app/_hooks/useGetRequest";
import FetchLoading from "@/app/_components/elements/FetchLoading";
import FetchError from "@/app/_components/elements/FetchError";
import composeApiErrorMessage from "@/app/_utils/composeApiErrorMsg";

const Posts = () => {
  const url = "/api/admin/lab/cookie/check";
  const { data, error } = useGetRequest<any>(url);

  // Fetch failed
  if (error) {
    <FetchError apiEndpoint={url} message={composeApiErrorMessage(error)} />;
  }

  // Fetch in progress
  if (!data) {
    return <FetchLoading msg="情報を読み込んでいます..." />;
  }

  const payload = data.data as NonNullable<any>;

  return (
    <div className="mt-5 flex flex-col justify-center ">
      {JSON.stringify(payload)}
    </div>
  );
};

export default Posts;
