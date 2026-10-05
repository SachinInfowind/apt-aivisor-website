"use client";

import { useCallback, useEffect } from "react";
import type { RecaptchaAction } from "@/lib/recaptcha-actions";

/**
 * Shared client side of Google reCAPTCHA v3, used by every form.
 *
 *   const { execute } = useRecaptcha();
 *   ...
 *   const recaptchaToken = await execute(RECAPTCHA_ACTIONS.contact);
 *   fetch("/api/contact", { body: JSON.stringify({ ...values, recaptchaToken }) });
 *
 * The Google script is loaded lazily — only on pages that mount a form — and only once.
 * The server verifies the token (lib/recaptcha.ts). If the site key isn't configured, or the
 * script is blocked (ad blockers), `execute` resolves to `null` and the server decides what
 * to do (it rejects in production).
 */
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

type Grecaptcha = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

let scriptPromise: Promise<Grecaptcha | null> | null = null;

function loadRecaptcha(): Promise<Grecaptcha | null> {
  if (!SITE_KEY || typeof window === "undefined") return Promise.resolve(null);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<Grecaptcha | null>((resolve) => {
    const ready = () => {
      const g = (window as unknown as { grecaptcha?: Grecaptcha }).grecaptcha;
      if (!g) return resolve(null);
      g.ready(() => resolve(g));
    };

    if ((window as unknown as { grecaptcha?: Grecaptcha }).grecaptcha) return ready();

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(SITE_KEY)}`;
    script.async = true;
    script.defer = true;
    script.onload = ready;
    script.onerror = () => {
      scriptPromise = null; // allow a retry on the next submit
      resolve(null);
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function useRecaptcha() {
  // Start loading as soon as a form is on screen, so the token is instant on submit.
  useEffect(() => {
    void loadRecaptcha();
  }, []);

  /** Returns a fresh single-use token for `action`, or `null` if reCAPTCHA is unavailable. */
  const execute = useCallback(async (action: RecaptchaAction): Promise<string | null> => {
    try {
      const g = await loadRecaptcha();
      if (!g || !SITE_KEY) return null;
      return await g.execute(SITE_KEY, { action });
    } catch {
      return null;
    }
  }, []);

  return { execute, enabled: Boolean(SITE_KEY) };
}

/**
 * The "protected by reCAPTCHA" line Google asks sites to show (reCAPTCHA v3 is invisible —
 * there is no checkbox — so this is how visitors see that a form is protected). Drop it inside
 * or right under every form that calls `useRecaptcha()`.
 */
export function RecaptchaNotice({ className = "" }: { className?: string }) {
  return (
    <p
      className={`flex items-start gap-1.5 text-xs leading-5 text-subtle ${className}`}
      data-recaptcha-notice
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="mt-[3px] shrink-0">
        <path
          d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Zm-1.2 14.2-3.5-3.5 1.4-1.4 2.1 2.1 4.6-4.6 1.4 1.4-6 6Z"
          fill="currentColor"
        />
      </svg>
      <span>
        This site is protected by reCAPTCHA and the Google{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">
          Terms of Service
        </a>{" "}
        apply.
      </span>
    </p>
  );
}
