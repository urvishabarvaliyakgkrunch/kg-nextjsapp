// src/components/account/AuthPanel.tsx
"use client";

import { useState } from "react";
import LoginForm from "@/components/account/LoginForm";
import SignupForm from "@/components/account/SignupForm";

type Tab = "login" | "signup";

export default function AuthPanel({ initialTab = "login" }: { initialTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);

  const tabClass = (value: Tab) =>
    `h-12 flex-1 font-sans text-[14px] font-semibold transition-colors ${
      tab === value ? "bg-ink-dark text-white" : "bg-cream text-ink"
    }`;

  return (
    <div className="mx-auto w-full max-w-[670px]">
      {/* Two tabs, not two pages — the shopper keeps whatever they typed when switching */}
      <div role="tablist" aria-label="Account access" className="flex overflow-hidden rounded-btn">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "login"}
          onClick={() => setTab("login")}
          className={tabClass("login")}
        >
          Login
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "signup"}
          onClick={() => setTab("signup")}
          className={tabClass("signup")}
        >
          Sign Up
        </button>
      </div>

      <div className="mt-8">{tab === "login" ? <LoginForm /> : <SignupForm />}</div>
    </div>
  );
}
