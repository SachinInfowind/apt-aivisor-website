import { CmsImage } from "@/components/ui/CmsImage";
import { layout } from "@/components/ui/type";
import type { PricingAddonPrice, PricingCatalogSection } from "@/lib/cms/types";

/**
 * Pricing add-ons — Figma Frame 205 (1:7872, 1440×733).
 * Full-bleed white section (pad 100×80, gap 48) over the page gradient.
 *
 * Titles, descriptions and icons all come from the CMS (`sections.pricing-catalog`
 * → add-ons). Only the icon-tile colours are picked here, by add-on id.
 */

const TONES: Record<string, { bg: string; color: string }> = {
  "cloud-ai": { bg: "bg-brand-soft", color: "text-brand" },
  seats: { bg: "bg-success-bg", color: "text-[#067647]" },
  hubspot: { bg: "bg-[#EAECF5]", color: "text-[#4E5BA6]" },
  strategy: { bg: "bg-[#FEF0C7]", color: "text-[#DC6803]" },
};
const DEFAULT_TONE = { bg: "bg-brand-soft", color: "text-brand" };

function AddonCard({ addon }: { addon: PricingAddonPrice }) {
  const tone = TONES[addon.addonId] ?? DEFAULT_TONE;
  return (
    <article className="flex h-full min-w-0 flex-col gap-5 rounded-[20px] border border-line-strong bg-white p-5 sm:gap-6 sm:rounded-[24px] sm:p-8">
      <div
        className={`grid h-12 w-12 place-items-center rounded-[10px] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] ${tone.bg} ${tone.color}`}
      >
        <CmsImage image={addon.icon} width={24} height={24} className="h-6 w-6" />
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="font-body text-lg font-semibold leading-7 text-navy sm:text-xl sm:leading-[1.5]">
          {addon.name}
        </h3>
        {addon.description ? (
          <p className="text-sm leading-5 text-ink">{addon.description}</p>
        ) : null}
      </div>
    </article>
  );
}

export function PricingAddOns({
  className = "",
  catalog,
}: {
  className?: string;
  catalog?: PricingCatalogSection;
}) {
  const addons = catalog?.addons ?? [];
  if (addons.length === 0) return null;

  return (
    <section
      className={`mt-8 w-full bg-white sm:mt-10 md:mt-[6.25rem] ${layout.sectionX} py-12 sm:py-16 md:py-[6.25rem] ${className}`}
    >
      <div
        className={`${layout.inner} flex flex-col items-center gap-8 sm:gap-10 md:gap-12`}
      >
        {/* Figma: heading and ADD-ONS pill share one row. On desktop that row is
            left-aligned and indented 108px (a 100px spacer + 8px gap in the frame);
            below xl it is centred. */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-center xl:self-stretch xl:justify-start xl:pl-[108px] xl:text-left">
          <h2 className="font-display text-[1.5rem] font-normal leading-[1.25] tracking-[-0.02em] sm:text-[2.5rem] sm:leading-[3.75rem] lg:text-[3rem]">
            <span className="text-navy">{catalog?.addonsHeading} </span>
            <span className="italic text-brand-accent">{catalog?.addonsHeadingAccent}</span>
          </h2>
          {catalog?.addonsBadge ? (
            <span className="inline-flex items-center justify-center rounded-pill bg-brand-veil p-3.5 text-sm font-semibold leading-5 text-navy">
              {catalog.addonsBadge}
            </span>
          ) : null}
        </div>

        <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4 xl:gap-7">
          {addons.map((addon) => (
            <AddonCard key={addon.addonId} addon={addon} />
          ))}
        </div>
      </div>
    </section>
  );
}
