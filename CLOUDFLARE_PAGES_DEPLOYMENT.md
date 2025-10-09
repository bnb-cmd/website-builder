# Cloudflare Pages Deployment Guide

## Overview

This guide shows how to deploy your Pakistan Website Builder frontend to Cloudflare Pages as an alternative to Vercel. Cloudflare Pages offers excellent performance, global CDN, and generous free tier.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Node.js**: Version 18+ (Cloudflare Pages supports Node.js 18)

## Deployment Options

### Option 1: Direct Git Integration (Recommended)

1. **Connect GitHub Repository**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to **Pages** → **Create a project**
   - Choose **Connect to Git**
   - Select your GitHub repository
   - Choose the branch (usually `main`)

2. **Configure Build Settings**:
   ```
   Framework preset: Next.js
   Build command: npm run build
   Build output directory: .next
   Root directory: frontend
   ```

3. **Set Environment Variables**:
   In Cloudflare Pages dashboard, go to **Settings** → **Environment variables**:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3005/v1
   NEXT_PUBLIC_APP_URL=https://your-project.pages.dev
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   ```

4. **Deploy**:
   - Click **Save and Deploy**
   - Cloudflare will automatically build and deploy your app

### Option 2: Wrangler CLI (Advanced)

1. **Install Wrangler**:
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Create Pages Project**:
   ```bash
   cd frontend
   wrangler pages project create pakistan-website-builder
   ```

4. **Deploy**:
   ```bash
   npm run build
   wrangler pages deploy .next --project-name=pakistan-website-builder
   ```

### Option 3: Manual Upload

1. **Build Locally**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload to Cloudflare Pages**:
   - Go to Cloudflare Pages dashboard
   - Create new project → **Upload assets**
   - Upload the `.next` folder contents

## Configuration Files

### 1. `_headers` File
Located at `frontend/_headers` - Sets security headers:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: origin-when-cross-origin
```

### 2. `_redirects` File
Located at `frontend/_redirects` - Handles SPA routing:
```
/*    /index.html   200
```

### 3. `wrangler.toml` (Optional)
For advanced configuration:
```toml
name = "pakistan-website-builder"
compatibility_date = "2024-01-01"
pages_build_output_dir = ".next"

[env.production]
vars = { NEXT_PUBLIC_API_URL = "https://your-backend-url.com/v1" }

[env.preview]
vars = { NEXT_PUBLIC_API_URL = "http://localhost:3005/v1" }
```

## Environment Variables

Set these in Cloudflare Pages dashboard:

### Required Variables
- `NEXT_PUBLIC_API_URL`: Your backend API URL
- `NEXT_PUBLIC_APP_URL`: Your Cloudflare Pages URL

### Optional Variables
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe public key
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`: Google Analytics ID
- `NEXT_PUBLIC_APP_NAME`: App name
- `NEXT_PUBLIC_APP_VERSION`: App version

## Custom Domain Setup

1. **Add Custom Domain**:
   - Go to your Pages project → **Custom domains**
   - Click **Set up a custom domain**
   - Enter your domain (e.g., `yourdomain.com`)

2. **DNS Configuration**:
   - Add CNAME record: `www` → `your-project.pages.dev`
   - Add A record: `@` → Cloudflare IP (provided in dashboard)

3. **SSL Certificate**:
   - Cloudflare automatically provides SSL certificates
   - Enable **Always Use HTTPS** in SSL/TLS settings

## Performance Optimization

### 1. Enable Cloudflare Features
- **Auto Minify**: HTML, CSS, JS
- **Brotli Compression**: Enable in Speed settings
- **Rocket Loader**: For faster JS loading
- **Mirage**: Image optimization

### 2. Caching Configuration
Add to `_headers`:
```
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/_next/image/*
  Cache-Control: public, max-age=31536000
```

### 3. Image Optimization
Update `next.config.js`:
```javascript
images: {
  loader: 'custom',
  loaderFile: './src/lib/imageLoader.js',
  domains: ['images.unsplash.com', 'res.cloudinary.com']
}
```

## Backend CORS Configuration

Update your backend `.env` file:
```bash
CLIENT_URL=https://your-project.pages.dev
```

Or add to CORS allowed origins in your backend code:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-project.pages.dev',
  'https://yourdomain.com'
]
```

## Testing Your Deployment

1. **Check Build Logs**:
   - Go to Pages dashboard → **Deployments**
   - Click on deployment to see build logs

2. **Test Endpoints**:
   - Visit your Pages URL
   - Test authentication flow
   - Verify API connections

3. **Performance Testing**:
   - Use Cloudflare's built-in analytics
   - Test with tools like PageSpeed Insights

## Troubleshooting

### Build Failures
- Check Node.js version (use 18+)
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

### Environment Variables Not Working
- Ensure variables start with `NEXT_PUBLIC_`
- Redeploy after adding new variables
- Check variable names match exactly

### Routing Issues
- Verify `_redirects` file is in root directory
- Check Next.js routing configuration
- Ensure all routes are properly exported

### API Connection Issues
- Verify CORS settings in backend
- Check API URL in environment variables
- Ensure backend is accessible from Cloudflare

## Comparison: Cloudflare Pages vs Vercel

| Feature | Cloudflare Pages | Vercel |
|---------|------------------|---------|
| Free Tier | 500 builds/month | 100 builds/month |
| Bandwidth | Unlimited | 100GB/month |
| Build Time | 20 minutes | 45 minutes |
| Global CDN | Yes (Cloudflare) | Yes (Vercel) |
| Custom Domains | Free | Free |
| SSL Certificates | Free | Free |
| Git Integration | Yes | Yes |
| CLI Tool | Wrangler | Vercel CLI |

## Next Steps

1. **Deploy to Cloudflare Pages** using one of the methods above
2. **Test the deployment** thoroughly
3. **Set up custom domain** if needed
4. **Configure backend CORS** to allow Cloudflare Pages domain
5. **Monitor performance** using Cloudflare analytics

## Migration from Vercel

If you're migrating from Vercel:

1. **Export environment variables** from Vercel dashboard
2. **Import to Cloudflare Pages** environment variables
3. **Update backend CORS** to include Cloudflare Pages domain
4. **Test thoroughly** before switching DNS
5. **Update any hardcoded URLs** in your code

Your Cloudflare Pages deployment will be available at:
`https://your-project.pages.dev`