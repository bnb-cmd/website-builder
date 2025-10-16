/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages configuration
  trailingSlash: true,
  // Exclude cache files from build output
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-*',
      'node_modules/.cache',
      '.next/cache/**/*',
      '.next/server/chunks/**/*',
    ],
  },
  webpack: (config, { isServer }) => {
    // Ignore macOS metadata files
    config.module.rules.push({
      test: /\._/,
      use: 'ignore-loader',
    })
    
    // Optimize bundle size for Cloudflare Pages
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
            maxSize: 200000, // 200KB max chunk size
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: -5,
            reuseExistingChunk: true,
            maxSize: 200000, // 200KB max chunk size
          },
        },
      }
    }
    
    // Reduce bundle size
    config.optimization.usedExports = true
    config.optimization.sideEffects = false
    
    return config
  },
  images: {
    unoptimized: true,
    domains: ['assets.pakistanbuilder.com', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
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