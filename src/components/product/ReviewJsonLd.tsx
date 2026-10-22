// src/components/product/ReviewJsonLd.tsx

interface Props {
  // Built by buildReviewSchema(). null means there is nothing honest to show.
  schema: object | null;
}

export default function ReviewJsonLd({ schema }: Props) {
  if (!schema) return null;

  // "<" is escaped so review text can never close the script tag early
  const json = JSON.stringify(schema).replace(/</g, "\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
