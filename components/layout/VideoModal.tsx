"use client";

import { useEffect } from "react";

/** True for absolute URLs (CMS video links); anchors like "#tutorials" fall back to normal navigation. */
export function isVideoUrl(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/** Converts a YouTube/Vimeo watch URL into its embeddable, autoplaying form. */
function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1);
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }

    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v");
        if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
      }
      if (u.pathname.startsWith("/embed/")) {
        return `${u.origin}${u.pathname}?autoplay=1`;
      }
    }

    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }

    return url;
  } catch {
    return url;
  }
}

export function VideoModal({
  videoUrl,
  onClose,
}: {
  videoUrl: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Video player"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-2xl bg-black shadow-card-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close video"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden
          >
            <path
              d="M2 2L14 14M14 2L2 14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <iframe
          src={toEmbedUrl(videoUrl)}
          title="Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
