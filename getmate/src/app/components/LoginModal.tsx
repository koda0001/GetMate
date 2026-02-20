"use client";
import React from "react";
import { signIn } from "next-auth/react";

export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-[#E1D9BC] border-4 border-[#30364F] shadow-[8px_8px_0_#30364F] p-8 min-w-[320px] relative rounded-sm flex flex-col items-center">
        <button
          className="absolute top-2 right-2 text-xl font-bold text-[#30364F] bg-transparent border-none cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-[#30364F] font-mono">Sign in or Register</h2>
        <div className="flex flex-col gap-4 w-full">
          <button
            className="bg-[#5865F2] text-white font-bold py-2 px-4 rounded-sm border-2 border-[#30364F] shadow-[4px_4px_0_#30364F] hover:bg-[#4752c4] transition-colors font-mono"
            onClick={() => signIn("discord")}
          >
            Continue with Discord
          </button>
          <button
            className="bg-[#4285F4] text-white font-bold py-2 px-4 rounded-sm border-2 border-[#30364F] shadow-[4px_4px_0_#30364F] hover:bg-[#357ae8] transition-colors font-mono"
            onClick={() => signIn("google")}
          >
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
