import { prisma } from '../models/database.js'
import { redis } from '../models/redis.js'
import { ContentType, ContentStatus, ScheduleStatus } from '@prisma/client'

export class ContentService {
  // Content CRUD
  async createContent(websiteId: string, data: {
    title: string
    content: string
    excerpt?: string
    authorId: string
    categoryId?: string
    tags?: string[]
    type: string
    status: string
    seo?: any
    scheduledAt?: string
  }) {
    const slug = this.generateSlug(data.title)
    const seo = data.seo || {}

    const content = await prisma.content.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        excerpt: data.excerpt,
        authorId: data.authorId,
        categoryId: data.categoryId,
        tags: data.tags || [],
        type: data.type as ContentType,
        status: data.status as ContentStatus,
        seo,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        websiteId
      },
      include: {
        author: true,
        category: true
      }
    })

    // Cache content
    await redis.set(`content:${content.id}`, JSON.stringify(content), 'EX', 3600)

    return content
  }

  async getContents(websiteId: string, filters: {
    search?: string
    status?: string
    type?: string
    categoryId?: string
    authorId?: string
    limit?: number
    offset?: number
  } = {}) {
    const {
      search,
      status,
      type,
      categoryId,
      authorId,
      limit = 20,
      offset = 0
    } = filters

    const where: any = { websiteId }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status) where.status = status
    if (type) where.type = type
    if (categoryId) where.categoryId = categoryId
    if (authorId) where.authorId = authorId

    const [contents, total] = await Promise.all([
      prisma.content.findMany({
        where,
        include: {
          author: true,
          category: true
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.content.count({ where })
    ])

    return {
      contents,
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    }
  }

  async updateContent(id: string, data: Partial<Content>) {
    const content = await prisma.content.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        author: true,
        category: true
      }
    })

    // Update cache
    await redis.set(`content:${id}`, JSON.stringify(content), 'EX', 3600)

    return content
  }

  async deleteContent(id: string) {
    await prisma.content.delete({ where: { id } })
    await redis.del(`content:${id}`)
    return true
  }

  // Content Categories
  async createCategory(websiteId: string, data: {
    name: string
    description?: string
    parentId?: string
    seo?: any
  }) {
    const slug = this.generateSlug(data.name)

    const category = await prisma.contentCategory.create({
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        parentId: data.parentId || null,
        seo: data.seo || {},
        websiteId
      }
    })

    return category
  }

  async getCategories(websiteId: string) {
    const categories = await prisma.contentCategory.findMany({
      where: { websiteId },
      orderBy: { name: 'asc' }
    })

    return categories
  }

  // Content Scheduling
  async scheduleContent(contentId: string, data: {
    scheduledAt: string
    platforms?: string[]
  }) {
    // Update content status and scheduled time
    await this.updateContent(contentId, {
      status: 'scheduled',
      scheduledAt: data.scheduledAt
    } as any)

    // Create schedule record
    const schedule = await prisma.contentSchedule.create({
      data: {
        contentId,
        scheduledAt: new Date(data.scheduledAt),
        platforms: data.platforms || [],
        status: ScheduleStatus.PENDING
      }
    })

    return schedule
  }

  async processScheduledContent() {
    const now = new Date()

    // Find content ready to be published
    const scheduledContent = await prisma.content.findMany({
      where: {
        status: ContentStatus.SCHEDULED,
        scheduledAt: {
          lte: now
        }
      },
      include: {
        schedule: true
      }
    })

    for (const content of scheduledContent) {
      // Publish the content
      await this.updateContent(content.id, {
        status: ContentStatus.PUBLISHED,
        publishedAt: now.toISOString()
      } as any)

      // Update schedule status
      if (content.schedule) {
        await prisma.contentSchedule.update({
          where: { id: content.schedule.id },
          data: { status: ScheduleStatus.PUBLISHED }
        })
      }

      // TODO: Post to social media platforms
      if (content.schedule?.platforms) {
        await this.postToSocialMedia(content, content.schedule.platforms)
      }
    }

    return scheduledContent.length
  }

  // SEO Optimization
  async optimizeContentSEO(contentId: string) {
    const content = await prisma.content.findUnique({
      where: { id: contentId }
    })

    if (!content) throw new Error('Content not found')

    // Generate SEO recommendations using AI
    const seoSuggestions = await this.generateSEORecommendations(content)

    // Update content with optimized SEO
    const optimizedSEO = {
      ...content.seo,
      ...seoSuggestions,
      lastOptimized: new Date().toISOString()
    }

    await this.updateContent(contentId, { seo: optimizedSEO } as any)

    return seoSuggestions
  }

  private async generateSEORecommendations(content: any) {
    // This would integrate with AI service for SEO analysis
    const suggestions = {
      title: content.seo?.title || this.generateSEOTitle(content.title),
      description: content.seo?.description || this.generateSEODescription(content.content),
      keywords: content.seo?.keywords || this.extractKeywords(content.content),
      readabilityScore: this.calculateReadabilityScore(content.content),
      suggestions: [
        'Add more internal links',
        'Include relevant images with alt text',
        'Use heading hierarchy (H1, H2, H3)',
        'Optimize meta description length'
      ]
    }

    return suggestions
  }

  private generateSEOTitle(title: string): string {
    // Remove special characters and limit length
    return title.replace(/[^\w\s-]/g, '').substring(0, 60)
  }

  private generateSEODescription(content: string): string {
    // Extract first 150-160 characters as description
    const plainText = content.replace(/<[^>]*>/g, '')
    return plainText.substring(0, 155) + (plainText.length > 155 ? '...' : '')
  }

  private extractKeywords(content: string): string[] {
    // Simple keyword extraction (would be enhanced with NLP in production)
    const words = content.toLowerCase().match(/\b\w{4,}\b/g) || []
    const frequency: { [key: string]: number } = {}

    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1
    })

    return Object.keys(frequency)
      .sort((a, b) => frequency[b] - frequency[a])
      .slice(0, 10)
  }

  private calculateReadabilityScore(content: string): number {
    // Simple readability calculation (Flesch Reading Ease)
    const sentences = content.split(/[.!?]+/).length
    const words = content.split(/\s+/).length
    const syllables = this.countSyllables(content)

    if (sentences === 0 || words === 0) return 0

    const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words))
    return Math.max(0, Math.min(100, score))
  }

  private countSyllables(text: string): number {
    // Simple syllable counting
    const words = text.toLowerCase().split(/\s+/)
    let syllables = 0

    words.forEach(word => {
      syllables += word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
        .replace(/^y/, '').match(/[aeiouy]{1,2}/g)?.length || 1
    })

    return syllables
  }

  // Content Templates
  async createTemplate(data: {
    name: string
    description: string
    category: string
    content: string
    variables: any[]
    createdBy: string
    isPublic?: boolean
  }) {
    const template = await prisma.contentTemplate.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        content: data.content,
        variables: data.variables,
        createdBy: data.createdBy,
        isPublic: data.isPublic || false
      }
    })

    return template
  }

  async getTemplates(filters: { category?: string; isPublic?: boolean } = {}) {
    const where: any = {}

    if (filters.category) where.category = filters.category
    if (filters.isPublic !== undefined) where.isPublic = filters.isPublic

    const templates = await prisma.contentTemplate.findMany({
      where,
      orderBy: { usageCount: 'desc' }
    })

    return templates
  }

  async useTemplate(templateId: string, userId: string) {
    // Increment usage count
    await prisma.contentTemplate.update({
      where: { id: templateId },
      data: { usageCount: { increment: 1 } }
    })

    // Get template content
    const template = await prisma.contentTemplate.findUnique({
      where: { id: templateId }
    })

    return template
  }

  // Social Media Integration
  private async postToSocialMedia(content: any, platforms: string[]) {
    // This would integrate with social media APIs
    // For now, just log the action
    console.log(`Posting content "${content.title}" to platforms:`, platforms)

    // TODO: Implement actual social media posting
    // - Facebook Graph API
    // - Twitter API
    // - LinkedIn API
    // - Instagram Basic Display API

    return true
  }

  // Analytics
  async getContentAnalytics(contentId: string) {
    // In a real implementation, this would aggregate data from analytics services
    const analytics = await prisma.contentAnalytics.findUnique({
      where: { contentId }
    })

    if (!analytics) {
      // Create default analytics
      const defaultAnalytics = await prisma.contentAnalytics.create({
        data: {
          contentId,
          views: 0,
          uniqueViews: 0,
          avgTimeOnPage: 0,
          bounceRate: 0,
          socialShares: 0,
          backlinks: 0,
          seoScore: 0,
          readabilityScore: 0,
          lastUpdated: new Date()
        }
      })
      return defaultAnalytics
    }

    return analytics
  }

  async updateContentAnalytics(contentId: string, data: Partial<ContentAnalytics>) {
    const analytics = await prisma.contentAnalytics.upsert({
      where: { contentId },
      update: {
        ...data,
        lastUpdated: new Date()
      },
      create: {
        contentId,
        views: data.views || 0,
        uniqueViews: data.uniqueViews || 0,
        avgTimeOnPage: data.avgTimeOnPage || 0,
        bounceRate: data.bounceRate || 0,
        socialShares: data.socialShares || 0,
        backlinks: data.backlinks || 0,
        seoScore: data.seoScore || 0,
        readabilityScore: data.readabilityScore || 0,
        lastUpdated: new Date()
      }
    })

    return analytics
  }

  // Utility Methods
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  // Content Performance Insights
  async getContentInsights(websiteId: string, period: '7d' | '30d' | '90d' = '30d') {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - (period === '7d' ? 7 : period === '30d' ? 30 : 90))

    const contents = await prisma.content.findMany({
      where: {
        websiteId,
        createdAt: { gte: startDate }
      },
      include: {
        analytics: true
      }
    })

      const insights = {
        totalContents: contents.length,
        publishedContents: contents.filter(c => c.status === ContentStatus.PUBLISHED).length,
        totalViews: contents.reduce((sum, c) => sum + (c.analytics?.views || 0), 0),
        avgSEO: contents.reduce((sum, c) => sum + (c.analytics?.seoScore || 0), 0) / contents.length || 0,
        topPerforming: contents
          .filter(c => c.analytics)
          .sort((a, b) => (b.analytics?.views || 0) - (a.analytics?.views || 0))
          .slice(0, 5),
        contentTypeBreakdown: this.getContentTypeBreakdown(contents)
      }

    return insights
  }

  private getContentTypeBreakdown(contents: any[]) {
    const breakdown: { [key: string]: number } = {}

    contents.forEach(content => {
      breakdown[content.type] = (breakdown[content.type] || 0) + 1
    })

    return breakdown
  }
}

export const contentService = new ContentService()
