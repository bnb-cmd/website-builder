#!/bin/bash

# 🚀 Deploy Website Builder with Neon Database
# This script deploys your website builder using your existing Neon database

echo "🚀 Deploying Website Builder with Neon Database..."
echo ""

# Your Neon database connection string
NEON_DATABASE_URL="postgresql://neondb_owner:npg_Yr6Di1pEljQB@ep-super-king-a144iv94-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Generate a strong JWT secret
JWT_SECRET=$(openssl rand -base64 32)

echo "📋 Environment Variables to Set:"
echo "DATABASE_URL=\"$NEON_DATABASE_URL\""
echo "JWT_SECRET=\"$JWT_SECRET\""
echo "NODE_ENV=\"production\""
echo "PORT=\"3001\""
echo ""

echo "🔧 Next Steps:"
echo "1. Login to Railway: npx @railway/cli login"
echo "2. Go to backend directory: cd backend"
echo "3. Initialize Railway: npx @railway/cli init"
echo "4. Set environment variables:"
echo "   npx @railway/cli variables set DATABASE_URL=\"$NEON_DATABASE_URL\""
echo "   npx @railway/cli variables set JWT_SECRET=\"$JWT_SECRET\""
echo "   npx @railway/cli variables set NODE_ENV=\"production\""
echo "   npx @railway/cli variables set PORT=\"3001\""
echo "5. Deploy: npx @railway/cli up"
echo ""

echo "🌐 After deployment, your backend will be available at:"
echo "https://pakistan-builder-backend.up.railway.app"
echo ""

echo "🧪 Test your deployment:"
echo "curl https://pakistan-builder-backend.up.railway.app/v1/health"
echo ""

echo "📊 Monitor your deployment:"
echo "npx @railway/cli logs"
echo "npx @railway/cli metrics"
echo ""

echo "✅ Ready to deploy! Run the commands above."
