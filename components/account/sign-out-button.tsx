"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full py-2.5 border border-stone-200 text-[10px] tracking-[0.18em] uppercase text-stone-400 font-normal hover:border-stone-400 hover:text-stone-700 transition-colors"
    >
      Sign Out
    </button>
  );
}