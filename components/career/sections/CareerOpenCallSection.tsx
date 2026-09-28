import Image from "next/image";
import Link from "next/link";
import { homeSerif } from "../../ui/fonts";
import { layout } from "../../ui/type";
import type { CareerOpenCallSectionData } from "@/lib/cms/types";
import { toAbsoluteMediaUrl } from "@/lib/cms/media";

/**
 * Career open-call CTA — Figma Frame 159 (24642:57734, 1440×755).
 * Same content column as Frame 157 so the chess visual’s right edge
 * lines up with the roles card above.
 */
export function CareerOpenCallSection({
  heading,
  headingAccent,
  body,
  ctaLabel = "Contact aptAI team",
  ctaHref = "/contact",
  image,
}: CareerOpenCallSectionData) {
  const imageSrc = image?.url
    ? toAbsoluteMediaUrl(image.url)
    : "/assets/career/open-role-visual.png";

  return (
    <section
      className="border-t border-line-muted bg-brand-soft px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-[6.25rem] lg:px-14 xl:px-20"
      aria-labelledby="career-open-call-heading"
    >
      <div
        className={`${layout.inner} flex flex-col items-stretch gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12`}
      >
        <div className="flex w-full max-w-[40.8125rem] shrink flex-col items-start gap-8 lg:w-[min(100%,40.8125rem)]">
          <div className="flex w-full flex-col items-start gap-5">
            <h2
              id="career-open-call-heading"
              className={`${homeSerif.className} text-[clamp(1.75rem,5vw,3.75rem)] font-normal italic leading-[1.2] tracking-[-0.02em]`}
            >
              <span className="text-navy">{heading}</span>
              {headingAccent ? (
                <>
                  {" "}
                  <span className="text-brand-strong">{headingAccent}</span>
                </>
              ) : null}
            </h2>

            <p className="text-base leading-7 text-ink sm:text-lg sm:leading-7">
              {body}
            </p>
          </div>

          {ctaLabel && (
            <Link
              href={ctaHref || "/contact"}
              className="inline-flex w-fit items-center justify-center rounded-pill border border-brand bg-brand px-4 py-2.5 text-base font-semibold leading-6 text-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-brand-hover active:scale-[0.98]"
            >
              {ctaLabel}
            </Link>
          )}
        </div>

        {/*
          Flush to the right of layout.inner — same edge as the white roles
          card above — so the chess visual aligns with the portrait column.
        */}
        <div className="relative ml-auto w-full max-w-[43.625rem] shrink-0 overflow-hidden rounded-[1.5rem] lg:w-[min(48%,43.625rem)]">
          <Image
            src={imageSrc}
            alt={image?.alternativeText ?? ""}
            width={image?.width ?? 698}
            height={image?.height ?? 371}
            className="h-auto w-full object-contain object-right"
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
