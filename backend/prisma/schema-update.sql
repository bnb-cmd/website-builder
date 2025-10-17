-- OAuth Integration Database Updates
-- Add these fields to your User model for complete OAuth support

-- Add OAuth provider fields
ALTER TABLE users ADD COLUMN oauth_provider VARCHAR(50); -- 'google', 'facebook', 'email'
ALTER TABLE users ADD COLUMN oauth_provider_id VARCHAR(255); -- External provider user ID
ALTER TABLE users ADD COLUMN avatar_url TEXT; -- Profile picture from OAuth provider
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE; -- Email verification status
ALTER TABLE users ADD COLUMN password_reset_token VARCHAR(255); -- For password reset
ALTER TABLE users ADD COLUMN password_reset_expires TIMESTAMP; -- Token expiration
ALTER TABLE users ADD COLUMN email_verification_token VARCHAR(255); -- Email verification token
ALTER TABLE users ADD COLUMN email_verification_expires TIMESTAMP; -- Verification expiration

-- Make password optional for OAuth users
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- Add indexes for OAuth lookups
CREATE INDEX idx_users_oauth_provider ON users(oauth_provider);
CREATE INDEX idx_users_oauth_provider_id ON users(oauth_provider_id);
CREATE INDEX idx_users_email_verified ON users(email_verified);

-- Add unique constraint for OAuth provider + provider ID combination
CREATE UNIQUE INDEX idx_users_oauth_unique ON users(oauth_provider, oauth_provider_id) 
WHERE oauth_provider IS NOT NULL AND oauth_provider_id IS NOT NULL;
