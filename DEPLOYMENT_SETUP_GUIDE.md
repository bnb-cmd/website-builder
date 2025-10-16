# Complete Deployment Setup Guide

This guide will walk you through setting up all external services needed for your website builder deployment.

## Prerequisites

- GitHub account ✅ (you have this)
- Railway account ✅ (you have this)  
- Neon account ✅ (you have this)
- Cloudflare account ❌ (need to create)
- Upstash account ❌ (need to create)
- OpenAI account ❌ (need to create)

---

## 1. Cloudflare Setup (NEW ACCOUNT NEEDED)

### 1.1 Create Cloudflare Account

1. Go to https://dash.cloudflare.com/sign-up
2. Sign up with email or GitHub OAuth
3. Verify your email address
4. Complete the onboarding process

### 1.2 Create R2 Bucket for File Storage

1. In Cloudflare dashboard, go to **R2 Object Storage**
2. Click **"Create bucket"**
3. Name: `website-builder-assets`
4. Location: Choose closest to your users
5. Click **"Create bucket"**

### 1.3 Generate R2 API Tokens

1. Go to **R2 Object Storage** → **Manage R2 API Tokens**
2. Click **"Create API Token"**
3. Token name: `website-builder-r2-token`
4. Permissions: **Object Read & Write**
5. Bucket: Select `website-builder-assets`
6. Click **"Create API Token"**
7. **Copy and save these values:**
   - Account ID
   - Access Key ID  
   - Secret Access Key

### 1.4 Set Up Custom Domain (Optional)

1. Go to **R2 Object Storage** → **Settings** → **Public access**
2. Add custom domain: `assets.your-domain.com`
3. Follow DNS setup instructions
4. This will be your `R2_PUBLIC_URL`

### 1.5 Set Up Cloudflare Pages (Frontend)

1. Go to **Pages** in Cloudflare dashboard
2. Click **"Create a project"**
3. Connect your GitHub repository
4. Select the `frontend` folder
5. Build settings:
   - Build command: `npm run build`
   - Build output directory: `.next`
   - Root directory: `frontend`
6. Click **"Save and Deploy"**

---

## 2. Upstash Redis Setup (NEW ACCOUNT NEEDED)

### 2.1 Create Upstash Account

1. Go to https://upstash.com
2. Click **"Sign Up"** (can use GitHub OAuth)
3. Complete account setup

### 2.2 Create Redis Database

1. In Upstash dashboard, click **"Create Database"**
2. Database name: `website-builder-cache`
3. Type: **Global** (free tier)
4. Region: Choose closest to your backend
5. Enable eviction: **Yes** (recommended)
6. Click **"Create"**

### 2.3 Get Connection Details

1. Click on your database
2. Go to **"Details"** tab
3. **Copy and save these values:**
   - UPSTASH_REDIS_REST_URL
   - UPSTASH_REDIS_REST_TOKEN

### 2.4 Test Connection (Optional)

```bash
curl -X GET "https://your-database.upstash.io/ping" \
  -H "Authorization: Bearer your-token"
```

Should return `"PONG"`

---

## 3. OpenAI Setup (NEW ACCOUNT NEEDED)

### 3.1 Create OpenAI Account

1. Go to https://platform.openai.com/signup
2. Sign up with email
3. Verify your email
4. **Add payment method** (required, but set limits)

### 3.2 Set Usage Limits

1. Go to **Settings** → **Usage limits**
2. Set monthly limit: **$5-10** (to start)
3. Set hard limit: **$20** (safety net)

### 3.3 Generate API Key

1. Go to **API Keys**
2. Click **"Create new secret key"**
3. Name: `website-builder-api-key`
4. Copy the key (starts with `sk-`)
5. **Save it securely** (you won't see it again)

### 3.4 Test API Key (Optional)

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer sk-your-api-key"
```

Should return a list of available models.

---

## 4. Railway Backend Setup (YOU HAVE THIS ✅)

### 4.1 Connect GitHub Repository

1. Go to Railway dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Select the `backend` folder

### 4.2 Configure Environment Variables

Copy all variables from `backend/railway.env.example` and add them to Railway:

1. Go to your Railway project
2. Click **"Variables"** tab
3. Add each variable from the example file
4. Replace placeholder values with actual values

**Required variables to set:**
- `DATABASE_URL` (from Neon)
- `UPSTASH_REDIS_REST_URL` (from Upstash)
- `UPSTASH_REDIS_REST_TOKEN` (from Upstash)
- `R2_ACCOUNT_ID` (from Cloudflare)
- `R2_ACCESS_KEY_ID` (from Cloudflare)
- `R2_SECRET_ACCESS_KEY` (from Cloudflare)
- `R2_BUCKET` (website-builder-assets)
- `R2_PUBLIC_URL` (your custom domain or default)
- `OPENAI_API_KEY` (from OpenAI)
- `JWT_SECRET` (generate a strong random string)

### 4.3 Deploy Backend

1. Railway will auto-deploy when you push to main branch
2. Monitor the deployment logs
3. Test the health endpoint: `https://your-app.railway.app/health`

---

## 5. Neon Database Setup (YOU HAVE THIS ✅)

### 5.1 Get Connection String

1. Go to Neon dashboard
2. Select your database
3. Go to **"Connection Details"**
4. Copy the connection string
5. Add `?pgbouncer=true&connect_timeout=15` to the end

### 5.2 Run Database Migrations

```bash
cd backend
npx prisma migrate deploy
```

### 5.3 Seed Initial Data (Optional)

```bash
npx prisma db seed
```

---

## 6. Frontend Deployment (Cloudflare Pages)

### 6.1 Update Environment Variables

In Cloudflare Pages dashboard:

1. Go to your Pages project
2. Click **"Settings"** → **"Environment Variables"**
3. Add:
   - `NEXT_PUBLIC_API_URL`: Your Railway backend URL
   - `NEXT_PUBLIC_APP_URL`: Your Cloudflare Pages URL
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

### 6.2 Deploy Frontend

1. Push changes to your GitHub repository
2. Cloudflare Pages will auto-deploy
3. Test your frontend URL

---

## 7. Testing Your Deployment

### 7.1 Backend Health Check

```bash
curl https://your-backend.railway.app/health
```

Should return:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "version": "1.0.0",
  "environment": "production",
  "services": {
    "database": true,
    "redis": true
  }
}
```

### 7.2 Frontend Test

1. Visit your Cloudflare Pages URL
2. Check browser console for errors
3. Test user registration/login
4. Test file uploads
5. Test AI features (if configured)

### 7.3 Database Test

```bash
cd backend
npx prisma studio
```

Should open Prisma Studio in your browser.

---

## 8. Cost Monitoring Setup

### 8.1 Railway Usage Alerts

1. Go to Railway dashboard
2. Click **"Usage"**
3. Set up billing alerts at $10, $20, $50

### 8.2 Upstash Usage Monitoring

1. Go to Upstash dashboard
2. Monitor daily command count
3. Set up alerts at 8,000 commands/day (80% of free tier)

### 8.3 Cloudflare Usage

1. Go to Cloudflare dashboard
2. Monitor R2 storage usage
3. Set up alerts at 80% of free tier

---

## 9. Troubleshooting

### Common Issues:

**Backend won't start:**
- Check Railway logs
- Verify all environment variables are set
- Check database connection string

**Frontend build fails:**
- Check Cloudflare Pages build logs
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check for TypeScript errors

**File uploads fail:**
- Verify R2 credentials
- Check bucket permissions
- Test R2 connection

**Redis connection fails:**
- Verify Upstash credentials
- Check network connectivity
- Test with curl command

**Database connection fails:**
- Verify Neon connection string
- Check if database is paused
- Run migrations

---

## 10. Next Steps

After successful deployment:

1. **Set up monitoring** (Sentry, etc.)
2. **Configure custom domains**
3. **Set up SSL certificates**
4. **Configure CDN settings**
5. **Set up backup procedures**
6. **Create user documentation**

---

## Support

If you encounter issues:

1. Check the logs in each service dashboard
2. Verify all environment variables are correct
3. Test each service individually
4. Check the troubleshooting section above

**Estimated setup time: 30-60 minutes**
**Total monthly cost: $5-8 for 0-1,000 users**
