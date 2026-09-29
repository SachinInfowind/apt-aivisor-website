import Image from "next/image";

/**
 * Reusable decorative cloud edge (Figma "cloude", 1630×404 on a 1440 canvas).
 * White scallops with a soft blue glow above them, transparent at the top —
 * drop it into any `relative overflow-hidden` section to blend that section
 * into the white one below (or above, with `edge="top"`).
 *
 * Purely decorative: `aria-hidden`, no pointer events, sits behind content
 * (`z-0`), so give the section's content `relative z-1` and enough bottom
 * padding that text doesn't sit on the clouds.
 */
export const CLOUD_BAND_SRC = "/assets/clouds/cloud-band.png";
/** Full-width cloud edge with its own blue glow (Figma export, 1426×292). */
export const CLOUD_EDGE_SRC = "/assets/clouds/cloud-edge.png";

type CloudBandProps = {
  /** Which section edge the clouds hug. `top` flips the art vertically. */
  edge?: "bottom" | "top";
  className?: string;
  priority?: boolean;
  /** `band` = 1630px art centred, bleeding past the sides (default); `edge` = 1426×292 art scaled to the section width. */
  variant?: "band" | "edge";
};

export function CloudBand({
  edge = "bottom",
  className = "",
  priority = false,
  variant = "band",
}: CloudBandProps) {
  const anchor = edge === "bottom" ? "bottom-0" : "top-0 -scale-y-100";
  if (variant === "edge") {
    return (
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 z-0 overflow-hidden ${anchor} ${className}`}
      >
        <Image
          src={CLOUD_EDGE_SRC}
          alt=""
          width={1426}
          height={292}
          sizes="100vw"
          priority={priority}
          className="block h-auto w-full max-w-none select-none"
        />
      </div>
    );
  }
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 z-0 overflow-hidden ${anchor} ${className}`}
    >
      {/* Figma: art is wider than the 1440 canvas (1630px, offset -91px):
          centre it and let the sides bleed so the scallops span every
          viewport width. */}
      <div className="relative left-1/2 aspect-[1630/404] w-[max(113.2%,60rem)] -translate-x-1/2">
        <Image
          src={CLOUD_BAND_SRC}
          alt=""
          width={1568}
          height={320}
          sizes="120vw"
          priority={priority}
          className="h-full w-full max-w-none select-none object-fill"
        />
      </div>
    </div>
  );
}
