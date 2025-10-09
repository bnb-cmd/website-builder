import {
  AISession,
  ARVRContent,
  AISessionType,
  AISessionStatus,
  ARVRType,
  ARVRStatus,
  Prisma
} from '@prisma/client'
import { BaseService } from './baseService'

export interface AISessionData {
  websiteId: string
  userId?: string
  type: AISessionType
  context?: Prisma.InputJsonValue
  model?: string
  temperature?: number
  maxTokens?: number
}

export interface ARVRContentData {
  websiteId: string
  userId?: string
  name: string
  type: ARVRType
  description?: string
  modelUrl?: string
  textureUrl?: string
  animationUrl?: string
  scale?: Prisma.InputJsonValue
  position?: Prisma.InputJsonValue
  rotation?: Prisma.InputJsonValue
  interactions?: Prisma.InputJsonValue
}

interface AIMessageResponse {
  response: string
  tokensUsed: number
  cost: number
}

const MOCK_TOKEN_COST = 0.00002

export class AdvancedAIService extends BaseService<AISession> {
  protected override getModelName(): string {
    return 'aISession'
  }

  private toJson(value: unknown, fallback: Prisma.InputJsonValue = {}): Prisma.InputJsonValue {
    if (value === undefined || value === null) {
      return fallback
    }

    try {
      return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue
    } catch (error) {
      console.warn('Failed to serialise JSON payload', error)
      return fallback
    }
  }

  private assertSession(session: AISession | null): asserts session is AISession {
    if (!session) {
      throw new Error('AI session not found')
    }
  }

  override async create(data: Partial<AISession>): Promise<AISession> {
    return this.prisma.aISession.create({ data })
  }

  override async findById(id: string): Promise<AISession | null> {
    return this.prisma.aISession.findUnique({ where: { id } })
  }

  override async findAll(filters?: Prisma.AISessionWhereInput): Promise<AISession[]> {
    return this.prisma.aISession.findMany({ where: filters })
  }

  override async update(id: string, data: Partial<AISession>): Promise<AISession> {
    return this.prisma.aISession.update({ where: { id }, data })
  }

  override async delete(id: string): Promise<boolean> {
    await this.prisma.aISession.delete({ where: { id } })
    return true
  }

  async createAISession(data: AISessionData): Promise<AISession> {
    this.validateId(data.websiteId)

    const sessionId = this.generateSessionId()

    return this.prisma.aISession.create({
      data: {
        websiteId: data.websiteId,
        userId: data.userId,
        type: data.type,
        sessionId,
        context: this.toJson(data.context),
        history: this.toJson([], []),
        model: data.model ?? 'gpt-4',
        temperature: data.temperature ?? 0.7,
        maxTokens: data.maxTokens ?? 2000,
        status: AISessionStatus.ACTIVE
      }
    })
  }

  async getAISessions(websiteId: string): Promise<AISession[]> {
    this.validateId(websiteId)

    return this.prisma.aISession.findMany({
      where: { websiteId },
      orderBy: { updatedAt: 'desc' }
    })
  }

  async sendAIMessage(sessionId: string, message: string): Promise<AIMessageResponse> {
    this.validateId(sessionId)

    const session = await this.prisma.aISession.findUnique({ where: { sessionId } })
    this.assertSession(session)

    const aiResponse = await this.generateAIResponse(session, message)

    const history = Array.isArray(session.history)
      ? [...(session.history as Prisma.JsonArray)]
      : []

    history.push({ role: 'user', content: message, timestamp: new Date().toISOString() })
    history.push({ role: 'assistant', content: aiResponse.response, timestamp: new Date().toISOString() })

    await this.prisma.aISession.update({
      where: { sessionId },
      data: {
        history,
        messageCount: session.messageCount + 1,
        tokenUsage: session.tokenUsage + aiResponse.tokensUsed,
        cost: session.cost.plus(aiResponse.cost),
        updatedAt: new Date()
      }
    })

    return aiResponse
  }

  private async generateAIResponse(session: AISession, message: string): Promise<AIMessageResponse> {
    const responses: Record<AISessionType, string[]> = {
      CHAT: [
        "I understand you're looking for help with your website. Let me assist you with that.",
        "Based on your requirements, I can suggest several approaches to improve your website's performance.",
        "I'd be happy to help you implement that feature. Here's how we can approach it..."
      ],
      CODE_GENERATION: [
        "I'll generate the code for you. Here's a clean, efficient implementation:",
        "Let me create a responsive component that meets your requirements:",
        "Here's the optimized code with best practices applied:"
      ],
      CONTENT_CREATION: [
        "I'll help you create engaging content for your website. Here's what I suggest:",
        "Let me craft compelling copy that will resonate with your target audience:",
        "Here's some SEO-optimized content that will help improve your search rankings:"
      ],
      DESIGN_ASSISTANCE: [
        "I'll help you create a beautiful design. Here are some recommendations:",
        "Let me suggest a color scheme and layout that will work well for your brand:",
        "Here's a modern design approach that will make your website stand out:"
      ],
      ANALYSIS: [
        "I've analyzed your website data. Here are the key insights:",
        "Based on the metrics, I can see several opportunities for improvement:",
        "Let me break down the performance data and provide actionable recommendations:"
      ]
    }

    const sessionResponses = responses[session.type] ?? responses.CHAT
    const randomResponse = sessionResponses[Math.floor(Math.random() * sessionResponses.length)]

    const tokensUsed = Math.floor(Math.random() * 500) + 100
    const cost = Number((tokensUsed * MOCK_TOKEN_COST).toFixed(4))

    return {
      response: `${randomResponse}\n\nUser message: ${message}`,
      tokensUsed,
      cost
    }
  }

  private generateSessionId(): string {
    return `ai_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
  }

  async createARVRContent(data: ARVRContentData): Promise<ARVRContent> {
    this.validateId(data.websiteId)

    return this.prisma.aRVRContent.create({
      data: {
        websiteId: data.websiteId,
        userId: data.userId,
        name: data.name,
        type: data.type,
        description: data.description,
        modelUrl: data.modelUrl,
        textureUrl: data.textureUrl,
        animationUrl: data.animationUrl,
        scale: this.toJson(data.scale, null),
        position: this.toJson(data.position, null),
        rotation: this.toJson(data.rotation, null),
        interactions: this.toJson(data.interactions, null),
        status: ARVRStatus.DRAFT
      }
    })
  }

  async getARVRContent(websiteId: string): Promise<ARVRContent[]> {
    this.validateId(websiteId)

    return this.prisma.aRVRContent.findMany({
      where: { websiteId },
      orderBy: { updatedAt: 'desc' }
    })
  }

  async processARVRContent(contentId: string): Promise<ARVRContent> {
    this.validateId(contentId)

    await this.prisma.aRVRContent.update({
      where: { id: contentId },
      data: { status: ARVRStatus.PROCESSING }
    })

    setTimeout(async () => {
      try {
        await this.prisma.aRVRContent.update({
          where: { id: contentId },
          data: {
            status: ARVRStatus.READY,
            polygonCount: Math.floor(Math.random() * 10000) + 1000,
            textureSize: Math.floor(Math.random() * 2048) + 512,
            fileSize: Math.floor(Math.random() * 50000000) + 1000000
          }
        })
      } catch (error) {
        await this.prisma.aRVRContent.update({
          where: { id: contentId },
          data: { status: ARVRStatus.ERROR }
        })
      }
    }, 5000)

    const content = await this.prisma.aRVRContent.findUnique({ where: { id: contentId } })
    if (!content) {
      throw new Error('AR/VR content not found')
    }

    return content
  }

  async generateARVRContent(prompt: string, type: ARVRType, websiteId: string, userId?: string): Promise<ARVRContent> {
    this.validateId(websiteId)

    const generated = {
      name: `AI Generated ${type.replace('_', ' ')}`,
      type,
      description: `Generated from prompt: ${prompt}`,
      modelUrl: `https://api.example.com/generated/3d/${Date.now()}.glb`,
      textureUrl: `https://api.example.com/generated/textures/${Date.now()}.jpg`,
      animationUrl: undefined,
      scale: { x: 1, y: 1, z: 1 },
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      interactions: {
        touch: 'rotate',
        click: 'animate',
        gesture: 'scale'
      }
    }

    return this.createARVRContent({
      websiteId,
      userId,
      name: generated.name,
      type,
      description: generated.description,
      modelUrl: generated.modelUrl,
      textureUrl: generated.textureUrl,
      animationUrl: generated.animationUrl,
      scale: generated.scale,
      position: generated.position,
      rotation: generated.rotation,
      interactions: generated.interactions
    })
  }

  async generateCodeFromDescription(description: string, language: string): Promise<AIMessageResponse & { code: string; explanation: string; suggestions: string[] }> {
    const code = `// Generated code for: ${description}\nfunction sample${language.replace(/[^a-zA-Z]/g, '')}Function() {\n  console.log('Hello from AI-generated code!');\n  return 'success';\n}`

    return {
      response: 'Generated code successfully',
      tokensUsed: 200,
      cost: Number((200 * MOCK_TOKEN_COST).toFixed(4)),
      code,
      explanation: `Generated a ${language} function based on your description. Includes basic logging and return value.`,
      suggestions: [
        'Add input validation',
        'Implement error handling',
        'Add unit tests',
        'Consider performance optimization'
      ]
    }
  }

  async analyzeWebsitePerformance(websiteId: string) {
    this.validateId(websiteId)

    return {
      score: Math.floor(Math.random() * 40) + 60,
      recommendations: [
        'Optimize images for faster loading',
        'Implement lazy loading for below-the-fold content',
        'Minify CSS and JavaScript files',
        'Enable browser caching',
        'Use a CDN for static assets'
      ],
      metrics: {
        pageLoadTime: Number((Math.random() * 3 + 1).toFixed(2)),
        firstContentfulPaint: Number((Math.random() * 2 + 0.5).toFixed(2)),
        largestContentfulPaint: Number((Math.random() * 4 + 1).toFixed(2)),
        cumulativeLayoutShift: Number((Math.random() * 0.1).toFixed(3)),
        firstInputDelay: Math.floor(Math.random() * 100)
      }
    }
  }
}
