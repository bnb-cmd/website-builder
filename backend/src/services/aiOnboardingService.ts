import { AiOnboardingProfile, Language, Prisma } from '@prisma/client'
import { BaseService } from './baseService'
import { SubscriptionService } from './subscriptionService'

interface BrandColors {
  primary: string
  secondary?: string
  accent?: string
}

export interface CreateOnboardingProfileData {
  userId: string
  businessName?: string
  businessDescription?: string
  targetAudience?: string
  siteGoals: string[]
  brandTone?: string
  brandColors?: BrandColors
  keywords: string[]
  preferredLanguage: Language
  additionalNotes?: string
}

export interface AIRecommendation {
  type: 'layout' | 'content' | 'design' | 'seo' | 'features'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  implementation: string
  estimatedTime: string
  benefits: string[]
}

type OnboardingProfileWithRecommendations = AiOnboardingProfile & {
  aiRecommendations: AIRecommendation[]
}


export class AIOnboardingService extends BaseService<AiOnboardingProfile> {
  private subscriptionService: SubscriptionService

  constructor() {
    super()
    this.subscriptionService = new SubscriptionService()
  }

  // Helper function to safely serialize JSON values
  private toJson(value: any, fallback: any = null): Prisma.InputJsonValue {
    if (value === undefined || value === null) return fallback
    return value as Prisma.InputJsonValue
  }

  protected override getModelName(): string {
    return 'aiOnboardingProfile'
  }

  override async create(data: Partial<AiOnboardingProfile>): Promise<AiOnboardingProfile> {
    return this.prisma.aiOnboardingProfile.create({ 
      data: {
        ...data,
        aiRecommendations: data.aiRecommendations ? this.toJson(data.aiRecommendations) : Prisma.DbNull,
        brandColors: data.brandColors ? this.toJson(data.brandColors) : Prisma.DbNull
      }
    })
  }

  override async findById(id: string): Promise<AiOnboardingProfile | null> {
    return this.prisma.aiOnboardingProfile.findUnique({ where: { id } })
  }

  async findByUserId(userId: string): Promise<AiOnboardingProfile | null> {
    return await this.prisma.aiOnboardingProfile.findUnique({ where: { userId } })
  }

  override async findAll(filters?: Prisma.AiOnboardingProfileWhereInput): Promise<AiOnboardingProfile[]> {
    return this.prisma.aiOnboardingProfile.findMany({ where: filters || {} })
  }

  override async update(id: string, data: Partial<AiOnboardingProfile>): Promise<AiOnboardingProfile> {
    return this.prisma.aiOnboardingProfile.update({
      where: { id },
      data: {
        ...data,
        aiRecommendations: data.aiRecommendations ? this.toJson(data.aiRecommendations) : undefined,
        brandColors: data.brandColors ? this.toJson(data.brandColors) : undefined
      }
    })
  }

  override async delete(id: string): Promise<boolean> {
    await this.prisma.aiOnboardingProfile.delete({ where: { id } })
    return true
  }

  // Create onboarding profile with AI recommendations
  async createProfileWithRecommendations(data: CreateOnboardingProfileData): Promise<OnboardingProfileWithRecommendations> {
    try {
      // Create the profile with proper data conversion
      const profileData = {
        ...data,
        businessName: data.businessName || null,
        businessDescription: data.businessDescription || null,
        targetAudience: data.targetAudience || null,
        brandTone: data.brandTone || null,
        additionalNotes: data.additionalNotes || null,
        brandColors: data.brandColors ? this.toJson(data.brandColors) : Prisma.DbNull
      }
      const profile = await this.create(profileData)

      // Generate AI recommendations
      const recommendations = await this.generateAIRecommendations(profile)

      // Update profile with recommendations
      const updatedProfile = await this.update(profile.id, {
        aiRecommendations: this.toJson(recommendations)
      })

      return {
        ...updatedProfile,
        aiRecommendations: recommendations as any
      }
    } catch (error) {
      console.error('Failed to create profile with recommendations:', error)
      throw error
    }
  }

  // Generate AI recommendations based on profile
  async generateAIRecommendations(profile: AiOnboardingProfile): Promise<AIRecommendation[]> {
    try {
      const recommendations: AIRecommendation[] = []

      // Layout recommendations based on business type and goals
      if (profile.siteGoals.includes('ecommerce') || profile.siteGoals.includes('online-store')) {
        recommendations.push({
          type: 'layout',
          title: 'E-commerce Layout',
          description: 'Optimized layout for online shopping with product showcase and checkout flow',
          priority: 'high',
          implementation: 'Use product grid layout with filtering, search, and cart functionality',
          estimatedTime: '2-3 hours',
          benefits: ['Better conversion rates', 'Professional appearance', 'Mobile-friendly shopping']
        })
      }

      if (profile.siteGoals.includes('portfolio') || profile.siteGoals.includes('showcase')) {
        recommendations.push({
          type: 'layout',
          title: 'Portfolio Showcase',
          description: 'Clean, modern layout to highlight your work and achievements',
          priority: 'high',
          implementation: 'Use masonry grid or carousel layout with high-quality images',
          estimatedTime: '1-2 hours',
          benefits: ['Professional presentation', 'Easy navigation', 'Visual impact']
        })
      }

      // Content recommendations
      if (profile.preferredLanguage === Language.URDU) {
        recommendations.push({
          type: 'content',
          title: 'Urdu Content Optimization',
          description: 'Optimize content for Urdu-speaking audience with proper RTL support',
          priority: 'high',
          implementation: 'Use Urdu fonts, RTL layout, and culturally appropriate content',
          estimatedTime: '1 hour',
          benefits: ['Better local engagement', 'Cultural relevance', 'Accessibility']
        })
      }

      if (profile.keywords.length > 0) {
        recommendations.push({
          type: 'seo',
          title: 'SEO Optimization',
          description: `Optimize content for keywords: ${profile.keywords.join(', ')}`,
          priority: 'medium',
          implementation: 'Include keywords in headings, meta descriptions, and content',
          estimatedTime: '1-2 hours',
          benefits: ['Better search visibility', 'Higher organic traffic', 'Targeted audience reach']
        })
      }

      // Design recommendations
      if (profile.brandColors) {
        recommendations.push({
          type: 'design',
          title: 'Brand Color Integration',
          description: 'Apply your brand colors consistently across the website',
          priority: 'medium',
          implementation: 'Use brand colors for headers, buttons, and accent elements',
          estimatedTime: '30 minutes',
          benefits: ['Brand consistency', 'Professional appearance', 'Brand recognition']
        })
      }

      // Feature recommendations based on goals
      if (profile.siteGoals.includes('contact') || profile.siteGoals.includes('lead-generation')) {
        recommendations.push({
          type: 'features',
          title: 'Contact Form Integration',
          description: 'Add contact forms and lead capture functionality',
          priority: 'high',
          implementation: 'Include contact forms, WhatsApp integration, and email capture',
          estimatedTime: '1 hour',
          benefits: ['Lead generation', 'Customer communication', 'Business inquiries']
        })
      }

      if (profile.siteGoals.includes('social-media') || profile.siteGoals.includes('community')) {
        recommendations.push({
          type: 'features',
          title: 'Social Media Integration',
          description: 'Connect your website with social media platforms',
          priority: 'medium',
          implementation: 'Add social media buttons, feeds, and sharing functionality',
          estimatedTime: '45 minutes',
          benefits: ['Social engagement', 'Content sharing', 'Community building']
        })
      }

      // Pakistan-specific recommendations
      if (profile.preferredLanguage === Language.URDU || profile.preferredLanguage === Language.PUNJABI) {
        recommendations.push({
          type: 'features',
          title: 'Pakistan Payment Integration',
          description: 'Integrate JazzCash, EasyPaisa, and bank transfer options',
          priority: 'high',
          implementation: 'Add Pakistan-specific payment gateways for local customers',
          estimatedTime: '2-3 hours',
          benefits: ['Local payment methods', 'Higher conversion rates', 'Customer convenience']
        })
      }

      return recommendations
    } catch (error) {
      console.error('Failed to generate AI recommendations:', error)
      return []
    }
  }

  // Get onboarding checklist
  async getOnboardingChecklist(userId: string): Promise<{
    completed: boolean
    steps: Array<{
      id: string
      title: string
      description: string
      completed: boolean
      required: boolean
      estimatedTime: string
    }>
  }> {
    try {
      const profile = await this.findByUserId(userId)
      const userLimits = await this.subscriptionService.checkUserLimits(userId)

      const steps = [
        {
          id: 'profile-setup',
          title: 'Complete AI Profile',
          description: 'Set up your business profile for personalized recommendations',
          completed: !!profile,
          required: true,
          estimatedTime: '5 minutes'
        },
        {
          id: 'first-website',
          title: 'Create Your First Website',
          description: 'Build your first website using AI recommendations',
          completed: userLimits.websitesCount > 0,
          required: true,
          estimatedTime: '30 minutes'
        },
        {
          id: 'customize-design',
          title: 'Customize Design',
          description: 'Apply your brand colors and styling',
          completed: profile?.brandColors ? true : false,
          required: false,
          estimatedTime: '15 minutes'
        },
        {
          id: 'add-content',
          title: 'Add Content',
          description: 'Add your business information and content',
          completed: userLimits.pagesCount > 1,
          required: true,
          estimatedTime: '20 minutes'
        },
        {
          id: 'setup-domain',
          title: 'Setup Domain',
          description: userLimits.canUseCustomDomain
            ? 'Connect your custom domain' 
            : 'Upgrade to use custom domain',
          completed: false, // This would need to be checked from domain service
          required: false,
          estimatedTime: userLimits.canUseCustomDomain ? '10 minutes' : 'Upgrade required'
        },
        {
          id: 'payment-setup',
          title: 'Setup Payments',
          description: userLimits.canUsePaymentIntegration
            ? 'Configure payment gateways for your website'
            : 'Upgrade to enable payment integration',
          completed: false, // This would need to be checked from payment gateway service
          required: false,
          estimatedTime: userLimits.canUsePaymentIntegration ? '30 minutes' : 'Upgrade required'
        },
        {
          id: 'publish-website',
          title: 'Publish Website',
          description: 'Make your website live and accessible',
          completed: false, // This would need to be checked from website service
          required: true,
          estimatedTime: '5 minutes'
        }
      ]

      const requiredSteps = steps.filter(step => step.required).length
      const completedRequiredSteps = steps.filter(step => step.required && step.completed).length

      return {
        completed: completedRequiredSteps === requiredSteps,
        steps
      }
    } catch (error) {
      console.error('Failed to get onboarding checklist:', error)
      throw error
    }
  }

  // Update user AI quota usage
  async updateAIQuotaUsage(userId: string, tokensUsed: number): Promise<boolean> {
    try {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
      if (!user) {
        throw new Error('User not found')
      }

      // Check if user has exceeded quota
      const userLimits = await this.subscriptionService.checkUserLimits(userId)
      if (userLimits.aiQuotaRemaining < tokensUsed) {
        throw new Error('AI quota exceeded. Please upgrade your plan.')
      }

      // Update quota usage
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          aiQuotaUsed: user.aiQuotaUsed + tokensUsed
        }
      })

      return true
    } catch (error) {
      console.error('Failed to update AI quota usage:', error)
      throw error
    }
  }

  // Get AI usage statistics
  async getAIUsageStats(userId: string): Promise<{
    quotaUsed: number
    quotaRemaining: number
    quotaTotal: number
    resetDate: Date | null
    usagePercentage: number
  }> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } })
      if (!user) {
        throw new Error('User not found')
      }

      const userLimits = await this.subscriptionService.checkUserLimits(userId)
      const quotaTotal = userLimits.aiQuotaRemaining + user.aiQuotaUsed
      const quotaUsed = user.aiQuotaUsed
      const quotaRemaining = Math.max(0, quotaTotal - quotaUsed)
      const usagePercentage = quotaTotal > 0 ? (quotaUsed / quotaTotal) * 100 : 0

      return {
        quotaUsed,
        quotaRemaining,
        quotaTotal,
        resetDate: user.aiQuotaResetAt,
        usagePercentage
      }
    } catch (error) {
      console.error('Failed to get AI usage stats:', error)
      throw error
    }
  }

  // Generate website content using AI
  async generateWebsiteContent(profileId: string, contentType: 'hero' | 'about' | 'services' | 'contact'): Promise<{
    success: boolean
    content?: string
    error?: string
  }> {
    try {
      const profile = await this.findById(profileId)
      if (!profile) {
        return { success: false, error: 'Profile not found' }
      }

      // Check AI quota
      const userLimits = await this.subscriptionService.checkUserLimits(profile.userId)
      if (userLimits.aiQuotaRemaining < 100) { // Assuming 100 tokens per content generation
        return { success: false, error: 'AI quota exceeded. Please upgrade your plan.' }
      }

      // Generate content based on profile and type
      let content = ''
      
      switch (contentType) {
        case 'hero':
          content = this.generateHeroContent(profile)
          break
        case 'about':
          content = this.generateAboutContent(profile)
          break
        case 'services':
          content = this.generateServicesContent(profile)
          break
        case 'contact':
          content = this.generateContactContent(profile)
          break
        default:
          return { success: false, error: 'Invalid content type' }
      }

      // Update AI quota usage
      await this.updateAIQuotaUsage(profile.userId, 100)

      return {
        success: true,
        content
      }
    } catch (error) {
      console.error('Failed to generate website content:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Content generation failed'
      }
    }
  }

  // Content generation methods
  private generateHeroContent(profile: AiOnboardingProfile): string {
    const businessName = profile.businessName || 'Your Business'
    const language = profile.preferredLanguage

    if (language === Language.URDU) {
      return `
        <h1>${businessName} میں خوش آمدید</h1>
        <p>آپ کی بزنس کی بہترین خدمات کے لیے ہم یہاں موجود ہیں۔</p>
        <p>ہمارا مقصد آپ کو بہترین حل فراہم کرنا ہے۔</p>
      `
    }

    return `
      <h1>Welcome to ${businessName}</h1>
      <p>We're here to provide the best services for your business.</p>
      <p>Our goal is to deliver exceptional solutions tailored to your needs.</p>
    `
  }

  private generateAboutContent(profile: AiOnboardingProfile): string {
    const businessName = profile.businessName || 'Our Business'
    const description = profile.businessDescription || 'We are committed to providing excellent service.'
    const language = profile.preferredLanguage

    if (language === Language.URDU) {
      return `
        <h2>${businessName} کے بارے میں</h2>
        <p>${description}</p>
        <p>ہم اپنے گاہکوں کو بہترین خدمات فراہم کرنے کے لیے پرعزم ہیں۔</p>
      `
    }

    return `
      <h2>About ${businessName}</h2>
      <p>${description}</p>
      <p>We are committed to providing excellent service to our customers.</p>
    `
  }

  private generateServicesContent(profile: AiOnboardingProfile): string {
    const language = profile.preferredLanguage
    const goals = profile.siteGoals

    if (language === Language.URDU) {
      return `
        <h2>ہماری خدمات</h2>
        <div class="services-grid">
          ${goals.map(goal => `
            <div class="service-item">
              <h3>${this.translateGoalToUrdu(goal)}</h3>
              <p>ہم آپ کو ${this.translateGoalToUrdu(goal)} کے لیے بہترین حل فراہم کرتے ہیں۔</p>
            </div>
          `).join('')}
        </div>
      `
    }

    return `
      <h2>Our Services</h2>
      <div class="services-grid">
        ${goals.map(goal => `
          <div class="service-item">
            <h3>${this.capitalizeFirst(goal)}</h3>
            <p>We provide the best solutions for ${goal}.</p>
          </div>
        `).join('')}
      </div>
    `
  }

  private generateContactContent(profile: AiOnboardingProfile): string {
    const language = profile.preferredLanguage

    if (language === Language.URDU) {
      return `
        <h2>ہم سے رابطہ کریں</h2>
        <p>آپ کے سوالات اور مشورے کے لیے ہم سے رابطہ کریں۔</p>
        <p>فون: +92-XXX-XXXXXXX</p>
        <p>ای میل: info@yourbusiness.com</p>
        <p>پتہ: آپ کا پتہ یہاں</p>
      `
    }

    return `
      <h2>Contact Us</h2>
      <p>Get in touch with us for any questions or inquiries.</p>
      <p>Phone: +92-XXX-XXXXXXX</p>
      <p>Email: info@yourbusiness.com</p>
      <p>Address: Your address here</p>
    `
  }

  private translateGoalToUrdu(goal: string): string {
    const translations: Record<string, string> = {
      'ecommerce': 'آن لائن شاپنگ',
      'portfolio': 'پورٹ فولیو',
      'blog': 'بلاگ',
      'contact': 'رابطہ',
      'services': 'خدمات',
      'about': 'کے بارے میں',
      'gallery': 'گیلری',
      'testimonials': 'شاہدین'
    }
    return translations[goal] || goal
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
}
