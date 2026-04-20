import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  images: {
    // In development: allow any HTTPS source so you never hit this error again
    // In production: lock down to only your actual storage domain
    remotePatterns: isDev
      ? [{ protocol: "https", hostname: "**" }]
      : [
          // TODO: replace with your actual storage provider before deploying
          { protocol: "https", hostname: "*.supabase.co" },
          { protocol: "https", hostname: "*.amazonaws.com" },
          { protocol: "https", hostname: "*.cloudinary.com" },
          { protocol: "https", hostname: "images.unsplash.com" },
        ],
  },
};

export default nextConfig;