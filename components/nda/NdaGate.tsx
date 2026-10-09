"use client";

import { type ReactNode, useEffect, useSyncExternalStore } from "react";
import { OPEN_NDA_EVENT } from "@/components/nda/NdaModal";
import { useNdaUnlockedEmail } from "@/components/nda/useNdaUnlockedEmail";
import { NDA_UNLOCKED_EVENT } from "@/lib/nda-unlock";

/**
 * Keeps the deal intelligence form (the application questionnaire) out of the page until a signed
 * NDA has been confirmed for the visitor's email — "Every design partner signs a mutual NDA before
 * the deal intelligence form is unlocked."
 *
 *  - Locked: renders nothing. Links to `#apply` (hero button, Solutions page buttons, …) open the
 *    NDA modal instead of scrolling to a form that isn't there.
 *  - Unlocked (NDA check passed in this browser, or arriving back from the email-verification
 *    link): renders the form, and scrolls it into view the moment it unlocks.
 *
 * UI only — the CMS rejects applications from emails without a signed NDA.
 */
const noSubscribe = () => () => {};
const hasVerifyToken = () => new URLSearchParams(window.location.search).has("emailVerifyToken");

export function NdaGate({ children }: { children: ReactNode }) {
  const unlockedEmail = useNdaUnlockedEmail();
  // Back from the email-verification link: the visitor already got through the NDA step.
  const verifying = useSyncExternalStore(noSubscribe, hasVerifyToken, () => false);
  const open = Boolean(unlockedEmail) || verifying;

  // Landed on /design-partner#apply (e.g. from the Solutions page) while locked: ask for the NDA.
  useEffect(() => {
    if (!open && window.location.hash === "#apply") {
      window.setTimeout(() => window.dispatchEvent(new Event(OPEN_NDA_EVENT)), 0);
    }
    // Only on first load: unlocking later must not re-open the modal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The NDA check just passed: bring the (now rendered) form into view.
  useEffect(() => {
    const onUnlocked = () => {
      window.setTimeout(() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    };
    window.addEventListener(NDA_UNLOCKED_EVENT, onUnlocked);
    return () => window.removeEventListener(NDA_UNLOCKED_EVENT, onUnlocked);
  }, []);

  // While locked, "#apply" links open the NDA modal.
  useEffect(() => {
    if (open) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const href = (e.target as Element | null)?.closest?.("a[href]")?.getAttribute("href");
      if (href === "#apply" || href?.endsWith("#apply")) {
        e.preventDefault();
        e.stopPropagation();
        window.dispatchEvent(new Event(OPEN_NDA_EVENT));
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [open]);

  return open ? <>{children}</> : null;
}
