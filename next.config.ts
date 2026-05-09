import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75, 90],
    remotePatterns: [
      { protocol: "https", hostname: "buitrago.shop", pathname: "/**" },
      { protocol: "https", hostname: "www.buitrago.shop", pathname: "/**" },
      ...(process.env.R2_PUBLIC_HOST
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
