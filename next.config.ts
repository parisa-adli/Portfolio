import type { NextConfig } from "next";

const config: NextConfig = {
  devIndicators: false,
  images: { formats: ["image/avif", "image/webp"] },
  // Prototype A is the only one built so far; "/" points at it.
  async redirects() {
    return [{ source: "/", destination: "/a", permanent: false }];
  },
};

export default config;
