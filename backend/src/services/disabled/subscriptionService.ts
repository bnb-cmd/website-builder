import { Subscription, SubscriptionTier, SubscriptionInterval, Language } from '@prisma/client'
import { BaseService } from './baseService'
import { PaymentService } from './paymentService'
import { PaymentGateway, PaymentPurpose } from '@prisma/client'

export interface CreateSubscriptionData {
  name: string
  description?: string
  slug: string
  tier: SubscriptionTier
  price: number
  currency: string
  interval: SubscriptionInterval
  maxWebsites: number
  maxPages?: number
  maxProducts?: number
  maxStorage?: number
  customDomain: boolean
  aiGenerations?: number
  prioritySupport: boolean
  paymentIntegrations: boolean
  advancedAnalytics: boolean
  aiPrioritySupport: boolean
  aiMonthlyQuota?: number
  aiTokenAllowance?: number
  allowedLanguages: Language[]
  isDefault?: boolean
}

export interface SubscriptionWithFeatures extends Subscription {
  features: {
    maxWebsites: number
    maxPages?: number
    maxProducts?: number
    maxStorage?: number
    customDomain: boolean
    aiGenerations?: number
    prioritySupport: boolean
    paymentIntegrations: boolean
    advancedAnalytics: boolean
    aiPrioritySupport: boolean
    aiMonthlyQuota?: number
    aiTokenAllowance?: number
    allowedLanguages: Language[]
  }
}

export interface UpgradeSubscriptionData {
  userId: string
  subscriptionId: string
  paymentGateway: PaymentGateway
  customerEmail: string
  customerPhone?: string
}

export interface SubscriptionUpgradeResult {
  success: boolean
  paymentId: string
  redirectUrl: string
  clientSecret: string
  error: string
}

export class SubscriptionService extends BaseService<Subscription> {
  private paymentService: PaymentService

  constructor() {
    super()
    this.paymentService = new PaymentService()
  }

  protected getModelName(): string {
    return 'subscription'
  }

  // Base methods
  override async create(data: CreateSubscriptionData): Promise<Subscription> {
    return await this.prisma.subscription.create({ data })
  }

  override async findById(id: string): Promise<Subscription | null> {
    return await this.prisma.subscription.findUnique({ where: { id } })
  }

  async findBySlug(slug: string): Promise<Subscription | null> {
    return await this.prisma.subscription.findUnique({ where: { slug } })
  }

  override async findAll(filters?: any): Promise<Subscription[]> {
    return await this.prisma.subscription.findMany({ 
      where: filters,
      orderBy: { price: 'asc' }
    })
  }

  override async update(id: string, data: Partial<Subscription>): Promise<Subscription> {
    return await this.prisma.subscription.update({ where: { id }, data })
  }

  override async delete(id: string): Promise<boolean> {
    await this.prisma.subscription.delete({ where: { id } })
    return true
  }

  // Get subscription with features
  async getSubscriptionWithFeatures(id: string): Promise<SubscriptionWithFeatures | null> {
    const subscription = await this.findById(id)
    if (!subscription) return null

    return {
      ...subscription,
      features: {
        maxWebsites: subscription.maxWebsites,
        maxPages: subscription.maxPages,
        maxProducts: subscription.maxProducts,
        maxStorage: subscription.maxStorage,
        customDomain: subscription.customDomain,
        aiGenerations: subscription.aiGenerations,
        prioritySupport: subscription.prioritySupport,
        paymentIntegrations: subscription.paymentIntegrations,
        advancedAnalytics: subscription.advancedAnalytics,
        aiPrioritySupport: subscription.aiPrioritySupport,
        aiMonthlyQuota: subscription.aiMonthlyQuota,
        aiTokenAllowance: subscription.aiTokenAllowance,
        allowedLanguages: subscription.allowedLanguages
      }
    }
  }

  // Get all available subscriptions
  async getAvailableSubscriptions(): Promise<SubscriptionWithFeatures[]> {
    const subscriptions = await this.findAll({ status: 'ACTIVE' })
    return Promise.all(
      subscriptions.map(sub => this.getSubscriptionWithFeatures(sub.id))
    ).then(results => results.filter(Boolean) as SubscriptionWithFeatures[])
  }

  // Get default subscription
  async getDefaultSubscription(): Promise<SubscriptionWithFeatures | null> {
    const subscription = await this.prisma.subscription.findFirst({
      where: { isDefault: true, status: 'ACTIVE' }
    })
    
    if (!subscription) return null
    return this.getSubscriptionWithFeatures(subscription.id)
  }

  // Upgrade user subscription
  async upgradeSubscription(data: UpgradeSubscriptionData): Promise<SubscriptionUpgradeResult> {
    try {
      const { userId, subscriptionId, paymentGateway, customerEmail, customerPhone } = data

      // Get user and subscription details
      const user = await this.prisma.user.findUnique({ where: { id: userId } })
      const subscription = await this.findById(subscriptionId)

      if (!user) {
        return { success: false, error: 'User not found' }
      }

      if (!subscription) {
        return { success: false, error: 'Subscription not found' }
      }

      // Check if user already has this subscription
      if (user.subscriptionId === subscriptionId) {
        return { success: false, error: 'User already has this subscription' }
      }

      // Create payment intent
      const paymentResult = await this.paymentService.createPaymentIntent({
        amount: subscription.price.toNumber(),
        currency: subscription.currency,
        orderId: `sub_upgrade_${userId}_${Date.now()}`,
        customerEmail,
        gateway: paymentGateway,
        metadata: {
          userId,
          subscriptionId,
          purpose: PaymentPurpose.PLATFORM_SUBSCRIPTION,
          customerPhone: customerPhone || ''
        }
      })

      if (!paymentResult.success) {
        return { success: false, error: paymentResult.error }
      }

      return {
        success: true,
        paymentId: paymentResult.paymentId || '',
        redirectUrl: paymentResult.redirectUrl || '',
        clientSecret: paymentResult.clientSecret || '',
        error: ''
      }
    } catch (error) {
      console.error('Subscription upgrade failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Subscription upgrade failed'
      }
    }
  }

  // Confirm subscription upgrade
  async confirmSubscriptionUpgrade(paymentId: string): Promise<boolean> {
    try {
      const payment = await this.paymentService.findById(paymentId)
      if (!payment) {
        throw new Error('Payment not found')
      }

      if (payment.status !== 'COMPLETED') {
        throw new Error('Payment not completed')
      }

      const metadata = payment.gatewayData?.metadata || {}
      const userId = metadata.userId
      const subscriptionId = metadata.subscriptionId

      if (!userId || !subscriptionId) {
        throw new Error('Invalid payment metadata')
      }

      // Update user subscription
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionId,
          aiQuotaResetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        }
      })

      // Update payment record
      await this.paymentService.update(paymentId, {
        userId,
        subscriptionId,
        purpose: PaymentPurpose.PLATFORM_SUBSCRIPTION
      })

      return true
    } catch (error) {
      console.error('Subscription upgrade confirmation failed:', error)
      return false
    }
  }

  // Check user subscription limits
  async checkUserLimits(userId: string): Promise<{
    canCreateWebsite: boolean
    canCreatePage: boolean
    canCreateProduct: boolean
    canUseCustomDomain: boolean
    canUsePaymentIntegration: boolean
    canUseAdvancedAnalytics: boolean
    aiQuotaRemaining: number
    websitesCount: number
    pagesCount: number
    productsCount: number
  }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          subscription: true,
          websites: {
            include: {
              pages: true,
              products: true
            }
          }
        }
      })

      if (!user) {
        throw new Error('User not found')
      }

      const subscription = user.subscription
      const websites = user.websites || []
      const totalPages = websites.reduce((sum, site) => sum + (site.pages?.length || 0), 0)
      const totalProducts = websites.reduce((sum, site) => sum + (site.products?.length || 0), 0)

      // Calculate AI quota remaining
      const aiQuotaRemaining = subscription?.aiMonthlyQuota 
        ? Math.max(0, subscription.aiMonthlyQuota - (user.aiQuotaUsed || 0))
        : 0

      return {
        canCreateWebsite: !subscription || websites.length < subscription.maxWebsites,
        canCreatePage: !subscription || !subscription.maxPages || totalPages < subscription.maxPages,
        canCreateProduct: !subscription || !subscription.maxProducts || totalProducts < subscription.maxProducts,
        canUseCustomDomain: subscription?.customDomain || false,
        canUsePaymentIntegration: subscription?.paymentIntegrations || false,
        canUseAdvancedAnalytics: subscription?.advancedAnalytics || false,
        aiQuotaRemaining,
        websitesCount: websites.length,
        pagesCount: totalPages,
        productsCount: totalProducts
      }
    } catch (error) {
      console.error('User limits check failed:', error)
      throw error
    }
  }

  // Reset AI quota for user
  async resetUserAIQuota(userId: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          aiQuotaUsed: 0,
          aiQuotaResetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        }
      })
    } catch (error) {
      console.error('AI quota reset failed:', error)
      throw error
    }
  }

  // Initialize default subscriptions
  async initializeDefaultSubscriptions(): Promise<void> {
    try {
      const existingSubscriptions = await this.findAll()
      if (existingSubscriptions.length > 0) {
        console.log('Subscriptions already initialized')
        return
      }

      const defaultSubscriptions: CreateSubscriptionData[] = [
        {
          name: 'Free Plan',
          description: 'Perfect for getting started with basic website building',
          slug: 'free',
          tier: SubscriptionTier.FREE,
          price: 0,
          currency: 'PKR',
          interval: SubscriptionInterval.MONTHLY,
          maxWebsites: 1,
          maxPages: 5,
          maxProducts: 10,
          maxStorage: 100, // 100MB
          customDomain: false,
          aiGenerations: 5,
          prioritySupport: false,
          paymentIntegrations: false,
          advancedAnalytics: false,
          aiPrioritySupport: false,
          aiMonthlyQuota: 5,
          aiTokenAllowance: 1000,
          allowedLanguages: [Language.ENGLISH, Language.URDU],
          isDefault: true
        },
        {
          name: 'Pro Plan',
          description: 'Advanced features for growing businesses',
          slug: 'pro',
          tier: SubscriptionTier.PRO,
          price: 2999,
          currency: 'PKR',
          interval: SubscriptionInterval.MONTHLY,
          maxWebsites: 5,
          maxPages: 50,
          maxProducts: 100,
          maxStorage: 1000, // 1GB
          customDomain: true,
          aiGenerations: 100,
          prioritySupport: true,
          paymentIntegrations: true,
          advancedAnalytics: true,
          aiPrioritySupport: true,
          aiMonthlyQuota: 100,
          aiTokenAllowance: 10000,
          allowedLanguages: [Language.ENGLISH, Language.URDU, Language.PUNJABI],
          isDefault: false
        },
        {
          name: 'Agency Plan',
          description: 'Complete solution for agencies and enterprises',
          slug: 'agency',
          tier: SubscriptionTier.AGENCY,
          price: 9999,
          currency: 'PKR',
          interval: SubscriptionInterval.MONTHLY,
          maxWebsites: 50,
          maxPages: 500,
          maxProducts: 1000,
          maxStorage: 10000, // 10GB
          customDomain: true,
          aiGenerations: 1000,
          prioritySupport: true,
          paymentIntegrations: true,
          advancedAnalytics: true,
          aiPrioritySupport: true,
          aiMonthlyQuota: 1000,
          aiTokenAllowance: 100000,
          allowedLanguages: [Language.ENGLISH, Language.URDU, Language.PUNJABI, Language.SINDHI, Language.PASHTO],
          isDefault: false
        }
      ]

      for (const subscriptionData of defaultSubscriptions) {
        await this.create(subscriptionData)
      }

      console.log('Default subscriptions initialized successfully')
    } catch (error) {
      console.error('Failed to initialize default subscriptions:', error)
      throw error
    }
  }

  // Get subscription analytics
  async getSubscriptionAnalytics(): Promise<{
    totalSubscriptions: number
    subscriptionsByTier: Record<string, number>
    totalRevenue: number
    monthlyRecurringRevenue: number
  }> {
    try {
      const [
        totalSubscriptions,
        subscriptionsByTier,
        revenueStats
      ] = await Promise.all([
        this.prisma.subscription.count(),
        this.prisma.subscription.groupBy({
          by: ['tier'],
          _count: { tier: true }
        }),
        this.prisma.subscription.aggregate({
          _sum: { price: true }
        })
      ])

      const tierStats = subscriptionsByTier.reduce((acc, stat) => {
        acc[stat.tier] = stat._count.tier
        return acc
      }, {} as Record<string, number>)

      const totalRevenue = revenueStats._sum.price?.toNumber() || 0

      return {
        totalSubscriptions,
        subscriptionsByTier: tierStats,
        totalRevenue,
        monthlyRecurringRevenue: totalRevenue // Simplified - in real app, calculate based on active subscriptions
      }
    } catch (error) {
      console.error('Subscription analytics failed:', error)
      throw error
    }
  }
}
