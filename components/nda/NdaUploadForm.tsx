"use client";

import { type FormEvent, useId, useState } from "react";
import { useWafFetch } from "@/components/ui/WafProtection";
import { NDA_UPLOAD_MAX_BYTES } from "@/lib/validation/ndaRequestForm";

const primaryButton =
  "inline-flex w-full items-center justify-center rounded-full border border-brand bg-brand px-4 py-2.5 text-base font-semibold leading-6 text-white shadow-field transition-colors hover:bg-brand-deep active:scale-98 disabled:cursor-not-allowed disabled:opacity-60";

/** File picker + upload for the signed NDA (used by /nda/upload). */
export function NdaUploadForm({ token }: { token: string }) {
  const inputId = useId();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const wafFetch = useWafFetch();

  const choose = (next: File | null) => {
    setError(null);
    if (!next) return setFile(null);
    if (next.type && next.type !== "application/pdf") return setError("The signed NDA must be a PDF.");
    if (next.size > NDA_UPLOAD_MAX_BYTES) return setError("The PDF must be 10MB or smaller.");
    setFile(next);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return setError("Choose your signed NDA (PDF) to upload.");
    setSubmitting(true);
    setError(null);
    try {
      const form = new FormData();
      form.set("token", token);
      form.set("file", file);
      const res = await wafFetch("/api/nda-request/signed", { method: "POST", body: form });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { message?: string };
        setError(payload.message ?? "Upload failed — please try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Upload failed — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div role="status" className="rounded-lg border border-line-strong bg-surface px-4 py-3 text-base leading-6 text-ink">
        Thank you — we&rsquo;ve received your signed NDA. aptAI will countersign it and email you the fully executed agreement.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium leading-5 text-ink">
          Signed NDA (PDF, max 10MB)
        </label>
        <input
          id={inputId}
          type="file"
          accept="application/pdf,.pdf"
          onChange={(e) => choose(e.target.files?.[0] ?? null)}
          aria-invalid={error ? true : undefined}
          className="w-full rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-sm leading-6 text-heading shadow-field file:mr-3 file:rounded-full file:border-0 file:bg-surface file:px-3 file:py-1 file:text-sm file:font-semibold file:text-ink"
        />
        {error ? (
          <p role="alert" className="text-sm leading-5 text-danger-solid">
            {error}
          </p>
        ) : null}
      </div>
      <button type="submit" disabled={submitting || !file} className={primaryButton}>
        {submitting ? "Uploading…" : "Upload signed NDA"}
      </button>
    </form>
  );
}
