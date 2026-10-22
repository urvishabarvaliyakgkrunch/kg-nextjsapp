// src/store/cart.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartTier } from "@/types";
import { unitPriceFor } from "@/lib/qtyTiers";

// A simple product's per-bottle price follows its quantity; every other line is left as it is
// and never goes past the stock Woo will sell
function withQtyPrice(item: CartItem): CartItem {
  const quantity = item.maxQty ? Math.min(item.quantity, item.maxQty) : item.quantity;
  const capped = quantity === item.quantity ? item : { ...item, quantity };
  if (!capped.qtyRules || !capped.basePrice) return capped;
  return { ...capped, price: unitPriceFor(capped.basePrice, capped.qtyRules, capped.quantity) };
}

interface CartStore {
  items: CartItem[];
  couponCodes: string[];
  isDrawerOpen: boolean;
  // Which signed-in shopper this cart belongs to ("" while nobody is signed in)
  ownerKey: string;

  addItem: (item: CartItem) => void;
  removeItem: (variationId: number) => void;
  updateQuantity: (variationId: number, quantity: number) => void;
  stepTier: (variationId: number, direction: 1 | -1) => void;
  applyTiers: (byProduct: Record<number, CartTier[]>) => void;
  addCoupon: (code: string) => void;
  removeCoupon: (code: string) => void;
  clearCart: () => void;
  syncOwner: (ownerKey: string) => void;
  replaceCart: (items: CartItem[], couponCodes: string[]) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCodes: [],
      isDrawerOpen: false,
      ownerKey: "",

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.variationId === item.variationId
          );
          const updated = existing
            ? state.items.map((i) =>
                i.variationId === item.variationId
                  ? withQtyPrice({ ...i, quantity: i.quantity + item.quantity })
                  : i
              )
            : [...state.items, withQtyPrice(item)];
          return { items: updated, isDrawerOpen: true };
        });
      },

      removeItem: (variationId) => {
        set((state) => ({
          items: state.items.filter((i) => i.variationId !== variationId),
        }));
      },

      updateQuantity: (variationId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variationId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.variationId === variationId ? withQtyPrice({ ...i, quantity }) : i
          ),
        }));
      },

      // Bundle rule (§A6): the stepper swaps to the next variation instead of
      // changing quantity, because each tier is its own Woo variation and price
      stepTier: (variationId, direction) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.variationId !== variationId) return item;

            const tiers = item.tiers ?? [];
            const index = tiers.findIndex((t) => t.variationId === variationId);
            const next = tiers[index + direction];
            if (index === -1 || !next) return item;

            // Product name carries the tier label, so swap that part too
            const baseName = item.name.split(" - ")[0];
            return {
              ...item,
              variationId: next.variationId,
              name: `${baseName} - ${next.label}`,
              price: next.price,
              regularPrice: next.regularPrice,
            };
          }),
        }));
      },

      // Lines saved before the stepper existed carry no tiers — fill them in and
      // normalise the old "Name — 1 Bottle" wording to the live "Name - 1 Bottle"
      applyTiers: (byProduct) => {
        set((state) => ({
          items: state.items.map((item) => {
            const tiers = byProduct[item.productId];
            if (!tiers) return item;

            // Re-importing products changes variation IDs, so fall back to the
            // tier at the same price rather than leaving a line Woo cannot price
            const current =
              tiers.find((t) => t.variationId === item.variationId) ??
              tiers.find((t) => t.price === item.price);
            if (!current) return item;

            const baseName = item.name.split(/\s+[-–—]\s+/)[0];

            return {
              ...item,
              tiers,
              variationId: current.variationId,
              name: `${baseName} - ${current.label}`,
              price: current.price,
              regularPrice: current.regularPrice,
            };
          }),
        }));
      },

      // Only one coupon at a time: a new code replaces the old one, so the two never stack
      addCoupon: (code) => {
        const clean = code.trim();
        if (!clean) return;
        set((state) =>
          // Woo treats codes case-insensitively, so the same code again changes nothing
          state.couponCodes.length === 1 &&
          state.couponCodes[0].toLowerCase() === clean.toLowerCase()
            ? state
            : { couponCodes: [clean] }
        );
      },

      removeCoupon: (code) => {
        set((state) => ({
          couponCodes: state.couponCodes.filter(
            (c) => c.toLowerCase() !== code.toLowerCase()
          ),
        }));
      },

      clearCart: () =>
        set({ items: [], couponCodes: [], isDrawerOpen: false }),

      // A different account took over this browser — the previous shopper's lines
      // and coupon are not theirs, so start them an empty cart. Signing in on a
      // guest cart keeps it: that cart is already this person's.
      syncOwner: (ownerKey) => {
        const previous = get().ownerKey;
        if (previous === ownerKey) return;
        if (!previous) {
          set({ ownerKey });
          return;
        }
        set({ items: [], couponCodes: [], isDrawerOpen: false, ownerKey });
      },

      // Used when a recovery email is opened: the emailed cart wins over whatever was here
      replaceCart: (items, couponCodes) =>
        set({ items, couponCodes, isDrawerOpen: false }),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "elixser-cart",
      // Don't persist drawer state — always start closed
      partialize: (s) => ({
        items: s.items,
        couponCodes: s.couponCodes,
        ownerKey: s.ownerKey,
      }),
    }
  )
);

// The cart lives in localStorage and each tab keeps its own in-memory copy, so a tab opened
// earlier would add to an out-of-date list and overwrite what another tab just saved. A storage
// event only reaches the OTHER tabs, so reloading the saved cart there keeps every tab in step.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "elixser-cart") void useCart.persist.rehydrate();
  });
}
