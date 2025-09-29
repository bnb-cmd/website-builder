import {
  Prisma,
  AdvancedTemplate,
  TemplateCategory,
  TemplateStatus,
  TemplatePricingModel,
  TemplateComplexity,
  TemplateGenerationStatus
} from '@prisma/client'
import { BaseService } from './baseService'

const DEFAULT_VERSION = '1.0.0'

type MarketplaceMeta = {
  featured: boolean
  trending: boolean
  popular: boolean
  verified: boolean
  salesCount: number
  revenue: number
  commission: number
}

interface CreateAdvancedTemplateInput {
  name: string
  description: string
  category: TemplateCategory | string
  authorId: string
  configuration: Prisma.InputJsonValue
  marketplace?: Partial<MarketplaceMeta>
  price?: number
  currency?: string
  pricingModel?: TemplatePricingModel | string
  technologies?: string[]
  features?: unknown[]
  responsive?: boolean
  customizable?: boolean
  aiGenerated?: boolean
  complexity?: TemplateComplexity | string
  estimatedSetupTime?: number
  tags?: string[]
  status?: TemplateStatus | string
  version?: string
  changelog?: unknown[]
  dependencies?: unknown[]
  previewImages?: string[]
}

interface UpdateAdvancedTemplateInput extends Partial<Omit<CreateAdvancedTemplateInput, 'authorId' | 'configuration'>> {
  configuration?: Prisma.InputJsonValue
}

interface TemplateFilters {
  category?: string
  status?: string
  authorId?: string
  search?: string
  pricingModel?: string
  featured?: boolean
  limit?: number
  offset?: number
}

interface GenerateTemplateWithAIInput {
  userId: string
  prompt: string
  requirements?: {
    category?: string
    features?: string[]
    style?: string
    colorScheme?: string[]
    targetAudience?: string
    industry?: string
  }
}

interface CreateCustomizationInput {
  templateId: string
  userId: string
  name: string
  description?: string
  customizations: Array<Record<string, unknown>>
}

interface CreateReviewInput {
  templateId: string
  userId: string
  rating: number
  title?: string
  content?: string
  images?: string[]
}

type TemplateListItem = Prisma.AdvancedTemplateGetPayload<{
  include: {
    author: {
      select: {
        id: true
        name: true
        avatar: true
      }
    }
    reviews: {
      select: { rating: true }
    }
    _count: {
      select: {
        reviews: true
        customizations: true
      }
    }
  }
}>

type TemplateDetail = Prisma.AdvancedTemplateGetPayload<{
  include: {
    author: true
    reviews: {
      include: {
        user: {
          select: {
            name: true
            avatar: true
          }
        }
      }
      orderBy: { createdAt: 'desc' }
      take: 10
    }
    customizations: {
      where: { status: 'PUBLISHED' }
      take: 5
    }
    _count: {
      select: {
        reviews: true
        customizations: true
      }
    }
  }
}>

const defaultMarketplace: MarketplaceMeta = {
  featured: false,
  trending: false,
  popular: false,
  verified: false,
  salesCount: 0,
  revenue: 0,
  commission: 10
}

export class AdvancedTemplateService extends BaseService<AdvancedTemplate> {
  protected override getModelName(): string {
    return 'advancedTemplate'
  }

  private toJson(value: unknown, fallback: unknown = {}): Prisma.InputJsonValue {
    const candidate = value === undefined || value === null ? fallback : value
    try {
      return JSON.parse(JSON.stringify(candidate)) as Prisma.InputJsonValue
    } catch (error) {
      console.warn('Failed to serialise advanced template JSON value', error)
      return JSON.parse(JSON.stringify(fallback)) as Prisma.InputJsonValue
    }
  }

  override async create(data: Partial<AdvancedTemplate>): Promise<AdvancedTemplate> {
    return this.createTemplate(data as CreateAdvancedTemplateInput)
  }

  override async findById(id: string): Promise<AdvancedTemplate | null> {
    const result = await this.getTemplateById(id)
    if (!result) return null
    
    return {
      ...result,
      rating: result.rating === undefined ? null : result.rating,
      reviewCount: result._count.reviews,
      customizationCount: result._count.customizations
    } as AdvancedTemplate
  }

  override async findAll(filters: TemplateFilters = {}): Promise<AdvancedTemplate[]> {
    const result = await this.getTemplates(filters)
    return result.templates.map(template => ({
      ...template,
      rating: template.rating === undefined ? null : template.rating,
      reviewCount: template._count.reviews,
      customizationCount: template._count.customizations
    })) as AdvancedTemplate[]
  }

  override async update(id: string, data: Partial<AdvancedTemplate>): Promise<AdvancedTemplate> {
    return this.updateTemplate(id, data as UpdateAdvancedTemplateInput)
  }

  override async delete(id: string): Promise<boolean> {
    return this.deleteTemplate(id)
  }

  private normalizeEnumValue<T extends string>(value: string | undefined, enumObject: Record<string, T>, fallback: T): T {
    if (!value) {
      return fallback
    }

    const normalized = value.toUpperCase()
    const match = (Object.values(enumObject) as T[]).find(enumValue => enumValue === normalized)
    return match ?? fallback
  }

  private toMarketplaceJson(value?: Partial<MarketplaceMeta>): Prisma.InputJsonValue {
    return this.toJson({
      ...defaultMarketplace,
      ...value
    }, defaultMarketplace)
  }

  private parseMarketplace(value: Prisma.JsonValue | null | undefined): MarketplaceMeta {
    if (!value || typeof value !== 'object') {
      return { ...defaultMarketplace }
    }

    const parsed = value as Record<string, unknown>

    return {
      featured: Boolean(parsed['featured']),
      trending: Boolean(parsed['trending']),
      popular: Boolean(parsed['popular']),
      verified: Boolean(parsed['verified']),
      salesCount: Number(parsed['salesCount'] ?? 0),
      revenue: Number(parsed['revenue'] ?? 0),
      commission: Number(parsed['commission'] ?? defaultMarketplace.commission)
    }
  }

  private mapTemplate(template: TemplateListItem) {
    const reviews = template.reviews ?? []
    const reviewCount = template._count.reviews
    const rating = reviewCount > 0
      ? reviews.reduce((sum, review) => sum + (review.rating ?? 0), 0) / reviewCount
      : template.rating ?? null

    return {
      ...template,
      rating,
      reviewCount,
      customizationCount: template._count.customizations
    }
  }

  async createTemplate(data: CreateAdvancedTemplateInput) {
    this.validateRequired(data, ['name', 'description', 'category', 'authorId', 'configuration'])

    const category = this.normalizeEnumValue(data.category as string, TemplateCategory, TemplateCategory.BUSINESS)
    const pricingModel = data.pricingModel
      ? this.normalizeEnumValue(data.pricingModel as string, TemplatePricingModel, TemplatePricingModel.FREE)
      : data.price && data.price > 0
        ? TemplatePricingModel.PREMIUM
        : TemplatePricingModel.FREE
    const status = this.normalizeEnumValue(data.status as string | undefined, TemplateStatus, TemplateStatus.DRAFT)
    const complexity = this.normalizeEnumValue(data.complexity as string | undefined, TemplateComplexity, TemplateComplexity.INTERMEDIATE)

    const template = await this.prisma.advancedTemplate.create({
      data: {
        name: data.name,
        description: data.description,
        category,
        authorId: data.authorId,
        configuration: data.configuration,
        marketplace: this.toMarketplaceJson(data.marketplace),
        price: data.price ?? 0,
        currency: data.currency ?? 'PKR',
        pricingModel,
        technologies: data.technologies ?? [],
        features: this.toJson(data.features, []),
        responsive: data.responsive ?? true,
        customizable: data.customizable ?? true,
        aiGenerated: data.aiGenerated ?? false,
        complexity,
        estimatedSetupTime: data.estimatedSetupTime ?? 15,
        tags: data.tags ?? [],
        status,
        version: data.version ?? DEFAULT_VERSION,
        changelog: this.toJson(data.changelog, [
          {
            version: DEFAULT_VERSION,
            date: new Date().toISOString(),
            changes: ['Initial release'],
            author: data.authorId
          }
        ]),
        dependencies: this.toJson(data.dependencies, []),
        previewImages: data.previewImages ?? [],
        downloadCount: 0
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        reviews: {
          select: { rating: true }
        },
        _count: {
          select: {
            reviews: true,
            customizations: true
          }
        }
      }
    })

    await this.invalidateCache('advanced-template:list:*')
    await this.invalidateCache('advanced-template:detail:*')

    return this.mapTemplate(template)
  }

  async getTemplates(filters: TemplateFilters = {}) {
    const {
      category,
      status,
      authorId,
      search,
      pricingModel,
      featured,
      limit = 20,
      offset = 0
    } = filters

    const where: Prisma.AdvancedTemplateWhereInput = {}

    if (category) {
      where.category = this.normalizeEnumValue(category, TemplateCategory, TemplateCategory.BUSINESS)
    }

    if (status) {
      where.status = this.normalizeEnumValue(status, TemplateStatus, TemplateStatus.DRAFT)
    }

    if (authorId) {
      where.authorId = authorId
    }

    if (pricingModel) {
      where.pricingModel = this.normalizeEnumValue(pricingModel, TemplatePricingModel, TemplatePricingModel.FREE)
    }

    const andFilters: Prisma.AdvancedTemplateWhereInput[] = []

    if (typeof featured === 'boolean') {
      andFilters.push({
        marketplace: {
          path: ['featured'],
          equals: featured
        }
      })
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
        { technologies: { has: search } }
      ]
    }

    if (andFilters.length > 0) {
      where.AND = andFilters
    }

    const cacheKey = `advanced-template:list:${JSON.stringify({ where, limit, offset })}`
    const cached = await this.getCached<{ templates: any[]; total: number; limit: number; offset: number; hasMore: boolean }>(cacheKey)

    if (cached) {
      return cached
    }

    const [templates, total] = await Promise.all([
      this.prisma.advancedTemplate.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          reviews: {
            select: { rating: true }
          },
          _count: {
            select: {
              reviews: true,
              customizations: true
            }
          }
        },
        orderBy: [
          { downloadCount: 'desc' },
          { createdAt: 'desc' }
        ],
        take: limit,
        skip: offset
      }),
      this.prisma.advancedTemplate.count({ where })
    ])

    const mapped = templates.map(template => this.mapTemplate(template))
    const result = {
      templates: mapped,
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    }

    await this.setCached(cacheKey, result, 60)

    return result
  }

  async getTemplateById(id: string) {
    this.validateId(id)

    const cacheKey = `advanced-template:detail:${id}`
    const cached = await this.getCached<ReturnType<AdvancedTemplateService['formatTemplateDetail']>>(cacheKey)
    if (cached) {
      return cached
    }

    const template = await this.prisma.advancedTemplate.findUnique({
      where: { id },
      include: {
        author: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
    customizations: {
      where: { status: 'PUBLISHED' },
      take: 5
    },
        _count: {
          select: {
            reviews: true,
            customizations: true
          }
        }
      }
    })

    const formatted = this.formatTemplateDetail(template)

    if (formatted) {
      await this.setCached(cacheKey, formatted, 120)
    }

    return formatted
  }

  async updateTemplate(id: string, data: UpdateAdvancedTemplateInput) {
    this.validateId(id)

    const updateData: Prisma.AdvancedTemplateUpdateInput = {
      updatedAt: new Date()
    }

    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.category !== undefined) {
      updateData.category = this.normalizeEnumValue(data.category as string, TemplateCategory, TemplateCategory.BUSINESS)
    }
    if (data.configuration !== undefined) updateData.configuration = data.configuration
    if (data.marketplace !== undefined) updateData.marketplace = this.toMarketplaceJson(data.marketplace)
    if (data.price !== undefined) updateData.price = data.price
    if (data.currency !== undefined) updateData.currency = data.currency
    if (data.pricingModel !== undefined) {
      updateData.pricingModel = this.normalizeEnumValue(data.pricingModel as string, TemplatePricingModel, TemplatePricingModel.FREE)
    }
    if (data.technologies !== undefined) updateData.technologies = data.technologies
    if (data.features !== undefined) updateData.features = this.toJson(data.features, [])
    if (data.responsive !== undefined) updateData.responsive = data.responsive
    if (data.customizable !== undefined) updateData.customizable = data.customizable
    if (data.aiGenerated !== undefined) updateData.aiGenerated = data.aiGenerated
    if (data.complexity !== undefined) {
      updateData.complexity = this.normalizeEnumValue(data.complexity as string, TemplateComplexity, TemplateComplexity.INTERMEDIATE)
    }
    if (data.estimatedSetupTime !== undefined) updateData.estimatedSetupTime = data.estimatedSetupTime
    if (data.tags !== undefined) updateData.tags = data.tags
    if (data.status !== undefined) {
      updateData.status = this.normalizeEnumValue(data.status as string, TemplateStatus, TemplateStatus.DRAFT)
    }
    if (data.version !== undefined) updateData.version = data.version
    if (data.changelog !== undefined) updateData.changelog = this.toJson(data.changelog, [])
    if (data.dependencies !== undefined) updateData.dependencies = this.toJson(data.dependencies, [])
    if (data.previewImages !== undefined) updateData.previewImages = data.previewImages

    const template = await this.prisma.advancedTemplate.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        reviews: {
          select: { rating: true }
        },
        _count: {
          select: {
            reviews: true,
            customizations: true
          }
        }
      }
    })

    await this.invalidateCache(`advanced-template:detail:${id}`)
    await this.invalidateCache('advanced-template:list:*')

    return this.mapTemplate(template)
  }

  async deleteTemplate(id: string) {
    this.validateId(id)

    await this.prisma.advancedTemplate.delete({ where: { id } })

    await this.invalidateCache(`advanced-template:detail:${id}`)
    await this.invalidateCache('advanced-template:list:*')

    return true
  }

  async generateTemplateWithAI(data: GenerateTemplateWithAIInput) {
    this.validateRequired(data, ['userId', 'prompt'])

    const generation = await this.prisma.templateAIGeneration.create({
      data: {
        userId: data.userId,
        prompt: data.prompt,
        requirements: data.requirements ?? {},
        status: TemplateGenerationStatus.GENERATING,
        progress: 0,
        estimatedCompletion: new Date(Date.now() + 5 * 60 * 1000)
      }
    })

    // Fire-and-forget processing
    void this.processAIGeneration(generation.id).catch(error => {
      console.error('Failed to process AI generation:', error)
    })

    return generation
  }

  private async processAIGeneration(generationId: string) {
    try {
      await this.prisma.templateAIGeneration.update({
        where: { id: generationId },
        data: { progress: 10 }
      })

      const steps = [25, 50, 75, 90]
      for (const progress of steps) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.prisma.templateAIGeneration.update({
          where: { id: generationId },
          data: { progress }
        })
      }

      const generation = await this.prisma.templateAIGeneration.findUnique({ where: { id: generationId } })
      if (!generation) return

      const template = await this.createAIGeneratedTemplate(generation)

      await this.prisma.templateAIGeneration.update({
        where: { id: generationId },
        data: {
          status: TemplateGenerationStatus.COMPLETED,
          progress: 100,
          generatedTemplateId: template.id
        }
      })
    } catch (error) {
      await this.prisma.templateAIGeneration.update({
        where: { id: generationId },
        data: {
          status: TemplateGenerationStatus.FAILED,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        }
      })
    }
  }

  private async createAIGeneratedTemplate(generation: { id: string; userId: string; prompt: string; requirements: Prisma.JsonValue | null }) {
    const requirements = (generation.requirements as Record<string, unknown> | null) ?? {}
    const colorScheme = Array.isArray(requirements['colorScheme'])
      ? (requirements['colorScheme'] as string[])
      : ['#3B82F6', '#1F2937', '#F9FAFB']

    const configuration = this.generateTemplateConfiguration({
      colorScheme,
      industry: (requirements['industry'] as string) ?? 'general',
      targetAudience: (requirements['targetAudience'] as string) ?? 'general'
    })

    const category = this.normalizeEnumValue(requirements['category'] as string | undefined, TemplateCategory, TemplateCategory.BUSINESS)

    const template = await this.createTemplate({
      name: `AI Generated: ${generation.prompt.substring(0, 50)}...`,
      description: `AI-generated template based on: ${generation.prompt}`,
      category,
      authorId: generation.userId,
      configuration,
      marketplace: {
        verified: true
      },
      technologies: ['React', 'Next.js', 'Tailwind CSS'],
      features: [
        { name: 'Responsive Design', description: 'Mobile-first responsive layout', included: true },
        { name: 'SEO Optimized', description: 'Built-in SEO features', included: true },
        { name: 'Fast Loading', description: 'Optimized for performance', included: true }
      ],
      aiGenerated: true
    })

    return template
  }

  private generateTemplateConfiguration(options: { colorScheme: string[]; industry: string; targetAudience: string }): Prisma.InputJsonValue {
    const [primary, secondary, background] = options.colorScheme
    const industry = options.industry || 'general'
    const audience = options.targetAudience || 'customers'

    return {
      pages: [
        {
          id: 'home',
          name: 'Home',
          path: '/',
          content: this.generatePageContent('home', { industry, targetAudience: audience }),
          meta: {
            title: 'Home',
            description: 'Welcome to our website'
          },
          layout: 'default'
        },
        {
          id: 'about',
          name: 'About',
          path: '/about',
          content: this.generatePageContent('about', { industry, targetAudience: audience }),
          meta: {
            title: 'About Us',
            description: 'Learn more about our company'
          },
          layout: 'default'
        }
      ],
      components: [
        {
          id: 'hero',
          name: 'Hero Section',
          type: 'hero',
          content: '<div class="hero">Hero content</div>',
          props: { backgroundColor: primary },
          styles: { minHeight: '400px' }
        }
      ],
      styles: [
        {
          id: 'main',
          name: 'Main Styles',
          content: this.generateCSS([primary || '#3B82F6', secondary || '#1F2937', background || '#F9FAFB']),
          type: 'css',
          variables: {
            primaryColor: primary,
            secondaryColor: secondary,
            backgroundColor: background
          }
        }
      ],
      scripts: [],
      assets: [],
      settings: {
        theme: {
          colors: options.colorScheme,
          fonts: ['Inter', 'sans-serif']
        }
      }
    }
  }

  private generatePageContent(pageType: string, options: { industry: string; targetAudience: string }): string {
    const industry = options.industry || 'general'
    const audience = options.targetAudience || 'customers'
    
    switch (pageType) {
      case 'home':
        return `<div class="container mx-auto px-4">\n  <section class="hero py-20">\n    <h1 class="text-4xl font-bold mb-4">Welcome to Our ${industry} Website</h1>\n    <p class="text-xl mb-8">Serving ${audience} with excellence</p>\n    <button class="bg-blue-600 text-white px-6 py-3 rounded">Get Started</button>\n  </section>\n</div>`
      case 'about':
        return `<div class="container mx-auto px-4 py-16">\n  <h1 class="text-3xl font-bold mb-8">About Us</h1>\n  <p class="text-lg mb-6">We are dedicated to serving our ${audience} in the ${industry} industry.</p>\n</div>`
      default:
        return '<div>Page content</div>'
    }
  }

  private generateCSS(colorScheme: string[]): string {
    const primary = colorScheme[0] || '#3B82F6'
    const secondary = colorScheme[1] || '#1F2937'
    const background = colorScheme[2] || '#F9FAFB'
    
    return `:root {\n  --primary-color: ${primary};\n  --secondary-color: ${secondary};\n  --background-color: ${background};\n}\n\nbody {\n  font-family: 'Inter', sans-serif;\n  color: var(--secondary-color);\n  background-color: var(--background-color);\n}\n\n.hero {\n  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));\n  color: white;\n  text-align: center;\n}\n\nbutton {\n  transition: all 0.3s ease;\n}\n\nbutton:hover {\n  opacity: 0.9;\n  transform: translateY(-2px);\n}`
  }

  async createCustomization(data: CreateCustomizationInput) {
    this.validateRequired(data, ['templateId', 'userId', 'name', 'customizations'])

    const customization = await this.prisma.templateCustomization.create({
      data: {
        templateId: data.templateId,
        userId: data.userId,
        name: data.name,
        description: data.description ?? null,
        customizations: data.customizations as Prisma.InputJsonValue,
        status: 'DRAFT'
      }
    })

    await this.invalidateCache(`advanced-template:detail:${data.templateId}`)

    return customization
  }

  async applyCustomization(customizationId: string) {
    this.validateId(customizationId)

    const customization = await this.prisma.templateCustomization.findUnique({
      where: { id: customizationId },
      include: { template: true }
    })

    if (!customization) {
      throw new Error('Customization not found')
    }

    const updatedConfiguration = this.applyCustomizationsToConfig(
      customization.template.configuration,
      customization.customizations as Array<Record<string, unknown>>
    ) as Prisma.InputJsonValue

    await this.prisma.advancedTemplate.update({
      where: { id: customization.templateId },
      data: { configuration: updatedConfiguration }
    })

    await this.prisma.templateCustomization.update({
      where: { id: customizationId },
      data: { status: 'PUBLISHED' }
    })

    await this.invalidateCache(`advanced-template:detail:${customization.templateId}`)

    return customization
  }

  private applyCustomizationsToConfig(originalConfig: Prisma.JsonValue, customizations: Array<Record<string, unknown>>): Prisma.JsonValue {
    if (!originalConfig || typeof originalConfig !== 'object') {
      return originalConfig
    }

    const config = structuredClone(originalConfig) as Record<string, unknown>

    for (const customization of customizations) {
      const { type, target, value } = customization as { type?: string; target?: string; value?: unknown }

      if (!type || !target) continue

      switch (type) {
        case 'color':
          if (Array.isArray(config['styles'])) {
            config['styles'] = (config['styles'] as Array<Record<string, unknown>>).map(style => ({
              ...style,
              variables: {
                ...(style['variables'] as Record<string, unknown> | undefined),
                [target]: value
              }
            }))
          }
          break
        case 'font':
          if ((config['settings'] as Record<string, unknown> | undefined)?.['theme']) {
            const settings = config['settings'] as Record<string, unknown>
            const theme = (settings['theme'] as Record<string, unknown>) ?? {}
            theme['fonts'] = [value, 'sans-serif'].filter(Boolean)
            settings['theme'] = theme
          }
          break
        case 'layout':
          // Placeholder for layout changes
          break
        case 'content':
          if (Array.isArray(config['pages'])) {
            config['pages'] = (config['pages'] as Array<Record<string, unknown>>).map(page => ({
              ...page,
              content: typeof page['content'] === 'string'
                ? page['content'].replace(new RegExp(target, 'g'), String(value ?? ''))
                : page['content']
            }))
          }
          break
      }
    }

    return config as Prisma.JsonValue
  }

  async createReview(data: CreateReviewInput) {
    this.validateRequired(data, ['templateId', 'userId', 'rating'])

    const existingReview = await this.prisma.templateReview.findUnique({
      where: {
        templateId_userId: {
          templateId: data.templateId,
          userId: data.userId
        }
      }
    })

    if (existingReview) {
      throw new Error('User has already reviewed this template')
    }

    const review = await this.prisma.templateReview.create({
      data: {
        templateId: data.templateId,
        userId: data.userId,
        rating: data.rating,
        title: data.title ?? null,
        content: data.content ?? null,
        images: data.images ?? [],
        verified: true
      }
    })

    await this.updateTemplateRating(data.templateId)
    await this.invalidateCache(`advanced-template:detail:${data.templateId}`)

    return review
  }

  async updateTemplateRating(templateId: string) {
    const reviews = await this.prisma.templateReview.findMany({
      where: { templateId },
      select: { rating: true }
    })

    if (reviews.length === 0) {
      return
    }

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

    await this.prisma.advancedTemplate.update({
      where: { id: templateId },
      data: {
        rating: averageRating,
        reviewCount: reviews.length
      }
    })
  }

  async purchaseTemplate(templateId: string, userId: string) {
    this.validateRequired({ templateId, userId }, ['templateId', 'userId'])

    const template = await this.prisma.advancedTemplate.findUnique({ where: { id: templateId } })

    if (!template) throw new Error('Template not found')
    if (template.pricingModel === TemplatePricingModel.FREE) throw new Error('Template is already free')

    const marketplace = this.parseMarketplace(template.marketplace)
    marketplace.salesCount += 1
    marketplace.revenue += template.price ?? 0

    const updatedTemplate = await this.prisma.advancedTemplate.update({
      where: { id: templateId },
      data: {
        downloadCount: { increment: 1 },
        marketplace: marketplace as Prisma.InputJsonValue
      }
    })

    await this.invalidateCache(`advanced-template:detail:${templateId}`)
    await this.invalidateCache('advanced-template:list:*')

    return { success: true, template: updatedTemplate, userId }
  }

  async getTemplateAnalytics(templateId: string) {
    this.validateId(templateId)

    const template = await this.prisma.advancedTemplate.findUnique({
      where: { id: templateId },
      select: {
        id: true,
        marketplace: true,
        downloadCount: true,
        _count: {
          select: {
            reviews: true,
            customizations: true
          }
        },
        rating: true
      }
    })

    if (!template) return null

    const marketplace = this.parseMarketplace(template.marketplace)

    return {
      templateId,
      downloads: template.downloadCount,
      sales: marketplace.salesCount,
      revenue: marketplace.revenue,
      reviews: template._count.reviews,
      customizations: template._count.customizations,
      rating: template.rating
    }
  }

  async getTemplateCategories() {
    const counts = await this.prisma.advancedTemplate.groupBy({
      by: ['category'],
      _count: { _all: true }
    })

    const categories = Object.values(TemplateCategory).map(category => ({
      category,
      templateCount: counts.find(item => item.category === category)?._count._all ?? 0
    }))

    return categories
  }

  async searchTemplates(query: string, filters: { category?: string; pricingModel?: string; complexity?: string } = {}) {
    const where: Prisma.AdvancedTemplateWhereInput = {}

    if (query) {
      where.OR = [
        { name: { contains: query, mode: Prisma.QueryMode.insensitive } },
        { description: { contains: query, mode: Prisma.QueryMode.insensitive } },
        { tags: { has: query } },
        { technologies: { has: query } }
      ]
    }

    if (filters.category) {
      where.category = this.normalizeEnumValue(filters.category, TemplateCategory, TemplateCategory.BUSINESS)
    }

    if (filters.pricingModel) {
      where.pricingModel = this.normalizeEnumValue(filters.pricingModel, TemplatePricingModel, TemplatePricingModel.FREE)
    }

    if (filters.complexity) {
      where.complexity = this.normalizeEnumValue(filters.complexity, TemplateComplexity, TemplateComplexity.INTERMEDIATE)
    }

    const templates = await this.prisma.advancedTemplate.findMany({
      where,
      include: {
        author: { select: { name: true } },
        _count: { select: { reviews: true } }
      },
      orderBy: { downloadCount: 'desc' },
      take: 50
    })

    return templates
  }

  async getAIGenerationStatus(generationId: string) {
    this.validateId(generationId)

    return this.prisma.templateAIGeneration.findUnique({
      where: { id: generationId },
      include: {
        generatedTemplate: true
      }
    })
  }

  private formatTemplateDetail(template: TemplateDetail | null) {
    if (!template) return null

    const rating = template.reviews.length > 0
      ? template.reviews.reduce((sum, review) => sum + review.rating, 0) / template.reviews.length
      : template.rating ?? null

    const detail = {
      ...template,
      rating: rating === undefined ? null : rating,
      reviewCount: template._count.reviews,
      customizationCount: template._count.customizations
    }

    return detail
  }
}

export const advancedTemplateService = new AdvancedTemplateService()
