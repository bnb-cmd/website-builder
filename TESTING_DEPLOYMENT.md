# Testing Deployment Guide

## Current Setup: Neon + Vercel + Local Backend

This guide documents the testing deployment setup using:
- **Neon PostgreSQL Database** - Cloud database for data persistence
- **Vercel Frontend** - Deployed frontend application
- **Local Backend** - Backend running locally for testing

## Prerequisites

1. **Neon Database**: You should have a Neon database URL ready
2. **Node.js**: Version 22+ installed
3. **npm**: Version 10+ installed
4. **Vercel CLI**: For frontend deployment

## Setup Steps

### 1. Backend Configuration

1. **Update Database URL**: Edit `backend/.env` and replace the placeholder DATABASE_URL with your actual Neon database URL:
   ```bash
   DATABASE_URL="postgresql://username:password@ep-your-project.us-east-1.aws.neon.tech/neondb?sslmode=require"
   ```

2. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Run Database Migrations**:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

4. **Seed Initial Data**:
   ```bash
   npm run db:seed
   node scripts/createAdminUser.js
   ```

### 2. Frontend Configuration

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Variables**: The `.env.local` file is already configured for local development.

### 3. Local Testing

1. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```
   Backend will be available at `http://localhost:3005`

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will be available at `http://localhost:3000`

3. **Test Endpoints**:
   - Health check: `http://localhost:3005/v1/health`
   - Templates: `http://localhost:3005/v1/templates`
   - Auth: `http://localhost:3005/v1/auth/login`

### 4. Vercel Deployment

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel --prod
   ```

4. **Set Environment Variables in Vercel Dashboard**:
   - `NEXT_PUBLIC_API_URL`: `http://localhost:3005/v1` (temporarily)
   - `NEXT_PUBLIC_APP_URL`: Your Vercel app URL
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe key (if available)

### 5. Update Backend CORS

After deploying to Vercel, update `backend/.env`:
```bash
CLIENT_URL=https://your-vercel-app.vercel.app
```

## Migration to Railway (Future)

When ready to deploy the backend to Railway:

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Login and Initialize
```bash
cd backend
railway login
railway init
```

### 3. Set Environment Variables
Use the template in `backend/.env.railway` and set variables in Railway:
```bash
railway variables set DATABASE_URL="your-neon-url"
railway variables set JWT_SECRET="your-production-secret"
# ... other variables
```

### 4. Deploy Backend
```bash
railway up
```

### 5. Update Frontend
Update Vercel environment variables:
- `NEXT_PUBLIC_API_URL`: Your Railway backend URL

## Testing Checklist

- [ ] Backend connects to Neon database
- [ ] Database migrations run successfully
- [ ] Admin user created
- [ ] Templates loaded
- [ ] Frontend builds successfully
- [ ] Frontend deployed to Vercel
- [ ] Auth flow works (local backend + Vercel frontend)
- [ ] Templates display correctly
- [ ] Website creation persists to Neon
- [ ] Railway deployment configs ready for future use

## Troubleshooting

### Database Connection Issues
- Verify Neon database URL is correct
- Check SSL mode is set to `require`
- Ensure database is not paused (Neon free tier)

### CORS Issues
- Update `CLIENT_URL` in backend `.env`
- Check Vercel domain is allowed in CORS settings

### Build Issues
- Ensure all dependencies are installed
- Check Node.js version compatibility
- Verify environment variables are set correctly

## Environment Files

- `backend/.env` - Local backend configuration
- `backend/.env.railway` - Railway production template
- `frontend/.env.local` - Local frontend configuration
- `frontend/vercel.json` - Vercel deployment configuration

## Next Steps

1. Test the complete flow locally
2. Deploy frontend to Vercel
3. Test with deployed frontend + local backend
4. When ready, migrate backend to Railway
5. Update frontend to use Railway backend URL
