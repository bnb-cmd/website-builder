import { Website, WebsiteStatus, BusinessType, Language, Prisma } from '@prisma/client'
import { BaseService } from './baseService'
import { AnalyticsService } from './analyticsService'

export interface CreateWebsiteData {
  name: string
  description?: string
  templateId?: string
  businessType?: BusinessType
  language?: Language
  userId: string
  content?: any
  settings?: any
  customCSS?: string
  customJS?: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
}

export interface UpdateWebsiteData {
  name?: string
  description?: string
  content?: any
  settings?: any
  customCSS?: string
  customJS?: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  status?: WebsiteStatus
  publishedAt?: Date
}

export interface WebsiteFilters {
  userId?: string
  status?: WebsiteStatus
  businessType?: BusinessType
  language?: Language
  templateId?: string
}

export class WebsiteService extends BaseService<Website> {
  private analyticsService: AnalyticsService

  constructor() {
    super()
    this.analyticsService = new AnalyticsService()
  }

  protected getModelName(): string {
    return 'website'
  }

  // Implement required BaseService methods
  override async findById(id: string): Promise<Website | null> {
    try {
      const cacheKey = `website:${id}`
      const cached = await this.getCached(cacheKey)
      if (cached && typeof cached === 'object' && 'id' in cached) {
        return cached as Website
      }

      const website = await this.prisma.website.findUnique({
        where: { id },
        include: {
          pages: true,
          analytics: true
        }
      })

      if (website) {
        await this.setCached(cacheKey, website, 3600) // 1 hour
      }

      return website
    } catch (error) {
      this.handleError(error)
    }
  }

  override async findAll(filters?: WebsiteFilters): Promise<Website[]> {
    try {
      const websites = await this.prisma.website.findMany({
        where: filters || {},
        include: {
          pages: true,
          analytics: true
        }
      })
      
      return websites
    } catch (error) {
      this.handleError(error)
    }
  }

  override async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.website.delete({
        where: { id }
      })
      
      // Invalidate cache
      await this.invalidateCache(`website:${id}`)
      
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  // Override create method to handle specific Website creation
  async create(data: CreateWebsiteData): Promise<Website> {
    try {
      this.validateId(data.userId)
      
      const website = await this.prisma.website.create({
        data: {
          name: data.name,
          description: data.description || '',
          templateId: data.templateId,
          businessType: data.businessType,
          language: data.language || 'ENGLISH',
          userId: data.userId,
          content: data.content || {},
          settings: data.settings || {},
          customCSS: data.customCSS || '',
          customJS: data.customJS || '',
          metaTitle: data.metaTitle || '',
          metaDescription: data.metaDescription || '',
          metaKeywords: data.metaKeywords || '',
          status: 'DRAFT'
        }
      })
      
      // Invalidate cache
      await this.invalidateCache(`website:${website.id}`)
      await this.invalidateCache(`user:${data.userId}:websites`)
      
      return website
    } catch (error) {
      this.handleError(error)
    }
  }

  // Override update method to handle specific Website updates
  async update(id: string, data: UpdateWebsiteData): Promise<Website> {
    try {
      this.validateId(id)
      
      // Check if website exists
      const existingWebsite = await this.findById(id)
      if (!existingWebsite) {
        throw new Error('Website not found')
      }
      
      const website = await this.prisma.website.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      })
      
      // Invalidate cache
      await this.invalidateCache(`website:${id}`)
      await this.invalidateCache(`user:${website.userId}:websites`)
      
      return website
    } catch (error) {
      this.handleError(error)
    }
  }

  // Find websites with filters
  async findMany(filters: WebsiteFilters & {
    skip?: number
    take?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    search?: string
  }): Promise<Website[]> {
    try {
      const {
        skip = 0,
        take = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search,
        ...whereFilters
      } = filters

      let where: Prisma.WebsiteWhereInput = whereFilters

      // Add search functionality
      if (search) {
        where = {
          ...where,
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        }
      }

      const websites = await this.prisma.website.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        include: {
          pages: true,
          analytics: true
        }
      })
      
      return websites
    } catch (error) {
      this.handleError(error)
    }
  }

  // Count websites with filters
  override async count(filters: WebsiteFilters & { search?: string }): Promise<number> {
    try {
      const { search, ...whereFilters } = filters

      let where: Prisma.WebsiteWhereInput = whereFilters

      // Add search functionality
      if (search) {
        where = {
          ...where,
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        }
      }

      return await this.prisma.website.count({ where })
    } catch (error) {
      this.handleError(error)
    }
  }

  // Get website statistics
  async getStats(userId: string): Promise<{
    totalWebsites: number
    publishedWebsites: number
    draftWebsites: number
    websitesThisMonth: number
    websitesByStatus: Record<string, number>
    websitesByBusinessType: Record<string, number>
    websitesByLanguage: Record<string, number>
  }> {
    try {
      const cacheKey = `user:${userId}:website:stats`
      const cached = await this.getCached(cacheKey)
      if (cached && typeof cached === 'object' && 'totalWebsites' in cached) {
        return cached as {
          totalWebsites: number
          publishedWebsites: number
          draftWebsites: number
          websitesThisMonth: number
          websitesByStatus: Record<string, number>
          websitesByBusinessType: Record<string, number>
          websitesByLanguage: Record<string, number>
        }
      }

      const [
        totalWebsites,
        publishedWebsites,
        draftWebsites,
        websitesThisMonth,
        websitesByStatus,
        websitesByBusinessType,
        websitesByLanguage
      ] = await Promise.all([
        this.prisma.website.count({ where: { userId } }),
        this.prisma.website.count({ where: { userId, status: 'PUBLISHED' } }),
        this.prisma.website.count({ where: { userId, status: 'DRAFT' } }),
        this.prisma.website.count({
          where: {
            userId,
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        }),
        this.prisma.website.groupBy({
          by: ['status'],
          _count: { status: true },
          where: { userId }
        }),
        this.prisma.website.groupBy({
          by: ['businessType'],
          _count: { businessType: true },
          where: { userId, businessType: { not: null } }
        }),
        this.prisma.website.groupBy({
          by: ['language'],
          _count: { language: true },
          where: { userId }
        })
      ])

      const stats = {
        totalWebsites,
        publishedWebsites,
        draftWebsites,
        websitesThisMonth,
        websitesByStatus: websitesByStatus.reduce((acc, item) => {
          acc[item.status] = item._count.status
          return acc
        }, {} as Record<string, number>),
        websitesByBusinessType: websitesByBusinessType.reduce((acc, item) => {
          acc[item.businessType || 'Unknown'] = item._count.businessType
          return acc
        }, {} as Record<string, number>),
        websitesByLanguage: websitesByLanguage.reduce((acc, item) => {
          acc[item.language] = item._count.language
          return acc
        }, {} as Record<string, number>)
      }

      await this.setCached(cacheKey, stats, 3600) // 1 hour

      return stats
    } catch (error) {
      this.handleError(error)
    }
  }

  // Publish website
  async publish(id: string): Promise<Website> {
    try {
      this.validateId(id)
      
      const website = await this.prisma.website.update({
        where: { id },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
          updatedAt: new Date()
        }
      })
      
      // Invalidate cache
      await this.invalidateCache(`website:${id}`)
      await this.invalidateCache(`user:${website.userId}:websites`)
      
      return website
    } catch (error) {
      this.handleError(error)
    }
  }

  // Unpublish website
  async unpublish(id: string): Promise<Website> {
    try {
      this.validateId(id)
      
      const website = await this.prisma.website.update({
        where: { id },
        data: {
          status: 'DRAFT',
          publishedAt: null,
          updatedAt: new Date()
        }
      })
      
      // Invalidate cache
      await this.invalidateCache(`website:${id}`)
      await this.invalidateCache(`user:${website.userId}:websites`)
      
      return website
    } catch (error) {
      this.handleError(error)
    }
  }

  // Archive website
  async archive(id: string): Promise<Website> {
    try {
      this.validateId(id)
      
      const website = await this.prisma.website.update({
        where: { id },
        data: {
          status: 'ARCHIVED',
          updatedAt: new Date()
        }
      })
      
      // Invalidate cache
      await this.invalidateCache(`website:${id}`)
      await this.invalidateCache(`user:${website.userId}:websites`)
      
      return website
    } catch (error) {
      this.handleError(error)
    }
  }

  // Duplicate website
  async duplicate(id: string, userId: string): Promise<Website> {
    try {
      this.validateId(id)
      this.validateId(userId)
      
      const originalWebsite = await this.findById(id)
      if (!originalWebsite) {
        throw new Error('Website not found')
      }

      const duplicatedWebsite = await this.create({
        name: `${originalWebsite.name} (Copy)`,
        description: originalWebsite.description,
        templateId: originalWebsite.templateId,
        businessType: originalWebsite.businessType,
        language: originalWebsite.language,
        userId,
        content: originalWebsite.content,
        settings: originalWebsite.settings,
        customCSS: originalWebsite.customCSS,
        customJS: originalWebsite.customJS,
        metaTitle: originalWebsite.metaTitle,
        metaDescription: originalWebsite.metaDescription,
        metaKeywords: originalWebsite.metaKeywords
      })
      
      return duplicatedWebsite
    } catch (error) {
      this.handleError(error)
    }
  }

  // Analytics integration methods
  async getWebsiteAnalytics(websiteId: string, filters?: any) {
    return this.analyticsService.getWebsiteAnalytics(websiteId, filters)
  }

  async getWebsiteAnalyticsSummary(websiteId: string, period: string = 'DAILY', days: number = 30) {
    return this.analyticsService.getAnalyticsSummary(websiteId, period, days)
  }

  async getWebsiteAnalyticsTrends(websiteId: string, period: string = 'DAILY', days: number = 30) {
    return this.analyticsService.getAnalyticsTrends(websiteId, period, days)
  }

  async getWebsitePredictiveInsights(websiteId: string) {
    return this.analyticsService.getPredictiveInsights(websiteId)
  }

  async createWebsiteAnalytics(websiteId: string, data: any, period: string = 'DAILY', date: Date = new Date()) {
    return this.analyticsService.createAnalytics(websiteId, data, period, date)
  }

  async getWebsiteBySubdomain(subdomain: string): Promise<Website | null> {
    try {
      const website = await this.prisma.website.findFirst({
        where: { subdomain },
        include: {
          pages: true,
          analytics: true
        }
      })

      return website
    } catch (error) {
      this.handleError(error)
    }
  }

  async getWebsiteByCustomDomain(domain: string): Promise<Website | null> {
    try {
      const website = await this.prisma.website.findFirst({
        where: { customDomain: domain },
        include: {
          pages: true,
          analytics: true
        }
      })

      return website
    } catch (error) {
      this.handleError(error)
    }
  }
}