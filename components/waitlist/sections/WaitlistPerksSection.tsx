import Image from "next/image";
import { layout } from "../../ui/type";
import { toAbsoluteMediaUrl } from "@/lib/cms/media";
import type { WaitlistPerksSection as WaitlistPerksSectionData } from "@/lib/cms/types";

/**
 * Waitlist perks — Figma Frame 207 (26281:29811).
 * Three benefit cards under the waitlist hero.
 */
export function WaitlistPerksSection({ items }: WaitlistPerksSectionData) {
  if (!items?.length) return null;

  return (
    <section
      className={`w-full bg-white/50 ${layout.sectionX} pb-[clamp(4rem,8vw,7.375rem)] pt-[clamp(3rem,6vw,6.25rem)]`}
    >
      <div
        className={`${layout.inner} flex w-full max-w-[80rem] flex-col items-stretch gap-7 md:gap-10`}
      >
        <div className="grid w-full grid-cols-1 gap-5 sm:gap-7 lg:grid-cols-3">
          {items.map((item) => {
            const iconUrl = item.icon?.url
              ? toAbsoluteMediaUrl(item.icon.url)
              : null;
            return (
              <article
                key={`${item.title}-${item.id}`}
                className="flex flex-col items-start gap-6 rounded-3xl border border-line-strong bg-white p-8"
              >
                <div className="flex w-full flex-col items-start gap-[0.9375rem]">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-[0.625rem] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]"
                    style={{ backgroundColor: item.iconBg || "var(--color-brand-soft)" }}
                  >
                    {iconUrl ? (
                      <Image
                        src={iconUrl}
                        alt=""
                        width={24}
                        height={24}
                        className="h-6 w-6"
                        unoptimized
                      />
                    ) : null}
                  </div>
                  <div className="flex w-full flex-col items-start gap-1.5">
                    <h2 className="text-xl font-semibold leading-[1.875rem] text-navy">
                      {item.title}
                    </h2>
                    {item.description ? (
                      <p className="text-sm leading-5 text-ink">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
