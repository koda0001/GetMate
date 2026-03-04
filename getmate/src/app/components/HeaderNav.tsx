"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export function HeaderNav({ onLogin }: { onLogin: () => void }) {
  const { data: session } = useSession();

  return (
    <header className="w-auto px-8 py-4 border-b-4 border-[#30364F] bg-[#E1D9BC] shadow-[0_4px_0_#30364F]">
      <div className="font-bold text-2xl tracking-tight">GETMATE</div>
      <div className="flex gap-4">
        {session?.user ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <img
                src={session.user.image || "/default-profile.png"}
                alt={session.user.name || "User"}
                className="w-8 h-8 rounded-full border-2 border-[#30364F]"
              />
              <span className="font-mono text-base text-[#30364F] font-bold">
                {session.user.name || session.user.email || "User"}
              </span>
            </div>

            <button
              onClick={() => window.location.href = `/profile/${session.user.id}`}
              className="bg-white border-2 border-[#30364F] text-[#30364F] px-4 py-2 rounded font-bold shadow hover:bg-[#f3f3f3] transition-colors text-center"
            >
              My Profile
            </button>
            <button
              className="bg-[#30364F] text-[#E1D9BC] px-4 py-2 rounded font-bold shadow hover:bg-[#22253a] transition-colors"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            className="bg-[#30364F] text-[#E1D9BC] px-4 py-2 rounded font-bold shadow hover:bg-[#22253a] transition-colors"
            onClick={onLogin}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}