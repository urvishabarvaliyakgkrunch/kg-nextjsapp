// src/components/ui/Skeleton.tsx

interface Props {
  // Size and corner radius come from the caller, e.g. "h-4 w-32 rounded-chip"
  className?: string;
}

// One grey shimmering block. Every page skeleton is built by stacking these.
export default function Skeleton({ className = "" }: Props) {
  return (
    <span
      // It carries no information, so screen readers skip it
      aria-hidden="true"
      // globals.css uses this attribute to stop the shimmer for reduced-motion users
      data-skeleton
      className={`block animate-shimmer bg-[linear-gradient(90deg,var(--color-gray-light)_0%,var(--color-white)_50%,var(--color-gray-light)_100%)] bg-[length:200%_100%] ${className}`}
    />
  );
}
