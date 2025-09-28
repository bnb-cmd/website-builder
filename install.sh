#!/bin/bash

# Pakistan Website Builder - Installation Script
# This script sets up the complete development environment

set -e

echo "🚀 Installing Pakistan Website Builder..."
echo "======================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 22+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION is not supported. Please install Node.js 18+ or 22+."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. You can still run without Docker, but it's recommended."
    echo "Visit: https://docs.docker.com/get-docker/"
else
    echo "✅ Docker detected"
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install --legacy-peer-deps
cd ..

# Create environment file
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp env.example .env
    echo "✅ Environment file created. Please edit .env with your configuration."
else
    echo "✅ Environment file already exists"
fi

# Set up database (if Docker is available)
if command -v docker &> /dev/null; then
    echo "🗄️  Setting up database with Docker..."
    
    # Check if Docker is running
    if docker info &> /dev/null; then
        echo "🐳 Starting database services..."
        docker-compose -f docker-compose.dev.yml up -d postgres redis
        
        # Wait for database to be ready
        echo "⏳ Waiting for database to be ready..."
        sleep 10
        
        # Run database migrations
        echo "🔄 Running database migrations..."
        cd backend
        npx prisma generate
        npx prisma db push
        cd ..
        
        echo "✅ Database setup complete!"
    else
        echo "❌ Docker is not running. Please start Docker and run this script again."
        echo "Or set up PostgreSQL and Redis manually and update your .env file."
    fi
else
    echo "⚠️  Docker not available. Please set up PostgreSQL and Redis manually."
    echo "Update the DATABASE_URL and REDIS_URL in your .env file."
fi

echo ""
echo "🎉 Installation Complete!"
echo "========================"
echo ""
echo "📖 Next Steps:"
echo "1. Update your .env file with your API keys and database credentials"
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   API Documentation: http://localhost:3001/docs"
echo ""
echo "📚 Documentation:"
echo "   README.md - Getting started guide"
echo "   docs/ - Detailed documentation"
echo ""
echo "🆘 Need help?"
echo "   Email: support@pakistanbuilder.com"
echo "   GitHub: https://github.com/pakistanbuilder/website-builder"
echo ""
echo "Happy building! 🚀"
