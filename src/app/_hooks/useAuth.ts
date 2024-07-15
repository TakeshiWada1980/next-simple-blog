import React, { useContext } from "react";
import { AuthContext } from "@/app/_contexts/AuthContext";

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
