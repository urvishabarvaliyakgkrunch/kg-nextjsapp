// src/types/attentive.ts

// One product on the product page. Attentive reads this from window.attn_product.
export interface AttentiveProduct {
  name: string;
  category: string;
  productId: string;
  price: { value: string; currency: string };
  productVariantId: string | null;
  productImage: string;
  quantity: number;
}

// One line inside window.attn_cart.products
export interface AttentiveCartLine {
  product_id: number;
  variation_id: number;
  quantity: number;
  name: string;
  price: string;
  image: string;
}

// Attentive reads this from window.attn_cart
export interface AttentiveCart {
  products: AttentiveCartLine[];
  cartTotal: string;
}

// Tell TypeScript about the globals that Attentive's script reads
declare global {
  interface Window {
    attn_product?: AttentiveProduct;
    attn_cart?: AttentiveCart;
  }
}
