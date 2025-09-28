# Deployment Guide - Pakistan Website Builder

This guide covers deploying Pakistan Website Builder to production environments.

## 🏗️ **ARCHITECTURE OVERVIEW**

```
┌─────────────────────────────────────────────────────────────┐
│                    LOAD BALANCER / CDN                     │
│                 (Cloudflare / AWS CloudFront)              │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                     NGINX REVERSE PROXY                    │
│              (SSL Termination, Rate Limiting)              │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
┌─────────────────────────────┐ ┌─────────────────────────────┐
│        FRONTEND             │ │         BACKEND             │
│      (Next.js 14)          │ │     (Node.js 22 + Fastify) │
│    Port: 3000               │ │       Port: 3001            │
└─────────────────────────────┘ └─────────────────────────────┘
                    │                   │
                    └─────────┬─────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   PostgreSQL  │  │      Redis      │  │   File Storage  │
│    Port: 5432 │  │   Port: 6379    │  │   (Cloudinary)  │
└───────────────┘  └─────────────────┘  └─────────────────┘
```

## 🚀 **QUICK DEPLOYMENT**

### **Option 1: Docker Deployment (Recommended)**

```bash
# 1. Clone repository
git clone <repository-url>
cd pakistan-website-builder

# 2. Configure environment
cp env.example .env
# Edit .env with your production values

# 3. Deploy with Docker
./deploy.sh
```

### **Option 2: Manual Deployment**

```bash
# 1. Install dependencies
npm run install-all

# 2. Build applications
npm run build

# 3. Set up database
cd backend && npm run db:migrate:prod

# 4. Start services
npm start
```

## 🌐 **HOSTING PROVIDERS**

### **Tier 1: Premium (Best Performance)**

#### **Vercel + Railway**
```bash
# Frontend on Vercel
vercel --prod

# Backend on Railway
railway up
```

**Cost**: ~$40/month | **Setup**: 10 minutes | **Scaling**: Automatic

#### **AWS (Full Stack)**
```bash
# Deploy with AWS CDK/CloudFormation
aws cloudformation deploy --template-file aws-template.yml
```

**Cost**: $25-100/month | **Setup**: 2-4 hours | **Scaling**: Manual/Auto

### **Tier 2: Balanced (Best Value)**

#### **DigitalOcean**
```bash
# Deploy with App Platform
doctl apps create --spec digitalocean-app.yaml
```

**Cost**: $25/month | **Setup**: 30 minutes | **Scaling**: Manual

#### **Railway (Full Stack)**
```bash
# Deploy everything on Railway
railway up
```

**Cost**: $20/month | **Setup**: 15 minutes | **Scaling**: Automatic

### **Tier 3: Budget (Most Affordable)**

#### **Render**
```bash
# Deploy with Render
render-cli deploy
```

**Cost**: $7/month | **Setup**: 20 minutes | **Scaling**: Limited

## 🔧 **ENVIRONMENT CONFIGURATION**

### **Production Environment Variables**

```env
# Application
NODE_ENV=production
PORT=3001
CLIENT_URL=https://pakistanbuilder.com

# Database (Production)
DATABASE_URL="postgresql://user:password@prod-db-host:5432/website_builder"
REDIS_URL="redis://prod-redis-host:6379"

# Security
JWT_SECRET="your-production-super-secret-jwt-key-min-32-chars"

# AI Services
OPENAI_API_KEY="sk-your-openai-production-key"
ANTHROPIC_API_KEY="sk-ant-your-anthropic-production-key"

# Storage
CLOUDINARY_CLOUD_NAME="your-production-cloud-name"
CLOUDINARY_API_KEY="your-production-api-key"
CLOUDINARY_API_SECRET="your-production-api-secret"

# Payment Gateways
STRIPE_SECRET_KEY="sk_live_your-stripe-live-secret-key"
STRIPE_PUBLISHABLE_KEY="pk_live_your-stripe-live-publishable-key"
STRIPE_WEBHOOK_SECRET="whsec_your-stripe-webhook-secret"

JAZZCASH_MERCHANT_ID="your-jazzcash-live-merchant-id"
JAZZCASH_PASSWORD="your-jazzcash-live-password"

EASYPAISA_MERCHANT_ID="your-easypaisa-live-merchant-id"
EASYPAISA_PASSWORD="your-easypaisa-live-password"

# Email
RESEND_API_KEY="re_your-resend-production-key"

# Monitoring
SENTRY_DSN="your-sentry-production-dsn"

# Frontend
NEXT_PUBLIC_API_URL="https://api.pakistanbuilder.com"
NEXT_PUBLIC_APP_URL="https://pakistanbuilder.com"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_your-stripe-live-publishable-key"
```

## 🛡️ **SECURITY CHECKLIST**

### **Before Deployment**
- [ ] Change all default passwords
- [ ] Generate strong JWT secret (min 32 characters)
- [ ] Configure proper CORS origins
- [ ] Set up SSL certificates
- [ ] Enable rate limiting
- [ ] Configure firewall rules
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategy
- [ ] Test all payment gateways
- [ ] Verify email delivery

### **SSL Certificate Setup**

#### **Let's Encrypt (Free)**
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d pakistanbuilder.com -d www.pakistanbuilder.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### **Cloudflare (Recommended)**
```bash
# Set nameservers to Cloudflare
# Enable "Full (strict)" SSL mode
# Configure DNS records
```

## 📊 **MONITORING SETUP**

### **Application Monitoring**
```bash
# Start monitoring stack
docker-compose -f docker-compose.prod.yml up -d prometheus grafana

# Access dashboards
# Prometheus: http://your-domain:9090
# Grafana: http://your-domain:3001 (admin/admin)
```

### **Log Management**
```bash
# View application logs
docker-compose -f docker-compose.prod.yml logs -f backend frontend

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f backend
```

### **Database Monitoring**
```bash
# Check database health
docker-compose -f docker-compose.prod.yml exec postgres pg_isready

# Monitor connections
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"
```

## 🔄 **CONTINUOUS DEPLOYMENT**

### **GitHub Actions**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          ssh ${{ secrets.SERVER_USER }}@${{ secrets.SERVER_HOST }} "cd /app && git pull && ./deploy.sh"
```

### **GitLab CI/CD**
```yaml
# .gitlab-ci.yml
stages:
  - build
  - deploy

deploy:
  stage: deploy
  script:
    - ./deploy.sh
  only:
    - main
```

## 🗄️ **DATABASE MANAGEMENT**

### **Backups**
```bash
# Create backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres website_builder > backup.sql

# Restore backup
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres website_builder < backup.sql
```

### **Migrations**
```bash
# Run migrations
docker-compose -f docker-compose.prod.yml exec backend npm run db:migrate:prod

# Rollback migration
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate resolve --rolled-back [migration-name]
```

## 🌍 **SCALING STRATEGIES**

### **Horizontal Scaling**
```yaml
# docker-compose.scale.yml
services:
  backend:
    deploy:
      replicas: 3
  frontend:
    deploy:
      replicas: 2
```

### **Database Scaling**
```bash
# Read replicas
DATABASE_READ_URL="postgresql://user:password@read-replica:5432/website_builder"

# Connection pooling
DATABASE_URL="postgresql://user:password@pgbouncer:5432/website_builder"
```

### **CDN Configuration**
```bash
# Cloudflare settings
# Cache static assets: 1 year
# Cache HTML: 1 hour
# Cache API responses: 5 minutes
```

## 🚨 **TROUBLESHOOTING**

### **Common Issues**

#### **Service Won't Start**
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs [service-name]

# Check resource usage
docker stats

# Restart service
docker-compose -f docker-compose.prod.yml restart [service-name]
```

#### **Database Connection Issues**
```bash
# Test connection
docker-compose -f docker-compose.prod.yml exec backend npm run db:test

# Check database logs
docker-compose -f docker-compose.prod.yml logs postgres
```

#### **High Memory Usage**
```bash
# Monitor memory
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

### **Performance Optimization**
```bash
# Enable compression
# Optimize images
# Configure caching headers
# Use CDN for static assets
# Database query optimization
```

## 📈 **MAINTENANCE**

### **Regular Tasks**
- [ ] Update dependencies monthly
- [ ] Review security logs weekly
- [ ] Monitor performance metrics
- [ ] Test backup restoration
- [ ] Review error logs
- [ ] Update SSL certificates
- [ ] Database maintenance

### **Update Procedure**
```bash
# 1. Backup data
./scripts/backup.sh

# 2. Pull latest code
git pull origin main

# 3. Update dependencies
npm run install-all

# 4. Run migrations
npm run db:migrate:prod

# 5. Deploy
./deploy.sh

# 6. Test functionality
./scripts/test-production.sh
```

## 🆘 **SUPPORT**

For deployment support:
- **Email**: devops@pakistanbuilder.com
- **Documentation**: https://docs.pakistanbuilder.com/deployment
- **GitHub Issues**: https://github.com/pakistanbuilder/website-builder/issues
- **Discord**: https://discord.gg/pakistanbuilder
