/**
 * Decorative blurred circle accent — Figma "Ellipse 2" (26344:16086).
 * Purely decorative: absolutely positioned, non-interactive, clipped by
 * the hero section's own `overflow-hidden`.
 */
export function HeroGlowAccent() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -left-52 -top-32 h-[529px] w-[529px] rounded-full bg-[#82AEFF] blur-[150px]"
    />
  );
}
