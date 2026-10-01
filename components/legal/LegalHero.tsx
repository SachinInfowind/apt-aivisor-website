import { homeSerif } from "@/components/ui/fonts";
import { layout } from "@/components/ui/type";
import type { LegalHeroSection, LegalVariant } from "@/lib/cms/types";
import { CloudBand } from "@/components/ui/CloudBand";

/**
 * Shared hero for Privacy, Terms, and Cookies.
 * Copy comes from Strapi (`sections.legal-hero`). Variant only picks the
 * Figma type colors.
 */

const title =
  "leading-none tracking-[-0.02em] text-[clamp(2.75rem,8vw,6.25rem)] " +
  "[-webkit-text-stroke-width:1px] [paint-order:stroke_fill] [-webkit-font-smoothing:antialiased]";

const stroke: Record<LegalVariant, string> = {
  privacy: "[-webkit-text-stroke-color:var(--color-brand)]",
  terms: "[-webkit-text-stroke-color:var(--color-navy)]",
  cookies: "[-webkit-text-stroke-color:var(--color-navy)]",
};

const headlineFill: Record<LegalVariant, string> = {
  privacy: "text-navy [-webkit-text-fill-color:var(--color-navy)]",
  terms: "text-navy [-webkit-text-fill-color:var(--color-navy)]",
  cookies: "text-navy [-webkit-text-fill-color:var(--color-navy)]",
};

const accentFill: Record<LegalVariant, string> = {
  privacy: "text-brand-deep [-webkit-text-fill-color:var(--color-brand-deep)]",
  terms: "text-brand [-webkit-text-fill-color:var(--color-brand)]",
  cookies: "text-brand-deep [-webkit-text-fill-color:var(--color-brand-deep)]",
};

export function LegalHero({
  badge,
  headline,
  headlineAccent,
  subhead,
  variant,
}: LegalHeroSection) {
  return (
    <section
      className={`relative flex w-full flex-col items-center overflow-hidden bg-hero-mesh ${layout.sectionX} pb-[clamp(6rem,20vw,16rem)] pt-[clamp(8.5rem,16svh,14.125rem)]`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[8rem] -top-[10rem] h-[33rem] w-[33rem] rounded-full bg-platform-to opacity-70 blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[6rem] top-[-8rem] h-[33rem] w-[33rem] rounded-full bg-brand-veil opacity-80 blur-[150px]"
      />

      <div className="relative z-[1] flex w-full max-w-[54.125rem] flex-col items-center gap-8 text-center sm:gap-10 md:gap-[2.625rem]">
        {badge ? (
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-white px-2.5 py-1 text-body-sm font-medium text-ink shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]">
            <span className="size-2 shrink-0 rounded-full bg-badge-dot" aria-hidden />
            {badge}
          </div>
        ) : null}

        <div className="flex w-full flex-col items-center gap-6 sm:gap-8 md:gap-9">
          <h1
            className={`${homeSerif.className} text-center ${
              variant === "terms" ? "whitespace-nowrap" : ""
            }`}
          >
            <span className={`${title} ${stroke[variant]} ${headlineFill[variant]}`}>
              {headline}
              {headlineAccent ? " " : ""}
            </span>
            {headlineAccent ? (
              <span className={`${title} italic ${stroke[variant]} ${accentFill[variant]}`}>
                {headlineAccent}
              </span>
            ) : null}
          </h1>
          {subhead ? (
            <p className="max-w-[54.125rem] text-base leading-7 text-nav sm:text-body-lg">
              {subhead}
            </p>
          ) : null}
        </div>
      </div>

      <CloudBand priority variant="edge" />
    </section>
  );
}
