"use client";

import { useEffect, useState } from "react";

function CopyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M7.5 12.5L12.5 7.5M9.16667 4.16667L9.98481 3.22301C11.3517 1.66013 13.7333 1.49029 15.311 2.84234C16.8887 4.19439 17.0716 6.55726 15.7047 8.12014L14.8865 9.06381M10.8333 15.8333L10.0152 16.777C8.64826 18.3399 6.26666 18.5097 4.68899 17.1577C3.11132 15.8056 2.92842 13.4427 4.29528 11.8799L5.11348 10.9362"
        stroke="currentColor"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShareRow({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  // Populated after mount — keeps the server/client hydration pass in sync
  // (window.location isn't available on the server).
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — no-op
    }
  };

  const shareLinks = [
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex items-center gap-2 rounded-pill border border-line-strong bg-white px-3.5 py-2.5 text-body-sm font-semibold text-ink shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:border-brand hover:text-brand"
      >
        <CopyIcon />
        {copied ? "Copied!" : "Copy link"}
      </button>
      {shareLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${link.label}`}
          className="grid h-11 w-11 place-items-center rounded-pill border border-line-strong bg-white text-ink transition-colors hover:border-brand hover:text-brand"
        >
          <span className="text-body-sm font-semibold">
            {link.label.charAt(0)}
          </span>
        </a>
      ))}
    </div>
  );
}
