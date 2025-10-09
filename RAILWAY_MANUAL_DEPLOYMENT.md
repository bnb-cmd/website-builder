# 🚀 Railway Deployment - Manual Steps

## ✅ You're logged in! Now let's deploy:

### Step 1: Link Service
```bash
npx @railway/cli service
```
**When prompted, select your backend service or create a new one**

### Step 2: Set Environment Variables
```bash
# Set Neon database URL
npx @railway/cli variables --set "DATABASE_URL=postgresql://neondb_owner:npg_Yr6Di1pEljQB@ep-super-king-a144iv94-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Set JWT secret
npx @railway/cli variables --set "JWT_SECRET=t3l/hPgGWPWJCcWnnUk32A/1Zl/ix4aqyKHc7C6Wy70="

# Set production environment
npx @railway/cli variables --set "NODE_ENV=production"

# Set port
npx @railway/cli variables --set "PORT=3001"

# Set client URL (will update after frontend deployment)
npx @railway/cli variables --set "CLIENT_URL=https://pakistan-builder.pages.dev"
```

### Step 3: Deploy
```bash
npx @railway/cli up
```

### Step 4: Get Your Backend URL
After deployment, Railway will give you a URL like:
`https://virtuous-perfection-production.up.railway.app`

### Step 5: Test Your Deployment
```bash
# Health check
curl https://your-railway-url.up.railway.app/

# Test authentication
curl -X POST "https://your-railway-url.up.railway.app/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pakistan-website-builder.com","password":"Admin123!@#"}'

# Test templates
curl https://your-railway-url.up.railway.app/v1/templates
```

## 🎯 What This Will Give You:

✅ **Live Backend:** Your API running on Railway
✅ **Neon Database:** Connected and working
✅ **Admin User:** Ready to use
✅ **Templates:** All available via API
✅ **Authentication:** JWT tokens working
✅ **Auto-Deploy:** Updates from GitHub

## 🚀 Next Steps After Backend Deployment:

1. **Deploy Frontend to Cloudflare Pages**
2. **Update frontend API URL to Railway**
3. **Test the complete application**
4. **Share your live website!**

---

**Run these commands one by one and let me know the results!** 🎯
