/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: '/Volumes/T7/website builder/frontend',
  webpack: (config) => {
    // Ignore macOS metadata files
    config.module.rules.push({
      test: /\._/,
      use: 'ignore-loader',
    })
    
    // Ignore files starting with ._
    config.resolve.alias = {
      ...config.resolve.alias,
    }
    
    // Add ignore pattern for ._ files
    config.module.rules.push({
      test: /\._/,
      loader: 'ignore-loader'
    })
    
    return config
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

// Setup Cloudflare Pages development (only in development)
if (process.env.NODE_ENV === 'development') {
  try {
    const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev')
    setupDevPlatform()
  } catch (error) {
    // Ignore if wrangler is not available
    console.log('Cloudflare Pages dev platform not available')
  }
}

module.exports = nextConfig