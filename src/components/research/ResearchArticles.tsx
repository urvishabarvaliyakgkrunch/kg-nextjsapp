// src/components/research/ResearchArticles.tsx

import ResearchSectionHeading from "@/components/research/ResearchSectionHeading";
import ArticleCard from "@/components/research/ArticleCard";
import ArticlesNotifyCta from "@/components/research/ArticlesNotifyCta";
import type { ResearchPageData } from "@/types/research";

export default function ResearchArticles({ data }: { data: ResearchPageData["articles"] }) {
  return (
    <section
      aria-label="Articles and editorial"
      className="bg-hero-surface px-5 min-[768px]:px-10 min-[1025px]:px-[60px]"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 py-10 min-[1025px]:pb-[90px] min-[1025px]:pt-[60px]">
        <ResearchSectionHeading
          eyebrow={data.smallHeading}
          title={data.title}
          description={data.description}
        />

        <div className="grid grid-cols-1 gap-5 min-[768px]:grid-cols-2 min-[1025px]:p-[10px]">
          {data.items.map((article) => (
            <ArticleCard key={article.title} {...article} />
          ))}
        </div>

        <ArticlesNotifyCta text={data.notifyText} button={data.notifyButton} />
      </div>
    </section>
  );
}
