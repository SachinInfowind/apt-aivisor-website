import Link from "next/link";
import { homeSerif } from "@/components/ui/fonts";
import { layout } from "@/components/ui/type";

export function BlogWaitlistCta() {
  return (
    <div className="w-full">
      <section
        aria-label="Join the Waitlist CTA"
        className={`w-full bg-gradient-to-b from-[#B5CFFF] to-[#1C6BFF] py-20 sm:py-24 ${layout.sectionX}`}
      >
        <div className="mx-auto flex max-w-[665px] flex-col items-center text-center">
          <div className="flex flex-col items-center gap-4 sm:gap-5">
            <h2
              className={`${homeSerif.className} text-[clamp(2.25rem,4.5vw,3rem)] font-normal italic leading-[1.2] tracking-[-0.02em] text-white`}
            >
              Which side of the deal are you on?
            </h2>
            <p className="text-base font-medium leading-relaxed text-white sm:text-lg md:text-xl sm:leading-[1.5]">
              Join the aptAIvisor waitlist. Pick your plan when we launch and get 20% off your first year.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-3.5">
            <Link
              href="/waitlist"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[#D0D5DD] bg-white px-5 text-base font-semibold text-[#344054] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-all hover:bg-slate-50 hover:shadow-md active:scale-[0.98]"
            >
              Join the waitlist
            </Link>
            <a
              href="#demo"
              className="inline-flex h-12 min-w-[140px] items-center justify-center rounded-full border border-white/60 bg-transparent px-5 text-base font-semibold text-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-all hover:bg-white/10 hover:border-white active:scale-[0.98]"
            >
              Try demo
            </a>
          </div>
        </div>
      </section>

      {/* Solid blue sub-bar */}
      <div className={`w-full bg-[#0B55DD] py-5 ${layout.sectionX}`}>
        <div className="mx-auto flex max-w-content 2xl:max-w-page flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
          <p className="text-base font-semibold leading-7 text-white sm:text-lg md:text-xl sm:leading-[30px]">
            No spam. No credit card. &nbsp;Launching Q1 2027
          </p>
          <p className="text-base font-semibold leading-7 text-white sm:text-lg md:text-xl sm:leading-[30px]">
            Waitlist members get 20% off year 1
          </p>
        </div>
      </div>
    </div>
  );
}
