-- Migration: Create initial database schema
-- Created: 2024-01-01
-- Description: Initial schema for Pakistan Website Builder

-- Users table
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
);

-- Websites table
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
);

-- Pages table
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
);

-- Templates table
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
);

-- Media assets table
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
);

-- Page versions table
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
);

-- User templates table
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
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  website_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL,
  compare_price DECIMAL,
  sku TEXT,
  track_inventory BOOLEAN DEFAULT FALSE,
  inventory INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  allow_backorder BOOLEAN DEFAULT FALSE,
  images TEXT,
  videos TEXT,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  status TEXT DEFAULT 'ACTIVE',
  has_variants BOOLEAN DEFAULT FALSE,
  variants TEXT,
  weight DECIMAL,
  dimensions TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (website_id) REFERENCES websites(id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  website_id TEXT,
  purpose TEXT DEFAULT 'PLATFORM_SUBSCRIPTION',
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'PKR',
  status TEXT DEFAULT 'PENDING',
  gateway TEXT NOT NULL,
  gateway_id TEXT,
  gateway_data TEXT,
  gateway_fee DECIMAL DEFAULT 0,
  description TEXT,
  metadata TEXT,
  refunded_at DATETIME,
  refund_amount DECIMAL,
  refund_reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (website_id) REFERENCES websites(id) ON DELETE SET NULL
);

-- AI generations table
CREATE TABLE IF NOT EXISTS ai_generations (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  website_id TEXT,
  type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  model TEXT NOT NULL,
  temperature DECIMAL,
  max_tokens INTEGER,
  tokens INTEGER,
  cost DECIMAL,
  language TEXT DEFAULT 'ENGLISH',
  status TEXT DEFAULT 'COMPLETED',
  metadata TEXT,
  error_message TEXT,
  processing_time INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (website_id) REFERENCES websites(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_websites_user_id ON websites(user_id);
CREATE INDEX IF NOT EXISTS idx_pages_website_id ON pages(website_id);
CREATE INDEX IF NOT EXISTS idx_media_website_id ON media_assets(website_id);
CREATE INDEX IF NOT EXISTS idx_page_versions_page_id ON page_versions(page_id);
CREATE INDEX IF NOT EXISTS idx_user_templates_user_id ON user_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_products_website_id ON products(website_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_user_id ON ai_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_business_type ON templates(business_type);
CREATE INDEX IF NOT EXISTS idx_templates_status ON templates(status);
CREATE INDEX IF NOT EXISTS idx_websites_status ON websites(status);
CREATE INDEX IF NOT EXISTS idx_websites_subdomain ON websites(subdomain);
CREATE INDEX IF NOT EXISTS idx_websites_custom_domain ON websites(custom_domain);
