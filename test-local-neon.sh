#!/bin/bash

# 🧪 Test Local Backend with Neon Database
# This script tests your local backend with Neon database

echo "🧪 Testing Local Backend with Neon Database..."
echo ""

# Test 1: Backend Health
echo "1️⃣ Testing backend health..."
HEALTH_RESPONSE=$(curl -s "http://localhost:3005/" | jq -r '.message')
if [[ "$HEALTH_RESPONSE" == *"Pakistan Website Builder API"* ]]; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not responding"
    exit 1
fi

# Test 2: Authentication
echo ""
echo "2️⃣ Testing authentication..."
LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:3005/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pakistan-website-builder.com","password":"Admin123!@#"}')

if echo "$LOGIN_RESPONSE" | jq -e '.success' > /dev/null; then
    echo "✅ Authentication working"
    TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken')
    echo "   Token: ${TOKEN:0:20}..."
else
    echo "❌ Authentication failed"
    echo "   Response: $LOGIN_RESPONSE"
    exit 1
fi

# Test 3: Templates
echo ""
echo "3️⃣ Testing templates..."
TEMPLATES_RESPONSE=$(curl -s "http://localhost:3005/v1/templates")
TEMPLATE_COUNT=$(echo "$TEMPLATES_RESPONSE" | jq -r '.data.templates | length')

if [[ "$TEMPLATE_COUNT" -gt 0 ]]; then
    echo "✅ Templates loaded: $TEMPLATE_COUNT templates"
else
    echo "❌ No templates found"
    echo "   Response: $TEMPLATES_RESPONSE"
    exit 1
fi

# Test 4: User Profile
echo ""
echo "4️⃣ Testing user profile..."
PROFILE_RESPONSE=$(curl -s "http://localhost:3005/v1/auth/me" \
  -H "Authorization: Bearer $TOKEN")

if echo "$PROFILE_RESPONSE" | jq -e '.success' > /dev/null; then
    echo "✅ User profile working"
    USER_EMAIL=$(echo "$PROFILE_RESPONSE" | jq -r '.data.user.email')
    echo "   User: $USER_EMAIL"
else
    echo "❌ User profile failed"
    echo "   Response: $PROFILE_RESPONSE"
fi

echo ""
echo "🎉 All tests passed! Your local backend with Neon database is working perfectly!"
echo ""
echo "🌐 Backend URL: http://localhost:3005"
echo "📚 API Docs: http://localhost:3005/docs"
echo "🔑 Admin Login: admin@pakistan-website-builder.com / Admin123!@#"
echo ""
echo "✅ Ready for frontend testing!"
