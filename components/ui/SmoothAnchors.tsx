"use client";

import { useEffect } from "react";

/**
 * Smooth, eased scrolling for in-page anchor links (`<a href="#apply">`, `<a href="#top">`).
 *
 * CSS `scroll-behavior: smooth` can't control speed, so this animates the scroll itself:
 *  - every in-page anchor (e.g. "Apply to become a design partner" → the form) glides over
 *    roughly 0.9–1.8 s depending on distance, so the movement reads as a deliberate transition,
 *  - links to `#top` (the footer's "Back at top") use the same easing but are ~25% quicker.
 * Override per link with `data-scroll-duration="900"` (milliseconds).
 *
 * Only anchors that point at a real element on the page are handled; links like `#demo`
 * (which open the Demo modal) and modified clicks (ctrl/cmd/shift/middle) are left alone.
 * Users who prefer reduced motion get an instant jump. The animation stops as soon as the
 * user scrolls or presses a key themselves.
 */
/** Duration grows with distance (so long pages don't feel rushed) within these bounds. */
const MIN_DURATION_MS = 900;
const MAX_DURATION_MS = 1800;
/** "Back at top" is a little quicker than a normal anchor scroll. */
const TOP_SPEEDUP = 0.75;

const durationFor = (distancePx: number, isTop: boolean) => {
  const base = Math.min(MAX_DURATION_MS, Math.max(MIN_DURATION_MS, 800 + distancePx * 0.11));
  return isTop ? base * TOP_SPEEDUP : base;
};

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Keys that scroll the page — pressing one hands control back to the user. */
const SCROLL_KEYS = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Spacebar"]);
/** Ignore tiny wheel ticks (resting fingers, trackpad noise) — only real scrolling cancels. */
const WHEEL_CANCEL_DELTA = 12;
/** If the page moved this far from where we last put it, the user (or something else) scrolled it. */
const EXTERNAL_SCROLL_PX = 40;

export function SmoothAnchors() {
  useEffect(() => {
    let frame = 0;

    // While gliding, turn off the browser's scroll anchoring: when content above the target
    // changes size (lazy images, fonts) Chrome nudges scrollY to compensate, which would look like
    // the user scrolling and fight the animation. We re-read the target every frame instead.
    const setAnchoring = (enabled: boolean) => {
      document.documentElement.style.overflowAnchor = enabled ? "" : "none";
    };

    const cancel = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      setAnchoring(true);
    };

    /** Animates to `getTargetY()`, re-reading it every frame so layout shifts (lazy images,
     *  fonts) can't make the scroll land in the wrong place. */
    const scrollTo = (getTargetY: () => number, duration: number) => {
      cancel();
      setAnchoring(false);
      const startY = window.scrollY;
      const startTime = performance.now();
      let lastSetY = startY;

      const step = (now: number) => {
        // Someone else moved the page (user scrolled, keyboard, scrollbar drag): back off.
        if (Math.abs(window.scrollY - lastSetY) > EXTERNAL_SCROLL_PX) {
          frame = 0;
          setAnchoring(true);
          return;
        }
        const t = Math.min(1, (now - startTime) / duration);
        const y = startY + (getTargetY() - startY) * easeInOutCubic(t);
        window.scrollTo(0, y);
        lastSetY = window.scrollY;
        if (t < 1) {
          frame = requestAnimationFrame(step);
        } else {
          frame = 0;
          setAnchoring(true);
        }
      };
      frame = requestAnimationFrame(step);
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = (event.target as Element | null)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!link) return;

      const hash = link.getAttribute("href") ?? "";
      const id = decodeURIComponent(hash.slice(1));
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return; // e.g. "#demo" — handled elsewhere

      event.preventDefault();
      history.pushState(null, "", hash);

      const getTargetY = () => (id === "top" ? 0 : target.getBoundingClientRect().top + window.scrollY);
      const distance = Math.abs(getTargetY() - window.scrollY);
      const custom = Number(link.dataset.scrollDuration);
      const duration = custom > 0 ? custom : durationFor(distance, id === "top");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        window.scrollTo(0, getTargetY());
      } else {
        scrollTo(getTargetY, duration);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) >= WHEEL_CANCEL_DELTA || Math.abs(e.deltaX) >= WHEEL_CANCEL_DELTA) cancel();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) cancel();
    };

    // Capture phase: Next.js <Link> handles (and cancels) the click during bubbling, so we
    // must run first — once we preventDefault, <Link> leaves the click alone.
    document.addEventListener("click", onClick, true);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", cancel, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      cancel();
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", cancel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
