# 🚀 Railway + Cloudflare Deployment Guide

This guide will help you deploy your website builder to production using Railway (backend) + Cloudflare Pages (frontend).

## 📋 Prerequisites

- Node.js 18+ installed
- Git repository with your code
- Accounts for external services (see below)

## 🔧 External Services Setup

### 1. Neon PostgreSQL (Free Tier)
- **Sign up:** https://neon.tech
- **Create project:** `pakistan-builder`
- **Free tier:** 512MB database, perfect for testing
- **Copy connection string:** `postgresql://user:pass@ep-xxx.neon.tech/neondb`

### 2. Upstash Redis (Free Tier)
- **Sign up:** https://upstash.com
- **Create database:** `pakistan-builder-sessions`
- **Free tier:** 10K commands/day
- **Copy Redis URL:** `rediss://user:pass@xxx.upstash.io:6379`

## 🚀 Quick Deployment

### Option 1: Automated Deployment (Recommended)
```bash
# Run the complete deployment script
./deploy.sh
```

This script will:
1. ✅ Check prerequisites
2. ✅ Set up external services
3. ✅ Run database migrations
4. ✅ Deploy backend to Railway
5. ✅ Deploy frontend to Cloudflare Pages
6. ✅ Test deployment

### Option 2: Step-by-Step Deployment

#### Step 1: Set up External Services
```bash
./setup-external-services.sh
```

#### Step 2: Run Database Migrations
```bash
cd backend
./migrate.sh
```

#### Step 3: Deploy Backend to Railway
```bash
./deploy-railway.sh
```

#### Step 4: Deploy Frontend to Cloudflare Pages
```bash
./deploy-cloudflare.sh
```

## 📊 Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Cloudflare    │    │     Railway     │    │   External      │
│     Pages       │    │    Backend      │    │   Services      │
│                 │    │                 │    │                 │
│  Frontend App   │◄──►│  Fastify API    │◄──►│  Neon Postgres  │
│  User Websites  │    │  Authentication │    │  Upstash Redis  │
│  Static Assets  │    │  Business Logic │    │  Cloudinary     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🌐 URLs After Deployment

- **Frontend:** `https://pakistan-builder.pages.dev`
- **Backend API:** `https://pakistan-builder-backend.up.railway.app/v1`
- **Health Check:** `https://pakistan-builder-backend.up.railway.app/v1/health`
- **User Websites:** `https://preview-{websiteId}.pakistan-builder.pages.dev`

## 💰 Cost Breakdown

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| **Railway** | Hobby | $5 |
| **Neon** | Free | $0 |
| **Upstash** | Free | $0 |
| **Cloudflare Pages** | Free | $0 |
| **Total** | | **$5** |

## 🔒 Security Checklist

Before going live, ensure you've completed:

- [ ] **Remove dev auth bypass** (in `backend/src/middleware/auth.ts`)
- [ ] **Set strong JWT secret** (32+ characters)
- [ ] **Use httpOnly cookies** for tokens
- [ ] **Add input sanitization** (DOMPurify)
- [ ] **Validate webhook signatures**
- [ ] **Test authentication flow**

## 🧪 Testing Your Deployment

### Backend Health Check
```bash
curl https://pakistan-builder-backend.up.railway.app/v1/health
```

Expected response:
```json
{
  "status": "OK",
  "services": {
    "database": true,
    "redis": true
  }
}
```

### Frontend Test
```bash
curl https://pakistan-builder.pages.dev
```

### Full User Flow Test
1. Visit: https://pakistan-builder.pages.dev
2. Register new user
3. Create test website
4. Preview website
5. Publish website

## 📈 Monitoring & Maintenance

### Railway Monitoring
- **Logs:** `railway logs`
- **Metrics:** `railway metrics`
- **Dashboard:** https://railway.app/dashboard

### Cloudflare Monitoring
- **Analytics:** https://dash.cloudflare.com
- **Pages:** https://dash.cloudflare.com/pages

## 🔄 Migration Path

### Phase 1: Railway + Cloudflare (Current)
- **Cost:** $5/month
- **Users:** 1K-10K
- **Focus:** Product validation

### Phase 2: Full Cloudflare (Future)
- **When:** 5K+ users, $3K+ revenue
- **Cost:** $5-15/month
- **Effort:** 4-6 weeks rewrite

## 🆘 Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check logs
railway logs

# Common fixes:
# 1. Check environment variables
# 2. Verify DATABASE_URL format
# 3. Check JWT_SECRET is set
```

#### Frontend Build Fails
```bash
# Check build logs
npm run build

# Common fixes:
# 1. Check NEXT_PUBLIC_API_URL
# 2. Verify all dependencies installed
# 3. Check for TypeScript errors
```

#### Database Connection Issues
```bash
# Test connection
npx prisma db pull --print

# Common fixes:
# 1. Check DATABASE_URL format
# 2. Verify Neon project is active
# 3. Check network connectivity
```

## 📞 Support Resources

- **Railway:** https://docs.railway.app
- **Cloudflare Pages:** https://developers.cloudflare.com/pages
- **Neon:** https://neon.tech/docs
- **Upstash:** https://docs.upstash.com

## 🎯 Success Criteria

### Technical
- ✅ Backend deploys successfully
- ✅ Frontend deploys successfully
- ✅ Database migrations complete
- ✅ Health checks pass
- ✅ Authentication works
- ✅ Website creation works

### Business
- ✅ Free users can create websites
- ✅ Free users can preview websites
- ✅ Pro users can publish websites
- ✅ Cost stays under $10/month
- ✅ Response time < 200ms (globally)

---

## 🚀 Ready to Deploy?

Run the automated deployment script:
```bash
./deploy.sh
```

**Your website builder will be live in 2-4 hours!** 🎉
