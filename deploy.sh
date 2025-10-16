#!/bin/bash

# Deployment and Testing Scripts
# Run these scripts to deploy and test your website builder

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}🚀 Website Builder Deployment Scripts${NC}"
echo "=================================="

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if ! command_exists git; then
        print_error "git is not installed"
        exit 1
    fi
    
    print_status "All prerequisites met"
}

# Function to install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    
    # Backend dependencies
    cd "$PROJECT_ROOT/$BACKEND_DIR"
    print_info "Installing backend dependencies..."
    npm install
    
    # Frontend dependencies
    cd "$PROJECT_ROOT/$FRONTEND_DIR"
    print_info "Installing frontend dependencies..."
    npm install
    
    cd "$PROJECT_ROOT"
    print_status "Dependencies installed"
}

# Function to run database migrations
run_migrations() {
    print_info "Running database migrations..."
    
    cd "$PROJECT_ROOT/$BACKEND_DIR"
    
    # Check if DATABASE_URL is set
    if [ -z "$DATABASE_URL" ]; then
        print_warning "DATABASE_URL not set, skipping migrations"
        return
    fi
    
    # Run migrations
    npx prisma migrate deploy
    
    print_status "Database migrations completed"
}

# Function to seed database
seed_database() {
    print_info "Seeding database..."
    
    cd "$PROJECT_ROOT/$BACKEND_DIR"
    
    # Check if DATABASE_URL is set
    if [ -z "$DATABASE_URL" ]; then
        print_warning "DATABASE_URL not set, skipping seeding"
        return
    fi
    
    # Run seeding
    npx prisma db seed
    
    print_status "Database seeded"
}

# Function to build backend
build_backend() {
    print_info "Building backend..."
    
    cd "$PROJECT_ROOT/$BACKEND_DIR"
    npm run build
    
    print_status "Backend built successfully"
}

# Function to build frontend
build_frontend() {
    print_info "Building frontend..."
    
    cd "$PROJECT_ROOT/$FRONTEND_DIR"
    npm run build
    
    print_status "Frontend built successfully"
}

# Function to test backend
test_backend() {
    print_info "Testing backend..."
    
    cd "$PROJECT_ROOT/$BACKEND_DIR"
    
    # Run tests if they exist
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        npm test
        print_status "Backend tests passed"
    else
        print_warning "No tests found for backend"
    fi
}

# Function to test frontend
test_frontend() {
    print_info "Testing frontend..."
    
    cd "$PROJECT_ROOT/$FRONTEND_DIR"
    
    # Run tests if they exist
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        npm test
        print_status "Frontend tests passed"
    else
        print_warning "No tests found for frontend"
    fi
}

# Function to start backend locally
start_backend() {
    print_info "Starting backend locally..."
    
    cd "$PROJECT_ROOT/$BACKEND_DIR"
    npm run dev &
    BACKEND_PID=$!
    
    # Wait for backend to start
    sleep 5
    
    # Test health endpoint
    if curl -f http://localhost:3001/health >/dev/null 2>&1; then
        print_status "Backend started successfully on http://localhost:3001"
    else
        print_error "Backend failed to start"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
}

# Function to start frontend locally
start_frontend() {
    print_info "Starting frontend locally..."
    
    cd "$PROJECT_ROOT/$FRONTEND_DIR"
    npm run dev &
    FRONTEND_PID=$!
    
    # Wait for frontend to start
    sleep 10
    
    # Test frontend
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        print_status "Frontend started successfully on http://localhost:3000"
    else
        print_error "Frontend failed to start"
        kill $FRONTEND_PID 2>/dev/null || true
        exit 1
    fi
}

# Function to run health checks
run_health_checks() {
    print_info "Running health checks..."
    
    # Backend health check
    if curl -f http://localhost:3001/health >/dev/null 2>&1; then
        print_status "Backend health check passed"
    else
        print_error "Backend health check failed"
        return 1
    fi
    
    # Frontend health check
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        print_status "Frontend health check passed"
    else
        print_error "Frontend health check failed"
        return 1
    fi
    
    print_status "All health checks passed"
}

# Function to run integration tests
run_integration_tests() {
    print_info "Running integration tests..."
    
    # Test API endpoints
    test_api_endpoints() {
        local base_url="http://localhost:3001"
        
        # Test health endpoint
        if curl -f "$base_url/health" >/dev/null 2>&1; then
            print_status "Health endpoint working"
        else
            print_error "Health endpoint failed"
            return 1
        fi
        
        # Test API root
        if curl -f "$base_url/api/v1" >/dev/null 2>&1; then
            print_status "API root endpoint working"
        else
            print_error "API root endpoint failed"
            return 1
        fi
        
        # Test templates endpoint
        if curl -f "$base_url/api/v1/templates" >/dev/null 2>&1; then
            print_status "Templates endpoint working"
        else
            print_error "Templates endpoint failed"
            return 1
        fi
    }
    
    test_api_endpoints
    
    print_status "Integration tests completed"
}

# Function to deploy to Railway
deploy_railway() {
    print_info "Deploying to Railway..."
    
    # Check if Railway CLI is installed
    if ! command_exists railway; then
        print_error "Railway CLI is not installed. Install it with: npm install -g @railway/cli"
        exit 1
    fi
    
    # Login to Railway
    railway login
    
    # Deploy backend
    cd "$PROJECT_ROOT/$BACKEND_DIR"
    railway up
    
    print_status "Backend deployed to Railway"
}

# Function to deploy to Cloudflare Pages
deploy_cloudflare() {
    print_info "Deploying to Cloudflare Pages..."
    
    # Check if Wrangler CLI is installed
    if ! command_exists wrangler; then
        print_error "Wrangler CLI is not installed. Install it with: npm install -g wrangler"
        exit 1
    fi
    
    # Login to Cloudflare
    wrangler login
    
    # Deploy frontend
    cd "$PROJECT_ROOT/$FRONTEND_DIR"
    wrangler pages deploy .next --project-name=website-builder
    
    print_status "Frontend deployed to Cloudflare Pages"
}

# Function to run full deployment
full_deployment() {
    print_info "Starting full deployment..."
    
    check_prerequisites
    install_dependencies
    run_migrations
    seed_database
    build_backend
    build_frontend
    test_backend
    test_frontend
    
    print_status "Full deployment completed successfully!"
}

# Function to run local development
local_development() {
    print_info "Starting local development..."
    
    check_prerequisites
    install_dependencies
    run_migrations
    seed_database
    
    # Start backend in background
    start_backend
    
    # Start frontend in background
    start_frontend
    
    print_status "Local development environment ready!"
    print_info "Backend: http://localhost:3001"
    print_info "Frontend: http://localhost:3000"
    print_info "Press Ctrl+C to stop all services"
    
    # Wait for user to stop
    wait
}

# Function to run production deployment
production_deployment() {
    print_info "Starting production deployment..."
    
    check_prerequisites
    install_dependencies
    run_migrations
    seed_database
    build_backend
    build_frontend
    test_backend
    test_frontend
    deploy_railway
    deploy_cloudflare
    
    print_status "Production deployment completed successfully!"
}

# Function to show help
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  install       Install all dependencies"
    echo "  migrate       Run database migrations"
    echo "  seed          Seed database with initial data"
    echo "  build         Build both backend and frontend"
    echo "  test          Run all tests"
    echo "  dev           Start local development environment"
    echo "  deploy        Deploy to production (Railway + Cloudflare)"
    echo "  health        Run health checks"
    echo "  integration   Run integration tests"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 install    # Install dependencies"
    echo "  $0 dev        # Start local development"
    echo "  $0 deploy     # Deploy to production"
}

# Main script logic
case "${1:-help}" in
    "install")
        check_prerequisites
        install_dependencies
        ;;
    "migrate")
        run_migrations
        ;;
    "seed")
        seed_database
        ;;
    "build")
        build_backend
        build_frontend
        ;;
    "test")
        test_backend
        test_frontend
        ;;
    "dev")
        local_development
        ;;
    "deploy")
        production_deployment
        ;;
    "health")
        run_health_checks
        ;;
    "integration")
        run_integration_tests
        ;;
    "help"|*)
        show_help
        ;;
esac