// src/components/product/WriteReviewButton.tsx

interface Props {
  href: string;
}

export default function WriteReviewButton({ href }: Props) {
  return (
    // The form lives on WiserReview, so it opens in a new tab and keeps this page open
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-pill border border-white bg-review-cta px-[18px] py-[11px] text-[14px] font-medium text-white transition-opacity hover:opacity-90"
    >
      Write a Review
    </a>
  );
}
