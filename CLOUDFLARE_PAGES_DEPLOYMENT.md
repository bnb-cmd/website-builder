# 🚀 Cloudflare Pages Deployment Guide

## ✅ What's Ready:
- **GitHub Repository:** Connected ✅
- **Railway Backend:** Ready to deploy ✅
- **Frontend Code:** Ready (with minor TypeScript fixes) ✅

## 🌐 Cloudflare Pages Deployment Steps:

### Step 1: Login to Cloudflare Pages
1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Click "Sign in" and authenticate with GitHub
3. You'll see your GitHub repositories

### Step 2: Connect Your Repository
1. Click "Create a project"
2. Select "Connect to Git"
3. Choose your repository: `bnb-cmd/website-builder`
4. Click "Begin setup"

### Step 3: Configure Build Settings
**Framework preset:** Next.js
**Build command:** `cd frontend && npm run build`
**Build output directory:** `frontend/.next`
**Root directory:** `/` (leave empty)

### Step 4: Set Environment Variables
In Cloudflare Pages dashboard, go to Settings > Environment variables:

```bash
# Set your Railway backend URL (get this after Railway deployment)
NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app/v1

# Production environment
NODE_ENV=production
```

### Step 5: Deploy
1. Click "Save and Deploy"
2. Cloudflare will build and deploy your frontend
3. You'll get a URL like: `https://website-builder.pages.dev`

## 🔧 Alternative: Manual Deployment with Wrangler

If you prefer command line:

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build frontend
cd frontend
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy .next --project-name=website-builder
```

## 🎯 What This Gives You:

✅ **Live Frontend:** Your website builder UI
✅ **Automatic Deployments:** Updates from GitHub
✅ **Global CDN:** Fast loading worldwide
✅ **Free Hosting:** No cost for static sites
✅ **Custom Domain:** Easy to add later

## 🔗 After Deployment:

1. **Update Railway Environment:**
   ```bash
   npx @railway/cli variables --set "CLIENT_URL=https://your-cloudflare-url.pages.dev"
   ```

2. **Test Your Live App:**
   - Frontend: `https://your-cloudflare-url.pages.dev`
   - Backend: `https://your-railway-url.up.railway.app`
   - API Docs: `https://your-railway-url.up.railway.app/docs`

## 🚀 Next Steps:

1. **Deploy Backend to Railway** (current priority)
2. **Deploy Frontend to Cloudflare Pages**
3. **Connect them together**
4. **Test the complete application**

---

**Ready to start with Cloudflare Pages?** 🎯
