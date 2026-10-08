"use client";

import { FormEvent, useState } from "react";

import { useRecaptcha } from "@/components/ui/Recaptcha";
import { RECAPTCHA_ACTIONS, RECAPTCHA_FIELD } from "@/lib/recaptcha-actions";

type Status = "idle" | "submitting" | "success" | "error";

export function NewsletterForm({
  placeholder,
  subscribeLabel,
}: {
  placeholder?: string;
  subscribeLabel?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { execute: executeRecaptcha } = useRecaptcha();

  const validateEmail = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) {
      return "Please enter your email";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    const error = validateEmail(email);
    if (error) {
      setErrorMessage(error);
      return;
    }

    setErrorMessage(null);
    setStatus("submitting");
    try {
      // Goes through our own API route (not straight to the CMS) so the reCAPTCHA token can be
      // verified server-side. The route treats an already-subscribed address as success too.
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          companyWebsite: "",
          sourcePath: "/blogs",
          [RECAPTCHA_FIELD]: await executeRecaptcha(RECAPTCHA_ACTIONS.newsletter),
        }),
      });

      if (!res.ok) {
        throw new Error(`Subscribe failed: ${res.status}`);
      }
      setStatus("success");
      setEmail("");
      setErrorMessage(null);
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className="text-body font-semibold text-brand-deep">
        You&rsquo;re subscribed. Thanks for joining!
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex w-full max-w-[480px] flex-col items-stretch gap-3"
    >
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="sr-only">
            Email
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder={placeholder || "Enter your email"}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            className={`w-full rounded-full border bg-white px-4 py-3 text-base leading-6 text-heading shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] outline-none placeholder:text-[#667085] transition-all ${
              errorMessage
                ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.15)]"
                : "border-[#D0D5DD] focus:border-brand focus:shadow-[0_0_0_4px_rgba(0,66,187,0.12)]"
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-[#0042BB] px-[18px] text-base font-semibold leading-6 text-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-brand-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Subscribing…" : subscribeLabel || "Subscribe"}
        </button>
      </div>

      {errorMessage ? (
        <p className="text-left text-xs font-medium text-red-600 sm:text-sm">
          {errorMessage}
        </p>
      ) : null}

      {status === "error" ? (
        <p className="text-left text-xs font-medium text-red-600 sm:text-sm">
          Something went wrong. Please try again.
        </p>
      ) : null}
    </form>
  );
}
