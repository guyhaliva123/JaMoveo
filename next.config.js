/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "jamoveo-production-88c4.up.railway.app"],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    serverActions: {},
  },
};

module.exports = nextConfig;
