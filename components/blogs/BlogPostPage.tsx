import Image from "next/image";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/HeaderCms";
import { HeroGlowAccent } from "@/components/ui/HeroGlowAccent";
import { homeSerif } from "@/components/ui/fonts";
import { layout } from "@/components/ui/type";
import { toAbsoluteMediaUrl } from "@/lib/cms/media";
import type { BlogPost } from "@/lib/cms/types";
import { BlocksRenderer } from "./BlocksRenderer";
import { BlogCard } from "./BlogCard";
import { BlogWaitlistCta } from "./BlogWaitlistCta";
import { ShareRow } from "./ShareRow";
import { ViewTracker } from "./ViewTracker";

function formatDate(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BlogPostPage({
  post,
  relatedPosts,
}: {
  post: BlogPost;
  relatedPosts: BlogPost[];
}) {
  const coverUrl = post.coverImage?.url
    ? toAbsoluteMediaUrl(post.coverImage.url)
    : null;
  const avatarUrl = post.author?.avatar?.url
    ? toAbsoluteMediaUrl(post.author.avatar.url)
    : null;
  const date = formatDate(post.publishedAt);
  const meta = [
    post.category?.name?.toUpperCase(),
    post.readingTimeMinutes ? `${post.readingTimeMinutes} MIN READ` : null,
    typeof post.views === "number" ? `${post.views} Views` : null,
  ].filter(Boolean);

  return (
    <div
      id="top"
      className="relative min-h-screen w-full overflow-x-clip bg-white font-body antialiased"
    >
      <ViewTracker slug={post.slug} />
      <Header />
      <main className="w-full">
        <header className={`relative overflow-hidden ${layout.sectionX} pb-12 pt-32 sm:pt-40`}>
          <HeroGlowAccent />
          <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-9 text-center">
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

            <h1
              className={`${homeSerif.className} text-stat-xl tracking-heading text-navy`}
            >
              {post.title}
            </h1>

            {post.author ? (
              <div className="flex items-center gap-3">
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-pill bg-surface-muted">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={post.author.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  ) : null}
                </span>
                <div className="flex flex-col items-start text-left">
                  <span className="text-body-md font-semibold text-navy">
                    {post.author.name}
                  </span>
                  {date ? (
                    <span className="text-body text-nav">{date}</span>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </header>

        {coverUrl ? (
          <div className={`${layout.sectionX} pb-16`}>
            <div className={`${layout.inner} mx-auto max-w-6xl`}>
              <span className="relative block aspect-[1216/610] w-full overflow-hidden rounded-3xl">
                <Image
                  src={coverUrl}
                  alt={post.coverImage?.alternativeText || post.title}
                  fill
                  sizes="(min-width: 1024px) 1216px, 100vw"
                  className="object-cover"
                  priority
                />
              </span>
            </div>
          </div>
        ) : null}

        <article className={`${layout.sectionX} pb-24`}>
          <div className="mx-auto flex w-full max-w-prose flex-col gap-10">
            {post.content?.length ? (
              <BlocksRenderer content={post.content} />
            ) : (
              <p className="text-body-lg text-nav">{post.excerpt}</p>
            )}

            <div className="border-t border-line pt-8">
              <ShareRow title={post.title} />
            </div>
          </div>
        </article>

        {relatedPosts.length > 0 ? (
          <section className={`${layout.sectionX} pb-24`}>
            <div className={`${layout.inner} flex flex-col items-center gap-8`}>
              <h2
                className={`${homeSerif.className} w-full max-w-6xl text-h2 text-navy`}
              >
                Read More Blogs
              </h2>
              <div className="grid w-full max-w-6xl grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((related) => (
                  <BlogCard key={related.id} post={related} variant="grid" />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <BlogWaitlistCta />
      </main>
      <Footer />
    </div>
  );
}
