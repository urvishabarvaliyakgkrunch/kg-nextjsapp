// src/lib/searchHighlight.ts
// Pure helper: cuts a text into pieces so the typed letters can be shown bold.

export interface HighlightPiece {
  text: string;
  isMatch: boolean;
}

// Escapes characters like "[" so a typed word can never break the regex
function escapeRegex(word: string): string {
  return word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function splitHighlight(text: string, query: string): HighlightPiece[] {
  const words = query.trim().split(/\s+/).filter(Boolean).map(escapeRegex);
  if (words.length === 0) return [{ text, isMatch: false }];

  // Brackets in the pattern keep the matched parts inside split()'s result
  const pattern = new RegExp(`(${words.join("|")})`, "gi");
  return text
    .split(pattern)
    .filter(Boolean)
    .map((part) => ({ text: part, isMatch: new RegExp(`^(${words.join("|")})$`, "i").test(part) }));
}
