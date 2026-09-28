"use client";

import { homeSerif } from "@/components/ui/fonts";
import { toAbsoluteMediaUrl } from "@/lib/cms/media";
import type { SolutionsCtaSection } from "@/lib/cms/types";

function ArrowRightIcon() {
  return (
    <svg width="20" height="28" viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 16.5H14M9.875 22L14 16.5L9.875 11" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function SolutionsCta({
  badge,
  headline,
  subhead,
  primaryButtonLabel,
  primaryButtonHref,
  secondaryButtonLabel,
  secondaryButtonHref,
  tertiaryButtonLabel,
  tertiaryButtonHref,
  image,
  footerLeftText,
  footerRightText,
}: SolutionsCtaSection) {
  const imageUrl = image?.url ? toAbsoluteMediaUrl(image.url) : "";

  return (
    <section className="flex w-full flex-col items-center overflow-hidden bg-[linear-gradient(180deg,#B5CFFF_0%,#1C6BFF_100%)]">
      {/* Top Gradient Section */}
      <div className="relative flex w-full max-w-[1440px] flex-col md:flex-row items-center justify-between px-5 py-12 md:pb-[100px] md:pt-[116px] md:pl-[80px] md:pr-0">
        
        {/* Left Content */}
        <div className="relative z-10 flex w-full max-w-[771px] flex-col items-start gap-[60px] md:gap-[80px]">
          <div className="flex flex-col items-start gap-[30px] w-full">
            <div className="flex flex-col items-start gap-[24px]">
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
              
              <div className="flex flex-col items-start gap-[20px]">
                <h2 className={`${homeSerif.className} text-[48px] italic leading-[1.2] tracking-[-0.96px] text-white`}>
                  {headline}
                </h2>
                {subhead ? (
                  <div 
                    className="max-w-[580px] text-[20px] font-medium leading-[30px] text-white"
                    dangerouslySetInnerHTML={{ __html: subhead }}
                  />
                ) : null}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-[12px] w-full sm:w-auto">
              {primaryButtonLabel ? (
                <a
                  href={primaryButtonHref || "#"}
                  className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-full border border-[#D0D5DD] bg-white px-4 py-2.5 md:px-[18px] md:py-[12px] text-[14px] md:text-[16px] font-semibold leading-[24px] text-[#344054] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-gray-50"
                >
                  {primaryButtonLabel}
                </a>
              ) : null}
              {secondaryButtonLabel ? (
                <a
                  href={secondaryButtonHref || "#"}
                  className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-full border border-white px-4 py-2.5 md:px-[18px] md:py-[12px] text-[14px] md:text-[16px] font-semibold leading-[24px] text-white transition-colors hover:bg-white/20"
                >
                  {secondaryButtonLabel}
                </a>
              ) : null}
            </div>
          </div>

          {tertiaryButtonLabel ? (
            <a
              href={tertiaryButtonHref || "#"}
              className="flex items-center gap-1.5 rounded-full py-1 text-[16px] font-semibold leading-[24px] text-white transition-opacity hover:opacity-80"
            >
              {tertiaryButtonLabel}
              <ArrowRightIcon />
            </a>
          ) : null}
        </div>

        {/* Right Graphic Area - Absolute positioned so it doesn't stretch height */}
        <div className="absolute right-0 bottom-0 z-0 h-full w-[50%] overflow-hidden pointer-events-none hidden md:block">
          <div className="absolute right-[-150px] bottom-[-200px] w-[834px] h-[834px]">
            <svg viewBox="0 0 834 834" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-0 top-0 w-full h-full">
              <path d="M417 0C647.302 0 834 186.698 834 417C834 647.302 647.302 834 417 834C186.698 834 0 647.302 0 417C0 186.698 186.698 0 417 0ZM417.002 126.508C256.566 126.508 126.508 256.566 126.508 417.002C126.508 577.437 256.566 707.496 417.002 707.496C577.437 707.496 707.496 577.437 707.496 417.002C707.496 256.566 577.437 126.508 417.002 126.508Z" fill="#72A3FF" fillOpacity="0.2"/>
            </svg>
            <svg viewBox="0 0 467 467" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-[184px] top-[184px] w-[467px] h-[467px]">
              <path d="M233.098 0C361.834 0 466.196 104.361 466.196 233.098C466.196 361.834 361.834 466.196 233.098 466.196C104.361 466.196 0 361.834 0 233.098C0 104.361 104.361 0 233.098 0ZM233.102 70.7188C143.42 70.7188 70.7188 143.42 70.7188 233.102C70.7188 322.783 143.42 395.484 233.102 395.484C322.783 395.484 395.484 322.783 395.484 233.102C395.484 143.42 322.783 70.7188 233.102 70.7188Z" fill="#93B9FF" fillOpacity="0.2"/>
            </svg>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Product preview"
                className="absolute left-[73px] top-[84px] w-[400px] h-[400px] object-cover drop-shadow-[-5px_5px_20px_rgba(0,66,187,0.30)]"
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* Bottom Blue Bar */}
      <div className="flex w-full justify-center bg-[#0B55DD] px-5 py-5 md:px-[80px]">
        <div className="flex w-full max-w-[1280px] flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          {footerLeftText ? (
            <div className="text-[16px] md:text-[20px] font-semibold leading-[30px] text-white">
              {footerLeftText}
            </div>
          ) : null}
          {footerRightText ? (
            <div className="text-[16px] md:text-[20px] font-semibold leading-[30px] text-white">
              {footerRightText}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
