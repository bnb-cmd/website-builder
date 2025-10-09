import {
  CampaignChannel,
  CampaignStatus,
  CampaignType,
  MarketingCampaign,
  Prisma
} from '@prisma/client'
import { BaseService } from './baseService'

const toJson = (value: unknown, fallback: unknown = {}): Prisma.InputJsonValue => {
  try {
    const candidate = value === undefined || value === null ? fallback : value
    return JSON.parse(JSON.stringify(candidate)) as Prisma.InputJsonValue
  } catch (error) {
    console.warn('Failed to serialise marketing suite JSON value', error)
    return JSON.parse(JSON.stringify(fallback)) as Prisma.InputJsonValue
  }
}

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
  subject: 'Unlock Growth with AI Marketing',
  preview: 'Discover how AI can boost your campaigns',
  body: 'Our platform automates targeting, optimisation and reporting so you can focus on strategy.',
  media: []
}

const DEFAULT_AUTOMATION: Array<Record<string, unknown>> = []
const DEFAULT_ANALYTICS: Array<Record<string, unknown>> = []
const DEFAULT_AI_INSIGHTS: Array<Record<string, unknown>> = []
const DEFAULT_AB_TESTS: Array<Record<string, unknown>> = []

type CampaignCreateData = {
  websiteId: string
  name: string
  type: CampaignType | string
  message?: string
  mediaUrls?: string[]
  targetAudience?: Record<string, unknown>
  schedule?: Record<string, unknown>
  content?: Record<string, unknown>
  automation?: Array<Record<string, unknown>>
}

type CampaignUpdateData = Partial<CampaignCreateData> & {
  status?: CampaignStatus | string
  analytics?: Array<Record<string, unknown>>
  aiInsights?: Array<Record<string, unknown>>
  abTests?: Array<Record<string, unknown>>
}

export class AIMarketingSuiteService extends BaseService<MarketingCampaign> {
  protected override getModelName(): string {
    return 'marketingCampaign'
  }

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

  async createCampaign(data: CampaignCreateData): Promise<MarketingCampaign> {
    this.validateRequired(data, ['websiteId', 'name', 'type'])

    const campaign = await this.prisma.marketingCampaign.create({
      data: {
        name: data.name,
        type: this.resolveCampaignType(data.type),
        status: CampaignStatus.DRAFT,
        message: data.message ?? DEFAULT_CONTENT.body,
        mediaUrls: data.mediaUrls ?? (DEFAULT_CONTENT.media as string[]),
        website: { connect: { id: data.websiteId } },
        channels: { set: [CampaignChannel.EMAIL] },
        targetAudience: toJson(data.targetAudience, DEFAULT_TARGET_AUDIENCE),
        schedule: toJson(data.schedule, DEFAULT_SCHEDULE),
        content: toJson(data.content, DEFAULT_CONTENT),
        automation: toJson(data.automation, DEFAULT_AUTOMATION),
        analytics: toJson(DEFAULT_ANALYTICS),
        aiInsights: toJson(DEFAULT_AI_INSIGHTS),
        abTests: toJson(DEFAULT_AB_TESTS)
      }
    })

    await this.invalidateCache(`marketing-campaign:list:${data.websiteId}`)
    return campaign
  }

  async updateCampaign(id: string, data: CampaignUpdateData): Promise<MarketingCampaign> {
    this.validateId(id)

    const update: Prisma.MarketingCampaignUpdateInput = {
      updatedAt: new Date()
    }

    if (data.name !== undefined) update.name = data.name
    if (data.message !== undefined) update.message = data.message
    if (data.mediaUrls !== undefined) update.mediaUrls = data.mediaUrls
    if (data.type !== undefined) update.type = this.resolveCampaignType(data.type)
    if (data.status !== undefined) update.status = this.resolveCampaignStatus(data.status)
    if (data.targetAudience !== undefined) update.targetAudience = toJson(data.targetAudience, DEFAULT_TARGET_AUDIENCE)
    if (data.schedule !== undefined) update.schedule = toJson(data.schedule, DEFAULT_SCHEDULE)
    if (data.content !== undefined) update.content = toJson(data.content, DEFAULT_CONTENT)
    if (data.automation !== undefined) update.automation = toJson(data.automation, DEFAULT_AUTOMATION)
    if (data.analytics !== undefined) update.analytics = toJson(data.analytics, DEFAULT_ANALYTICS)
    if (data.aiInsights !== undefined) update.aiInsights = toJson(data.aiInsights, DEFAULT_AI_INSIGHTS)
    if (data.abTests !== undefined) update.abTests = toJson(data.abTests, DEFAULT_AB_TESTS)

    const campaign = await this.prisma.marketingCampaign.update({ where: { id }, data: update })

    await this.invalidateCache(`marketing-campaign:detail:${id}`)
    await this.invalidateCache(`marketing-campaign:list:${campaign.websiteId}`)
    return campaign
  }

  async launchCampaign(id: string): Promise<void> {
    await this.updateCampaign(id, { status: CampaignStatus.RUNNING })
    await this.generateAIInsights(id)
  }

  async generateAIInsights(id: string): Promise<Array<Record<string, unknown>>> {
    const insights = [
      {
        type: 'timing',
        summary: 'Emails sent at 10 AM get 18% more opens',
        recommendedAction: 'Schedule next campaign at 10 AM',
        confidence: 0.78
      },
      {
        type: 'audience',
        summary: 'Returning customers convert 2x more often',
        recommendedAction: 'Create a dedicated returning customer segment',
        confidence: 0.72
      }
    ]

    await this.prisma.marketingCampaign.update({
      where: { id },
      data: { aiInsights: toJson(insights, []) }
    })

    return insights
  }

  async generateAudienceSegments(websiteId: string): Promise<Array<Record<string, unknown>>> {
    return [
      {
        id: 'high-value',
        name: 'High Value Customers',
        size: 320,
        conversionRate: 0.18,
        averageOrderValue: 2450
      },
      {
        id: 'at-risk',
        name: 'At Risk Customers',
        size: 560,
        conversionRate: 0.04,
        averageOrderValue: 980
      }
    ]
  }

  async generatePredictiveAnalytics(_websiteId: string): Promise<Array<Record<string, unknown>>> {
    return [
      {
        metric: 'projected_revenue',
        predictedValue: 48000,
        confidence: 0.74,
        timeframe: 'next_30_days'
      },
      {
        metric: 'projected_conversions',
        predictedValue: 290,
        confidence: 0.69,
        timeframe: 'next_30_days'
      }
    ]
  }

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
      }))
    }

    await this.prisma.marketingCampaign.update({
      where: { id: campaignId },
      data: { abTests: toJson(abTest, []) }
    })

    return abTest
  }

  async getCampaignAnalytics(
    _campaignId: string,
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
        conversions: 6 + Math.floor(index / 2),
        revenue: 1200 + index * 60
      }
    })

    const totals = timeline.reduce(
      (acc, day) => {
        acc.impressions += day.impressions
        acc.clicks += day.clicks
        acc.conversions += day.conversions
        acc.revenue += day.revenue
        return acc
      },
      { impressions: 0, clicks: 0, conversions: 0, revenue: 0 }
    )

    return {
      overview: {
        impressions: totals.impressions,
        clicks: totals.clicks,
        conversions: totals.conversions,
        revenue: totals.revenue,
        roi: 2.3
      },
      channels: [
        {
          channel: CampaignChannel.EMAIL,
          impressions: 15000,
          clicks: 1200,
          conversions: 120,
          cost: 500,
          ctr: 8,
          cpc: 0.42,
          cpa: 4.17,
          roas: 4.8
        }
      ],
      timeline
    }
  }

  private resolveCampaignType(type: CampaignType | string): CampaignType {
    if (Object.values(CampaignType).includes(type as CampaignType)) {
      return type as CampaignType
    }

    const normalised = String(type).toUpperCase().replace(/\s+/g, '_')
    return (CampaignType as Record<string, CampaignType>)[normalised] ?? CampaignType.EMAIL
  }

  private resolveCampaignStatus(status: CampaignStatus | string): CampaignStatus {
    if (Object.values(CampaignStatus).includes(status as CampaignStatus)) {
      return status as CampaignStatus
    }

    const normalised = String(status).toUpperCase().replace(/\s+/g, '_')
    return (CampaignStatus as Record<string, CampaignStatus>)[normalised] ?? CampaignStatus.DRAFT
  }
}

export const aiMarketingSuiteService = new AIMarketingSuiteService()
