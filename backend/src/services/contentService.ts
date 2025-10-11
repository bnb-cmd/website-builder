import { BaseService } from './baseService'
import { Content, ContentType, ContentStatus, ScheduleStatus } from '@prisma/client'

export interface ContentData {
  title: string
  content: string
  excerpt?: string
  authorId?: string
  categoryId?: string
  tags?: string[]
  type: ContentType
  status: ContentStatus
  seo?: any
  scheduledAt?: Date
  language?: string
  slug?: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  featuredImage?: string
  author?: string
  publishedAt?: Date
}

export interface ContentFilters {
  search?: string
  type?: ContentType
  status?: ContentStatus
  categoryId?: string
  tags?: string[]
  authorId?: string
  published?: boolean
  scheduled?: boolean
  dateFrom?: Date
  dateTo?: Date
  limit?: number
  offset?: number
}

export class ContentService extends BaseService<Content> {
  constructor() {
    super()
  }

  protected getModelName(): string {
    return 'content'
  }

  // Implement required BaseService methods
  override async create(data: Partial<Content>): Promise<Content> {
    try {
      const content = await this.prisma.content.create({
        data: data as any
      })
      return content
    } catch (error) {
      this.handleError(error)
    }
  }

  override async findById(id: string): Promise<Content | null> {
    try {
      this.validateId(id)
      
      const cacheKey = `content:${id}`
      const cached = await this.getCached(cacheKey)
      if (cached && typeof cached === 'object' && 'id' in cached) {
        return cached as Content
      }

      const content = await this.prisma.content.findUnique({
        where: { id },
        include: {
          user: true,
          website: true
        }
      })

      if (content) {
        await this.setCached(cacheKey, content, 1800) // 30 minutes
      }

      return content
    } catch (error) {
      this.handleError(error)
    }
  }

  override async findAll(filters?: ContentFilters): Promise<Content[]> {
    try {
      const {
        search,
        type,
        status,
        categoryId,
        tags,
        authorId,
        published,
        scheduled,
        dateFrom,
        dateTo,
        ...whereFilters
      } = filters || {}
      
      const where: any = {}

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } }
        ]
      }
      if (type) where.type = type
      if (status) where.status = status
      if (categoryId) where.categoryId = categoryId
      if (authorId) where.userId = authorId
      if (published !== undefined) {
        where.publishedAt = published ? { not: null } : null
      }
      if (scheduled !== undefined) {
        where.scheduledAt = scheduled ? { not: null } : null
      }
      if (dateFrom || dateTo) {
        where.createdAt = {}
        if (dateFrom) where.createdAt.gte = dateFrom
        if (dateTo) where.createdAt.lte = dateTo
      }

      const contents = await this.prisma.content.findMany({
        where,
        include: {
          user: true,
          website: true
        },
        orderBy: { createdAt: 'desc' }
      })
      return contents
    } catch (error) {
      this.handleError(error)
    }
  }

  override async update(id: string, data: Partial<Content>): Promise<Content> {
    try {
      this.validateId(id)
      
      const content = await this.prisma.content.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      })
      
      // Invalidate cache
      await this.invalidateCache(`content:${id}`)
      
      return content
    } catch (error) {
      this.handleError(error)
    }
  }

  override async delete(id: string): Promise<boolean> {
    try {
      this.validateId(id)
      
      await this.prisma.content.delete({
        where: { id }
      })
      
      // Invalidate cache
      await this.invalidateCache(`content:${id}`)
      
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  // Content Management Methods
  async createContent(websiteId: string, data: ContentData): Promise<Content> {
    try {
      this.validateId(websiteId)
      
      const slug = this.generateSlug(data.title)
      const tagsString = data.tags ? data.tags.join(',') : null
      
          const content = await this.prisma.content.create({
            data: {
              websiteId,
              userId: data.authorId,
              title: data.title,
              content: data.content,
              type: data.type,
              status: data.status,
              language: data.language as any || 'ENGLISH',
              slug: data.slug || slug,
              seoTitle: data.seoTitle,
              seoDescription: data.seoDescription,
              seoKeywords: data.seoKeywords,
              tags: tagsString,
              featuredImage: data.featuredImage,
              author: data.author,
              publishedAt: data.publishedAt,
              createdAt: new Date(),
              updatedAt: new Date()
            } as any
          })

      await this.invalidateCache(`content:website:${websiteId}`)
      return content
    } catch (error) {
      this.handleError(error)
    }
  }

  async publishContent(id: string): Promise<Content> {
    try {
      this.validateId(id)
      
      const content = await this.prisma.content.update({
        where: { id },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
          updatedAt: new Date()
        }
      })
      
      await this.invalidateCache(`content:${id}`)
      return content
    } catch (error) {
      this.handleError(error)
    }
  }

  async scheduleContent(id: string, scheduledAt: Date): Promise<Content> {
    try {
      this.validateId(id)
      
      const content = await this.prisma.content.update({
        where: { id },
        data: {
          status: 'SCHEDULED',
          updatedAt: new Date()
        } as any
      })
      
      await this.invalidateCache(`content:${id}`)
      return content
    } catch (error) {
      this.handleError(error)
    }
  }

  async getContentBySlug(websiteId: string, slug: string): Promise<Content | null> {
    try {
      this.validateId(websiteId)
      
      const content = await this.prisma.content.findFirst({
        where: {
          websiteId,
          slug,
          status: 'PUBLISHED'
        },
        include: {
          user: true,
          website: true
        }
      })
      
      return content
    } catch (error) {
      this.handleError(error)
    }
  }

  async getContentByWebsite(websiteId: string, filters?: ContentFilters): Promise<Content[]> {
    try {
      this.validateId(websiteId)
      
      const where: any = { websiteId }
      
      if (filters) {
        const {
          search,
          type,
          status,
          categoryId,
          tags,
          authorId,
          published,
          scheduled,
          dateFrom,
          dateTo
        } = filters

        if (search) {
          where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } }
          ]
        }
        if (type) where.type = type
        if (status) where.status = status
        if (categoryId) where.categoryId = categoryId
        if (authorId) where.userId = authorId
        if (published !== undefined) {
          where.publishedAt = published ? { not: null } : null
        }
        if (scheduled !== undefined) {
          where.scheduledAt = scheduled ? { not: null } : null
        }
        if (dateFrom || dateTo) {
          where.createdAt = {}
          if (dateFrom) where.createdAt.gte = dateFrom
          if (dateTo) where.createdAt.lte = dateTo
        }
      }

      const contents = await this.prisma.content.findMany({
        where,
        include: {
          user: true,
          website: true
        },
        orderBy: { createdAt: 'desc' }
      })
      
      return contents
    } catch (error) {
      this.handleError(error)
    }
  }

  async getScheduledContent(): Promise<Content[]> {
    try {
      const now = new Date()
      
      const contents = await this.prisma.content.findMany({
        where: {
          status: 'SCHEDULED',
          updatedAt: {
            lte: now
          }
        } as any,
        include: {
          user: true,
          website: true
        }
      })
      
      return contents
    } catch (error) {
      this.handleError(error)
    }
  }

  async getContentAnalytics(contentId: string): Promise<any> {
    try {
      this.validateId(contentId)
      
      const analytics = await this.prisma.contentAnalytics.findMany({
        where: { contentId },
        orderBy: { createdAt: 'desc' }
      })
      
      return analytics
    } catch (error) {
      this.handleError(error)
    }
  }

  async recordContentView(contentId: string, metadata?: any): Promise<void> {
    try {
      this.validateId(contentId)
      
      await this.prisma.contentAnalytics.create({
        data: {
          contentId,
          metadata: metadata || {},
          createdAt: new Date()
        } as any
      })
    } catch (error) {
      console.error('Error recording content view:', error)
    }
  }

  // Utility Methods
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  override async count(filters?: ContentFilters): Promise<number> {
    try {
      const {
        search,
        type,
        status,
        categoryId,
        tags,
        authorId,
        published,
        scheduled,
        dateFrom,
        dateTo,
        ...whereFilters
      } = filters || {}
      
      const where: any = {}

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } }
        ]
      }
      if (type) where.type = type
      if (status) where.status = status
      if (categoryId) where.categoryId = categoryId
      if (authorId) where.userId = authorId
      if (published !== undefined) {
        where.publishedAt = published ? { not: null } : null
      }
      if (scheduled !== undefined) {
        where.scheduledAt = scheduled ? { not: null } : null
      }
      if (dateFrom || dateTo) {
        where.createdAt = {
          gte: dateFrom,
          lte: dateTo
        }
      }

      return await this.prisma.content.count({ where })
    } catch (error) {
      this.handleError(error)
    }
  }

  override async bulkCreate(data: Partial<Content>[]): Promise<Content[]> {
    throw new Error('Bulk create not implemented for content')
  }

  override async bulkUpdate(updates: { id: string; data: Partial<Content> }[]): Promise<Content[]> {
    throw new Error('Bulk update not implemented for content')
  }

  override async bulkDelete(ids: string[]): Promise<number> {
    try {
      const result = await this.prisma.content.deleteMany({
        where: { id: { in: ids } }
      })
      return result.count
    } catch (error) {
      this.handleError(error)
    }
  }
}

export const contentService = new ContentService()