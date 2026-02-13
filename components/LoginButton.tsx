"use client";

import { authClient } from "@/utils/auth-client";
import { useEffect } from "react";

export const LoginButton = () => {
  const { data } = authClient.useSession();
  const loggedIn = Boolean(data?.session);

  const handleLogin = () => {
    authClient.signIn.social({ provider: "google" });
  };
  return (
    <button
      className="rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1 text-sm text-slate-200 shadow-sm cursor-pointer hover:opacity-80 transition"
      onClick={() => handleLogin()}
    >
      {loggedIn ? "Sign out" : "Sign in with Google"}
    </button>
  );
};
