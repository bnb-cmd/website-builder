# 🚀 Railway Deployment Guide

## ✅ What's Ready:
- **Neon Database:** Set up and working ✅
- **Backend:** Running locally with Neon ✅
- **Frontend:** Running locally ✅
- **Environment Variables:** Ready ✅

## 🚀 Step-by-Step Railway Deployment:

### Step 1: Login to Railway
```bash
cd backend
npx @railway/cli login
# Follow the browser login process
```

### Step 2: Initialize Railway Project
```bash
npx @railway/cli init
# Choose: "Create new project"
# Name: pakistan-builder-backend
```

### Step 3: Set Environment Variables
```bash
# Set your Neon database URL
npx @railway/cli variables set DATABASE_URL="postgresql://neondb_owner:npg_Yr6Di1pEljQB@ep-super-king-a144iv94-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Set JWT secret
npx @railway/cli variables set JWT_SECRET="t3l/hPgGWPWJCcWnnUk32A/1Zl/ix4aqyKHc7C6Wy70="

# Set production environment
npx @railway/cli variables set NODE_ENV="production"
npx @railway/cli variables set PORT="3001"

# Set client URL (will be updated after frontend deployment)
npx @railway/cli variables set CLIENT_URL="https://pakistan-builder.pages.dev"
```

### Step 4: Deploy Backend
```bash
npx @railway/cli up
```

### Step 5: Get Your Backend URL
After deployment, Railway will give you a URL like:
`https://pakistan-builder-backend.up.railway.app`

### Step 6: Deploy Frontend to Cloudflare Pages
```bash
cd ../frontend

# Update environment with Railway URL
echo "NEXT_PUBLIC_API_URL=https://pakistan-builder-backend.up.railway.app/v1" > .env.production

# Build frontend
npm run build

# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to Cloudflare Pages
wrangler pages deploy .next --project-name=pakistan-builder
```

## 🧪 Test Your Deployment:

### Backend Health Check:
```bash
curl https://pakistan-builder-backend.up.railway.app/
```

### Authentication Test:
```bash
curl -X POST "https://pakistan-builder-backend.up.railway.app/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pakistan-website-builder.com","password":"Admin123!@#"}'
```

### Templates Test:
```bash
curl https://pakistan-builder-backend.up.railway.app/v1/templates
```

## 🌐 Your URLs After Deployment:
- **Backend:** `https://pakistan-builder-backend.up.railway.app`
- **Frontend:** `https://pakistan-builder.pages.dev`
- **API Docs:** `https://pakistan-builder-backend.up.railway.app/docs`

## 💰 Cost:
- **Railway:** $5/month
- **Neon:** FREE
- **Cloudflare Pages:** FREE
- **Total:** $5/month

## 🔧 Troubleshooting:

### If Backend Won't Start:
```bash
# Check logs
npx @railway/cli logs

# Common issues:
# 1. DATABASE_URL format wrong
# 2. JWT_SECRET not set
# 3. Missing environment variables
```

### If Frontend Build Fails:
```bash
# Check build locally
npm run build

# Common issues:
# 1. NEXT_PUBLIC_API_URL not set
# 2. TypeScript errors
# 3. Missing dependencies
```

## 🎯 What This Solves:
✅ **Authentication Issues:** Real PostgreSQL database with proper user management
✅ **Template Loading:** Production API with proper routing
✅ **Database Persistence:** No more local SQLite issues
✅ **Real User Testing:** Live environment for testing
✅ **Scalability:** Ready for real users

---

**Ready to deploy? Start with Step 1 above!** 🚀
