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

    if (session === null) {
      router.replace("/login");
    }
  }, [router, session]);

  return session;
};

export default useRouteGuard;
