"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import validationSchema from "./_types/ValidationSchema";
import submissionResponse from "./_types/SubmissionResponse";
import formData from "./_types/FormBody";
import { contactApiEndpoint } from "@/app/_utils/envConfig";
import delayedPostFetcher from "@/app/_utils/delayedPostFetcher";
import FetchLoading from "@/app/_components/elements/FetchLoading";
import ErrorMessage from "@/app/_components/elements/ErrorMessage";
import cn from "classnames";

// スタイル設定
const styles = {
  // label要素、input要素、validateMsg(p)要素のコンテナ
  container: "flex mt-6 flex-col md:flex-row w-full",

  // labelのスタイル
  label: "w-full md:w-2/12 md:mt-3 mb-2",

  // input要素とvalidateMsg(p)要素のコンテナ
  subContainer: "w-full md:w-10/12",

  // テキストボックスとテキストエリアのスタイル
  input:
    "w-full px-3 py-3 border rounded-md duration-200 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent",

  // テキストボックスとテキストエリアののスタイル（無効時）
  disabledInput: "hover:cursor-not-allowed bg-gray-100",

  // 検証エラー表示用のスタイル pタグに適用
  validationMessage: "text-red-500 text-sm mt-1",

  // 「送信」と「クリア」の共通のボタンスタイル
  button: "px-4 py-2 font-bold rounded-md",

  // 「送信」ボタンのスタイル
  submitButton: "bg-slate-600 hover:bg-slate-800 text-white",

  // 「クリア」ボタンのスタイル
  clearButton:
    "bg-slate-300 hover:bg-slate-400 text-slate-700 hover:text-slate-50",

  // 「送信」と「クリア」の共通のボタンスタイル（無効時）
  disabledButton:
    "bg-gray-100 text-gray-400 hover:bg-gray-100 hover:text-gray-400 hover:cursor-not-allowed",
};

// 動作確認のために、応答遅延を設定した fetcher を使用
const fetcher = delayedPostFetcher<formData, submissionResponse>(2000);

const Contact = () => {
  // prettier-ignore
  const {
    reset, register, handleSubmit, formState: { errors, isSubmitting },
  } = useForm<formData>({ mode: "onChange",resolver: zodResolver(validationSchema)});

  const onSubmit = async (data: formData) => {
    // console.log(JSON.stringify(data)); // フォームの入力内容を確認(デバッグ用)
    try {
      const res = await fetcher(contactApiEndpoint, data);
      if (res.message === "success!") {
        console.log(`フォーム送信成功 \n${JSON.stringify(res)}`);
        alert("フォーム送信が完了しました。");
        reset();
      } else {
        throw new Error(`Server Response => ${JSON.stringify(res)}`);
      }
    } catch (error) {
      alert(`フォーム送信失敗\n${error}`);
    }
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="mt-5">
      <h1 className="text-xl font-bold">お問合わせフォーム</h1>

      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        {/* 名前 */}
        <div className={styles.container}>
          <label htmlFor="name" className={styles.label}>
            お名前
          </label>
          <div className={styles.subContainer}>
            <input
              {...register("name")}
              id="name"
              type="text"
              className={cn(styles.input, isSubmitting && styles.disabledInput)}
              placeholder="お名前を入力してください。"
              disabled={isSubmitting}
            />
            <ErrorMessage message={errors.name?.message} />
          </div>
        </div>
        {/* メールアドレス */}
        <div className={styles.container}>
          <label htmlFor="email" className={styles.label}>
            メールアドレス
          </label>
          <div className={styles.subContainer}>
            <input
              {...register("email")}
              id="email"
              type="email"
              className={cn(styles.input, isSubmitting && styles.disabledInput)}
              placeholder="メールアドレスを入力してください。"
              disabled={isSubmitting}
            />
            <ErrorMessage message={errors.email?.message} />
          </div>
        </div>
        {/* 本文 */}
        <div className={styles.container}>
          <label htmlFor="message" className={styles.label}>
            本文
          </label>
          <div className={styles.subContainer}>
            <textarea
              {...register("message")}
              id="message"
              className={cn(styles.input, isSubmitting && styles.disabledInput)}
              rows={6}
              placeholder="本文を入力してください。"
              disabled={isSubmitting}
            />
            <ErrorMessage message={errors.message?.message} />
          </div>
        </div>
        {/* クリアボタンと送信ボタン */}
        <div className="mt-4 flex justify-center space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              styles.button,
              styles.submitButton,
              isSubmitting && styles.disabledButton
            )}
          >
            送信
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            className={cn(
              styles.button,
              styles.clearButton,
              isSubmitting && styles.disabledButton
            )}
            onClick={handleReset}
          >
            クリア
          </button>
        </div>
      </form>
      <div className="flex justify-center">
        {isSubmitting && <FetchLoading msg="フォームの情報を送信中です..." />}
      </div>
    </div>
  );
};

export default Contact;
