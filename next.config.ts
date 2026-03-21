import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    // Client-side Router Cache: content rarely changes, cache aggressively
    staleTimes: {
      dynamic: 300, // dynamic pages cached 5min (default 0)
      static: 600,  // static pages cached 10min
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  transpilePackages: ["three"],
};

export default nextConfig;
