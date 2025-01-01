import React, { createContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import ApiRequestHeader from "@/app/_types/ApiRequestHeader";

interface AuthContextProps {
  session: Session | null | undefined;
  isLoading: boolean;
  token: string | null;
  apiRequestHeader: ApiRequestHeader;
}

interface Props {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

const AuthProvider: React.FC<Props> = ({ children }) => {
  // useSupabaseSession.ts 相当
  // session => undefined: 取得中, null: 未ログイン, Session: ログイン済み
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiRequestHeader, setApiRequestHeader] = useState<ApiRequestHeader>({
    Authorization: null,
  });

  const fetchSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setSession(session);
    setToken(session?.access_token || null);
    setIsLoading(false);
  };

  const refreshSession = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.refreshSession();
    if (error) {
      console.error("Error refreshing session:", error);
    } else {
      setSession(session);
      setToken(session?.access_token || null);
    }
  };

  useEffect(() => {
    fetchSession();

    // ログイン状況を監視（画面表示に確実に反映さるため）
    const { data: listener } = supabase.auth.onAuthStateChange((e, session) => {
      setSession(session);
      setToken(session?.access_token || null);
      setApiRequestHeader({ Authorization: session?.access_token || null });
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setApiRequestHeader({ Authorization: token });
    if (!session) return;
    const expiresAt = session.expires_at;
    if (expiresAt) {
      const expirationDate = new Date(expiresAt * 1000);
      console.log(`AccessToken期限:${expirationDate.toLocaleString()}`);
      const timeout = expiresAt * 1000 - Date.now() - 60000; // 1分前にリフレッシュ
      const refreshTimeout = setTimeout(refreshSession, timeout);
      return () => clearTimeout(refreshTimeout);
    }
  }, [token, session]);

  return (
    <AuthContext.Provider
      value={{ session, isLoading, apiRequestHeader, token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
