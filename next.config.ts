/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack to avoid LightningCSS issues
  experimental: {
    turbo: false,
  },
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/**', // Allow any path under your bucket
      },
      // If you still have other external image sources (e.g., from Google login, other APIs), add them here too
      // {
      //   protocol: 'https',
      //   hostname: 'lh3.googleusercontent.com', // For Google profile pictures
      //   port: '',
      //   pathname: '**',
      // },
    ],
  },
};

module.exports = nextConfig;