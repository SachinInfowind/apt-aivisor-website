/** Exact About mega-menu + nav copy from Figma Home header (node 24629:6723 + About open state) */

export const aboutMegaMenu = {
  company: {
    title: "Company",
    items: [
      {
        label: "About us",
        href: "#about",
        description: "Learn about our story and our mission statement.",
        icon: "flag" as const,
      },
      {
        label: "Our team",
        href: "/team",
        description: "Meet the people building aptAIvisor.",
        icon: "people" as const,
      },
      {
        label: "Careers",
        href: "/career",
        description: "We're always looking for talented people. Join our team!",
        badge: "We're hiring!",
        icon: "people" as const,
      },
    ],
  },
  resources: {
    title: "Resources",
    items: [
      {
        label: "Blog",
        href: "#blog",
        description: "The latest industry news, updates and info.",
        icon: "book" as const,
      },
      {
        label: "Video tutorials",
        href: "#tutorials",
        description: "Get up and running on new features and techniques.",
        icon: "play" as const,
      },
    ],
  },
  featured: {
    title: "Resources",
    thumbLine1: "Part 1",
    thumbLine2: "How to get started",
    heading: "How to get started",
    body: "Jump right in — get an overview of the basics and get started on building.",
    watchHref: "#tutorials",
    watchLabel: "Watch video",
    allHref: "#tutorials",
    allLabel: "All video tutorials",
  },
} as const;

/** Closed-nav labels from Figma header instance text nodes */
export const navLinks = [
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "Design Partner", href: "#design-partner" },
  { label: "About", href: "#about", mega: true },
  { label: "Trust & Security", href: "/trust" },
] as const;
