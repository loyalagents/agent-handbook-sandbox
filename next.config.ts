import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  compress: false, // Disable compression for better streaming
  poweredByHeader: false,
};

export default nextConfig;
