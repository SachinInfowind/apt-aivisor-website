/** Marketing site assets — paths under /public/assets */

export const homeAssets = {
  problem: {
    quote: "/assets/problem-quote-v2.png",
    renewal: "/assets/problem-renewal-v2.png",
    deal: "/assets/problem-deal-v2.png",
    tools: "/assets/problem-tools-v2.png",
  },
  modules: {
    chatbotUi: "/assets/modules-chatbot-preview-v3.png",
    /** Hover Components (24392:17464) — per-module stage previews */
    previews: {
      chatbot: "/assets/modules-hover-chatbot.png",
      pricing: "/assets/modules-hover-pricing.png",
      builder: "/assets/modules-hover-builder.png",
      pnl: "/assets/modules-hover-pnl.png",
    },
    icons: {
      chatbot: "/assets/mod-chat-v2.png",
      pricing: "/assets/mod-pricing-v2.png",
      builder: "/assets/mod-builder-v2.png",
      pnl: "/assets/mod-pnl-v2.png",
    },
  },
  how: {
    dropzone: "/assets/how-step-1-ingest.png",
    /** Per-step visual (Figma "Steps" 24418:21073) — index matches HowItWorksSection.steps. */
    stepImages: [
      "/assets/how-step-1-ingest.png",
      "/assets/how-step-2-analyze.png",
      "/assets/how-step-3-negotiate.png",
      "/assets/how-step-4-close.png",
      "/assets/how-step-5-main.png",
    ],
    /** Property 1=Step 5 layered stage — main + floating renewals card + chart badge. */
    step5: {
      main: "/assets/how-step-5-main.png",
      overlay: "/assets/how-step-5-overlay.png",
      badge: "/assets/how-step-5-badge.png",
    },
    integrations: [
      "/assets/int-salesforce.png",
      "/assets/int-gemini.png",
      "/assets/int-microsoft.svg",
      "/assets/int-docusign.svg",
      "/assets/int-openai.svg",
      "/assets/int-claude.svg",
    ],
  },
  founder: {
    photo: "/assets/founder-pratt.png",
    /** Intrinsic sizes match each SVG's own viewBox so next/image doesn't letterbox them when auto-scaled by height. */
    partners: [
      { src: "/assets/logo-aws.svg", width: 76, height: 46 },
      { src: "/assets/logo-ms.svg", width: 34, height: 34 },
      { src: "/assets/logo-dell.svg", width: 34, height: 34 },
    ],
  },
  brand: {
    mark: "/assets/logo-mark.png",
  },
  footer: {
    clouds: "/assets/footer-clouds.png",
    social: {
      linkedin: "/assets/footer-social-linkedin.svg",
      facebook: "/assets/footer-social-facebook.svg",
      x: "/assets/footer-social-x.svg",
      youtube: "/assets/footer-social-youtube.svg",
    },
  },
  who: {
    /** Figma quote mark (24336:222337) — fill #4F8DFF */
    quote: "/assets/who-quote.svg",
    /** Per-variant avatar stacks from "Who it is for Section" (24336:222328). */
    personas: {
      buyer: {
        avatars: [
          "/assets/who/avatar-a00e56d4f88f.png",
          "/assets/who/avatar-9fb5b5a24d93.png",
          "/assets/who/avatar-81af02189d0f.png",
          "/assets/who/avatar-12442a59e0fe.png",
          "/assets/who/avatar-2622f29ffa5d.png",
        ],
        more: 9,
      },
      seller: {
        avatars: [
          "/assets/who/avatar-09d58c0b1b0e.png",
          "/assets/who/avatar-81af02189d0f.png",
          "/assets/who/avatar-8d65f05c74b8.png",
          "/assets/who/avatar-1298cfcbbce3.png",
          "/assets/who/avatar-2622f29ffa5d.png",
        ],
        more: 32,
      },
      both: {
        avatars: [
          "/assets/who/avatar-95d08fc51e99.png",
          "/assets/who/avatar-64e98eb1795b.png",
          "/assets/who/avatar-1298cfcbbce3.png",
          "/assets/who/avatar-623fb18b38db.png",
          "/assets/who/avatar-83186f07b691.png",
        ],
        more: 15,
      },
    },
  },
} as const;
