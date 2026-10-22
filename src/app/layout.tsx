// src/app/layout.tsx

import type { Metadata } from "next";import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import DisclaimerBar from "@/components/layout/DisclaimerBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import NoticeToast from "@/components/ui/NoticeToast";
import { SpeedInsights } from "@vercel/speed-insights/next";
import TagadaTracker from "@/components/tracking/TagadaTracker";
import TagadaReturn from "@/components/tracking/TagadaReturn";
import AliaPopups from "@/components/tracking/AliaPopups";
import SessionExtras from "@/components/layout/SessionExtras";
import { getGlobalData } from "@/lib/queries/global";
import { getFreeShippingMinimum } from "@/lib/shippingRules";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

// The age gate's register call waits on WordPress sending its welcome mail. Vercel's default
// function limit cuts that off with an HTML error page, which the browser then fails to parse.
export const maxDuration = 60;

export const metadata: Metadata = {
  title: {
    default: "Elixser Peptides — High-Purity Research Peptides",
    template: "%s | Elixser Peptides",
  },
  description:
    "High-purity research peptides. Triple-tested in the USA. A signed COA on every batch we ship.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  // Defaults for every page. Each page's own title and description override these;
  // the image comes from opengraph-image.tsx without being named here.
  openGraph: {
    type: "website",
    siteName: "Elixser Peptides",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Week-long cache shared with every page — client navigation never asks WordPress again
  const [{ topBars, header, footer }, freeShippingMin] = await Promise.all([
    getGlobalData(),
    getFreeShippingMinimum(),
  ]);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="flex flex-col min-h-screen">
        <AnnouncementBar items={topBars.announcementItems} />
        <DisclaimerBar text={topBars.disclaimerText} />
        <Header data={header} />
        <main className="flex-1">{children}</main>
        <Footer data={footer} />
        <CartDrawer freeShippingMin={freeShippingMin} />
        {/* Woo notice toast — bottom-centre, 3s, same as the WP snippet */}
        <NoticeToast />
        {/* Tracker runs on every page so Tagada can credit the right campaign */}
        <TagadaTracker />
        <TagadaReturn />
        {/* Scratch popup + Mystery Discount button load for everyone, including visitors still at the 21+ gate */}
        <AliaPopups />
        <SpeedInsights />
        {/* Reads the signed-in cookie — isolated here so only this slice is request-time;
            the rest of the layout (and the page inside <main>) can still prerender/cache. */}
        <Suspense fallback={null}>
          <SessionExtras />
        </Suspense>
      </body>
    </html>
  );
}
