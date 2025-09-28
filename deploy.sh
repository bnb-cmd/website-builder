#!/bin/bash

# Pakistan Website Builder - Production Deployment Script
# This script deploys the application to production

set -e

echo "🚀 Deploying Pakistan Website Builder to Production..."
echo "===================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is required for production deployment. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is required for production deployment. Please install Docker Compose first."
    exit 1
fi

# Environment check
if [ ! -f ".env" ]; then
    echo "❌ Environment file (.env) not found. Please create one from env.example"
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env | xargs)

# Validate required environment variables
REQUIRED_VARS=(
    "DATABASE_URL"
    "JWT_SECRET"
    "NEXT_PUBLIC_API_URL"
    "NEXT_PUBLIC_APP_URL"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Required environment variable $var is not set"
        exit 1
    fi
done

echo "✅ Environment validation passed"

# Build the application
echo "🔨 Building application..."

# Build backend
echo "📦 Building backend..."
cd backend
npm run build
cd ..

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm run build
cd ..

echo "✅ Build complete!"

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Pull latest images
echo "📥 Pulling latest images..."
docker-compose -f docker-compose.prod.yml pull

# Start production services
echo "🚀 Starting production services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose -f docker-compose.prod.yml exec backend npm run db:migrate:prod

# Health check
echo "🔍 Running health checks..."
sleep 10

# Check if services are running
if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "✅ Services are running!"
else
    echo "❌ Some services failed to start. Check logs:"
    docker-compose -f docker-compose.prod.yml logs
    exit 1
fi

# Test API endpoint
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend API is responding"
else
    echo "❌ Backend API is not responding"
    exit 1
fi

# Test frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is responding"
else
    echo "❌ Frontend is not responding"
    exit 1
fi

echo ""
echo "🎉 Deployment Successful!"
echo "========================"
echo ""
echo "🌐 Your application is now running:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   API Documentation: http://localhost:3001/docs"
echo ""
echo "📊 Monitoring:"
echo "   Prometheus: http://localhost:9090"
echo "   Grafana: http://localhost:3001"
echo ""
echo "🔧 Management Commands:"
echo "   View logs: docker-compose -f docker-compose.prod.yml logs"
echo "   Stop services: docker-compose -f docker-compose.prod.yml down"
echo "   Restart services: docker-compose -f docker-compose.prod.yml restart"
echo ""
echo "📈 Next Steps:"
echo "1. Configure your domain DNS to point to this server"
echo "2. Set up SSL certificates"
echo "3. Configure monitoring and backups"
echo "4. Test all functionality"
echo ""
echo "🆘 Need help?"
echo "   Documentation: https://docs.pakistanbuilder.com"
echo "   Support: support@pakistanbuilder.com"
echo ""
echo "Happy serving! 🎯"
