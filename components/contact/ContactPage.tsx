import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/HeaderCms";
import { SectionRenderer } from "@/components/cms/SectionRenderer";
import type { PageSection } from "@/lib/cms/types";

/**
 * Contact Us page — Figma 24641:106432 (1440×2012).
 * Reuses Header + Footer; body comes from the CMS (`contact` slug).
 */
export default function ContactPage({ sections }: { sections: PageSection[] }) {
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
