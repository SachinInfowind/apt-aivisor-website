import { notFound } from "next/navigation";
import PricingPage from "@/components/pricing/PricingPage";
import { homeSans, homeSerif } from "@/components/ui/fonts";
import { getPageBySlug } from "@/lib/cms/queries";

export default async function Page() {
  const page = await getPageBySlug("pricing");

  if (!page) {
    notFound();
  }

  return (
    <div
      className={`${homeSans.variable} ${homeSerif.variable} ${homeSans.className}`}
    >
      <PricingPage sections={page.sections} />
    </div>
  );
}
