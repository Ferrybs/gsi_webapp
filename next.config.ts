import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["i.pravatar.cc", "placehold.co"],
  },
  staticPageGenerationTimeout: 300,
  /* config options here */
};

export default nextConfig;
