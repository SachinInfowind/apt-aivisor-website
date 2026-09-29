import { getGlobal } from "@/lib/cms/queries";
import { DemoModal } from "./DemoModal";

/** Server wrapper: reads the modal copy from the Strapi Global singleton. */
export async function DemoModalRoot() {
  const global = await getGlobal();
  return <DemoModal copy={global?.demoModal ?? null} />;
}
