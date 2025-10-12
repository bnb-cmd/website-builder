import type { Env } from '../index'

export interface DatabaseAdapter {
  query(sql: string, params?: any[]): Promise<any[]>
  execute(sql: string, params?: any[]): Promise<{ success: boolean; meta: any }>
  transaction<T>(callback: (tx: DatabaseAdapter) => Promise<T>): Promise<T>
}

export class D1Adapter implements DatabaseAdapter {
  constructor(private db: D1Database) {}

  async query(sql: string, params: any[] = []): Promise<any[]> {
    const result = await this.db.prepare(sql).bind(...params).all()
    return result.results || []
  }

  async execute(sql: string, params: any[] = []): Promise<{ success: boolean; meta: any }> {
    const result = await this.db.prepare(sql).bind(...params).run()
    return {
      success: result.success,
      meta: result.meta
    }
  }

  async transaction<T>(callback: (tx: DatabaseAdapter) => Promise<T>): Promise<T> {
    // D1 doesn't support transactions yet, so we'll execute sequentially
    // This is a limitation we'll work around
    return await callback(this)
  }
}

export const initDB = (env: Env): DatabaseAdapter => {
  return new D1Adapter(env.DB)
}

// Database schema migrations
export const migrations = {
  async up(db: DatabaseAdapter): Promise<void> {
    // Users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        avatar TEXT,
        role TEXT DEFAULT 'USER',
        status TEXT DEFAULT 'ACTIVE',
        business_type TEXT,
        city TEXT,
        company_name TEXT,
        preferred_language TEXT DEFAULT 'ENGLISH',
        ai_quota_used INTEGER DEFAULT 0,
        ai_quota_reset_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login_at DATETIME
      )
    `)

    // Websites table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS websites (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'DRAFT',
        content TEXT,
        settings TEXT,
        custom_css TEXT,
        custom_js TEXT,
        subdomain TEXT UNIQUE,
        custom_domain TEXT UNIQUE,
        business_type TEXT,
        language TEXT DEFAULT 'ENGLISH',
        template_id TEXT,
        meta_title TEXT,
        meta_description TEXT,
        meta_keywords TEXT,
        user_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        published_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `)

    // Pages table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS pages (
        id TEXT PRIMARY KEY,
        website_id TEXT NOT NULL,
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        content TEXT NOT NULL,
        settings TEXT,
        is_home BOOLEAN DEFAULT FALSE,
        order_index INTEGER DEFAULT 0,
        meta_title TEXT,
        meta_description TEXT,
        meta_keywords TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (website_id) REFERENCES websites(id) ON DELETE CASCADE,
        UNIQUE(website_id, slug)
      )
    `)

    // Templates table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS templates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        business_type TEXT,
        language TEXT DEFAULT 'ENGLISH',
        content TEXT NOT NULL,
        styles TEXT NOT NULL,
        assets TEXT,
        preview_image TEXT,
        thumbnail TEXT,
        hero_image_url TEXT,
        demo_images TEXT,
        is_global BOOLEAN DEFAULT TRUE,
        parent_template_id TEXT,
        localized_for TEXT,
        is_premium BOOLEAN DEFAULT FALSE,
        price DECIMAL,
        status TEXT DEFAULT 'ACTIVE',
        tags TEXT,
        features TEXT,
        responsive BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Media assets table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS media_assets (
        id TEXT PRIMARY KEY,
        website_id TEXT NOT NULL,
        user_id TEXT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        url TEXT NOT NULL,
        thumbnail TEXT,
        size INTEGER NOT NULL,
        mime_type TEXT NOT NULL,
        width INTEGER,
        height INTEGER,
        duration INTEGER,
        metadata TEXT,
        tags TEXT,
        ai_generated BOOLEAN DEFAULT FALSE,
        ai_prompt TEXT,
        status TEXT DEFAULT 'ACTIVE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (website_id) REFERENCES websites(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `)

    // Page versions table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS page_versions (
        id TEXT PRIMARY KEY,
        page_id TEXT NOT NULL,
        version_number INTEGER NOT NULL,
        content TEXT NOT NULL,
        changes TEXT,
        created_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
        UNIQUE(page_id, version_number)
      )
    `)

    // User templates table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS user_templates (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        content TEXT NOT NULL,
        thumbnail TEXT,
        category TEXT,
        is_public BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Create indexes
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_websites_user_id ON websites(user_id)`)
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_pages_website_id ON pages(website_id)`)
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_media_website_id ON media_assets(website_id)`)
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_page_versions_page_id ON page_versions(page_id)`)
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_user_templates_user_id ON user_templates(user_id)`)
  }
}
