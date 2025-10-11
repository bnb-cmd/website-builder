import { BaseService } from './baseService'
import { AIGeneration, AIGenerationType, Language, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

// Cost control interfaces
interface AIQuota {
  monthlyLimit: number
  used: number
  resetDate: Date
  tier: 'free' | 'premium' | 'enterprise'
}

interface ContentGenerationRequest {
  prompt: string
  language: Language
  contentType: 'hero' | 'about' | 'services' | 'contact' | 'blog' | 'product'
  businessType?: string
  tone?: 'professional' | 'casual' | 'friendly' | 'formal'
  maxTokens?: number
  temperature?: number
  useAI?: boolean // Cost control flag
}

interface SEOOptimizationRequest {
  content: string
  targetKeywords?: string[]
  language: Language
  businessType?: string
  contentType?: string
  useAI?: boolean
}

interface ColorGenerationRequest {
  businessType: string
  brandPersonality?: 'modern' | 'traditional' | 'luxury' | 'friendly' | 'professional'
  primaryColor?: string
  style?: 'monochromatic' | 'complementary' | 'triadic' | 'analogous'
  language: Language
  useAI?: boolean
}

interface TemplateSuggestionRequest {
  businessType: string
  industry?: string
  language: Language
  features?: string[]
  budget?: 'free' | 'premium'
  useAI?: boolean
}

interface AIGenerationResponse {
  content: string
  tokens: number
  cost: number
  model: string
  generationId: string
}

export class AIService extends BaseService<AIGeneration> {
  protected override getModelName(): string {
    return 'aIGeneration'
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
  override async findById(id: string): Promise<AIGeneration | null> {
    this.validateId(id)
    return this.prisma.aIGeneration.findUnique({ where: { id } })
  }

  override async findAll(filters?: Prisma.AIGenerationWhereInput): Promise<AIGeneration[]> {
    return this.prisma.aIGeneration.findMany({ where: filters })
  }

  override async create(data: Partial<AIGeneration>): Promise<AIGeneration> {
    try {
      const generation = await this.prisma.aIGeneration.create({
        data: data as any
      })
      return generation
    } catch (error) {
      this.handleError(error)
    }
  }

  override async update(id: string, data: Partial<AIGeneration>): Promise<AIGeneration> {
    try {
      const generation = await this.prisma.aIGeneration.update({
        where: { id },
        data: data as any
      })
      return generation
    } catch (error) {
      this.handleError(error)
    }
  }

  override async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.aIGeneration.delete({ where: { id } })
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  // Content generation with cost control
  async generateContent(
    request: ContentGenerationRequest, 
    userId?: string
  ): Promise<AIGenerationResponse> {
    try {
      // Check AI quota if AI is requested
      if (request.useAI && userId) {
        const hasQuota = await this.checkAIQuota(userId)
        if (!hasQuota) {
          throw new Error('AI quota exceeded')
        }
      }

      let content: string
      let tokens: number
      let cost: number
      let model: string

      if (request.useAI && userId) {
        // Use AI for generation (costs credits)
        const aiResult = await this.generateWithAI(request)
        content = aiResult.content
        tokens = aiResult.tokens
        cost = aiResult.cost
        model = aiResult.model
        
        // Increment usage
        await this.incrementAIUsage(userId, tokens)
      } else {
        // Use template-based generation (free)
        const templateResult = await this.generateWithTemplates(request)
        content = templateResult.content
        tokens = 0
        cost = 0
        model = 'template-engine'
      }

      // Save generation record
      const generation = await this.create({
        userId,
        type: AIGenerationType.CONTENT,
        prompt: request.prompt,
        response: content,
        model,
        tokens,
        cost: new Decimal(cost),
        language: request.language,
        status: 'COMPLETED',
        metadata: JSON.stringify({
          contentType: request.contentType,
          businessType: request.businessType,
          tone: request.tone,
          useAI: request.useAI
        })
      })

      return {
        content,
        tokens,
        cost,
        model,
        generationId: generation.id
      }
    } catch (error) {
      console.error('Content generation error:', error)
      throw error
    }
  }

  // AI-powered generation (uses credits)
  private async generateWithAI(request: ContentGenerationRequest): Promise<{
    content: string
    tokens: number
    cost: number
    model: string
  }> {
    // Mock AI generation - replace with actual AI service calls
    const templates = {
      hero: {
        professional: `Welcome to ${request.businessType || 'Our Business'}. We provide exceptional ${request.businessType || 'services'} that exceed your expectations.`,
        casual: `Hey there! Welcome to ${request.businessType || 'our awesome business'}. We're here to make your life easier with our ${request.businessType || 'amazing services'}.`,
        friendly: `Hello! We're so excited you're here. At ${request.businessType || 'our company'}, we believe in creating meaningful connections through our ${request.businessType || 'wonderful services'}.`,
        formal: `We are pleased to welcome you to ${request.businessType || 'our esteemed organization'}. Our commitment to excellence in ${request.businessType || 'professional services'} sets us apart.`
      },
      about: {
        professional: `About ${request.businessType || 'Our Company'}: We are a leading provider of ${request.businessType || 'professional services'}, dedicated to delivering exceptional results for our clients.`,
        casual: `So, here's the deal with ${request.businessType || 'us'}. We're pretty good at what we do, and we love helping people with ${request.businessType || 'our services'}.`,
        friendly: `We're ${request.businessType || 'a friendly team'} who loves what we do! Our passion is helping you succeed with our ${request.businessType || 'amazing services'}.`,
        formal: `${request.businessType || 'Our organization'} represents the pinnacle of professional excellence in ${request.businessType || 'our industry'}, serving clients with unwavering dedication.`
      }
    }

    const template = templates[request.contentType]?.[request.tone || 'professional'] || 
                    `This is ${request.contentType} content for ${request.businessType || 'your business'}.`

    return {
      content: template,
      tokens: 50, // Mock token count
      cost: 0.001, // Mock cost
      model: 'gpt-3.5-turbo'
    }
  }

  // Template-based generation (free)
  private async generateWithTemplates(request: ContentGenerationRequest): Promise<{
    content: string
  }> {
    const templates = {
      hero: `Welcome to ${request.businessType || 'Our Business'}. Discover our ${request.businessType || 'services'} and experience the difference.`,
      about: `Learn more about ${request.businessType || 'our company'} and how we can help you achieve your goals.`,
      services: `Explore our comprehensive ${request.businessType || 'services'} designed to meet your needs.`,
      contact: `Get in touch with ${request.businessType || 'our team'} today. We're here to help!`,
      blog: `Read our latest insights about ${request.businessType || 'industry trends'} and best practices.`,
      product: `Discover our ${request.businessType || 'products'} and find the perfect solution for you.`
    }

    return {
      content: templates[request.contentType] || `Content for ${request.contentType}`
    }
  }

  // SEO optimization with cost control
  async optimizeSEO(
    request: SEOOptimizationRequest,
    userId?: string
  ): Promise<AIGenerationResponse> {
    try {
      if (request.useAI && userId) {
        const hasQuota = await this.checkAIQuota(userId)
        if (!hasQuota) {
          throw new Error('AI quota exceeded')
        }
      }

      let optimizedContent: string
      let tokens: number
      let cost: number
      let model: string

      if (request.useAI && userId) {
        // AI-powered SEO optimization
        optimizedContent = await this.aiSEOOptimization(request)
        tokens = 30
        cost = 0.0005
        model = 'gpt-3.5-turbo'
        await this.incrementAIUsage(userId, tokens)
      } else {
        // Basic SEO optimization (free)
        optimizedContent = await this.basicSEOOptimization(request)
        tokens = 0
        cost = 0
        model = 'seo-engine'
      }

      const generation = await this.create({
        userId,
        type: AIGenerationType.SEO,
        prompt: `Optimize: ${request.content}`,
        response: optimizedContent,
        model,
        tokens,
        cost: new Decimal(cost),
        language: request.language,
        status: 'COMPLETED',
        metadata: JSON.stringify({
          targetKeywords: request.targetKeywords,
          businessType: request.businessType,
          contentType: request.contentType,
          useAI: request.useAI
        })
      })

      return {
        content: optimizedContent,
        tokens,
        cost,
        model,
        generationId: generation.id
      }
    } catch (error) {
      console.error('SEO optimization error:', error)
      throw error
    }
  }

  private async aiSEOOptimization(request: SEOOptimizationRequest): Promise<string> {
    // Mock AI SEO optimization
    const keywords = request.targetKeywords?.join(', ') || 'relevant keywords'
    return `${request.content}\n\nOptimized for SEO with focus on: ${keywords}. This content is designed to improve search engine rankings and user engagement.`
  }

  private async basicSEOOptimization(request: SEOOptimizationRequest): Promise<string> {
    // Basic SEO optimization without AI
    const keywords = request.targetKeywords?.join(', ') || 'relevant keywords'
    return `${request.content}\n\nKeywords: ${keywords}`
  }

  // Color generation with cost control
  async generateColors(
    request: ColorGenerationRequest,
    userId?: string
  ): Promise<AIGenerationResponse> {
    try {
      if (request.useAI && userId) {
        const hasQuota = await this.checkAIQuota(userId)
        if (!hasQuota) {
          throw new Error('AI quota exceeded')
        }
      }

      let colorPalette: string
      let tokens: number
      let cost: number
      let model: string

      if (request.useAI && userId) {
        // AI-powered color generation
        colorPalette = await this.aiColorGeneration(request)
        tokens = 20
        cost = 0.0003
        model = 'gpt-3.5-turbo'
        await this.incrementAIUsage(userId, tokens)
      } else {
        // Template-based color generation (free)
        colorPalette = await this.templateColorGeneration(request)
        tokens = 0
        cost = 0
        model = 'color-engine'
      }

      const generation = await this.create({
        userId,
        type: AIGenerationType.COLORS,
        prompt: `Generate colors for ${request.businessType}`,
        response: colorPalette,
        model,
        tokens,
        cost: new Decimal(cost),
        language: request.language,
        status: 'COMPLETED',
        metadata: JSON.stringify({
          businessType: request.businessType,
          brandPersonality: request.brandPersonality,
          primaryColor: request.primaryColor,
          style: request.style,
          useAI: request.useAI
        })
      })

      return {
        content: colorPalette,
        tokens,
        cost,
        model,
        generationId: generation.id
      }
    } catch (error) {
      console.error('Color generation error:', error)
      throw error
    }
  }

  private async aiColorGeneration(request: ColorGenerationRequest): Promise<string> {
    // Mock AI color generation
    const colors = {
      modern: ['#2563eb', '#1e40af', '#3b82f6', '#60a5fa', '#93c5fd'],
      traditional: ['#dc2626', '#b91c1c', '#ef4444', '#f87171', '#fca5a5'],
      luxury: ['#7c3aed', '#6d28d9', '#8b5cf6', '#a78bfa', '#c4b5fd'],
      friendly: ['#059669', '#047857', '#10b981', '#34d399', '#6ee7b7'],
      professional: ['#374151', '#1f2937', '#4b5563', '#6b7280', '#9ca3af']
    }

    const personality = request.brandPersonality || 'professional'
    const palette = colors[personality] || colors.professional

    return JSON.stringify({
      primary: palette[0],
      secondary: palette[1],
      accent: palette[2],
      background: palette[3],
      text: palette[4],
      style: request.style || 'complementary',
      source: 'ai_generated'
    })
  }

  private async templateColorGeneration(request: ColorGenerationRequest): Promise<string> {
    // Template-based color generation
    const templates = {
      RESTAURANT: ['#dc2626', '#f59e0b', '#10b981', '#ffffff', '#000000'],
      RETAIL: ['#2563eb', '#1e40af', '#3b82f6', '#f8fafc', '#1f2937'],
      SERVICE: ['#059669', '#047857', '#10b981', '#f0fdf4', '#064e3b'],
      HEALTHCARE: ['#0891b2', '#0e7490', '#06b6d4', '#f0f9ff', '#164e63'],
      EDUCATION: ['#7c3aed', '#6d28d9', '#8b5cf6', '#faf5ff', '#581c87']
    }

    const palette = templates[request.businessType as keyof typeof templates] || templates.SERVICE

    return JSON.stringify({
      primary: palette[0],
      secondary: palette[1],
      accent: palette[2],
      background: palette[3],
      text: palette[4],
      style: request.style || 'complementary',
      source: 'template_based'
    })
  }

  // Template suggestions with cost control
  async suggestTemplates(
    request: TemplateSuggestionRequest,
    userId?: string
  ): Promise<AIGenerationResponse> {
    try {
      if (request.useAI && userId) {
        const hasQuota = await this.checkAIQuota(userId)
        if (!hasQuota) {
          throw new Error('AI quota exceeded')
        }
      }

      let suggestions: string
      let tokens: number
      let cost: number
      let model: string

      if (request.useAI && userId) {
        // AI-powered template suggestions
        suggestions = await this.aiTemplateSuggestions(request)
        tokens = 40
        cost = 0.0008
        model = 'gpt-3.5-turbo'
        await this.incrementAIUsage(userId, tokens)
      } else {
        // Template-based suggestions (free)
        suggestions = await this.templateSuggestions(request)
        tokens = 0
        cost = 0
        model = 'template-engine'
      }

      const generation = await this.create({
        userId,
        type: AIGenerationType.DESIGN,
        prompt: `Suggest templates for ${request.businessType}`,
        response: suggestions,
        model,
        tokens,
        cost: new Decimal(cost),
        language: request.language,
        status: 'COMPLETED',
        metadata: JSON.stringify({
          businessType: request.businessType,
          industry: request.industry,
          features: request.features,
          budget: request.budget,
          useAI: request.useAI
        })
      })

      return {
        content: suggestions,
        tokens,
        cost,
        model,
        generationId: generation.id
      }
    } catch (error) {
      console.error('Template suggestions error:', error)
      throw error
    }
  }

  private async aiTemplateSuggestions(request: TemplateSuggestionRequest): Promise<string> {
    // Mock AI template suggestions
    return JSON.stringify({
      templates: [
        {
          id: 'template_1',
          name: `${request.businessType} Professional`,
          description: `Perfect for ${request.businessType} businesses looking for a professional look`,
          features: ['Responsive', 'SEO Optimized', 'Contact Forms'],
          price: request.budget === 'premium' ? 99 : 0
        },
        {
          id: 'template_2',
          name: `${request.businessType} Modern`,
          description: `A modern, sleek design for ${request.businessType} companies`,
          features: ['Modern Design', 'Fast Loading', 'Mobile First'],
          price: request.budget === 'premium' ? 149 : 0
        }
      ],
      source: 'ai_generated'
    })
  }

  private async templateSuggestions(request: TemplateSuggestionRequest): Promise<string> {
    // Template-based suggestions
    return JSON.stringify({
      templates: [
        {
          id: 'template_1',
          name: `${request.businessType} Basic`,
          description: `A simple template for ${request.businessType} businesses`,
          features: ['Basic Layout', 'Contact Info'],
          price: 0
        },
        {
          id: 'template_2',
          name: `${request.businessType} Standard`,
          description: `A standard template with more features`,
          features: ['Responsive', 'Contact Forms', 'Gallery'],
          price: 0
        }
      ],
      source: 'template_based'
    })
  }

  // Get user AI quota (public method)
  async getUserQuota(userId: string): Promise<AIQuota> {
    return this.getUserAIQuota(userId)
  }

  // Get generation history
  async getGenerationHistory(userId: string, limit: number = 20): Promise<AIGeneration[]> {
    try {
      return await this.prisma.aIGeneration.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit
      })
    } catch (error) {
      console.error('Error getting generation history:', error)
      return []
    }
  }
}

export const aiService = new AIService()
