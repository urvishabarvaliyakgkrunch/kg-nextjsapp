// src/components/ui/Spinner.tsx

interface Props {
  className?: string;
  // Screen readers need words, not a spinning circle
  label?: string;
}

// Small spinning ring for buttons and tight spots where a skeleton would be too big
export default function Spinner({
  className = "h-6 w-6 border-[3px]",
  label = "Loading",
}: Props) {
  return (
    <span role="status" className="inline-flex items-center">
      <span
        className={`animate-spin rounded-full border-gray-light border-t-dark ${className}`}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
