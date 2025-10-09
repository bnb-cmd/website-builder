# Railway Backend Deployment Guide

## 🚂 Deploy Your Backend to Railway

### Prerequisites
- Railway account (free tier available)
- GitHub repository with your backend code
- Neon database URL ready

### Step 1: Connect to Railway

1. **Go to Railway**: https://railway.app
2. **Sign in** with your GitHub account
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository** (the one containing the backend folder)

### Step 2: Configure the Project

1. **Set Root Directory**: 
   - In Railway dashboard, go to Settings
   - Set Root Directory to `backend`

2. **Environment Variables**:
   Add these in Railway dashboard → Variables:
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=postgresql://neondb_owner:npg_Yr6Di1pEljQB@ep-super-king-a144iv94-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   CLOUDINARY_CLOUD_NAME=dts7ydswz
   CLOUDINARY_API_KEY=nY1Zs4JXzhqTf8QA-H2VlFrOdYg
   CLOUDINARY_API_SECRET=637454922447242
   CLOUDINARY_URL=cloudinary://nY1Zs4JXzhqTf8QA-H2VlFrOdYg:637454922447242@dts7ydswz
   ```

3. **Build Settings**:
   - Railway will auto-detect Node.js
   - Build Command: `npm run build`
   - Start Command: `npm start`

### Step 3: Deploy

1. **Click "Deploy"**
2. **Wait for build** (may take 5-10 minutes)
3. **Check logs** for any issues

### Step 4: Test Deployment

Once deployed, Railway will give you a URL like:
`https://your-app-name.up.railway.app`

Test these endpoints:
- `GET /` - Should return API info
- `GET /api/health` - Should return health status
- `GET /health` - Should return detailed health check

### Step 5: Update Frontend

Update your Vercel frontend to point to Railway backend:

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Add Environment Variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-app.up.railway.app
   ```

2. **Redeploy Vercel**:
   - Trigger a new deployment
   - Your frontend will now connect to Railway backend

### Troubleshooting

**Build Errors**:
- Railway is more forgiving with TypeScript errors
- If build fails, check the logs in Railway dashboard
- Common fixes:
  - Ensure all dependencies are in `package.json`
  - Check that `tsconfig.json` is properly configured

**Runtime Errors**:
- Check Railway logs for runtime issues
- Verify environment variables are set correctly
- Ensure database connection is working

**CORS Issues**:
- Update `CLIENT_URL` in Railway to your Vercel domain
- Backend will automatically allow CORS for your frontend

### Final Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Railway       │    │   Neon          │
│   Frontend      │◄──►│   Backend       │◄──►│   Database      │
│   (Live)        │    │   (Cloud)       │    │   (Live)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Benefits of This Setup

✅ **Free Tier**: Railway offers $5/month credit (effectively free for small apps)
✅ **Easy Deployment**: One-click deployment from GitHub
✅ **Automatic HTTPS**: SSL certificates handled automatically
✅ **Environment Variables**: Easy configuration management
✅ **Logs & Monitoring**: Built-in logging and monitoring
✅ **Auto-scaling**: Handles traffic spikes automatically

### Next Steps

1. **Deploy to Railway** using the steps above
2. **Test the complete flow**: Vercel frontend → Railway backend → Neon database
3. **Monitor performance** using Railway dashboard
4. **Scale as needed** when your app grows

---

**Need Help?**
- Railway Documentation: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Check Railway logs for specific error messages
