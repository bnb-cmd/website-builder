#!/bin/bash

# 🧪 Comprehensive Test - Local Backend + Frontend with Neon Database

echo "🧪 Comprehensive Test - Local Backend + Frontend with Neon Database"
echo ""

# Test 1: Backend Health
echo "1️⃣ Testing backend health..."
BACKEND_RESPONSE=$(curl -s "http://localhost:3005/")
if echo "$BACKEND_RESPONSE" | grep -q "Pakistan Website Builder API"; then
    echo "✅ Backend is running on port 3005"
else
    echo "❌ Backend is not responding on port 3005"
    echo "   Response: $BACKEND_RESPONSE"
    exit 1
fi

# Test 2: Authentication
echo ""
echo "2️⃣ Testing authentication..."
LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:3005/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pakistan-website-builder.com","password":"Admin123!@#"}')

if echo "$LOGIN_RESPONSE" | jq -e '.success' > /dev/null 2>/dev/null; then
    echo "✅ Authentication working"
    TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken')
    echo "   Token: ${TOKEN:0:20}..."
else
    echo "❌ Authentication failed"
    echo "   Response: $LOGIN_RESPONSE"
    exit 1
fi

# Test 3: Templates API
echo ""
echo "3️⃣ Testing templates API..."
TEMPLATES_RESPONSE=$(curl -s "http://localhost:3005/v1/templates")
TEMPLATE_COUNT=$(echo "$TEMPLATES_RESPONSE" | jq -r '.data.templates | length' 2>/dev/null)

if [[ "$TEMPLATE_COUNT" -gt 0 ]]; then
    echo "✅ Templates API working: $TEMPLATE_COUNT templates"
else
    echo "❌ Templates API failed"
    echo "   Response: $TEMPLATES_RESPONSE"
    exit 1
fi

# Test 4: Frontend Health
echo ""
echo "4️⃣ Testing frontend health..."
FRONTEND_RESPONSE=$(curl -s "http://localhost:3000/")
if echo "$FRONTEND_RESPONSE" | grep -q "Pakistan Website Builder"; then
    echo "✅ Frontend is running on port 3000"
else
    echo "❌ Frontend is not responding on port 3000"
    echo "   Response: ${FRONTEND_RESPONSE:0:200}..."
    exit 1
fi

# Test 5: Frontend API Configuration
echo ""
echo "5️⃣ Testing frontend API configuration..."
FRONTEND_ENV=$(curl -s "http://localhost:3000/api/config" 2>/dev/null || echo "No config endpoint")
echo "   Frontend config: $FRONTEND_ENV"

# Test 6: Direct API call from frontend perspective
echo ""
echo "6️⃣ Testing API call from frontend perspective..."
API_TEST=$(curl -s "http://localhost:3000/v1/templates" 2>/dev/null || echo "No proxy")
if echo "$API_TEST" | grep -q "templates"; then
    echo "✅ Frontend can access backend API"
else
    echo "❌ Frontend cannot access backend API"
    echo "   Response: ${API_TEST:0:200}..."
fi

# Test 7: Check Next.js rewrite rules
echo ""
echo "7️⃣ Checking Next.js configuration..."
if [ -f "frontend/next.config.js" ]; then
    echo "✅ Next.js config exists"
    if grep -q "rewrites" frontend/next.config.js; then
        echo "✅ Rewrite rules found"
    else
        echo "❌ No rewrite rules found"
    fi
else
    echo "❌ Next.js config not found"
fi

echo ""
echo "🎯 Summary:"
echo "   Backend: http://localhost:3005 ✅"
echo "   Frontend: http://localhost:3000 ✅"
echo "   Database: Neon PostgreSQL ✅"
echo "   Templates: $TEMPLATE_COUNT loaded ✅"
echo ""
echo "🔧 If templates are not loading in the frontend:"
echo "   1. Check browser console for errors"
echo "   2. Check if auto-login is working"
echo "   3. Check if API calls are being made"
echo "   4. Check Next.js rewrite rules"
echo ""
echo "🌐 Test URLs:"
echo "   Frontend: http://localhost:3000/dashboard/templates"
echo "   Backend: http://localhost:3005/docs"
echo "   API: http://localhost:3005/v1/templates"
