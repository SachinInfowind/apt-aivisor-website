import { Instrument_Serif, Inter } from "next/font/google";

/** Shared Home fonts — apply `.className` on display text so italic face binds reliably */
export const homeSans = Inter({
  subsets: ["latin"],
  variable: "--font-home-sans",
  display: "swap",
});

export const homeSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-home-serif",
  display: "swap",
  adjustFontFallback: false,
});
