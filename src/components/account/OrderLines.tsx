// src/components/account/OrderLines.tsx

import Image from "next/image";
import Link from "next/link";
import type { GQLOrderLineItem } from "@/types/account";

export default function OrderLines({ items }: { items: GQLOrderLineItem[] }) {
  return (
    <ul className="flex flex-col divide-y divide-line border border-line">
      {items.map((item, index) => {
        const product = item.product?.node;
        return (
          <li key={`${item.productId}-${index}`} className="flex items-center gap-4 px-6 py-4">
            {product?.image ? (
              <Image
                src={product.image.sourceUrl}
                alt={product.image.altText || product.name}
                width={56}
                height={56}
                className="size-14 shrink-0 border border-line object-cover"
              />
            ) : (
              <div className="size-14 shrink-0 border border-line bg-cream" />
            )}

            <div className="min-w-0 flex-1">
              {product?.slug ? (
                <Link
                  href={`/product/${product.slug}`}
                  className="font-mono text-[14px] text-ink-dark hover:text-blue"
                >
                  {product.name}
                </Link>
              ) : (
                <span className="font-mono text-[14px] text-ink-dark">Product removed</span>
              )}
              <p className="font-mono text-[12px] text-muted-alt">
                &times; {item.quantity ?? 0}
              </p>
            </div>

            <span className="font-mono text-[14px] font-bold text-ink-dark">
              {item.total ?? "—"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
