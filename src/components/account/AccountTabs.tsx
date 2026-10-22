// src/components/account/AccountTabs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { ACCOUNT_TABS } from "@/lib/accountCopy";

// Dashboard matches only itself; the rest also match their sub-pages, e.g. /account/orders/123
function isActive(pathname: string, href: string): boolean {
  if (href === "/account") return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

// Natural width on phones so the row scrolls; equal columns from md up so it stays
// on one line with every tile the same height
const TILE =
  "flex shrink-0 items-center justify-center whitespace-nowrap px-5 py-[18px] text-center font-mono text-[13px] font-bold transition-colors md:flex-1 md:shrink md:px-2";

const REST = "bg-ink-dark text-white hover:bg-dark";

export default function AccountTabs() {
  const pathname = usePathname();

  return (
    <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
      <nav aria-label="Account" className="mx-auto flex w-max md:w-full md:max-w-[1140px]">
        {ACCOUNT_TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive(pathname, tab.href) ? "page" : undefined}
            className={`${TILE} ${
              isActive(pathname, tab.href) ? "bg-blue text-white" : REST
            }`}
          >
            {tab.label}
          </Link>
        ))}

        {/* Logging out changes server state, so it is a form button, not a link */}
        <form action={logoutAction} className="flex shrink-0 md:flex-1 md:shrink">
          <button type="submit" className={`${TILE} w-full ${REST}`}>
            Logout
          </button>
        </form>
      </nav>
    </div>
  );
}
