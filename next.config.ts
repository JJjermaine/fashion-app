/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack to avoid LightningCSS issues
  experimental: {
    turbo: false,
  },
};

module.exports = nextConfig;