"use client";

import { useSyncExternalStore } from "react";
import { readUnlockedEmail, subscribeToUnlock } from "@/lib/nda-unlock";

/** The email a signed NDA was confirmed for (null until the visitor has passed the NDA check). */
export function useNdaUnlockedEmail(): string | null {
  return useSyncExternalStore(subscribeToUnlock, readUnlockedEmail, () => null);
}
