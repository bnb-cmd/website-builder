# Neon Database Migration Guide

## Overview
This guide will help you run the published sites migration on your Neon PostgreSQL database.

## Prerequisites
- Neon account with a database created
- Database connection string
- Prisma CLI installed (`npm install -g prisma`)

## Step 1: Update Environment Variables

Add your Neon connection string to `.env`:

```env
# Neon Database URL
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require"

# Redis (Upstash)
REDIS_URL="redis://..."
REDIS_PASSWORD="..."

# R2 Storage
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET="pakistan-builder-published-sites"
R2_PUBLIC_URL="https://pub-xxx.r2.dev"
```

## Step 2: Verify Prisma Schema

The schema should already include the Domain model. Verify in `backend/prisma/schema.prisma`:

```prisma
model Domain {
  id          String @id @default(cuid())
  websiteId   String
  domain      String @unique
  status      String @default("PENDING")
  verified    Boolean @default(false)
  sslEnabled  Boolean @default(false)
  dnsRecords String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  website Website @relation(fields: [websiteId], references: [id], onDelete: Cascade)
  records DNSRecord[]
  
  @@map("domains")
}
```

## Step 3: Run Migration (Method 1 - Prisma Migrate)

This is the **recommended** method:

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Run pending migrations
npx prisma migrate deploy

# Verify migration
npx prisma migrate status
```

Expected output:
```
✔ Migration 20250101000000_add_published_sites applied
```

## Step 4: Alternative Method - Direct SQL Execution

If Prisma migrate doesn't work, you can run the SQL directly in Neon:

1. **Go to Neon Dashboard**: https://console.neon.tech
2. **Navigate to your project** → SQL Editor
3. **Copy and paste** the migration SQL:

```sql
-- Published sites tracking
CREATE TABLE IF NOT EXISTS published_sites (
  id TEXT PRIMARY KEY,
  website_id TEXT NOT NULL UNIQUE,
  subdomain TEXT UNIQUE,
  custom_domain TEXT UNIQUE,
  r2_path TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active',
  tier TEXT DEFAULT 'free',
  last_published TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  cache_ttl INTEGER DEFAULT 3600,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (website_id) REFERENCES websites(id) ON DELETE CASCADE
);

-- Custom domains for premium users
CREATE TABLE IF NOT EXISTS custom_domains (
  id TEXT PRIMARY KEY,
  published_site_id TEXT NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  verified BOOLEAN DEFAULT false,
  ssl_enabled BOOLEAN DEFAULT true,
  dns_records TEXT,
  verification_token TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (published_site_id) REFERENCES published_sites(id) ON DELETE CASCADE
);

-- Dynamic component registry
CREATE TABLE IF NOT EXISTS dynamic_components (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  component_type TEXT NOT NULL,
  component_path TEXT NOT NULL,
  api_endpoint TEXT,
  cache_strategy TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (site_id) REFERENCES published_sites(id) ON DELETE CASCADE
);

-- Website versions for rollback capability
CREATE TABLE IF NOT EXISTS website_versions (
  id TEXT PRIMARY KEY,
  website_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  content TEXT,
  settings TEXT,
  published_at TIMESTAMP,
  r2_path TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (website_id) REFERENCES websites(id) ON DELETE CASCADE
);

-- Add subdomain field to websites table if not exists
ALTER TABLE websites ADD COLUMN IF NOT EXISTS subdomain TEXT UNIQUE;

-- Add custom domain field to websites table if not exists
ALTER TABLE websites ADD COLUMN IF NOT EXISTS custom_domain TEXT UNIQUE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_published_sites_website_id ON published_sites(website_id);
CREATE INDEX IF NOT EXISTS idx_published_sites_subdomain ON published_sites(subdomain);
CREATE INDEX IF NOT EXISTS idx_published_sites_custom_domain ON published_sites(custom_domain);
CREATE INDEX IF NOT EXISTS idx_custom_domains_published_site_id ON custom_domains(published_site_id);
CREATE INDEX IF NOT EXISTS idx_dynamic_components_site_id ON dynamic_components(site_id);
CREATE INDEX IF NOT EXISTS idx_website_versions_website_id ON website_versions(website_id);
```

4. **Execute** the SQL
5. **Verify** tables are created

## Step 5: Verify Migration

Run this query in Neon SQL Editor to verify:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('published_sites', 'custom_domains', 'dynamic_components', 'website_versions');

-- Check columns in websites table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'websites' 
AND column_name IN ('subdomain', 'custom_domain');
```

Expected output:
```
table_name
-----------------
published_sites
custom_domains
dynamic_components
website_versions

column_name    | data_type
---------------|----------
subdomain      | text
custom_domain  | text
```

## Step 6: Update Prisma Client

After migration, regenerate the Prisma client:

```bash
cd backend
npx prisma generate
```

## Step 7: Test the Migration

Create a test script to verify:

```typescript
// test-migration.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testMigration() {
  try {
    // Test published_sites table
    const testSite = await prisma.$queryRaw`
      SELECT * FROM published_sites LIMIT 1
    `
    console.log('✓ published_sites table accessible')

    // Test custom_domains table
    const testDomain = await prisma.$queryRaw`
      SELECT * FROM custom_domains LIMIT 1
    `
    console.log('✓ custom_domains table accessible')

    // Test dynamic_components table
    const testComponent = await prisma.$queryRaw`
      SELECT * FROM dynamic_components LIMIT 1
    `
    console.log('✓ dynamic_components table accessible')

    // Test website_versions table
    const testVersion = await prisma.$queryRaw`
      SELECT * FROM website_versions LIMIT 1
    `
    console.log('✓ website_versions table accessible')

    console.log('\n✅ All tables created successfully!')
  } catch (error) {
    console.error('❌ Migration test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testMigration()
```

Run the test:
```bash
cd backend
npx ts-node test-migration.ts
```

## Troubleshooting

### Issue: "relation already exists"
**Solution**: Tables might already exist. This is fine if using `IF NOT EXISTS`.

### Issue: "permission denied"
**Solution**: Make sure your Neon user has CREATE TABLE permissions.

### Issue: "foreign key constraint"
**Solution**: Ensure the `websites` table exists before running the migration.

### Issue: "SSL connection required"
**Solution**: Add `?sslmode=require` to your connection string.

### Issue: Prisma client out of sync
**Solution**: 
```bash
npx prisma generate
npm run build
```

## Post-Migration Checklist

- [ ] All 4 tables created (published_sites, custom_domains, dynamic_components, website_versions)
- [ ] Subdomain and custom_domain columns added to websites table
- [ ] Indexes created for performance
- [ ] Prisma client regenerated
- [ ] Backend builds successfully
- [ ] Test publish workflow works

## Neon-Specific Features to Leverage

### 1. Branching
Create a preview branch for testing:
```bash
# In Neon Dashboard
Create Branch → "staging"
# Update DATABASE_URL to staging branch
```

### 2. Connection Pooling
Enable in Neon dashboard:
- Project Settings → Connection Pooling
- Use pooled connection string for production

### 3. Autoscaling
Neon automatically scales:
- Compute adjusts based on load
- Storage grows as needed
- No manual intervention required

### 4. Point-in-Time Recovery
Enable backups:
- Project Settings → Backups
- Set retention period (7-30 days)

### 5. Read Replicas (Pro plan)
For high traffic:
```env
DATABASE_URL="postgresql://..." # Primary (writes)
DATABASE_READ_URL="postgresql://..." # Replica (reads)
```

## Performance Optimization for Neon

### 1. Connection Pooling
```typescript
// In backend/src/index.ts
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['error', 'warn'],
})
```

### 2. Query Optimization
```typescript
// Use select to reduce data transfer
const websites = await prisma.website.findMany({
  select: {
    id: true,
    name: true,
    subdomain: true,
    customDomain: true,
  },
})

// Use indexes for common queries
// Already created in migration
```

### 3. Caching Strategy
```typescript
// Use Redis for frequently accessed data
await redis.setex(`website:${id}`, 3600, JSON.stringify(website))
```

## Monitoring

### Neon Dashboard Metrics:
- Query performance
- Connection count
- Storage usage
- CPU/Memory utilization

### Set up alerts:
- High connection count (>80% of limit)
- Slow queries (>1s)
- Storage approaching limit

## Cost Optimization

### Free Tier Limits (Neon):
- 3 GB storage
- 100 compute hours/month
- 1 project

### Scaling Strategy:
- Start on Free tier
- Upgrade to Pro when:
  - Storage > 2GB
  - Compute hours > 80/month
  - Need read replicas

## Support

If you encounter issues:

1. **Check Neon Status**: https://neon.tech/status
2. **Neon Docs**: https://neon.tech/docs
3. **Neon Discord**: https://discord.gg/neon
4. **Prisma Docs**: https://www.prisma.io/docs

## Summary

You now have:
- ✅ Full database schema for published sites
- ✅ Custom domain management tables
- ✅ Version control for rollbacks
- ✅ Dynamic component registry
- ✅ Optimized indexes for performance
- ✅ Neon-specific optimizations

Ready to publish websites! 🚀

