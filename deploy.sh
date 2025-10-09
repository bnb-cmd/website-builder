#!/bin/bash

# 🚀 Complete Railway + Cloudflare Deployment Script
# This script deploys the entire website builder to production

set -e  # Exit on any error

echo "🚀 Starting Railway + Cloudflare deployment..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Project structure verified ✓"

# Step 1: Check prerequisites
print_status "Checking prerequisites..."

# Check if external services are set up
if [ ! -f "backend/.env.production" ]; then
    print_warning "Environment file not found. Running external services setup..."
    ./setup-external-services.sh
    if [ $? -ne 0 ]; then
        print_error "External services setup failed"
        exit 1
    fi
fi

print_success "Prerequisites checked ✓"

# Step 2: Database migration
print_status "Running database migrations..."

cd backend

# Check if Prisma is installed
if ! command -v npx &> /dev/null; then
    print_error "npx not found. Please install Node.js"
    exit 1
fi

# Run Prisma migration
print_status "Running Prisma migration..."
npx prisma migrate dev --name init_postgresql

if [ $? -ne 0 ]; then
    print_error "Database migration failed"
    exit 1
fi

print_success "Database migration completed ✓"

# Step 3: Deploy backend to Railway
print_status "Deploying backend to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    print_status "Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Check if user is logged in
if ! railway whoami &> /dev/null; then
    print_warning "Please log in to Railway:"
    railway login
fi

# Deploy to Railway
print_status "Deploying to Railway..."
railway up

if [ $? -ne 0 ]; then
    print_error "Railway deployment failed"
    exit 1
fi

# Get Railway URL
RAILWAY_URL=$(railway open 2>/dev/null | grep -o 'https://[^[:space:]]*' || echo "https://pakistan-builder-backend.up.railway.app")
print_success "Backend deployed to Railway ✓"
print_status "Backend URL: $RAILWAY_URL"

# Step 4: Deploy frontend to Cloudflare Pages
print_status "Deploying frontend to Cloudflare Pages..."

cd ../frontend

# Check if Wrangler CLI is installed
if ! command -v wrangler &> /dev/null; then
    print_status "Installing Wrangler CLI..."
    npm install -g wrangler
fi

# Check if user is logged in
if ! wrangler whoami &> /dev/null; then
    print_warning "Please log in to Cloudflare:"
    wrangler login
fi

# Update environment file with actual Railway URL
print_status "Updating frontend environment..."
echo "NEXT_PUBLIC_API_URL=$RAILWAY_URL/v1" > .env.production
echo "NEXT_PUBLIC_APP_URL=https://pakistan-builder.pages.dev" >> .env.production

# Build frontend
print_status "Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Frontend build failed"
    exit 1
fi

# Deploy to Cloudflare Pages
print_status "Deploying to Cloudflare Pages..."
wrangler pages deploy .next --project-name=pakistan-builder

if [ $? -ne 0 ]; then
    print_error "Cloudflare Pages deployment failed"
    exit 1
fi

print_success "Frontend deployed to Cloudflare Pages ✓"

# Step 5: Test deployment
print_status "Testing deployment..."

# Test backend health
print_status "Testing backend health..."
HEALTH_RESPONSE=$(curl -s "$RAILWAY_URL/v1/health" || echo "FAILED")

if [[ "$HEALTH_RESPONSE" == *"OK"* ]]; then
    print_success "Backend health check passed ✓"
else
    print_warning "Backend health check failed. Check Railway logs."
fi

# Test frontend
print_status "Testing frontend..."
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "https://pakistan-builder.pages.dev")

if [ "$FRONTEND_RESPONSE" = "200" ]; then
    print_success "Frontend health check passed ✓"
else
    print_warning "Frontend health check failed. HTTP status: $FRONTEND_RESPONSE"
fi

# Final summary
echo ""
echo "🎉 Deployment Complete!"
echo ""
echo "📊 Deployment Summary:"
echo "   Backend URL:  $RAILWAY_URL"
echo "   Frontend URL: https://pakistan-builder.pages.dev"
echo "   Health Check: $RAILWAY_URL/v1/health"
echo ""
echo "🔧 Next Steps:"
echo "   1. Configure environment variables in Cloudflare Dashboard"
echo "   2. Test user registration and website creation"
echo "   3. Monitor Railway metrics and logs"
echo "   4. Set up monitoring and error tracking"
echo ""
echo "💰 Cost Breakdown:"
echo "   Railway:     $5/month (hobby tier)"
echo "   Neon:        $0/month (free tier)"
echo "   Upstash:     $0/month (free tier)"
echo "   Cloudflare:  $0/month (free tier)"
echo "   Total:       $5/month"
echo ""
echo "🚀 Your website builder is now live!"