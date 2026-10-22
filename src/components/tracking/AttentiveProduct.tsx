// src/components/tracking/AttentiveProduct.tsx
"use client";

import { useEffect } from "react";
import { buildAttentiveProduct } from "@/lib/attentive";

interface Props {
  productId: number;
  name: string;
  type: string;
  price: number;
  image: string;
  variationId: number | null;
}

// Puts the product on window.attn_product while its page is open.
// It renders nothing. It only sets the value for Attentive to read.
export default function AttentiveProduct({
  productId,
  name,
  type,
  price,
  image,
  variationId,
}: Props) {
  useEffect(() => {
    window.attn_product = buildAttentiveProduct({
      productId,
      name,
      type,
      price,
      image,
      variationId,
    });

    // Leaving the page must clear it, or the next page would report this product
    return () => {
      window.attn_product = undefined;
    };
  }, [productId, name, type, price, image, variationId]);

  return null;
}
