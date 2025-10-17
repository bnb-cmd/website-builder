# Pakistan Website Builder - Complete Infrastructure Configuration
# This file contains all service configurations for the Pakistan Website Builder

# Railway Backend Configuration
export RAILWAY_BACKEND_URL="https://website-builder-production-e38b.up.railway.app"
export RAILWAY_API_VERSION="v1"
export RAILWAY_TIMEOUT="10000"

# Neon Database Configuration
export NEON_DATABASE_URL="postgresql://neondb_owner:npg_Yr6Di1pEljQB@ep-super-king-a144iv94-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
export NEON_DATABASE_HOST="ep-super-king-a144iv94-pooler.ap-southeast-1.aws.neon.tech"
export NEON_DATABASE_NAME="neondb"
export NEON_DATABASE_USER="neondb_owner"
export NEON_DATABASE_REGION="ap-southeast-1"

# Upstash Redis Configuration
export UPSTASH_REDIS_REST_URL="https://discrete-mule-14801.upstash.io"
export UPSTASH_REDIS_REST_TOKEN="ATnRAAIncDI4ZmI3NTFhODJmNjQ0NTJlOTM3YzllMzFlODYwZGJiZXAyMTQ4MDE"
export UPSTASH_REDIS_ENABLED="true"

# Frontend Configuration
export FRONTEND_PORT="3000"
export FRONTEND_HOST="localhost"

# Authentication Endpoints
export AUTH_LOGIN_ENDPOINT="/v1/auth/login"
export AUTH_REGISTER_ENDPOINT="/v1/auth/register"
export AUTH_LOGOUT_ENDPOINT="/v1/auth/logout"

# API Endpoints
export API_WEBSITES_ENDPOINT="/v1/websites"
export API_TEMPLATES_ENDPOINT="/v1/templates"
export API_USERS_ENDPOINT="/v1/users"

# Development Settings
export NODE_ENV="development"
export NEXT_PUBLIC_API_URL="$RAILWAY_BACKEND_URL"

echo "✅ Complete Infrastructure Configuration Loaded"
echo "🔗 Backend URL: $RAILWAY_BACKEND_URL"
echo "📡 API Version: $RAILWAY_API_VERSION"
echo "⏱️  Timeout: ${RAILWAY_TIMEOUT}ms"
echo "🗄️  Database: Neon PostgreSQL (ap-southeast-1)"
echo "⚡ Cache: Upstash Redis"
