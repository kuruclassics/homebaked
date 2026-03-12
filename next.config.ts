import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@libsql/client'],
  experimental: {
    middlewareClientMaxBodySize: '20mb',
  },
};

export default nextConfig;
