import { CmsImage } from "./CmsImage";
import { getGlobal } from "@/lib/cms/queries";

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

/**
 * The artwork comes from the CMS Global record (`cloudBand` for the 1630px band,
 * `cloudEdge` for the full-width edge with its own blue glow, Figma export 1426×292).
 * Server component — use it from server-rendered sections.
 */

type CloudBandProps = {
  /** Which section edge the clouds hug. `top` flips the art vertically. */
  edge?: "bottom" | "top";
  className?: string;
  priority?: boolean;
  /** `band` = 1630px art centred, bleeding past the sides (default); `edge` = 1426×292 art scaled to the section width. */
  variant?: "band" | "edge";
};

export async function CloudBand({
  edge = "bottom",
  className = "",
  priority = false,
  variant = "band",
}: CloudBandProps) {
  const global = await getGlobal();
  const anchor = edge === "bottom" ? "bottom-0" : "top-0 -scale-y-100";
  if (variant === "edge") {
    return (
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 z-0 overflow-hidden ${anchor} ${className}`}
      >
        <CmsImage
          image={global?.cloudEdge}
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
        <CmsImage
          image={global?.cloudBand}
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
