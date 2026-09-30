import { layout } from "../../ui/type";
import type { WaitlistSectionData } from "@/lib/cms/types";

/**
 * Trust strip under waitlist — Figma Frame 121 (26193:18526, 1440×70).
 */
export function WaitlistTrustBar({
  trustText,
  trustSecondaryText,
  contactLabel,
  contactHref,
}: Pick<WaitlistSectionData, "trustText" | "trustSecondaryText" | "contactLabel" | "contactHref">) {
  const text = trustText || "No spam. No credit card. Unsubscribe anytime.";
  const label = contactLabel || "info@aptaisolutions.com";
  const href = contactHref || "mailto:info@aptaisolutions.com";

  return (
    <aside
      className={`bg-[#0B55DD] ${layout.sectionX} py-4 sm:py-5`}
      aria-label="Waitlist assurances"
    >
      <div
        className={`${layout.inner} flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:items-center sm:text-left sm:gap-6`}
      >
        <p className="text-[1rem] font-semibold leading-7 text-white sm:text-[1.25rem] sm:leading-[1.875rem]">
          {text}
        </p>
        <p className="text-[1rem] font-semibold leading-7 text-white sm:text-[1.25rem] sm:leading-[1.875rem]">
          {trustSecondaryText ? (
            trustSecondaryText
          ) : (
            <>
              Or reach us directly{" "}
              <a
                href={href}
                className="text-[#B5CFFF] underline underline-offset-2 transition-opacity hover:opacity-90"
              >
                {label}
              </a>
            </>
          )}
        </p>
      </div>
    </aside>
  );
}

