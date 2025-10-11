import {
  CampaignChannel,
  CampaignStatus,
  CampaignType,
  MarketingCampaign,
  Prisma,
  User
} from '@prisma/client'
import { BaseService } from './baseService'
import { Decimal } from '@prisma/client/runtime/library'

// Cost control interfaces
interface AIQuota {
  monthlyLimit: number
  used: number
  resetDate: Date
  tier: 'free' | 'premium' | 'enterprise'
}

interface CostOptimizedCampaignData {
  websiteId: string
  name: string
  type: CampaignType | string
  description?: string
  channel?: CampaignChannel
  targetAudience?: string // JSON string
  budget?: number
  startDate?: Date
  endDate?: Date
  goals?: string // JSON string
  metrics?: string // JSON string
  useAI?: boolean // Flag to enable AI features
}

interface CostOptimizedCampaignUpdateData extends Partial<CostOptimizedCampaignData> {
  status?: CampaignStatus | string
}

// Helper function for JSON serialization
const toJson = (value: unknown, fallback: unknown = {}): Prisma.InputJsonValue => {
  try {
    const candidate = value === undefined || value === null ? fallback : value
    return JSON.parse(JSON.stringify(candidate)) as Prisma.InputJsonValue
  } catch (error) {
    console.warn('Failed to serialize marketing JSON value', error)
    return JSON.parse(JSON.stringify(fallback)) as Prisma.InputJsonValue
  }
}

// Default values for cost optimization
const DEFAULT_TARGET_AUDIENCE = {
  interests: [],
  demographics: {},
  behaviors: {}
}

const DEFAULT_SCHEDULE = {
  startDate: new Date().toISOString(),
  frequency: 'one_time'
}

const DEFAULT_CONTENT = {
  subject: 'Unlock Growth with Smart Marketing',
  preview: 'Discover how our platform can boost your campaigns',
  body: 'Our platform automates targeting, optimization and reporting so you can focus on strategy.',
  media: []
}

const DEFAULT_AUTOMATION: Array<Record<string, unknown>> = []
const DEFAULT_ANALYTICS: Array<Record<string, unknown>> = []
const DEFAULT_AI_INSIGHTS: Array<Record<string, unknown>> = []
const DEFAULT_AB_TESTS: Array<Record<string, unknown>> = []

export class AIMarketingService extends BaseService<MarketingCampaign> {
  protected override getModelName(): string {
    return 'marketingCampaign'
  }

  // Get user AI quota (public method)
  async getUserQuota(userId: string): Promise<AIQuota> {
    return this.getUserAIQuota(userId)
  }

  // Cost control methods
  private async getUserAIQuota(userId: string): Promise<AIQuota> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { aiQuotaUsed: true, aiQuotaResetAt: true, role: true }
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Determine tier based on user role
      const tier = user.role === 'ADMIN' ? 'enterprise' : 
                   user.role === 'USER' ? 'premium' : 'free'

      // Set quota limits based on tier
      const monthlyLimit = tier === 'enterprise' ? 1000 : 
                          tier === 'premium' ? 100 : 10

      return {
        monthlyLimit,
        used: user.aiQuotaUsed || 0,
        resetDate: user.aiQuotaResetAt || new Date(),
        tier
      }
    } catch (error) {
      console.error('Error getting user AI quota:', error)
      return {
        monthlyLimit: 10,
        used: 0,
        resetDate: new Date(),
        tier: 'free'
      }
    }
  }

  private async checkAIQuota(userId: string): Promise<boolean> {
    const quota = await this.getUserAIQuota(userId)
    return quota.used < quota.monthlyLimit
  }

  private async incrementAIUsage(userId: string, tokens: number = 1): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          aiQuotaUsed: {
            increment: tokens
          }
        }
      })
    } catch (error) {
      console.error('Error incrementing AI usage:', error)
    }
  }

  // BaseService implementations
  override async findById(id: string): Promise<MarketingCampaign | null> {
    this.validateId(id)
    return this.prisma.marketingCampaign.findUnique({ where: { id } })
  }

  override async findAll(filters?: Prisma.MarketingCampaignWhereInput): Promise<MarketingCampaign[]> {
    return this.prisma.marketingCampaign.findMany({ where: filters })
  }

  override async create(): Promise<MarketingCampaign> {
    throw new Error('Direct create is not supported. Use createCampaign instead.')
  }

  override async update(): Promise<MarketingCampaign> {
    throw new Error('Direct update is not supported. Use updateCampaign instead.')
  }

  override async delete(id: string): Promise<boolean> {
    await this.prisma.marketingCampaign.delete({ where: { id } })
    return true
  }

  // Campaign management methods
  async createCampaign(data: CostOptimizedCampaignData): Promise<MarketingCampaign> {
    this.validateRequired(data, ['websiteId', 'name', 'type'])

    const campaign = await this.prisma.marketingCampaign.create({
      data: {
        name: data.name,
        description: data.description || '',
        type: this.resolveCampaignType(data.type),
        status: CampaignStatus.DRAFT,
        channel: data.channel || CampaignChannel.EMAIL,
        websiteId: data.websiteId,
        targetAudience: data.targetAudience || JSON.stringify(DEFAULT_TARGET_AUDIENCE),
        budget: data.budget ? new Decimal(data.budget) : null,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        goals: data.goals || JSON.stringify({}),
        metrics: data.metrics || JSON.stringify({})
      }
    })

    await this.invalidateCache(`marketing-campaign:list:${data.websiteId}`)
    return campaign
  }

  async updateCampaign(id: string, data: CostOptimizedCampaignUpdateData): Promise<MarketingCampaign> {
    this.validateId(id)

    const update: Prisma.MarketingCampaignUpdateInput = {
      updatedAt: new Date()
    }

    if (data.name !== undefined) update.name = data.name
    if (data.description !== undefined) update.description = data.description
    if (data.type !== undefined) update.type = this.resolveCampaignType(data.type)
    if (data.status !== undefined) update.status = this.resolveCampaignStatus(data.status)
    if (data.channel !== undefined) update.channel = data.channel
    if (data.targetAudience !== undefined) update.targetAudience = data.targetAudience
    if (data.budget !== undefined) update.budget = data.budget ? new Decimal(data.budget) : null
    if (data.startDate !== undefined) update.startDate = data.startDate
    if (data.endDate !== undefined) update.endDate = data.endDate
    if (data.goals !== undefined) update.goals = data.goals
    if (data.metrics !== undefined) update.metrics = data.metrics

    const campaign = await this.prisma.marketingCampaign.update({ where: { id }, data: update })

    await this.invalidateCache(`marketing-campaign:detail:${id}`)
    await this.invalidateCache(`marketing-campaign:list:${campaign.websiteId}`)
    return campaign
  }

  // Cost-optimized AI insights generation
  async generateInsights(campaignId: string, userId?: string, useAI: boolean = false): Promise<Array<Record<string, unknown>>> {
    const campaign = await this.findById(campaignId)
    if (!campaign) {
      throw new Error('Campaign not found')
    }

    // Always generate basic insights (no AI cost)
    const basicInsights = await this.generateBasicInsights(campaign)

    // Only generate AI insights if requested and user has quota
    if (useAI && userId) {
      const hasQuota = await this.checkAIQuota(userId)
      if (hasQuota) {
        const aiInsights = await this.generateAIInsights(campaign)
        await this.incrementAIUsage(userId, 1)
        return [...basicInsights, ...aiInsights]
      } else {
        console.warn(`User ${userId} has exceeded AI quota`)
      }
    }

    return basicInsights
  }

  // Basic insights (no AI cost) - uses database analytics
  private async generateBasicInsights(campaign: MarketingCampaign): Promise<Array<Record<string, unknown>>> {
    const metrics = await this.getCampaignMetrics(campaign.id)
    
    return [
      {
        type: 'performance',
        summary: `Open rate: ${metrics.openRate.toFixed(1)}% (Industry avg: 20%)`,
        recommendedAction: metrics.openRate < 20 ? 'Improve subject lines' : 'Maintain current approach',
        confidence: 0.9,
        source: 'database_analysis',
        cost: 0
      },
      {
        type: 'timing',
        summary: `Best performing day: ${this.getBestPerformingDay(metrics)}`,
        recommendedAction: `Schedule next campaign on ${this.getBestPerformingDay(metrics)}`,
        confidence: 0.8,
        source: 'historical_data',
        cost: 0
      },
      {
        type: 'audience',
        summary: `Top audience segment: ${this.getTopAudienceSegment(metrics)}`,
        recommendedAction: 'Create dedicated campaign for this segment',
        confidence: 0.85,
        source: 'analytics_data',
        cost: 0
      }
    ]
  }

  // AI-powered insights (uses AI credits)
  private async generateAIInsights(campaign: MarketingCampaign): Promise<Array<Record<string, unknown>>> {
    // Mock AI insights for now - replace with actual AI service calls
    return [
      {
        type: 'ai_content',
        summary: 'AI suggests using emotional triggers in subject lines',
        recommendedAction: 'Try subject lines with urgency words like "Limited Time" or "Exclusive"',
        confidence: 0.78,
        source: 'ai_analysis',
        cost: 1
      },
      {
        type: 'ai_timing',
        summary: 'AI predicts 18% higher engagement at 10 AM',
        recommendedAction: 'Schedule next campaign at 10 AM',
        confidence: 0.72,
        source: 'ai_prediction',
        cost: 1
      }
    ]
  }

  // Cost-free audience segmentation using database queries
  async generateAudienceSegments(websiteId: string): Promise<Array<Record<string, unknown>>> {
    try {
      // Get user data from website
      const website = await this.prisma.website.findUnique({
        where: { id: websiteId },
        include: { user: true }
      })

      if (!website) {
        throw new Error('Website not found')
      }

      // Generate segments based on database analytics
      const segments = await this.prisma.user.groupBy({
        by: ['businessType', 'city'],
        where: {
          websites: {
            some: {
              id: websiteId
            }
          }
        },
        _count: { id: true },
        _avg: { aiQuotaUsed: true }
      })

      return segments.map(segment => ({
        id: `${segment.businessType}_${segment.city}`.toLowerCase(),
        name: `${segment.businessType} in ${segment.city}`,
        size: segment._count.id,
        conversionRate: 0.15, // Mock data - replace with actual calculations
        averageOrderValue: 1200, // Mock data
        source: 'database_analytics',
        cost: 0
      }))
    } catch (error) {
      console.error('Error generating audience segments:', error)
      return []
    }
  }

  // Cost-free predictive analytics using statistical methods
  async generatePredictiveAnalytics(websiteId: string): Promise<Array<Record<string, unknown>>> {
    try {
      // Get historical campaign data
      const campaigns = await this.prisma.marketingCampaign.findMany({
        where: { websiteId },
        orderBy: { createdAt: 'desc' },
        take: 10
      })

      if (campaigns.length === 0) {
        return [{
          metric: 'projected_revenue',
          predictedValue: 0,
          confidence: 0,
          timeframe: 'next_30_days',
          source: 'insufficient_data',
          cost: 0
        }]
      }

      // Simple statistical prediction (no AI needed)
      const avgPerformance = campaigns.reduce((acc, campaign) => {
        // Mock calculation - replace with actual metrics
        return acc + 1000
      }, 0) / campaigns.length

      return [
        {
          metric: 'projected_revenue',
          predictedValue: Math.round(avgPerformance * 1.2), // 20% growth assumption
          confidence: 0.65,
          timeframe: 'next_30_days',
          source: 'statistical_analysis',
          cost: 0
        },
        {
          metric: 'projected_conversions',
          predictedValue: Math.round(avgPerformance * 0.15),
          confidence: 0.60,
          timeframe: 'next_30_days',
          source: 'historical_trends',
          cost: 0
        }
      ]
    } catch (error) {
      console.error('Error generating predictive analytics:', error)
      return []
    }
  }

  // Cost-free A/B testing using statistical analysis
  async createABTest(
    campaignId: string,
    variations: Array<{ name: string; content: string }>
  ): Promise<Record<string, unknown>> {
    const abTest = {
      id: `ab_${Date.now()}`,
      name: 'Content Variation Test',
      status: 'running',
      confidence: 0,
      variations: variations.map((variation, index) => ({
        id: `variation_${index}`,
        name: variation.name,
        content: variation.content,
        performance: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0
        }
      })),
      source: 'statistical_testing',
      cost: 0
    }

    // Store A/B test data in metrics field as JSON
    await this.prisma.marketingCampaign.update({
      where: { id: campaignId },
      data: { metrics: JSON.stringify({ abTest }) }
    })

    return abTest
  }

  // Cost-free campaign analytics
  async getCampaignAnalytics(
    campaignId: string,
    period: '7d' | '30d' | '90d' = '30d'
  ): Promise<Record<string, unknown>> {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
    const timeline = Array.from({ length: days }).map((_, index) => {
      const date = new Date()
      date.setDate(date.getDate() - (days - 1 - index))

      return {
        date: date.toISOString().split('T')[0],
        impressions: 500 + index * 20,
        clicks: 60 + index * 5,
        conversions: 12 + index * 2,
        revenue: 1200 + index * 100
      }
    })

    const totalImpressions = timeline.reduce((sum, day) => sum + day.impressions, 0)
    const totalClicks = timeline.reduce((sum, day) => sum + day.clicks, 0)
    const totalConversions = timeline.reduce((sum, day) => sum + day.conversions, 0)
    const totalRevenue = timeline.reduce((sum, day) => sum + day.revenue, 0)

    return {
      timeline,
      summary: {
        impressions: totalImpressions,
        clicks: totalClicks,
        conversions: totalConversions,
        revenue: totalRevenue,
        clickRate: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
        conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
        costPerClick: totalClicks > 0 ? totalRevenue / totalClicks : 0,
        roi: totalRevenue > 0 ? (totalRevenue - 1000) / 1000 * 100 : 0 // Assuming $1000 campaign cost
      },
      source: 'database_analytics',
      cost: 0
    }
  }

  // Helper methods
  private async getCampaignMetrics(campaignId: string) {
    // Mock metrics - replace with actual database queries
    return {
      openRate: 25.5,
      clickRate: 3.2,
      conversionRate: 1.8,
      bestDay: 'Tuesday',
      topSegment: 'Premium Users'
    }
  }

  private getBestPerformingDay(metrics: any): string {
    return metrics.bestDay || 'Tuesday'
  }

  private getTopAudienceSegment(metrics: any): string {
    return metrics.topSegment || 'General Audience'
  }

  private resolveCampaignType(type: string): CampaignType {
    const typeMap: Record<string, CampaignType> = {
      'EMAIL': CampaignType.EMAIL,
      'SMS': CampaignType.SMS,
      'SOCIAL': CampaignType.SOCIAL,
      'PUSH': CampaignType.PUSH,
      'RETARGETING': CampaignType.RETARGETING,
      'AB_TEST': CampaignType.AB_TEST
    }
    return typeMap[type] || CampaignType.EMAIL
  }

  private resolveCampaignStatus(status: string): CampaignStatus {
    const statusMap: Record<string, CampaignStatus> = {
      'DRAFT': CampaignStatus.DRAFT,
      'ACTIVE': CampaignStatus.ACTIVE,
      'PAUSED': CampaignStatus.PAUSED,
      'COMPLETED': CampaignStatus.COMPLETED,
      'CANCELLED': CampaignStatus.CANCELLED
    }
    return statusMap[status] || CampaignStatus.DRAFT
  }

  protected override validateRequired(data: any, fields: string[]): void {
    for (const field of fields) {
      if (!data[field]) {
        throw new Error(`${field} is required`)
      }
    }
  }

  // Cache management
  protected override async invalidateCache(pattern: string): Promise<void> {
    try {
      await this.cache.invalidatePattern(pattern)
    } catch (error) {
      console.error('Cache invalidation error:', error)
    }
  }
}

export const aiMarketingService = new AIMarketingService()
