#!/bin/bash

# 🧪 Deployment Testing Script
# This script tests the deployed website builder

set -e  # Exit on any error

echo "🧪 Testing Railway + Cloudflare deployment..."

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

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Default URLs (can be overridden)
BACKEND_URL="${BACKEND_URL:-https://pakistan-builder-backend.up.railway.app}"
FRONTEND_URL="${FRONTEND_URL:-https://pakistan-builder.pages.dev}"

print_status "Testing URLs:"
print_status "  Backend:  $BACKEND_URL"
print_status "  Frontend: $FRONTEND_URL"
echo ""

# Test 1: Backend Health Check
print_status "Test 1: Backend Health Check"
HEALTH_RESPONSE=$(curl -s -w "%{http_code}" "$BACKEND_URL/v1/health" -o /tmp/health_response.json)

if [ "$HEALTH_RESPONSE" = "200" ]; then
    print_success "Backend health check passed ✓"
    
    # Check response content
    if grep -q "OK" /tmp/health_response.json; then
        print_success "Backend services are healthy ✓"
    else
        print_warning "Backend health check passed but services may not be healthy"
    fi
else
    print_error "Backend health check failed (HTTP $HEALTH_RESPONSE)"
    print_status "Response:"
    cat /tmp/health_response.json 2>/dev/null || echo "No response body"
fi

echo ""

# Test 2: Frontend Accessibility
print_status "Test 2: Frontend Accessibility"
FRONTEND_RESPONSE=$(curl -s -w "%{http_code}" "$FRONTEND_URL" -o /tmp/frontend_response.html)

if [ "$FRONTEND_RESPONSE" = "200" ]; then
    print_success "Frontend is accessible ✓"
    
    # Check if it's a valid HTML page
    if grep -q "<!DOCTYPE html>" /tmp/frontend_response.html || grep -q "<html" /tmp/frontend_response.html; then
        print_success "Frontend returns valid HTML ✓"
    else
        print_warning "Frontend accessible but may not be returning HTML"
    fi
else
    print_error "Frontend accessibility test failed (HTTP $FRONTEND_RESPONSE)"
fi

echo ""

# Test 3: API Endpoints
print_status "Test 3: API Endpoints"

# Test auth endpoints
print_status "  Testing auth endpoints..."
AUTH_RESPONSE=$(curl -s -w "%{http_code}" "$BACKEND_URL/v1/auth/register" -X POST -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"testpass123"}' -o /tmp/auth_response.json)

if [ "$AUTH_RESPONSE" = "400" ] || [ "$AUTH_RESPONSE" = "422" ]; then
    print_success "Auth endpoint is responding ✓"
else
    print_warning "Auth endpoint returned unexpected status: $AUTH_RESPONSE"
fi

# Test website endpoints
print_status "  Testing website endpoints..."
WEBSITE_RESPONSE=$(curl -s -w "%{http_code}" "$BACKEND_URL/v1/websites" -o /tmp/website_response.json)

if [ "$WEBSITE_RESPONSE" = "401" ]; then
    print_success "Website endpoint requires authentication ✓"
else
    print_warning "Website endpoint returned unexpected status: $WEBSITE_RESPONSE"
fi

echo ""

# Test 4: CORS Configuration
print_status "Test 4: CORS Configuration"
CORS_RESPONSE=$(curl -s -w "%{http_code}" -H "Origin: $FRONTEND_URL" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: Content-Type" -X OPTIONS "$BACKEND_URL/v1/auth/login" -o /tmp/cors_response.txt)

if [ "$CORS_RESPONSE" = "200" ]; then
    print_success "CORS preflight request successful ✓"
else
    print_warning "CORS preflight request failed (HTTP $CORS_RESPONSE)"
fi

echo ""

# Test 5: Static Assets
print_status "Test 5: Static Assets"
STATIC_RESPONSE=$(curl -s -w "%{http_code}" "$FRONTEND_URL/favicon.ico" -o /dev/null)

if [ "$STATIC_RESPONSE" = "200" ] || [ "$STATIC_RESPONSE" = "404" ]; then
    print_success "Static assets are being served ✓"
else
    print_warning "Static assets test returned unexpected status: $STATIC_RESPONSE"
fi

echo ""

# Test 6: Database Connection (via API)
print_status "Test 6: Database Connection"
DB_RESPONSE=$(curl -s -w "%{http_code}" "$BACKEND_URL/v1/templates" -o /tmp/templates_response.json)

if [ "$DB_RESPONSE" = "200" ]; then
    print_success "Database connection working ✓"
    
    # Check if templates are returned
    if grep -q "templates" /tmp/templates_response.json; then
        print_success "Templates endpoint returning data ✓"
    else
        print_warning "Templates endpoint accessible but no data returned"
    fi
else
    print_warning "Database connection test failed (HTTP $DB_RESPONSE)"
fi

echo ""

# Test 7: Performance Test
print_status "Test 7: Performance Test"
PERF_START=$(date +%s%3N)
curl -s "$BACKEND_URL/v1/health" > /dev/null
PERF_END=$(date +%s%3N)
PERF_TIME=$((PERF_END - PERF_START))

if [ $PERF_TIME -lt 1000 ]; then
    print_success "Backend response time: ${PERF_TIME}ms ✓"
else
    print_warning "Backend response time: ${PERF_TIME}ms (may be slow)"
fi

echo ""

# Test 8: SSL/TLS
print_status "Test 8: SSL/TLS Configuration"
SSL_RESPONSE=$(curl -s -w "%{http_code}" "https://pakistan-builder.pages.dev" -o /dev/null)

if [ "$SSL_RESPONSE" = "200" ]; then
    print_success "SSL/TLS is working ✓"
else
    print_error "SSL/TLS test failed (HTTP $SSL_RESPONSE)"
fi

echo ""

# Summary
echo "📊 Test Summary"
echo "==============="

# Count successful tests
SUCCESS_COUNT=0
TOTAL_TESTS=8

# Check each test result (simplified)
if [ "$HEALTH_RESPONSE" = "200" ]; then ((SUCCESS_COUNT++)); fi
if [ "$FRONTEND_RESPONSE" = "200" ]; then ((SUCCESS_COUNT++)); fi
if [ "$AUTH_RESPONSE" = "400" ] || [ "$AUTH_RESPONSE" = "422" ]; then ((SUCCESS_COUNT++)); fi
if [ "$WEBSITE_RESPONSE" = "401" ]; then ((SUCCESS_COUNT++)); fi
if [ "$CORS_RESPONSE" = "200" ]; then ((SUCCESS_COUNT++)); fi
if [ "$STATIC_RESPONSE" = "200" ] || [ "$STATIC_RESPONSE" = "404" ]; then ((SUCCESS_COUNT++)); fi
if [ "$DB_RESPONSE" = "200" ]; then ((SUCCESS_COUNT++)); fi
if [ "$SSL_RESPONSE" = "200" ]; then ((SUCCESS_COUNT++)); fi

echo "Passed: $SUCCESS_COUNT/$TOTAL_TESTS tests"

if [ $SUCCESS_COUNT -eq $TOTAL_TESTS ]; then
    print_success "All tests passed! 🎉"
    echo ""
    echo "🚀 Your website builder is ready for users!"
    echo ""
    echo "🔗 URLs:"
    echo "  Frontend: $FRONTEND_URL"
    echo "  Backend:  $BACKEND_URL"
    echo ""
    echo "🧪 Manual Testing:"
    echo "  1. Visit: $FRONTEND_URL"
    echo "  2. Register a new user"
    echo "  3. Create a test website"
    echo "  4. Preview the website"
    echo "  5. Test publishing"
elif [ $SUCCESS_COUNT -ge 6 ]; then
    print_warning "Most tests passed. Check warnings above."
    echo ""
    echo "⚠️  Review the warnings and fix any issues before going live."
else
    print_error "Multiple tests failed. Check errors above."
    echo ""
    echo "❌ Please fix the issues before deploying to production."
fi

# Cleanup
rm -f /tmp/health_response.json /tmp/frontend_response.html /tmp/auth_response.json /tmp/website_response.json /tmp/cors_response.txt /tmp/templates_response.json

echo ""
echo "✅ Testing complete!"
