import Image from "next/image";
import { homeSerif } from "../../ui/fonts";
import { SectionBadge } from "../../ui/SectionBadge";
import { layout } from "../../ui/type";
import type { CareerRolesSectionData } from "@/lib/cms/types";
import { toAbsoluteMediaUrl } from "@/lib/cms/media";
import { ExpressInterestModal } from "../ExpressInterestModal";

function renderBody(body: string, emphasis?: string) {
  if (!emphasis || !body.includes(emphasis)) {
    return body;
  }
  const parts = body.split(emphasis);
  return parts.map((part, index) => (
    <span key={index}>
      {part}
      {index < parts.length - 1 && (
        <span className="font-bold">{emphasis}</span>
      )}
    </span>
  ));
}

/**
 * Career roles CTA — Figma Frame 157 (24637:9425).
 * White card on blue gradient; copy left with real inset padding, portrait right.
 */
export function CareerRolesSection({
  badgeLabel = "Explore Roles",
  heading,
  headingAccent,
  body,
  bodyEmphasis,
  ctaLabel = "Express interest early",
  image,
}: CareerRolesSectionData) {
  const imageSrc = image?.url
    ? toAbsoluteMediaUrl(image.url)
    : "/assets/career/roles-portrait.png";

  return (
    <section
      className="bg-waitlist-section px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-[6.25rem] lg:px-14 xl:px-20"
      aria-labelledby="career-roles-heading"
    >
      <div className={layout.inner}>
        <div className="relative flex min-h-0 flex-col overflow-hidden rounded-[1.5rem] bg-white lg:min-h-[34.5rem]">
          <div className="relative z-[1] flex w-full flex-col items-start justify-center gap-10 p-8 sm:gap-12 sm:p-10 md:p-12 lg:max-w-[58%] lg:py-12 lg:pl-12 lg:pr-8 xl:max-w-[46.75rem] xl:pl-14">
            <div className="flex w-full flex-col items-start gap-6">
              {badgeLabel && <SectionBadge>{badgeLabel}</SectionBadge>}

              <div className="flex w-full flex-col items-start gap-4">
                <h2
                  id="career-roles-heading"
                  className={`${homeSerif.className} text-[clamp(1.75rem,4.2vw,3rem)] font-normal italic leading-[1.25] tracking-[-0.02em] text-navy lg:leading-[3.75rem]`}
                >
                  {heading}
                  {headingAccent ? (
                    <>
                      {" "}
                      <span className="text-brand-strong">{headingAccent}</span>
                    </>
                  ) : null}
                </h2>

                <p className="max-w-[46.75rem] text-base leading-7 text-ink sm:text-xl sm:leading-[1.875rem]">
                  {renderBody(body, bodyEmphasis)}
                </p>
              </div>
            </div>

            {ctaLabel && <ExpressInterestModal ctaLabel={ctaLabel} />}
          </div>

          <div
            className="relative mx-auto mt-2 h-[16rem] w-[11.5rem] sm:h-[20rem] sm:w-[14.5rem] md:h-[22rem] md:w-[16rem] lg:hidden"
            aria-hidden
          >
            <Image
              src={imageSrc}
              alt={image?.alternativeText ?? ""}
              fill
              sizes="256px"
              className="object-contain object-bottom"
            />
          </div>

          <div
            className="pointer-events-none absolute inset-y-0 right-8 hidden w-[38%] max-w-[24.3125rem] lg:block xl:right-12"
            aria-hidden
          >
            <div className="relative ml-auto h-full w-full max-w-[24.3125rem]">
              <Image
                src={imageSrc}
                alt={image?.alternativeText ?? ""}
                fill
                sizes="389px"
                className="object-contain object-bottom"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
