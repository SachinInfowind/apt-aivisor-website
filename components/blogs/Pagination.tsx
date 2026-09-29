import Link from "next/link";

function pageHref(page: number) {
  return page <= 1 ? "/blogs" : `/blogs?page=${page}`;
}

/** Numbered pagination with a sliding window around the current page. */
function pageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: (number | "...")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push("...");
    result.push(p);
    prev = p;
  }
  return result;
}

export function Pagination({ page, pageCount }: { page: number; pageCount: number }) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label="Blog pagination"
      className="flex w-full items-center justify-between border-t border-line pt-8"
    >
      <Link
        href={pageHref(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={`inline-flex items-center gap-2 text-body-sm font-semibold text-subtle transition-colors hover:text-brand ${
          page <= 1 ? "pointer-events-none opacity-40" : ""
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path
            d="M16.6693 10H3.33594M3.33594 10L8.33594 15M3.33594 10L8.33594 5"
            stroke="currentColor"
            strokeWidth="1.67"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Previous
      </Link>

      <div className="flex items-center gap-0.5">
        {pageNumbers(page, pageCount).map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="grid h-10 w-10 place-items-center text-body-sm text-subtle"
            >
              ...
            </span>
          ) : (
            <Link
              key={p}
              href={pageHref(p)}
              aria-current={p === page ? "page" : undefined}
              className={`grid h-10 w-10 place-items-center rounded-pill text-body-sm font-medium transition-colors ${
                p === page
                  ? "bg-surface-muted text-navy"
                  : "text-subtle hover:bg-surface-muted hover:text-navy"
              }`}
            >
              {p}
            </Link>
          ),
        )}
      </div>

      <Link
        href={pageHref(Math.min(pageCount, page + 1))}
        aria-disabled={page >= pageCount}
        className={`inline-flex items-center gap-2 text-body-sm font-semibold text-subtle transition-colors hover:text-brand ${
          page >= pageCount ? "pointer-events-none opacity-40" : ""
        }`}
      >
        Next
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path
            d="M3.33594 10H16.6693M16.6693 10L11.6693 5M16.6693 10L11.6693 15"
            stroke="currentColor"
            strokeWidth="1.67"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </nav>
  );
}
