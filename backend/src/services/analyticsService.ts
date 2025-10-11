import { WebsiteAnalytics, Prisma } from '@prisma/client'
import { BaseService } from './baseService'

// Comprehensive analytics data interface
export interface AnalyticsData {
  // Core metrics (stored in dedicated fields)
  visitors: number
  pageViews: number
  bounceRate?: number
  avgSessionDuration?: number
  conversionRate?: number
  revenue?: number
  
  // Extended metrics (stored in metadata JSON)
  orders?: number
  avgOrderValue?: number
  organicTraffic?: number
  socialTraffic?: number
  directTraffic?: number
  referralTraffic?: number
  mobileTraffic?: number
  desktopTraffic?: number
  tabletTraffic?: number
  topCountries?: Record<string, number>
  topCities?: Record<string, number>
  pageLoadTime?: number
  coreWebVitals?: {
    lcp: number
    fid: number
    cls: number
  }
  topPages?: Array<{
    path: string
    views: number
    uniqueViews: number
  }>
  referrers?: Array<{
    domain: string
    visits: number
  }>
  devices?: {
    mobile: number
    desktop: number
    tablet: number
  }
  browsers?: Record<string, number>
  operatingSystems?: Record<string, number>
  screenResolutions?: Record<string, number>
  timeOnSite?: number
  exitRate?: number
  newVisitors?: number
  returningVisitors?: number
}

export interface PredictiveInsights {
  predictedRevenue: number
  predictedTraffic: number
  predictedConversionRate: number
  recommendedActions: string[]
  riskFactors: string[]
  opportunities: string[]
  trendAnalysis: {
    revenue: 'increasing' | 'decreasing' | 'stable'
    traffic: 'increasing' | 'decreasing' | 'stable'
    conversion: 'increasing' | 'decreasing' | 'stable'
  }
  confidence: number
}

export interface AnalyticsFilters {
  websiteId?: string
  startDate?: Date
  endDate?: Date
  period?: string // DAILY, WEEKLY, MONTHLY, YEARLY
}

export interface AnalyticsSummary {
  totalVisitors: number
  totalPageViews: number
  avgBounceRate: number
  avgSessionDuration: number
  totalRevenue: number
  conversionRate: number
  avgOrderValue: number
  totalOrders: number
  period: string
  dateRange: {
    start: Date
    end: Date
  }
  trafficSources: {
    organic: number
    social: number
    direct: number
    referral: number
  }
  deviceBreakdown: {
    mobile: number
    desktop: number
    tablet: number
  }
  topCountries: Array<{ country: string; visitors: number }>
  topPages: Array<{ path: string; views: number }>
}

export interface AnalyticsTrends {
  visitors: { date: string; value: number }[]
  pageViews: { date: string; value: number }[]
  revenue: { date: string; value: number }[]
  conversionRate: { date: string; value: number }[]
  bounceRate: { date: string; value: number }[]
}

export class AnalyticsService extends BaseService<WebsiteAnalytics> {
  constructor() {
    super()
  }

  protected getModelName(): string {
    return 'websiteAnalytics'
  }

  // Implement required BaseService methods
  override async create(data: Partial<WebsiteAnalytics>): Promise<WebsiteAnalytics> {
    try {
      const analytics = await this.prisma.websiteAnalytics.create({
        data: data as any
      })
      return analytics
    } catch (error) {
      this.handleError(error)
    }
  }

  override async findById(id: string): Promise<WebsiteAnalytics | null> {
    try {
      const analytics = await this.prisma.websiteAnalytics.findUnique({
        where: { id }
      })
      return analytics
    } catch (error) {
      this.handleError(error)
    }
  }

  override async findAll(filters?: any): Promise<WebsiteAnalytics[]> {
    try {
      const analytics = await this.prisma.websiteAnalytics.findMany({
        where: filters || {},
        orderBy: { date: 'desc' }
      })
      return analytics
    } catch (error) {
      this.handleError(error)
    }
  }

  override async update(id: string, data: Partial<WebsiteAnalytics>): Promise<WebsiteAnalytics> {
    try {
      const analytics = await this.prisma.websiteAnalytics.update({
        where: { id },
        data: data as any
      })
      return analytics
    } catch (error) {
      this.handleError(error)
    }
  }

  override async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.websiteAnalytics.delete({
        where: { id }
      })
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  // Create comprehensive analytics record
  async createAnalytics(
    websiteId: string, 
    data: AnalyticsData, 
    period: string = 'DAILY', 
    date: Date = new Date()
  ): Promise<WebsiteAnalytics> {
    try {
      this.validateId(websiteId)
      
      // Extract core metrics for dedicated fields
      const coreMetrics = {
        visitors: data.visitors,
        pageViews: data.pageViews,
        bounceRate: data.bounceRate,
        avgSessionDuration: data.avgSessionDuration,
        conversionRate: data.conversionRate,
        revenue: data.revenue
      }
      
      // Store extended metrics in metadata
      const extendedMetrics = {
        orders: data.orders,
        avgOrderValue: data.avgOrderValue,
        organicTraffic: data.organicTraffic,
        socialTraffic: data.socialTraffic,
        directTraffic: data.directTraffic,
        referralTraffic: data.referralTraffic,
        mobileTraffic: data.mobileTraffic,
        desktopTraffic: data.desktopTraffic,
        tabletTraffic: data.tabletTraffic,
        topCountries: data.topCountries,
        topCities: data.topCities,
        pageLoadTime: data.pageLoadTime,
        coreWebVitals: data.coreWebVitals,
        topPages: data.topPages,
        referrers: data.referrers,
        devices: data.devices,
        browsers: data.browsers,
        operatingSystems: data.operatingSystems,
        screenResolutions: data.screenResolutions,
        timeOnSite: data.timeOnSite,
        exitRate: data.exitRate,
        newVisitors: data.newVisitors,
        returningVisitors: data.returningVisitors
      }
      
      const analytics = await this.prisma.websiteAnalytics.create({
        data: {
          websiteId,
          date,
          period,
          ...coreMetrics,
          metadata: JSON.stringify(extendedMetrics)
        }
      })
      
      // Invalidate cache
      await this.invalidateCache(`analytics:${websiteId}`)
      
      return analytics
    } catch (error) {
      this.handleError(error)
    }
  }

  // Get comprehensive analytics for a website
  async getWebsiteAnalytics(
    websiteId: string, 
    filters: AnalyticsFilters = {}
  ): Promise<WebsiteAnalytics[]> {
    try {
      this.validateId(websiteId)
      
      const cacheKey = `analytics:${websiteId}:${JSON.stringify(filters)}`
      const cached = await this.getCached(cacheKey)
      if (cached && Array.isArray(cached)) {
        return cached as WebsiteAnalytics[]
      }

      const where: Prisma.WebsiteAnalyticsWhereInput = {
        websiteId,
        ...(filters.startDate && filters.endDate && {
          date: {
            gte: filters.startDate,
            lte: filters.endDate
          }
        }),
        ...(filters.period && { period: filters.period })
      }

      const analytics = await this.prisma.websiteAnalytics.findMany({
        where,
        orderBy: { date: 'desc' }
      })

      await this.setCached(cacheKey, analytics, 1800) // 30 minutes
      
      return analytics
    } catch (error) {
      this.handleError(error)
    }
  }

  // Get comprehensive analytics summary
  async getAnalyticsSummary(
    websiteId: string, 
    period: string = 'DAILY',
    days: number = 30
  ): Promise<AnalyticsSummary> {
    try {
      this.validateId(websiteId)
      
      const cacheKey = `analytics:summary:${websiteId}:${period}:${days}`
      const cached = await this.getCached(cacheKey)
      if (cached && typeof cached === 'object' && 'totalVisitors' in cached) {
        return cached as AnalyticsSummary
      }

      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - days)

      const analytics = await this.prisma.websiteAnalytics.findMany({
        where: {
          websiteId,
          period,
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        orderBy: { date: 'asc' }
      })

      // Aggregate core metrics
      const totalVisitors = analytics.reduce((sum, a) => sum + a.visitors, 0)
      const totalPageViews = analytics.reduce((sum, a) => sum + a.pageViews, 0)
      const totalRevenue = analytics.reduce((sum, a) => sum + (a.revenue?.toNumber() || 0), 0)
      
      // Aggregate extended metrics from metadata
      let totalOrders = 0
      let totalAvgOrderValue = 0
      let totalOrganicTraffic = 0
      let totalSocialTraffic = 0
      let totalDirectTraffic = 0
      let totalReferralTraffic = 0
      let totalMobileTraffic = 0
      let totalDesktopTraffic = 0
      let totalTabletTraffic = 0
      const countryMap = new Map<string, number>()
      const pageMap = new Map<string, number>()

      analytics.forEach(analytics => {
        if (analytics.metadata) {
          try {
            const metadata = JSON.parse(analytics.metadata)
            totalOrders += metadata.orders || 0
            totalAvgOrderValue += metadata.avgOrderValue || 0
            totalOrganicTraffic += metadata.organicTraffic || 0
            totalSocialTraffic += metadata.socialTraffic || 0
            totalDirectTraffic += metadata.directTraffic || 0
            totalReferralTraffic += metadata.referralTraffic || 0
            totalMobileTraffic += metadata.mobileTraffic || 0
            totalDesktopTraffic += metadata.desktopTraffic || 0
            totalTabletTraffic += metadata.tabletTraffic || 0

            // Aggregate countries
            if (metadata.topCountries) {
              Object.entries(metadata.topCountries).forEach(([country, count]) => {
                countryMap.set(country, (countryMap.get(country) || 0) + (count as number))
              })
            }

            // Aggregate top pages
            if (metadata.topPages) {
              metadata.topPages.forEach((page: any) => {
                pageMap.set(page.path, (pageMap.get(page.path) || 0) + page.views)
              })
            }
          } catch (e) {
            console.error('Error parsing metadata:', e)
          }
        }
      })

      const summary: AnalyticsSummary = {
        totalVisitors,
        totalPageViews,
        avgBounceRate: this.calculateAverage(analytics.map(a => a.bounceRate?.toNumber())),
        avgSessionDuration: this.calculateAverage(analytics.map(a => a.avgSessionDuration?.toNumber())),
        totalRevenue,
        conversionRate: this.calculateAverage(analytics.map(a => a.conversionRate?.toNumber())),
        avgOrderValue: totalOrders > 0 ? totalAvgOrderValue / totalOrders : 0,
        totalOrders,
        period,
        dateRange: {
          start: startDate,
          end: endDate
        },
        trafficSources: {
          organic: totalOrganicTraffic,
          social: totalSocialTraffic,
          direct: totalDirectTraffic,
          referral: totalReferralTraffic
        },
        deviceBreakdown: {
          mobile: totalMobileTraffic,
          desktop: totalDesktopTraffic,
          tablet: totalTabletTraffic
        },
        topCountries: Array.from(countryMap.entries())
          .map(([country, visitors]) => ({ country, visitors }))
          .sort((a, b) => b.visitors - a.visitors)
          .slice(0, 10),
        topPages: Array.from(pageMap.entries())
          .map(([path, views]) => ({ path, views }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 10)
      }

      await this.setCached(cacheKey, summary, 1800) // 30 minutes
      
      return summary
    } catch (error) {
      this.handleError(error)
    }
  }

  // Get comprehensive analytics trends
  async getAnalyticsTrends(
    websiteId: string,
    period: string = 'DAILY',
    days: number = 30
  ): Promise<AnalyticsTrends> {
    try {
      this.validateId(websiteId)
      
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - days)

      const analytics = await this.prisma.websiteAnalytics.findMany({
        where: {
          websiteId,
          period,
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        orderBy: { date: 'asc' }
      })

      return {
        visitors: analytics.map(a => ({
          date: a.date.toISOString().split('T')[0],
          value: a.visitors
        })),
        pageViews: analytics.map(a => ({
          date: a.date.toISOString().split('T')[0],
          value: a.pageViews
        })),
        revenue: analytics.map(a => ({
          date: a.date.toISOString().split('T')[0],
          value: a.revenue?.toNumber() || 0
        })),
        conversionRate: analytics.map(a => ({
          date: a.date.toISOString().split('T')[0],
          value: a.conversionRate?.toNumber() || 0
        })),
        bounceRate: analytics.map(a => ({
          date: a.date.toISOString().split('T')[0],
          value: a.bounceRate?.toNumber() || 0
        }))
      }
    } catch (error) {
      this.handleError(error)
    }
  }

  // Get predictive insights with ML-like analysis
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
          predictedConversionRate: 0,
          recommendedActions: ['Start collecting analytics data'],
          riskFactors: ['No historical data available'],
          opportunities: ['Implement analytics tracking'],
          trendAnalysis: {
            revenue: 'stable',
            traffic: 'stable',
            conversion: 'stable'
          },
          confidence: 0
        }
      }

      // Calculate trends
      const revenueTrend = this.calculateTrend(recentData.map(a => a.revenue?.toNumber() || 0))
      const trafficTrend = this.calculateTrend(recentData.map(a => a.visitors))
      const conversionTrend = this.calculateTrend(recentData.map(a => a.conversionRate?.toNumber() || 0))

      // Simple prediction based on recent averages and trends
      const avgRevenue = recentData.reduce((sum, a) => sum + (a.revenue?.toNumber() || 0), 0) / recentData.length
      const avgTraffic = recentData.reduce((sum, a) => sum + a.visitors, 0) / recentData.length
      const avgConversion = recentData.reduce((sum, a) => sum + (a.conversionRate?.toNumber() || 0), 0) / recentData.length

      const predictedRevenue = avgRevenue * (1 + revenueTrend * 0.1)
      const predictedTraffic = avgTraffic * (1 + trafficTrend * 0.1)
      const predictedConversionRate = avgConversion * (1 + conversionTrend * 0.1)

      // Generate insights based on trends
      const recommendedActions: string[] = []
      const riskFactors: string[] = []
      const opportunities: string[] = []

      if (revenueTrend > 0.1) {
        opportunities.push('Revenue is growing - consider scaling marketing efforts')
      } else if (revenueTrend < -0.1) {
        riskFactors.push('Revenue is declining - investigate conversion issues')
        recommendedActions.push('Review pricing strategy and value proposition')
      }

      if (trafficTrend > 0.1) {
        opportunities.push('Traffic is growing - optimize conversion funnel')
      } else if (trafficTrend < -0.1) {
        riskFactors.push('Traffic is declining - check SEO and marketing channels')
        recommendedActions.push('Increase marketing budget and improve content')
      }

      if (conversionTrend > 0.1) {
        opportunities.push('Conversion rate improving - scale successful strategies')
      } else if (conversionTrend < -0.1) {
        riskFactors.push('Conversion rate declining - optimize user experience')
        recommendedActions.push('A/B test landing pages and checkout process')
      }

      // Add general recommendations
      if (recentData.length >= 7) {
        recommendedActions.push('Continue monitoring key metrics daily')
        recommendedActions.push('Set up automated alerts for significant changes')
      }

      return {
        predictedRevenue: Math.max(0, predictedRevenue),
        predictedTraffic: Math.max(0, predictedTraffic),
        predictedConversionRate: Math.max(0, predictedConversionRate),
        recommendedActions,
        riskFactors,
        opportunities,
        trendAnalysis: {
          revenue: this.getTrendDirection(revenueTrend),
          traffic: this.getTrendDirection(trafficTrend),
          conversion: this.getTrendDirection(conversionTrend)
        },
        confidence: Math.min(0.9, recentData.length / 30) // Confidence based on data points
      }
    } catch (error) {
      this.handleError(error)
    }
  }

  // Update analytics record
  async updateAnalytics(
    id: string, 
    data: Partial<AnalyticsData>
  ): Promise<WebsiteAnalytics> {
    try {
      this.validateId(id)
      
      // Get existing record to merge metadata
      const existing = await this.prisma.websiteAnalytics.findUnique({
        where: { id }
      })
      
      if (!existing) {
        throw new Error('Analytics record not found')
      }

      // Merge existing metadata with new data
      let existingMetadata = {}
      if (existing.metadata) {
        try {
          existingMetadata = JSON.parse(existing.metadata)
        } catch (e) {
          console.error('Error parsing existing metadata:', e)
        }
      }

      const updateData: Prisma.WebsiteAnalyticsUpdateInput = {
        ...(data.visitors !== undefined && { visitors: data.visitors }),
        ...(data.pageViews !== undefined && { pageViews: data.pageViews }),
        ...(data.bounceRate !== undefined && { bounceRate: data.bounceRate }),
        ...(data.avgSessionDuration !== undefined && { avgSessionDuration: data.avgSessionDuration }),
        ...(data.conversionRate !== undefined && { conversionRate: data.conversionRate }),
        ...(data.revenue !== undefined && { revenue: data.revenue }),
        metadata: JSON.stringify({ ...existingMetadata, ...data }),
        updatedAt: new Date()
      }

      const analytics = await this.prisma.websiteAnalytics.update({
        where: { id },
        data: updateData
      })
      
      // Invalidate cache
      await this.invalidateCache(`analytics:${analytics.websiteId}`)
      
      return analytics
    } catch (error) {
      this.handleError(error)
    }
  }

  // Delete analytics record
  async deleteAnalytics(id: string): Promise<boolean> {
    try {
      this.validateId(id)
      
      const analytics = await this.prisma.websiteAnalytics.findUnique({
        where: { id }
      })
      
      if (!analytics) {
        throw new Error('Analytics record not found')
      }
      
      await this.prisma.websiteAnalytics.delete({
        where: { id }
      })
      
      // Invalidate cache
      await this.invalidateCache(`analytics:${analytics.websiteId}`)
      
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  // Bulk create analytics records
  async bulkCreateAnalytics(
    websiteId: string,
    records: Array<{
      data: AnalyticsData
      period: string
      date: Date
    }>
  ): Promise<WebsiteAnalytics[]> {
    try {
      this.validateId(websiteId)
      
      const analyticsData = records.map(record => {
        const coreMetrics = {
          visitors: record.data.visitors,
          pageViews: record.data.pageViews,
          bounceRate: record.data.bounceRate,
          avgSessionDuration: record.data.avgSessionDuration,
          conversionRate: record.data.conversionRate,
          revenue: record.data.revenue
        }
        
        const extendedMetrics = {
          orders: record.data.orders,
          avgOrderValue: record.data.avgOrderValue,
          organicTraffic: record.data.organicTraffic,
          socialTraffic: record.data.socialTraffic,
          directTraffic: record.data.directTraffic,
          referralTraffic: record.data.referralTraffic,
          mobileTraffic: record.data.mobileTraffic,
          desktopTraffic: record.data.desktopTraffic,
          tabletTraffic: record.data.tabletTraffic,
          topCountries: record.data.topCountries,
          topCities: record.data.topCities,
          pageLoadTime: record.data.pageLoadTime,
          coreWebVitals: record.data.coreWebVitals,
          topPages: record.data.topPages,
          referrers: record.data.referrers,
          devices: record.data.devices,
          browsers: record.data.browsers,
          operatingSystems: record.data.operatingSystems,
          screenResolutions: record.data.screenResolutions,
          timeOnSite: record.data.timeOnSite,
          exitRate: record.data.exitRate,
          newVisitors: record.data.newVisitors,
          returningVisitors: record.data.returningVisitors
        }

        return {
          websiteId,
          date: record.date,
          period: record.period,
          ...coreMetrics,
          metadata: JSON.stringify(extendedMetrics)
        }
      })

      const analytics = await this.prisma.websiteAnalytics.createMany({
        data: analyticsData,
        skipDuplicates: true
      })
      
      // Invalidate cache
      await this.invalidateCache(`analytics:${websiteId}`)
      
      // Return the created records
      return await this.prisma.websiteAnalytics.findMany({
        where: { websiteId },
        orderBy: { createdAt: 'desc' },
        take: records.length
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  // Helper methods
  private calculateAverage(values: (number | null | undefined)[]): number {
    const validValues = values.filter(v => v !== null && v !== undefined) as number[]
    if (validValues.length === 0) return 0
    return validValues.reduce((sum, val) => sum + val, 0) / validValues.length
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2))
    const secondHalf = values.slice(Math.floor(values.length / 2))
    
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length
    
    if (firstAvg === 0) return 0
    return (secondAvg - firstAvg) / firstAvg
  }

  private getTrendDirection(trend: number): 'increasing' | 'decreasing' | 'stable' {
    if (trend > 0.05) return 'increasing'
    if (trend < -0.05) return 'decreasing'
    return 'stable'
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