// src/components/layout/search/HighlightedText.tsx
import { splitHighlight } from "@/lib/searchHighlight";

interface Props {
  text: string;
  // What the shopper typed — those letters are shown bold
  query: string;
}

// Normal weight text where only the typed letters are bold
export default function HighlightedText({ text, query }: Props) {
  return (
    <>
      {splitHighlight(text, query).map((piece, index) =>
        piece.isMatch ? (
          <strong key={index} className="font-bold">{piece.text}</strong>
        ) : (
          <span key={index}>{piece.text}</span>
        )
      )}
    </>
  );
}
