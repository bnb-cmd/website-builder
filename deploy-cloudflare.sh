#!/bin/bash

# ☁️ Cloudflare Pages Deployment Script
# This script deploys the frontend to Cloudflare Pages

echo "☁️ Deploying frontend to Cloudflare Pages..."

# Check if Wrangler CLI is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Check if user is logged in
if ! wrangler whoami &> /dev/null; then
    echo "🔐 Please log in to Cloudflare:"
    wrangler login
fi

# Navigate to frontend directory
cd frontend

# Check if environment file exists
if [ ! -f ".env.production" ]; then
    echo "📝 Creating environment file..."
    echo "NEXT_PUBLIC_API_URL=https://pakistan-builder-backend.up.railway.app/v1" > .env.production
    echo "NEXT_PUBLIC_APP_URL=https://pakistan-builder.pages.dev" >> .env.production
fi

# Build the frontend
echo "🔨 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

# Deploy to Cloudflare Pages
echo "🚀 Deploying to Cloudflare Pages..."
wrangler pages deploy .next --project-name=pakistan-builder

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "🔗 Your frontend is now live at:"
    echo "   https://pakistan-builder.pages.dev"
    echo ""
    echo "⚙️  Configure environment variables in Cloudflare Dashboard:"
    echo "   1. Go to: https://dash.cloudflare.com"
    echo "   2. Navigate to: Pages → pakistan-builder → Settings → Environment variables"
    echo "   3. Add:"
    echo "      - NEXT_PUBLIC_API_URL = https://pakistan-builder-backend.up.railway.app/v1"
    echo "      - NEXT_PUBLIC_APP_URL = https://pakistan-builder.pages.dev"
    echo ""
    echo "🧪 Test your deployment:"
    echo "   curl https://pakistan-builder.pages.dev"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi
