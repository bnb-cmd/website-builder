# Cost Monitoring & Optimization Guide

This guide helps you monitor and optimize costs for your website builder deployment across all services.

---

## Cost Overview

### Current Architecture Costs

| Service | Free Tier | Paid Tier | Usage-Based |
|---------|-----------|-----------|-------------|
| **Cloudflare Pages** | Unlimited | $0 | $0 |
| **Railway Backend** | 500 hours | $5/month | $0.000463/hour |
| **Neon Database** | 0.5GB | $19/month | $0.10/GB |
| **Upstash Redis** | 10k commands/day | $0.20/100k commands | $0.20/100k commands |
| **Cloudflare R2** | 10GB | $0.015/GB | $0.015/GB |

### Cost Projections by User Scale

| Users | Monthly Cost | Breakdown |
|-------|--------------|-----------|
| **0-100** | $5.50 | Railway $5 + R2 $0.50 |
| **100-1,000** | $5.50-8 | Railway $5 + R2 $0.50-3 |
| **1,000-5,000** | $8-27 | Railway $5-20 + R2 $3 + Redis $0-5 |
| **5,000-10,000** | $27-62 | Railway $20 + Neon $19 + R2 $5 + Redis $5 |
| **10,000+** | $62-150 | Railway $20 + Neon $19 + R2 $10 + Redis $10 + AI $20-100 |

---

## 1. Railway Cost Monitoring

### 1.1 Set Up Usage Alerts

1. Go to Railway dashboard
2. Click **"Usage"** tab
3. Set up billing alerts:
   - **$5** (current plan limit)
   - **$10** (upgrade threshold)
   - **$20** (scale threshold)

### 1.2 Monitor Resource Usage

```bash
# Check Railway usage via CLI
railway status
railway logs --follow
```

### 1.3 Cost Optimization Tips

**Current Usage (Hobby Plan - $5/month):**
- 500 execution hours/month
- 512MB RAM
- Shared CPU

**When to Upgrade to Pro ($20/month):**
- Consistently using >400 hours/month
- Need more RAM (>512MB)
- Need dedicated CPU
- Need better performance

**Optimization Strategies:**
```typescript
// 1. Implement request caching
app.use('/api/v1/templates', cache('5 minutes'))

// 2. Use database connection pooling
DATABASE_URL="postgresql://user:pass@host/db?pgbouncer=true"

// 3. Optimize API responses
app.use(compression()) // Enable gzip compression

// 4. Implement rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}))
```

---

## 2. Neon Database Cost Monitoring

### 2.1 Monitor Database Usage

```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size(current_database()));

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check connection count
SELECT count(*) as active_connections 
FROM pg_stat_activity 
WHERE state = 'active';
```

### 2.2 Cost Optimization

**Free Tier (0.5GB):**
- Perfect for 0-5,000 users
- Auto-pause when idle
- No time limits

**Pro Tier ($19/month):**
- 10GB storage
- Unlimited compute
- Better performance
- Point-in-time recovery

**Optimization Strategies:**
```sql
-- 1. Clean up old data
DELETE FROM ai_generations WHERE created_at < NOW() - INTERVAL '30 days';
DELETE FROM website_analytics WHERE date < NOW() - INTERVAL '90 days';

-- 2. Optimize indexes
CREATE INDEX CONCURRENTLY idx_websites_user_id ON websites(user_id);
CREATE INDEX CONCURRENTLY idx_pages_website_id ON pages(website_id);

-- 3. Use connection pooling
-- Already configured with ?pgbouncer=true

-- 4. Archive old data
CREATE TABLE ai_generations_archive AS 
SELECT * FROM ai_generations 
WHERE created_at < NOW() - INTERVAL '90 days';
```

---

## 3. Upstash Redis Cost Monitoring

### 3.1 Monitor Command Usage

1. Go to Upstash dashboard
2. Click on your database
3. Go to **"Metrics"** tab
4. Monitor daily command count

### 3.2 Cost Optimization

**Free Tier (10,000 commands/day):**
- Supports ~50-100 daily active users
- Perfect for starting out

**Pay-as-you-go ($0.20/100k commands):**
- Scales automatically
- Still very cheap

**Optimization Strategies:**
```typescript
// 1. Cache aggressively
const cacheKey = `template:${templateId}`
let template = await redis.get(cacheKey)

if (!template) {
  template = await db.template.findUnique({ where: { id: templateId } })
  await redis.setex(cacheKey, 3600, JSON.stringify(template)) // 1 hour cache
}

// 2. Use batch operations
const pipeline = redis.pipeline()
pipeline.set('key1', 'value1')
pipeline.set('key2', 'value2')
pipeline.set('key3', 'value3')
await pipeline.exec() // Single command

// 3. Set appropriate TTLs
await redis.setex('user:session', 86400, sessionData) // 24 hours
await redis.setex('template:list', 3600, templateList) // 1 hour
await redis.setex('ai:result', 1800, aiResult) // 30 minutes

// 4. Use in-memory cache for non-critical data
const inMemoryCache = new Map()
if (inMemoryCache.has(key)) {
  return inMemoryCache.get(key)
}
```

---

## 4. Cloudflare R2 Cost Monitoring

### 4.1 Monitor Storage Usage

1. Go to Cloudflare dashboard
2. Navigate to **R2 Object Storage**
3. Click on your bucket
4. Check **"Usage"** tab

### 4.2 Cost Optimization

**Free Tier (10GB):**
- Perfect for 0-1,000 users
- No egress fees to Cloudflare

**Pay-as-you-go ($0.015/GB):**
- Very cheap storage
- No egress fees

**Optimization Strategies:**
```typescript
// 1. Compress images before upload
import sharp from 'sharp'

const compressedImage = await sharp(buffer)
  .jpeg({ quality: 80 })
  .resize(1920, 1080, { fit: 'inside' })
  .toBuffer()

// 2. Use appropriate image formats
const webpImage = await sharp(buffer)
  .webp({ quality: 80 })
  .toBuffer()

// 3. Implement image cleanup
async function cleanupOldImages() {
  const oldImages = await db.mediaAsset.findMany({
    where: {
      createdAt: { lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
      status: 'ARCHIVED'
    }
  })
  
  for (const image of oldImages) {
    await r2Storage.deleteFile(image.key)
    await db.mediaAsset.delete({ where: { id: image.id } })
  }
}

// 4. Use CDN caching
app.use('/assets', express.static('public', {
  maxAge: '1y', // Cache for 1 year
  etag: true
}))
```

---

## 5. AI Services Cost Monitoring

### 5.1 OpenAI Cost Monitoring

1. Go to OpenAI dashboard
2. Navigate to **Usage**
3. Set up usage alerts:
   - **$5** (starter limit)
   - **$10** (comfortable limit)
   - **$20** (maximum limit)

### 5.2 Cost Optimization

**GPT-3.5-turbo (Recommended):**
- $0.0015/1k tokens input
- $0.002/1k tokens output
- ~$0.001 per generation

**GPT-4 (Expensive):**
- $0.03/1k tokens input
- $0.06/1k tokens output
- ~$0.02 per generation

**Optimization Strategies:**
```typescript
// 1. Cache AI responses
const cacheKey = `ai:${hash(prompt)}`
let response = await redis.get(cacheKey)

if (!response) {
  response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo', // Use cheaper model
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 500, // Limit response length
    temperature: 0.7
  })
  await redis.setex(cacheKey, 86400, JSON.stringify(response)) // Cache for 24 hours
}

// 2. Batch similar requests
const prompts = ['prompt1', 'prompt2', 'prompt3']
const responses = await Promise.all(
  prompts.map(prompt => 
    openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    })
  )
)

// 3. Use shorter prompts
const shortPrompt = `Generate a ${type} for ${businessType} in ${language}`
// Instead of long, detailed prompts

// 4. Implement usage limits per user
const userUsage = await redis.get(`ai:usage:${userId}`)
if (userUsage && parseInt(userUsage) > 100) {
  throw new Error('AI usage limit exceeded')
}
```

---

## 6. Automated Cost Monitoring

### 6.1 Create Monitoring Script

Create `scripts/cost-monitor.js`:

```javascript
const { PrismaClient } = require('@prisma/client')
const { Redis } = require('@upstash/redis')

const prisma = new PrismaClient()
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

async function monitorCosts() {
  console.log('📊 Cost Monitoring Report')
  console.log('========================')
  
  // Database size
  const dbSize = await prisma.$queryRaw`
    SELECT pg_size_pretty(pg_database_size(current_database())) as size
  `
  console.log(`Database size: ${dbSize[0].size}`)
  
  // Redis usage (approximate)
  const redisInfo = await redis.info()
  console.log(`Redis memory usage: ${redisInfo.used_memory_human}`)
  
  // User counts
  const userCount = await prisma.user.count()
  const websiteCount = await prisma.website.count()
  const aiGenerationCount = await prisma.aIGeneration.count()
  
  console.log(`Users: ${userCount}`)
  console.log(`Websites: ${websiteCount}`)
  console.log(`AI Generations: ${aiGenerationCount}`)
  
  // Cost estimates
  const estimatedCosts = {
    railway: userCount > 1000 ? 20 : 5,
    neon: dbSize[0].size.includes('GB') && parseFloat(dbSize[0].size) > 0.5 ? 19 : 0,
    redis: aiGenerationCount > 10000 ? 5 : 0,
    r2: websiteCount > 100 ? 3 : 0.5,
    ai: aiGenerationCount * 0.001
  }
  
  const totalCost = Object.values(estimatedCosts).reduce((a, b) => a + b, 0)
  
  console.log('\n💰 Estimated Monthly Costs:')
  console.log(`Railway: $${estimatedCosts.railway}`)
  console.log(`Neon: $${estimatedCosts.neon}`)
  console.log(`Redis: $${estimatedCosts.redis}`)
  console.log(`R2: $${estimatedCosts.r2}`)
  console.log(`AI: $${estimatedCosts.ai.toFixed(2)}`)
  console.log(`Total: $${totalCost.toFixed(2)}`)
  
  // Alerts
  if (totalCost > 50) {
    console.log('\n⚠️  High cost alert! Consider optimization.')
  }
  
  if (userCount > 5000) {
    console.log('\n📈 Scale alert! Consider upgrading services.')
  }
}

monitorCosts()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

### 6.2 Set Up Cron Job

```bash
# Add to crontab (run daily at 9 AM)
0 9 * * * cd /path/to/project && node scripts/cost-monitor.js
```

---

## 7. Cost Optimization Checklist

### 7.1 Immediate Optimizations (0-1,000 users)

- [ ] Use in-memory Redis (current setup)
- [ ] Enable gzip compression
- [ ] Implement request caching
- [ ] Optimize database queries
- [ ] Use CDN for static assets
- [ ] Set up rate limiting

### 7.2 Growth Optimizations (1,000-5,000 users)

- [ ] Add Upstash Redis ($0-5/month)
- [ ] Implement aggressive caching
- [ ] Optimize AI usage (cache responses)
- [ ] Clean up old data regularly
- [ ] Use connection pooling
- [ ] Monitor and alert on usage

### 7.3 Scale Optimizations (5,000+ users)

- [ ] Upgrade Railway to Pro ($20/month)
- [ ] Upgrade Neon to Pro ($19/month)
- [ ] Implement read replicas
- [ ] Use Redis clustering
- [ ] Implement data archiving
- [ ] Set up automated scaling

---

## 8. Emergency Cost Control

### 8.1 Immediate Actions

```bash
# Stop all services
railway down
# Or pause Neon database
# Or disable AI features temporarily
```

### 8.2 Cost Control Script

Create `scripts/cost-control.js`:

```javascript
// Emergency cost control
async function emergencyCostControl() {
  // Disable AI features
  await redis.set('ai:disabled', 'true', { ex: 3600 }) // 1 hour
  
  // Enable aggressive caching
  await redis.set('cache:aggressive', 'true', { ex: 86400 }) // 24 hours
  
  // Reduce rate limits
  await redis.set('rate:limit:reduced', 'true', { ex: 86400 }) // 24 hours
  
  console.log('🚨 Emergency cost control activated')
}
```

---

## 9. Cost Reporting

### 9.1 Weekly Cost Report

Create `scripts/weekly-report.js`:

```javascript
async function generateWeeklyReport() {
  const report = {
    week: new Date().toISOString().split('T')[0],
    users: await prisma.user.count(),
    websites: await prisma.website.count(),
    aiGenerations: await prisma.aIGeneration.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    }),
    estimatedCost: calculateEstimatedCost()
  }
  
  console.log('📊 Weekly Cost Report:', JSON.stringify(report, null, 2))
  
  // Send to monitoring service (optional)
  // await sendToMonitoring(report)
}
```

---

## 10. Scaling Decision Matrix

| Metric | Action | Cost Impact |
|--------|--------|-------------|
| **>400 Railway hours/month** | Upgrade to Pro | +$15/month |
| **>0.5GB database** | Upgrade Neon | +$19/month |
| **>8k Redis commands/day** | Monitor closely | +$0-5/month |
| **>100GB R2 storage** | Optimize images | +$1-3/month |
| **>1k AI generations/month** | Cache responses | +$1-5/month |
| **>5k users** | Full optimization | +$20-50/month |

---

## Summary

**Current Setup Cost: $5.50/month** (0-1,000 users)
**Optimized Setup Cost: $8-27/month** (1,000-5,000 users)
**Scale Setup Cost: $50-150/month** (5,000+ users)

**Key Optimization Principles:**
1. **Cache everything** (Redis, CDN, browser)
2. **Monitor usage** (set up alerts)
3. **Optimize queries** (indexes, connection pooling)
4. **Clean up data** (archive old records)
5. **Use appropriate tiers** (don't over-provision)

**Remember:** Start small, monitor closely, optimize continuously!
