"use client";

import { FormEvent, useState } from "react";
import { homeSerif } from "../ui/fonts";
import { layout } from "../ui/type";

/**
 * Newsletter CTA — Figma "Newsletter CTA section" (26281:26980).
 * Horizontal card: copy left, email capture right. Shown below the contact form.
 */
export function NewsletterCtaSection() {
  const [status, setStatus] = useState<"idle" | "ok">("idle");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("ok");
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
                  required
                  autoComplete="email"
                  placeholder="Enter your email"
                  className="w-full rounded-pill border border-line-strong bg-white px-3.5 py-3 text-base leading-6 text-heading shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] outline-none placeholder:text-subtle transition-shadow focus:border-brand focus:shadow-[0_0_0_4px_rgba(0,66,187,0.12)]"
                />
                <p className="text-sm leading-5 text-nav">
                  We care about your data in our{" "}
                  <a
                    href="/privacy"
                    className="underline underline-offset-2 transition-colors hover:text-brand"
                  >
                    privacy policy
                  </a>
                </p>
              </div>
              <button
                type="submit"
                className="inline-flex shrink-0 items-center justify-center rounded-pill border border-brand bg-brand px-[1.125rem] py-3 text-base font-semibold leading-6 text-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-brand-hover active:scale-[0.98]"
              >
                Subscribe
              </button>
            </div>
            {status === "ok" ? (
              <p className="text-sm font-medium text-heading">
                You&apos;re subscribed — thanks!
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}
