import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/HeaderCms";
import { HeroGlowAccent } from "@/components/ui/HeroGlowAccent";
import { homeSerif } from "@/components/ui/fonts";
import { layout } from "@/components/ui/type";
import { BlogCard } from "./BlogCard";
import { BlogWaitlistCta } from "./BlogWaitlistCta";
import { NewsletterForm } from "./NewsletterForm";
import { RecaptchaNotice } from "@/components/ui/Recaptcha";
import { Pagination } from "./Pagination";
import type { BlogHeroSection, BlogPost } from "@/lib/cms/types";
import { CloudBand } from "@/components/ui/CloudBand";

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
  return (
    <div
      id="top"
      className="relative min-h-screen w-full overflow-x-clip bg-white font-body antialiased"
    >
      <Header />
      <main className="w-full">
        <section className={`relative overflow-hidden ${layout.sectionX} pb-[clamp(6rem,20vw,16rem)] pt-32 sm:pt-40`}>
          <HeroGlowAccent />
          <div className={`${layout.inner} relative z-[1] flex flex-col items-center gap-9 text-center`}>
            <div className="flex flex-col items-center gap-4">
              <h1
                className={`${homeSerif.className} text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] tracking-[-0.02em] text-navy`}
              >
                {hero?.heading} <span className="italic text-brand">{hero?.headingAccent}</span>
              </h1>
              <p className="max-w-xl text-body-lg text-ink">{hero?.subhead}</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <NewsletterForm
                placeholder={hero?.emailPlaceholder}
                subscribeLabel={hero?.subscribeLabel}
              />
              <p className="text-body-sm text-subtle">
                {hero?.privacyPrefix}{" "}
                <a
                  href={hero?.privacyLinkHref || "/privacy"}
                  className="underline underline-offset-2"
                >
                  {hero?.privacyLinkLabel}
                </a>
                .
              </p>
              <RecaptchaNotice className="max-w-md text-center" />
            </div>
          </div>
          <CloudBand priority variant="edge" />
        </section>

        <section className={`${layout.sectionX} pb-24`}>
          <div className={`${layout.inner} flex flex-col items-center gap-16`}>
            {posts.length > 0 ? (
              <div className="flex w-full max-w-[76rem] flex-col items-center gap-16">
                {page === 1 ? (
                  <BlogCard post={posts[0]!} variant="featured" />
                ) : null}

                {(page === 1 ? posts.slice(1) : posts).length > 0 ? (
                  <div className="grid w-full grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                    {(page === 1 ? posts.slice(1) : posts).map((post) => (
                      <BlogCard key={post.id} post={post} variant="grid" />
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="text-body text-subtle">
                {hero?.emptyLabel}
              </p>
            )}

            <div className="w-full max-w-[76rem]">
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
