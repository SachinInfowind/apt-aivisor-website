import { getGlobal } from "@/lib/cms/queries";
import { HeaderView } from "./Header";

/**
 * Server wrapper: pulls navLinks from the Strapi Global singleton and
 * falls back to the hardcoded defaults in `aboutMenu.ts` if the CMS is
 * unreachable or the field hasn't been populated yet.
 */
export async function Header() {
  const global = await getGlobal();
  const navLinks = global?.navLinks?.length ? global.navLinks : undefined;

  return <HeaderView navLinks={navLinks} />;
}
