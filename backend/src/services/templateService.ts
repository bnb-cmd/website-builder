import { Template, BusinessType, Language, Prisma } from '@prisma/client'
import { BaseService } from './baseService'

export interface CreateTemplateData {
  name: string
  description?: string
  category: string
  businessType?: BusinessType
  language?: Language
  content: string // JSON string
  styles: string // JSON string
  assets?: string // Comma-separated asset URLs
  previewImage?: string
  thumbnail?: string
  heroImageUrl?: string
  demoImages?: string // Comma-separated demo image URLs
  isGlobal?: boolean
  parentTemplateId?: string
  localizedFor?: string
  isPremium?: boolean
  price?: number
  status?: string
  tags?: string // Comma-separated tags
  features?: string // Comma-separated features
  responsive?: boolean
}

export interface UpdateTemplateData {
  name?: string
  description?: string
  category?: string
  businessType?: BusinessType
  language?: Language
  content?: string
  styles?: string
  assets?: string
  previewImage?: string
  thumbnail?: string
  heroImageUrl?: string
  demoImages?: string
  isGlobal?: boolean
  parentTemplateId?: string
  localizedFor?: string
  isPremium?: boolean
  price?: number
  status?: string
  tags?: string
  features?: string
  responsive?: boolean
}

export interface TemplateFilters {
  category?: string
  businessType?: BusinessType
  language?: Language
  isPremium?: boolean
  isGlobal?: boolean
  status?: string
  search?: string
  tags?: string[]
  responsive?: boolean
}

export interface TemplateStats {
  totalTemplates: number
  premiumTemplates: number
  freeTemplates: number
  templatesByCategory: Record<string, number>
  templatesByBusinessType: Record<string, number>
  templatesByLanguage: Record<string, number>
  templatesThisMonth: number
  mostPopularTemplates: Array<{
    id: string
    name: string
    usageCount: number
  }>
}

export interface TemplateSearchResult {
  templates: Template[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export class TemplateService extends BaseService<Template> {
  constructor() {
    super()
  }

  protected getModelName(): string {
    return 'template'
  }

  // Implement required BaseService methods
  override async findById(id: string): Promise<Template | null> {
    try {
      const cacheKey = `template:${id}`
      const cached = await this.getCached(cacheKey)
      if (cached && typeof cached === 'object' && 'id' in cached) {
        return cached as Template
      }

      const template = await this.prisma.template.findUnique({
        where: { id }
      })

      if (template) {
        await this.setCached(cacheKey, template, 3600) // 1 hour
      }

      return template
    } catch (error) {
      this.handleError(error)
    }
  }

  override async findAll(filters?: TemplateFilters): Promise<Template[]> {
    try {
      const templates = await this.prisma.template.findMany({
        where: this.buildWhereClause(filters),
        orderBy: { createdAt: 'desc' }
      })
      
      return templates
    } catch (error) {
      this.handleError(error)
    }
  }

  // Custom create method for templates
  async createTemplate(data: CreateTemplateData): Promise<Template> {
    try {
      const template = await this.prisma.template.create({
        data: {
          name: data.name,
          description: data.description,
          category: data.category,
          businessType: data.businessType,
          language: data.language || Language.ENGLISH,
          content: data.content,
          styles: data.styles,
          assets: data.assets || '',
          previewImage: data.previewImage,
          thumbnail: data.thumbnail,
          heroImageUrl: data.heroImageUrl,
          demoImages: data.demoImages,
          isGlobal: data.isGlobal ?? true,
          parentTemplateId: data.parentTemplateId,
          localizedFor: data.localizedFor,
          isPremium: data.isPremium ?? false,
          price: data.price,
          status: data.status || 'ACTIVE',
          tags: data.tags,
          features: data.features,
          responsive: data.responsive ?? true
        }
      })
      
      // Invalidate cache
      await this.invalidateCache('template:list*')
      
      return template
    } catch (error) {
      this.handleError(error)
    }
  }

  // Implement required BaseService method
  override async create(data: Partial<Template>): Promise<Template> {
    try {
      const template = await this.prisma.template.create({
        data: data as any
      })
      return template
    } catch (error) {
      this.handleError(error)
    }
  }

  // Custom update method for templates
  async updateTemplate(id: string, data: UpdateTemplateData): Promise<Template> {
    try {
      this.validateId(id)
      
      const template = await this.prisma.template.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      })
      
      // Invalidate cache
      await this.invalidateCache(`template:${id}`)
      await this.invalidateCache('template:list*')
      
      return template
    } catch (error) {
      this.handleError(error)
    }
  }

  // Implement required BaseService method
  override async update(id: string, data: Partial<Template>): Promise<Template> {
    try {
      const template = await this.prisma.template.update({
        where: { id },
        data: data as any
      })
      return template
    } catch (error) {
      this.handleError(error)
    }
  }

  override async delete(id: string): Promise<boolean> {
    try {
      this.validateId(id)
      
      await this.prisma.template.delete({
        where: { id }
      })
      
      // Invalidate cache
      await this.invalidateCache(`template:${id}`)
      await this.invalidateCache('template:list*')
      
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  // Advanced template operations
  async searchTemplates(
    filters: TemplateFilters & {
      page?: number
      limit?: number
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
    }
  ): Promise<TemplateSearchResult> {
    try {
      const {
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        ...whereFilters
      } = filters

      const skip = (page - 1) * limit
      const where = this.buildWhereClause(whereFilters)

      const [templates, total] = await Promise.all([
        this.prisma.template.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder }
        }),
        this.prisma.template.count({ where })
      ])

      return {
        templates,
        total,
        page,
        limit,
        hasMore: skip + templates.length < total
      }
    } catch (error) {
      this.handleError(error)
    }
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    try {
      const cacheKey = `template:category:${category}`
      const cached = await this.getCached(cacheKey)
      if (cached && Array.isArray(cached)) {
        return cached as Template[]
      }

      const templates = await this.prisma.template.findMany({
        where: {
          category: category.toUpperCase(),
          status: 'ACTIVE'
        },
        orderBy: { createdAt: 'desc' }
      })

      await this.setCached(cacheKey, templates, 1800) // 30 minutes
      
      return templates
    } catch (error) {
      this.handleError(error)
    }
  }

  async getFeaturedTemplates(limit: number = 10): Promise<Template[]> {
    try {
      const cacheKey = `template:featured:${limit}`
      const cached = await this.getCached(cacheKey)
      if (cached && Array.isArray(cached)) {
        return cached as Template[]
      }

      // For now, get most recent premium templates as featured
      const templates = await this.prisma.template.findMany({
        where: {
          isPremium: true,
          status: 'ACTIVE'
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      })

      await this.setCached(cacheKey, templates, 1800) // 30 minutes
      
      return templates
    } catch (error) {
      this.handleError(error)
    }
  }

  async getTrendingTemplates(limit: number = 10): Promise<Template[]> {
    try {
      const cacheKey = `template:trending:${limit}`
      const cached = await this.getCached(cacheKey)
      if (cached && Array.isArray(cached)) {
        return cached as Template[]
      }

      // For now, get most recent templates as trending
      const templates = await this.prisma.template.findMany({
        where: {
          status: 'ACTIVE'
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      })

      await this.setCached(cacheKey, templates, 1800) // 30 minutes
      
      return templates
    } catch (error) {
      this.handleError(error)
    }
  }

  async getTemplateCategories(): Promise<string[]> {
    try {
      const cacheKey = 'template:categories'
      const cached = await this.getCached(cacheKey)
      if (cached && Array.isArray(cached)) {
        return cached as string[]
      }

      const categories = await this.prisma.template.findMany({
        select: { category: true },
        distinct: ['category'],
        where: { status: 'ACTIVE' }
      })

      const categoryList = categories.map(c => c.category)
      await this.setCached(cacheKey, categoryList, 3600) // 1 hour
      
      return categoryList
    } catch (error) {
      this.handleError(error)
    }
  }

  async duplicateTemplate(id: string, newName: string): Promise<Template> {
    try {
      this.validateId(id)
      
      const originalTemplate = await this.findById(id)
      if (!originalTemplate) {
        throw new Error('Template not found')
      }

      const duplicatedTemplate = await this.prisma.template.create({
        data: {
          name: newName,
          description: originalTemplate.description,
          category: originalTemplate.category,
          businessType: originalTemplate.businessType,
          language: originalTemplate.language,
          content: originalTemplate.content,
          styles: originalTemplate.styles,
          assets: originalTemplate.assets,
          previewImage: originalTemplate.previewImage,
          thumbnail: originalTemplate.thumbnail,
          heroImageUrl: originalTemplate.heroImageUrl,
          demoImages: originalTemplate.demoImages,
          isGlobal: originalTemplate.isGlobal,
          parentTemplateId: originalTemplate.parentTemplateId,
          localizedFor: originalTemplate.localizedFor,
          isPremium: originalTemplate.isPremium,
          price: originalTemplate.price,
          status: 'DRAFT', // Start as draft
          tags: originalTemplate.tags,
          features: originalTemplate.features,
          responsive: originalTemplate.responsive
        }
      })

      await this.invalidateCache('template:list*')
      
      return duplicatedTemplate
    } catch (error) {
      this.handleError(error)
    }
  }

  async getTemplateStats(): Promise<TemplateStats> {
    try {
      const cacheKey = 'template:stats'
      const cached = await this.getCached(cacheKey)
      if (cached && typeof cached === 'object' && 'totalTemplates' in cached) {
        return cached as TemplateStats
      }

      const [
        totalTemplates,
        premiumTemplates,
        freeTemplates,
        templatesByCategory,
        templatesByBusinessType,
        templatesByLanguage,
        templatesThisMonth
      ] = await Promise.all([
        this.prisma.template.count(),
        this.prisma.template.count({ where: { isPremium: true } }),
        this.prisma.template.count({ where: { isPremium: false } }),
        this.prisma.template.groupBy({
          by: ['category'],
          _count: { category: true }
        }),
        this.prisma.template.groupBy({
          by: ['businessType'],
          _count: { businessType: true },
          where: { businessType: { not: null } }
        }),
        this.prisma.template.groupBy({
          by: ['language'],
          _count: { language: true }
        }),
        this.prisma.template.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        })
      ])

      const stats: TemplateStats = {
        totalTemplates,
        premiumTemplates,
        freeTemplates,
        templatesByCategory: templatesByCategory.reduce((acc, item) => {
          acc[item.category] = item._count.category
          return acc
        }, {} as Record<string, number>),
        templatesByBusinessType: templatesByBusinessType.reduce((acc, item) => {
          acc[item.businessType || 'Unknown'] = item._count.businessType
          return acc
        }, {} as Record<string, number>),
        templatesByLanguage: templatesByLanguage.reduce((acc, item) => {
          acc[item.language] = item._count.language
          return acc
        }, {} as Record<string, number>),
        templatesThisMonth,
        mostPopularTemplates: [] // TODO: Implement usage tracking
      }

      await this.setCached(cacheKey, stats, 3600) // 1 hour
      
      return stats
    } catch (error) {
      this.handleError(error)
    }
  }

  async validateTemplateContent(content: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(content)
      
      // Basic validation - check for required fields
      const requiredFields = ['sections', 'layout']
      return requiredFields.every(field => field in parsed)
    } catch (error) {
      return false
    }
  }

  async validateTemplateStyles(styles: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(styles)
      
      // Basic validation - check for required fields
      const requiredFields = ['colors', 'fonts', 'spacing']
      return requiredFields.every(field => field in parsed)
    } catch (error) {
      return false
    }
  }

  // Helper methods
  private buildWhereClause(filters?: TemplateFilters): Prisma.TemplateWhereInput {
    if (!filters) return {}

    const where: Prisma.TemplateWhereInput = {}

    if (filters.category) {
      where.category = filters.category.toUpperCase()
    }

    if (filters.businessType) {
      where.businessType = filters.businessType
    }

    if (filters.language) {
      where.language = filters.language
    }

    if (filters.isPremium !== undefined) {
      where.isPremium = filters.isPremium
    }

    if (filters.isGlobal !== undefined) {
      where.isGlobal = filters.isGlobal
    }

    if (filters.status) {
      where.status = filters.status.toUpperCase()
    }

    if (filters.responsive !== undefined) {
      where.responsive = filters.responsive
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { tags: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    if (filters.tags && filters.tags.length > 0) {
      where.tags = {
        contains: filters.tags.join(','),
        mode: 'insensitive'
      }
    }

    return where
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

export const templateService = new TemplateService()
