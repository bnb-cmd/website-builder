# 🚀 Complete Deployment Guide

## ✅ Current Status

| Service | Status | Credentials |
|---------|--------|------------|
| **Neon Database** | ✅ **Ready** | Connected and migrated |
| **Railway Backend** | ✅ **Ready** | `https://website-builder-production-e38b.up.railway.app` |
| **Upstash Redis** | ✅ **Ready** | Connected and configured |
| **Cloudflare R2** | ✅ **Ready** | Bucket created and configured |
| **OpenAI API** | ⏸️ **Later** | Will add when ready to pay |
| **JWT Secret** | ✅ **Ready** | Generated and secure |

---

## 🎯 Deployment Steps

### Step 1: Configure Railway Backend (5 minutes)

**Option A: Use the automated script**
```bash
./configure-railway.sh
```

**Option B: Manual configuration**
1. Go to https://railway.app/dashboard
2. Click on your project: `website-builder-production`
3. Go to **Variables** tab
4. Add all variables from `railway.env.production` file

### Step 2: Deploy Frontend to Cloudflare Pages (10 minutes)

**Option A: Use the automated script**
```bash
./deploy-frontend.sh
```

**Option B: Manual deployment**
1. Go to https://dash.cloudflare.com
2. Click **Pages** → **Create a project**
3. Connect your GitHub repository
4. Configure build settings:
   - **Framework**: Next.js
   - **Root directory**: `/frontend`
   - **Build command**: `npm run build`
   - **Output directory**: `.next`
5. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL = https://website-builder-production-e38b.up.railway.app
   NEXT_PUBLIC_APP_URL = https://your-frontend.pages.dev
   ```

### Step 3: Test Everything (5 minutes)

1. **Test Backend Health**
   ```bash
   curl https://website-builder-production-e38b.up.railway.app/health
   ```

2. **Test Frontend**
   - Visit your Cloudflare Pages URL
   - Check if it loads correctly

3. **Test File Upload**
   - Try uploading an image
   - Check if it appears in R2 bucket

---

## 🔧 Environment Variables Summary

### Railway Backend Variables (Already configured in script)

```env
# Core Configuration
NODE_ENV=production
PORT=3001
HOST=0.0.0.0
CLIENT_URL=https://your-frontend.pages.dev

# Database (Neon)
DATABASE_URL=postgresql://neondb_owner:npg_Yr6Di1pEljQB@ep-super-king-a144iv94-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require&pgbouncer=true&connect_timeout=15

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://discrete-mule-14801.upstash.io
UPSTASH_REDIS_REST_TOKEN=ATnRAAIncDI4ZmI3NTFhODJmNjQ0NTJlOTM3YzllMzFlODYwZGJiZXAyMTQ4MDE

# Storage (Cloudflare R2)
STORAGE_PROVIDER=r2
R2_ACCOUNT_ID=b9de1bff40b836bea2fff5043435ded1
R2_ACCESS_KEY_ID=2197f833a47d6dad69a8c0e2083bda43
R2_SECRET_ACCESS_KEY=0968c88b1171af35e614f60f71fa3b2fdaa488b96f14ea362dff70f12311ab21
R2_BUCKET=website-builder-assets
R2_PUBLIC_URL=https://b9de1bff40b836bea2fff5043435ded1.r2.cloudflarestorage.com

# Security
JWT_SECRET=7TPEqIJrolEdhWtNtxjuUOGeof22i6xtRLGH1g5cka4=

# AI Services (Placeholders - Add when ready)
OPENAI_API_KEY=sk-placeholder-add-when-ready
```

### Cloudflare Pages Variables

```env
NEXT_PUBLIC_API_URL=https://website-builder-production-e38b.up.railway.app
NEXT_PUBLIC_APP_URL=https://your-frontend.pages.dev
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder-add-when-ready
```

---

## 🧪 Testing Checklist

- [ ] **Backend Health Check**
  - URL: `https://website-builder-production-e38b.up.railway.app/health`
  - Should return: `{"status":"OK","services":{"database":true,"redis":true}}`

- [ ] **Database Connection**
  - Check Railway logs for database connection success
  - Verify no connection errors

- [ ] **Redis Connection**
  - Check Railway logs for Redis connection success
  - Verify caching is working

- [ ] **R2 Storage**
  - Test file upload from frontend
  - Check if files appear in R2 bucket
  - Verify file URLs are accessible

- [ ] **Frontend Loading**
  - Visit Cloudflare Pages URL
  - Check if frontend loads without errors
  - Verify API calls to backend work

- [ ] **Authentication**
  - Test user registration/login
  - Verify JWT tokens are generated

---

## 💰 Cost Monitoring

### Current Monthly Costs (Estimated)

| Service | Cost | Usage |
|---------|------|-------|
| **Railway** | $5 | Hobby plan |
| **Neon** | $0 | Free tier (0.5GB) |
| **Upstash** | $0 | Free tier (10K requests) |
| **Cloudflare R2** | $0.50 | 10GB storage |
| **Cloudflare Pages** | $0 | Free tier |
| **Total** | **$5.50/month** | For 0-1000 users |

### When to Upgrade

- **Neon**: When database exceeds 0.5GB
- **Upstash**: When exceeding 10K requests/month
- **Railway**: When needing more resources
- **R2**: When exceeding 10GB storage

---

## 🔄 Adding OpenAI Later

When you're ready to add OpenAI:

1. **Get OpenAI API Key**
   - Go to https://platform.openai.com
   - Create API key
   - Set usage limit ($5-10/month)

2. **Update Railway**
   ```bash
   railway variables set OPENAI_API_KEY="sk-your-actual-key"
   ```

3. **Redeploy**
   ```bash
   railway up
   ```

4. **Test AI Features**
   - Try AI content generation
   - Test AI image generation

---

## 🆘 Troubleshooting

### Backend Issues

**Health check fails:**
```bash
# Check Railway logs
railway logs

# Common fixes:
# 1. Check environment variables
# 2. Verify database connection
# 3. Check Redis connection
```

**Database connection fails:**
```bash
# Test connection string
psql "postgresql://neondb_owner:npg_Yr6Di1pEljQB@ep-super-king-a144iv94-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

**Redis connection fails:**
```bash
# Test Redis connection
curl -X GET "https://discrete-mule-14801.upstash.io/ping" \
  -H "Authorization: Bearer ATnRAAIncDI4ZmI3NTFhODJmNjQ0NTJlOTM3YzllMzFlODYwZGJiZXAyMTQ4MDE"
```

### Frontend Issues

**Build fails:**
```bash
# Check build locally
cd frontend
npm run build

# Common fixes:
# 1. Check environment variables
# 2. Verify API URL is correct
# 3. Check for TypeScript errors
```

**API calls fail:**
```bash
# Test API directly
curl https://website-builder-production-e38b.up.railway.app/health

# Check CORS settings
# Verify API URL in environment variables
```

---

## 📞 Support

If you encounter issues:

1. **Check Railway logs**: `railway logs`
2. **Check Cloudflare Pages logs**: In Pages dashboard
3. **Test individual services**: Use the test commands above
4. **Verify environment variables**: Make sure all are set correctly

---

## 🎉 Success!

Once everything is working, you'll have:

- ✅ **Backend**: `https://website-builder-production-e38b.up.railway.app`
- ✅ **Frontend**: `https://your-frontend.pages.dev`
- ✅ **Database**: Neon PostgreSQL (connected)
- ✅ **Cache**: Upstash Redis (connected)
- ✅ **Storage**: Cloudflare R2 (configured)
- ✅ **Cost**: $5.50/month for 0-1000 users

**Your website builder is now live and ready for users!** 🚀
