import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/HeaderCms";
import { NdaUploadForm } from "@/components/nda/NdaUploadForm";
import { homeSans, homeSerif } from "@/components/ui/fonts";
import { layout } from "@/components/ui/type";
import { ndaUploadTokenSchema } from "@/lib/validation/ndaRequestForm";

export const metadata: Metadata = {
  title: "Upload your signed NDA | aptAI Solutions",
  // Personal link from the NDA email — keep it out of search engines.
  robots: { index: false, follow: false },
};

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const STRAPI_NDA_API_TOKEN = process.env.STRAPI_NDA_API_TOKEN;

type LinkInfo =
  | { status: "sent" | "send_failed" | "signed_by_partner" | "countersigned"; companyName: string; signerName: string; alreadyUploaded: boolean }
  | { status: "expired" | "not_found" | "unavailable" };

async function getLinkInfo(token: string | undefined): Promise<LinkInfo> {
  const parsed = ndaUploadTokenSchema.safeParse(token);
  if (!parsed.success) return { status: "not_found" };
  if (!STRAPI_NDA_API_TOKEN) return { status: "unavailable" };
  try {
    const res = await fetch(`${STRAPI_URL}/api/nda-requests/upload-info?token=${parsed.data}`, {
      headers: { Authorization: `Bearer ${STRAPI_NDA_API_TOKEN}` },
      cache: "no-store",
    });
    if (!res.ok) return { status: "unavailable" };
    const body = (await res.json()) as { data?: LinkInfo };
    return body.data ?? { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
  }
}

/**
 * /nda/upload?token=… — the personal link in the NDA email, where the Design Partner uploads
 * their signed copy. The token is checked server-side; the CMS records the upload.
 */
export default async function Page({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const info = await getLinkInfo(token);

  let heading = "Upload your signed NDA";
  let body: string;
  let canUpload = false;
  switch (info.status) {
    case "not_found":
      heading = "This link isn't valid";
      body = "Please use the upload link from your NDA email, or reply to that email with your signed NDA attached.";
      break;
    case "expired":
      heading = "This link has expired";
      body = "No problem — just reply to your NDA email with the signed PDF attached and we'll take it from there.";
      break;
    case "unavailable":
      heading = "Upload is temporarily unavailable";
      body = "Please try again shortly, or reply to your NDA email with the signed PDF attached.";
      break;
    case "countersigned":
      heading = "Your NDA is fully signed";
      body = `The Mutual NDA between aptAI and ${info.companyName} has been signed by both parties. There's nothing more to upload.`;
      break;
    default:
      canUpload = true;
      body = info.alreadyUploaded
        ? `We already have a signed copy for ${info.companyName}. Upload again only if you need to replace it.`
        : `Hi ${info.signerName} — sign page 7 of the NDA for ${info.companyName} and upload the signed PDF here. aptAI will countersign and send you the fully executed agreement.`;
  }

  return (
    <div className={`${homeSans.variable} ${homeSerif.variable} ${homeSans.className}`}>
      <div className="relative min-h-screen w-full overflow-x-clip bg-white font-body antialiased">
        <Header />
        <main className="w-full">
          <section
            className={`relative flex w-full flex-col items-center bg-brand-soft ${layout.sectionX} pb-16 pt-[clamp(9.5rem,18vw,13rem)] sm:pb-20 md:pb-24`}
          >
            <div className="flex w-full max-w-[34rem] flex-col items-stretch gap-6 rounded-xl bg-white p-6 shadow-modal sm:p-8">
              <div className="flex flex-col gap-2">
                <h1 className={`${homeSerif.className} text-[2rem] leading-[1.15] tracking-[-0.01em] text-navy sm:text-[2.5rem]`}>
                  {heading}
                </h1>
                <p className="text-base leading-6 text-nav">{body}</p>
              </div>
              {canUpload && token ? <NdaUploadForm token={token} /> : null}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
