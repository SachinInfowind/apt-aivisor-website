import { CmsImage } from "@/components/ui/CmsImage";
import { layout } from "@/components/ui/type";
import type { PricingAddonPrice, PricingCatalogSection } from "@/lib/cms/types";

/**
 * Pricing add-ons — Figma Frame 205 (1:7872, 1440×733).
 * Full-bleed white section (pad 100×80, gap 48) over the page gradient.
 *
 * Titles, descriptions, prices, icons and footer artwork all come from the CMS
 * (`sections.pricing-catalog` → add-ons). Only the icon-tile colours are picked here,
 * by add-on id.
 */

const TONES: Record<string, { bg: string; color: string }> = {
  "cloud-ai": { bg: "bg-brand-soft", color: "text-brand" },
  seats: { bg: "bg-success-bg", color: "text-[#067647]" },
  hubspot: { bg: "bg-[#EAECF5]", color: "text-[#4E5BA6]" },
  strategy: { bg: "bg-[#FEF0C7]", color: "text-[#DC6803]" },
};
const DEFAULT_TONE = { bg: "bg-brand-soft", color: "text-brand" };

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 3.33337V12.6667M3.33337 8H12.6667"
        className="stroke-faint"
        strokeWidth="1.333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AddonFooter({ addon }: { addon: PricingAddonPrice }) {
  const images = addon.footerImages ?? [];

  if (addon.footerType === "avatars") {
    return (
      <div className="flex items-center gap-2 pt-1">
        <div className="flex items-center">
          {images.map((image, i) => (
            <span
              key={image.url}
              className={`relative h-6 w-6 overflow-hidden rounded-pill border-[1.5px] border-white ${
                i === 0 ? "" : "-ml-1"
              }`}
            >
              <CmsImage image={image} fill sizes="24px" className="object-cover" />
            </span>
          ))}
          {addon.footerLabel ? (
            <span className="relative -ml-1 grid h-6 w-6 place-items-center rounded-pill border-2 border-white bg-surface-muted text-[10px] font-medium text-ink">
              {addon.footerLabel}
            </span>
          ) : null}
        </div>
        <span className="grid h-6 w-6 place-items-center rounded-pill border border-dashed border-line-strong bg-white">
          <PlusIcon />
        </span>
      </div>
    );
  }

  if (addon.footerType === "hubspot") {
    return (
      <div className="pt-1">
        <CmsImage image={images[0]} alt="HubSpot" width={77} height={22} className="h-5 w-auto" />
      </div>
    );
  }

  if (addon.footerType === "pratt") {
    return (
      <div className="inline-flex items-center gap-1 rounded-pill border border-line-strong bg-surface py-px pl-px pr-3">
        <CmsImage image={images[0]} width={24} height={25} className="h-6 w-6 rounded-pill object-cover" />
        <CmsImage image={images[1]} alt="aptAI" width={31} height={18} className="h-[18px] w-auto" />
      </div>
    );
  }

  if (addon.footerType === "clouds") {
    // Azure + GCP + AI symbols
    const [azure, gcp, aiA, aiB] = images;
    return (
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <CmsImage image={azure} alt="Azure" width={23} height={23} className="h-5 w-5 object-contain" />
        <CmsImage image={gcp} alt="Google Cloud" width={31} height={19} className="h-[19px] w-auto object-contain" />
        <CmsImage image={aiA} width={19} height={19} className="h-5 w-5 object-contain" />
        <CmsImage image={aiB} width={27} height={19} className="h-5 w-auto object-contain" />
      </div>
    );
  }

  return null;
}

function AddonCard({ addon }: { addon: PricingAddonPrice }) {
  const tone = TONES[addon.addonId] ?? DEFAULT_TONE;
  return (
    <article className="flex h-full min-w-0 flex-col gap-5 rounded-[20px] border border-line-strong bg-white p-5 sm:gap-6 sm:rounded-[24px] sm:p-8">
      <div
        className={`grid h-12 w-12 place-items-center rounded-[10px] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] ${tone.bg} ${tone.color}`}
      >
        <CmsImage image={addon.icon} width={24} height={24} className="h-6 w-6" />
      </div>

      <div className="flex flex-1 flex-col gap-3 sm:gap-4">
        <h3 className="font-body text-lg font-semibold leading-7 text-navy sm:text-xl sm:leading-[1.5]">
          {addon.name}
        </h3>
        {addon.description ? (
          <p className="text-sm leading-5 text-ink">{addon.description}</p>
        ) : null}
        <p className="mt-auto text-lg font-bold leading-[1.5] text-brand-accent sm:text-xl">
          {addon.price}
        </p>
        <AddonFooter addon={addon} />
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
        <div className="flex flex-col items-center gap-4 text-center sm:gap-5">
          {catalog?.addonsBadge ? (
            <span className="inline-flex items-center justify-center rounded-pill bg-brand-veil px-3.5 py-2 text-sm font-semibold leading-5 text-navy sm:px-4 sm:py-3.5">
              {catalog.addonsBadge}
            </span>
          ) : null}
          <h2 className="font-display text-[1.5rem] font-normal leading-[1.25] tracking-[-0.02em] sm:text-[2.5rem] sm:leading-[3.75rem] lg:text-[3rem]">
            <span className="text-navy">{catalog?.addonsHeading} </span>
            <span className="italic text-brand-accent">{catalog?.addonsHeadingAccent}</span>
          </h2>
        </div>

        <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
          {addons.map((addon) => (
            <AddonCard key={addon.addonId} addon={addon} />
          ))}
        </div>
      </div>
    </section>
  );
}
