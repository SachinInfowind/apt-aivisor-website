"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type FormEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { homeSans } from "@/components/ui/fonts";
import { toAbsoluteMediaUrl } from "@/lib/cms/media";
import type { DemoModalCopy } from "@/lib/cms/types";
import { RecaptchaNotice, useRecaptcha } from "@/components/ui/Recaptcha";
import { RECAPTCHA_ACTIONS, RECAPTCHA_FIELD } from "@/lib/recaptcha-actions";

type Step = "intro" | "email" | "thanks";

const primaryButton =
  "inline-flex w-full items-center justify-center rounded-full border border-brand bg-brand px-4 py-2.5 text-base font-semibold leading-6 text-white shadow-field transition-colors hover:bg-brand-deep active:scale-98 disabled:cursor-not-allowed disabled:opacity-60";
const secondaryButton =
  "inline-flex w-full items-center justify-center rounded-full border border-line-strong bg-white px-4 py-2.5 text-base font-semibold leading-6 text-ink shadow-field transition-colors hover:bg-surface active:scale-98";
const textButton =
  "inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-base font-semibold leading-6 text-nav transition-colors hover:text-ink";

/** Custom event so any code (not just `#demo` links) can open the modal. */
export const OPEN_DEMO_EVENT = "open-demo-modal";

/** Figma "Background pattern decorative" — concentric circles fading out. */
function CirclesPattern() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -left-[120px] -top-30 h-[336px] w-panel"
      style={{
        maskImage: "radial-gradient(50% 50% at 50% 50%, black 0%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(50% 50% at 50% 50%, black 0%, transparent 100%)",
      }}
    >
      <svg width="336" height="336" viewBox="0 0 336 336" fill="none">
        {[47.5, 71.5, 95.5, 119.5, 143.5, 167.5].map((r) => (
          <circle className="stroke-line-muted" key={r} cx="168" cy="168" r={r} />
        ))}
      </svg>
    </div>
  );
}

function MailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path className="stroke-ink"
        d="M21.5 18L14.8571 12M9.14286 12L2.50003 18M2 7L10.1649 12.7154C10.8261 13.1783 11.1567 13.4097 11.5163 13.4993C11.8339 13.5785 12.1661 13.5785 12.4837 13.4993C12.8433 13.4097 13.1739 13.1783 13.8351 12.7154L22 7M6.8 20H17.2C18.8802 20 19.7202 20 20.362 19.673C20.9265 19.3854 21.3854 18.9265 21.673 18.362C22 17.7202 22 16.8802 22 15.2V8.8C22 7.11984 22 6.27976 21.673 5.63803C21.3854 5.07354 20.9265 4.6146 20.362 4.32698C19.7202 4 18.8802 4 17.2 4H6.8C5.11984 4 4.27976 4 3.63803 4.32698C3.07354 4.6146 2.6146 5.07354 2.32698 5.63803C2 6.27976 2 7.11984 2 8.8V15.2C2 16.8802 2 17.7202 2.32698 18.362C2.6146 18.9265 3.07354 19.3854 3.63803 19.673C4.27976 20 5.11984 20 6.8 20Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeaturedIcon({
  kind,
  logoUrl,
}: {
  kind: "logo" | "logo-muted" | "mail";
  logoUrl: string | null;
}) {
  if (kind === "mail") {
    return (
      <span className="grid h-12 w-12 place-items-center rounded-field border border-line-muted bg-white shadow-field">
        <MailIcon />
      </span>
    );
  }
  return (
    <span
      className={`grid h-12 w-12 place-items-center rounded-full ${
        kind === "logo" ? "bg-brand-soft" : "bg-surface-muted"
      }`}
    >
      {logoUrl ? (
        <Image src={logoUrl} alt="" width={32} height={32} unoptimized className="h-8 w-8" />
      ) : null}
    </span>
  );
}

/**
 * "See aptAIvisor in action" modal — Figma "When User Click on Try Demo".
 *
 * Opens from any link to `#demo` (nav Demo button, mobile menu, footer,
 * CMS-managed CTAs) or the `open-demo-modal` window event. Three steps:
 * intro → email capture → thank-you. All copy, links and the logomark come
 * from the Strapi Global singleton (`demoModal`); without it the links keep
 * their normal behaviour and nothing renders.
 */
export function DemoModal({ copy }: { copy: DemoModalCopy | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("intro");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const bodyId = useId();
  const hasCopy = Boolean(copy);

  const openModal = useCallback(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setStep("intro");
    setEmail("");
    setError(null);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    returnFocusRef.current?.focus?.();
  }, []);

  // Open on any `#demo` link, the custom event, or a `#demo` URL.
  useEffect(() => {
    if (!hasCopy) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const link = (e.target as Element | null)?.closest?.("a[href]");
      const href = link?.getAttribute("href");
      if (!href) return;
      if (href === "#demo" || href.endsWith("#demo")) {
        e.preventDefault();
        openModal();
      }
    };
    const onEvent = () => openModal();
    document.addEventListener("click", onClick);
    window.addEventListener(OPEN_DEMO_EVENT, onEvent);
    // Deep link (`/#demo`): open once mounted, without a sync setState here.
    const deepLink =
      window.location.hash === "#demo" ? window.setTimeout(openModal, 0) : undefined;
    return () => {
      if (deepLink) window.clearTimeout(deepLink);
      document.removeEventListener("click", onClick);
      window.removeEventListener(OPEN_DEMO_EVENT, onEvent);
    };
  }, [hasCopy, openModal]);

  // Scroll lock, Escape, focus trap while open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, closeModal]);

  // Move focus into the new step's content.
  useEffect(() => {
    if (open && step !== "intro") panelRef.current?.focus();
  }, [step, open]);

  const { execute: executeRecaptcha } = useRecaptcha();
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/demo-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          companyWebsite: honeypot,
          sourcePath: pathname,
          [RECAPTCHA_FIELD]: await executeRecaptcha(RECAPTCHA_ACTIONS.demoNotify),
        }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as {
          message?: string;
          errors?: Record<string, string>;
        };
        setError(payload.errors?.email ?? payload.message ?? "Something went wrong — please try again.");
        return;
      }
      setStep("thanks");
    } catch {
      setError("Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!copy || !open) return null;

  const logoUrl = copy.logo?.url ? toAbsoluteMediaUrl(copy.logo.url) : null;
  const title =
    step === "intro" ? copy.introTitle : step === "email" ? copy.emailTitle : copy.thanksTitle;
  const body =
    step === "intro" ? copy.introBody : step === "email" ? copy.emailBody : copy.thanksBody;

  const link = (href: string | null | undefined, label: string | null | undefined, cls: string): ReactNode =>
    label && href ? (
      <Link href={href} onClick={closeModal} className={cls}>
        {label}
      </Link>
    ) : null;

  return createPortal(
    <div
      className={`${homeSans.className} demo-overlay fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-ink-black/70 p-4`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        tabIndex={-1}
        className="demo-panel relative w-full max-w-[25rem] overflow-hidden rounded-xl bg-white shadow-modal outline-none"
      >
        <CirclesPattern />

        <div className="relative flex flex-col gap-4 px-6 pt-6">
          <FeaturedIcon
            kind={step === "email" ? "mail" : step === "thanks" ? "logo-muted" : "logo"}
            logoUrl={logoUrl}
          />
          <div className="flex flex-col gap-1 pr-8">
            <h2 id={titleId} className="text-lg font-semibold leading-7 text-heading">
              {title}
            </h2>
            <p id={bodyId} className="text-sm leading-5 text-nav">
              {body}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={closeModal}
          aria-label={copy.closeLabel ?? "Close"}
          className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-lg transition-colors hover:bg-surface"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path className="stroke-faint" d="M18 6L6 18M6 6L18 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {step === "intro" ? (
          <div className="relative flex flex-col gap-3 px-6 pb-6 pt-8">
            {link(copy.requestHref, copy.requestLabel, secondaryButton)}
            {link(copy.exploreHref, copy.exploreLabel, primaryButton)}
            {copy.notifyLabel ? (
              <button type="button" onClick={() => setStep("email")} className={textButton}>
                {copy.notifyLabel}
              </button>
            ) : null}
          </div>
        ) : null}

        {step === "email" ? (
          <form onSubmit={onSubmit} noValidate className="relative">
            <div className="flex flex-col gap-1.5 px-6 pt-5">
              <label htmlFor={`${titleId}-email`} className="text-sm font-medium leading-5 text-ink">
                {copy.emailFieldLabel}
              </label>
              <input
                id={`${titleId}-email`}
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder={copy.emailPlaceholder ?? undefined}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${titleId}-error` : undefined}
                className="w-full rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-base leading-6 text-heading shadow-field outline-none placeholder:text-subtle focus:border-brand-accent focus:shadow-field-focus"
              />
              {error ? (
                <p id={`${titleId}-error`} role="alert" className="text-sm leading-5 text-danger-solid">
                  {error}
                </p>
              ) : null}
              {/* Honeypot — hidden from real users, bots tend to fill it. */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
              />
            </div>
            <div className="flex gap-3 px-6 pb-6 pt-8">
              <button type="button" onClick={closeModal} className={secondaryButton}>
                {copy.cancelLabel}
              </button>
              <button type="submit" disabled={submitting} className={primaryButton}>
                {submitting ? copy.submittingLabel : copy.submitLabel}
              </button>
            </div>
            <RecaptchaNotice />
          </form>
        ) : null}

        {step === "thanks" ? (
          <div className="relative flex flex-col gap-3 px-6 pb-6 pt-8">
            {link(copy.homeHref, copy.homeLabel, primaryButton)}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
