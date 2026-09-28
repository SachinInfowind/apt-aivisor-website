import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PrivacyPage from "@/components/privacy/PrivacyPage";
import { homeSans, homeSerif } from "@/components/ui/fonts";
import { getPageBySlug } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Your privacy is important to us. How aptAIvisor collects and respects your information.",
};

export default async function Page() {
  const page = await getPageBySlug("privacy");

  if (!page) {
    notFound();
  }

  return (
    <div
      className={`${homeSans.variable} ${homeSerif.variable} ${homeSans.className}`}
    >
      <PrivacyPage sections={page.sections} />
    </div>
  );
}
