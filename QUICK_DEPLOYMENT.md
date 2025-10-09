# 🚀 Quick Deployment Guide

## Why Deploy? 
- ✅ Fixes authentication issues (proper database)
- ✅ Fixes template loading (production environment)
- ✅ Enables real user testing
- ✅ Only $5/month total cost

## Step 1: Get Free Database (5 minutes)

### Neon PostgreSQL (FREE)
1. Go to: https://neon.tech
2. Sign up with GitHub
3. Create project: `pakistan-builder`
4. Copy the connection string (looks like: `postgresql://user:pass@ep-xxx.neon.tech/neondb`)

### Upstash Redis (FREE) 
1. Go to: https://upstash.com
2. Sign up with GitHub
3. Create database: `pakistan-builder-sessions`
4. Copy the Redis URL (looks like: `rediss://user:pass@xxx.upstash.io:6379`)

## Step 2: Deploy Backend (10 minutes)

```bash
# Login to Railway
npx @railway/cli login

# Go to backend directory
cd backend

# Initialize Railway project
npx @railway/cli init
# Choose: "Create new project"
# Name: pakistan-builder-backend

# Set environment variables
npx @railway/cli variables set DATABASE_URL="your-neon-url-here"
npx @railway/cli variables set REDIS_URL="your-upstash-url-here"
npx @railway/cli variables set JWT_SECRET="your-super-secret-jwt-key-32-chars-min"
npx @railway/cli variables set NODE_ENV="production"
npx @railway/cli variables set PORT="3001"

# Deploy!
npx @railway/cli up
```

## Step 3: Deploy Frontend (5 minutes)

```bash
# Go to frontend directory
cd frontend

# Create production environment file
echo "NEXT_PUBLIC_API_URL=https://pakistan-builder-backend.up.railway.app/v1" > .env.production

# Build and deploy to Cloudflare Pages
npm run build

# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to Cloudflare Pages
wrangler pages deploy .next --project-name=pakistan-builder
```

## Step 4: Test Your Deployment

1. **Backend Health Check:**
   ```bash
   curl https://pakistan-builder-backend.up.railway.app/v1/health
   ```

2. **Frontend:** Visit your Cloudflare Pages URL

3. **Test Authentication:**
   - Register a new user
   - Login
   - Create a website
   - Preview website

## Cost Breakdown
- Railway: $5/month
- Neon: FREE
- Upstash: FREE  
- Cloudflare Pages: FREE
- **Total: $5/month**

## Troubleshooting

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

## Your URLs After Deployment:
- **Frontend:** `https://pakistan-builder.pages.dev`
- **Backend:** `https://pakistan-builder-backend.up.railway.app/v1`
- **Health Check:** `https://pakistan-builder-backend.up.railway.app/v1/health`

## Next Steps After Deployment:
1. Test user registration/login
2. Test website creation
3. Test template loading
4. Set up custom domain (optional)
5. Configure payment gateways (when ready)

---

**Ready to deploy? Start with Step 1 above!** 🚀
