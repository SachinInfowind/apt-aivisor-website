"use client";

import { FormEvent, useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PhoneInputInput from "react-phone-number-input/input";
import { getCountries } from "react-phone-number-input";
import { homeSerif } from "../ui/fonts";
import { layout } from "../ui/type";
import { CountryCodeSelect } from "./CountryCodeSelect";
import {
  validateContactForm,
  type ContactFormErrors,
} from "@/lib/validation/contactForm";
import { useWafFetch } from "@/components/ui/WafProtection";

const inputClass =
  "w-full rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-base leading-6 text-heading shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] outline-none placeholder:text-subtle transition-shadow focus:border-brand focus:shadow-[0_0_0_4px_rgba(0,66,187,0.12)]";

const labelClass = "text-sm font-medium leading-5 text-ink";
const errorClass = "text-sm leading-5 text-danger";

const DEFAULT_COUNTRY = "US";
const COUNTRIES = getCountries().slice().sort((a, b) => a.localeCompare(b));

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phoneCountry: string;
  phone: string;
  message: string;
  agreedToPrivacyPolicy: boolean;
  // Honeypot — left empty by real users, invisible to them.
  companyWebsite: string;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phoneCountry: DEFAULT_COUNTRY,
  phone: "",
  message: "",
  agreedToPrivacyPolicy: false,
  companyWebsite: "",
};

/**
 * Contact form band — Figma "Contact sections" (26281:26979).
 * Sits below the map / contact-methods hero on /contact.
 * Submits to `/api/contact`, which validates and forwards to the CMS.
 */
export function ContactFormSection() {
  const router = useRouter();
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error">(
    "idle",
  );
  const [serverError, setServerError] = useState<string | null>(null);
  /** Remounts `PhoneInputInput` after submit or country change (uncontrolled). */
  const [phoneInputKey, setPhoneInputKey] = useState(0);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onPhoneChange = useCallback((v: string | undefined) => {
    setValues((prev) => ({ ...prev, phone: v ?? "" }));
    setErrors((prev) => ({ ...prev, phone: undefined }));
  }, []);

  const onPhoneCountryChange = useCallback((country: string) => {
    setValues((prev) => ({ ...prev, phoneCountry: country, phone: "" }));
    setErrors((prev) => ({
      ...prev,
      phoneCountry: undefined,
      phone: undefined,
    }));
    setPhoneInputKey((k) => k + 1);
  }, []);

  const wafFetch = useWafFetch();
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    const result = validateContactForm(values);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    setStatus("submitting");
    try {
      const res = await wafFetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...result.data,
        }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as {
          message?: string;
          errors?: ContactFormErrors;
        };
        if (payload.errors) setErrors(payload.errors);
        setServerError(
          payload.message ??
            "We couldn't send your message right now — please try again shortly.",
        );
        setStatus("error");
        return;
      }

      router.push("/thank-you");
    } catch {
      setServerError(
        "We couldn't send your message right now — please try again shortly.",
      );
      setStatus("error");
    }
  };

  return (
    <section
      className={`flex w-full flex-col items-center gap-12 bg-[linear-gradient(180deg,var(--color-brand-soft)_0%,var(--color-platform-to)_100%)] py-16 sm:gap-14 sm:py-20 md:gap-16 md:py-24`}
    >
      <div
        className={`${layout.sectionX} flex w-full flex-col items-center gap-12 sm:gap-14 md:gap-16`}
      >
        <div className="mx-auto flex w-full max-w-[48rem] flex-col items-center gap-3 text-center sm:gap-4">
          <p className="text-base font-semibold leading-6 text-brand-deep">
            Contact us
          </p>
          <h2
            className={`${homeSerif.className} text-[clamp(1.75rem,3vw,2.25rem)] font-normal leading-[1.22] tracking-[-0.02em] text-heading`}
          >
            Get in touch
          </h2>
          <p className="text-base leading-7 text-nav sm:text-xl sm:leading-[1.875rem]">
            We&apos;d love to hear from you. Please fill out this form.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mx-auto flex w-full max-w-[30rem] flex-col gap-8"
          noValidate
        >
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>First name</span>
                <input
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="First name"
                  value={values.firstName}
                  onChange={(e) => setField("firstName", e.target.value)}
                  aria-invalid={Boolean(errors.firstName)}
                  className={inputClass}
                />
                {errors.firstName ? (
                  <span className={errorClass}>{errors.firstName}</span>
                ) : null}
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Last name</span>
                <input
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Last name"
                  value={values.lastName}
                  onChange={(e) => setField("lastName", e.target.value)}
                  aria-invalid={Boolean(errors.lastName)}
                  className={inputClass}
                />
                {errors.lastName ? (
                  <span className={errorClass}>{errors.lastName}</span>
                ) : null}
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Email</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={values.email}
                onChange={(e) => setField("email", e.target.value)}
                aria-invalid={Boolean(errors.email)}
                className={inputClass}
              />
              {errors.email ? (
                <span className={errorClass}>{errors.email}</span>
              ) : null}
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Phone number</span>
              <div
                className={`flex rounded-lg border bg-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] focus-within:border-brand focus-within:shadow-[0_0_0_4px_rgba(0,66,187,0.12)] ${
                  errors.phone ? "border-danger" : "border-line-strong"
                }`}
              >
                <CountryCodeSelect
                  value={values.phoneCountry}
                  onChange={onPhoneCountryChange}
                  countries={COUNTRIES}
                />
                <PhoneInputInput
                  key={phoneInputKey}
                  country={values.phoneCountry as never}
                  international
                  withCountryCallingCode
                  name="phone"
                  autoComplete="tel"
                  placeholder="+1 (555) 000-0000"
                  // Uncontrolled: `usePhoneDigits` runs effects that call
                  // `onChange` whenever its internal E.164 value disagrees with
                  // the `value` prop. Feeding `value` back from React state
                  // (even as `undefined`) fights those effects and can loop
                  // into "Maximum update depth exceeded". We only listen via
                  // `onChange` for validation/submit; remount with `key` after
                  // submit or country change to reset the field.
                  onChange={onPhoneChange}
                  className="min-w-0 flex-1 border-0 bg-transparent px-3.5 py-2.5 text-base leading-6 text-heading outline-none placeholder:text-subtle"
                />
              </div>
              {errors.phone ? (
                <span className={errorClass}>{errors.phone}</span>
              ) : null}
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Message</span>
              <textarea
                name="message"
                rows={5}
                placeholder="Leave us a message..."
                value={values.message}
                onChange={(e) => setField("message", e.target.value)}
                aria-invalid={Boolean(errors.message)}
                className={`${inputClass} min-h-[8rem] resize-y`}
              />
              {errors.message ? (
                <span className={errorClass}>{errors.message}</span>
              ) : null}
            </label>

            {/* Honeypot — hidden from real users via CSS, not `display:none`
                (some bots skip fields that are display:none/hidden). */}
            <label className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden opacity-0">
              Company website
              <input
                name="companyWebsite"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={values.companyWebsite}
                onChange={(e) => setField("companyWebsite", e.target.value)}
              />
            </label>

            <label className="flex items-start gap-3">
              <input
                name="privacy"
                type="checkbox"
                checked={values.agreedToPrivacyPolicy}
                onChange={(e) =>
                  setField("agreedToPrivacyPolicy", e.target.checked)
                }
                aria-invalid={Boolean(errors.agreedToPrivacyPolicy)}
                className="mt-0.5 h-5 w-5 shrink-0 rounded border border-line-strong text-brand accent-brand"
              />
              <span className="text-base leading-6 text-nav">
                You agree to our friendly{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-2 transition-colors hover:text-brand"
                >
                  privacy policy
                </Link>
                .
              </span>
            </label>
            {errors.agreedToPrivacyPolicy ? (
              <span className={`-mt-4 ${errorClass}`}>
                {errors.agreedToPrivacyPolicy}
              </span>
            ) : null}
          </div>

          {serverError ? (
            <p className="rounded-lg border border-danger bg-danger-bg px-4 py-3 text-center text-sm font-medium text-danger-fg">
              {serverError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex w-full items-center justify-center rounded-pill border border-brand bg-brand px-[1.125rem] py-3 text-base font-semibold leading-6 text-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-brand-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting" ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
    </section>
  );
}
