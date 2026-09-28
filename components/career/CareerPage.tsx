import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SectionRenderer } from "@/components/cms/SectionRenderer";
import type { PageSection } from "@/lib/cms/types";

/**
 * Career page — all sections (hero → founder → values → roles → open call)
 * come from Strapi; site chrome (header/footer) stays in the app shell.
 */
export default function CareerPage({ sections }: { sections: PageSection[] }) {
  return (
    <div
      id="top"
      className="relative min-h-screen w-full overflow-x-clip bg-white font-body antialiased"
    >
      <Header />
      <main className="flex w-full flex-col">
        <SectionRenderer sections={sections} />
      </main>
      <Footer />
    </div>
  );
}
