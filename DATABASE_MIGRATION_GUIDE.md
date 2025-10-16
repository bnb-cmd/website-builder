# Database Migration & Seeding Guide

This guide covers setting up your PostgreSQL database with Prisma, running migrations, and seeding initial data.

---

## Prerequisites

- Neon PostgreSQL database ✅ (you have this)
- Railway backend deployed ✅ (you have this)
- Environment variables configured ✅

---

## 1. Database Connection Setup

### 1.1 Verify Database Connection

Your Neon connection string should look like:
```
postgresql://username:password@host:port/database?pgbouncer=true&connect_timeout=15
```

### 1.2 Test Connection

```bash
cd backend
npx prisma db pull
```

This will verify your database connection and show the current schema.

---

## 2. Running Migrations

### 2.1 Generate Migration (if needed)

If you've made schema changes:

```bash
cd backend
npx prisma migrate dev --name your-migration-name
```

### 2.2 Deploy Migrations to Production

```bash
cd backend
npx prisma migrate deploy
```

This will:
- Apply all pending migrations
- Update the database schema
- Not affect existing data

### 2.3 Verify Migration Status

```bash
npx prisma migrate status
```

Should show all migrations as "Applied".

---

## 3. Database Seeding

### 3.1 Create Seed Script

Create `backend/prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // 1. Create default subscription plans
  console.log('📋 Creating subscription plans...')
  
  const freePlan = await prisma.subscription.upsert({
    where: { slug: 'free' },
    update: {},
    create: {
      name: 'Free Plan',
      description: 'Perfect for getting started',
      slug: 'free',
      tier: 'FREE',
      price: 0,
      currency: 'PKR',
      interval: 'MONTHLY',
      maxWebsites: 1,
      maxPages: 5,
      maxProducts: 0,
      maxStorage: 100, // MB
      customDomain: false,
      aiGenerations: 10,
      prioritySupport: false,
      whiteLabel: false,
      apiAccess: false,
      analytics: true,
      seoTools: false,
      ecommerce: false,
      marketing: false,
      integrations: 3,
    },
  })

  const proPlan = await prisma.subscription.upsert({
    where: { slug: 'pro' },
    update: {},
    create: {
      name: 'Pro Plan',
      description: 'For growing businesses',
      slug: 'pro',
      tier: 'PRO',
      price: 2999, // PKR
      currency: 'PKR',
      interval: 'MONTHLY',
      maxWebsites: 5,
      maxPages: 50,
      maxProducts: 100,
      maxStorage: 1000, // MB
      customDomain: true,
      aiGenerations: 1000,
      prioritySupport: true,
      whiteLabel: false,
      apiAccess: true,
      analytics: true,
      seoTools: true,
      ecommerce: true,
      marketing: true,
      integrations: 10,
    },
  })

  const agencyPlan = await prisma.subscription.upsert({
    where: { slug: 'agency' },
    update: {},
    create: {
      name: 'Agency Plan',
      description: 'For agencies and enterprises',
      slug: 'agency',
      tier: 'AGENCY',
      price: 9999, // PKR
      currency: 'PKR',
      interval: 'MONTHLY',
      maxWebsites: 50,
      maxPages: 500,
      maxProducts: 1000,
      maxStorage: 10000, // MB
      customDomain: true,
      aiGenerations: 10000,
      prioritySupport: true,
      whiteLabel: true,
      apiAccess: true,
      analytics: true,
      seoTools: true,
      ecommerce: true,
      marketing: true,
      integrations: 50,
    },
  })

  console.log('✅ Subscription plans created')

  // 2. Create default templates
  console.log('🎨 Creating default templates...')

  const templates = [
    {
      name: 'Restaurant Template',
      description: 'Perfect for restaurants and cafes',
      category: 'RESTAURANT',
      businessType: 'RESTAURANT',
      language: 'ENGLISH',
      content: JSON.stringify({
        sections: [
          {
            type: 'hero',
            title: 'Welcome to Our Restaurant',
            subtitle: 'Delicious food, great atmosphere',
            image: '/images/restaurant-hero.jpg'
          },
          {
            type: 'menu',
            title: 'Our Menu',
            items: [
              { name: 'Pasta', price: 'Rs. 500', description: 'Fresh pasta with tomato sauce' },
              { name: 'Pizza', price: 'Rs. 800', description: 'Wood-fired pizza with fresh toppings' }
            ]
          }
        ]
      }),
      styles: JSON.stringify({
        primaryColor: '#8B4513',
        secondaryColor: '#F4A460',
        fontFamily: 'Inter, sans-serif'
      }),
      assets: 'restaurant-hero.jpg,menu-bg.jpg',
      previewImage: '/images/templates/restaurant-preview.jpg',
      thumbnail: '/images/templates/restaurant-thumb.jpg',
      isPremium: false,
      tags: 'restaurant,food,menu,dining',
      features: 'menu,contact,location,gallery',
      responsive: true,
    },
    {
      name: 'E-commerce Store',
      description: 'Complete online store template',
      category: 'ECOMMERCE',
      businessType: 'RETAIL',
      language: 'ENGLISH',
      content: JSON.stringify({
        sections: [
          {
            type: 'hero',
            title: 'Shop Now',
            subtitle: 'Quality products at great prices',
            image: '/images/shop-hero.jpg'
          },
          {
            type: 'products',
            title: 'Featured Products',
            products: [
              { name: 'Product 1', price: 'Rs. 1000', image: '/images/product1.jpg' },
              { name: 'Product 2', price: 'Rs. 1500', image: '/images/product2.jpg' }
            ]
          }
        ]
      }),
      styles: JSON.stringify({
        primaryColor: '#2563EB',
        secondaryColor: '#1E40AF',
        fontFamily: 'Inter, sans-serif'
      }),
      assets: 'shop-hero.jpg,product1.jpg,product2.jpg',
      previewImage: '/images/templates/ecommerce-preview.jpg',
      thumbnail: '/images/templates/ecommerce-thumb.jpg',
      isPremium: true,
      tags: 'ecommerce,shop,products,store',
      features: 'products,cart,checkout,payments',
      responsive: true,
    },
    {
      name: 'Portfolio Template',
      description: 'Showcase your work and skills',
      category: 'PORTFOLIO',
      businessType: 'SERVICE',
      language: 'ENGLISH',
      content: JSON.stringify({
        sections: [
          {
            type: 'hero',
            title: 'John Doe',
            subtitle: 'Web Developer & Designer',
            image: '/images/portfolio-hero.jpg'
          },
          {
            type: 'projects',
            title: 'My Work',
            projects: [
              { name: 'Project 1', description: 'A beautiful website', image: '/images/project1.jpg' },
              { name: 'Project 2', description: 'Mobile app design', image: '/images/project2.jpg' }
            ]
          }
        ]
      }),
      styles: JSON.stringify({
        primaryColor: '#7C3AED',
        secondaryColor: '#5B21B6',
        fontFamily: 'Inter, sans-serif'
      }),
      assets: 'portfolio-hero.jpg,project1.jpg,project2.jpg',
      previewImage: '/images/templates/portfolio-preview.jpg',
      thumbnail: '/images/templates/portfolio-thumb.jpg',
      isPremium: false,
      tags: 'portfolio,personal,work,projects',
      features: 'projects,contact,about,skills',
      responsive: true,
    }
  ]

  for (const template of templates) {
    await prisma.template.upsert({
      where: { name: template.name },
      update: {},
      create: template,
    })
  }

  console.log('✅ Templates created')

  // 3. Create default image library entries
  console.log('🖼️ Creating image library...')

  const imageLibrary = [
    {
      name: 'Business Meeting',
      category: 'business',
      tags: 'business,meeting,office,professional',
      url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43',
      thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300',
      width: 1920,
      height: 1080,
      source: 'unsplash',
      license: 'free',
      isPremium: false,
    },
    {
      name: 'Restaurant Interior',
      category: 'restaurant',
      tags: 'restaurant,food,dining,interior',
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
      thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300',
      width: 1920,
      height: 1080,
      source: 'unsplash',
      license: 'free',
      isPremium: false,
    },
    {
      name: 'E-commerce Products',
      category: 'ecommerce',
      tags: 'products,shopping,ecommerce,retail',
      url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
      thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300',
      width: 1920,
      height: 1080,
      source: 'unsplash',
      license: 'free',
      isPremium: false,
    }
  ]

  for (const image of imageLibrary) {
    await prisma.imageLibrary.upsert({
      where: { url: image.url },
      update: {},
      create: image,
    })
  }

  console.log('✅ Image library created')

  // 4. Create default integrations
  console.log('🔌 Creating integrations...')

  const integrations = [
    {
      name: 'Google Analytics',
      description: 'Track website traffic and user behavior',
      category: 'ANALYTICS',
      provider: 'GOOGLE',
      authType: 'OAUTH2',
      status: 'ACTIVE',
      version: '4.0',
      documentation: 'https://developers.google.com/analytics',
      iconUrl: 'https://www.google.com/analytics/favicon.ico',
    },
    {
      name: 'Facebook Pixel',
      description: 'Track conversions and create custom audiences',
      category: 'MARKETING',
      provider: 'FACEBOOK',
      authType: 'API_KEY',
      status: 'ACTIVE',
      version: '1.0',
      documentation: 'https://developers.facebook.com/docs/facebook-pixel',
      iconUrl: 'https://www.facebook.com/favicon.ico',
    },
    {
      name: 'Mailchimp',
      description: 'Email marketing and automation',
      category: 'EMAIL',
      provider: 'MAILCHIMP',
      authType: 'API_KEY',
      status: 'ACTIVE',
      version: '3.0',
      documentation: 'https://mailchimp.com/developer',
      iconUrl: 'https://mailchimp.com/favicon.ico',
    }
  ]

  for (const integration of integrations) {
    await prisma.integration.upsert({
      where: { name: integration.name },
      update: {},
      create: integration,
    })
  }

  console.log('✅ Integrations created')

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### 3.2 Update package.json

Add seed script to `backend/package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

### 3.3 Run Seeding

```bash
cd backend
npx prisma db seed
```

---

## 4. Database Maintenance

### 4.1 Regular Backups

Neon automatically handles backups, but you can also:

```bash
# Export data
npx prisma db pull
pg_dump $DATABASE_URL > backup.sql

# Import data
psql $DATABASE_URL < backup.sql
```

### 4.2 Monitor Database Size

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
```

### 4.3 Performance Optimization

```sql
-- Create indexes for common queries
CREATE INDEX CONCURRENTLY idx_websites_user_id ON websites(user_id);
CREATE INDEX CONCURRENTLY idx_pages_website_id ON pages(website_id);
CREATE INDEX CONCURRENTLY idx_products_website_id ON products(website_id);
CREATE INDEX CONCURRENTLY idx_orders_website_id ON orders(website_id);
CREATE INDEX CONCURRENTLY idx_ai_generations_user_id ON ai_generations(user_id);

-- Full-text search indexes
CREATE INDEX CONCURRENTLY idx_templates_search ON templates USING gin(to_tsvector('english', name || ' ' || description));
CREATE INDEX CONCURRENTLY idx_image_library_search ON image_library USING gin(to_tsvector('english', name || ' ' || tags));
```

---

## 5. Production Considerations

### 5.1 Connection Pooling

Your Neon connection string already includes `pgbouncer=true` for connection pooling.

### 5.2 Monitoring

Set up monitoring for:
- Database connections
- Query performance
- Storage usage
- Backup status

### 5.3 Scaling

When you need to scale:
- Upgrade Neon plan (Pro: $19/month)
- Add read replicas
- Implement caching strategies
- Optimize queries

---

## 6. Troubleshooting

### Common Issues:

**Migration fails:**
```bash
# Reset and retry
npx prisma migrate reset
npx prisma migrate deploy
```

**Seeding fails:**
```bash
# Check for duplicate data
npx prisma studio
```

**Connection issues:**
```bash
# Test connection
npx prisma db pull
```

**Performance issues:**
- Check slow query log
- Add missing indexes
- Optimize queries
- Consider read replicas

---

## 7. Next Steps

After successful setup:

1. **Test all CRUD operations**
2. **Set up monitoring**
3. **Create backup procedures**
4. **Document your schema changes**
5. **Set up staging environment**

**Estimated setup time: 10-15 minutes**
