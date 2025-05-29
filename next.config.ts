import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "community.fastly.steamstatic.com",
      },
    ],
  },
  staticPageGenerationTimeout: 300,
  allowedDevOrigins: ["dev.cs2bits.com"],
  /* config options here */
};

export default nextConfig;
