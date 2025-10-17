# Pakistan Website Builder - Complete Infrastructure Configuration

## Overview
This project uses a multi-service infrastructure:

- **Backend**: Railway (https://website-builder-production-e38b.up.railway.app)
- **Database**: Neon PostgreSQL (ap-southeast-1 region)
- **Cache**: Upstash Redis

## Configuration Files

### 1. Railway Configuration Script
- **File**: `railway-config.sh`
- **Purpose**: Contains all Railway backend configuration variables
- **Usage**: Source this file to load Railway configuration

### 2. Frontend API Configuration
- **File**: `frontend/src/lib/api.ts`
- **Current Backend URL**: `https://website-builder-production-e38b.up.railway.app`
- **API Version**: `v1`
- **Timeout**: `10000ms`

## Environment Variables

### Backend Configuration
```bash
NEXT_PUBLIC_API_URL=https://website-builder-production-e38b.up.railway.app
NEXT_PUBLIC_BACKEND_SERVICE=railway
NEXT_PUBLIC_BACKEND_URL=https://website-builder-production-e38b.up.railway.app
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_API_TIMEOUT=10000
```

### Database Configuration (Neon PostgreSQL)
```bash
NEON_DATABASE_URL=postgresql://neondb_owner:npg_Yr6Di1pEljQB@ep-super-king-a144iv94-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NEON_DATABASE_HOST=ep-super-king-a144iv94-pooler.ap-southeast-1.aws.neon.tech
NEON_DATABASE_NAME=neondb
NEON_DATABASE_USER=neondb_owner
NEON_DATABASE_REGION=ap-southeast-1
```

### Cache Configuration (Upstash Redis)
```bash
UPSTASH_REDIS_REST_URL=https://discrete-mule-14801.upstash.io
UPSTASH_REDIS_REST_TOKEN=ATnRAAIncDI4ZmI3NTFhODJmNjQ0NTJlOTM3YzllMzFlODYwZGJiZXAyMTQ4MDE
UPSTASH_REDIS_ENABLED=true
```

## API Endpoints

### Authentication
- **Login**: `POST /v1/auth/login`
- **Register**: `POST /v1/auth/register`
- **Logout**: `POST /v1/auth/logout`
- **Profile**: `GET /v1/auth/me`

### Websites
- **List**: `GET /v1/websites`
- **Create**: `POST /v1/websites`
- **Update**: `PUT /v1/websites/{id}`
- **Delete**: `DELETE /v1/websites/{id}`
- **Publish**: `POST /v1/websites/{id}/publish`

### Templates
- **List**: `GET /v1/templates`
- **Get**: `GET /v1/templates/{id}`
- **Create**: `POST /v1/templates`

## Usage

### Loading Configuration
```bash
# Load Railway configuration
source railway-config.sh
```

### Frontend Development
The frontend automatically uses the Railway backend URL configured in `api.ts`.

### Backend Status
To check if the Railway backend is running:
```bash
curl -I https://website-builder-production-e38b.up.railway.app/v1/auth/login
```

## Service Details

### Railway Backend
- **URL**: https://website-builder-production-e38b.up.railway.app
- **Platform**: Railway
- **API Version**: v1
- **Timeout**: 10000ms

### Neon Database
- **Type**: PostgreSQL
- **Region**: ap-southeast-1 (Asia Pacific)
- **Host**: ep-super-king-a144iv94-pooler.ap-southeast-1.aws.neon.tech
- **Database**: neondb
- **User**: neondb_owner
- **SSL**: Required

### Upstash Redis
- **Type**: Redis Cache
- **REST URL**: https://discrete-mule-14801.upstash.io
- **Purpose**: Session storage, caching, rate limiting

## Troubleshooting

### Common Issues

1. **503 Service Unavailable**
   - Check if Railway backend is running
   - Verify the backend URL is correct
   - Check Railway service status

2. **404 Not Found**
   - Verify API endpoints are correct
   - Check if the backend service is deployed
   - Ensure API version is correct (`v1`)

3. **Database Connection Issues**
   - Check Neon database status
   - Verify connection string and credentials
   - Check SSL requirements

4. **Redis Cache Issues**
   - Verify Upstash Redis is accessible
   - Check REST token validity
   - Test cache connectivity

5. **Authentication Issues**
   - Check if password hashing is working correctly
   - Verify JWT token handling
   - Check CORS configuration

### Debug Commands
```bash
# Check backend health
curl -I https://website-builder-production-e38b.up.railway.app/health

# Test login endpoint
curl -X POST https://website-builder-production-e38b.up.railway.app/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Test database connection
psql 'postgresql://neondb_owner:npg_Yr6Di1pEljQB@ep-super-king-a144iv94-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

# Test Redis connection
curl -X GET "https://discrete-mule-14801.upstash.io/ping" \
  -H "Authorization: Bearer ATnRAAIncDI4ZmI3NTFhODJmNjQ0NTJlOTM3YzllMzFlODYwZGJiZXAyMTQ4MDE"
```

## Notes

- **Backend**: Hosted on Railway's platform
- **Database**: Neon PostgreSQL with SSL required
- **Cache**: Upstash Redis for session storage and caching
- **Authentication**: JWT tokens stored in localStorage
- **CORS**: Configured to allow frontend requests
- **Region**: All services optimized for Asia Pacific region
