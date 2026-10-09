/**
 * "NDA signed" state for the Design Partner page.
 *
 * The deal intelligence form is hidden until the visitor proves a signed NDA is on file for their
 * email (the "Already signed NDA" check in the NDA modal). The result is remembered in this browser
 * so a reload — or the trip through the email-verification link — doesn't lock the form again.
 *
 * This is only the UI half: the CMS refuses an application whose email has no signed NDA, so
 * clearing storage or editing it by hand unlocks nothing real.
 */
export const NDA_UNLOCK_KEY = "apt.ndaUnlocked";
/** Dispatched on `window` (detail: { email }) when the form has just been unlocked. */
export const NDA_UNLOCKED_EVENT = "nda-unlocked";
const UNLOCK_DAYS = 30;

type Stored = { email: string; at: number };

// Used when localStorage is blocked, so the form still opens for this visit.
let memoryEmail: string | null = null;

/** The email a signed NDA was found for, or null when locked / expired / no storage. */
export function readUnlockedEmail(): string | null {
  try {
    const raw = window.localStorage.getItem(NDA_UNLOCK_KEY);
    if (raw) {
      const { email, at } = JSON.parse(raw) as Partial<Stored>;
      if (typeof email === "string" && typeof at === "number") {
        if (Date.now() - at <= UNLOCK_DAYS * 86_400_000) return email;
        window.localStorage.removeItem(NDA_UNLOCK_KEY);
      }
    }
  } catch {
    // Unreadable storage — fall through to the in-memory value.
  }
  return memoryEmail;
}

/** For `useSyncExternalStore`: re-read when the form unlocks here or in another tab. */
export function subscribeToUnlock(onChange: () => void): () => void {
  window.addEventListener(NDA_UNLOCKED_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(NDA_UNLOCKED_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Remember the unlock and tell the page (the form reveals itself and scrolls into view). */
export function unlockDealForm(email: string) {
  const normalized = email.trim().toLowerCase();
  memoryEmail = normalized;
  try {
    window.localStorage.setItem(NDA_UNLOCK_KEY, JSON.stringify({ email: normalized, at: Date.now() } satisfies Stored));
  } catch {
    // Storage blocked — the form still opens for this visit via the event below.
  }
  window.dispatchEvent(new CustomEvent(NDA_UNLOCKED_EVENT, { detail: { email: normalized } }));
}
