import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { BaseService } from './baseService'
import { aiConfig } from '@/config/environment'
import { AIGeneration, AIGenerationType, Language } from '@prisma/client'

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

  protected getModelName(): string {
    return 'aIGeneration'
  }

  // Abstract methods implementation
  async create(data: Partial<AIGeneration>): Promise<AIGeneration> {
    try {
      return await this.prisma.aIGeneration.create({
        data: {
          ...data,
          createdAt: new Date()
        } as any
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async findById(id: string): Promise<AIGeneration | null> {
    try {
      this.validateId(id)
      return await this.prisma.aIGeneration.findUnique({
        where: { id }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async findAll(filters?: any): Promise<AIGeneration[]> {
    try {
      return await this.prisma.aIGeneration.findMany({
        where: filters,
        orderBy: { createdAt: 'desc' }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async update(id: string, data: Partial<AIGeneration>): Promise<AIGeneration> {
    try {
      this.validateId(id)
      return await this.prisma.aIGeneration.update({
        where: { id },
        data
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      this.validateId(id)
      await this.prisma.aIGeneration.delete({
        where: { id }
      })
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  // Content Generation Methods
  async generateContent(request: ContentGenerationRequest): Promise<AIGenerationResponse> {
    try {
      const prompt = this.buildContentPrompt(request)
      
      // Try different AI providers in order of preference
      let response: AIGenerationResponse
      
      if (aiConfig.openai.apiKey) {
        response = await this.generateWithOpenAI(prompt, request)
      } else if (aiConfig.anthropic.apiKey) {
        response = await this.generateWithAnthropic(prompt, request)
      } else if (aiConfig.google.apiKey) {
        response = await this.generateWithGoogle(prompt, request)
      } else {
        throw new Error('No AI service configured')
      }
      
      // Save generation record
      await this.create({
        type: AIGenerationType.CONTENT,
        prompt: request.prompt,
        response: response.content,
        model: response.model,
        tokens: response.tokens,
        cost: response.cost,
        language: request.language
      })
      
      return response
    } catch (error) {
      this.handleError(error)
    }
  }

  private async generateWithOpenAI(request: ContentGenerationRequest, fullRequest: ContentGenerationRequest): Promise<AIGenerationResponse> {
    const completion = await this.openai.chat.completions.create({
      model: aiConfig.openai.model,
      messages: [{
        role: 'user',
        content: this.buildContentPrompt(request)
      }],
      max_tokens: request.maxTokens || 1000,
      temperature: request.temperature || 0.7
    })

    const content = completion.choices[0].message.content || ''
    const tokens = completion.usage?.total_tokens || 0
    const cost = this.calculateOpenAICost(tokens, aiConfig.openai.model)

    return {
      content,
      tokens,
      cost,
      model: aiConfig.openai.model,
      generationId: completion.id
    }
  }

  private async generateWithAnthropic(request: ContentGenerationRequest, fullRequest: ContentGenerationRequest): Promise<AIGenerationResponse> {
    const message = await this.anthropic.messages.create({
      model: aiConfig.anthropic.model,
      max_tokens: request.maxTokens || 1000,
      temperature: request.temperature || 0.7,
      messages: [{
        role: 'user',
        content: this.buildContentPrompt(request)
      }]
    })

    const content = message.content[0].type === 'text' ? message.content[0].text : ''
    const tokens = message.usage.input_tokens + message.usage.output_tokens
    const cost = this.calculateAnthropicCost(tokens, aiConfig.anthropic.model)

    return {
      content,
      tokens,
      cost,
      model: aiConfig.anthropic.model,
      generationId: message.id
    }
  }

  private async generateWithGoogle(request: ContentGenerationRequest, fullRequest: ContentGenerationRequest): Promise<AIGenerationResponse> {
    const model = this.googleAI.getGenerativeModel({ model: aiConfig.google.model })
    
    const result = await model.generateContent({
      contents: [{
        parts: [{
          text: this.buildContentPrompt(request)
        }]
      }]
    })

    const content = result.response.text()
    const tokens = result.response.usageMetadata?.totalTokenCount || 0
    const cost = this.calculateGoogleCost(tokens, aiConfig.google.model)

    return {
      content,
      tokens,
      cost,
      model: aiConfig.google.model,
      generationId: result.response.candidates?.[0]?.finishReason || 'unknown'
    }
  }

  private buildContentPrompt(request: ContentGenerationRequest): string {
    const language = request.language === Language.URDU ? 'Urdu' : 'English'
    const tone = request.tone || 'professional'
    const businessType = request.businessType || 'business'
    
    const prompts = {
      hero: `Write a compelling hero section for a ${businessType} website in ${language}. 
             The tone should be ${tone}. Include a headline, subheading, and call-to-action button text.`,
      
      about: `Write an engaging "About Us" section for a ${businessType} business in ${language}. 
              The tone should be ${tone}. Include company story, values, and team information.`,
      
      services: `Write a services section for a ${businessType} business in ${language}. 
                 The tone should be ${tone}. List 3-5 key services with descriptions.`,
      
      contact: `Write a contact section for a ${businessType} business in ${language}. 
                The tone should be ${tone}. Include contact information and a call-to-action.`,
      
      blog: `Write a blog post about "${request.prompt}" for a ${businessType} business in ${language}. 
             The tone should be ${tone}. Include an engaging title and comprehensive content.`,
      
      product: `Write a product description for "${request.prompt}" in ${language}. 
                The tone should be ${tone}. Include features, benefits, and compelling copy.`
    }
    
    return prompts[request.contentType] || `Generate ${request.contentType} content in ${language} for: ${request.prompt}`
  }

  // SEO Optimization
  async optimizeSEO(request: SEOOptimizationRequest): Promise<{
    title: string
    description: string
    keywords: string[]
    suggestions: string[]
  }> {
    try {
      const prompt = `Analyze this content for SEO optimization: "${request.content}"
                     
                     Business Type: ${request.businessType || 'General'}
                     Language: ${request.language === Language.URDU ? 'Urdu' : 'English'}
                     Target Keywords: ${request.targetKeywords?.join(', ') || 'Not specified'}
                     
                     Provide:
                     1. An optimized title (50-60 characters)
                     2. A meta description (150-160 characters)
                     3. 5-10 relevant keywords
                     4. 3-5 SEO improvement suggestions
                     
                     Format as JSON.`

      const response = await this.generateContent({
        prompt,
        language: request.language,
        contentType: 'blog',
        businessType: request.businessType,
        tone: 'professional'
      })

      // Parse AI response (assuming it returns JSON)
      let seoData
      try {
        seoData = JSON.parse(response.content)
      } catch {
        // Fallback if AI doesn't return proper JSON
        seoData = {
          title: this.extractTitle(response.content),
          description: this.extractDescription(response.content),
          keywords: this.extractKeywords(response.content),
          suggestions: this.extractSuggestions(response.content)
        }
      }

      // Save generation record
      await this.create({
        type: AIGenerationType.SEO,
        prompt: request.content,
        response: JSON.stringify(seoData),
        model: response.model,
        tokens: response.tokens,
        cost: response.cost,
        language: request.language
      })

      return seoData
    } catch (error) {
      this.handleError(error)
    }
  }

  // Color Palette Generation
  async generateColors(request: ColorGenerationRequest): Promise<{
    primary: string
    secondary: string
    accent: string
    neutral: string
    palette: string[]
    suggestions: string[]
  }> {
    try {
      const prompt = `Generate a color palette for a ${request.businessType} business.
                     
                     Brand Personality: ${request.brandPersonality || 'professional'}
                     Style: ${request.style || 'complementary'}
                     Primary Color: ${request.primaryColor || 'Not specified'}
                     Language: ${request.language === Language.URDU ? 'Urdu' : 'English'}
                     
                     Provide:
                     1. Primary color (hex code)
                     2. Secondary color (hex code)
                     3. Accent color (hex code)
                     4. Neutral color (hex code)
                     5. Complete palette (5-7 colors)
                     6. 3 alternative color suggestions
                     
                     Format as JSON with hex codes.`

      const response = await this.generateContent({
        prompt,
        language: request.language,
        contentType: 'hero',
        businessType: request.businessType,
        tone: 'professional'
      })

      // Parse AI response
      let colorData
      try {
        colorData = JSON.parse(response.content)
      } catch {
        // Fallback color palette
        colorData = this.generateFallbackColors(request)
      }

      // Save generation record
      await this.create({
        type: AIGenerationType.COLORS,
        prompt: prompt,
        response: JSON.stringify(colorData),
        model: response.model,
        tokens: response.tokens,
        cost: response.cost,
        language: request.language
      })

      return colorData
    } catch (error) {
      this.handleError(error)
    }
  }

  // Template Suggestions
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
      const prompt = `Suggest 5 website templates for a ${request.businessType} business.
                     
                     Industry: ${request.industry || 'General'}
                     Language: ${request.language === Language.URDU ? 'Urdu' : 'English'}
                     Budget: ${request.budget || 'free'}
                     Required Features: ${request.features?.join(', ') || 'Basic functionality'}
                     
                     For each template, provide:
                     1. Template name
                     2. Description
                     3. Category
                     4. Key features
                     5. Match score (1-100)
                     
                     Also provide 3 general recommendations.
                     Format as JSON.`

      const response = await this.generateContent({
        prompt,
        language: request.language,
        contentType: 'hero',
        businessType: request.businessType,
        tone: 'professional'
      })

      // Parse AI response
      let templateData
      try {
        templateData = JSON.parse(response.content)
      } catch {
        // Fallback template suggestions
        templateData = this.generateFallbackTemplates(request)
      }

      // Save generation record
      await this.create({
        type: AIGenerationType.TEMPLATE_SUGGESTION,
        prompt: prompt,
        response: JSON.stringify(templateData),
        model: response.model,
        tokens: response.tokens,
        cost: response.cost,
        language: request.language
      })

      return templateData
    } catch (error) {
      this.handleError(error)
    }
  }

  // Image Optimization (placeholder - would integrate with actual image processing)
  async optimizeImage(request: ImageOptimizationRequest): Promise<{
    optimizedUrl: string
    originalSize: number
    optimizedSize: number
    compressionRatio: number
    format: string
  }> {
    try {
      // This would integrate with actual image processing services
      // For now, return mock data
      return {
        optimizedUrl: request.imageUrl,
        originalSize: 1024000, // 1MB
        optimizedSize: 512000, // 500KB
        compressionRatio: 0.5,
        format: request.format || 'webp'
      }
    } catch (error) {
      this.handleError(error)
    }
  }

  // Cost calculation methods
  private calculateOpenAICost(tokens: number, model: string): number {
    const costs = {
      'gpt-4': 0.03 / 1000, // $0.03 per 1K tokens
      'gpt-3.5-turbo': 0.002 / 1000 // $0.002 per 1K tokens
    }
    return (costs[model as keyof typeof costs] || 0.002 / 1000) * tokens
  }

  private calculateAnthropicCost(tokens: number, model: string): number {
    const costs = {
      'claude-3-sonnet': 0.015 / 1000, // $0.015 per 1K tokens
      'claude-3-haiku': 0.0025 / 1000 // $0.0025 per 1K tokens
    }
    return (costs[model as keyof typeof costs] || 0.015 / 1000) * tokens
  }

  private calculateGoogleCost(tokens: number, model: string): number {
    const costs = {
      'gemini-pro': 0.001 / 1000, // $0.001 per 1K tokens
      'gemini-pro-vision': 0.002 / 1000 // $0.002 per 1K tokens
    }
    return (costs[model as keyof typeof costs] || 0.001 / 1000) * tokens
  }

  // Helper methods for parsing AI responses
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
    return lines.filter(line => line.includes('•') || line.includes('-')).map(line => line.replace(/[•-]\s*/, '').trim())
  }

  // Fallback methods
  private generateFallbackColors(request: ColorGenerationRequest): any {
    const colorPalettes = {
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

    return colorPalettes[request.brandPersonality as keyof typeof colorPalettes] || colorPalettes.modern
  }

  private generateFallbackTemplates(request: TemplateSuggestionRequest): any {
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

  // Statistics
  async getStats(): Promise<{
    totalGenerations: number
    generationsByType: Record<string, number>
    totalTokens: number
    totalCost: number
    averageCostPerGeneration: number
  }> {
    try {
      const cacheKey = 'ai:stats'
      const cached = await this.getCached(cacheKey)
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

      const stats = {
        totalGenerations,
        generationsByType: generationsByType.reduce((acc, item) => {
          acc[item.type] = item._count.type
          return acc
        }, {} as Record<string, number>),
        totalTokens: totalTokens._sum.tokens || 0,
        totalCost: totalCost._sum.cost || 0,
        averageCostPerGeneration: totalGenerations > 0 ? (totalCost._sum.cost || 0) / totalGenerations : 0
      }

      await this.setCached(cacheKey, stats, 3600) // 1 hour

      return stats
    } catch (error) {
      this.handleError(error)
    }
  }
}
