import { Website, Prisma } from '@prisma/client'
import { BaseService } from './baseService'

export interface CreateWebsiteData {
  name: string
  description?: string
  templateId?: string
  businessType?: string
  language?: string
  userId?: string
  teamId?: string
  content?: any
  settings?: any
  customCSS?: string
  customJS?: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
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
  metaKeywords?: string[]
  customDomain?: string
}

export interface WebsiteFilters {
  userId?: string
  teamId?: string
  status?: string
  businessType?: string
  language?: string
  templateId?: string
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  publishedAfter?: Date
  publishedBefore?: Date
}

export interface WebsiteWithRelations extends Website {
  user?: any
  pages?: any[]
  products?: any[]
  orders?: any[]
  _count?: {
    pages: number
    products: number
    orders: number
  }
}

export class WebsiteService extends BaseService<Website> {
  protected getModelName(): string {
    return 'website'
  }

  override async create(data: CreateWebsiteData): Promise<Website> {
    try {
      console.log('🔧 WebsiteService.create called with data:', data)
      this.validateRequired(data, ['name'])
      
      // Generate subdomain if not provided
      console.log('🔧 Generating subdomain for:', data.name)
      const subdomain = await this.generateSubdomain(data.name)
      console.log('🔧 Generated subdomain:', subdomain)
      
      console.log('🔧 Creating website with data:', {
        name: data.name,
        description: data.description || null,
        templateId: data.templateId || null,
        businessType: data.businessType || null,
        language: data.language || 'ENGLISH',
        userId: data.userId || null,
        subdomain,
        status: 'DRAFT'
      })
      
      const website = await this.prisma.website.create({
        data: {
          name: data.name,
          description: data.description || null,
          templateId: data.templateId || null,
          businessType: data.businessType || null,
          language: data.language || 'ENGLISH',
          user: data.userId ? { connect: { id: data.userId } } : undefined,
          content: data.content || null,
          settings: data.settings || null,
          customCSS: data.customCSS || null,
          customJS: data.customJS || null,
          metaTitle: data.metaTitle || null,
          metaDescription: data.metaDescription || null,
          metaKeywords: data.metaKeywords ? data.metaKeywords.join(',') : null,
          subdomain,
          status: 'DRAFT',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      
      console.log('✅ Website created successfully:', website.id)
      
      // Invalidate cache
      await this.invalidateCache('websites:*')
      if (data.userId) {
        await this.invalidateCache(`user:${data.userId}:websites`)
      }
      
      return website
    } catch (error) {
      console.error('❌ WebsiteService.create error:', error)
      throw error
    }
  }

  override async findById(id: string): Promise<Website | null> {
    try {
      this.validateId(id)
      
      const cacheKey = `website:${id}`
      const cached = await this.getCached<WebsiteWithRelations>(cacheKey)
      if (cached) return cached
      
      console.log('🔍 WebsiteService.findById called with id:', id)
      
      const website = await this.prisma.website.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          pages: {
            select: {
              id: true,
              name: true,
              slug: true,
              isHome: true,
              order: true
            },
            orderBy: { order: 'asc' }
          },
          products: {
            select: {
              id: true,
              name: true,
              price: true,
              status: true
            }
          },
          _count: {
            select: {
              pages: true,
              products: true,
              orders: true
            }
          }
        }
      })
      
      console.log('🔍 Prisma query result:', JSON.stringify(website, null, 2))
      
      if (website) {
        await this.setCached(cacheKey, website, 1800) // 30 minutes
      }
      
      return website
    } catch (error) {
      this.handleError(error)
    }
  }

  async findBySubdomain(subdomain: string): Promise<Website | null> {
    try {
      if (!subdomain || typeof subdomain !== 'string') {
        throw new Error('Invalid subdomain provided')
      }
      
      const cacheKey = `website:subdomain:${subdomain}`
      const cached = await this.getCached<Website>(cacheKey)
      if (cached) return cached
      
      const website = await this.prisma.website.findUnique({
        where: { subdomain },
        include: {
          pages: {
            where: { isHome: true },
            select: {
              id: true,
              name: true,
              slug: true,
              content: true,
              metaTitle: true,
              metaDescription: true,
              metaKeywords: true
            }
          }
        }
      })
      
      if (website) {
        await this.setCached(cacheKey, website, 1800) // 30 minutes
      }
      
      return website
    } catch (error) {
      this.handleError(error)
    }
  }

  async findByCustomDomain(customDomain: string): Promise<Website | null> {
    try {
      if (!customDomain || typeof customDomain !== 'string') {
        throw new Error('Invalid custom domain provided')
      }
      
      const cacheKey = `website:domain:${customDomain}`
      const cached = await this.getCached<Website>(cacheKey)
      if (cached) return cached
      
      const website = await this.prisma.website.findUnique({
        where: { customDomain },
        include: {
          pages: {
            where: { isHome: true },
            select: {
              id: true,
              name: true,
              slug: true,
              content: true,
              metaTitle: true,
              metaDescription: true,
              metaKeywords: true
            }
          }
        }
      })
      
      if (website) {
        await this.setCached(cacheKey, website, 1800) // 30 minutes
      }
      
      return website
    } catch (error) {
      this.handleError(error)
    }
  }

  override async findAll(filters: WebsiteFilters = {}): Promise<Website[]> {
    try {
      console.log('🔍 WebsiteService.findAll called with filters:', filters)
      
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search,
        publishedAfter,
        publishedBefore,
        ...whereFilters
      } = filters
      
      console.log('🔍 Processed filters:', { page, limit, sortBy, sortOrder, whereFilters })
      
      const { skip, take } = this.getPaginationParams(page, limit)
      
      // Build where clause
      const where: Prisma.WebsiteWhereInput = {
        ...whereFilters
      }
      
      console.log('🔍 Prisma where clause:', where)
      
      // Add search functionality
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { description: { contains: search } },
          { metaTitle: { contains: search } }
        ]
      }
      
      // Add date range filters
      if (publishedAfter || publishedBefore) {
        where.publishedAt = {}
        if (publishedAfter) where.publishedAt.gte = publishedAfter
        if (publishedBefore) where.publishedAt.lte = publishedBefore
      }
      
      console.log('🔍 About to execute Prisma query...')
      
      const websites = await this.prisma.website.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          _count: {
            select: {
              pages: true,
              products: true,
              orders: true
            }
          }
        }
      })
      
      return websites
    } catch (error) {
      this.handleError(error)
    }
  }

  override async update(id: string, data: UpdateWebsiteData): Promise<Website> {
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
          name: data.name,
          description: data.description || null,
          content: data.content || null,
          settings: data.settings || null,
          customCSS: data.customCSS || null,
          customJS: data.customJS || null,
          metaTitle: data.metaTitle || null,
          metaDescription: data.metaDescription || null,
          metaKeywords: data.metaKeywords ? data.metaKeywords.join(',') : null,
          customDomain: data.customDomain || null,
          updatedAt: new Date()
        }
      })
      
      // Invalidate cache
      await this.invalidateCache(`website:${id}`)
      if (existingWebsite.subdomain) {
        await this.invalidateCache(`website:subdomain:${existingWebsite.subdomain}`)
      }
      if (existingWebsite.customDomain) {
        await this.invalidateCache(`website:domain:${existingWebsite.customDomain}`)
      }
      await this.invalidateCache('websites:*')
      
      return website
    } catch (error) {
      this.handleError(error)
    }
  }

  override async delete(id: string): Promise<boolean> {
    try {
      this.validateId(id)
      
      // Check if website exists
      const existingWebsite = await this.findById(id)
      if (!existingWebsite) {
        throw new Error('Website not found')
      }
      
      // Soft delete by updating status
      await this.prisma.website.update({
        where: { id },
        data: {
          status: 'ARCHIVED',
          updatedAt: new Date()
        }
      })
      
      // Invalidate cache
      await this.invalidateCache(`website:${id}`)
      if (existingWebsite.subdomain) {
        await this.invalidateCache(`website:subdomain:${existingWebsite.subdomain}`)
      }
      if (existingWebsite.customDomain) {
        await this.invalidateCache(`website:domain:${existingWebsite.customDomain}`)
      }
      await this.invalidateCache('websites:*')
      
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  async hardDelete(id: string): Promise<boolean> {
    try {
      this.validateId(id)
      
      const existingWebsite = await this.findById(id)
      if (!existingWebsite) {
        throw new Error('Website not found')
      }
      
      // Delete related data first
      await this.prisma.page.deleteMany({ where: { websiteId: id } })
      await this.prisma.product.deleteMany({ where: { websiteId: id } })
      await this.prisma.order.deleteMany({ where: { websiteId: id } })
      await this.prisma.websiteVisitor.deleteMany({ where: { websiteId: id } })
      
      // Delete website
      await this.prisma.website.delete({ where: { id } })
      
      // Invalidate cache
      await this.invalidateCache(`website:${id}`)
      if (existingWebsite.subdomain) {
        await this.invalidateCache(`website:subdomain:${existingWebsite.subdomain}`)
      }
      if (existingWebsite.customDomain) {
        await this.invalidateCache(`website:domain:${existingWebsite.customDomain}`)
      }
      await this.invalidateCache('websites:*')
      
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  // Publishing methods
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
      if (website.subdomain) {
        await this.invalidateCache(`website:subdomain:${website.subdomain}`)
      }
      if (website.customDomain) {
        await this.invalidateCache(`website:domain:${website.customDomain}`)
      }
      
      return website
    } catch (error) {
      this.handleError(error)
    }
  }

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
      if (website.subdomain) {
        await this.invalidateCache(`website:subdomain:${website.subdomain}`)
      }
      if (website.customDomain) {
        await this.invalidateCache(`website:domain:${website.customDomain}`)
      }
      
      return website
    } catch (error) {
      this.handleError(error)
    }
  }

  // Domain management
  async generateSubdomain(name: string): Promise<string> {
    let subdomain = name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    
    // Ensure subdomain is not empty
    if (!subdomain) {
      subdomain = 'website'
    }
    
    let counter = 1
    let originalSubdomain = subdomain
    
    while (await this.isSubdomainTaken(subdomain)) {
      subdomain = `${originalSubdomain}-${counter}`
      counter++
    }
    
    return subdomain
  }

  private async isSubdomainTaken(subdomain: string): Promise<boolean> {
    const website = await this.prisma.website.findFirst({
      where: { subdomain }
    })
    return !!website
  }

  async updateCustomDomain(id: string, customDomain: string): Promise<Website> {
    try {
      this.validateId(id)
      
      // Check if domain is already taken
      const existingWebsite = await this.prisma.website.findFirst({
        where: { 
          customDomain,
          id: { not: id }
        }
      })
      
      if (existingWebsite) {
        throw new Error('Custom domain is already in use')
      }
      
      const website = await this.prisma.website.update({
        where: { id },
        data: {
          customDomain,
          updatedAt: new Date()
        }
      })
      
      // Invalidate cache
      await this.invalidateCache(`website:${id}`)
      await this.invalidateCache(`website:domain:${customDomain}`)
      
      return website
    } catch (error) {
      this.handleError(error)
    }
  }

  // Duplication
  async duplicate(id: string, newName: string, userId?: string): Promise<Website> {
    try {
      this.validateId(id)
      
      const originalWebsite = await this.findById(id)
      if (!originalWebsite) {
        throw new Error('Website not found')
      }
      
      const subdomain = await this.generateSubdomain(newName)
      
      const duplicatedWebsite = await this.prisma.website.create({
        data: {
          name: newName,
          description: originalWebsite.description,
          templateId: originalWebsite.templateId,
          businessType: originalWebsite.businessType,
          language: originalWebsite.language,
          content: originalWebsite.content,
          settings: originalWebsite.settings,
          customCSS: originalWebsite.customCSS,
          customJS: originalWebsite.customJS,
          metaTitle: originalWebsite.metaTitle,
          metaDescription: originalWebsite.metaDescription,
          metaKeywords: originalWebsite.metaKeywords,
          subdomain,
          status: 'DRAFT',
          userId: userId || originalWebsite.userId,
          teamId: originalWebsite.teamId,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      
      // Duplicate pages
      const pages = await this.prisma.page.findMany({
        where: { websiteId: id }
      })
      
      if (pages.length > 0) {
        await this.prisma.page.createMany({
          data: pages.map(page => ({
            websiteId: duplicatedWebsite.id,
            name: page.name,
            slug: page.slug,
            content: page.content as Prisma.InputJsonValue,
            settings: page.settings as Prisma.InputJsonValue,
            isHome: page.isHome,
            order: page.order,
            metaTitle: page.metaTitle,
            metaDescription: page.metaDescription,
            metaKeywords: page.metaKeywords,
            createdAt: new Date(),
            updatedAt: new Date()
          }))
        })
      }
      
      // Invalidate cache
      await this.invalidateCache('websites:*')
      
      return duplicatedWebsite
    } catch (error) {
      this.handleError(error)
    }
  }

  // Statistics
  async getStats(): Promise<{
    totalWebsites: number
    publishedWebsites: number
    draftWebsites: number
    websitesThisMonth: number
    websitesByStatus: Record<string, number>
    websitesByBusinessType: Record<string, number>
    websitesByLanguage: Record<string, number>
  }> {
    try {
      const cacheKey = 'website:stats'
      const cached = await this.getCached(cacheKey)
      if (cached) return cached
      
      const [
        totalWebsites,
        publishedWebsites,
        draftWebsites,
        websitesThisMonth,
        websitesByStatus,
        websitesByBusinessType,
        websitesByLanguage
      ] = await Promise.all([
        this.prisma.website.count(),
        this.prisma.website.count({ where: { status: 'PUBLISHED' } }),
        this.prisma.website.count({ where: { status: 'DRAFT' } }),
        this.prisma.website.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        }),
        this.prisma.website.groupBy({
          by: ['status'],
          _count: { status: true }
        }),
        this.prisma.website.groupBy({
          by: ['businessType'],
          _count: { businessType: true },
          where: { businessType: { not: null } }
        }),
        this.prisma.website.groupBy({
          by: ['language'],
          _count: { language: true }
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

  // Bulk operations
  override async bulkCreate(websites: CreateWebsiteData[]): Promise<Website[]> {
    try {
      const websitesWithSubdomains = await Promise.all(
        websites.map(async (website) => ({
          ...website,
          subdomain: await this.generateSubdomain(website.name),
          status: 'DRAFT',
          language: website.language || 'ENGLISH',
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      )
      
      const result = await this.prisma.website.createMany({
        data: websitesWithSubdomains.map(website => ({
          name: website.name,
          description: website.description || null,
          templateId: website.templateId || null,
          businessType: website.businessType || null,
          language: website.language || 'ENGLISH',
          userId: website.userId || null,
          teamId: website.teamId || null,
          content: website.content || null,
          settings: website.settings || null,
          customCSS: website.customCSS || null,
          customJS: website.customJS || null,
          metaTitle: website.metaTitle || null,
          metaDescription: website.metaDescription || null,
          metaKeywords: website.metaKeywords || [],
          subdomain: website.subdomain,
          status: 'DRAFT',
          createdAt: new Date(),
          updatedAt: new Date()
        })),
        skipDuplicates: true
      })
      
      // Invalidate cache
      await this.invalidateCache('websites:*')
      
      return await this.prisma.website.findMany({
        where: {
          name: { in: websites.map(w => w.name) }
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  override async bulkUpdate(updates: Array<{ id: string; data: UpdateWebsiteData }>): Promise<Website[]> {
    try {
      const results: Website[] = []
      
      for (const update of updates) {
        const website = await this.update(update.id, update.data)
        results.push(website)
      }
      
      return results
    } catch (error) {
      this.handleError(error)
    }
  }

  override async bulkDelete(ids: string[]): Promise<number> {
    try {
      const result = await this.prisma.website.updateMany({
        where: { id: { in: ids } },
        data: {
          status: 'ARCHIVED',
          updatedAt: new Date()
        }
      })
      
      // Invalidate cache
      await this.invalidateCache('websites:*')
      
      return result.count
    } catch (error) {
      this.handleError(error)
    }
  }
}
