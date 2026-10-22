// src/components/contact/ContactIcons.tsx

type IconProps = { className?: string };

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M30.966 16.234l-9.6-9.6c-0.312-0.312-0.819-0.312-1.131 0s-0.312 0.819 0 1.131l8.234 8.234h-26.069c-0.442 0-0.8 0.358-0.8 0.8s0.358 0.8 0.8 0.8h26.069l-8.234 8.234c-0.312 0.312-0.312 0.819 0 1.131 0.156 0.156 0.361 0.234 0.566 0.234s0.409-0.078 0.566-0.234l9.6-9.6c0.312-0.312 0.312-0.819 0-1.131z" />
    </svg>
  );
}
