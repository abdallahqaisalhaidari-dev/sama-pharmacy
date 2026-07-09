import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project (silences the
  // "multiple lockfiles" warning caused by a stray package-lock.json
  // in the user home directory).
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // Allow product images from any https host — the pharmacy staff
    // paste image URLs from many different sources.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
