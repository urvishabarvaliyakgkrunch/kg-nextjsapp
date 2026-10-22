// src/components/home/CertificateOfAnalysis.tsx

import Image from "next/image";
import CoaLookupForm from "@/components/home/CoaLookupForm";
import type { CoaSectionData } from "@/types/home";

export default function CertificateOfAnalysis({ data }: { data: CoaSectionData }) {
  if (!data.leftTitle && !data.rightMainHeading) return null;

  return (
    <section aria-label="Certificate of Analysis" className="bg-white px-5">
      <div className="mx-auto w-full max-w-[1300px] py-[30px] min-[1025px]:py-[60px]">
        <div className="grid grid-cols-1 gap-5 min-[900px]:grid-cols-2 min-[900px]:overflow-hidden">
          {/* Left — sample COA document · live mobile pad 15px */}
          <div className="flex flex-col rounded-[12px] border border-lot-border bg-white p-[15px] min-[768px]:p-[30px] min-[900px]:rounded-none min-[900px]:border-r min-[900px]:border-lot-border">
            <h2 className="font-display text-[16px] font-bold mt-[8px] mb-[16px] leading-[1.25] tracking-[-0.3px] text-ink-dark uppercase min-[768px]:text-[26px] min-[1025px]:text-[18px] min-[1025px]:leading-[24px] min-[1025px]:tracking-[-0.56px]">
              {data.leftTitle}
            </h2>
            {data.leftLabInfo && (
              <p className="font-mono text-[11px] font-medium leading-[18px] tracking-[1.4px] text-[#0a0a0a] uppercase">
                {data.leftLabInfo}
              </p>
            )}

            <dl className="mt-6 flex flex-col">
              {data.reportRows.map((row, i) => (
                <div
                  key={i}
                  className={`flex items-baseline gap-4 py-[11px] ${i < data.reportRows.length - 1 ? "border-b border-lot-border" : ""}`}
                >
                  <dt className="shrink-0 font-mono text-[10px] font-normal leading-4 tracking-[2.2px] text-muted uppercase w-[25%]">
                    {row.label}
                  </dt>
                  <dd className="min-w-0 break-words text-right font-mono text-[15px] font-medium leading-[22px] text-ink-dark [overflow-wrap:anywhere]">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right — batch verification */}
          <div className="relative flex min-h-[420px] flex-col justify-center overflow-hidden rounded-[12px] px-5 py-8 min-[768px]:p-[30px] min-[900px]:min-h-full min-[900px]:rounded-none">
            {data.rightBackgroundImage && (
              <Image
                src={data.rightBackgroundImage.src}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 650px"
                className="object-cover object-center"
                aria-hidden="true"
              />
            )}
            <div
              className="absolute inset-0 bg-[linear-gradient(180deg,#FFFFFF00_20%,#FFFFFF_80%)]"
              aria-hidden="true"
            />

            <div className="relative z-10 flex h-full flex-col justify-end">
              {data.rightSmallHeading && (
                <p className="font-mono text-[11px] font-medium leading-[18px] tracking-[2.2px] text-blue uppercase">
                  {data.rightSmallHeading}
                </p>
              )}
              <h3 className="mt-3 font-display text-[32px] font-bold leading-[1.2] tracking-[-0.3px] text-ink-dark md:text-[35px] min-[1025px]:text-[48px] min-[1025px]:leading-[52px] min-[1025px]:tracking-[-1.2px]">
                {data.rightMainHeading}
              </h3>
              {data.rightDescription && (
                <p className="mt-4 whitespace-pre-line font-sans text-[14px] font-normal leading-[1.6] text-ink-dark min-[1025px]:text-[16px] min-[1025px]:leading-[27.5px]">
                  {data.rightDescription}
                </p>
              )}

              <div className="mt-6">
                <CoaLookupForm />
              </div>

              {/* WYSIWYG from WordPress — the email arrives as a ready mailto link */}
              {data.helpTextHtml && (
                <div
                  className="font-mono text-[14px] leading-[18px] font-medium text-center text-[#7a7a7a] [&_a]:text-[#3366ff] [&_a]:transition-colors [&_a:hover]:underline [&_p]:m-0"
                  dangerouslySetInnerHTML={{ __html: data.helpTextHtml }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
