// src/app/account/loading.tsx

import PageHero from "@/components/common/PageHero";
import Skeleton from "@/components/ui/Skeleton";
import { ACCOUNT_HERO } from "@/lib/accountCopy";

// This URL is the sign-in box for guests and the dashboard for members, so the
// placeholder stays neutral — no tab row that would flash at a signed-out visitor
export default function Loading() {
  return (
    <>
      <PageHero {...ACCOUNT_HERO} />
      <section className="container-site py-10 md:py-[60px]">
        <div className="mx-auto flex w-full max-w-[670px] flex-col gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-[52px] w-full" />
          <Skeleton className="h-[46px] w-full" />
        </div>
      </section>
    </>
  );
}
