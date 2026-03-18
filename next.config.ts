import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'redcrosseth.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.redcrosseth.org',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
