"use client";

import React, { useState } from "react";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import PageWrapper from "@/app/_components/elements/PageWrapper";
import { validationSchema, LoginFormData } from "./_type/validationSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "@/app/_components/elements/ErrorMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import cn from "classnames";

export default function Page() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  // prettier-ignore
  const {
    register, handleSubmit, formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ mode: "onChange", resolver: zodResolver(validationSchema)});

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setErrorMsg(error.message);
    } else {
      router.replace("/admin/posts");
    }
  };

  return (
    <PageWrapper pageTitle="管理者ログイン">
      <div className="flex justify-center pt-5">
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 w-full max-w-[400px]"
        >
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              メールアドレス
            </label>
            <input
              {...register("email")}
              type="email"
              name="email"
              id="email"
              placeholder="user@example.com"
              className={cn(
                "bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5",
                {
                  "border-red-500": errors.email,
                  "border-gray-300": !errors.email,
                }
              )}
            />
            <ErrorMessage message={errors.email?.message} />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              パスワード
            </label>
            <input
              {...register("password")}
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className={cn(
                "bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5",
                {
                  "border-red-500": errors.password,
                  "border-gray-300": !errors.password,
                }
              )}
            />
            <ErrorMessage message={errors.password?.message} />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              {isSubmitting ? (
                <div>
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="animate-spin animate-duration-[2000ms] mr-2"
                  />
                  ログイン処理中...
                </div>
              ) : (
                <div>ログイン</div>
              )}
            </button>
            {errorMsg && <ErrorMessage message={errorMsg} />}
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
