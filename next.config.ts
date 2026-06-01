import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  images: {
    /** WebP primero: mejor respaldo en navegadores sin AVIF nativo. */
    formats: ["image/webp", "image/avif"],
    qualities: [70, 75, 90],
    remotePatterns: [
      { protocol: "https", hostname: "buitrago.shop", pathname: "/**" },
      { protocol: "https", hostname: "www.buitrago.shop", pathname: "/**" },
      /** Dominio público R2 del proyecto (sin depender solo de env en build). */
      {
        protocol: "https",
        hostname: "pub-73a172a8457c481781388bbff5c0dfc8.r2.dev",
        pathname: "/**",
      },
      ...(process.env.R2_PUBLIC_HOST &&
      process.env.R2_PUBLIC_HOST !== "pub-73a172a8457c481781388bbff5c0dfc8.r2.dev"
        ? [
            {
              protocol: "https" as const,
              hostname: process.env.R2_PUBLIC_HOST,
              pathname: "/**",
            },
          ]
        : []),
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
