import { notFound } from "next/navigation";
import ThankYouPage from "@/components/thank-you/ThankYouPage";
import { homeSans, homeSerif } from "@/components/ui/fonts";
import { getPageBySlug } from "@/lib/cms/queries";

export default async function Page() {
  const page = await getPageBySlug("thank-you");

  if (!page) {
    notFound();
  }

  return (
    <div
      className={`${homeSans.variable} ${homeSerif.variable} ${homeSans.className}`}
    >
      <ThankYouPage sections={page.sections} />
    </div>
  );
}
