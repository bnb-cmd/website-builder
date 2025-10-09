import { IntentDetectionService, Intent } from './intentDetectionService'
import { AIOnboardingService } from './aiOnboardingService'
import { redisSessionStore } from './redisSessionStore'

type Language = 'ENGLISH' | 'URDU' | 'PUNJABI' | 'SINDHI' | 'PASHTO'

export interface ConversationMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  metadata?: {
    intent?: Intent
    suggestions?: string[]
    quickActions?: Array<{ label: string; value: string }>
  }
}

export interface ConversationSession {
  id: string
  userId?: string
  status: 'active' | 'completed' | 'abandoned'
  currentStep: 'initial' | 'intent_detected' | 'collecting_details' | 'generating' | 'preview' | 'complete'
  messages: ConversationMessage[]
  intent?: Intent
  collectedData: {
    businessName?: string
    businessDescription?: string
    targetAudience?: string
    siteGoals?: string[]
    brandTone?: string
    brandColors?: {
      primary: string
      secondary: string
      accent: string
    }
    keywords?: string[]
    preferredLanguage?: Language
    additionalNotes?: string
  }
  generatedWebsiteId?: string
  createdAt: Date
  updatedAt: Date
}

export class ConversationOrchestrator {
  private intentService: IntentDetectionService
  private onboardingService: AIOnboardingService
  private sessionTtl = 24 * 60 * 60 // 24 hours in seconds

  constructor() {
    this.intentService = new IntentDetectionService()
    this.onboardingService = new AIOnboardingService()
  }

  async startConversation(sessionId: string, userId?: string): Promise<ConversationSession> {
    // Check if session already exists
    const existingSession = await this.getSession(sessionId);
    if (existingSession) {
      return existingSession;
    }

    const session: ConversationSession = {
      id: sessionId,
      userId,
      status: 'active',
      currentStep: 'initial',
      messages: [],
      collectedData: {},
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Add welcome message
    session.messages.push({
      id: this.generateMessageId(),
      type: 'ai',
      content: "Hi! I'm your AI website builder assistant. What kind of website would you like to create today?",
      timestamp: new Date(),
      metadata: {
        suggestions: [
          "Online store for my business",
          "Portfolio to showcase my work",
          "Blog to share my ideas",
          "Business website for my company"
        ]
      }
    })

    await redisSessionStore.set(sessionId, session, this.sessionTtl);
    return session;
  }

  async processMessage(sessionId: string, userMessage: string): Promise<{
    session: ConversationSession
    aiResponse: ConversationMessage
  }> {
    let session = await this.getSession(sessionId);
    if (!session) {
      session = await this.startConversation(sessionId);
    }

    // Add user message
    session.messages.push({
      id: this.generateMessageId(),
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    })

    // Process based on current step
    let aiResponse: ConversationMessage

    switch (session.currentStep) {
      case 'initial':
        aiResponse = await this.handleInitialInput(session, userMessage)
        break
      case 'intent_detected':
        aiResponse = await this.handleIntentConfirmation(session, userMessage)
        break
      case 'collecting_details':
        aiResponse = await this.handleDetailsCollection(session, userMessage)
        break
      default:
        aiResponse = await this.handleGenericResponse(session, userMessage)
    }

    session.messages.push(aiResponse)
    session.updatedAt = new Date()
    
    // Save session to Redis
    await redisSessionStore.set(sessionId, session, this.sessionTtl);

    return { session, aiResponse }
  }

  private async handleInitialInput(session: ConversationSession, userMessage: string): Promise<ConversationMessage> {
    // Detect intent
    const intent = this.intentService.detectIntent(userMessage)
    session.intent = intent
    session.currentStep = 'intent_detected'

    // Detect language preference
    const language = this.intentService.detectLanguagePreference(userMessage)
    session.collectedData.preferredLanguage = language

    // Generate response based on intent
    let content = ''
    const quickActions: Array<{ label: string; value: string }> = []

    if (intent.confidence > 0.3) {
      content = this.generateIntentConfirmationMessage(intent)
      quickActions.push(
        { label: "Yes, that's right!", value: 'confirm' },
        { label: "Let me clarify", value: 'clarify' }
      )
    } else {
      content = "I'd love to help you build that! Could you tell me a bit more about what you have in mind?"
      quickActions.push(
        { label: "E-commerce Store", value: 'ecommerce' },
        { label: "Portfolio", value: 'portfolio' },
        { label: "Blog", value: 'blog' },
        { label: "Business Website", value: 'business' }
      )
    }

    return {
      id: this.generateMessageId(),
      type: 'ai',
      content,
      timestamp: new Date(),
      metadata: {
        intent,
        quickActions
      }
    }
  }

  private async handleIntentConfirmation(session: ConversationSession, userMessage: string): Promise<ConversationMessage> {
    const input = userMessage.toLowerCase()
    
    if (input.includes('yes') || input.includes('confirm') || input.includes('right') || input.includes('correct')) {
      session.currentStep = 'collecting_details'
      
      return {
        id: this.generateMessageId(),
        type: 'ai',
        content: "Perfect! Let's get started. What's your business or project name?",
        timestamp: new Date(),
        metadata: {
          suggestions: []
        }
      }
    } else {
      session.currentStep = 'initial'
      
      return {
        id: this.generateMessageId(),
        type: 'ai',
        content: "No problem! Please tell me more about what you'd like to create.",
        timestamp: new Date()
      }
    }
  }

  private async handleDetailsCollection(session: ConversationSession, userMessage: string): Promise<ConversationMessage> {
    const data = session.collectedData

    // Determine what to ask next
    if (!data.businessName) {
      data.businessName = userMessage
      return {
        id: this.generateMessageId(),
        type: 'ai',
        content: `Great! "${userMessage}" is a wonderful name. Now, can you briefly describe what ${userMessage} does or offers?`,
        timestamp: new Date()
      }
    }

    if (!data.businessDescription) {
      data.businessDescription = userMessage
      return {
        id: this.generateMessageId(),
        type: 'ai',
        content: "Excellent! Who is your target audience? Who are you trying to reach with this website?",
        timestamp: new Date(),
        metadata: {
          suggestions: [
            "Local customers in Pakistan",
            "Young professionals",
            "Small businesses",
            "General public"
          ]
        }
      }
    }

    if (!data.targetAudience) {
      data.targetAudience = userMessage
      return {
        id: this.generateMessageId(),
        type: 'ai',
        content: "Perfect! Now, let's choose your brand colors. What colors represent your brand?",
        timestamp: new Date(),
        metadata: {
          quickActions: [
            { label: "Let AI choose", value: 'ai_colors' },
            { label: "I'll pick my own", value: 'custom_colors' }
          ]
        }
      }
    }

    if (!data.brandColors) {
      // If user wants AI to choose
      if (userMessage.toLowerCase().includes('ai') || userMessage.toLowerCase().includes('choose')) {
        data.brandColors = this.generateBrandColors(session.intent?.industry)
      } else {
        // For now, use default colors (in real implementation, parse color input)
        data.brandColors = {
          primary: '#1e40af',
          secondary: '#64748b',
          accent: '#f59e0b'
        }
      }

      session.currentStep = 'generating'
      
      return {
        id: this.generateMessageId(),
        type: 'ai',
        content: "Awesome! I have everything I need. Let me create your website now... ✨",
        timestamp: new Date(),
        metadata: {
          quickActions: []
        }
      }
    }

    return {
      id: this.generateMessageId(),
      type: 'ai',
      content: "Thank you! Processing your information...",
      timestamp: new Date()
    }
  }

  private async handleGenericResponse(_session: ConversationSession, _userMessage: string): Promise<ConversationMessage> {
    return {
      id: this.generateMessageId(),
      type: 'ai',
      content: "I understand. How else can I help you with your website?",
      timestamp: new Date()
    }
  }

  private generateIntentConfirmationMessage(intent: Intent): string {
    const messages: Record<string, string> = {
      ecommerce: `Great! I'll help you build an online store. I recommend including:
• Product catalog with search and filters
• Shopping cart and checkout
• Payment integration (JazzCash, EasyPaisa, Stripe)
• Order management

Does this sound good?`,
      portfolio: `Perfect! I'll create a portfolio website for you with:
• Beautiful gallery to showcase your work
• Project detail pages
• About section
• Contact form

Sound good?`,
      blog: `Excellent! I'll set up a blog for you with:
• Article publishing system
• Categories and tags
• Search functionality
• Comment system

Is this what you're looking for?`,
      business: `Great choice! I'll build a professional business website with:
• Services showcase
• About your company
• Team members section
• Contact form

Does this work for you?`,
      restaurant: `Perfect! I'll create a restaurant website featuring:
• Digital menu
• Table reservations
• Photo gallery
• Location and hours

Sound good?`
    }

    return messages[intent.type] || "I'll help you build that! Let me know if this sounds right."
  }

  private generateBrandColors(industry?: string): { primary: string; secondary: string; accent: string } {
    const colorSchemes: Record<string, any> = {
      fashion: { primary: '#ec4899', secondary: '#8b5cf6', accent: '#f59e0b' },
      technology: { primary: '#3b82f6', secondary: '#6366f1', accent: '#10b981' },
      food: { primary: '#ef4444', secondary: '#f59e0b', accent: '#10b981' },
      health: { primary: '#10b981', secondary: '#3b82f6', accent: '#06b6d4' },
      education: { primary: '#6366f1', secondary: '#8b5cf6', accent: '#f59e0b' },
      default: { primary: '#1e40af', secondary: '#64748b', accent: '#f59e0b' }
    }

    return colorSchemes[industry || 'default'] || colorSchemes.default
  }

  async generateWebsite(sessionId: string, userId: string): Promise<string> {
    const session = await this.getSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Create onboarding profile and generate website
    const profileData = {
      userId,
      businessName: session.collectedData.businessName,
      businessDescription: session.collectedData.businessDescription,
      targetAudience: session.collectedData.targetAudience,
      siteGoals: session.intent?.features || [],
      brandTone: session.collectedData.brandTone || 'professional',
      brandColors: session.collectedData.brandColors,
      keywords: session.intent?.keywords || [],
      preferredLanguage: session.collectedData.preferredLanguage || 'ENGLISH' as any,
      additionalNotes: session.collectedData.additionalNotes || ''
    }

    const profile = await this.onboardingService.createProfileWithRecommendations(profileData)
    
    session.generatedWebsiteId = profile.id
    session.currentStep = 'complete'
    session.status = 'completed'
    
    return profile.id
  }

  async getSession(sessionId: string): Promise<ConversationSession | undefined> {
    try {
      const session = await redisSessionStore.get(sessionId);
      if (session) {
        // Refresh TTL on access
        await redisSessionStore.touch(sessionId, this.sessionTtl);
      }
      return session as ConversationSession | undefined;
    } catch (error) {
      console.error('Error getting session:', error);
      return undefined;
    }
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}
