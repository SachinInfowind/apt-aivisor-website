/**
 * Small UI glyphs, inlined as React components. These are interface icons (arrows,
 * social marks, a quote mark) — not content — so they live in code, not the CMS.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function ArrowCircleLeftIcon(props: IconProps) {
  const rest = props;
  return (
    <svg aria-hidden {...rest} width="24" height="24" viewBox="0 0 24 24" fill="none">
<path d="M12 16L8 12L12 8M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#4F8DFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
  );
}

export function ArrowCircleDownIcon(props: IconProps) {
  const rest = props;
  return (
    <svg aria-hidden {...rest} width="24" height="24" viewBox="0 0 24 24" fill="none">
<path d="M16 12L12 16L8 12M12 16V8M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#182230" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  const rest = props;
  return (
    <svg aria-hidden {...rest} width="24" height="24" viewBox="0 0 24 24" fill="none">
<g clipPath="url(#clip_footer_linkedin)">
<path d="M22.2234 0H1.77187C0.792187 0 0 0.773438 0 1.72969V22.2656C0 23.2219 0.792187 24 1.77187 24H22.2234C23.2031 24 24 23.2219 24 22.2703V1.72969C24 0.773438 23.2031 0 22.2234 0ZM7.12031 20.4516H3.55781V8.99531H7.12031V20.4516ZM5.33906 7.43438C4.19531 7.43438 3.27188 6.51094 3.27188 5.37187C3.27188 4.23281 4.19531 3.30937 5.33906 3.30937C6.47813 3.30937 7.40156 4.23281 7.40156 5.37187C7.40156 6.50625 6.47813 7.43438 5.33906 7.43438ZM20.4516 20.4516H16.8937V14.8828C16.8937 13.5562 16.8703 11.8453 15.0422 11.8453C13.1906 11.8453 12.9094 13.2937 12.9094 14.7891V20.4516H9.35625V8.99531H12.7687V10.5609H12.8156C13.2891 9.66094 14.4516 8.70938 16.1813 8.70938C19.7859 8.70938 20.4516 11.0813 20.4516 14.1656V20.4516Z" fill="#98A2B3"/>
</g>
<defs>
<clipPath>
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>
  );
}

export function FacebookIcon(props: IconProps) {
  const rest = props;
  return (
    <svg aria-hidden {...rest} width="24" height="24" viewBox="0 0 24 24" fill="none">
<g clipPath="url(#clip_footer_facebook)">
<path d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z" fill="#98A2B3"/>
</g>
<defs>
<clipPath>
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>
  );
}

export function XIcon(props: IconProps) {
  const rest = props;
  return (
    <svg aria-hidden {...rest} width="24" height="24" viewBox="0 0 24 24" fill="none">
<path fillRule="evenodd" clipRule="evenodd" d="M15.9455 23L10.396 15.0901L3.44886 23H0.509766L9.09209 13.2311L0.509766 1H8.05571L13.286 8.45502L19.8393 1H22.7784L14.5943 10.3165L23.4914 23H15.9455ZM19.2185 20.77H17.2398L4.71811 3.23H6.6971L11.7121 10.2532L12.5793 11.4719L19.2185 20.77Z" fill="#98A2B3"/>
</svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  const rest = props;
  return (
    <svg aria-hidden {...rest} width="24" height="24" viewBox="0 0 24 24" fill="none">
<path d="M23.7609 7.20078C23.7609 7.20078 23.5266 5.54609 22.8047 4.81953C21.8906 3.86328 20.8688 3.85859 20.4 3.80234C17.0438 3.55859 12.0047 3.55859 12.0047 3.55859H11.9953C11.9953 3.55859 6.95625 3.55859 3.6 3.80234C3.13125 3.85859 2.10938 3.86328 1.19531 4.81953C0.473438 5.54609 0.24375 7.20078 0.24375 7.20078C0.24375 7.20078 0 9.14609 0 11.0867V12.9055C0 14.8461 0.239062 16.7914 0.239062 16.7914C0.239062 16.7914 0.473437 18.4461 1.19062 19.1727C2.10469 20.1289 3.30469 20.0961 3.83906 20.1992C5.76094 20.382 12 20.4383 12 20.4383C12 20.4383 17.0438 20.4289 20.4 20.1898C20.8688 20.1336 21.8906 20.1289 22.8047 19.1727C23.5266 18.4461 23.7609 16.7914 23.7609 16.7914C23.7609 16.7914 24 14.8508 24 12.9055V11.0867C24 9.14609 23.7609 7.20078 23.7609 7.20078ZM9.52031 15.1133V8.36797L16.0031 11.7523L9.52031 15.1133Z" fill="#98A2B3"/>
</svg>
  );
}

export function QuoteMarkIcon(props: IconProps) {
  const rest = props;
  return (
    <svg aria-hidden {...rest} width="69" height="53" viewBox="0 0 69 53" fill="none">
<path d="M23.6516 0L28.5382 9.35295C26.0623 11.0417 23.7167 13.25 21.5014 15.9779C19.4164 18.7059 17.7224 21.6287 16.4193 24.7463C15.1161 27.864 14.3994 30.8517 14.2691 33.7096H8.79604C8.92635 31.6311 9.83853 29.9424 11.5326 28.6434C13.2266 27.2145 15.1813 26.5 17.3966 26.5C20.7847 26.5 23.5864 27.7341 25.8017 30.2022C28.1473 32.6703 29.3201 35.723 29.3201 39.3603C29.3201 43.1275 27.9518 46.375 25.2153 49.1029C22.4788 51.701 19.1558 53 15.2465 53C12.3796 53 9.77337 52.2206 7.42776 50.6618C5.21247 48.973 3.3881 46.7647 1.95467 44.0368C0.651558 41.3088 0 38.3211 0 35.0735C0 31.3064 1.04249 27.2794 3.12748 22.9926C5.21247 18.576 8.07932 14.3542 11.728 10.3272C15.3768 6.30025 19.3513 2.85784 23.6516 0ZM63.3314 0L68.2181 9.35295C65.7422 11.0417 63.3966 13.25 61.1813 15.9779C59.0963 18.7059 57.4023 21.6287 56.0992 24.7463C54.796 27.864 54.0793 30.8517 53.949 33.7096H48.4759C48.6062 31.6311 49.5184 29.9424 51.2125 28.6434C52.9065 27.2145 54.8612 26.5 57.0765 26.5C60.4646 26.5 63.2663 27.7341 65.4816 30.2022C67.8272 32.6703 69 35.723 69 39.3603C69 43.1275 67.6317 46.375 64.8952 49.1029C62.1586 51.701 58.8357 53 54.9263 53C52.0595 53 49.4533 52.2206 47.1077 50.6618C44.8924 48.973 43.068 46.7647 41.6346 44.0368C40.3314 41.3088 39.6799 38.3211 39.6799 35.0735C39.6799 31.3064 40.7224 27.2794 42.8074 22.9926C44.8924 18.576 47.7592 14.3542 51.4079 10.3272C55.0567 6.30025 59.0312 2.85784 63.3314 0Z" fill="#4F8DFF"/>
</svg>
  );
}

export function NotFoundCloudIllustration(props: IconProps) {
  const rest = props;
  return (
    <svg aria-hidden {...rest} width="380" height="217" viewBox="0 0 380 217" fill="none">
<g filter="url(#filter0_dd_1_20856)">
<path d="M195.241 0C239.915 0 278.279 27.008 294.9 65.5859C297.79 65.2521 300.73 65.0801 303.709 65.0801C345.642 65.0801 379.637 99.0743 379.637 141.008C379.637 182.614 346.172 216.403 304.69 216.929L303.709 216.936H86.7744L85.6523 216.928C38.2454 216.327 5.11447e-05 177.711 0 130.161C0 82.2372 38.8504 43.3867 86.7744 43.3867C93.655 43.3867 100.348 44.1896 106.767 45.7031C126.423 18.0444 158.725 0.000118145 195.241 0Z" fill="#F9FAFB"/>
<circle cx="86.774" cy="130.161" r="86.774" fill="url(#paint0_linear_1_20856)"/>
<circle cx="195.242" cy="108.468" r="108.468" fill="url(#paint1_linear_1_20856)"/>
<circle cx="303.71" cy="141.008" r="75.9273" fill="url(#paint2_linear_1_20856)"/>
</g>
<defs>
<filter x="-43.6364" y="-2.86102e-06" width="466.909" height="304.208" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feMorphology radius="8.72727" operator="erode" in="SourceAlpha" result="effect1_dropShadow_1_20856"/>
<feOffset dy="17.4545"/>
<feGaussianBlur stdDeviation="8.72727"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.03 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_20856"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feMorphology radius="8.72727" operator="erode" in="SourceAlpha" result="effect2_dropShadow_1_20856"/>
<feOffset dy="43.6364"/>
<feGaussianBlur stdDeviation="26.1818"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.08 0"/>
<feBlend mode="normal" in2="effect1_dropShadow_1_20856" result="effect2_dropShadow_1_20856"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_1_20856" result="shape"/>
</filter>
<linearGradient x1="20.144" y1="72.8281" x2="173.548" y2="216.935" gradientUnits="userSpaceOnUse">
<stop stopColor="#D0D5DD"/>
<stop offset="0.350715" stopColor="white" stopOpacity="0"/>
</linearGradient>
<linearGradient x1="111.954" y1="36.8015" x2="303.71" y2="216.935" gradientUnits="userSpaceOnUse">
<stop stopColor="#D0D5DD"/>
<stop offset="0.350715" stopColor="white" stopOpacity="0"/>
</linearGradient>
<linearGradient x1="245.408" y1="90.8416" x2="379.637" y2="216.935" gradientUnits="userSpaceOnUse">
<stop stopColor="#D0D5DD"/>
<stop offset="0.350715" stopColor="white" stopOpacity="0"/>
</linearGradient>
</defs>
</svg>
  );
}

/** Footer social icon for a CMS social link label (LinkedIn / Facebook / X / Twitter / YouTube). */
export function SocialIcon({ label, ...props }: IconProps & { label: string }) {
  switch (label.toLowerCase()) {
    case "linkedin":
      return <LinkedinIcon {...props} />;
    case "facebook":
      return <FacebookIcon {...props} />;
    case "x":
    case "twitter":
      return <XIcon {...props} />;
    case "youtube":
      return <YoutubeIcon {...props} />;
    default:
      return null;
  }
}
