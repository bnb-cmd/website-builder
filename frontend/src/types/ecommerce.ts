export interface Product {
  id: string
  name: string
  description: string
  price: number
  comparePrice?: number
  sku?: string
  images: string[]
  variants?: ProductVariant[]
  inventory: {
    track: boolean
    quantity: number
    allowBackorder: boolean
    lowStockThreshold: number
    supplier?: string
    supplierSku?: string
  }
  seo: {
    title: string
    description: string
    handle: string
  }
  status: 'active' | 'draft' | 'archived'
  category?: string
  tags?: string[]
  vendorId?: string
  vendor?: Vendor
  dropshipping?: {
    enabled: boolean
    supplierId: string
    supplierPrice: number
    supplierCurrency: string
    estimatedDelivery: string
    supplierStock: number
  }
  subscription?: {
    enabled: boolean
    interval: 'daily' | 'weekly' | 'monthly' | 'yearly'
    intervalCount: number
    trialDays?: number
  }
  digitalProduct?: {
    enabled: boolean
    downloadUrl?: string
    licenseKey?: string
    maxDownloads?: number
    expirationDays?: number
  }
  reviews?: Review[]
  rating?: number
  reviewCount?: number
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  title: string
  price: number
  sku?: string
  inventory: number
  options: Record<string, string>
  image?: string
}

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  quantity: number
  price: number
  title: string
  image?: string
  options?: Record<string, string>
}

export interface ShoppingCart {
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string
  discountCode?: string
}

export interface Order {
  id: string
  orderNumber: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  items: OrderItem[]
  customer: Customer
  shippingAddress: Address
  billingAddress?: Address
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string
  notes?: string
  trackingNumber?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  variantId?: string
  quantity: number
  price: number
  title: string
  image?: string
  sku?: string
}

export interface Customer {
  id?: string
  email: string
  name?: string
  phone?: string
  addresses?: Address[]
  orders?: Order[]
  createdAt?: string
}

export interface Address {
  id?: string
  name: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  isDefault?: boolean
}

export interface PaymentMethod {
  id: string
  type: 'stripe' | 'jazzcash' | 'easypaisa' | 'bank_transfer'
  name: string
  description: string
  logo?: string
  enabled: boolean
  config?: Record<string, any>
}

export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
  enabled: boolean
}

export interface DiscountCode {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrderAmount?: number
  maxDiscount?: number
  usageLimit?: number
  usedCount: number
  expiresAt?: string
  enabled: boolean
}

export interface Category {
  id: string
  name: string
  description?: string
  slug: string
  image?: string
  parentId?: string
  children?: Category[]
  productCount: number
  seo: {
    title: string
    description: string
  }
}

export interface Collection {
  id: string
  name: string
  description?: string
  slug: string
  image?: string
  products: Product[]
  rules?: {
    type: 'manual' | 'automatic'
    conditions?: any[]
  }
  seo: {
    title: string
    description: string
  }
}

export interface Review {
  id: string
  productId: string
  customerName: string
  customerEmail: string
  rating: number
  title?: string
  content?: string
  verified: boolean
  helpful: number
  createdAt: string
}

export interface Wishlist {
  id: string
  customerId: string
  products: Product[]
  createdAt: string
  updatedAt: string
}

export interface Inventory {
  productId: string
  variantId?: string
  quantity: number
  reserved: number
  available: number
  lowStockThreshold: number
  trackQuantity: boolean
  allowBackorder: boolean
  supplier?: string
  supplierStock?: number
  updatedAt: string
}

export interface Vendor {
  id: string
  name: string
  email: string
  phone?: string
  businessName?: string
  description?: string
  logo?: string
  website?: string
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  commission: {
    percentage: number
    fixed?: number
  }
  payoutSettings: {
    method: 'bank_transfer' | 'jazzcash' | 'easypaisa' | 'paypal'
    accountDetails: Record<string, any>
  }
  productsCount: number
  totalSales: number
  totalEarnings: number
  rating?: number
  reviewCount?: number
  createdAt: string
  updatedAt: string
}

export interface Supplier {
  id: string
  name: string
  email: string
  phone?: string
  apiEndpoint?: string
  apiKey?: string
  status: 'active' | 'inactive'
  products: SupplierProduct[]
  shippingTime: string
  returnPolicy?: string
  commission?: number
  createdAt: string
  updatedAt: string
}

export interface SupplierProduct {
  id: string
  supplierId: string
  externalId: string
  name: string
  description: string
  price: number
  currency: string
  images: string[]
  stock: number
  category?: string
  variants?: any[]
  lastSynced: string
}

export interface DropshippingOrder {
  id: string
  orderId: string
  supplierId: string
  supplierOrderId?: string
  items: DropshippingItem[]
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'failed'
  trackingNumber?: string
  estimatedDelivery?: string
  actualDelivery?: string
  cost: number
  profit: number
  createdAt: string
  updatedAt: string
}

export interface DropshippingItem {
  productId: string
  variantId?: string
  quantity: number
  supplierPrice: number
  sellingPrice: number
  profit: number
}

export interface SubscriptionPlan {
  id: string
  productId: string
  name: string
  description?: string
  interval: 'daily' | 'weekly' | 'monthly' | 'yearly'
  intervalCount: number
  price: number
  trialDays?: number
  status: 'active' | 'inactive'
  subscriberCount: number
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  id: string
  customerId: string
  planId: string
  status: 'active' | 'paused' | 'cancelled' | 'expired'
  currentPeriodStart: string
  currentPeriodEnd: string
  trialEnd?: string
  cancelAtPeriodEnd: boolean
  cancelledAt?: string
  nextBillingDate: string
  billingHistory: SubscriptionBilling[]
  createdAt: string
  updatedAt: string
}

export interface SubscriptionBilling {
  id: string
  subscriptionId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  billingDate: string
  invoiceUrl?: string
  createdAt: string
}

export interface VendorApplication {
  id: string
  userId: string
  businessName: string
  businessType: string
  description: string
  website?: string
  socialMedia?: Record<string, string>
  experience?: string
  productCategories: string[]
  status: 'pending' | 'approved' | 'rejected'
  reviewedBy?: string
  reviewNotes?: string
  createdAt: string
  updatedAt: string
}

// Content Management Types
export interface Content {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImage?: string
  authorId: string
  author?: User
  categoryId?: string
  category?: ContentCategory
  tags: string[]
  status: ContentStatus
  type: ContentType
  seo: ContentSEO
  scheduledAt?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface ContentCategory {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  children?: ContentCategory[]
  seo: ContentSEO
}

export interface ContentSEO {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  twitterCard?: string
  noIndex?: boolean
  noFollow?: boolean
}

export interface ContentSchedule {
  id: string
  contentId: string
  scheduledAt: string
  status: ScheduleStatus
  platforms?: string[] // social media platforms
  createdAt: string
  updatedAt: string
}

export interface ContentAnalytics {
  contentId: string
  views: number
  uniqueViews: number
  avgTimeOnPage: number
  bounceRate: number
  socialShares: number
  backlinks: number
  seoScore: number
  readabilityScore: number
  lastUpdated: string
}

export interface ContentTemplate {
  id: string
  name: string
  description: string
  category: string
  content: string
  variables: ContentVariable[]
  thumbnail?: string
  isPublic: boolean
  createdBy: string
  usageCount: number
  createdAt: string
}

export interface ContentVariable {
  name: string
  type: 'text' | 'image' | 'url' | 'date' | 'number'
  required: boolean
  defaultValue?: string
  description?: string
}

export enum ContentStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum ContentType {
  ARTICLE = 'article',
  BLOG_POST = 'blog_post',
  NEWS = 'news',
  PAGE = 'page',
  PRODUCT_DESCRIPTION = 'product_description',
  LANDING_PAGE = 'landing_page'
}

export enum ScheduleStatus {
  PENDING = 'pending',
  PUBLISHED = 'published',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// Integration Marketplace Types
export interface Integration {
  id: string
  name: string
  description: string
  category: IntegrationCategory
  provider: string
  logo?: string
  website?: string
  documentation?: string
  pricing: IntegrationPricing
  features: string[]
  screenshots?: string[]
  tags: string[]
  status: IntegrationStatus
  rating?: number
  reviewCount?: number
  installCount: number
  createdAt: string
  updatedAt: string
}

export interface IntegrationCategory {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
}

export interface IntegrationPricing {
  model: 'free' | 'freemium' | 'paid' | 'enterprise'
  plans?: IntegrationPlan[]
  trialDays?: number
  setupFee?: number
}

export interface IntegrationPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'monthly' | 'yearly' | 'one-time'
  features: string[]
  limits?: {
    requests?: number
    users?: number
    storage?: number
  }
}

export interface WebsiteIntegration {
  id: string
  websiteId: string
  integrationId: string
  integration: Integration
  planId?: string
  status: 'active' | 'inactive' | 'error' | 'expired'
  config: Record<string, any>
  credentials: Record<string, any> // Encrypted
  webhookUrl?: string
  lastSync?: string
  errorMessage?: string
  installedAt: string
  expiresAt?: string
}

export interface IntegrationWebhook {
  id: string
  integrationId: string
  websiteId: string
  event: string
  url: string
  secret: string
  status: 'active' | 'inactive'
  retryCount: number
  lastTriggered?: string
  createdAt: string
}

export interface IntegrationLog {
  id: string
  integrationId: string
  websiteId: string
  action: string
  status: 'success' | 'error' | 'warning'
  message: string
  metadata?: Record<string, any>
  createdAt: string
}

export interface IntegrationReview {
  id: string
  integrationId: string
  userId: string
  rating: number
  title?: string
  content?: string
  verified: boolean
  helpful: number
  createdAt: string
}

export enum IntegrationStatus {
  ACTIVE = 'active',
  BETA = 'beta',
  DEPRECATED = 'deprecated',
  COMING_SOON = 'coming_soon'
}

export enum IntegrationCategory {
  PAYMENT = 'payment',
  EMAIL = 'email',
  ANALYTICS = 'analytics',
  MARKETING = 'marketing',
  CRM = 'crm',
  SOCIAL = 'social',
  STORAGE = 'storage',
  COMMUNICATION = 'communication',
  PRODUCTIVITY = 'productivity',
  ECOMMERCE = 'ecommerce',
  SECURITY = 'security',
  DEVELOPMENT = 'development'
}

// Advanced Template Engine Types
export interface AdvancedTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  subcategory?: string
  thumbnail?: string
  previewImages: string[]
  demoUrl?: string
  price: number
  currency: string
  pricingModel: 'free' | 'premium' | 'subscription'
  features: TemplateFeature[]
  technologies: string[]
  responsive: boolean
  customizable: boolean
  aiGenerated: boolean
  complexity: 'beginner' | 'intermediate' | 'advanced'
  estimatedSetupTime: number // in minutes
  rating?: number
  reviewCount?: number
  downloadCount: number
  tags: string[]
  authorId: string
  author: User
  status: TemplateStatus
  version: string
  changelog: TemplateChangelog[]
  dependencies: TemplateDependency[]
  configuration: TemplateConfiguration
  marketplace: TemplateMarketplace
  createdAt: string
  updatedAt: string
}

export interface TemplateFeature {
  name: string
  description: string
  included: boolean
  premium?: boolean
}

export interface TemplateConfiguration {
  pages: TemplatePage[]
  components: TemplateComponent[]
  styles: TemplateStyle[]
  scripts: TemplateScript[]
  assets: TemplateAsset[]
  settings: Record<string, any>
}

export interface TemplatePage {
  id: string
  name: string
  path: string
  content: string
  meta: {
    title?: string
    description?: string
    keywords?: string[]
  }
  layout: string
}

export interface TemplateComponent {
  id: string
  name: string
  type: string
  content: string
  props: Record<string, any>
  styles?: Record<string, any>
}

export interface TemplateStyle {
  id: string
  name: string
  content: string
  type: 'css' | 'scss' | 'less'
  variables?: Record<string, string>
}

export interface TemplateScript {
  id: string
  name: string
  content: string
  type: 'javascript' | 'typescript'
  dependencies?: string[]
}

export interface TemplateAsset {
  id: string
  name: string
  type: 'image' | 'font' | 'icon' | 'video' | 'document'
  url: string
  size: number
}

export interface TemplateChangelog {
  version: string
  date: string
  changes: string[]
  author: string
}

export interface TemplateDependency {
  name: string
  version: string
  type: 'npm' | 'cdn' | 'local'
  required: boolean
}

export interface TemplateMarketplace {
  featured: boolean
  trending: boolean
  popular: boolean
  verified: boolean
  salesCount: number
  revenue: number
  commission: number
  supportEmail?: string
  documentationUrl?: string
  demoUrl?: string
}

export interface TemplateCustomization {
  id: string
  templateId: string
  userId: string
  name: string
  description?: string
  customizations: TemplateCustomizationItem[]
  previewUrl?: string
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
}

export interface TemplateCustomizationItem {
  type: 'color' | 'font' | 'layout' | 'content' | 'style' | 'component'
  target: string
  value: any
  originalValue?: any
}

export interface TemplateAIGeneration {
  id: string
  userId: string
  prompt: string
  requirements: {
    category?: string
    features?: string[]
    style?: string
    colorScheme?: string[]
    targetAudience?: string
    industry?: string
  }
  generatedTemplate?: AdvancedTemplate
  status: 'generating' | 'completed' | 'failed'
  progress: number
  errorMessage?: string
  estimatedCompletion: string
  createdAt: string
  updatedAt: string
}

export interface TemplateReview {
  id: string
  templateId: string
  userId: string
  rating: number
  title?: string
  content?: string
  verified: boolean
  helpful: number
  images?: string[]
  createdAt: string
}

export enum TemplateCategory {
  BUSINESS = 'business',
  PORTFOLIO = 'portfolio',
  BLOG = 'blog',
  ECOMMERCE = 'ecommerce',
  LANDING_PAGE = 'landing_page',
  CORPORATE = 'corporate',
  CREATIVE = 'creative',
  EDUCATION = 'education',
  HEALTHCARE = 'healthcare',
  RESTAURANT = 'restaurant',
  REAL_ESTATE = 'real_estate',
  NON_PROFIT = 'non_profit',
  EVENT = 'event',
  PERSONAL = 'personal'
}

export enum TemplateStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  SUSPENDED = 'suspended'
}

// Social Media Integration Hub Types
export interface SocialAccount {
  id: string
  platform: SocialPlatform
  accountId: string
  accountName: string
  username: string
  avatar?: string
  accessToken: string // Encrypted
  refreshToken?: string // Encrypted
  tokenExpiresAt?: string
  scopes: string[]
  status: 'active' | 'expired' | 'revoked' | 'error'
  lastSynced?: string
  errorMessage?: string
  createdAt: string
  updatedAt: string
}

export interface SocialPost {
  id: string
  websiteId: string
  contentId?: string
  platform: SocialPlatform
  accountId: string
  content: SocialPostContent
  status: SocialPostStatus
  scheduledAt?: string
  publishedAt?: string
  postId?: string // Platform-specific post ID
  url?: string
  engagement: SocialEngagement
  createdAt: string
  updatedAt: string
}

export interface SocialPostContent {
  text: string
  images?: string[]
  video?: string
  link?: {
    url: string
    title: string
    description: string
    image?: string
  }
  hashtags?: string[]
  mentions?: string[]
}

export interface SocialEngagement {
  likes: number
  shares: number
  comments: number
  clicks: number
  impressions: number
  reach: number
  saved: number
}

export interface SocialCampaign {
  id: string
  websiteId: string
  name: string
  description?: string
  platforms: SocialPlatform[]
  accounts: string[] // Social account IDs
  posts: SocialPost[]
  status: 'draft' | 'active' | 'completed' | 'paused'
  schedule: SocialCampaignSchedule
  targeting?: SocialTargeting
  budget?: SocialCampaignBudget
  analytics: SocialCampaignAnalytics
  createdAt: string
  updatedAt: string
}

export interface SocialCampaignSchedule {
  frequency: 'once' | 'daily' | 'weekly' | 'monthly'
  daysOfWeek?: number[] // 0-6, Sunday = 0
  timesOfDay: string[] // HH:MM format
  startDate: string
  endDate?: string
  timezone: string
}

export interface SocialTargeting {
  locations?: string[]
  languages?: string[]
  interests?: string[]
  ageRanges?: string[]
  genders?: string[]
}

export interface SocialCampaignBudget {
  amount: number
  currency: string
  dailyLimit?: number
  totalSpent: number
}

export interface SocialCampaignAnalytics {
  totalPosts: number
  totalEngagement: number
  totalImpressions: number
  totalClicks: number
  averageEngagementRate: number
  bestPerformingPost?: string
  platformBreakdown: Record<SocialPlatform, SocialEngagement>
}

export interface SocialAutomationRule {
  id: string
  websiteId: string
  name: string
  trigger: SocialAutomationTrigger
  conditions: SocialAutomationCondition[]
  actions: SocialAutomationAction[]
  status: 'active' | 'inactive'
  lastTriggered?: string
  createdAt: string
  updatedAt: string
}

export interface SocialAutomationTrigger {
  type: 'content_published' | 'engagement_threshold' | 'time_based' | 'manual'
  contentType?: string
  engagementType?: 'likes' | 'shares' | 'comments' | 'clicks'
  threshold?: number
  schedule?: {
    frequency: 'hourly' | 'daily' | 'weekly'
    time?: string
  }
}

export interface SocialAutomationCondition {
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in'
  value: any
}

export interface SocialAutomationAction {
  type: 'post_content' | 'send_notification' | 'update_analytics' | 'create_campaign'
  platform?: SocialPlatform
  template?: string
  parameters: Record<string, any>
}

export interface SocialAnalytics {
  platform: SocialPlatform
  accountId: string
  period: '7d' | '30d' | '90d'
  followers: {
    current: number
    previous: number
    change: number
    changePercent: number
  }
  engagement: {
    total: number
    average: number
    rate: number
    trend: number[]
  }
  posts: {
    total: number
    topPerforming: SocialPost[]
  }
  demographics?: {
    locations: Array<{ name: string; percentage: number }>
    ages: Array<{ range: string; percentage: number }>
    genders: Array<{ gender: string; percentage: number }>
  }
  generatedAt: string
}

export interface SocialContentSuggestion {
  id: string
  websiteId: string
  platform: SocialPlatform
  contentType: 'text' | 'image' | 'video' | 'carousel' | 'story'
  title: string
  content: SocialPostContent
  reasoning: string
  predictedEngagement: number
  bestTimeToPost: string
  hashtags: string[]
  createdAt: string
}

export enum SocialPlatform {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  TIKTOK = 'tiktok',
  YOUTUBE = 'youtube',
  PINTEREST = 'pinterest'
}

export enum SocialPostStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHING = 'publishing',
  PUBLISHED = 'published',
  FAILED = 'failed',
  DELETED = 'deleted'
}

// AI-Powered Marketing Suite Types
export interface MarketingCampaign {
  id: string
  websiteId: string
  name: string
  description?: string
  type: MarketingCampaignType
  status: MarketingCampaignStatus
  targetAudience: TargetAudience
  budget: CampaignBudget
  schedule: CampaignSchedule
  content: CampaignContent
  automation: CampaignAutomation
  analytics: CampaignAnalytics
  aiInsights: CampaignAIInsights
  createdAt: string
  updatedAt: string
}

export interface TargetAudience {
  segments: AudienceSegment[]
  demographics: {
    ageRanges?: string[]
    genders?: string[]
    locations?: string[]
    interests?: string[]
    behaviors?: string[]
  }
  customFilters: AudienceFilter[]
  estimatedSize: number
  aiGenerated: boolean
}

export interface AudienceSegment {
  id: string
  name: string
  description: string
  criteria: AudienceFilter[]
  size: number
  engagement: number
  conversion: number
  aiSuggested: boolean
}

export interface AudienceFilter {
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'between'
  value: any
  weight: number
}

export interface CampaignBudget {
  total: number
  currency: string
  dailyLimit?: number
  spent: number
  channels: BudgetAllocation[]
}

export interface BudgetAllocation {
  channel: MarketingChannel
  amount: number
  spent: number
}

export interface CampaignSchedule {
  startDate: string
  endDate?: string
  frequency: 'once' | 'daily' | 'weekly' | 'monthly'
  timezone: string
  optimalTimes: string[]
}

export interface CampaignContent {
  subject?: string
  preview?: string
  body?: string
  images?: string[]
  cta?: CallToAction
  personalization: PersonalizationRule[]
  aiGenerated: boolean
  variations: ContentVariation[]
}

export interface CallToAction {
  text: string
  url: string
  type: 'primary' | 'secondary'
  tracking: boolean
}

export interface PersonalizationRule {
  condition: AudienceFilter
  content: string
  priority: number
}

export interface ContentVariation {
  id: string
  name: string
  content: CampaignContent
  performance: VariationPerformance
}

export interface VariationPerformance {
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  conversionRate: number
  confidence: number
}

export interface CampaignAutomation {
  triggers: AutomationTrigger[]
  workflows: MarketingWorkflow[]
  rules: AutomationRule[]
  aiOptimization: boolean
}

export interface AutomationTrigger {
  type: 'time' | 'event' | 'behavior' | 'engagement'
  condition: any
  delay?: number
}

export interface MarketingWorkflow {
  id: string
  name: string
  steps: WorkflowStep[]
  status: 'active' | 'inactive'
  triggers: AutomationTrigger[]
}

export interface WorkflowStep {
  id: string
  name: string
  type: 'email' | 'sms' | 'notification' | 'wait' | 'condition' | 'action'
  config: any
  delay?: number
}

export interface AutomationRule {
  id: string
  name: string
  trigger: AutomationTrigger
  conditions: AudienceFilter[]
  actions: MarketingAction[]
  priority: number
}

export interface MarketingAction {
  type: 'send_email' | 'send_sms' | 'create_task' | 'update_segment' | 'apply_tag'
  config: any
}

export interface CampaignAnalytics {
  overview: {
    impressions: number
    clicks: number
    conversions: number
    revenue: number
    roi: number
  }
  channels: ChannelPerformance[]
  timeline: AnalyticsDataPoint[]
  segments: SegmentPerformance[]
  abTests: ABTestResult[]
}

export interface ChannelPerformance {
  channel: MarketingChannel
  impressions: number
  clicks: number
  conversions: number
  cost: number
  ctr: number
  cpc: number
  cpa: number
  roas: number
}

export interface AnalyticsDataPoint {
  date: string
  impressions: number
  clicks: number
  conversions: number
  revenue: number
}

export interface SegmentPerformance {
  segmentId: string
  segmentName: string
  size: number
  impressions: number
  clicks: number
  conversions: number
  revenue: number
}

export interface ABTestResult {
  id: string
  name: string
  variations: ABTestVariation[]
  winner?: string
  confidence: number
  status: 'running' | 'completed' | 'stopped'
}

export interface ABTestVariation {
  id: string
  name: string
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  conversionRate: number
  isWinner: boolean
}

export interface CampaignAIInsights {
  predictedPerformance: {
    impressions: number
    clicks: number
    conversions: number
    confidence: number
  }
  recommendations: AIRecommendation[]
  optimalTiming: string[]
  audienceInsights: string[]
  contentSuggestions: ContentSuggestion[]
  budgetOptimization: BudgetRecommendation[]
}

export interface AIRecommendation {
  type: 'timing' | 'content' | 'audience' | 'budget' | 'channel'
  title: string
  description: string
  impact: number
  confidence: number
  actionable: boolean
}

export interface ContentSuggestion {
  type: 'subject' | 'content' | 'image' | 'cta'
  suggestion: string
  reasoning: string
  expectedImprovement: number
}

export interface BudgetRecommendation {
  channel: MarketingChannel
  currentAllocation: number
  recommendedAllocation: number
  expectedROI: number
  reasoning: string
}

export interface MarketingWorkflowExecution {
  id: string
  workflowId: string
  contactId: string
  status: 'active' | 'completed' | 'paused' | 'stopped'
  currentStep: number
  startedAt: string
  completedAt?: string
  data: Record<string, any>
}

export interface PredictiveAnalytics {
  customerLifetimeValue: {
    segments: CLVSegment[]
    predictions: CLVPrediction[]
  }
  churnPrediction: {
    atRiskCustomers: string[]
    riskFactors: string[]
    retentionStrategies: RetentionStrategy[]
  }
  purchasePrediction: {
    nextPurchaseDate: NextPurchasePrediction[]
    recommendedProducts: ProductRecommendation[]
  }
  campaignPrediction: {
    expectedPerformance: CampaignPrediction[]
    optimizationSuggestions: string[]
  }
}

export interface CLVSegment {
  name: string
  size: number
  averageCLV: number
  clvRange: [number, number]
}

export interface CLVPrediction {
  customerId: string
  predictedCLV: number
  confidence: number
  factors: string[]
}

export interface RetentionStrategy {
  customerId: string
  strategy: string
  expectedRetentionRate: number
  recommendedActions: string[]
}

export interface NextPurchasePrediction {
  customerId: string
  predictedDate: string
  confidence: number
  recommendedProducts: string[]
}

export interface ProductRecommendation {
  customerId: string
  products: Array<{
    productId: string
    score: number
    reasoning: string
  }>
}

export interface CampaignPrediction {
  campaignId: string
  predictedROI: number
  predictedConversions: number
  confidence: number
  risks: string[]
}

export enum MarketingCampaignType {
  EMAIL = 'email',
  SMS = 'sms',
  SOCIAL = 'social',
  DISPLAY = 'display',
  SEARCH = 'search',
  AFFILIATE = 'affiliate',
  CONTENT = 'content',
  INFLUENCER = 'influencer'
}

export enum MarketingChannel {
  EMAIL = 'email',
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  GOOGLE_ADS = 'google_ads',
  TIKTOK = 'tiktok',
  PINTEREST = 'pinterest'
}

export enum MarketingCampaignStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Enterprise Features Suite Types
export interface SSOProvider {
  id: string
  name: string
  type: 'oauth' | 'saml' | 'ldap'
  config: SSOProviderConfig
  status: 'active' | 'inactive' | 'error'
  lastSynced?: string
  errorMessage?: string
  createdAt: string
  updatedAt: string
}

export interface SSOProviderConfig {
  clientId?: string
  clientSecret?: string
  authorizationUrl?: string
  tokenUrl?: string
  userInfoUrl?: string
  scopes?: string[]
  // SAML specific
  entityId?: string
  ssoUrl?: string
  certificate?: string
  // LDAP specific
  host?: string
  port?: number
  baseDN?: string
  bindDN?: string
  bindPassword?: string
}

export interface AuditLog {
  id: string
  userId?: string
  action: string
  resource: string
  resourceId?: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  ipAddress: string
  userAgent?: string
  location?: {
    country: string
    city: string
    timezone: string
  }
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
  metadata?: Record<string, any>
  timestamp: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export interface UserRole {
  id: string
  name: string
  description: string
  permissions: Permission[]
  isSystemRole: boolean
  createdAt: string
  updatedAt: string
}

export interface Permission {
  id: string
  resource: string
  action: string
  scope: 'global' | 'website' | 'team' | 'personal'
  conditions?: Record<string, any>
}

export interface DataRetentionPolicy {
  id: string
  name: string
  description: string
  resourceType: string
  retentionPeriod: number // in days
  action: 'delete' | 'archive' | 'anonymize'
  conditions?: Record<string, any>
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ComplianceReport {
  id: string
  type: 'gdpr' | 'ccpa' | 'hipaa' | 'soc2' | 'iso27001'
  period: {
    start: string
    end: string
  }
  status: 'generating' | 'completed' | 'failed'
  findings: ComplianceFinding[]
  recommendations: string[]
  score: number
  generatedAt: string
  generatedBy: string
}

export interface ComplianceFinding {
  id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: string
  title: string
  description: string
  resource?: string
  resourceId?: string
  evidence?: Record<string, any>
  remediation?: string
}

export interface EnterpriseSettings {
  security: {
    passwordPolicy: {
      minLength: number
      requireUppercase: boolean
      requireLowercase: boolean
      requireNumbers: boolean
      requireSymbols: boolean
      preventReuse: number
    }
    sessionTimeout: number
    mfaRequired: boolean
    ipWhitelist?: string[]
    loginAttempts: {
      maxAttempts: number
      lockoutDuration: number
    }
  }
  compliance: {
    gdprEnabled: boolean
    ccpaEnabled: boolean
    dataRetentionEnabled: boolean
    auditLoggingEnabled: boolean
    encryptionEnabled: boolean
  }
  integrations: {
    ssoEnabled: boolean
    ldapEnabled: boolean
    apiAccessEnabled: boolean
  }
  branding: {
    logo?: string
    primaryColor: string
    secondaryColor: string
    customDomain?: string
  }
}

export interface APIKey {
  id: string
  name: string
  key: string // hashed
  permissions: string[]
  rateLimit: {
    requests: number
    period: 'minute' | 'hour' | 'day'
  }
  lastUsed?: string
  expiresAt?: string
  isActive: boolean
  createdBy: string
  createdAt: string
}

export interface DataExport {
  id: string
  userId: string
  type: 'user_data' | 'website_data' | 'analytics_data' | 'full_backup'
  format: 'json' | 'csv' | 'xml' | 'pdf'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  downloadUrl?: string
  expiresAt?: string
  requestedAt: string
  completedAt?: string
  fileSize?: number
}

export interface SecurityIncident {
  id: string
  type: 'suspicious_login' | 'data_breach' | 'unauthorized_access' | 'policy_violation'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  affectedUsers?: string[]
  affectedResources?: string[]
  ipAddress?: string
  userAgent?: string
  detectedAt: string
  resolvedAt?: string
  resolution?: string
  notificationsSent: string[]
}

export enum AuditEventType {
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  USER_CREATED = 'user_created',
  USER_UPDATED = 'user_updated',
  USER_DELETED = 'user_deleted',
  WEBSITE_CREATED = 'website_created',
  WEBSITE_UPDATED = 'website_updated',
  WEBSITE_DELETED = 'website_deleted',
  ORDER_CREATED = 'order_created',
  ORDER_UPDATED = 'order_updated',
  PAYMENT_PROCESSED = 'payment_processed',
  INTEGRATION_ADDED = 'integration_added',
  INTEGRATION_REMOVED = 'integration_removed',
  TEMPLATE_PURCHASED = 'template_purchased',
  CAMPAIGN_LAUNCHED = 'campaign_launched',
  DATA_EXPORTED = 'data_exported',
  SECURITY_INCIDENT = 'security_incident',
  COMPLIANCE_VIOLATION = 'compliance_violation'
}

