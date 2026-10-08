import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // 90 for the case-study hero screenshot (small UI text), 75 elsewhere.
  images: { qualities: [75, 90] },
};

export default nextConfig;
