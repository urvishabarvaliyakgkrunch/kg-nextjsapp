// src/components/layout/DisclaimerBar.tsx

export default function DisclaimerBar({ text }: { text: string }) {
  if (!text) return null;

  return (
    <div className="flex w-full items-center justify-center bg-[#1a1a1a] text-center font-mono text-[13px] leading-[19px] font-semibold uppercase tracking-[0.04em] text-white py-[7px] px-[15px]">
      {text}
    </div>
  );
}
