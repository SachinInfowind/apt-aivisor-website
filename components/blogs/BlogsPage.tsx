import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/HeaderCms";
import { HeroGlow } from "@/components/ui/HeroGlow";
import { CloudBand } from "@/components/ui/CloudBand";
import { homeSerif } from "@/components/ui/fonts";
import { layout } from "@/components/ui/type";
import { BlogCard } from "./BlogCard";
import { BlogWaitlistCta } from "./BlogWaitlistCta";
import { NewsletterForm } from "./NewsletterForm";
import { Pagination } from "./Pagination";
import type { BlogHeroSection, BlogPost } from "@/lib/cms/types";

export default function BlogsPage({
  posts,
  page,
  pageCount,
  hero,
}: {
  hero?: BlogHeroSection;
  posts: BlogPost[];
  page: number;
  pageCount: number;
}) {
  const heading = hero?.heading?.trim() || "Resource";
  const headingAccent = hero?.headingAccent?.trim() || "Library";
  const subhead =
    hero?.subhead?.trim() ||
    "Subscribe to learn about new product features, the latest in technology, solutions, and updates.";

  return (
    <div
      id="top"
      className="relative min-h-screen w-full overflow-x-clip bg-white font-body antialiased"
    >
      <Header />
      <main className="w-full">
        <section
          className={`relative overflow-hidden bg-hero-mesh ${layout.sectionX} pb-36 sm:pb-48 lg:pb-60 pt-32 sm:pt-40`}
        >
          <HeroGlow />
          <div
            className={`${layout.inner} relative z-[1] flex flex-col items-center gap-10 sm:gap-12 text-center`}
          >
            <div className="flex flex-col items-center gap-6 sm:gap-9">
              <h1
                className={`${homeSerif.className} text-display tracking-heading text-navy`}
              >
                <span>{heading}</span>{" "}
                <span className="italic text-brand">{headingAccent}</span>
              </h1>
              <p className="max-w-3xl text-body-lg text-ink">
                {subhead}
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <NewsletterForm
                placeholder={hero?.emailPlaceholder || "Enter your email"}
                subscribeLabel={hero?.subscribeLabel || "Subscribe"}
              />
              <p className="text-body-sm text-nav">
                {hero?.privacyPrefix || "We care about your data in our"}{" "}
                <a
                  href={hero?.privacyLinkHref || "/privacy"}
                  className="text-brand underline underline-offset-2 hover:opacity-80"
                >
                  {hero?.privacyLinkLabel || "privacy policy"}
                </a>
                .
              </p>
            </div>
          </div>
          <CloudBand priority variant="band" />
        </section>

        <section className={`${layout.sectionX} pb-24`}>
          <div className={`${layout.inner} flex flex-col items-center gap-16`}>
            {posts.length > 0 ? (
              <div className="flex w-full max-w-6xl flex-col items-center gap-16">
                {page === 1 ? (
                  <BlogCard post={posts[0]!} variant="featured" />
                ) : null}

                {(page === 1 ? posts.slice(1) : posts).length > 0 ? (
                  <div className="grid w-full grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                    {(page === 1 ? posts.slice(1) : posts).map((post) => (
                      <BlogCard
                        key={post.id}
                        post={post}
                        variant="grid"
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="text-body text-subtle">
                {hero?.emptyLabel}
              </p>
            )}

            <div className="w-full max-w-6xl">
              <Pagination page={page} pageCount={pageCount} />
            </div>
          </div>
        </section>

        <BlogWaitlistCta />
      </main>
      <Footer />
    </div>
  );
}
