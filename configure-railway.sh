#!/bin/bash

# =============================================================================
# RAILWAY DEPLOYMENT CONFIGURATION SCRIPT
# =============================================================================
# This script configures Railway with all environment variables for production

set -e

echo "🚀 Configuring Railway for Production Deployment..."

# Check if Railway CLI is available
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Using npx instead..."
    RAILWAY_CMD="npx @railway/cli"
else
    RAILWAY_CMD="railway"
fi

# Login to Railway (will prompt for token)
echo "🔐 Already logged in to Railway..."
# $RAILWAY_CMD login

# Set the project
echo "📁 Project already linked to pakistan-builder-backend..."
# $RAILWAY_CMD link

# Configure all environment variables
echo "⚙️  Configuring environment variables..."

# Server Configuration
$RAILWAY_CMD variables --set NODE_ENV=production
$RAILWAY_CMD variables --set PORT=3001
$RAILWAY_CMD variables --set HOST=0.0.0.0
$RAILWAY_CMD variables --set CLIENT_URL=https://your-frontend.pages.dev
$RAILWAY_CMD variables --set ENABLE_CORS=true
$RAILWAY_CMD variables --set ENABLE_SWAGGER=false
$RAILWAY_CMD variables --set ENABLE_LOGGING=true
$RAILWAY_CMD variables --set ENABLE_METRICS=true

# Database Configuration (Neon)
$RAILWAY_CMD variables --set DATABASE_URL="postgresql://neondb_owner:npg_Yr6Di1pEljQB@ep-super-king-a144iv94-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require&pgbouncer=true&connect_timeout=15"
$RAILWAY_CMD variables --set DATABASE_PROVIDER=postgresql
$RAILWAY_CMD variables --set DB_POOL_MIN=2
$RAILWAY_CMD variables --set DB_POOL_MAX=10

# Redis Configuration (Upstash)
$RAILWAY_CMD variables --set UPSTASH_REDIS_REST_URL="https://discrete-mule-14801.upstash.io"
$RAILWAY_CMD variables --set UPSTASH_REDIS_REST_TOKEN="ATnRAAIncDI4ZmI3NTFhODJmNjQ0NTJlOTM3YzllMzFlODYwZGJiZXAyMTQ4MDE"

# Storage Configuration (Cloudflare R2)
$RAILWAY_CMD variables --set STORAGE_PROVIDER=r2
$RAILWAY_CMD variables --set R2_ACCOUNT_ID="b9de1bff40b836bea2fff5043435ded1"
$RAILWAY_CMD variables --set R2_ACCESS_KEY_ID="2197f833a47d6dad69a8c0e2083bda43"
$RAILWAY_CMD variables --set R2_SECRET_ACCESS_KEY="0968c88b1171af35e614f60f71fa3b2fdaa488b96f14ea362dff70f12311ab21"
$RAILWAY_CMD variables --set R2_BUCKET="website-builder-assets"
$RAILWAY_CMD variables --set R2_PUBLIC_URL="https://b9de1bff40b836bea2fff5043435ded1.r2.cloudflarestorage.com"

# Authentication & Security
$RAILWAY_CMD variables --set JWT_SECRET="7TPEqIJrolEdhWtNtxjuUOGeof22i6xtRLGH1g5cka4="
$RAILWAY_CMD variables --set JWT_EXPIRES_IN=7d
$RAILWAY_CMD variables --set REFRESH_TOKEN_EXPIRES_IN=30d
$RAILWAY_CMD variables --set BCRYPT_ROUNDS=12

# AI Services Configuration (Placeholders - Add when ready)
$RAILWAY_CMD variables --set OPENAI_API_KEY="sk-placeholder-add-when-ready"
$RAILWAY_CMD variables --set OPENAI_MODEL=gpt-3.5-turbo
$RAILWAY_CMD variables --set ANTHROPIC_API_KEY="sk-ant-placeholder-add-when-ready"
$RAILWAY_CMD variables --set ANTHROPIC_MODEL=claude-3-sonnet-20240229
$RAILWAY_CMD variables --set GOOGLE_AI_API_KEY="placeholder-add-when-ready"
$RAILWAY_CMD variables --set GOOGLE_AI_MODEL=gemini-pro

# Email Configuration (Placeholder)
$RAILWAY_CMD variables --set EMAIL_PROVIDER=resend
$RAILWAY_CMD variables --set RESEND_API_KEY="re_placeholder-add-when-ready"

# Payment Gateways (Placeholders)
$RAILWAY_CMD variables --set STRIPE_SECRET_KEY="sk_live_placeholder-add-when-ready"
$RAILWAY_CMD variables --set STRIPE_PUBLISHABLE_KEY="pk_live_placeholder-add-when-ready"
$RAILWAY_CMD variables --set STRIPE_WEBHOOK_SECRET="whsec_placeholder-add-when-ready"

# Pakistani Payment Gateways (Placeholders)
$RAILWAY_CMD variables --set JAZZCASH_MERCHANT_ID="placeholder-add-when-ready"
$RAILWAY_CMD variables --set JAZZCASH_PASSWORD="placeholder-add-when-ready"
$RAILWAY_CMD variables --set JAZZCASH_RETURN_URL="https://your-domain.com/payment/success"
$RAILWAY_CMD variables --set JAZZCASH_CANCEL_URL="https://your-domain.com/payment/cancel"

$RAILWAY_CMD variables --set EASYPAISA_MERCHANT_ID="placeholder-add-when-ready"
$RAILWAY_CMD variables --set EASYPAISA_PASSWORD="placeholder-add-when-ready"
$RAILWAY_CMD variables --set EASYPAISA_RETURN_URL="https://your-domain.com/payment/success"
$RAILWAY_CMD variables --set EASYPAISA_CANCEL_URL="https://your-domain.com/payment/cancel"

# Social Media Integrations (Placeholders)
$RAILWAY_CMD variables --set INSTAGRAM_APP_ID="placeholder-add-when-ready"
$RAILWAY_CMD variables --set INSTAGRAM_APP_SECRET="placeholder-add-when-ready"
$RAILWAY_CMD variables --set TIKTOK_APP_KEY="placeholder-add-when-ready"
$RAILWAY_CMD variables --set TIKTOK_APP_SECRET="placeholder-add-when-ready"
$RAILWAY_CMD variables --set FACEBOOK_APP_ID="placeholder-add-when-ready"
$RAILWAY_CMD variables --set FACEBOOK_APP_SECRET="placeholder-add-when-ready"
$RAILWAY_CMD variables --set PINTEREST_APP_ID="placeholder-add-when-ready"
$RAILWAY_CMD variables --set PINTEREST_APP_SECRET="placeholder-add-when-ready"
$RAILWAY_CMD variables --set WHATSAPP_ACCESS_TOKEN="placeholder-add-when-ready"

# Rate Limiting
$RAILWAY_CMD variables --set RATE_LIMIT_WINDOW_MS=60000
$RAILWAY_CMD variables --set RATE_LIMIT_MAX_REQUESTS=1000
$RAILWAY_CMD variables --set RATE_LIMIT_SKIP_SUCCESS=false
$RAILWAY_CMD variables --set RATE_LIMIT_SKIP_FAILED=false

# File Upload Limits
$RAILWAY_CMD variables --set MAX_FILE_SIZE=10485760
$RAILWAY_CMD variables --set ALLOWED_FILE_TYPES="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,application/pdf,text/plain"

echo "✅ All environment variables configured!"

# Deploy the application
echo "🚀 Deploying to Railway..."
$RAILWAY_CMD up

echo "🎉 Deployment complete!"
echo "📊 Backend URL: https://website-builder-production-e38b.up.railway.app"
echo "🔍 Health Check: https://website-builder-production-e38b.up.railway.app/health"

echo ""
echo "📋 Next Steps:"
echo "1. Test the health endpoint"
echo "2. Deploy frontend to Cloudflare Pages"
echo "3. Update frontend API URL"
echo "4. Test file uploads"
echo "5. Add OpenAI API key when ready"