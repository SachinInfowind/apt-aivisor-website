import Image from "next/image";
import { homeSerif } from "../../ui/fonts";
import { layout } from "../../ui/type";
import type { CardGridSection } from "@/lib/cms/types";
import { toAbsoluteMediaUrl } from "@/lib/cms/media";

/**
 * Career values — Figma Founder Section 24636:8663 (1440×752).
 * Three cards: blue gradient art header + #F9FAFB copy footer.
 */
export function CareerValuesSection({ items }: CardGridSection) {
  return (
    <section
      className={`relative bg-white ${layout.sectionX} ${layout.sectionY}`}
      aria-label="Our values"
    >
      <div className={layout.inner}>
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8 lg:gap-10">
          {items.map((item, index) => (
            <li
              key={`${item.title}-${index}`}
              className="flex flex-col overflow-hidden rounded-[20px]"
            >
              {/* Art header — Figma linear #1F6DFF → #AFCBFF */}
              <div className="relative flex aspect-[181/162] w-full items-center justify-center overflow-hidden rounded-t-[20px] bg-[linear-gradient(180deg,#1F6DFF_0%,#AFCBFF_100%)] px-4 py-6 sm:px-6">
                {item.icon && (
                  <Image
                    src={toAbsoluteMediaUrl(item.icon.url)}
                    alt=""
                    width={item.icon.width ?? 350}
                    height={item.icon.height ?? 220}
                    className="relative z-[1] h-auto w-[88%] max-w-[21.875rem] object-contain drop-shadow-sm"
                  />
                )}
              </div>

              {/* Copy footer */}
              <div className="flex flex-1 flex-col gap-4 rounded-b-[20px] bg-surface p-5 sm:gap-5 sm:p-5">
                <h3
                  className={`${homeSerif.className} text-[1.5rem] font-normal leading-[1.27] text-navy sm:text-[1.875rem] sm:leading-[2.375rem]`}
                >
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-base leading-6 text-nav">
                    {item.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
