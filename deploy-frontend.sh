#!/bin/bash

# =============================================================================
# CLOUDFLARE PAGES DEPLOYMENT SCRIPT
# =============================================================================
# This script deploys the frontend to Cloudflare Pages

set -e

echo "🌐 Deploying Frontend to Cloudflare Pages..."

# Navigate to frontend directory
cd "/Volumes/T7/website builder/frontend"

# Install dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Build the application
echo "🔨 Building Next.js application..."
npm run build

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Login to Cloudflare (will prompt for API token)
echo "🔐 Logging into Cloudflare..."
echo "Please login to Cloudflare with your API token"
wrangler login

# Deploy to Cloudflare Pages
echo "🚀 Deploying to Cloudflare Pages..."
wrangler pages deploy .next --project-name=website-builder-frontend

echo "✅ Frontend deployment complete!"
echo "🌐 Frontend URL: https://website-builder-frontend.pages.dev"

echo ""
echo "📋 Next Steps:"
echo "1. Update NEXT_PUBLIC_API_URL in Cloudflare Pages dashboard"
echo "2. Test frontend connectivity to backend"
echo "3. Test file uploads"
echo "4. Configure custom domain (optional)"
