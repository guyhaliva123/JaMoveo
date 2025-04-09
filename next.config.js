/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
