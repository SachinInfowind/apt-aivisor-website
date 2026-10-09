"use client";

import { useEffect, useRef, useState, type DragEvent, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { AboutMenuIcon } from "../layout/AboutMenuIcons";
import { CmsImage } from "../ui/CmsImage";
import type { StrapiImage } from "@/lib/cms/types";
import {
  RESUME_ACCEPT,
  validateCareerApplication,
  validateResumeFile,
  type CareerApplicationErrors,
} from "@/lib/validation/careerApplication";
import { useWafFetch } from "@/components/ui/WafProtection";

const inputClass =
  "w-full rounded-lg border border-[#D0D5DD] bg-white px-3.5 py-2.5 text-base leading-6 text-[#101828] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] outline-none placeholder:text-[#667085] transition-shadow focus:border-brand focus:shadow-[0_0_0_4px_rgba(0,66,187,0.12)]";
const labelClass = "text-sm font-medium leading-5 text-[#344054]";
const errorClass = "text-sm leading-5 text-danger";

const AREA_OPTIONS = [
  { value: "engineering", label: "Engineering" },
  { value: "product", label: "Product" },
  { value: "sales", label: "Sales" },
  { value: "operations", label: "Operations" },
  { value: "other", label: "Other" },
] as const;

type FormState = {
  fullName: string;
  email: string;
  website: string;
  areaOfInterest: string;
  linkedinOrPortfolio: string;
  message: string;
  companyName: string;
};

const initialState: FormState = {
  fullName: "",
  email: "",
  website: "",
  areaOfInterest: "",
  linkedinOrPortfolio: "",
  message: "",
  companyName: "",
};

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="#98A2B3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DecorativeCircles() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -left-[7.5rem] -top-[7.5rem] h-[21rem] w-[21rem] opacity-60"
      style={{
        maskImage: "radial-gradient(circle, black 0%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 70%)",
      }}
    >
      <svg width="336" height="336" viewBox="0 0 336 336" fill="none">
        <circle cx="168" cy="168" r="47.5" stroke="#EAECF0" />
        <circle cx="168" cy="168" r="71.5" stroke="#EAECF0" />
        <circle cx="168" cy="168" r="95.5" stroke="#EAECF0" />
        <circle cx="168" cy="168" r="119.5" stroke="#EAECF0" />
        <circle cx="168" cy="168" r="143.5" stroke="#EAECF0" />
        <circle cx="168" cy="168" r="167.5" stroke="#EAECF0" />
      </svg>
    </div>
  );
}

export function ExpressInterestModal({
  ctaLabel = "Express interest early",
  logo,
}: {
  ctaLabel?: string;
  /** Site logo mark (CMS Global) shown on the success state. */
  logo?: StrapiImage | null;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<CareerApplicationErrors & { resume?: string }>({});
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const resetAndClose = () => {
    setOpen(false);
    setValues(initialState);
    setErrors({});
    setResumeFile(null);
    setStatus("idle");
    setServerError(null);
  };

  const pickFile = (file: File | null) => {
    setResumeFile(file);
    setErrors((prev) => ({ ...prev, resume: undefined }));
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) pickFile(file);
  };

  const onPasteLinkedin = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setField("linkedinOrPortfolio", text.trim());
    } catch {
      // Clipboard permission denied or unavailable — user can paste manually.
    }
  };

  const wafFetch = useWafFetch();
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    const result = validateCareerApplication(values);
    const resumeError = validateResumeFile(resumeFile);

    if (!result.success || resumeError) {
      setErrors({
        ...(result.success ? {} : result.errors),
        resume: resumeError ?? undefined,
      });
      return;
    }

    setStatus("submitting");
    try {
      const website = /^https?:\/\//i.test(result.data.website)
        ? result.data.website
        : `https://${result.data.website}`;

      const form = new FormData();
      form.set("fullName", result.data.fullName);
      form.set("email", result.data.email);
      form.set("website", website);
      form.set("areaOfInterest", result.data.areaOfInterest);
      form.set("linkedinOrPortfolio", result.data.linkedinOrPortfolio);
      form.set("message", result.data.message);
      form.set("companyName", result.data.companyName);
      form.set("resume", resumeFile as File);

      const res = await wafFetch("/api/career-application", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as {
          message?: string;
          errors?: CareerApplicationErrors & { resume?: string };
        };
        if (payload.errors) setErrors(payload.errors);
        setServerError(
          payload.message ??
            "We couldn't send your application right now — please try again shortly.",
        );
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setServerError("We couldn't send your application right now — please try again shortly.");
      setStatus("error");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex w-fit items-center justify-center gap-1.5 rounded-pill border border-brand bg-brand px-4 py-2.5 text-base font-semibold leading-6 text-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-brand-hover active:scale-[0.98]"
      >
        {ctaLabel}
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden
          className="shrink-0"
        >
          <path
            d="M5.83203 14.1673L14.1654 5.83398M14.1654 14.1673V5.83398H5.83203"
            stroke="white"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open &&
        // Portal to <body>: the trigger sits inside the hero's stacking context, which would
        // otherwise keep the overlay (and its X button) underneath the fixed header.
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="express-interest-title"
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#0C111D]/70 p-4 py-10 backdrop-blur-sm sm:py-16"
            onClick={(e) => {
              if (e.target === e.currentTarget) resetAndClose();
            }}
          >
            <div
              className={`relative flex w-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_20px_24px_-4px_rgba(16,24,40,0.08),0_8px_8px_-4px_rgba(16,24,40,0.03)] ${
                status === "success" ? "max-w-[25rem]" : "max-w-[40rem] pb-5"
              }`}
            >
              <DecorativeCircles />

              <button
                type="button"
                onClick={resetAndClose}
                aria-label="Close"
                className="absolute right-4 top-4 z-[2] grid h-11 w-11 place-items-center rounded-lg text-[#98A2B3] transition-colors hover:bg-[#F9FAFB]"
              >
                <CloseIcon />
              </button>

              {status === "success" ? (
                <div className="relative z-[1] flex flex-col items-start gap-4 px-6 pb-6 pt-6">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#F2F4F7]">
                    <CmsImage
                      image={logo}
                      width={32}
                      height={32}
                      className="h-8 w-8 object-contain"
                    />
                  </span>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold leading-7 text-[#101828]">
                      Thanks for your interest!
                    </h2>
                    <p className="text-sm leading-5 text-[#475467]">
                      We&apos;ve received your details and will reach out when a relevant
                      opportunity opens.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="mt-8 inline-flex w-full items-center justify-center rounded-pill border border-[#0042BB] bg-[#0042BB] px-4 py-2.5 text-base font-semibold text-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-brand-hover"
                  >
                    Back to Careers
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="relative z-[1] flex flex-col">
                  <div className="flex flex-col items-start gap-4 px-6 pt-6">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[10px] border border-[#EAECF0] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]">
                      <AboutMenuIcon name="flag" className="text-[#344054]" />
                    </span>
                    <div className="flex flex-col gap-1">
                      <h2
                        id="express-interest-title"
                        className="text-lg font-semibold leading-7 text-[#101828]"
                      >
                        Interested in joining us?
                      </h2>
                      <p className="text-sm leading-5 text-[#475467]">
                        We&apos;re building our team ahead of our Q1 2027 launch. Share your details
                        and we&apos;ll reach out when a relevant opportunity opens.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5 px-6 pt-5">
                    {/* Honeypot — hidden from real users */}
                    <div className="hidden" aria-hidden="true">
                      <label>
                        Company name
                        <input
                          type="text"
                          name="companyName"
                          tabIndex={-1}
                          autoComplete="off"
                          value={values.companyName}
                          onChange={(e) => setField("companyName", e.target.value)}
                        />
                      </label>
                    </div>

                    <label className="flex flex-col gap-1.5">
                      <span className={labelClass}>Full Name *</span>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={values.fullName}
                        onChange={(e) => setField("fullName", e.target.value)}
                        className={inputClass}
                      />
                      {errors.fullName && <span className={errorClass}>{errors.fullName}</span>}
                    </label>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <label className="flex flex-col gap-1.5">
                        <span className={labelClass}>Email *</span>
                        <div className="relative">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            aria-hidden
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
                          >
                            <path
                              d="M1.66797 5.8335L8.47207 10.5964C9.02304 10.982 9.29853 11.1749 9.59819 11.2496C9.86288 11.3156 10.1397 11.3156 10.4044 11.2496C10.7041 11.1749 10.9796 10.982 11.5305 10.5964L18.3346 5.8335M5.66797 16.6668H14.3346C15.7348 16.6668 16.4348 16.6668 16.9696 16.3943C17.44 16.1547 17.8225 15.7722 18.0622 15.3018C18.3346 14.767 18.3346 14.067 18.3346 12.6668V7.3335C18.3346 5.93336 18.3346 5.2333 18.0622 4.69852C17.8225 4.22811 17.44 3.84566 16.9696 3.60598C16.4348 3.3335 15.7348 3.3335 14.3346 3.3335H5.66797C4.26784 3.3335 3.56777 3.3335 3.03299 3.60598C2.56259 3.84566 2.18014 4.22811 1.94045 4.69852C1.66797 5.2333 1.66797 5.93336 1.66797 7.3335V12.6668C1.66797 14.067 1.66797 14.767 1.94045 15.3018C2.18014 15.7722 2.56259 16.1547 3.03299 16.3943C3.56777 16.6668 4.26784 16.6668 5.66797 16.6668Z"
                              stroke="#667085"
                              strokeWidth="1.66667"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <input
                            type="email"
                            placeholder="Enter your work email"
                            value={values.email}
                            onChange={(e) => setField("email", e.target.value)}
                            className={`${inputClass} pl-10`}
                          />
                        </div>
                        {errors.email && <span className={errorClass}>{errors.email}</span>}
                      </label>

                      <label className="flex flex-col gap-1.5">
                        <span className={labelClass}>Website *</span>
                        <div className="flex">
                          <span className="inline-flex items-center rounded-l-lg border border-r-0 border-[#D0D5DD] bg-white px-3.5 text-base text-[#475467]">
                            https://
                          </span>
                          <input
                            type="text"
                            placeholder="www.example.com"
                            value={values.website}
                            onChange={(e) => setField("website", e.target.value)}
                            className={`${inputClass} rounded-l-none`}
                          />
                        </div>
                        {errors.website && <span className={errorClass}>{errors.website}</span>}
                      </label>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <label className="flex flex-col gap-1.5">
                        <span className={labelClass}>Area of Interest *</span>
                        <select
                          value={values.areaOfInterest}
                          onChange={(e) => setField("areaOfInterest", e.target.value)}
                          className={`${inputClass} ${values.areaOfInterest ? "text-[#101828]" : "text-[#667085]"}`}
                        >
                          <option value="" disabled>
                            Select an area
                          </option>
                          {AREA_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {errors.areaOfInterest && (
                          <span className={errorClass}>{errors.areaOfInterest}</span>
                        )}
                      </label>

                      <label className="flex flex-col gap-1.5">
                        <span className={labelClass}>LinkedIn / Portfolio *</span>
                        <div className="flex">
                          <input
                            type="text"
                            placeholder="Paste your LinkedIn or portfolio URL"
                            value={values.linkedinOrPortfolio}
                            onChange={(e) => setField("linkedinOrPortfolio", e.target.value)}
                            className={`${inputClass} rounded-r-none`}
                          />
                          <button
                            type="button"
                            onClick={onPasteLinkedin}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-r-lg border border-l-0 border-[#D0D5DD] bg-white px-4 text-base font-semibold text-[#344054] transition-colors hover:bg-[#F9FAFB]"
                          >
                            Paste
                          </button>
                        </div>
                        {errors.linkedinOrPortfolio && (
                          <span className={errorClass}>{errors.linkedinOrPortfolio}</span>
                        )}
                      </label>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className={labelClass}>Resume / CV *</span>
                      {!resumeFile && (
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragActive(true);
                          }}
                          onDragLeave={() => setDragActive(false)}
                          onDrop={onDrop}
                          className={`flex flex-col items-center gap-3 rounded-xl border p-6 transition-colors ${
                            dragActive ? "border-brand bg-brand-soft" : "border-[#EAECF0] bg-white"
                          }`}
                        >
                          <span className="grid h-10 w-10 place-items-center rounded-lg border border-[#EAECF0] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                              <path
                                d="M13.3346 13.3333L10.0013 10L6.66797 13.3333M10.0013 10V17.5M16.668 13.9524C17.6859 13.1117 18.3346 11.8399 18.3346 10.4167C18.3346 7.88536 16.2826 5.83333 13.7513 5.83333C13.5692 5.83333 13.3989 5.73833 13.3064 5.58145C12.2197 3.73736 10.2133 2.5 7.91797 2.5C4.46619 2.5 1.66797 5.29822 1.66797 8.75C1.66797 10.4718 2.36417 12.0309 3.49043 13.1613"
                                stroke="#344054"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-sm font-semibold text-[#003699] hover:underline"
                              >
                                Click to upload
                              </button>
                              <span className="text-sm text-[#475467]">or drag and drop</span>
                            </div>
                            <span className="text-center text-xs text-[#475467]">
                              PDF, DOC or DOCX (max 10MB)
                            </span>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept={RESUME_ACCEPT}
                            className="hidden"
                            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                          />
                        </div>
                      )}
                      {resumeFile && (
                        <div className="mt-1 flex items-center justify-between gap-3 rounded-xl border border-[#EAECF0] p-3">
                          <span className="min-w-0 truncate text-sm font-medium text-[#344054]">
                            {resumeFile.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => pickFile(null)}
                            aria-label="Remove file"
                            className="shrink-0 text-[#344054] hover:text-danger"
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                              <path
                                d="M10.6667 4.00016V3.46683C10.6667 2.72009 10.6667 2.34672 10.5213 2.06151C10.3935 1.81063 10.1895 1.60665 9.93865 1.47882C9.65344 1.3335 9.28007 1.3335 8.53333 1.3335H7.46667C6.71993 1.3335 6.34656 1.3335 6.06135 1.47882C5.81046 1.60665 5.60649 1.81063 5.47866 2.06151C5.33333 2.34672 5.33333 2.72009 5.33333 3.46683V4.00016M6.66667 7.66683V11.0002M9.33333 7.66683V11.0002M2 4.00016H14M12.6667 4.00016V11.4668C12.6667 12.5869 12.6667 13.147 12.4487 13.5748C12.2569 13.9511 11.951 14.2571 11.5746 14.4488C11.1468 14.6668 10.5868 14.6668 9.46667 14.6668H6.53333C5.41323 14.6668 4.85318 14.6668 4.42535 14.4488C4.04903 14.2571 3.74307 13.9511 3.55132 13.5748C3.33333 13.147 3.33333 12.5869 3.33333 11.4668V4.00016"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                      {errors.resume && <span className={errorClass}>{errors.resume}</span>}
                    </div>

                    <label className="flex flex-col gap-1.5">
                      <span className={labelClass}>Tell us about yourself</span>
                      <textarea
                        placeholder="Share a brief introduction or what you'd like to work on..."
                        value={values.message}
                        onChange={(e) => setField("message", e.target.value)}
                        rows={4}
                        className={`${inputClass} resize-none`}
                      />
                    </label>
                  </div>

                  <div className="flex flex-col gap-3 px-6 pt-8">
                    {serverError && <p className={errorClass}>{serverError}</p>}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={resetAndClose}
                        className="inline-flex flex-1 items-center justify-center rounded-pill border border-[#D0D5DD] bg-white px-4 py-2.5 text-base font-semibold text-[#344054] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-[#F9FAFB]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="inline-flex flex-1 items-center justify-center rounded-pill border border-[#0042BB] bg-[#0042BB] px-4 py-2.5 text-base font-semibold text-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-brand-hover disabled:opacity-60"
                      >
                        {status === "submitting" ? "Submitting…" : "Submit Interest"}
                      </button>
                    </div>
                    <p className="text-sm leading-5 text-[#475467]">
                      By submitting, you agree to be contacted regarding relevant career
                      opportunities.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
