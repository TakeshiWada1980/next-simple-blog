"use client";

import React, { useState, useEffect } from "react";
import { CookiesProvider, useCookies } from "react-cookie";

const CookieComponent = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["foo"]);
  const [inputVal, setInputVal] = useState(cookies.foo || "");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setInputVal(cookies.foo || "");
  }, [cookies.foo]);

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
  };

  const handlerDelete = () => {
    removeCookie("foo", { path: "/" });
    setInputVal("");
  };

  const handlerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000; // 24時間をミリ秒で表現
    setCookie("foo", inputVal, {
      path: "/",
      expires: new Date(Date.now() + ONE_DAY_IN_MS), // 24時間後に期限切れ
      // secure: true, // HTTPSでのみ送信
      // sameSite: 'strict', // CSRF保護
      // maxAge: 86400, // 秒単位での有効期限（オプション）
    });
  };

  if (!isClient) {
    return null; // または、ローディング表示などのプレースホルダー
  }

  return (
    <div>
      <form onSubmit={handlerSubmit}>
        <label>
          <input
            className="border border-gray-300"
            type="text"
            name="name"
            onChange={handlerChange}
            value={inputVal}
          />
        </label>
        <button
          type="submit"
          className="ml-2 bg-blue-500 text-white px-2 rounded-md"
        >
          保存
        </button>
        <button
          type="button"
          className="ml-2 bg-red-500 text-white px-2 rounded-md"
          onClick={handlerDelete}
        >
          削除
        </button>
      </form>
      <div>現在の値: {cookies.foo || "未設定"}</div>
    </div>
  );
};

const Page = () => (
  <CookiesProvider>
    <CookieComponent />
  </CookiesProvider>
);

export default Page;
