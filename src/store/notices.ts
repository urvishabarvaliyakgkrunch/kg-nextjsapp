// src/store/notices.ts
"use client";

import { create } from "zustand";

// Mirrors Woo's wc_add_notice(): WordPress queues a notice server-side and the
// "NOTICE BAR TOAST" snippet turns whatever is queued into a bottom-centre
// toast on the next page load. Only `success` was ever visible there — the
// snippet's JS un-hides the wrapper only when a `.woocommerce-message` exists,
// so queued errors and info notices stayed hidden. We keep the same types so
// call sites read like the Woo originals, and render success only.
export type NoticeType = "success" | "error" | "info";

export interface Notice {
  id: number;
  message: string;
  type: NoticeType;
}

interface NoticeStore {
  notices: Notice[];
  addNotice: (message: string, type?: NoticeType) => void;
  dismissNotice: (id: number) => void;
}

// Monotonic so two identical messages never collide on the same React key
let nextId = 0;

export const useNotices = create<NoticeStore>((set) => ({
  notices: [],

  addNotice: (message, type = "success") => {
    const clean = message.trim();
    if (!clean) return;
    nextId += 1;
    const notice = { id: nextId, message: clean, type };
    set((state) => ({ notices: [...state.notices, notice] }));
  },

  dismissNotice: (id) =>
    set((state) => ({ notices: state.notices.filter((n) => n.id !== id) })),
}));
