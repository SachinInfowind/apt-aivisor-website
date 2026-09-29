import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

/**
 * APT AI Visor design tokens (from Figma).
 * Source of truth for the theme is also mirrored in `app/globals.css` via `@theme`
 * (Tailwind v4 CSS-first). Keep both in sync when changing brand values.
 */
const config = {
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#F9FAFB",
          muted: "#F2F4F7",
        },
        brand: {
          DEFAULT: "#0042BB",
          hover: "#0036A0",
          soft: "#E8F0FF",
          logo: "#E8F1FF",
          mark: "#2F6BFF",
          glow: "#BFD4FF",
          "glow-deep": "#8EB6FF",
          tint: "#F3F7FF",
          mist: "#EFF4FF",
          wash: "#F8FAFF",
          accent: "#4F8DFF",
          strong: "#1C6BFF",
          veil: "#B5CFFF",
          active: "#0B55DD",
          deep: "#003699",
          mid: "#4B7FFF",
          sky: "#7AA6FF",
          pale: "#B7D0FF",
          ice: "#D7E8FF",
          cloud: "#EAF2FF",
          "cloud-deep": "#9EC2FF",
          edge: "#B2CCFF",
          dash: "#84ADFF",
          tab: "#F2F4F7",
          panel: "#EEF2FF",
          mesh: "#C9DCFF",
          "mist-soft": "#F7FBFF",
          "who-start": "#A8C7FF",
          how: "#DCEAFF",
          "avatar-2": "#D6E4FF",
          "avatar-3": "#AED0FF",
          "avatar-4": "#7AADFF",
          light: "#82AEFF",
          vivid: "#1F6DFF",
          fade: "#AFCBFF",
        },
        paper: { DEFAULT: "#FEFEFD", cool: "#FCFDFD" },
        "ink-black": "#0C111D",
        info: {
          DEFAULT: "#2E90FA",
          fg: "#175CD3",
          bg: "#EFF8FF",
          edge: "#B2DDFF",
        },
        navy: "#182230",
        heading: "#101828",
        ink: "#344054",
        nav: "#475467",
        muted: "#5B6B86",
        subtle: "#667085",
        faint: "#98A2B3",
        line: {
          DEFAULT: "#E4E7EC",
          soft: "#D7E0F0",
          strong: "#D0D5DD",
          muted: "#EAECF0",
          faint: "#F1F5F9",
          frost: "rgba(226, 232, 240, 0.9)",
        },
        metric: "#17B26A",
        "ink-deep": "#1A1A2E",
        success: {
          DEFAULT: "#12B76A",
          fg: "#027A48",
          bg: "#DCFAE6",
          soft: "#E7F8EF",
          strong: "#079455",
        },
        chip: {
          success: { fg: "#067647", bg: "#ECFDF3", edge: "#ABEFC6" },
          orange: {
            fg: "#B93815",
            bg: "#FEF6EE",
            edge: "#F9DBAF",
            strong: "#E04F16",
            dot: "#EF6820",
          },
          pink: {
            fg: "#C11574",
            bg: "#FDF2FA",
            edge: "#FCCEEE",
            dot: "#EE46BC",
          },
          purple: { fg: "#5925DC", edge: "#6938EF", dot: "#7A5AF8" },
          yellow: {
            fg: "#B54708",
            bg: "#FFFAEB",
            edge: "#FEDF89",
            dot: "#F79009",
          },
        },
        danger: {
          DEFAULT: "#F04438",
          solid: "#D92D20",
          fg: "#B42318",
          bg: "#FEE4E2",
        },
        violet: "#6941C6",
      },
      maxWidth: {
        page: "1920px",
        content: "1680px",
        prose: "720px",
        hero: "866px",
        quote: "980px",
        heading: "820px",
        "heading-lg": "900px",
        form: "520px",
        narrow: "620px",
        who: "760px",
        container: "80rem",
        copy: "31.5rem",
        modal: "min(49.8125rem, calc(100vw - 3rem))",
        intro: "42.75rem",
      },
      width: {
        rail: "19rem",
        "rail-lg": "21rem",
        "rail-xl": "21.875rem",
        panel: "336px",
        feature: "18.75rem",
        "quote-card": "40.6875rem",
        "title-col": "28.5rem",
        modal: "min(49.8125rem, calc(100vw - 3rem))",
        glow: "min(36vw, 33rem)",
      },
      minWidth: { menu: "8rem" },
      minHeight: { hero: "min(100svh, 56rem)", "hero-about": "min(100svh, 47.375rem)", tile: "8.8125rem", cell: "6.5rem", block: "18rem" },
      borderWidth: { 1.5: "1.5px" },
      letterSpacing: { heading: "-0.02em" },
      lineHeight: {
        title: "2.375rem",
        "title-sm": "1.875rem",
        heading: "1.2",
        cap: "1.125rem",
      },
      spacing: {
        "section-x": "80px",
        "section-y": "100px",
        "section-pad": "70px",
        "5xl": "40px",
        "nav-top": "40px",
        "hero-top": "180px",
        "hero-min": "896px",
        "hero-gap": "42px",
        "nav-h": "72px",
        btn: "44px",
        "btn-md": "48px",
        "btn-lg": "52px",
        "btn-xl": "56px",
        "2.5": "10px",
        "3.5": "14px",
        "4.5": "18px",
        "5.5": "22px",
        "7.5": "30px",
        13: "52px",
        15: "60px",
        18: "72px",
        22: "88px",
      },
      borderRadius: {
        pill: "9999px",
        "4xl": "40px",
        "5xl": "32px",
        card: "20px",
        chip: "18px",
        field: "10px",
        tile: "14px",
      },
      fontSize: {
        // Scales with both viewport width AND height (svh term) — a width-only
        // clamp still renders near its max size on short-but-wide viewports
        // (common laptop windows), making the headline look oversized once the
        // hero's own padding is height-aware. Mixing vw + svh keeps it in
        // proportion with however much screen is actually available.
        display: [
          "clamp(2.5rem, 4vw + 4svh, 6.25rem)",
          { lineHeight: "0.95", letterSpacing: "-0.03em" },
        ],
        "display-italic": [
          "clamp(2.5rem, 4vw + 4svh, 6.25rem)",
          { lineHeight: "0.9", letterSpacing: "-0.03em" },
        ],
        h1: [
          "clamp(2.25rem, 1.6rem + 2.6vw, 3.5rem)",
          { lineHeight: "1.14", letterSpacing: "-0.02em" },
        ],
        h2: [
          "clamp(1.75rem, 1.35rem + 1.8vw, 3rem)",
          { lineHeight: "1.18", letterSpacing: "-0.02em" },
        ],
        "h2-lg": [
          "clamp(1.875rem, 1.4rem + 2vw, 3.25rem)",
          { lineHeight: "1.16", letterSpacing: "-0.02em" },
        ],
        h3: [
          "clamp(1.25rem, 1.1rem + 0.6vw, 1.75rem)",
          { lineHeight: "1.28", letterSpacing: "-0.01em" },
        ],
        "h3-lg": [
          "clamp(1.375rem, 1.2rem + 0.75vw, 2rem)",
          { lineHeight: "1.3", letterSpacing: "-0.02em" },
        ],
        h4: [
          "clamp(1.125rem, 1.02rem + 0.4vw, 1.5rem)",
          { lineHeight: "1.35" },
        ],
        h5: [
          "clamp(1.0625rem, 0.98rem + 0.35vw, 1.375rem)",
          { lineHeight: "1.3" },
        ],
        "quote-xl": [
          "clamp(2.5rem, 1.9rem + 2.5vw, 4rem)",
          { lineHeight: "1.05" },
        ],
        "quote-md": [
          "clamp(1.5rem, 2.5vw, 2.25rem)",
          { lineHeight: "1.2222", letterSpacing: "-0.02em" },
        ],
        quote: [
          "clamp(1.25rem, 1.1rem + 0.6vw, 1.75rem)",
          { lineHeight: "1.35" },
        ],
        title: "1.875rem",
        "body-lg": ["20px", { lineHeight: "30px" }],
        "body-md": ["18px", { lineHeight: "28px" }],
        body: ["16px", { lineHeight: "24px" }],
        "body-sm": ["14px", { lineHeight: "20px" }],
        "body-xs": ["13px", { lineHeight: "18px" }],
        "body-15": ["15px", { lineHeight: "22px" }],
        caption: ["12px", { lineHeight: "16px" }],
        micro: ["11px", { lineHeight: "14px" }],
        nano: ["10px", { lineHeight: "12px" }],
        "stat-xl": [
          "clamp(2.75rem, 2rem + 3vw, 4.5rem)",
          { lineHeight: "1", letterSpacing: "-0.04em" },
        ],
        "stat-lg": [
          "clamp(2.25rem, 1.75rem + 2vw, 3.5rem)",
          { lineHeight: "1", letterSpacing: "-0.02em" },
        ],
        "stat-md": [
          "clamp(2rem, 1.6rem + 1.6vw, 3rem)",
          { lineHeight: "1" },
        ],
        "stat-sm": [
          "clamp(1.75rem, 1.5rem + 1vw, 2.5rem)",
          { lineHeight: "1.2", letterSpacing: "-0.02em" },
        ],
      },
      fontFamily: {
        display: ["var(--font-home-serif)", "Georgia", "serif"],
        body: ["var(--font-home-sans)", "Inter", "sans-serif"],
      },
      boxShadow: {
        nav: "0 10px 40px rgba(15, 40, 90, 0.10)",
        card: "0 12px 28px rgba(15, 40, 90, 0.08)",
        "card-lg": "0 18px 40px rgba(15, 40, 90, 0.12)",
        cta: "0 14px 34px rgba(0, 66, 187, 0.32)",
        "cta-hover": "0 18px 40px rgba(0, 66, 187, 0.38)",
        badge: "0 4px 16px rgba(47, 91, 255, 0.08)",
        soft: "0 8px 20px rgba(15, 40, 90, 0.06)",
        "focus-ring": "0 0 0 4px rgba(255, 255, 255, 0.35)",
        field: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
        "field-focus":
          "0 1px 2px 0 rgba(16, 24, 40, 0.05), 0 0 0 4px rgba(181, 207, 255, 0.24)",
        "ring-accent": "0 0 0 4px rgba(79, 141, 255, 0.24)",
        modal:
          "0 20px 24px -4px rgba(16, 24, 40, 0.08), 0 8px 8px -4px rgba(16, 24, 40, 0.03)",
        "modal-sm":
          "0 7px 9px -2px rgba(16, 24, 40, 0.08), 0 2px 3px -1px rgba(16, 24, 40, 0.03)",
        panel: "0 20px 40px rgba(52, 64, 84, 0.12)",
        "panel-far": "100px 100px 150px 0 rgba(52, 64, 84, 0.12)",
      },
      dropShadow: { hero: "0 24px 48px rgba(16, 24, 40, 0.18)" },
      height: {
        glow: "min(36vw, 33rem)",
        scroll: "350vh",
        media: "21.875rem",
        feature: "31.5625rem",
        "feature-media": "18.0625rem",
        nav: "72px",
        btn: "44px",
        "btn-lg": "52px",
        "btn-md": "48px",
      },
    },
  },
  plugins: [
    plugin(({ addUtilities, theme }) => {
      addUtilities({
        ".text-stroke-brand": {
          "-webkit-text-stroke": `1px ${theme("colors.brand.DEFAULT")}`,
        },
        ".text-stroke-navy": {
          "-webkit-text-stroke": `1px ${theme("colors.navy")}`,
        },
      });
    }),
  ],
} satisfies Config;

export default config;
