import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Add these options to ignore TypeScript and ESLint errors during build
  typescript: {
    // Ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.bankreposessedcars.com" }],
        destination: "https://bankreposessedcars.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
