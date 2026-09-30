import { getGlobal } from "@/lib/cms/queries";
import { HeaderView } from "./Header";

/**
 * Server wrapper: everything in the header — nav, About menu, logo and the
 * Demo / waitlist buttons — comes from the Strapi Global singleton.
 */
export async function Header() {
  const global = await getGlobal();

  return (
    <HeaderView
      navLinks={global?.navLinks?.length ? global.navLinks : undefined}
      aboutMegaMenu={global?.aboutMegaMenu ?? null}
      logo={global?.logoMark}
      demo={{ label: global?.headerDemoLabel, href: global?.headerDemoHref }}
      waitlist={{ label: global?.headerWaitlistLabel, href: global?.headerWaitlistHref }}
    />
  );
}
