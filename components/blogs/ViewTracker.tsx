"use client";

import { useEffect } from "react";

/**
 * Fires once per mount to register a pageview. The route handler is the
 * one that decides whether it actually counts (cookie-gated, one counted
 * view per visitor per post per day) — this component just triggers it.
 */
export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`/api/blog-views/${encodeURIComponent(slug)}`, {
      method: "POST",
    }).catch(() => {
      // Best-effort — a failed view count should never affect the reader.
    });
  }, [slug]);

  return null;
}
