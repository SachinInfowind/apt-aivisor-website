import Link from "next/link";
import { homeSerif } from "@/components/ui/fonts";
import { layout } from "@/components/ui/type";

export function BlogWaitlistCta() {
  return (
    <div className="w-full">
      <section
        aria-label="Join the Waitlist CTA"
        className={`w-full bg-waitlist-section py-20 sm:py-24 ${layout.sectionX}`}
      >
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <div className="flex flex-col items-center gap-4 sm:gap-5">
            <h2
              className={`${homeSerif.className} text-h2 font-normal italic tracking-heading text-white`}
            >
              Which side of the deal are you on?
            </h2>
            <p className="text-body-lg font-medium leading-relaxed text-white">
              Join the aptAIvisor waitlist. Pick your plan when we launch and get 20% off your first year.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-3.5">
            <Link
              href="/waitlist"
              className="inline-flex h-12 items-center justify-center rounded-pill border border-line-strong bg-white px-5 text-body font-semibold text-ink shadow-field transition-all hover:bg-surface hover:shadow-card active:scale-95"
            >
              Join the waitlist
            </Link>
            <a
              href="#demo"
              className="inline-flex h-12 min-w-36 items-center justify-center rounded-pill border border-white/60 bg-transparent px-5 text-body font-semibold text-white shadow-field transition-all hover:bg-white/10 hover:border-white active:scale-95"
            >
              Try demo
            </a>
          </div>
        </div>
      </section>

      {/* Solid blue sub-bar */}
      <div className={`w-full bg-brand-active py-5 ${layout.sectionX}`}>
        <div className="mx-auto flex max-w-content 2xl:max-w-page flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
          <p className="text-body font-semibold leading-7 text-white sm:text-body-lg">
            No spam. No credit card. &nbsp;Launching Q1 2027
          </p>
          <p className="text-body font-semibold leading-7 text-white sm:text-body-lg">
            Waitlist members get 20% off year 1
          </p>
        </div>
      </div>
    </div>
  );
}
