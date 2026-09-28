"use client";

import Image from "next/image";
import { homeSerif } from "@/components/ui/fonts";
import { toAbsoluteMediaUrl } from "@/lib/cms/media";
import type { SolutionsSecuritySection } from "@/lib/cms/types";

export function SolutionsSecurity({
  badge,
  headline,
  headlineAccent,
  subhead,
  items,
}: SolutionsSecuritySection) {
  return (
    <section className="relative flex w-full flex-col items-center bg-[linear-gradient(180deg,#E8F0FF_0%,#82AEFF_100%)] px-5 py-12 md:px-[80px] md:py-[100px]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-12">
        <div className="flex w-full max-w-[837px] flex-col items-start gap-3">
          <div className="flex w-full max-w-[620px] flex-col items-start gap-6">
            {badge ? (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#B2DDFF] bg-[#EFF8FF] px-2.5 py-1">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="4" cy="4" r="3" fill="#2E90FA" />
                </svg>
                <div className="text-center font-body text-sm font-medium leading-[20px] text-[#175CD3]">
                  {badge}
                </div>
              </div>
            ) : null}
            <h2
              className={`${homeSerif.className} text-[48px] italic leading-[1.2] tracking-[-0.96px] text-[#182230]`}
            >
              {headline} {headlineAccent ? <span className="text-[#4F8DFF]">{headlineAccent}</span> : null}
            </h2>
          </div>
          {subhead ? (
            <p className="text-[20px] font-medium leading-[30px] text-[#344054]">
              {subhead}
            </p>
          ) : null}
        </div>

        <div className="grid w-full grid-cols-1 justify-center gap-[26px] md:grid-cols-2 xl:grid-cols-4">
          {items?.map((item, index) => {
            const imageUrl = item.icon?.url ? toAbsoluteMediaUrl(item.icon.url) : "";
            return (
              <div 
                key={item.title || index} 
                className="group relative flex w-full max-w-[300px] flex-col items-start mx-auto xl:mx-0 rounded-[20px] transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,66,187,0.30)]"
              >
                <div className="relative flex h-[289px] w-full items-center justify-center overflow-hidden rounded-t-[20px] bg-[linear-gradient(180deg,#1F6DFF_0%,#AFCBFF_100%)] px-[24px]">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.icon?.alternativeText || item.title}
                      width={253}
                      height={253}
                      className="h-auto w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.07]"
                    />
                  ) : (
                    <div className="h-[200px] w-full bg-white/20 rounded-xl" />
                  )}
                </div>
                <div className="flex w-full flex-1 flex-col items-start gap-4 rounded-b-[20px] bg-white px-5 pb-[52px] pt-5">
                  <h3 className={`${homeSerif.className} text-[24px] font-normal leading-[32px] text-[#182230]`}>
                    {item.title}
                  </h3>
                  {item.description ? (
                    <p className="font-body text-[16px] font-normal leading-[24px] text-[#344054]">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
