import { homeSerif } from "@/components/ui/fonts";
import { layout } from "@/components/ui/type";
import type { DesignPartnerChecklistSection } from "@/lib/cms/types";

/**
 * "Our commitment to you" — 4×2 checkmark grid in a white panel.
 * Sits directly under the commitment-cards section as one continuous
 * gradient (Figma "Frame 255" — both are a single frame with a single
 * `#E8F0FF → #82AEFF` gradient spanning their combined height). Since these
 * render as two separate sibling sections, this one picks up in the same
 * `#82AEFF` tone the cards section's gradient ends at — a fresh 0%→100%
 * gradient here would restart light-to-dark and create a visible seam.
 */
export function ChecklistSection({
  heading,
  headingAccent,
  subheading,
  items,
}: DesignPartnerChecklistSection) {
  return (
    <section className="w-full bg-brand-light pb-16 pt-0 sm:pb-20 md:pb-24">
      <div className={`${layout.sectionX}`}>
        <div className={`${layout.inner} w-full max-w-container`}>
          <div className="flex flex-col items-start gap-5 rounded-3xl bg-white p-5 sm:p-7">
            <div className="flex flex-col gap-2">
              <h2
                className={`${homeSerif.className} text-title leading-title text-navy`}
              >
                {heading}
                {headingAccent ? (
                  <span className="italic text-brand-accent">
                    {" "}
                    {headingAccent}
                  </span>
                ) : null}
              </h2>
              {subheading ? (
                <p className="text-base leading-7 text-ink">
                  {subheading}
                </p>
              ) : null}
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {items?.map((item, i) => (
                <div
                  key={`${item.text}-${i}`}
                  className="flex flex-row items-center gap-3 rounded-2xl p-4 sm:flex-col sm:items-start sm:justify-center sm:gap-4 sm:p-6 bg-surface"
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden className="shrink-0">
                    <circle className="fill-brand" cx="16" cy="16" r="16" />
                    <path
                      d="M10 16l4 4 8-8"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-base font-medium leading-6 text-ink">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
