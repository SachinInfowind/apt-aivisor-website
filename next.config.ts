import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Strapi runs on localhost in dev; harmless here since it's the same
    // machine, but never enable this against an untrusted/production host.
    // Set ALLOW_LOCAL_IMAGES=true (at build time) only to preview a
    // production build against a local Strapi; leave unset when deploying.
    dangerouslyAllowLocalIP:
      process.env.NODE_ENV !== "production" ||
      process.env.ALLOW_LOCAL_IMAGES === "true",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "api.builder.io",
        pathname: "/**",
      },
      ...(process.env.STRAPI_MEDIA_HOSTNAME
        ? [
            {
              protocol: "https" as const,
              hostname: process.env.STRAPI_MEDIA_HOSTNAME,
              pathname: "/uploads/**",
            },
          ]
        : []),
    ],
  },
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
