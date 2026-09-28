import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/HeaderCms";
import { SectionRenderer } from "@/components/cms/SectionRenderer";
import type { PageSection } from "@/lib/cms/types";

/**
 * Cookie Policy page — copy comes from Strapi (`cookies` slug).
 */
export default function CookiesPage({ sections }: { sections: PageSection[] }) {
  return (
    <div
      id="top"
      className="relative min-h-screen w-full overflow-x-clip bg-white font-body antialiased"
    >
      <Header />
      <main className="w-full">
        <SectionRenderer sections={sections} />
      </main>
      <Footer />
    </div>
  );
}
