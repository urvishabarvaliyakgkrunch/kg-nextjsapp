// src/components/account/AccountShell.tsx

import AccountTabs from "@/components/account/AccountTabs";
import PageHero from "@/components/common/PageHero";
import { ACCOUNT_HERO } from "@/lib/accountCopy";

// Shared frame for every signed-in page: the same hero, the same tab row, then content
interface Props {
  children: React.ReactNode;
  // Points & Rewards runs 20px wider than the other account pages on the live site
  wide?: boolean;
}

export default function AccountShell({ children, wide = false }: Props) {
  return (
    <>
      <section className="container-site pt-10 md:pt-[60px]">
        <PageHero {...ACCOUNT_HERO} />
      </section>
      <section className="container-site py-10 md:py-[60px]">
        <AccountTabs />
        <div className={`mx-auto mt-10 w-full max-w-[1140px]`}>
          {children}
        </div>
      </section>
    </>
  );
}
