import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionRenderer } from "@/components/cms/SectionRenderer";
import { homeSans, homeSerif } from "@/components/ui/fonts";
import { getAllPageSlugs, getPageBySlug } from "@/lib/cms/queries";

/**
 * Slugs with their own route under app/ (app/career, app/pricing, ...).
 * Explicit routes always win over this catch-all at request time, but we
 * still skip them here so this route doesn't redundantly prerender them.
 */
const EXPLICIT_ROUTE_SLUGS = new Set([
  "home",
  "career",
  "pricing",
  "contact",
  "thank-you",
  "trust",
  "team",
  "waitlist",
]);

/**
 * Generic renderer for any CMS `Page` that doesn't have its own explicit
 * route under app/. This is what lets a brand-new page, created only in
 * Strapi, go live with zero Next.js code.
 */
export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  return slugs
    .filter((slug) => !EXPLICIT_ROUTE_SLUGS.has(slug))
    .map((slug) => ({ slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div
      className={`${homeSans.variable} ${homeSerif.variable} ${homeSans.className}`}
    >
      <div
        id="top"
        className="relative min-h-screen w-full overflow-x-clip bg-white font-body antialiased"
      >
        <Header />
        <main className="flex w-full flex-col">
          <SectionRenderer sections={page.sections} />
        </main>
        <Footer />
      </div>
    </div>
  );
}
