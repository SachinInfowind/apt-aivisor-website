import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SectionRenderer } from "@/components/cms/SectionRenderer";
import type { PageSection } from "@/lib/cms/types";

/**
 * Trust & Security page — hero Figma 26281:26711.
 * Body comes from the CMS (`trust` slug).
 */
export default function TrustPage({ sections }: { sections: PageSection[] }) {
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
