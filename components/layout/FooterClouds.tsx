import Image from "next/image";
import { homeAssets } from "../ui/assets";

/**
 * Scalloped cloud band — Figma Frame 1261154243 (26281:8908).
 * Sits at the bottom of a `bg-hero-mesh` hero so the blue glow blends into
 * the mesh and the white scallops transition into the section below.
 */
export function FooterClouds() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 w-full overflow-hidden"
      aria-hidden
    >
      {/* Figma: 1630×404 art on a 1440 canvas, offset ~-91px — center wider than viewport */}
      <div className="relative left-1/2 w-[min(220vw,101.875rem)] max-w-none -translate-x-1/2">
        <Image
          src={homeAssets.footer.clouds}
          alt=""
          width={1568}
          height={288}
          className="h-auto w-full select-none"
          sizes="100vw"
          priority={false}
        />
      </div>
    </div>
  );
}
