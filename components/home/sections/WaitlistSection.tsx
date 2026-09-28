import { homeSerif } from "../../ui/fonts";
import { layout } from "../../ui/type";
import type { WaitlistSectionData } from "@/lib/cms/types";
import { WaitlistCountdown } from "./WaitlistCountdown";

/**
 * Waitlist CTA band — heading + CTAs + optional Countdown.
 * Home page passes showCountdown={true}. Other pages hide countdown.
 */
export function WaitlistSection({
  heading,
  subhead,
  joinLabel = "Join the waitlist",
  joinHref,
  demoLabel,
  demoHref,
  showCountdown = false,
}: WaitlistSectionData & { showCountdown?: boolean }) {
  const href = joinHref?.trim() || "/waitlist";
  const showDemo = Boolean(demoLabel?.trim() && demoHref?.trim());

  return (
    <section id="waitlist" className={`w-full bg-waitlist-section ${layout.sectionX} py-12 sm:py-16 md:py-20`}>
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 text-center sm:gap-10 md:gap-12">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#B2DDFF] bg-[#EFF8FF] px-3 py-1 text-xs sm:text-sm font-medium text-[#175CD3]">
          <span className="h-2 w-2 rounded-full bg-[#2E90FA]" aria-hidden />
          <span>Join the Waitlist</span>
        </div>

        <div className="flex w-full flex-col items-center gap-4 sm:gap-6">
          <h2
            className={`${homeSerif.className} text-hero-display-on-dark w-full text-3xl italic sm:text-4xl md:text-5xl lg:text-[48px] leading-[1.2] tracking-[-0.02em] text-white`}
          >
            {heading}
          </h2>
          {subhead && (
            <p className="max-w-2xl text-base font-medium leading-7 text-white sm:text-lg sm:leading-8 md:text-xl md:leading-[30px]">
              {subhead}
            </p>
          )}
        </div>

        <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-start sm:gap-3">
          {joinLabel ? (
            <a
              href={href}
              className="inline-flex items-center justify-center rounded-pill border border-[#D0D5DD] bg-white px-5 py-3 text-base font-semibold text-[#344054] shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {joinLabel}
            </a>
          ) : null}
          {showDemo ? (
            <a
              href={demoHref}
              className="inline-flex min-w-[10.1875rem] items-center justify-center rounded-pill border border-line-strong bg-transparent px-5 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-white/10 active:scale-[0.98]"
            >
              {demoLabel}
            </a>
          ) : null}
        </div>

        {/* Countdown Timer — Only shown on Home page */}
        {showCountdown && (
          <WaitlistCountdown
            initialDays={108}
            initialHours={5}
            initialMinutes={20}
            targetDate="2027-01-11T00:00:00Z"
          />
        )}
      </div>
    </section>
  );
}


