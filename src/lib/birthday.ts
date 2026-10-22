// src/lib/birthday.ts
// Pure helpers for the birthday popup — no React, safe on server and client.

/** Day/month/year boxes to a real YYYY-MM-DD, or null when it is not a past date. */
export function toBirthdayDate(day: string, month: string, year: string): string | null {
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);
  if (!Number.isInteger(d) || !Number.isInteger(m) || !Number.isInteger(y)) return null;
  if (y < 1900 || m < 1 || m > 12 || d < 1) return null;

  const date = new Date(Date.UTC(y, m - 1, d));
  // Feb 31 rolls into March, so a changed month means the date never existed
  if (date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null;
  if (date.getTime() > Date.now()) return null;

  return `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** "2000-10-06" to "October 6, 2000", the way the live widget prints it. */
export function formatBirthday(value: string): string {
  // Older plugin builds hand back the raw unix timestamp WPLoyalty stores
  if (/^\d{9,11}$/.test(value)) {
    return new Date(Number(value) * 1000).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
