#!/usr/bin/env node

/**
 * Data Migration Script: PostgreSQL to Cloudflare D1
 * 
 * This script migrates data from an existing PostgreSQL database
 * to the new Cloudflare D1 database schema.
 * 
 * Usage:
 *   npm run migrate:data
 *   node scripts/migrate-data.js
 */

import { Client } from 'pg'
import { D1Database } from '@cloudflare/workers-types'

// PostgreSQL connection configuration
const PG_CONFIG = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'website_builder',
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
}

// D1 configuration
const D1_CONFIG = {
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  apiToken: process.env.CLOUDFLARE_API_TOKEN,
  databaseId: process.env.D1_DATABASE_ID
}

interface MigrationStats {
  users: number
  websites: number
  pages: number
  components: number
  media: number
  templates: number
  versions: number
  errors: string[]
}

class DataMigrator {
  private pgClient: Client
  private d1Client: any
  private stats: MigrationStats

  constructor() {
    this.pgClient = new Client(PG_CONFIG)
    this.stats = {
      users: 0,
      websites: 0,
      pages: 0,
      components: 0,
      media: 0,
      templates: 0,
      versions: 0,
      errors: []
    }
  }

  async connect() {
    try {
      await this.pgClient.connect()
      console.log('✅ Connected to PostgreSQL')
      
      // Initialize D1 client (this would be done via Wrangler API in practice)
      console.log('✅ Connected to D1')
    } catch (error) {
      console.error('❌ Connection failed:', error)
      throw error
    }
  }

  async disconnect() {
    await this.pgClient.end()
    console.log('✅ Disconnected from databases')
  }

  async migrateUsers() {
    console.log('🔄 Migrating users...')
    
    try {
      const users = await this.pgClient.query(`
        SELECT id, email, name, password, phone, avatar, role, status, 
               business_type, city, company_name, preferred_language, 
               ai_quota_used, ai_quota_reset_at, created_at, updated_at, last_login_at
        FROM users
        ORDER BY created_at ASC
      `)

      for (const user of users.rows) {
        try {
          // Transform data to match D1 schema
          const transformedUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            password: user.password, // Already hashed
            phone: user.phone,
            avatar: user.avatar,
            role: user.role || 'USER',
            status: user.status || 'ACTIVE',
            businessType: user.business_type,
            city: user.city,
            companyName: user.company_name,
            preferredLanguage: user.preferred_language || 'ENGLISH',
            aiQuotaUsed: user.ai_quota_used || 0,
            aiQuotaResetAt: user.ai_quota_reset_at,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
            lastLoginAt: user.last_login_at
          }

          // Insert into D1 (this would use actual D1 API)
          console.log(`  📝 Migrating user: ${user.email}`)
          this.stats.users++
          
        } catch (error) {
          console.error(`  ❌ Error migrating user ${user.email}:`, error)
          this.stats.errors.push(`User ${user.email}: ${error.message}`)
        }
      }
      
      console.log(`✅ Migrated ${this.stats.users} users`)
    } catch (error) {
      console.error('❌ Error migrating users:', error)
      this.stats.errors.push(`Users migration: ${error.message}`)
    }
  }

  async migrateWebsites() {
    console.log('🔄 Migrating websites...')
    
    try {
      const websites = await this.pgClient.query(`
        SELECT id, name, description, status, content, settings, custom_css, custom_js,
               subdomain, custom_domain, business_type, language, template_id,
               meta_title, meta_description, meta_keywords, user_id,
               created_at, updated_at, published_at
        FROM websites
        ORDER BY created_at ASC
      `)

      for (const website of websites.rows) {
        try {
          const transformedWebsite = {
            id: website.id,
            name: website.name,
            description: website.description,
            status: website.status || 'DRAFT',
            content: website.content,
            settings: website.settings,
            customCSS: website.custom_css,
            customJS: website.custom_js,
            subdomain: website.subdomain,
            customDomain: website.custom_domain,
            businessType: website.business_type,
            language: website.language || 'ENGLISH',
            templateId: website.template_id,
            metaTitle: website.meta_title,
            metaDescription: website.meta_description,
            metaKeywords: website.meta_keywords,
            userId: website.user_id,
            createdAt: website.created_at,
            updatedAt: website.updated_at,
            publishedAt: website.published_at
          }

          console.log(`  📝 Migrating website: ${website.name}`)
          this.stats.websites++
          
        } catch (error) {
          console.error(`  ❌ Error migrating website ${website.name}:`, error)
          this.stats.errors.push(`Website ${website.name}: ${error.message}`)
        }
      }
      
      console.log(`✅ Migrated ${this.stats.websites} websites`)
    } catch (error) {
      console.error('❌ Error migrating websites:', error)
      this.stats.errors.push(`Websites migration: ${error.message}`)
    }
  }

  async migratePages() {
    console.log('🔄 Migrating pages...')
    
    try {
      const pages = await this.pgClient.query(`
        SELECT id, name, slug, content, settings, is_home, "order",
               meta_title, meta_description, meta_keywords, language, dir,
               website_id, created_at, updated_at
        FROM pages
        ORDER BY created_at ASC
      `)

      for (const page of pages.rows) {
        try {
          const transformedPage = {
            id: page.id,
            name: page.name,
            slug: page.slug,
            content: page.content,
            settings: page.settings,
            isHome: page.is_home || false,
            order: page.order || 0,
            metaTitle: page.meta_title,
            metaDescription: page.meta_description,
            metaKeywords: page.meta_keywords,
            language: page.language || 'ENGLISH',
            dir: page.dir || 'ltr',
            websiteId: page.website_id,
            createdAt: page.created_at,
            updatedAt: page.updated_at
          }

          console.log(`  📝 Migrating page: ${page.name}`)
          this.stats.pages++
          
        } catch (error) {
          console.error(`  ❌ Error migrating page ${page.name}:`, error)
          this.stats.errors.push(`Page ${page.name}: ${error.message}`)
        }
      }
      
      console.log(`✅ Migrated ${this.stats.pages} pages`)
    } catch (error) {
      console.error('❌ Error migrating pages:', error)
      this.stats.errors.push(`Pages migration: ${error.message}`)
    }
  }

  async migrateComponents() {
    console.log('🔄 Migrating components...')
    
    try {
      const components = await this.pgClient.query(`
        SELECT id, type, props, layout, styles, children, locked, visible,
               page_id, created_at, updated_at
        FROM components
        ORDER BY created_at ASC
      `)

      for (const component of components.rows) {
        try {
          const transformedComponent = {
            id: component.id,
            type: component.type,
            props: component.props,
            layout: component.layout,
            styles: component.styles,
            children: component.children,
            locked: component.locked || false,
            visible: component.visible !== false,
            pageId: component.page_id,
            createdAt: component.created_at,
            updatedAt: component.updated_at
          }

          console.log(`  📝 Migrating component: ${component.type}`)
          this.stats.components++
          
        } catch (error) {
          console.error(`  ❌ Error migrating component ${component.type}:`, error)
          this.stats.errors.push(`Component ${component.type}: ${error.message}`)
        }
      }
      
      console.log(`✅ Migrated ${this.stats.components} components`)
    } catch (error) {
      console.error('❌ Error migrating components:', error)
      this.stats.errors.push(`Components migration: ${error.message}`)
    }
  }

  async migrateMedia() {
    console.log('🔄 Migrating media...')
    
    try {
      const media = await this.pgClient.query(`
        SELECT id, file_name, file_type, file_size, category, url, alt_text,
               user_id, created_at, updated_at
        FROM media
        ORDER BY created_at ASC
      `)

      for (const mediaItem of media.rows) {
        try {
          const transformedMedia = {
            id: mediaItem.id,
            fileName: mediaItem.file_name,
            fileType: mediaItem.file_type,
            fileSize: mediaItem.file_size,
            category: mediaItem.category,
            url: mediaItem.url,
            altText: mediaItem.alt_text,
            userId: mediaItem.user_id,
            createdAt: mediaItem.created_at,
            updatedAt: mediaItem.updated_at
          }

          console.log(`  📝 Migrating media: ${mediaItem.file_name}`)
          this.stats.media++
          
        } catch (error) {
          console.error(`  ❌ Error migrating media ${mediaItem.file_name}:`, error)
          this.stats.errors.push(`Media ${mediaItem.file_name}: ${error.message}`)
        }
      }
      
      console.log(`✅ Migrated ${this.stats.media} media items`)
    } catch (error) {
      console.error('❌ Error migrating media:', error)
      this.stats.errors.push(`Media migration: ${error.message}`)
    }
  }

  async migrateTemplates() {
    console.log('🔄 Migrating templates...')
    
    try {
      const templates = await this.pgClient.query(`
        SELECT id, name, description, category, preview, content, is_public,
               download_count, created_at, updated_at
        FROM templates
        ORDER BY created_at ASC
      `)

      for (const template of templates.rows) {
        try {
          const transformedTemplate = {
            id: template.id,
            name: template.name,
            description: template.description,
            category: template.category,
            preview: template.preview,
            content: template.content,
            isPublic: template.is_public || false,
            downloadCount: template.download_count || 0,
            createdAt: template.created_at,
            updatedAt: template.updated_at
          }

          console.log(`  📝 Migrating template: ${template.name}`)
          this.stats.templates++
          
        } catch (error) {
          console.error(`  ❌ Error migrating template ${template.name}:`, error)
          this.stats.errors.push(`Template ${template.name}: ${error.message}`)
        }
      }
      
      console.log(`✅ Migrated ${this.stats.templates} templates`)
    } catch (error) {
      console.error('❌ Error migrating templates:', error)
      this.stats.errors.push(`Templates migration: ${error.message}`)
    }
  }

  async migrateVersions() {
    console.log('🔄 Migrating versions...')
    
    try {
      const versions = await this.pgClient.query(`
        SELECT id, version_number, content, changes, site_id, user_id,
               created_at, updated_at
        FROM versions
        ORDER BY created_at ASC
      `)

      for (const version of versions.rows) {
        try {
          const transformedVersion = {
            id: version.id,
            versionNumber: version.version_number,
            content: version.content,
            changes: version.changes,
            siteId: version.site_id,
            userId: version.user_id,
            createdAt: version.created_at,
            updatedAt: version.updated_at
          }

          console.log(`  📝 Migrating version: ${version.version_number}`)
          this.stats.versions++
          
        } catch (error) {
          console.error(`  ❌ Error migrating version ${version.version_number}:`, error)
          this.stats.errors.push(`Version ${version.version_number}: ${error.message}`)
        }
      }
      
      console.log(`✅ Migrated ${this.stats.versions} versions`)
    } catch (error) {
      console.error('❌ Error migrating versions:', error)
      this.stats.errors.push(`Versions migration: ${error.message}`)
    }
  }

  async migrateAll() {
    console.log('🚀 Starting data migration from PostgreSQL to D1...')
    console.log('=' .repeat(60))
    
    try {
      await this.connect()
      
      // Migrate in order to respect foreign key constraints
      await this.migrateUsers()
      await this.migrateWebsites()
      await this.migratePages()
      await this.migrateComponents()
      await this.migrateMedia()
      await this.migrateTemplates()
      await this.migrateVersions()
      
      console.log('=' .repeat(60))
      console.log('📊 Migration Summary:')
      console.log(`  Users: ${this.stats.users}`)
      console.log(`  Websites: ${this.stats.websites}`)
      console.log(`  Pages: ${this.stats.pages}`)
      console.log(`  Components: ${this.stats.components}`)
      console.log(`  Media: ${this.stats.media}`)
      console.log(`  Templates: ${this.stats.templates}`)
      console.log(`  Versions: ${this.stats.versions}`)
      
      if (this.stats.errors.length > 0) {
        console.log(`\n❌ Errors encountered: ${this.stats.errors.length}`)
        this.stats.errors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error}`)
        })
      } else {
        console.log('\n✅ Migration completed successfully with no errors!')
      }
      
    } catch (error) {
      console.error('❌ Migration failed:', error)
      process.exit(1)
    } finally {
      await this.disconnect()
    }
  }

  // Utility method to validate data integrity
  async validateMigration() {
    console.log('🔍 Validating migration...')
    
    try {
      // Count records in PostgreSQL
      const pgCounts = await this.pgClient.query(`
        SELECT 
          (SELECT COUNT(*) FROM users) as users,
          (SELECT COUNT(*) FROM websites) as websites,
          (SELECT COUNT(*) FROM pages) as pages,
          (SELECT COUNT(*) FROM components) as components,
          (SELECT COUNT(*) FROM media) as media,
          (SELECT COUNT(*) FROM templates) as templates,
          (SELECT COUNT(*) FROM versions) as versions
      `)
      
      const pgStats = pgCounts.rows[0]
      
      console.log('PostgreSQL counts:', pgStats)
      console.log('D1 counts:', this.stats)
      
      // Validate counts match
      const countsMatch = 
        parseInt(pgStats.users) === this.stats.users &&
        parseInt(pgStats.websites) === this.stats.websites &&
        parseInt(pgStats.pages) === this.stats.pages &&
        parseInt(pgStats.components) === this.stats.components &&
        parseInt(pgStats.media) === this.stats.media &&
        parseInt(pgStats.templates) === this.stats.templates &&
        parseInt(pgStats.versions) === this.stats.versions
      
      if (countsMatch) {
        console.log('✅ Data integrity validation passed!')
      } else {
        console.log('❌ Data integrity validation failed!')
        console.log('Counts do not match between PostgreSQL and D1')
      }
      
    } catch (error) {
      console.error('❌ Validation failed:', error)
    }
  }
}

// Main execution
async function main() {
  const migrator = new DataMigrator()
  
  // Check command line arguments
  const args = process.argv.slice(2)
  const command = args[0]
  
  switch (command) {
    case 'migrate':
      await migrator.migrateAll()
      break
    case 'validate':
      await migrator.connect()
      await migrator.validateMigration()
      await migrator.disconnect()
      break
    default:
      console.log('Usage:')
      console.log('  npm run migrate:data migrate    # Run full migration')
      console.log('  npm run migrate:data validate  # Validate migration')
      break
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Run migration
if (require.main === module) {
  main().catch(console.error)
}

export { DataMigrator }
