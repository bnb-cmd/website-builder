#!/bin/bash

# OAuth Database Migration Script
# This script updates your database to support Google and Facebook OAuth

echo "🔧 Starting OAuth Database Migration..."

# Check if we're using PostgreSQL or SQLite
if [ -n "$DATABASE_URL" ]; then
    echo "📊 Detected PostgreSQL database"
    DB_TYPE="postgresql"
else
    echo "📊 Detected SQLite database"
    DB_TYPE="sqlite"
fi

# Generate migration
echo "📝 Generating Prisma migration..."
npx prisma migrate dev --name add_oauth_support

# Apply the migration
echo "🚀 Applying migration to database..."
npx prisma migrate deploy

# Generate new Prisma client
echo "🔄 Generating updated Prisma client..."
npx prisma generate

echo "✅ OAuth database migration completed successfully!"
echo ""
echo "📋 What was added:"
echo "   • oauthProvider - Stores the OAuth provider (google, facebook, email)"
echo "   • oauthProviderId - External provider user ID"
echo "   • avatarUrl - Profile picture from OAuth provider"
echo "   • emailVerified - Email verification status"
echo "   • passwordResetToken - For password reset functionality"
echo "   • passwordResetExpires - Token expiration"
echo "   • emailVerificationToken - Email verification token"
echo "   • emailVerificationExpires - Verification expiration"
echo "   • Made password optional for OAuth users"
echo "   • Added unique constraint for OAuth provider + provider ID"
echo ""
echo "🎉 Your database is now ready for Google and Facebook OAuth!"
