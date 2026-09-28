import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/HeaderCms";
import { SectionRenderer } from "@/components/cms/SectionRenderer";
import type { PageSection } from "@/lib/cms/types";

/**
 * Thank you page — Figma 24794:14598 (1440×1616).
 * Reuses Header + Footer; body comes from the CMS (`thank-you` slug).
 */
export default function ThankYouPage({ sections }: { sections: PageSection[] }) {
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
