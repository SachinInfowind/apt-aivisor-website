import { WaitlistSection } from "@/components/home/sections/WaitlistSection";
import { layout } from "@/components/ui/type";

/** Shared bottom CTA band for /blogs pages — matches the home waitlist band. */
export function BlogWaitlistCta() {
  return (
    <>
      <WaitlistSection
        __component="sections.waitlist"
        id={0}
        heading="Which side of the deal are you on?"
        subhead="Join the aptAIvisor waitlist. Pick your plan when we launch and get 20% off your first year."
        joinLabel="Join the waitlist"
        joinHref="/waitlist"
        demoLabel="Try demo"
        demoHref="#demo"
      />
      <aside
        className={`bg-[#0B55DD] ${layout.sectionX} py-4 sm:py-5`}
        aria-label="Waitlist assurances"
      >
        <div
          className={`${layout.inner} flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:items-center sm:text-left sm:gap-6`}
        >
          <p className="text-[1rem] font-semibold leading-7 text-white sm:text-[1.25rem] sm:leading-[1.875rem]">
            No spam.&nbsp;&nbsp;No credit card.&nbsp;&nbsp;Launching Q1 2027
          </p>
          <p className="text-[1rem] font-semibold leading-7 text-white sm:text-[1.25rem] sm:leading-[1.875rem]">
            Waitlist members get 20% off year 1
          </p>
        </div>
      </aside>
    </>
  );
}
