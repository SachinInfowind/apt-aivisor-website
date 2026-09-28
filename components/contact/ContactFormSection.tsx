"use client";

import { FormEvent, useState } from "react";
import { homeSerif } from "../ui/fonts";
import { layout } from "../ui/type";

const inputClass =
  "w-full rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-base leading-6 text-heading shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] outline-none placeholder:text-subtle transition-shadow focus:border-brand focus:shadow-[0_0_0_4px_rgba(0,66,187,0.12)]";

const labelClass = "text-sm font-medium leading-5 text-ink";

/**
 * Contact form band — Figma "Contact sections" (26281:26979).
 * Sits below the map / contact-methods hero on /contact.
 */
export function ContactFormSection() {
  const [status, setStatus] = useState<"idle" | "ok">("idle");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("ok");
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
          noValidate={false}
        >
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>First name</span>
                <input
                  name="firstName"
                  type="text"
                  required
                  autoComplete="given-name"
                  placeholder="First name"
                  className={inputClass}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Last name</span>
                <input
                  name="lastName"
                  type="text"
                  required
                  autoComplete="family-name"
                  placeholder="Last name"
                  className={inputClass}
                />
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Email</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Phone number</span>
              <div className="flex overflow-hidden rounded-lg border border-line-strong bg-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] focus-within:border-brand focus-within:shadow-[0_0_0_4px_rgba(0,66,187,0.12)]">
                <span className="inline-flex shrink-0 items-center gap-1 border-r border-line-strong px-3.5 text-base text-heading">
                  US
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M4 6L8 10L12 6"
                      className="stroke-subtle"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+1 (555) 000-0000"
                  className="min-w-0 flex-1 border-0 bg-transparent px-3.5 py-2.5 text-base leading-6 text-heading outline-none placeholder:text-subtle"
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Message</span>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Leave us a message..."
                className={`${inputClass} min-h-[8rem] resize-y`}
              />
            </label>

            <label className="flex items-start gap-3">
              <input
                name="privacy"
                type="checkbox"
                required
                className="mt-0.5 h-5 w-5 shrink-0 rounded border border-line-strong text-brand accent-brand"
              />
              <span className="text-base leading-6 text-nav">
                You agree to our friendly{" "}
                <a
                  href="/privacy"
                  className="underline underline-offset-2 transition-colors hover:text-brand"
                >
                  privacy policy
                </a>
                .
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-pill border border-brand bg-brand px-[1.125rem] py-3 text-base font-semibold leading-6 text-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-brand-hover active:scale-[0.98]"
          >
            Send message
          </button>

          {status === "ok" ? (
            <p className="text-center text-base font-medium text-heading">
              Thanks — we&apos;ll be in touch soon.
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
