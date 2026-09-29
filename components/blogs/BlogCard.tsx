import Image from "next/image";
import Link from "next/link";
import { homeSerif } from "@/components/ui/fonts";
import { toAbsoluteMediaUrl } from "@/lib/cms/media";
import type { BlogPost } from "@/lib/cms/types";

function formatDate(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BlogCard({
  post,
  variant = "featured",
}: {
  post: BlogPost;
  variant?: "featured" | "grid";
}) {
  const coverUrl = post.coverImage?.url
    ? toAbsoluteMediaUrl(post.coverImage.url)
    : null;
  const avatarUrl = post.author?.avatar?.url
    ? toAbsoluteMediaUrl(post.author.avatar.url)
    : null;
  const meta = [
    post.category?.name?.toUpperCase(),
    post.readingTimeMinutes ? `${post.readingTimeMinutes} MIN READ` : null,
    typeof post.views === "number" ? `${post.views} Views` : null,
  ].filter(Boolean);

  return (
    <article className="flex w-full flex-col items-start gap-5">
      <Link
        href={`/blogs/${post.slug}`}
        className={
          variant === "featured"
            ? "relative aspect-[1216/560] w-full overflow-hidden rounded-3xl bg-surface-muted"
            : "relative h-[240px] w-full shrink-0 self-stretch overflow-hidden rounded-2xl bg-surface-muted"
        }
      >
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={post.coverImage?.alternativeText || post.title}
            fill
            sizes={
              variant === "featured"
                ? "(min-width: 1024px) 1216px, 100vw"
                : "(min-width: 1024px) 384px, 100vw"
            }
            className="object-cover"
          />
        ) : null}
      </Link>

      <div className="flex flex-col items-start gap-6 self-stretch">
        <div className="flex flex-col items-start gap-2 self-stretch">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {meta.map((item, i) => (
              <span key={item} className="flex items-center gap-2">
                {i > 0 ? (
                  <span aria-hidden className="h-1 w-1 rounded-full bg-brand" />
                ) : null}
                <span className="text-caption font-semibold text-brand-deep">
                  {item}
                </span>
              </span>
            ))}
          </div>

          <div className="flex flex-col items-start gap-2 self-stretch">
            <div className="flex items-start gap-4 self-stretch">
              <Link
                href={`/blogs/${post.slug}`}
                className={`${homeSerif.className} text-h4 text-navy transition-colors hover:text-brand`}
              >
                {post.title}
              </Link>
              <span className="pt-1 text-navy" aria-hidden>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 17L17 7M17 17V7H7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <p className="line-clamp-3 self-stretch text-body text-subtle">
              {post.excerpt}
            </p>
          </div>
        </div>

        {post.author ? (
          <div className="flex items-center gap-3">
            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-pill bg-surface-muted">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={post.author.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              ) : null}
            </span>
            <div className="flex flex-col items-start">
              <span className="text-body-sm font-semibold text-navy">
                {post.author.name}
              </span>
              {formatDate(post.publishedAt) ? (
                <span className="text-body-sm text-subtle">
                  {formatDate(post.publishedAt)}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
