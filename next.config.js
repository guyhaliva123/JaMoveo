/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    serverActions: {},
  },
};

module.exports = nextConfig;
