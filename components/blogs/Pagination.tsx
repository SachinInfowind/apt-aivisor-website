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

export function Pagination({ page = 1, pageCount = 1 }: { page: number; pageCount: number }) {
  const total = Math.max(1, pageCount);
  const isFirstPage = page <= 1;
  const isLastPage = page >= total;

  return (
    <nav
      aria-label="Blog pagination"
      className="flex w-full items-center justify-between border-t border-line-muted pt-5"
    >
      <Link
        href={pageHref(Math.max(1, page - 1))}
        aria-disabled={isFirstPage}
        className={`inline-flex items-center gap-2 text-body-sm font-semibold text-nav transition-colors hover:text-brand ${
          isFirstPage ? "pointer-events-none opacity-40 cursor-not-allowed" : ""
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path
            d="M15.8333 10H4.16667M4.16667 10L10 15.8333M4.16667 10L10 4.16667"
            stroke="currentColor"
            strokeWidth="1.67"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Previous
      </Link>

      <div className="flex items-center gap-1">
        {pageNumbers(page, total).map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="grid h-10 w-10 place-items-center text-body-sm font-medium text-nav"
            >
              ...
            </span>
          ) : (
            <Link
              key={p}
              href={pageHref(p)}
              aria-current={p === page ? "page" : undefined}
              className={`grid h-10 w-10 place-items-center rounded-lg text-body-sm font-medium transition-colors ${
                p === page
                  ? "bg-surface text-navy font-semibold shadow-soft"
                  : "text-nav hover:bg-surface hover:text-navy"
              }`}
            >
              {p}
            </Link>
          ),
        )}
      </div>

      <Link
        href={pageHref(Math.min(total, page + 1))}
        aria-disabled={isLastPage}
        className={`inline-flex items-center gap-2 text-body-sm font-semibold text-nav transition-colors hover:text-brand ${
          isLastPage ? "pointer-events-none opacity-40 cursor-not-allowed" : ""
        }`}
      >
        Next
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path
            d="M4.16667 10H15.8333M15.8333 10L10 4.16667M15.8333 10L10 15.8333"
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
