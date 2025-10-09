# Vercel Deployment Guide

## Overview

This guide shows how to deploy your Pakistan Website Builder frontend to Vercel. Vercel is the recommended platform for Next.js applications, offering excellent performance, automatic deployments, and seamless integration.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Node.js**: Version 18+ (Vercel supports Node.js 18+)

## Deployment Methods

### Method 1: Vercel Dashboard (Recommended)

1. **Connect GitHub Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **"New Project"**
   - Import your GitHub repository
   - Select the repository containing your frontend code

2. **Configure Project Settings**:
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Set Environment Variables**:
   In the **Environment Variables** section, add:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3005/v1
   NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   NEXT_PUBLIC_APP_NAME=Pakistan Website Builder
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

4. **Deploy**:
   - Click **"Deploy"**
   - Vercel will automatically build and deploy your application
   - You'll get a URL like `https://your-project.vercel.app`

### Method 2: Vercel CLI (Advanced)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Navigate to Frontend Directory**:
   ```bash
   cd frontend
   ```

4. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts to configure your project
   - Choose your team/account
   - Set project name
   - Configure settings

5. **Set Environment Variables**:
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   vercel env add NEXT_PUBLIC_APP_URL
   vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   ```

6. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Method 3: Git Integration (Automatic Deployments)

1. **Connect Repository**:
   - In Vercel dashboard, import your GitHub repository
   - Enable **"Automatic deployments"**

2. **Configure Branch Settings**:
   - **Production Branch**: `main` or `master`
   - **Preview Branches**: All other branches

3. **Automatic Deployments**:
   - Every push to `main` triggers production deployment
   - Every push to other branches creates preview deployments
   - Pull requests get preview deployments automatically

## Configuration Files

### 1. `vercel.json` (Already Created)
Located at `frontend/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "@next_public_api_url",
    "NEXT_PUBLIC_APP_URL": "@next_public_app_url",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY": "@next_public_stripe_publishable_key",
    "NEXT_PUBLIC_GOOGLE_ANALYTICS_ID": "@next_public_google_analytics_id"
  },
  "functions": {
    "src/app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/((?!api/).*)",
      "destination": "/"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        }
      ]
    }
  ],
  "regions": ["iad1"]
}
```

### 2. `next.config.js` (Updated)
Your Next.js configuration is already optimized for Vercel with:
- React Strict Mode enabled
- Proper image domains configured
- Development rewrites for local backend

## Environment Variables

### Required Variables
Set these in Vercel dashboard → **Settings** → **Environment Variables**:

```
NEXT_PUBLIC_API_URL=http://localhost:3005/v1
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

### Optional Variables
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_APP_NAME=Pakistan Website Builder
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Environment-Specific Variables
You can set different values for different environments:
- **Production**: Live values
- **Preview**: Test values
- **Development**: Local values

## Custom Domain Setup

1. **Add Custom Domain**:
   - Go to your project → **Settings** → **Domains**
   - Click **"Add Domain"**
   - Enter your domain (e.g., `yourdomain.com`)

2. **DNS Configuration**:
   - Add CNAME record: `www` → `cname.vercel-dns.com`
   - Add A record: `@` → `76.76.19.61` (Vercel's IP)

3. **SSL Certificate**:
   - Vercel automatically provides SSL certificates
   - Enable **"Force HTTPS"** in domain settings

## Backend CORS Configuration

Update your backend `.env` file to allow Vercel domain:
```bash
CLIENT_URL=https://your-project.vercel.app
```

Or add to your backend CORS configuration:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-project.vercel.app',
  'https://yourdomain.com'
]
```

## Performance Optimization

### 1. Enable Vercel Features
- **Edge Functions**: For API routes
- **Image Optimization**: Automatic with Next.js
- **Analytics**: Built-in performance monitoring

### 2. Configure Caching
Add to `next.config.js`:
```javascript
async headers() {
  return [
    {
      source: '/_next/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ]
}
```

### 3. Enable Compression
Vercel automatically enables:
- Gzip compression
- Brotli compression
- Image optimization

## Testing Your Deployment

1. **Check Build Logs**:
   - Go to Vercel dashboard → **Deployments**
   - Click on deployment to see build logs

2. **Test Functionality**:
   - Visit your Vercel URL
   - Test authentication flow
   - Verify API connections
   - Check responsive design

3. **Performance Testing**:
   - Use Vercel's built-in analytics
   - Test with tools like PageSpeed Insights
   - Check Core Web Vitals

## Troubleshooting

### Build Failures
- Check Node.js version (use 18+)
- Verify all dependencies are in `package.json`
- Check build logs for specific errors
- Ensure TypeScript compilation passes

### Environment Variables Not Working
- Ensure variables start with `NEXT_PUBLIC_`
- Redeploy after adding new variables
- Check variable names match exactly
- Verify variables are set for correct environment

### API Connection Issues
- Verify CORS settings in backend
- Check API URL in environment variables
- Ensure backend is accessible from Vercel
- Check network tab in browser dev tools

### Routing Issues
- Verify Next.js routing configuration
- Check `vercel.json` rewrites
- Ensure all routes are properly exported
- Test both client-side and server-side routing

## Vercel CLI Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Set environment variable
vercel env add VARIABLE_NAME

# Remove environment variable
vercel env rm VARIABLE_NAME

# Pull environment variables
vercel env pull .env.local
```

## Monitoring and Analytics

### 1. Vercel Analytics
- Built-in performance monitoring
- Real User Monitoring (RUM)
- Core Web Vitals tracking
- Custom event tracking

### 2. Speed Insights
- Automatic performance monitoring
- Lighthouse scores
- Performance recommendations

### 3. Function Logs
- Serverless function execution logs
- Error tracking
- Performance metrics

## Deployment Workflow

### Development Workflow
1. **Local Development**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Preview Deployments**:
   - Push to feature branch
   - Vercel creates preview deployment
   - Test on preview URL

3. **Production Deployment**:
   - Merge to main branch
   - Vercel deploys to production
   - Monitor deployment status

### CI/CD Integration
Vercel integrates with:
- GitHub Actions
- GitLab CI
- Bitbucket Pipelines
- Custom webhooks

## Cost and Limits

### Free Tier Limits
- **Bandwidth**: 100GB/month
- **Builds**: 100 builds/month
- **Function Executions**: 100GB-hours/month
- **Team Members**: Unlimited

### Pro Tier Benefits
- **Bandwidth**: 1TB/month
- **Builds**: Unlimited
- **Function Executions**: 1000GB-hours/month
- **Advanced Analytics**
- **Priority Support**

## Next Steps

1. **Deploy to Vercel** using one of the methods above
2. **Test the deployment** thoroughly
3. **Set up custom domain** if needed
4. **Configure backend CORS** to allow Vercel domain
5. **Monitor performance** using Vercel analytics
6. **Set up automatic deployments** for continuous integration

## Migration from Other Platforms

### From Netlify
1. Export environment variables
2. Update build settings
3. Configure redirects/rewrites
4. Test thoroughly

### From Cloudflare Pages
1. Export environment variables
2. Update Next.js configuration
3. Configure Vercel-specific settings
4. Test deployment

Your Vercel deployment will be available at:
`https://your-project.vercel.app`

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
