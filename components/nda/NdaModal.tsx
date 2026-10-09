"use client";

import { usePathname } from "next/navigation";
import { type FormEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { homeSans } from "@/components/ui/fonts";
import { useWafFetch } from "@/components/ui/WafProtection";
import { unlockDealForm } from "@/lib/nda-unlock";
import {
  type NdaRequestFormErrors,
  type NdaRequestFormValues,
  ndaCheckFormSchema,
  ndaRequestFormSchema,
} from "@/lib/validation/ndaRequestForm";

/** Custom event so any code (not just `#nda` links) can open the modal. */
export const OPEN_NDA_EVENT = "open-nda-modal";

const primaryButton =
  "inline-flex w-full items-center justify-center rounded-full border border-brand bg-brand px-4 py-2.5 text-base font-semibold leading-6 text-white shadow-field transition-colors hover:bg-brand-deep active:scale-98 disabled:cursor-not-allowed disabled:opacity-60";
const secondaryButton =
  "inline-flex w-full items-center justify-center rounded-full border border-line-strong bg-white px-4 py-2.5 text-base font-semibold leading-6 text-ink shadow-field transition-colors hover:bg-surface active:scale-98";
const inputClass =
  "w-full rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-base leading-6 text-heading shadow-field outline-none placeholder:text-subtle focus:border-brand-accent focus:shadow-field-focus aria-[invalid=true]:border-danger-solid";

type Fields = Pick<NdaRequestFormValues, "signerName" | "signerTitle" | "signerEmail" | "companyName">;
const EMPTY: Fields = { signerName: "", signerTitle: "", signerEmail: "", companyName: "" };

const FIELDS: { name: keyof Fields; label: string; type: string; autoComplete: string; placeholder: string }[] = [
  { name: "signerName", label: "Full name", type: "text", autoComplete: "name", placeholder: "Jane Cooper" },
  { name: "signerTitle", label: "Job title", type: "text", autoComplete: "organization-title", placeholder: "VP Finance" },
  { name: "signerEmail", label: "Work email", type: "email", autoComplete: "email", placeholder: "jane@company.com" },
  { name: "companyName", label: "Company legal name", type: "text", autoComplete: "organization", placeholder: "Acme Technologies, Inc." },
];

/**
 * "Request NDA draft" modal (Design Partner page).
 *
 * Opens from any link to `#nda` (the CMS-managed NDA panel button), the `open-nda-modal`
 * window event, or a `#nda` URL. Two modes:
 *
 *  - request: the CMS fills the Mutual NDA in with these details and emails it as a PDF, with a
 *    personal link to upload the signed copy (/nda/upload).
 *  - check ("Already signed NDA"): just an email. If a signed NDA is on file for it, the deal
 *    intelligence form unlocks (email pre-filled); if not, back to "request" with a short message.
 */
type Mode = "request" | "check";
export function NdaModal() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("request");
  const [notice, setNotice] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState("");
  const [checkError, setCheckError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [sent, setSent] = useState(false);
  const [values, setValues] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<NdaRequestFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const bodyId = useId();
  const wafFetch = useWafFetch();

  const openModal = useCallback(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setSent(false);
    setMode("request");
    setNotice(null);
    setCheckError(null);
    setErrors({});
    setFormError(null);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    returnFocusRef.current?.focus?.();
  }, []);

  // Open on any `#nda` link, the custom event, or a `#nda` URL.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const href = (e.target as Element | null)?.closest?.("a[href]")?.getAttribute("href");
      if (href === "#nda" || href?.endsWith("#nda")) {
        e.preventDefault();
        openModal();
      }
    };
    const onEvent = () => openModal();
    document.addEventListener("click", onClick);
    window.addEventListener(OPEN_NDA_EVENT, onEvent);
    const deepLink = window.location.hash === "#nda" ? window.setTimeout(openModal, 0) : undefined;
    return () => {
      if (deepLink) window.clearTimeout(deepLink);
      document.removeEventListener("click", onClick);
      window.removeEventListener(OPEN_NDA_EVENT, onEvent);
    };
  }, [openModal]);

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

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const result = ndaRequestFormSchema.safeParse({ ...values, website: honeypot, sourcePath: pathname });
    if (!result.success) {
      const next: NdaRequestFormErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof NdaRequestFormErrors;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setSubmitting(true);
    try {
      const res = await wafFetch("/api/nda-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { message?: string; errors?: NdaRequestFormErrors };
        if (payload.errors) setErrors(payload.errors);
        setFormError(payload.errors ? null : (payload.message ?? "Something went wrong — please try again."));
        return;
      }
      setSent(true);
      setValues(EMPTY);
    } catch {
      setFormError("Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onCheck = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCheckError(null);
    const parsed = ndaCheckFormSchema.safeParse({ email: checkEmail });
    if (!parsed.success) {
      setCheckError(parsed.error.issues[0]?.message ?? "Enter a valid email address");
      return;
    }
    setChecking(true);
    try {
      const res = await wafFetch("/api/nda-request/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data.email }),
      });
      const payload = (await res.json().catch(() => ({}))) as { signed?: boolean; message?: string };
      if (!res.ok) {
        setCheckError(payload.message ?? "Something went wrong — please try again.");
        return;
      }
      if (payload.signed) {
        // Signed NDA on file: unlock the form (it scrolls into view with the email pre-filled).
        setOpen(false);
        unlockDealForm(parsed.data.email);
        return;
      }
      // Not found: back to the request form, email carried over, with a short explanation.
      setValues((v) => ({ ...v, signerEmail: parsed.data.email }));
      setNotice("We couldn't find a signed NDA for this email. Request the NDA below, sign it and upload it with the link we email you.");
      setMode("request");
    } catch {
      setCheckError("Something went wrong — please try again.");
    } finally {
      setChecking(false);
    }
  };

  if (!open) return null;

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
        className="demo-panel relative w-full max-w-[28rem] overflow-hidden rounded-xl bg-white shadow-modal outline-none"
      >
        <div className="flex flex-col gap-1 px-6 pt-6 pr-16">
          <h2 id={titleId} className="text-lg font-semibold leading-7 text-heading">
            {sent ? "Check your inbox" : mode === "check" ? "Already signed the NDA?" : "Request the Mutual NDA"}
          </h2>
          <p id={bodyId} className="text-sm leading-5 text-nav">
            {sent
              ? "We've emailed you the Mutual NDA, pre-filled with your details. Sign it and send it back using the upload link in the email — or simply reply with the signed PDF."
              : mode === "check"
                ? "Enter the email you used to request the NDA. If we have your signed copy, the application form opens."
                : "We'll email you the Design Partner Mutual NDA, pre-filled with these details, ready to sign."}
          </p>
        </div>

        <button
          type="button"
          onClick={closeModal}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-lg transition-colors hover:bg-surface"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path className="stroke-faint" d="M18 6L6 18M6 6L18 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {sent ? (
          <div className="flex px-6 pb-6 pt-8">
            <button type="button" onClick={closeModal} className={primaryButton}>
              Done
            </button>
          </div>
        ) : mode === "check" ? (
          <form onSubmit={onCheck} noValidate className="relative">
            <div className="flex flex-col gap-1.5 px-6 pt-5">
              <label htmlFor={`${titleId}-check-email`} className="text-sm font-medium leading-5 text-ink">
                Work email
              </label>
              <input
                id={`${titleId}-check-email`}
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                autoFocus
                value={checkEmail}
                onChange={(e) => {
                  setCheckEmail(e.target.value);
                  setCheckError(null);
                }}
                placeholder="jane@company.com"
                aria-invalid={checkError ? true : undefined}
                aria-describedby={checkError ? `${titleId}-check-error` : undefined}
                className={inputClass}
              />
              {checkError ? (
                <p id={`${titleId}-check-error`} role="alert" className="text-sm leading-5 text-danger-solid">
                  {checkError}
                </p>
              ) : null}
            </div>
            <div className="flex gap-3 px-6 pb-6 pt-8">
              <button
                type="button"
                onClick={() => {
                  setCheckError(null);
                  setMode("request");
                }}
                className={secondaryButton}
              >
                Back
              </button>
              <button type="submit" disabled={checking} className={primaryButton}>
                {checking ? "Checking…" : "Submit"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={onSubmit} noValidate className="relative">
            {notice ? (
              <p role="status" className="mx-6 mt-5 rounded-lg border border-line-strong bg-surface px-3.5 py-2.5 text-sm leading-5 text-ink">
                {notice}
              </p>
            ) : null}
            <div className="flex flex-col gap-4 px-6 pt-5">
              {FIELDS.map((f) => {
                const id = `${titleId}-${f.name}`;
                const error = errors[f.name];
                return (
                  <div key={f.name} className="flex flex-col gap-1.5">
                    <label htmlFor={id} className="text-sm font-medium leading-5 text-ink">
                      {f.label}
                    </label>
                    <input
                      id={id}
                      name={f.name}
                      type={f.type}
                      autoComplete={f.autoComplete}
                      placeholder={f.placeholder}
                      required
                      value={values[f.name]}
                      onChange={(e) => {
                        setValues((v) => ({ ...v, [f.name]: e.target.value }));
                        setErrors((errs) => ({ ...errs, [f.name]: undefined }));
                      }}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? `${id}-error` : undefined}
                      className={inputClass}
                    />
                    {error ? (
                      <p id={`${id}-error`} role="alert" className="text-sm leading-5 text-danger-solid">
                        {error}
                      </p>
                    ) : null}
                  </div>
                );
              })}
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
              {formError ? (
                <p role="alert" className="text-sm leading-5 text-danger-solid">
                  {formError}
                </p>
              ) : null}
            </div>
            <div className="flex gap-3 px-6 pb-6 pt-8">
              <button type="button" onClick={closeModal} className={secondaryButton}>
                Cancel
              </button>
              <button type="submit" disabled={submitting} className={primaryButton}>
                {submitting ? "Sending…" : "Request NDA draft"}
              </button>
            </div>
            <p className="px-6 pb-5 text-center">
              <button
                type="button"
                onClick={() => {
                  setNotice(null);
                  setCheckEmail(values.signerEmail);
                  setMode("check");
                }}
                className="text-xs text-nav underline underline-offset-2 transition-colors hover:text-ink"
              >
                Already signed NDA
              </button>
            </p>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
