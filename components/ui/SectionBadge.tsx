import type { ReactNode } from "react";

export function SectionBadge({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "onBlue" | "onDark";
}) {
  return (
    <span
      className={`inline-flex w-fit max-w-full items-center gap-2 rounded-pill px-3.5 py-1.5 text-body-sm font-medium ${
        tone === "light"
          ? "border border-badge-edge bg-badge-bg text-badge-text"
          : "border border-transparent bg-white text-brand"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-pill ${
          tone === "light" ? "bg-badge-dot" : "bg-brand"
        }`}
        aria-hidden
      />
      {children}
    </span>
  );
}
