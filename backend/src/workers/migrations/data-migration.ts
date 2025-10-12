#!/usr/bin/env node

/**
 * Data Migration Script: PostgreSQL to D1
 * Migrates existing data from PostgreSQL (via Prisma) to Cloudflare D1
 */

import { PrismaClient } from '@prisma/client'
import { initDB } from './lib/db'

interface MigrationConfig {
  sourceDb: PrismaClient
  targetDb: any // D1 adapter
  batchSize: number
}

class DataMigrator {
  private config: MigrationConfig

  constructor(config: MigrationConfig) {
    this.config = config
  }

  async migrateUsers(): Promise<void> {
    console.log('🔄 Migrating users...')
    
    const users = await this.config.sourceDb.user.findMany()
    console.log(`Found ${users.length} users to migrate`)

    for (const user of users) {
      try {
        await this.config.targetDb.execute(
          `INSERT INTO users (
            id, email, name, password, phone, avatar, role, status,
            business_type, city, company_name, preferred_language,
            ai_quota_used, ai_quota_reset_at, created_at, updated_at, last_login_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            user.id,
            user.email,
            user.name,
            user.password,
            user.phone,
            user.avatar,
            user.role,
            user.status,
            user.businessType,
            user.city,
            user.companyName,
            user.preferredLanguage,
            user.aiQuotaUsed,
            user.aiQuotaResetAt?.toISOString(),
            user.createdAt.toISOString(),
            user.updatedAt.toISOString(),
            user.lastLoginAt?.toISOString()
          ]
        )
        console.log(`✅ Migrated user: ${user.email}`)
      } catch (error) {
        console.error(`❌ Failed to migrate user ${user.email}:`, error)
      }
    }
  }

  async migrateWebsites(): Promise<void> {
    console.log('🔄 Migrating websites...')
    
    const websites = await this.config.sourceDb.website.findMany({
      include: { user: true }
    })
    console.log(`Found ${websites.length} websites to migrate`)

    for (const website of websites) {
      try {
        await this.config.targetDb.execute(
          `INSERT INTO websites (
            id, name, description, status, content, settings, custom_css, custom_js,
            subdomain, custom_domain, business_type, language, template_id,
            meta_title, meta_description, meta_keywords, user_id,
            created_at, updated_at, published_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            website.id,
            website.name,
            website.description,
            website.status,
            website.content,
            website.settings,
            website.customCSS,
            website.customJS,
            website.subdomain,
            website.customDomain,
            website.businessType,
            website.language,
            website.templateId,
            website.metaTitle,
            website.metaDescription,
            website.metaKeywords,
            website.userId,
            website.createdAt.toISOString(),
            website.updatedAt.toISOString(),
            website.publishedAt?.toISOString()
          ]
        )
        console.log(`✅ Migrated website: ${website.name}`)
      } catch (error) {
        console.error(`❌ Failed to migrate website ${website.name}:`, error)
      }
    }
  }

  async migratePages(): Promise<void> {
    console.log('🔄 Migrating pages...')
    
    const pages = await this.config.sourceDb.page.findMany({
      include: { website: true }
    })
    console.log(`Found ${pages.length} pages to migrate`)

    for (const page of pages) {
      try {
        await this.config.targetDb.execute(
          `INSERT INTO pages (
            id, website_id, name, slug, content, settings, is_home, order_index,
            meta_title, meta_description, meta_keywords, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            page.id,
            page.websiteId,
            page.name,
            page.slug,
            page.content,
            page.settings,
            page.isHome,
            page.order,
            page.metaTitle,
            page.metaDescription,
            page.metaKeywords,
            page.createdAt.toISOString(),
            page.updatedAt.toISOString()
          ]
        )
        console.log(`✅ Migrated page: ${page.name}`)
      } catch (error) {
        console.error(`❌ Failed to migrate page ${page.name}:`, error)
      }
    }
  }

  async migrateTemplates(): Promise<void> {
    console.log('🔄 Migrating templates...')
    
    const templates = await this.config.sourceDb.template.findMany()
    console.log(`Found ${templates.length} templates to migrate`)

    for (const template of templates) {
      try {
        await this.config.targetDb.execute(
          `INSERT INTO templates (
            id, name, description, category, business_type, language, content, styles,
            assets, preview_image, thumbnail, hero_image_url, demo_images,
            is_global, parent_template_id, localized_for, is_premium, price,
            status, tags, features, responsive, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            template.id,
            template.name,
            template.description,
            template.category,
            template.businessType,
            template.language,
            template.content,
            template.styles,
            template.assets,
            template.previewImage,
            template.thumbnail,
            template.heroImageUrl,
            template.demoImages,
            template.isGlobal,
            template.parentTemplateId,
            template.localizedFor,
            template.isPremium,
            template.price?.toString(),
            template.status,
            template.tags,
            template.features,
            template.responsive,
            template.createdAt.toISOString(),
            template.updatedAt.toISOString()
          ]
        )
        console.log(`✅ Migrated template: ${template.name}`)
      } catch (error) {
        console.error(`❌ Failed to migrate template ${template.name}:`, error)
      }
    }
  }

  async migrateMediaAssets(): Promise<void> {
    console.log('🔄 Migrating media assets...')
    
    const assets = await this.config.sourceDb.mediaAsset.findMany({
      include: { website: true, user: true }
    })
    console.log(`Found ${assets.length} media assets to migrate`)

    for (const asset of assets) {
      try {
        await this.config.targetDb.execute(
          `INSERT INTO media_assets (
            id, website_id, user_id, name, type, url, thumbnail, size, mime_type,
            width, height, duration, metadata, tags, ai_generated, ai_prompt,
            status, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            asset.id,
            asset.websiteId,
            asset.userId,
            asset.name,
            asset.type,
            asset.url,
            asset.thumbnail,
            asset.size,
            asset.mimeType,
            asset.width,
            asset.height,
            asset.duration,
            asset.metadata,
            asset.tags,
            asset.aiGenerated,
            asset.aiPrompt,
            asset.status,
            asset.createdAt.toISOString(),
            asset.updatedAt.toISOString()
          ]
        )
        console.log(`✅ Migrated media asset: ${asset.name}`)
      } catch (error) {
        console.error(`❌ Failed to migrate media asset ${asset.name}:`, error)
      }
    }
  }

  async migrateProducts(): Promise<void> {
    console.log('🔄 Migrating products...')
    
    const products = await this.config.sourceDb.product.findMany({
      include: { website: true }
    })
    console.log(`Found ${products.length} products to migrate`)

    for (const product of products) {
      try {
        await this.config.targetDb.execute(
          `INSERT INTO products (
            id, website_id, name, description, price, compare_price, sku,
            track_inventory, inventory, low_stock_threshold, allow_backorder,
            images, videos, meta_title, meta_description, meta_keywords,
            status, has_variants, variants, weight, dimensions,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            product.id,
            product.websiteId,
            product.name,
            product.description,
            product.price?.toString(),
            product.comparePrice?.toString(),
            product.sku,
            product.trackInventory,
            product.inventory,
            product.lowStockThreshold,
            product.allowBackorder,
            product.images,
            product.videos,
            product.metaTitle,
            product.metaDescription,
            product.metaKeywords,
            product.status,
            product.hasVariants,
            product.variants,
            product.weight?.toString(),
            product.dimensions,
            product.createdAt.toISOString(),
            product.updatedAt.toISOString()
          ]
        )
        console.log(`✅ Migrated product: ${product.name}`)
      } catch (error) {
        console.error(`❌ Failed to migrate product ${product.name}:`, error)
      }
    }
  }

  async migratePayments(): Promise<void> {
    console.log('🔄 Migrating payments...')
    
    const payments = await this.config.sourceDb.payment.findMany({
      include: { user: true, subscription: true }
    })
    console.log(`Found ${payments.length} payments to migrate`)

    for (const payment of payments) {
      try {
        await this.config.targetDb.execute(
          `INSERT INTO payments (
            id, user_id, subscription_id, purpose, amount, currency, status,
            gateway, gateway_id, gateway_data, gateway_fee, description,
            metadata, refunded_at, refund_amount, refund_reason,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            payment.id,
            payment.userId,
            payment.subscriptionId,
            payment.purpose,
            payment.amount?.toString(),
            payment.currency,
            payment.status,
            payment.gateway,
            payment.gatewayId,
            payment.gatewayData,
            payment.gatewayFee?.toString(),
            payment.description,
            payment.metadata,
            payment.refundedAt?.toISOString(),
            payment.refundAmount?.toString(),
            payment.refundReason,
            payment.createdAt.toISOString(),
            payment.updatedAt.toISOString()
          ]
        )
        console.log(`✅ Migrated payment: ${payment.id}`)
      } catch (error) {
        console.error(`❌ Failed to migrate payment ${payment.id}:`, error)
      }
    }
  }

  async migrateAIGenerations(): Promise<void> {
    console.log('🔄 Migrating AI generations...')
    
    const generations = await this.config.sourceDb.aIGeneration.findMany({
      include: { user: true }
    })
    console.log(`Found ${generations.length} AI generations to migrate`)

    for (const generation of generations) {
      try {
        await this.config.targetDb.execute(
          `INSERT INTO ai_generations (
            id, user_id, website_id, type, prompt, response, model,
            temperature, max_tokens, tokens, cost, language, status,
            metadata, error_message, processing_time, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            generation.id,
            generation.userId,
            generation.websiteId,
            generation.type,
            generation.prompt,
            generation.response,
            generation.model,
            generation.temperature?.toString(),
            generation.maxTokens,
            generation.tokens,
            generation.cost?.toString(),
            generation.language,
            generation.status,
            generation.metadata,
            generation.errorMessage,
            generation.processingTime,
            generation.createdAt.toISOString(),
            generation.updatedAt.toISOString()
          ]
        )
        console.log(`✅ Migrated AI generation: ${generation.id}`)
      } catch (error) {
        console.error(`❌ Failed to migrate AI generation ${generation.id}:`, error)
      }
    }
  }

  async runMigration(): Promise<void> {
    console.log('🚀 Starting data migration from PostgreSQL to D1...')
    
    try {
      await this.migrateUsers()
      await this.migrateWebsites()
      await this.migratePages()
      await this.migrateTemplates()
      await this.migrateMediaAssets()
      await this.migrateProducts()
      await this.migratePayments()
      await this.migrateAIGenerations()
      
      console.log('✅ Migration completed successfully!')
    } catch (error) {
      console.error('❌ Migration failed:', error)
      throw error
    } finally {
      await this.config.sourceDb.$disconnect()
    }
  }
}

// Main execution
async function main() {
  const sourceDb = new PrismaClient()
  
  // Initialize target D1 database
  // Note: In production, you'd get the D1 instance from Cloudflare Workers environment
  const targetDb = initDB({
    DB: {} as D1Database // This would be replaced with actual D1 instance
  })

  const migrator = new DataMigrator({
    sourceDb,
    targetDb,
    batchSize: 100
  })

  await migrator.runMigration()
}

if (require.main === module) {
  main().catch(console.error)
}

export { DataMigrator }
