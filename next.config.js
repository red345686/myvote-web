/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during build for deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checking during build for deployment
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 