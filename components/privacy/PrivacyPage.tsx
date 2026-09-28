import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/HeaderCms";
import { SectionRenderer } from "@/components/cms/SectionRenderer";
import type { PageSection } from "@/lib/cms/types";

/**
 * Privacy policy page — copy comes from Strapi (`privacy` slug).
 */
export default function PrivacyPage({ sections }: { sections: PageSection[] }) {
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
