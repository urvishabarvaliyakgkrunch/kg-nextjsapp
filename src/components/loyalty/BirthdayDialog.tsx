// src/components/loyalty/BirthdayDialog.tsx
"use client";

import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import { toBirthdayDate } from "@/lib/birthday";

interface Props {
  campaignId: number;
  onClose: () => void;
  onSaved: (date: string) => void;
}

const BOX =
  "h-[34px] rounded-[4px] border border-line bg-white text-center font-mono text-[13px] text-ink outline-none focus:border-blue";

// Day / Month / Year popup, same fields as the live WPLoyalty widget
export default function BirthdayDialog({ campaignId, onClose, onSaved }: Props) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function save() {
    const date = toBirthdayDate(day, month, year);
    if (!date) {
      setError("Enter a valid date of birth.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/loyalty/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthday: date, campaignId }),
      });
      if (!res.ok) throw new Error("Save failed");
      onSaved(date);
    } catch {
      setError("Could not save your birthday. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Update birthday"
        className="w-full max-w-[360px] rounded-[8px] border border-line bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-end justify-center gap-2">
          <label className="flex flex-col items-center gap-1 font-mono text-[12px] font-bold text-ink-dark">
            Day
            <input value={day} onChange={(e) => setDay(e.target.value.replace(/\D/g, ""))} inputMode="numeric" maxLength={2} placeholder="dd" className={`${BOX} w-[56px]`} />
          </label>
          <label className="flex flex-col items-center gap-1 font-mono text-[12px] font-bold text-ink-dark">
            Month
            <input value={month} onChange={(e) => setMonth(e.target.value.replace(/\D/g, ""))} inputMode="numeric" maxLength={2} placeholder="mm" className={`${BOX} w-[56px]`} />
          </label>
          <label className="flex flex-col items-center gap-1 font-mono text-[12px] font-bold text-ink-dark">
            Year
            <input value={year} onChange={(e) => setYear(e.target.value.replace(/\D/g, ""))} inputMode="numeric" maxLength={4} placeholder="yyyy" className={`${BOX} w-[72px]`} />
          </label>
        </div>

        {error && (
          <p role="alert" className="mt-3 text-center font-mono text-[12px] text-danger">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="mx-auto mt-4 flex h-[40px] items-center justify-center gap-2 rounded-[4px] bg-blue px-5 font-mono text-[13px] font-medium text-white transition-colors hover:bg-atc-hover disabled:opacity-70"
        >
          {saving && <Spinner className="h-4 w-4 border-2" />}
          {saving ? "Saving…" : "Update Birthday"}
        </button>
      </div>
    </div>
  );
}
