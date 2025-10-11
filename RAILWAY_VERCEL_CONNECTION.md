# Railway + Vercel Integration Guide

## 🚀 **Your Current Setup**
- **Railway Backend**: `https://website-builder-production-e38b.up.railway.app`
- **Vercel Frontend**: Your deployed frontend (check Vercel dashboard for URL)

## 🔗 **Step 1: Configure Vercel Environment Variables**

### In Vercel Dashboard:
1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:

```
NEXT_PUBLIC_API_URL = https://website-builder-production-e38b.up.railway.app
NEXT_PUBLIC_APP_URL = https://your-vercel-domain.vercel.app
```

### For Local Development:
Create a `.env.local` file in your frontend directory:
```bash
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=https://website-builder-production-e38b.up.railway.app
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🔧 **Step 2: Update CORS Configuration**

Your Railway backend needs to allow requests from your Vercel domain. Update your Railway environment variables:

### In Railway Dashboard:
1. Go to your Railway project
2. Navigate to **Variables** tab
3. Add/Update:

```
CLIENT_URL = https://your-vercel-domain.vercel.app
ENABLE_CORS = true
```

## 🧪 **Step 3: Test the Connection**

### Test Railway Backend:
```bash
curl https://website-builder-production-e38b.up.railway.app/health
curl https://website-builder-production-e38b.up.railway.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-09T..."
}
```

### Test Frontend Connection:
1. Deploy your frontend to Vercel with the new environment variables
2. Check browser console for API calls
3. Verify CORS headers are working

## 🔄 **Step 4: Redeploy Both Services**

### Railway:
- Environment variables will be applied automatically
- No redeploy needed unless you change code

### Vercel:
- Environment variables require a new deployment
- Trigger a new deployment after adding environment variables

## 🛠️ **Step 5: Troubleshooting**

### Common Issues:

**1. CORS Errors**
- Ensure `CLIENT_URL` in Railway matches your Vercel domain
- Check `ENABLE_CORS=true` in Railway

**2. API Not Found (404)**
- Verify `NEXT_PUBLIC_API_URL` points to correct Railway domain
- Check Railway deployment is running

**3. Network Errors**
- Check Railway service is healthy
- Verify Railway domain is accessible

### Debug Commands:
```bash
# Check Railway health
curl -v https://website-builder-production-e38b.up.railway.app/health

# Check CORS headers
curl -H "Origin: https://your-vercel-domain.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://website-builder-production-e38b.up.railway.app/health
```

## 📋 **Step 6: Verify Full Stack**

### Test Endpoints:
1. **Health Check**: `GET /health` ✅
2. **API Health**: `GET /api/health` ✅
3. **Auth Endpoints**: `POST /v1/auth/login` (mock)
4. **Frontend**: Should load without API errors

### Next Steps:
Once connected, you can start re-enabling services:
1. **Phase 1**: UserService + AuthService (real authentication)
2. **Phase 2**: WebsiteService (core functionality)
3. **Phase 3**: TemplateService (website building)

## 🎯 **Current Status**
- ✅ Railway backend deployed and healthy
- ✅ Frontend API configuration ready
- 🔄 Environment variables need to be set in Vercel
- 🔄 CORS configuration needs Railway environment variables

Your full-stack application will be connected once you complete the environment variable setup!
