# 🚀 Manual Railway Configuration Guide

## ✅ **Current Status**
- ✅ **Logged in to Railway**: `basilnbarrel@gmail.com`
- ✅ **Project linked**: `pakistan-builder-backend`
- ✅ **Environment**: `production`

---

## 📋 **Step-by-Step Manual Configuration**

### **Step 1: Open Railway Dashboard**
1. Go to: https://railway.app/dashboard
2. Click on your project: **`pakistan-builder-backend`**
3. Click on **`production`** environment

### **Step 2: Add Environment Variables**
1. Click **"Variables"** tab
2. Click **"New Variable"** button
3. Add each variable one by one using the table below

---

## 🔧 **Environment Variables to Add**

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `NODE_ENV` | `production` | Server environment |
| `PORT` | `3001` | Server port |
| `HOST` | `0.0.0.0` | Server host |
| `CLIENT_URL` | `https://your-frontend.pages.dev` | Frontend URL |
| `ENABLE_CORS` | `true` | Enable CORS |
| `ENABLE_SWAGGER` | `false` | Disable Swagger in production |
| `ENABLE_LOGGING` | `true` | Enable logging |
| `ENABLE_METRICS` | `true` | Enable metrics |

### **Database Configuration (Neon)**
| Variable Name | Value |
|---------------|-------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_Yr6Di1pEljQB@ep-super-king-a144iv94-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require&pgbouncer=true&connect_timeout=15` |
| `DATABASE_PROVIDER` | `postgresql` |
| `DB_POOL_MIN` | `2` |
| `DB_POOL_MAX` | `10` |

### **Redis Configuration (Upstash)**
| Variable Name | Value |
|---------------|-------|
| `UPSTASH_REDIS_REST_URL` | `https://discrete-mule-14801.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | `ATnRAAIncDI4ZmI3NTFhODJmNjQ0NTJlOTM3YzllMzFlODYwZGJiZXAyMTQ4MDE` |

### **Storage Configuration (Cloudflare R2)**
| Variable Name | Value |
|---------------|-------|
| `STORAGE_PROVIDER` | `r2` |
| `R2_ACCOUNT_ID` | `b9de1bff40b836bea2fff5043435ded1` |
| `R2_ACCESS_KEY_ID` | `2197f833a47d6dad69a8c0e2083bda43` |
| `R2_SECRET_ACCESS_KEY` | `0968c88b1171af35e614f60f71fa3b2fdaa488b96f14ea362dff70f12311ab21` |
| `R2_BUCKET` | `website-builder-assets` |
| `R2_PUBLIC_URL` | `https://b9de1bff40b836bea2fff5043435ded1.r2.cloudflarestorage.com` |

### **Authentication & Security**
| Variable Name | Value |
|---------------|-------|
| `JWT_SECRET` | `7TPEqIJrolEdhWtNtxjuUOGeof22i6xtRLGH1g5cka4=` |
| `JWT_EXPIRES_IN` | `7d` |
| `REFRESH_TOKEN_EXPIRES_IN` | `30d` |
| `BCRYPT_ROUNDS` | `12` |

### **AI Services (Placeholders - Add when ready)**
| Variable Name | Value |
|---------------|-------|
| `OPENAI_API_KEY` | `sk-placeholder-add-when-ready` |
| `OPENAI_MODEL` | `gpt-3.5-turbo` |
| `ANTHROPIC_API_KEY` | `sk-ant-placeholder-add-when-ready` |
| `ANTHROPIC_MODEL` | `claude-3-sonnet-20240229` |
| `GOOGLE_AI_API_KEY` | `placeholder-add-when-ready` |
| `GOOGLE_AI_MODEL` | `gemini-pro` |

### **Email Configuration (Placeholder)**
| Variable Name | Value |
|---------------|-------|
| `EMAIL_PROVIDER` | `resend` |
| `RESEND_API_KEY` | `re_placeholder-add-when-ready` |

### **Payment Gateways (Placeholders)**
| Variable Name | Value |
|---------------|-------|
| `STRIPE_SECRET_KEY` | `sk_live_placeholder-add-when-ready` |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_placeholder-add-when-ready` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_placeholder-add-when-ready` |

### **Pakistani Payment Gateways (Placeholders)**
| Variable Name | Value |
|---------------|-------|
| `JAZZCASH_MERCHANT_ID` | `placeholder-add-when-ready` |
| `JAZZCASH_PASSWORD` | `placeholder-add-when-ready` |
| `JAZZCASH_RETURN_URL` | `https://your-domain.com/payment/success` |
| `JAZZCASH_CANCEL_URL` | `https://your-domain.com/payment/cancel` |
| `EASYPAISA_MERCHANT_ID` | `placeholder-add-when-ready` |
| `EASYPAISA_PASSWORD` | `placeholder-add-when-ready` |
| `EASYPAISA_RETURN_URL` | `https://your-domain.com/payment/success` |
| `EASYPAISA_CANCEL_URL` | `https://your-domain.com/payment/cancel` |

### **Social Media Integrations (Placeholders)**
| Variable Name | Value |
|---------------|-------|
| `INSTAGRAM_APP_ID` | `placeholder-add-when-ready` |
| `INSTAGRAM_APP_SECRET` | `placeholder-add-when-ready` |
| `TIKTOK_APP_KEY` | `placeholder-add-when-ready` |
| `TIKTOK_APP_SECRET` | `placeholder-add-when-ready` |
| `FACEBOOK_APP_ID` | `placeholder-add-when-ready` |
| `FACEBOOK_APP_SECRET` | `placeholder-add-when-ready` |
| `PINTEREST_APP_ID` | `placeholder-add-when-ready` |
| `PINTEREST_APP_SECRET` | `placeholder-add-when-ready` |
| `WHATSAPP_ACCESS_TOKEN` | `placeholder-add-when-ready` |

### **Rate Limiting**
| Variable Name | Value |
|---------------|-------|
| `RATE_LIMIT_WINDOW_MS` | `60000` |
| `RATE_LIMIT_MAX_REQUESTS` | `1000` |
| `RATE_LIMIT_SKIP_SUCCESS` | `false` |
| `RATE_LIMIT_SKIP_FAILED` | `false` |

### **File Upload Limits**
| Variable Name | Value |
|---------------|-------|
| `MAX_FILE_SIZE` | `10485760` |
| `ALLOWED_FILE_TYPES` | `image/jpeg,image/png,image/gif,image/webp,image/svg+xml,application/pdf,text/plain` |

---

## ⚡ **Quick Copy-Paste Method**

### **Essential Variables (Copy these first):**
```
NODE_ENV=production
PORT=3001
HOST=0.0.0.0
CLIENT_URL=https://your-frontend.pages.dev
ENABLE_CORS=true
ENABLE_SWAGGER=false
ENABLE_LOGGING=true
ENABLE_METRICS=true
DATABASE_URL=postgresql://neondb_owner:npg_Yr6Di1pEljQB@ep-super-king-a144iv94-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require&pgbouncer=true&connect_timeout=15
DATABASE_PROVIDER=postgresql
DB_POOL_MIN=2
DB_POOL_MAX=10
UPSTASH_REDIS_REST_URL=https://discrete-mule-14801.upstash.io
UPSTASH_REDIS_REST_TOKEN=ATnRAAIncDI4ZmI3NTFhODJmNjQ0NTJlOTM3YzllMzFlODYwZGJiZXAyMTQ4MDE
STORAGE_PROVIDER=r2
R2_ACCOUNT_ID=b9de1bff40b836bea2fff5043435ded1
R2_ACCESS_KEY_ID=2197f833a47d6dad69a8c0e2083bda43
R2_SECRET_ACCESS_KEY=0968c88b1171af35e614f60f71fa3b2fdaa488b96f14ea362dff70f12311ab21
R2_BUCKET=website-builder-assets
R2_PUBLIC_URL=https://b9de1bff40b836bea2fff5043435ded1.r2.cloudflarestorage.com
JWT_SECRET=7TPEqIJrolEdhWtNtxjuUOGeof22i6xtRLGH1g5cka4=
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d
BCRYPT_ROUNDS=12
```

---

## 🧪 **Testing After Configuration**

### **Step 3: Test Your Backend**
Once you've added all variables, Railway will automatically redeploy. Test with:

```bash
# Test health endpoint
curl https://pakistan-builder-backend-production.up.railway.app/health

# Should return:
{
  "status": "OK",
  "services": {
    "database": true,
    "redis": true
  }
}
```

### **Step 4: Check Railway Logs**
1. Go to Railway dashboard
2. Click **"Deployments"** tab
3. Click on the latest deployment
4. Check **"Build Logs"** and **"Deploy Logs"**
5. Look for any errors

---

## ⏱️ **Estimated Time**
- **Adding variables**: 10-15 minutes
- **Automatic redeploy**: 5-10 minutes
- **Testing**: 5 minutes
- **Total**: ~20-30 minutes

---

## 🎯 **Next Steps After Configuration**

1. ✅ **Test backend health endpoint**
2. ✅ **Deploy frontend to Cloudflare Pages**
3. ✅ **Update frontend API URL**
4. ✅ **Test file uploads**
5. ✅ **Add OpenAI API key when ready**

---

## 🆘 **Troubleshooting**

### **If deployment fails:**
1. Check Railway logs for errors
2. Verify all required variables are set
3. Check database connection string
4. Verify Redis credentials

### **If health check fails:**
1. Check if all services are running
2. Verify environment variables are correct
3. Check Railway logs for startup errors

---

## 🎉 **Success Indicators**

You'll know it's working when:
- ✅ Railway shows "Deployed" status
- ✅ Health endpoint returns `{"status":"OK"}`
- ✅ No errors in Railway logs
- ✅ Database and Redis connections successful

**Ready to start adding variables?** Let me know when you're done and I'll help you test the deployment!
