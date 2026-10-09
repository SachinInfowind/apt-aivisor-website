"use client";

import { DragEvent, useRef, useState } from "react";
import { RESUME_ACCEPT } from "@/lib/validation/careerApplication";

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/**
 * "Upload Document" drop zone — Figma "Contact sections". Click or drag a PDF/Word file in;
 * the chosen file is listed below with a remove button. The file itself is sent with the form.
 */
export function DocumentDropzone({
  file,
  error,
  onChange,
}: {
  file: File | null;
  error?: string;
  onChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const pick = (list: FileList | null) => {
    const next = list?.[0];
    if (next) onChange(next);
  };
  const onDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragging(false);
    pick(e.dataTransfer.files);
  };
  const clear = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium leading-5 text-ink">Upload Document</span>
      <input
        ref={inputRef}
        name="document"
        type="file"
        accept={RESUME_ACCEPT}
        className="sr-only"
        onChange={(e) => pick(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex w-full flex-col items-center gap-1 rounded-xl border bg-white px-6 py-4 text-center transition-colors hover:border-brand ${
          dragging ? "border-brand" : error ? "border-danger" : "border-[#EAECF0]"
        }`}
      >
        <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg border border-[#EAECF0] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#344054" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6.67 13.33 10 10m0 0 3.33 3.33M10 10v7.5m6.67-3.07a4.58 4.58 0 0 0-2.09-8.6.52.52 0 0 1-.45-.26 6.25 6.25 0 1 0-9.81 7.6" />
          </svg>
        </span>
        <span className="text-sm leading-5">
          <span className="font-semibold text-[#003699]">Click to upload</span>{" "}
          <span className="text-[#475467]">or drag and drop</span>
        </span>
        <span className="text-xs leading-[1.125rem] text-[#475467]">
          PDF, DOC or DOCX (max. 10 MB)
        </span>
      </button>

      {file ? (
        <div className="flex h-[4.5rem] items-center gap-3 rounded-xl border border-[#EAECF0] bg-white px-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#FEF3F2] text-[10px] font-bold text-[#D92D20]">
            {(file.name.split(".").pop() ?? "FILE").slice(0, 4).toUpperCase()}
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium leading-5 text-[#344054]">{file.name}</span>
            <span className="text-sm leading-5 text-[#475467]">{formatSize(file.size)}</span>
          </span>
          <button
            type="button"
            onClick={clear}
            aria-label={`Remove ${file.name}`}
            className="shrink-0 rounded-md p-1.5 text-[#475467] transition-colors hover:bg-[#F2F4F7] hover:text-danger"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M13.33 5v-.67c0-.93 0-1.4-.18-1.75a1.67 1.67 0 0 0-.73-.73c-.36-.18-.82-.18-1.75-.18H9.33c-.93 0-1.4 0-1.75.18-.31.16-.57.42-.73.73-.18.36-.18.82-.18 1.75V5m1.67 4.58v4.17m3.33-4.17v4.17M2.5 5h15m-1.67 0v9.33c0 1.4 0 2.1-.27 2.63a2.5 2.5 0 0 1-1.1 1.1c-.53.27-1.23.27-2.63.27H7.17c-1.4 0-2.1 0-2.63-.27a2.5 2.5 0 0 1-1.1-1.1c-.27-.53-.27-1.23-.27-2.63V5" />
            </svg>
          </button>
        </div>
      ) : null}
      {error ? <span className="text-sm leading-5 text-danger">{error}</span> : null}
    </div>
  );
}
