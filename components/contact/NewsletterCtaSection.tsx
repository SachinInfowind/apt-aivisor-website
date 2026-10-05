"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { homeSerif } from "../ui/fonts";
import { layout } from "../ui/type";
import {
  validateNewsletterForm,
  type NewsletterFormErrors,
} from "@/lib/validation/newsletterForm";
import { RecaptchaNotice, useRecaptcha } from "@/components/ui/Recaptcha";
import { RECAPTCHA_ACTIONS, RECAPTCHA_FIELD } from "@/lib/recaptcha-actions";

/**
 * Newsletter CTA — Figma "Newsletter CTA section" (26281:26980).
 * Horizontal card: copy left, email capture right. Shown below the contact form.
 * Submits to `/api/newsletter`, which validates and forwards to the CMS.
 */
export function NewsletterCtaSection() {
  const [email, setEmail] = useState("");
  // Honeypot — left empty by real users, invisible to them.
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [errors, setErrors] = useState<NewsletterFormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">(
    "idle",
  );
  const [serverError, setServerError] = useState<string | null>(null);

  const { execute: executeRecaptcha } = useRecaptcha();
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    const result = validateNewsletterForm({ email, companyWebsite });
    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...result.data,
          [RECAPTCHA_FIELD]: await executeRecaptcha(RECAPTCHA_ACTIONS.newsletter),
        }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as {
          message?: string;
          errors?: NewsletterFormErrors;
        };
        if (payload.errors) setErrors(payload.errors);
        setServerError(
          payload.message ??
            "We couldn't subscribe you right now — please try again shortly.",
        );
        setStatus("error");
        return;
      }

      setStatus("ok");
      setEmail("");
    } catch {
      setServerError(
        "We couldn't subscribe you right now — please try again shortly.",
      );
      setStatus("error");
    }
  };

  return (
    <section className={`w-full bg-white pb-16 pt-0 sm:pb-20 md:pb-24`}>
      <div className={`${layout.sectionX} ${layout.inner}`}>
        <div className="flex flex-col flex-wrap items-stretch gap-8 rounded-2xl bg-surface p-8 sm:gap-8 sm:p-12 md:flex-row md:items-start md:justify-between md:gap-8 md:p-16">
          <div className="flex min-w-0 flex-1 flex-col gap-4 md:min-w-[min(100%,30rem)] md:max-w-3xl">
            <h2
              className={`${homeSerif.className} text-[clamp(1.5rem,2.5vw,1.875rem)] font-normal leading-[1.27] text-heading`}
            >
              Join 2,000+ subscribers
            </h2>
            <p className="text-base leading-7 text-nav sm:text-xl sm:leading-[1.875rem]">
              Stay in the loop with everything you need to know.
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="flex w-full max-w-[30rem] shrink-0 flex-col gap-4 md:w-[30rem]"
            noValidate
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
              <label className="sr-only" htmlFor="newsletter-email">
                Email
              </label>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  aria-invalid={Boolean(errors.email)}
                  className={`w-full rounded-pill border bg-white px-3.5 py-3 text-base leading-6 text-heading shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] outline-none placeholder:text-subtle transition-shadow focus:border-brand focus:shadow-[0_0_0_4px_rgba(0,66,187,0.12)] ${
                    errors.email ? "border-danger" : "border-line-strong"
                  }`}
                />
                {/* Honeypot — hidden from real users via CSS, not
                    `display:none` (some bots skip fields that are
                    display:none/hidden). */}
                <label className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden opacity-0">
                  Company website
                  <input
                    name="companyWebsite"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                  />
                </label>
                {errors.email ? (
                  <p className="text-sm leading-5 text-danger">{errors.email}</p>
                ) : (
                  <p className="text-sm leading-5 text-nav">
                    We care about your data in our{" "}
                    <Link
                      href="/privacy"
                      className="underline underline-offset-2 transition-colors hover:text-brand"
                    >
                      privacy policy
                    </Link>
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex shrink-0 items-center justify-center rounded-pill border border-brand bg-brand px-[1.125rem] py-3 text-base font-semibold leading-6 text-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-brand-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? "Subscribing…" : "Subscribe"}
              </button>
            </div>
            {serverError ? (
              <p className="text-sm font-medium text-danger-fg">{serverError}</p>
            ) : null}
            {status === "ok" ? (
              <p className="text-sm font-medium text-heading">
                You&apos;re subscribed — thanks!
              </p>
            ) : null}
            <RecaptchaNotice />
          </form>
        </div>
      </div>
    </section>
  );
}
