// src/types/coas.ts

import type { MetaEntry } from "./product";

// ── Raw ACF shapes from WPGraphQL ───────────────
export interface GQLCoaProduct {
  databaseId: number;
  name: string | null;
  metaData: MetaEntry[] | null;
}

// Field names match the "COA Page Field Next" ACF group, camelCased by WPGraphQL
export interface GQLCoasPageFields {
  heroSmallHeading: string | null;
  heroMainTitle: string | null;
  heroDescription: string | null;
  heroStats: { statLabel: string | null; statNumber: string | null; statSuffix: string | null }[] | null;

  howWeVerifySmallHeading: string | null;
  howWeVerifyTitle: string | null;
  verificationSteps: { stepTitle: string | null; stepDescription: string | null }[] | null;
  labPartnerNote: string | null;

  verifySectionSmallHeading: string | null;
  verifySectionTitle: string | null;
  verifySectionDescription: string | null;
  helpText: string | null;
  helpEmail: string | null;

  sampleCoasSmallHeading: string | null;
  sampleCoasTitle: string | null;
  sampleCoasDescription: string | null;
  // Relationship field — only Product nodes carry name/metaData
  coasProductSelect: { nodes: Partial<GQLCoaProduct>[] } | null;
}

// ── Clean shapes the COAs components receive ───
export interface CoasHeading {
  smallHeading: string;
  title: string;
  description: string;
}

export interface CoasHeroData extends CoasHeading {
  stats: { label: string; value: number; suffix?: string }[];
}

export interface HowWeVerifyData {
  smallHeading: string;
  title: string;
  steps: { title: string; description: string }[];
  // WYSIWYG HTML — the lab name is bolded in the editor
  labPartnerHtml: string;
}

export interface SampleCoaItem {
  index: number;
  name: string;
  dose: string;
  tags: string[];
  href: string;
}

export interface VerifyVialData extends CoasHeading {
  helpText: string;
  helpEmail: string;
}

export interface CoasPageData {
  hero: CoasHeroData;
  howWeVerify: HowWeVerifyData;
  verifyVial: VerifyVialData;
  samples: CoasHeading & { items: SampleCoaItem[] };
}
