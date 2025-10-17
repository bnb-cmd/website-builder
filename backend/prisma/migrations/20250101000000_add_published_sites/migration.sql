-- Migration: Add published sites and custom domains support
-- Created: 2024-01-01
-- Description: Add tables for published sites tracking and custom domain management

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
  last_published DATETIME DEFAULT CURRENT_TIMESTAMP,
  cache_ttl INTEGER DEFAULT 3600,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (site_id) REFERENCES published_sites(id) ON DELETE CASCADE
);

-- Website versions for rollback capability
CREATE TABLE IF NOT EXISTS website_versions (
  id TEXT PRIMARY KEY,
  website_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  content TEXT,
  settings TEXT,
  published_at DATETIME,
  r2_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (website_id) REFERENCES websites(id) ON DELETE CASCADE
);

-- Add subdomain field to websites table if not exists
ALTER TABLE websites ADD COLUMN IF NOT EXISTS subdomain TEXT UNIQUE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_published_sites_subdomain ON published_sites(subdomain);
CREATE INDEX IF NOT EXISTS idx_published_sites_custom_domain ON published_sites(custom_domain);
CREATE INDEX IF NOT EXISTS idx_custom_domains_domain ON custom_domains(domain);
CREATE INDEX IF NOT EXISTS idx_website_versions_website_id ON website_versions(website_id);
CREATE INDEX IF NOT EXISTS idx_websites_subdomain ON websites(subdomain);
