import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', 'three', 'recharts', 'gsap'],
  },
  // Enable gzip/brotli compression for static assets
  compress: true,
  // Skip trailing slash redirects
  skipTrailingSlashRedirect: true,
  // Production source maps disabled for smaller builds
  productionBrowserSourceMaps: false,
};

export default nextConfig;
