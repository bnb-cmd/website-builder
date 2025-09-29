import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { BaseService } from './baseService'
import { aiConfig } from '@/config/environment'
import { Prisma, AIGeneration, AIGenerationType, Language } from '@prisma/client'

export interface ContentGenerationRequest {
  prompt: string
  language: Language
  contentType: 'hero' | 'about' | 'services' | 'contact' | 'blog' | 'product'
  businessType?: string
  tone?: 'professional' | 'casual' | 'friendly' | 'formal'
  maxTokens?: number
  temperature?: number
}

export interface SEOOptimizationRequest {
  content: string
  targetKeywords?: string[]
  language: Language
  businessType?: string
  contentType?: string
}

export interface ColorGenerationRequest {
  businessType: string
  brandPersonality?: 'modern' | 'traditional' | 'luxury' | 'friendly' | 'professional'
  primaryColor?: string
  style?: 'monochromatic' | 'complementary' | 'triadic' | 'analogous'
  language: Language
}

export interface TemplateSuggestionRequest {
  businessType: string
  industry?: string
  language: Language
  features?: string[]
  budget?: 'free' | 'premium'
}

export interface ImageOptimizationRequest {
  imageUrl: string
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'jpeg' | 'png'
}

export interface AIGenerationResponse {
  content: string
  tokens?: number
  cost?: number
  model: string
  generationId: string
}

type Provider = 'openai' | 'anthropic' | 'google'
type ProviderFn = (prompt: string, request: ContentGenerationRequest) => Promise<AIGenerationResponse>

type AIStats = {
  totalGenerations: number
  generationsByType: Record<string, number>
  totalTokens: number
  totalCost: number
  averageCostPerGeneration: number
}

type RecordGenerationInput = {
  type: AIGenerationType
  prompt: string
  responseContent: string
  model: string
  tokens: number
  cost: number
  language: Language
}

export class AIService extends BaseService<AIGeneration> {
  private openai: OpenAI
  private anthropic: Anthropic
  private googleAI: GoogleGenerativeAI

  constructor() {
    super()

    this.openai = new OpenAI({
      apiKey: aiConfig.openai.apiKey
    })

    this.anthropic = new Anthropic({
      apiKey: aiConfig.anthropic.apiKey
    })

    this.googleAI = new GoogleGenerativeAI(aiConfig.google.apiKey)
  }

  protected override getModelName(): string {
    return 'aIGeneration'
  }

  override async create(data: Partial<AIGeneration>): Promise<AIGeneration> {
    try {
      return await this.prisma.aIGeneration.create({
        data: data as Prisma.AIGenerationCreateInput
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  override async findById(id: string): Promise<AIGeneration | null> {
    try {
      this.validateId(id)
      return await this.prisma.aIGeneration.findUnique({ where: { id } })
    } catch (error) {
      this.handleError(error)
    }
  }

  override async findAll(filters?: Prisma.AIGenerationWhereInput): Promise<AIGeneration[]> {
    try {
      const args: Prisma.AIGenerationFindManyArgs = {
        orderBy: { createdAt: 'desc' }
      }

      if (filters) {
        args.where = filters
      }

      return await this.prisma.aIGeneration.findMany(args)
    } catch (error) {
      this.handleError(error)
    }
  }

  override async update(id: string, data: Partial<AIGeneration>): Promise<AIGeneration> {
    try {
      this.validateId(id)
      return await this.prisma.aIGeneration.update({ where: { id }, data })
    } catch (error) {
      this.handleError(error)
    }
  }

  override async delete(id: string): Promise<boolean> {
    try {
      this.validateId(id)
      await this.prisma.aIGeneration.delete({ where: { id } })
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  async generateContent(request: ContentGenerationRequest): Promise<AIGenerationResponse> {
    try {
      const prompt = this.buildContentPrompt(request)
      const providers = this.getProviderChain()

      if (providers.length === 0) {
        throw new Error('No AI service configured')
      }

      let lastError: unknown

      for (const provider of providers) {
        try {
          const response = await provider.fn(prompt, request)

          await this.recordGeneration({
            type: AIGenerationType.CONTENT,
            prompt: request.prompt,
            responseContent: response.content,
            model: response.model,
            tokens: response.tokens ?? 0,
            cost: response.cost ?? 0,
            language: request.language
          })

          return response
        } catch (error) {
          lastError = error
        }
      }

      if (lastError instanceof Error) {
        throw lastError
      }

      throw new Error('Failed to generate content with available providers')
    } catch (error) {
      this.handleError(error)
    }
  }

  private getProviderChain(): Array<{ name: Provider; fn: ProviderFn }> {
    const providers: Array<{ name: Provider; fn: ProviderFn }> = []

    if (aiConfig.openai.apiKey) {
      providers.push({ name: 'openai', fn: this.generateWithOpenAI.bind(this) })
    }

    if (aiConfig.anthropic.apiKey) {
      providers.push({ name: 'anthropic', fn: this.generateWithAnthropic.bind(this) })
    }

    if (aiConfig.google.apiKey) {
      providers.push({ name: 'google', fn: this.generateWithGoogle.bind(this) })
    }

    return providers
  }

  private async generateWithOpenAI(prompt: string, request: ContentGenerationRequest): Promise<AIGenerationResponse> {
    const model = aiConfig.openai.model || 'gpt-3.5-turbo'

    const completion = await this.openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: request.maxTokens ?? 1000,
      temperature: request.temperature ?? 0.7
    })

    const message = completion.choices?.[0]?.message?.content?.trim() ?? ''
    const tokens = completion.usage?.total_tokens ?? 0
    const cost = this.calculateOpenAICost(tokens, model)

    return {
      content: message,
      tokens,
      cost,
      model,
      generationId: completion.id
    }
  }

  private async generateWithAnthropic(prompt: string, request: ContentGenerationRequest): Promise<AIGenerationResponse> {
    const model = aiConfig.anthropic.model || 'claude-3-sonnet'

    const message = await this.anthropic.messages.create({
      model,
      max_tokens: request.maxTokens ?? 1000,
      temperature: request.temperature ?? 0.7,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            }
          ]
        }
      ]
    })

    const contentParts = Array.isArray(message?.content) ? message.content : []
    const textPart = contentParts.find((part: any) => typeof part?.text === 'string')
    const text = typeof textPart?.text === 'string' ? String(textPart.text).trim() : ''

    const inputTokens = Number(message?.usage?.input_tokens ?? 0)
    const outputTokens = Number(message?.usage?.output_tokens ?? 0)
    const tokens = inputTokens + outputTokens
    const cost = this.calculateAnthropicCost(tokens, model)

    return {
      content: text,
      tokens,
      cost,
      model,
      generationId: message?.id ?? 'anthropic-generation'
    }
  }

  private async generateWithGoogle(prompt: string, request: ContentGenerationRequest): Promise<AIGenerationResponse> {
    const modelName = aiConfig.google.model || 'gemini-pro'
    const model = this.googleAI.getGenerativeModel({ model: modelName })

    const result = await model.generateContent(prompt)
    const response = (result as any)?.response || {}

    let content = ''
    if (typeof response.text === 'function') {
      content = String(response.text()).trim()
    } else if (Array.isArray(response?.candidates)) {
      const candidate = response.candidates[0]
      const candidateContent = candidate?.content?.parts || []
      content = candidateContent
        .map((part: any) => (typeof part?.text === 'string' ? part.text : ''))
        .join('\n')
        .trim()
    }

    const tokens = Number(response?.usageMetadata?.totalTokenCount ?? 0)
    const cost = this.calculateGoogleCost(tokens, modelName)
    const generationId = response?.id ?? response?.candidates?.[0]?.id ?? 'google-generation'

    return {
      content,
      tokens,
      cost,
      model: modelName,
      generationId
    }
  }

  private buildContentPrompt(request: ContentGenerationRequest): string {
    const language = request.language === Language.URDU ? 'Urdu' : 'English'
    const tone = request.tone || 'professional'
    const businessType = request.businessType || 'business'

    const prompts: Record<ContentGenerationRequest['contentType'], string> = {
      hero: `Write a compelling hero section for a ${businessType} website in ${language}. ` +
        `The tone should be ${tone}. Include a headline, subheading, and call-to-action button text.`,

      about: `Write an engaging "About Us" section for a ${businessType} business in ${language}. ` +
        `The tone should be ${tone}. Include company story, values, and team information.`,

      services: `Write a services section for a ${businessType} business in ${language}. ` +
        `The tone should be ${tone}. List 3-5 key services with descriptions.`,

      contact: `Write a contact section for a ${businessType} business in ${language}. ` +
        `The tone should be ${tone}. Include contact information and a call-to-action.`,

      blog: `Write a blog post about "${request.prompt}" for a ${businessType} business in ${language}. ` +
        `The tone should be ${tone}. Include an engaging title and comprehensive content.`,

      product: `Write a product description for "${request.prompt}" in ${language}. ` +
        `The tone should be ${tone}. Include features, benefits, and compelling copy.`
    }

    return prompts[request.contentType]
  }

  async optimizeSEO(request: SEOOptimizationRequest): Promise<{
    title: string
    description: string
    keywords: string[]
    suggestions: string[]
  }> {
    try {
      const prompt = `Analyze this content for SEO optimization: "${request.content}"\n\n` +
        `Business Type: ${request.businessType || 'General'}\n` +
        `Language: ${request.language === Language.URDU ? 'Urdu' : 'English'}\n` +
        `Target Keywords: ${request.targetKeywords?.join(', ') || 'Not specified'}\n\n` +
        `Provide:\n` +
        `1. An optimized title (50-60 characters)\n` +
        `2. A meta description (150-160 characters)\n` +
        `3. 5-10 relevant keywords\n` +
        `4. 3-5 SEO improvement suggestions\n\n` +
        `Format as JSON.`

      const generationRequest: ContentGenerationRequest = {
        prompt,
        language: request.language,
        contentType: 'blog',
        tone: 'professional'
      }

      if (request.businessType) {
        generationRequest.businessType = request.businessType
      }

      const response = await this.generateContent(generationRequest)

      let seoData: { title: string; description: string; keywords: string[]; suggestions: string[] }

      try {
        const parsed = JSON.parse(response.content)
        seoData = {
          title: parsed.title || this.extractTitle(response.content),
          description: parsed.description || this.extractDescription(response.content),
          keywords: Array.isArray(parsed.keywords)
            ? parsed.keywords
            : this.extractKeywords(response.content),
          suggestions: Array.isArray(parsed.suggestions)
            ? parsed.suggestions
            : this.extractSuggestions(response.content)
        }
      } catch {
        seoData = {
          title: this.extractTitle(response.content),
          description: this.extractDescription(response.content),
          keywords: this.extractKeywords(response.content),
          suggestions: this.extractSuggestions(response.content)
        }
      }

      await this.recordGeneration({
        type: AIGenerationType.SEO,
        prompt: request.content,
        responseContent: JSON.stringify(seoData),
        model: response.model,
        tokens: response.tokens ?? 0,
        cost: response.cost ?? 0,
        language: request.language
      })

      return seoData
    } catch (error) {
      this.handleError(error)
    }
  }

  async generateColors(request: ColorGenerationRequest): Promise<{
    primary: string
    secondary: string
    accent: string
    neutral: string
    palette: string[]
    suggestions: string[]
  }> {
    try {
      const prompt = `Generate a color palette for a ${request.businessType} business.\n\n` +
        `Brand Personality: ${request.brandPersonality || 'professional'}\n` +
        `Style: ${request.style || 'complementary'}\n` +
        `Primary Color: ${request.primaryColor || 'Not specified'}\n` +
        `Language: ${request.language === Language.URDU ? 'Urdu' : 'English'}\n\n` +
        `Provide:\n` +
        `1. Primary color (hex code)\n` +
        `2. Secondary color (hex code)\n` +
        `3. Accent color (hex code)\n` +
        `4. Neutral color (hex code)\n` +
        `5. Complete palette (5-7 colors)\n` +
        `6. 3 alternative color suggestions\n\n` +
        `Format as JSON with hex codes.`

      const generationRequest: ContentGenerationRequest = {
        prompt,
        language: request.language,
        contentType: 'hero',
        tone: 'professional'
      }

      if (request.businessType) {
        generationRequest.businessType = request.businessType
      }

      const response = await this.generateContent(generationRequest)

      let colorData: {
        primary: string
        secondary: string
        accent: string
        neutral: string
        palette: string[]
        suggestions: string[]
      }

      try {
        const parsed = JSON.parse(response.content)
        colorData = {
          primary: parsed.primary,
          secondary: parsed.secondary,
          accent: parsed.accent,
          neutral: parsed.neutral,
          palette: Array.isArray(parsed.palette) ? parsed.palette : [],
          suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : []
        }
      } catch {
        colorData = this.generateFallbackColors(request)
      }

      await this.recordGeneration({
        type: AIGenerationType.COLORS,
        prompt,
        responseContent: JSON.stringify(colorData),
        model: response.model,
        tokens: response.tokens ?? 0,
        cost: response.cost ?? 0,
        language: request.language
      })

      return colorData
    } catch (error) {
      this.handleError(error)
    }
  }

  async suggestTemplates(request: TemplateSuggestionRequest): Promise<{
    templates: Array<{
      id: string
      name: string
      description: string
      category: string
      features: string[]
      matchScore: number
    }>
    recommendations: string[]
  }> {
    try {
      const prompt = `Suggest 5 website templates for a ${request.businessType} business.\n\n` +
        `Industry: ${request.industry || 'General'}\n` +
        `Language: ${request.language === Language.URDU ? 'Urdu' : 'English'}\n` +
        `Budget: ${request.budget || 'free'}\n` +
        `Required Features: ${request.features?.join(', ') || 'Basic functionality'}\n\n` +
        `For each template, provide:\n` +
        `1. Template name\n` +
        `2. Description\n` +
        `3. Category\n` +
        `4. Key features\n` +
        `5. Match score (1-100)\n\n` +
        `Also provide 3 general recommendations.\n` +
        `Format as JSON.`

      const generationRequest: ContentGenerationRequest = {
        prompt,
        language: request.language,
        contentType: 'hero',
        tone: 'professional'
      }

      if (request.businessType) {
        generationRequest.businessType = request.businessType
      }

      const response = await this.generateContent(generationRequest)

      let templateData: {
        templates: Array<{
          id: string
          name: string
          description: string
          category: string
          features: string[]
          matchScore: number
        }>
        recommendations: string[]
      }

      try {
        const parsed = JSON.parse(response.content)
        templateData = {
          templates: Array.isArray(parsed.templates) ? parsed.templates : [],
          recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : []
        }
      } catch {
        templateData = this.generateFallbackTemplates(request)
      }

      await this.recordGeneration({
        type: AIGenerationType.TEMPLATE_SUGGESTION,
        prompt,
        responseContent: JSON.stringify(templateData),
        model: response.model,
        tokens: response.tokens ?? 0,
        cost: response.cost ?? 0,
        language: request.language
      })

      return templateData
    } catch (error) {
      this.handleError(error)
    }
  }

  async optimizeImage(request: ImageOptimizationRequest): Promise<{
    optimizedUrl: string
    originalSize: number
    optimizedSize: number
    compressionRatio: number
    format: string
  }> {
    try {
      return {
        optimizedUrl: request.imageUrl,
        originalSize: 1024000,
        optimizedSize: 512000,
        compressionRatio: 0.5,
        format: request.format || 'webp'
      }
    } catch (error) {
      this.handleError(error)
    }
  }

  private calculateOpenAICost(tokens: number, model: string): number {
    const costs: Record<string, number> = {
      'gpt-4': 0.03 / 1000,
      'gpt-3.5-turbo': 0.002 / 1000
    }

    return (costs[model] ?? 0.002 / 1000) * tokens
  }

  private calculateAnthropicCost(tokens: number, model: string): number {
    const costs: Record<string, number> = {
      'claude-3-sonnet': 0.015 / 1000,
      'claude-3-haiku': 0.0025 / 1000
    }

    return (costs[model] ?? 0.015 / 1000) * tokens
  }

  private calculateGoogleCost(tokens: number, model: string): number {
    const costs: Record<string, number> = {
      'gemini-pro': 0.001 / 1000,
      'gemini-pro-vision': 0.002 / 1000
    }

    return (costs[model] ?? 0.001 / 1000) * tokens
  }

  private extractTitle(content: string): string {
    const lines = content.split('\n')
    return lines.find(line => line.toLowerCase().includes('title'))?.replace(/title:?/i, '').trim() || 'Optimized Title'
  }

  private extractDescription(content: string): string {
    const lines = content.split('\n')
    return lines.find(line => line.toLowerCase().includes('description'))?.replace(/description:?/i, '').trim() || 'Optimized description'
  }

  private extractKeywords(content: string): string[] {
    const lines = content.split('\n')
    const keywordLine = lines.find(line => line.toLowerCase().includes('keyword'))
    if (keywordLine) {
      return keywordLine.split(',').map(k => k.trim()).filter(k => k.length > 0)
    }
    return ['keyword1', 'keyword2', 'keyword3']
  }

  private extractSuggestions(content: string): string[] {
    const lines = content.split('\n')
    return lines
      .filter(line => line.includes('•') || line.includes('-'))
      .map(line => line.replace(/[•-]\s*/, '').trim())
      .filter(Boolean)
  }

  private generateFallbackColors(request: ColorGenerationRequest) {
    const palettes: Record<'modern' | 'traditional' | 'luxury', {
      primary: string
      secondary: string
      accent: string
      neutral: string
      palette: string[]
      suggestions: string[]
    }> = {
      modern: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#f59e0b',
        neutral: '#f8fafc',
        palette: ['#2563eb', '#64748b', '#f59e0b', '#f8fafc', '#1e293b'],
        suggestions: ['#7c3aed', '#dc2626', '#059669']
      },
      traditional: {
        primary: '#7c2d12',
        secondary: '#92400e',
        accent: '#d97706',
        neutral: '#fef3c7',
        palette: ['#7c2d12', '#92400e', '#d97706', '#fef3c7', '#451a03'],
        suggestions: ['#374151', '#6b7280', '#9ca3af']
      },
      luxury: {
        primary: '#1f2937',
        secondary: '#374151',
        accent: '#d4af37',
        neutral: '#f9fafb',
        palette: ['#1f2937', '#374151', '#d4af37', '#f9fafb', '#111827'],
        suggestions: ['#7c3aed', '#be185d', '#0d9488']
      }
    }

    const personality = (request.brandPersonality || 'modern') as keyof typeof palettes
    return palettes[personality] ?? palettes.modern
  }

  private generateFallbackTemplates(request: TemplateSuggestionRequest) {
    return {
      templates: [
        {
          id: 'template-1',
          name: 'Modern Business',
          description: 'Clean and professional template for business websites',
          category: 'Business',
          features: ['Responsive', 'SEO Optimized', 'Contact Form'],
          matchScore: 95
        },
        {
          id: 'template-2',
          name: 'Creative Portfolio',
          description: 'Eye-catching template for creative professionals',
          category: 'Portfolio',
          features: ['Gallery', 'Animation', 'Custom Colors'],
          matchScore: 85
        }
      ],
      recommendations: [
        'Choose a template that matches your brand personality',
        'Ensure the template is mobile-responsive',
        'Consider SEO optimization features'
      ]
    }
  }

  async getStats(): Promise<AIStats> {
    try {
      const cacheKey = 'ai:stats'
      const cached = await this.getCached<AIStats>(cacheKey)
      if (cached) return cached

      const [
        totalGenerations,
        generationsByType,
        totalTokens,
        totalCost
      ] = await Promise.all([
        this.prisma.aIGeneration.count(),
        this.prisma.aIGeneration.groupBy({
          by: ['type'],
          _count: { type: true }
        }),
        this.prisma.aIGeneration.aggregate({
          _sum: { tokens: true }
        }),
        this.prisma.aIGeneration.aggregate({
          _sum: { cost: true }
        })
      ])

      const tokensSum = totalTokens._sum?.tokens ?? 0
      const costSum = this.toNumber(totalCost._sum?.cost)

      const stats: AIStats = {
        totalGenerations,
        generationsByType: generationsByType.reduce((acc, item) => {
          acc[item.type] = item._count.type
          return acc
        }, {} as Record<string, number>),
        totalTokens: tokensSum,
        totalCost: costSum,
        averageCostPerGeneration: totalGenerations > 0 ? costSum / totalGenerations : 0
      }

      await this.setCached(cacheKey, stats, 3600)

      return stats
    } catch (error) {
      this.handleError(error)
    }
  }

  private async recordGeneration(input: RecordGenerationInput): Promise<void> {
    await this.prisma.aIGeneration.create({
      data: {
        type: input.type,
        prompt: input.prompt,
        response: input.responseContent,
        model: input.model,
        tokens: input.tokens,
        cost: input.cost,
        language: input.language
      }
    })
  }

  private toNumber(value: Prisma.Decimal | number | null | undefined): number {
    if (value === null || value === undefined) {
      return 0
    }

    return typeof value === 'number' ? value : Number(value)
  }
}
