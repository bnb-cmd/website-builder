#!/bin/bash

# 🚀 Vercel Deployment Script
# This script deploys the frontend to Vercel

echo "🚀 Deploying frontend to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel:"
    vercel login
fi

# Navigate to frontend directory
cd frontend

# Check if project is already linked
if [ ! -f ".vercel/project.json" ]; then
    echo "🔗 Linking project to Vercel..."
    vercel link
fi

# Check if environment variables are set
echo "🔍 Checking environment variables..."

# Check for required environment variables
required_vars=("NEXT_PUBLIC_API_URL" "NEXT_PUBLIC_APP_URL")

for var in "${required_vars[@]}"; do
    if ! vercel env ls | grep -q "$var"; then
        echo "⚠️  $var not set in Vercel. Please set it:"
        echo "   vercel env add $var"
        echo ""
    fi
done

echo "📦 Building and deploying..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🔗 Your frontend is now live at:"
vercel ls | grep "pakistan-website-builder" | head -1
echo ""
echo "🧪 Test your deployment:"
echo "   Visit the URL above and test the application"
echo ""
echo "📊 Monitor your deployment:"
echo "   vercel logs"
echo "   vercel analytics"
