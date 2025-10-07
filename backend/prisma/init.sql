-- Initialize PostgreSQL database for Pakistan Website Builder
-- This file is used by Docker Compose to initialize the database

-- Create database if it doesn't exist (this is handled by POSTGRES_DB)
-- The database 'website_builder' is created automatically by PostgreSQL

-- Set timezone
SET timezone = 'UTC';

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create a simple function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE website_builder TO postgres;
