import { notFound } from "next/navigation";
import DesignPartnerPage from "@/components/design-partner/DesignPartnerPage";
import { homeSans, homeSerif } from "@/components/ui/fonts";
import { getPageBySlug } from "@/lib/cms/queries";

export default async function Page() {
  const page = await getPageBySlug("design-partner");

  if (!page) {
    notFound();
  }

  return (
    <div
      className={`${homeSans.variable} ${homeSerif.variable} ${homeSans.className}`}
    >
      <DesignPartnerPage sections={page.sections} />
    </div>
  );
}
