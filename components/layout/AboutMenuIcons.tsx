/** Icons matching Figma About mega-menu (Untitled UI style outlines) */

type IconName = "flag" | "people" | "book" | "play";

export function AboutMenuIcon({
  name,
  className = "text-brand",
}: {
  name: IconName;
  className?: string;
}) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true as const,
    className,
  };

  switch (name) {
    case "flag":
      return (
        <svg {...common}>
          <path
            d="M4 21V4.5M4 4.5C4 4.5 5.5 3.5 8.5 3.5C11.5 3.5 12.5 5.5 15.5 5.5C18.5 5.5 20 4.5 20 4.5V13.5C20 13.5 18.5 14.5 15.5 14.5C12.5 14.5 11.5 12.5 8.5 12.5C5.5 12.5 4 13.5 4 13.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "people":
      return (
        <svg {...common}>
          <path
            d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="9"
            cy="7"
            r="3"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a3 3 0 0 1 0 5.74"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path
            d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "play":
      return (
        <svg {...common}>
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M10 8.5v7l6-3.5-6-3.5z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}
