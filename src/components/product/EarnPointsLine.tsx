// src/components/product/EarnPointsLine.tsx

interface Props {
  // Exact wording from WPLoyalty, e.g. "Purchase & earn 100 points!"
  message: string;
}

// Sits above the bundle box. WordPress owns both the number and the sentence, so when the
// client edits the campaign message in wp-admin this line changes with it.
export default function EarnPointsLine({ message }: Props) {
  if (!message) return null;

  return <p className="p-2.5 text-[14px] text-chip-text">{message}</p>;
}
