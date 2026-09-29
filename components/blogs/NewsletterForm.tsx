"use client";

import { FormEvent, useState } from "react";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

type Status = "idle" | "submitting" | "success" | "error";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || status === "submitting") return;

    setStatus("submitting");
    try {
      const res = await fetch(`${STRAPI_URL}/api/newsletter-subscribers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: { email: email.trim(), sourcePath: "/blogs" },
        }),
      });

      if (!res.ok && res.status !== 400) {
        throw new Error(`Subscribe failed: ${res.status}`);
      }
      // 400 (duplicate email) still counts as "already subscribed" — treat as success.
      setStatus("success");
      setEmail("");
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
      className="flex w-full max-w-[27rem] flex-col items-stretch gap-3 sm:flex-row sm:items-start"
    >
      <div className="flex-1">
        <label htmlFor="newsletter-email" className="sr-only">
          Email
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-base leading-6 text-heading shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] outline-none placeholder:text-subtle transition-shadow focus:border-brand focus:shadow-[0_0_0_4px_rgba(0,66,187,0.12)]"
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-btn shrink-0 items-center justify-center rounded-pill bg-brand px-4.5 text-body font-semibold leading-6 text-white transition-colors hover:bg-brand-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Subscribing…" : "Subscribe"}
      </button>
      {status === "error" ? (
        <p className="w-full text-body-sm text-red-600 sm:absolute sm:mt-14">
          Something went wrong. Please try again.
        </p>
      ) : null}
    </form>
  );
}
