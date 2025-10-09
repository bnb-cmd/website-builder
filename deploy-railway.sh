#!/bin/bash

# 🚂 Railway Deployment Script
# This script deploys the backend to Railway

echo "🚂 Deploying backend to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if user is logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please log in to Railway:"
    railway login
fi

# Navigate to backend directory
cd backend

# Check if Railway project exists
if [ ! -f "railway.json" ] && [ ! -d ".railway" ]; then
    echo "🚀 Initializing Railway project..."
    railway init
    echo "📝 Please choose 'Create new project' and name it 'pakistan-builder-backend'"
fi

# Check if environment variables are set
echo "🔍 Checking environment variables..."

# Check for required environment variables
required_vars=("DATABASE_URL" "REDIS_URL" "JWT_SECRET")

for var in "${required_vars[@]}"; do
    if ! railway variables | grep -q "$var"; then
        echo "⚠️  $var not set in Railway. Please set it:"
        echo "   railway variables set $var=\"your-value\""
        echo ""
    fi
done

echo "📦 Building and deploying..."
railway up

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🔗 Your backend is now live at:"
railway open
echo ""
echo "🧪 Test your deployment:"
echo "   curl \$(railway open)/v1/health"
echo ""
echo "📊 Monitor your deployment:"
echo "   railway logs"
echo "   railway metrics"
