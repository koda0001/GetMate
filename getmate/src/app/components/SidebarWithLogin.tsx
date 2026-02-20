"use client";
import React, { useState } from "react";
import { LoginModal } from "./LoginModal";
import { HeaderNav } from "./HeaderNav";

export default function SidebarWithLogin() {
  const [loginOpen, setLoginOpen] = useState(false);
  return (
    <>
      <HeaderNav onLogin={() => setLoginOpen(true)} />
      <div className="w-auto p-8 border-r-4 border-[#30364F] bg-[#E1D9BC] flex flex-col gap-8">
        {/* ...add user info, stats, nav here... */}
      </div>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}