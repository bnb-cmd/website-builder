const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    runtime: 'edge',
  },
  images: {
    domains: ['assets.pakistanbuilder.com', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ]
  },
}

// Setup Cloudflare Pages development
if (process.env.NODE_ENV === 'development') {
  setupDevPlatform()
}

module.exports = nextConfig