// src/lib/faqMapper.ts
// Turns the FAQ page's ACF response into hero + one flat list for FaqList. Nothing is hardcoded:
// empty fields stay empty until the admin fills them in WordPress.

import { acfHtml, acfText as text } from "@/lib/helper";
import type { FaqPageBlock, FaqPageData, GQLFaqPageFields } from "@/types/faq";

export function toFaqPageData(f: GQLFaqPageFields | null): FaqPageData {
  const blocks: FaqPageBlock[] = [];

  for (const group of f?.faqGroups ?? []) {
    const questions = (group.questions ?? [])
      .map((q) => ({ title: text(q.question), answer: acfHtml(q.answer) }))
      .filter((q) => q.title && q.answer);
    if (questions.length === 0) continue;

    // Live opens with a few questions that sit under no heading — that group is left untitled
    const title = text(group.groupTitle);
    if (title) blocks.push({ type: "group", title });
    blocks.push(...questions.map((q) => ({ type: "question" as const, ...q })));
  }

  const closingTitle = text(f?.closingTitle);
  const closingText = acfHtml(f?.closingText);
  if (closingTitle) blocks.push({ type: "group", title: closingTitle });
  if (closingText) blocks.push({ type: "answer", answer: closingText });

  return {
    hero: {
      eyebrow: text(f?.heroSmallHeading),
      title: text(f?.heroMainTitle),
      description: text(f?.heroDescription),
    },
    blocks,
  };
}
