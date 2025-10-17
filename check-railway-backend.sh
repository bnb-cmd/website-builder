#!/bin/bash

# Pakistan Website Builder - Complete Infrastructure Status Checker
# This script checks if all services (Railway, Neon, Upstash) are running and accessible

echo "🚀 Checking Pakistan Website Builder Infrastructure Status..."
echo ""

# Load configuration
source railway-config.sh

# Check if backend is accessible
echo "🔍 Testing backend connectivity..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$RAILWAY_BACKEND_URL/health" 2>/dev/null)

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Backend is running and accessible (HTTP $HTTP_STATUS)"
elif [ "$HTTP_STATUS" = "404" ]; then
    echo "⚠️  Backend is running but health endpoint not found (HTTP $HTTP_STATUS)"
    echo "🔍 Testing login endpoint instead..."
    LOGIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$RAILWAY_BACKEND_URL/v1/auth/login" 2>/dev/null)
    if [ "$LOGIN_STATUS" = "404" ]; then
        echo "❌ Login endpoint not found (HTTP $LOGIN_STATUS)"
        echo "💡 The backend might not be properly deployed or the API routes are missing"
    else
        echo "✅ Login endpoint accessible (HTTP $LOGIN_STATUS)"
    fi
else
    echo "❌ Backend is not accessible (HTTP $HTTP_STATUS)"
    echo "💡 Check if Railway service is running"
fi

# Check Neon Database connectivity
echo ""
echo "🗄️  Testing Neon Database connectivity..."
if command -v psql &> /dev/null; then
    if psql "$NEON_DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
        echo "✅ Neon Database is accessible"
    else
        echo "❌ Neon Database connection failed"
    fi
else
    echo "⚠️  psql not found - cannot test database connection"
fi

# Check Upstash Redis connectivity
echo ""
echo "⚡ Testing Upstash Redis connectivity..."
REDIS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN" "$UPSTASH_REDIS_REST_URL/ping" 2>/dev/null)
if [ "$REDIS_STATUS" = "200" ]; then
    echo "✅ Upstash Redis is accessible"
else
    echo "❌ Upstash Redis is not accessible (HTTP $REDIS_STATUS)"
fi

echo ""
echo "🔧 Troubleshooting Commands:"
echo "1. Check Railway service status: railway status"
echo "2. View Railway logs: railway logs"
echo "3. Test login endpoint: curl -X POST $RAILWAY_BACKEND_URL/v1/auth/login"
echo "4. Test database: psql '$NEON_DATABASE_URL'"
echo "5. Test Redis: curl -H 'Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN' '$UPSTASH_REDIS_REST_URL/ping'"
echo "6. Check Railway dashboard: https://railway.app/dashboard"
echo "7. Check Neon dashboard: https://console.neon.tech"
echo "8. Check Upstash dashboard: https://console.upstash.com"
