-- Migration: Add E-Commerce Tables
-- Created: 2024-01-01
-- Description: E-commerce schema for Micro-Store functionality

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  website_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  total_amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'PKR',
  status TEXT DEFAULT 'pending',
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (website_id) REFERENCES websites(id) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Shipping addresses table
CREATE TABLE IF NOT EXISTS shipping_addresses (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  postal_code TEXT,
  phone TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Payment transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  gateway TEXT NOT NULL,
  gateway_transaction_id TEXT,
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'PKR',
  status TEXT DEFAULT 'pending',
  gateway_response TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Social media links table
CREATE TABLE IF NOT EXISTS social_media_links (
  id TEXT PRIMARY KEY,
  website_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  oauth_token TEXT,
  refresh_token TEXT,
  token_expires_at DATETIME,
  shop_id TEXT,
  last_sync_at DATETIME,
  sync_enabled BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (website_id) REFERENCES websites(id) ON DELETE CASCADE,
  UNIQUE(website_id, platform)
);

-- Extend products table for social media integration
ALTER TABLE products ADD COLUMN social_platform TEXT;
ALTER TABLE products ADD COLUMN social_product_id TEXT;
ALTER TABLE products ADD COLUMN social_post_url TEXT;
ALTER TABLE products ADD COLUMN last_synced_at DATETIME;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_website_id ON orders(website_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_shipping_addresses_order_id ON shipping_addresses(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_gateway ON payment_transactions(gateway);
CREATE INDEX IF NOT EXISTS idx_social_media_links_website_id ON social_media_links(website_id);
CREATE INDEX IF NOT EXISTS idx_social_media_links_platform ON social_media_links(platform);
CREATE INDEX IF NOT EXISTS idx_products_social_platform ON products(social_platform);
CREATE INDEX IF NOT EXISTS idx_products_social_product_id ON products(social_product_id);
