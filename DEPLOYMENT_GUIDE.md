# 🚀 Railway Deployment Guide

## Environment Variables Setup

### Step 1: Sign up for External Services

#### Neon PostgreSQL (Free Tier)
1. Go to: https://neon.tech
2. Sign up and create project: `pakistan-builder`
3. Copy connection string: `postgresql://user:pass@ep-xxx.neon.tech/neondb`
4. Free tier: 512MB database, perfect for testing

#### Upstash Redis (Free Tier)
1. Go to: https://upstash.com
2. Sign up and create database: `pakistan-builder-sessions`
3. Copy Redis URL: `rediss://user:pass@xxx.upstash.io:6379`
4. Free tier: 10K commands/day

### Step 2: Environment Variables for Railway

Set these in Railway dashboard or CLI:

```bash
# Database
DATABASE_URL="postgresql://[your-neon-url]"
REDIS_URL="rediss://[your-upstash-url]"

# JWT Secret (GENERATE A STRONG ONE!)
JWT_SECRET="[generate-32-char-random-string]"

# API URLs
CLIENT_URL="https://pakistan-builder.pages.dev"
NEXT_PUBLIC_API_URL="https://pakistan-builder-backend.up.railway.app/v1"

# Node Environment
NODE_ENV="production"
PORT="3001"

# Keep your existing service keys
CLOUDINARY_CLOUD_NAME="[your-existing-value]"
CLOUDINARY_API_KEY="[your-existing-value]"
CLOUDINARY_API_SECRET="[your-existing-value]"
OPENAI_API_KEY="[your-existing-value]"
ANTHROPIC_API_KEY="[your-existing-value]"
GOOGLE_AI_API_KEY="[your-existing-value]"

# Payment Gateways (when ready)
STRIPE_SECRET_KEY="[your-stripe-key]"
STRIPE_WEBHOOK_SECRET="[your-stripe-webhook-secret]"
JAZZCASH_MERCHANT_ID="[your-jazzcash-merchant-id]"
JAZZCASH_SECRET_KEY="[your-jazzcash-secret-key]"
EASYPAISA_MERCHANT_ID="[your-easypaisa-merchant-id]"
EASYPAISA_SECRET_KEY="[your-easypaisa-secret-key]"

# Email Service
SMTP_HOST="[your-smtp-host]"
SMTP_PORT="587"
SMTP_USER="[your-smtp-user]"
SMTP_PASS="[your-smtp-password]"
FROM_EMAIL="noreply@pakistan-builder.com"

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
SESSION_SECRET="[generate-random-session-secret]"
```

## Deployment Commands

### Backend to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli
railway login

# Deploy backend
cd backend
railway init
railway up
```

### Frontend to Cloudflare Pages
```bash
# Install Wrangler CLI
npm install -g wrangler
wrangler login

# Create frontend environment file
cd frontend
echo "NEXT_PUBLIC_API_URL=https://pakistan-builder-backend.up.railway.app/v1" > .env.production
echo "NEXT_PUBLIC_APP_URL=https://pakistan-builder.pages.dev" >> .env.production

# Deploy frontend
npm run build
wrangler pages deploy .next --project-name=pakistan-builder
```

### Configure Frontend Environment in Cloudflare Dashboard
1. Go to: https://dash.cloudflare.com
2. Navigate to: Pages → pakistan-builder → Settings → Environment variables
3. Add:
   - `NEXT_PUBLIC_API_URL` = `https://pakistan-builder-backend.up.railway.app/v1`
   - `NEXT_PUBLIC_APP_URL` = `https://pakistan-builder.pages.dev`

## Testing URLs

After deployment:
- Backend: `https://pakistan-builder-backend.up.railway.app/v1/health`
- Frontend: `https://pakistan-builder.pages.dev`
- User websites: `https://preview-{websiteId}.pakistan-builder.pages.dev`

## Cost Breakdown

- Railway: $5/month (hobby tier)
- Neon: $0/month (free tier)
- Upstash: $0/month (free tier)
- Cloudflare Pages: $0/month (free tier)
- **Total: $5/month**

## Next Steps

1. Set up external services (Neon + Upstash)
2. Run Prisma migrations
3. Deploy to Railway
4. Deploy to Cloudflare Pages
5. Test deployment
6. Security hardening
