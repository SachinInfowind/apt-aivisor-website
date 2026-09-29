/**
 * Two soft blurred blobs behind a hero (Figma Hero 3311:11801): #B5CFFF top
 * right, #82AEFF top left, r=264 on a 1440×895 canvas, blur 150. Layer it
 * over `bg-hero-mesh` inside a `relative overflow-hidden` section.
 */
export function HeroGlow({ className = "" }: { className?: string }) {
  const blob =
    "absolute aspect-square w-glow rounded-full blur-[150px]";
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
    >
      {/* centres: (129.5, 118.5) and (1310.5, 158.5) of 1440×895 */}
      <div className={`${blob} left-[9%] top-[13%] -translate-x-1/2 -translate-y-1/2 bg-brand-light`} />
      <div className={`${blob} left-[91%] top-[18%] -translate-x-1/2 -translate-y-1/2 bg-brand-veil`} />
    </div>
  );
}
