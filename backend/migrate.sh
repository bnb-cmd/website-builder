#!/bin/bash

# 📦 Database Migration Script
# This script runs Prisma migrations for PostgreSQL

set -e  # Exit on any error

echo "📦 Running database migrations..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the backend directory
if [ ! -f "prisma/schema.prisma" ]; then
    print_error "Please run this script from the backend directory"
    exit 1
fi

# Check if environment file exists
if [ ! -f ".env.production" ]; then
    print_error "Environment file not found. Please run setup-external-services.sh first"
    exit 1
fi

# Load environment variables
print_status "Loading environment variables..."
export $(cat .env.production | grep -v '^#' | xargs)

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    print_error "DATABASE_URL not set in environment file"
    exit 1
fi

print_status "Database URL configured ✓"

# Check if Prisma is installed
if ! command -v npx &> /dev/null; then
    print_error "npx not found. Please install Node.js"
    exit 1
fi

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

if [ $? -ne 0 ]; then
    print_error "Prisma client generation failed"
    exit 1
fi

print_success "Prisma client generated ✓"

# Run database migration
print_status "Running database migration..."
npx prisma migrate dev --name init_postgresql

if [ $? -ne 0 ]; then
    print_error "Database migration failed"
    exit 1
fi

print_success "Database migration completed ✓"

# Optional: Seed database
read -p "Do you want to seed the database with initial data? (y/n): " seed_db

if [ "$seed_db" = "y" ]; then
    print_status "Seeding database..."
    
    # Check if seed script exists
    if [ -f "package.json" ] && grep -q '"seed"' package.json; then
        npm run seed
        print_success "Database seeded ✓"
    else
        print_status "No seed script found. Skipping seeding."
    fi
fi

# Test database connection
print_status "Testing database connection..."
npx prisma db pull --print

if [ $? -eq 0 ]; then
    print_success "Database connection test passed ✓"
else
    print_warning "Database connection test failed. Check your DATABASE_URL"
fi

echo ""
echo "🎉 Database migration complete!"
echo ""
echo "📊 Migration Summary:"
echo "   Database: PostgreSQL (Neon)"
echo "   Schema: Updated for production"
echo "   Client: Generated successfully"
echo ""
echo "🚀 Next steps:"
echo "   1. Deploy backend to Railway"
echo "   2. Deploy frontend to Cloudflare Pages"
echo "   3. Test the deployment"
echo ""
echo "✅ Ready for deployment!"
