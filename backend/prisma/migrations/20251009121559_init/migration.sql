-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN', 'AGENCY', 'AGENCY_CLIENT');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING');

-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('RESTAURANT', 'RETAIL', 'SERVICE', 'HEALTHCARE', 'EDUCATION', 'TECHNOLOGY', 'FINANCE', 'REAL_ESTATE', 'ENTERTAINMENT', 'NON_PROFIT', 'OTHER');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ENGLISH', 'URDU', 'PUNJABI', 'SINDHI', 'BALOCHI', 'PASHTO', 'ARABIC', 'FRENCH', 'SPANISH', 'GERMAN', 'CHINESE', 'HINDI');

-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'PRO', 'AGENCY', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "SubscriptionInterval" AS ENUM ('MONTHLY', 'YEARLY', 'LIFETIME');

-- CreateEnum
CREATE TYPE "PaymentGateway" AS ENUM ('STRIPE', 'JAZZCASH', 'EASYPAISA', 'BANK_TRANSFER', 'PAYPAL', 'SQUARE');

-- CreateEnum
CREATE TYPE "PaymentPurpose" AS ENUM ('PLATFORM_SUBSCRIPTION', 'WEBSITE_CHECKOUT', 'ADDON_PURCHASE', 'UPGRADE', 'RENEWAL');

-- CreateEnum
CREATE TYPE "AIGenerationType" AS ENUM ('CONTENT', 'IMAGE', 'SEO', 'COLORS', 'DESIGN', 'COPYWRITING', 'TRANSLATION', 'CODE');

-- CreateTable
CREATE TABLE "ai_sessions" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "context" TEXT,
    "model" TEXT,
    "temperature" DECIMAL(65,30),
    "maxTokens" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arvr_content" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "assets" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "arvr_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_analytics" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "period" TEXT NOT NULL,
    "visitors" INTEGER NOT NULL DEFAULT 0,
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "bounceRate" DECIMAL(65,30),
    "avgSessionDuration" DECIMAL(65,30),
    "conversionRate" DECIMAL(65,30),
    "revenue" DECIMAL(65,30),
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blockchain_wallets" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "websiteId" TEXT,
    "address" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blockchain_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nft_collections" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "symbol" TEXT,
    "standard" TEXT NOT NULL,
    "contractAddress" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nft_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nfts" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "metadata" TEXT,
    "ownerAddress" TEXT,
    "status" TEXT NOT NULL DEFAULT 'MINTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nfts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "smart_contracts" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "abi" TEXT,
    "bytecode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "network" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "smart_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "smart_contract_interactions" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "userId" TEXT,
    "method" TEXT NOT NULL,
    "parameters" TEXT,
    "txHash" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "gasUsed" DECIMAL(65,30),
    "gasPrice" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "smart_contract_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "web3_integrations" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "config" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "web3_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blockchain_transactions" (
    "id" TEXT NOT NULL,
    "walletId" TEXT,
    "websiteId" TEXT,
    "txHash" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(65,30),
    "token" TEXT,
    "fromAddress" TEXT,
    "toAddress" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "blockNumber" INTEGER,
    "gasUsed" DECIMAL(65,30),
    "gasPrice" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blockchain_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "language" TEXT NOT NULL DEFAULT 'ENGLISH',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "tags" TEXT,
    "featuredImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_categories" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_schedules" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_templates" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "template" TEXT NOT NULL,
    "category" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_analytics" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "uniqueViews" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "design_systems" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "colors" TEXT NOT NULL,
    "typography" TEXT NOT NULL,
    "spacing" TEXT NOT NULL,
    "components" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "design_systems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing_campaigns" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "channel" TEXT NOT NULL,
    "targetAudience" TEXT,
    "budget" DECIMAL(65,30),
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketing_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_messages" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_onboarding_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "websiteId" TEXT,
    "industry" TEXT,
    "businessGoals" TEXT,
    "targetAudience" TEXT,
    "brandPersonality" TEXT,
    "contentPreferences" TEXT,
    "language" TEXT NOT NULL DEFAULT 'ENGLISH',
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_onboarding_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "websiteId" TEXT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "smsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT true,
    "inAppEnabled" BOOLEAN NOT NULL DEFAULT true,
    "marketingEmails" BOOLEAN NOT NULL DEFAULT false,
    "frequency" TEXT NOT NULL DEFAULT 'IMMEDIATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_digests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_digests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agencies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "website" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "plan" TEXT NOT NULL DEFAULT 'BASIC',
    "maxClients" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agency_clients" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "permissions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agency_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integrations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "config" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_integrations" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "config" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "lastSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_webhooks" (
    "id" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "events" TEXT NOT NULL,
    "secret" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integration_webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_logs" (
    "id" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "websiteId" TEXT,
    "event" TEXT NOT NULL,
    "data" TEXT,
    "status" TEXT NOT NULL,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "integration_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_assets" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_projects" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "duration" INTEGER,
    "resolution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_clips" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startTime" INTEGER NOT NULL,
    "endTime" INTEGER NOT NULL,
    "url" TEXT,
    "thumbnail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_clips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pwa_settings" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT,
    "shortName" TEXT,
    "description" TEXT,
    "themeColor" TEXT,
    "backgroundColor" TEXT,
    "display" TEXT NOT NULL DEFAULT 'standalone',
    "orientation" TEXT NOT NULL DEFAULT 'portrait',
    "startUrl" TEXT NOT NULL DEFAULT '/',
    "scope" TEXT NOT NULL DEFAULT '/',
    "icons" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pwa_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_accounts" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_posts" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "mediaUrls" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "platformPostId" TEXT,
    "engagement" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_campaigns" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_automation_rules" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "trigger" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "config" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_automation_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "domains" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "sslEnabled" BOOLEAN NOT NULL DEFAULT false,
    "dnsRecords" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dns_records" (
    "id" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "ttl" INTEGER NOT NULL DEFAULT 3600,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dns_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_visitors" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "country" TEXT,
    "city" TEXT,
    "referrer" TEXT,
    "landingPage" TEXT,
    "exitPage" TEXT,
    "duration" INTEGER,
    "pageViews" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "website_visitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "website_analytics_websiteId_date_period_key" ON "website_analytics"("websiteId", "date", "period");

-- CreateIndex
CREATE UNIQUE INDEX "blockchain_wallets_address_key" ON "blockchain_wallets"("address");

-- CreateIndex
CREATE UNIQUE INDEX "nfts_collectionId_tokenId_key" ON "nfts"("collectionId", "tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "blockchain_transactions_txHash_key" ON "blockchain_transactions"("txHash");

-- CreateIndex
CREATE UNIQUE INDEX "content_categories_websiteId_slug_key" ON "content_categories"("websiteId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "content_analytics_contentId_date_key" ON "content_analytics"("contentId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ai_onboarding_profiles_userId_key" ON "ai_onboarding_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ai_onboarding_profiles_websiteId_key" ON "ai_onboarding_profiles"("websiteId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_userId_key" ON "notification_preferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "agency_clients_userId_key" ON "agency_clients"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "website_integrations_websiteId_integrationId_key" ON "website_integrations"("websiteId", "integrationId");

-- CreateIndex
CREATE UNIQUE INDEX "pwa_settings_websiteId_key" ON "pwa_settings"("websiteId");

-- CreateIndex
CREATE UNIQUE INDEX "social_accounts_websiteId_platform_accountId_key" ON "social_accounts"("websiteId", "platform", "accountId");

-- CreateIndex
CREATE UNIQUE INDEX "domains_domain_key" ON "domains"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_token_key" ON "user_sessions"("token");

-- AddForeignKey
ALTER TABLE "ai_sessions" ADD CONSTRAINT "ai_sessions_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_sessions" ADD CONSTRAINT "ai_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arvr_content" ADD CONSTRAINT "arvr_content_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arvr_content" ADD CONSTRAINT "arvr_content_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_analytics" ADD CONSTRAINT "website_analytics_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blockchain_wallets" ADD CONSTRAINT "blockchain_wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blockchain_wallets" ADD CONSTRAINT "blockchain_wallets_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nft_collections" ADD CONSTRAINT "nft_collections_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfts" ADD CONSTRAINT "nfts_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "nft_collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "smart_contracts" ADD CONSTRAINT "smart_contracts_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "smart_contract_interactions" ADD CONSTRAINT "smart_contract_interactions_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "smart_contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "smart_contract_interactions" ADD CONSTRAINT "smart_contract_interactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "web3_integrations" ADD CONSTRAINT "web3_integrations_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blockchain_transactions" ADD CONSTRAINT "blockchain_transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "blockchain_wallets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blockchain_transactions" ADD CONSTRAINT "blockchain_transactions_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_categories" ADD CONSTRAINT "content_categories_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_schedules" ADD CONSTRAINT "content_schedules_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_templates" ADD CONSTRAINT "content_templates_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_analytics" ADD CONSTRAINT "content_analytics_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "design_systems" ADD CONSTRAINT "design_systems_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing_campaigns" ADD CONSTRAINT "marketing_campaigns_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_messages" ADD CONSTRAINT "campaign_messages_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "marketing_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_onboarding_profiles" ADD CONSTRAINT "ai_onboarding_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_onboarding_profiles" ADD CONSTRAINT "ai_onboarding_profiles_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_digests" ADD CONSTRAINT "notification_digests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agency_clients" ADD CONSTRAINT "agency_clients_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agency_clients" ADD CONSTRAINT "agency_clients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_integrations" ADD CONSTRAINT "website_integrations_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_integrations" ADD CONSTRAINT "website_integrations_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_projects" ADD CONSTRAINT "video_projects_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_projects" ADD CONSTRAINT "video_projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_clips" ADD CONSTRAINT "video_clips_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "video_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_settings" ADD CONSTRAINT "pwa_settings_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_accounts" ADD CONSTRAINT "social_accounts_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_posts" ADD CONSTRAINT "social_posts_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "social_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_campaigns" ADD CONSTRAINT "social_campaigns_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_automation_rules" ADD CONSTRAINT "social_automation_rules_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domains" ADD CONSTRAINT "domains_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dns_records" ADD CONSTRAINT "dns_records_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "domains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_visitors" ADD CONSTRAINT "website_visitors_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
