"use client";
import React, { useState } from "react";
import { LoginModal } from "./LoginModal";
import { HeaderNav } from "./HeaderNav";

export default function SidebarWithLogin() {
  const [loginOpen, setLoginOpen] = useState(false);
  return (
    <>
      <HeaderNav onLogin={() => setLoginOpen(true)} />

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}