#!/bin/bash

# 🚀 External Services Setup Script
# This script helps you set up Neon PostgreSQL and Upstash Redis

echo "🚀 Setting up external services for Railway deployment..."

# Check if user has accounts
echo ""
echo "📋 Prerequisites:"
echo "1. Neon account: https://neon.tech"
echo "2. Upstash account: https://upstash.com"
echo ""

read -p "Do you have both accounts? (y/n): " has_accounts

if [ "$has_accounts" != "y" ]; then
    echo ""
    echo "🔗 Please sign up for:"
    echo "1. Neon PostgreSQL: https://neon.tech"
    echo "2. Upstash Redis: https://upstash.com"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo ""
echo "📝 Please provide your service credentials:"
echo ""

# Get Neon credentials
read -p "Neon PostgreSQL URL (postgresql://user:pass@ep-xxx.neon.tech/neondb): " neon_url

if [ -z "$neon_url" ]; then
    echo "❌ Neon URL is required"
    exit 1
fi

# Get Upstash credentials
read -p "Upstash Redis URL (rediss://user:pass@xxx.upstash.io:6379): " upstash_url

if [ -z "$upstash_url" ]; then
    echo "❌ Upstash URL is required"
    exit 1
fi

# Generate JWT secret
jwt_secret=$(openssl rand -base64 32)

# Generate session secret
session_secret=$(openssl rand -base64 32)

echo ""
echo "✅ Credentials collected!"
echo ""

# Create environment file template
cat > backend/.env.production << EOF
# Production Environment Variables for Railway + Cloudflare Deployment

# Database (Neon PostgreSQL)
DATABASE_URL="$neon_url"

# Redis (Upstash)
REDIS_URL="$upstash_url"

# JWT Secret (Generated)
JWT_SECRET="$jwt_secret"

# API URLs
CLIENT_URL="https://pakistan-builder.pages.dev"
NEXT_PUBLIC_API_URL="https://pakistan-builder-backend.up.railway.app/v1"

# Node Environment
NODE_ENV="production"
PORT="3001"

# Security
SESSION_SECRET="$session_secret"

# Rate Limiting
RATE_LIMIT_MAX="100"
RATE_LIMIT_WINDOW="900000"

# File Upload
MAX_FILE_SIZE="10485760"
ALLOWED_FILE_TYPES="image/jpeg,image/png,image/gif,image/webp"

# CORS
ENABLE_CORS="true"

# Security
BCRYPT_ROUNDS="12"
EOF

# Create frontend environment file
cat > frontend/.env.production << EOF
# Frontend Environment Variables for Cloudflare Pages

NEXT_PUBLIC_API_URL="https://pakistan-builder-backend.up.railway.app/v1"
NEXT_PUBLIC_APP_URL="https://pakistan-builder.pages.dev"
EOF

echo "📁 Environment files created:"
echo "   - backend/.env.production"
echo "   - frontend/.env.production"
echo ""

echo "🔐 Generated secure secrets:"
echo "   - JWT_SECRET: $jwt_secret"
echo "   - SESSION_SECRET: $session_secret"
echo ""

echo "⚠️  IMPORTANT: Add your existing service keys to backend/.env.production:"
echo "   - CLOUDINARY_CLOUD_NAME"
echo "   - CLOUDINARY_API_KEY"
echo "   - CLOUDINARY_API_SECRET"
echo "   - OPENAI_API_KEY"
echo "   - ANTHROPIC_API_KEY"
echo "   - GOOGLE_AI_API_KEY"
echo ""

echo "🚀 Next steps:"
echo "1. Add your existing service keys to backend/.env.production"
echo "2. Run: cd backend && npx prisma migrate dev --name init_postgresql"
echo "3. Deploy to Railway: railway up"
echo "4. Deploy frontend to Cloudflare Pages"
echo ""

echo "✅ External services setup complete!"
