"use client";

import { useSyncExternalStore } from "react";

/**
 * Who just submitted a form, for the personalised /thank-you page ("Thank You, <name>!",
 * "Your application as a Buyer…"). Kept in sessionStorage for this tab only — nothing goes in the URL —
 * and the page falls back to the plain "Thank You!" when it's empty (e.g. someone opens /thank-you directly).
 */
const KEY = "apt.thankYou";

export type ThankYouInfo = { name: string; role?: "Buyer" | "Seller" | "Both" };

export function rememberThankYou(info: ThankYouInfo) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(info));
  } catch {
    // Storage blocked — the thank-you page just shows the plain version.
  }
}

const noop = () => () => {};
const readRaw = () => {
  try {
    return window.sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
};

/** The remembered submitter, or null. (null on the server and during hydration, then the real value.) */
export function useThankYouInfo(): ThankYouInfo | null {
  const raw = useSyncExternalStore(noop, readRaw, () => null);
  if (!raw) return null;
  try {
    const info = JSON.parse(raw) as Partial<ThankYouInfo>;
    return typeof info.name === "string" && info.name.trim() ? (info as ThankYouInfo) : null;
  } catch {
    return null;
  }
}
