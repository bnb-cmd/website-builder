#!/bin/bash

# Pakistan Website Builder - Development Startup Script
# This script starts the development environment

set -e

echo "🚀 Starting Pakistan Website Builder Development Environment..."
echo "=============================================================="

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating environment file from template..."
    cp env.example .env
    echo "✅ Please edit .env file with your configuration and run this script again."
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env | xargs)

# Check if Docker is available and running
if command -v docker &> /dev/null && docker info &> /dev/null; then
    echo "🐳 Docker detected - using containerized environment"
    
    # Check if services are already running
    if docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
        echo "🔄 Services already running, restarting..."
        docker-compose -f docker-compose.dev.yml restart
    else
        echo "🚀 Starting services with Docker..."
        docker-compose -f docker-compose.dev.yml up -d
    fi
    
    # Wait for database to be ready
    echo "⏳ Waiting for database to be ready..."
    sleep 15
    
    # Run database migrations
    echo "🗄️  Running database migrations..."
    docker-compose -f docker-compose.dev.yml exec -T backend npm run db:generate
    docker-compose -f docker-compose.dev.yml exec -T backend npm run db:migrate || echo "⚠️ Migration may have failed - continuing..."
    
    echo "✅ Docker environment started!"
    echo ""
    echo "🌐 Your application is running:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:3001"
    echo "   API Documentation: http://localhost:3001/docs"
    echo "   Database: localhost:5432"
    echo "   Redis: localhost:6379"
    echo ""
    echo "📊 View logs:"
    echo "   All services: docker-compose -f docker-compose.dev.yml logs -f"
    echo "   Backend only: docker-compose -f docker-compose.dev.yml logs -f backend"
    echo "   Frontend only: docker-compose -f docker-compose.dev.yml logs -f frontend"
    echo ""
    echo "🛑 Stop services: docker-compose -f docker-compose.dev.yml down"
    
else
    echo "🔧 Docker not available - starting services manually"
    
    # Check if dependencies are installed
    if [ ! -d "node_modules" ] || [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
        echo "📦 Installing dependencies..."
        npm run install-all
    fi
    
    # Check if database is accessible
    if ! nc -z localhost 5432 2>/dev/null; then
        echo "❌ PostgreSQL is not running on localhost:5432"
        echo "Please start PostgreSQL or use Docker environment"
        exit 1
    fi
    
    # Check if Redis is accessible
    if ! nc -z localhost 6379 2>/dev/null; then
        echo "❌ Redis is not running on localhost:6379"
        echo "Please start Redis or use Docker environment"
        exit 1
    fi
    
    echo "✅ Database and Redis are accessible"
    
    # Run database migrations
    echo "🗄️  Running database migrations..."
    cd backend
    npm run db:generate
    npm run db:migrate
    cd ..
    
    # Start development servers
    echo "🚀 Starting development servers..."
    npm run dev
fi
