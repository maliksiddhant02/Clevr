import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The product is a 430px column (DESIGN.md 9). Next's default ladder runs
    // to 3840, so a mark rendered at 88px was being fetched at w=3840.
    deviceSizes: [430, 640, 860],
    imageSizes: [48, 96, 128, 256],
  },
};

export default nextConfig;
