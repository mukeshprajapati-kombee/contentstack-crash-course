import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "eu-images.contentstack.com",
      },
      {
        hostname: "images.contentstack.io",
      },
    ],
  },
};

export default nextConfig;
