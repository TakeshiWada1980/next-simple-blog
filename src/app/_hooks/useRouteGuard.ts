import useAuth from "@/app/_hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Session } from "@supabase/supabase-js";

const useRouteGuard = (): Session | null | undefined => {
  const router = useRouter();
  const { session } = useAuth();

  useEffect(() => {
    // sessionがundefinedの場合は読み込み中なので何もしない
    if (session === undefined) {
      return;
    }

    // 即時実行関数を使用して非同期処理を扱う
    const redirect = async () => {
      if (session === null) {
        console.error("ログインしていません。");
        await router.replace("/login");
      }
    };

    redirect();
  }, [router, session]);

  return session;
};

export default useRouteGuard;
