import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TermsPage from "@/components/terms/TermsPage";
import { homeSans, homeSerif } from "@/components/ui/fonts";
import { getPageBySlug } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Draft Terms of Service for the aptAIvisor website and product.",
};

export default async function Page() {
  const page = await getPageBySlug("terms");

  if (!page) {
    notFound();
  }

  return (
    <div
      className={`${homeSans.variable} ${homeSerif.variable} ${homeSans.className}`}
    >
      <TermsPage sections={page.sections} />
    </div>
  );
}
