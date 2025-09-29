import { WebsiteAnalytics, AnalyticsPeriod } from '@prisma/client'
import { BaseService } from './baseService'

export interface AnalyticsData {
  pageViews: number
  uniqueVisitors: number
  bounceRate: number
  avgSessionDuration: number
  conversionRate: number
  revenue: number
  orders: number
  avgOrderValue: number
  organicTraffic: number
  socialTraffic: number
  directTraffic: number
  referralTraffic: number
  mobileTraffic: number
  desktopTraffic: number
  tabletTraffic: number
  topCountries: Record<string, number>
  topCities: Record<string, number>
  pageLoadTime: number
  coreWebVitals: {
    lcp: number
    fid: number
    cls: number
  }
}

export interface PredictiveInsights {
  predictedRevenue: number
  predictedTraffic: number
  recommendedActions: string[]
  riskFactors: string[]
  opportunities: string[]
}

export class AnalyticsService extends BaseService<WebsiteAnalytics> {

  protected override getModelName(): string {
    return 'websiteAnalytics'
  }

  async createAnalytics(websiteId: string, data: AnalyticsData, period: AnalyticsPeriod, date: Date): Promise<WebsiteAnalytics> {
    try {
      this.validateId(websiteId)
      return await this.prisma.websiteAnalytics.create({
        data: {
          websiteId,
          ...data,
          period,
          date,
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async getAnalytics(websiteId: string, period: AnalyticsPeriod, startDate: Date, endDate: Date): Promise<WebsiteAnalytics[]> {
    try {
      this.validateId(websiteId)
      return await this.prisma.websiteAnalytics.findMany({
        where: {
          websiteId,
          period,
          date: {
            gte: startDate,
            lte: endDate,
          }
        },
        orderBy: { date: 'asc' }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async getPredictiveInsights(websiteId: string): Promise<PredictiveInsights> {
    try {
      this.validateId(websiteId)
      
      // Get recent analytics data for prediction
      const recentData = await this.prisma.websiteAnalytics.findMany({
        where: { websiteId },
        orderBy: { date: 'desc' },
        take: 30 // Last 30 data points
      })

      if (recentData.length === 0) {
        return {
          predictedRevenue: 0,
          predictedTraffic: 0,
          recommendedActions: ['Start collecting analytics data'],
          riskFactors: ['No historical data available'],
          opportunities: ['Implement analytics tracking']
        }
      }

      // Simple trend analysis (in a real implementation, you'd use ML models)
      const avgRevenue = recentData.reduce((sum, data) => sum + data.revenue.toNumber(), 0) / recentData.length
      const avgTraffic = recentData.reduce((sum, data) => sum + data.pageViews, 0) / recentData.length
      
      // Calculate trends
      const recentRevenue = recentData.slice(0, 7).reduce((sum, data) => sum + data.revenue.toNumber(), 0) / 7
      const olderRevenue = recentData.slice(7, 14).reduce((sum, data) => sum + data.revenue.toNumber(), 0) / 7
      const revenueTrend = recentRevenue > olderRevenue ? 1.1 : 0.9

      const recentTraffic = recentData.slice(0, 7).reduce((sum, data) => sum + data.pageViews, 0) / 7
      const olderTraffic = recentData.slice(7, 14).reduce((sum, data) => sum + data.pageViews, 0) / 7
      const trafficTrend = recentTraffic > olderTraffic ? 1.05 : 0.95

      const predictedRevenue = avgRevenue * revenueTrend
      const predictedTraffic = avgTraffic * trafficTrend

      // Generate insights based on data
      const insights = this.generateInsights(recentData[0])

      return {
        predictedRevenue,
        predictedTraffic,
        ...insights
      }
    } catch (error) {
      this.handleError(error)
    }
  }

  private generateInsights(latestData: WebsiteAnalytics): {
    recommendedActions: string[]
    riskFactors: string[]
    opportunities: string[]
  } {
    const actions: string[] = []
    const risks: string[] = []
    const opportunities: string[] = []

    // Bounce rate analysis
    if (latestData.bounceRate > 0.7) {
      risks.push('High bounce rate indicates poor user engagement')
      actions.push('Improve page loading speed and content quality')
    }

    // Conversion rate analysis
    if (latestData.conversionRate < 0.02) {
      risks.push('Low conversion rate')
      actions.push('Optimize call-to-action buttons and checkout process')
    }

    // Mobile traffic analysis
    const totalTraffic = latestData.mobileTraffic + latestData.desktopTraffic + latestData.tabletTraffic
    const mobilePercentage = latestData.mobileTraffic / totalTraffic
    if (mobilePercentage > 0.6) {
      opportunities.push('High mobile traffic - optimize mobile experience')
    }

    // Page load time analysis
    if (latestData.pageLoadTime > 3) {
      risks.push('Slow page load times affecting user experience')
      actions.push('Optimize images and implement caching')
    }

    // Revenue analysis
    if (latestData.revenue.toNumber() > 0 && latestData.avgOrderValue.toNumber() < 1000) {
      opportunities.push('Increase average order value with upselling')
    }

    return {
      recommendedActions: actions,
      riskFactors: risks,
      opportunities
    }
  }

  // Required abstract methods from BaseService
  override async create(data: any): Promise<WebsiteAnalytics> {
    return this.prisma.websiteAnalytics.create({ data })
  }
  
  override async findById(id: string): Promise<WebsiteAnalytics | null> {
    return this.prisma.websiteAnalytics.findUnique({ where: { id } })
  }
  
  override async findAll(filters?: any): Promise<WebsiteAnalytics[]> {
    return this.prisma.websiteAnalytics.findMany({ where: filters })
  }
  
  override async update(id: string, data: Partial<WebsiteAnalytics>): Promise<WebsiteAnalytics> {
    return this.prisma.websiteAnalytics.update({ where: { id }, data })
  }
  
  override async delete(id: string): Promise<boolean> {
    await this.prisma.websiteAnalytics.delete({ where: { id } })
    return true
  }
}
