import { FastifyInstance } from 'fastify'

export async function aiOnboardingRoutes(fastify: FastifyInstance) {
  // Test route to verify registration
  fastify.get('/ai-onboarding/test', async (request, reply) => {
    return reply.send({ 
      success: true, 
      message: 'AI onboarding routes are working!',
      timestamp: new Date().toISOString()
    })
  })

  // Get available languages
  fastify.get('/ai-onboarding/languages', async (request, reply) => {
    try {
      const languages = [
        { value: 'ENGLISH', label: 'English', nativeLabel: 'English' },
        { value: 'URDU', label: 'Urdu', nativeLabel: 'اردو' },
        { value: 'PUNJABI', label: 'Punjabi', nativeLabel: 'پنجابی' },
        { value: 'SINDHI', label: 'Sindhi', nativeLabel: 'سنڌي' },
        { value: 'PASHTO', label: 'Pashto', nativeLabel: 'پښتو' }
      ]

      return reply.send({
        success: true,
        data: languages
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch languages'
      })
    }
  })

  // Get site goals options
  fastify.get('/ai-onboarding/site-goals', async (request, reply) => {
    try {
      const siteGoals = [
        { value: 'ecommerce', label: 'E-commerce Store', description: 'Sell products online' },
        { value: 'portfolio', label: 'Portfolio', description: 'Showcase your work' },
        { value: 'blog', label: 'Blog', description: 'Share articles and content' },
        { value: 'contact', label: 'Contact Page', description: 'Get customer inquiries' },
        { value: 'services', label: 'Services', description: 'Promote your services' },
        { value: 'about', label: 'About Us', description: 'Tell your story' },
        { value: 'gallery', label: 'Gallery', description: 'Showcase images' },
        { value: 'testimonials', label: 'Testimonials', description: 'Customer reviews' },
        { value: 'social-media', label: 'Social Media', description: 'Connect with followers' },
        { value: 'community', label: 'Community', description: 'Build a community' },
        { value: 'lead-generation', label: 'Lead Generation', description: 'Capture leads' },
        { value: 'online-store', label: 'Online Store', description: 'Complete online store' }
      ]

      return reply.send({
        success: true,
        data: siteGoals
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch site goals'
      })
    }
  })

  // Get brand tone options
  fastify.get('/ai-onboarding/brand-tones', async (request, reply) => {
    try {
      const brandTones = [
        { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
        { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
        { value: 'modern', label: 'Modern', description: 'Contemporary and trendy' },
        { value: 'traditional', label: 'Traditional', description: 'Classic and timeless' },
        { value: 'creative', label: 'Creative', description: 'Artistic and innovative' },
        { value: 'casual', label: 'Casual', description: 'Relaxed and informal' },
        { value: 'luxury', label: 'Luxury', description: 'Premium and exclusive' },
        { value: 'minimalist', label: 'Minimalist', description: 'Clean and simple' }
      ]

      return reply.send({
        success: true,
        data: brandTones
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch brand tones'
      })
    }
  })

  // Generate AI recommendations
  fastify.post('/ai-onboarding/profile', async (request, reply) => {
    try {
      const { businessName, businessDescription, siteGoals, brandTone, preferredLanguage } = request.body as any

      // Generate AI recommendations based on user input
      const recommendations = [
        {
          id: '1',
          title: 'Optimize for Mobile Devices',
          description: 'Ensure your website is fully responsive and mobile-friendly, as 70% of Pakistani users browse on mobile.',
          category: 'DESIGN',
          priority: 'high',
          estimatedTime: '2-3 hours',
          difficulty: 'medium',
          tags: ['mobile', 'responsive', 'ux']
        },
        {
          id: '2',
          title: 'Add Local Payment Methods',
          description: 'Integrate JazzCash and EasyPaisa for seamless local payments, increasing conversion rates by 40%.',
          category: 'PAYMENT',
          priority: 'high',
          estimatedTime: '1-2 hours',
          difficulty: 'easy',
          tags: ['payment', 'jazzcash', 'easypaisa']
        },
        {
          id: '3',
          title: 'Implement Multi-Language Support',
          description: `Add ${preferredLanguage === 'URDU' ? 'Urdu' : preferredLanguage === 'PUNJABI' ? 'Punjabi' : 'English'} language support to reach more Pakistani customers.`,
          category: 'CONTENT',
          priority: 'medium',
          estimatedTime: '3-4 hours',
          difficulty: 'medium',
          tags: ['multilingual', 'localization', 'urdu']
        },
        {
          id: '4',
          title: 'Create SEO-Optimized Content',
          description: 'Optimize your website content for Pakistani search engines and local keywords to improve visibility.',
          category: 'SEO',
          priority: 'medium',
          estimatedTime: '4-5 hours',
          difficulty: 'medium',
          tags: ['seo', 'content', 'keywords']
        },
        {
          id: '5',
          title: 'Add Social Media Integration',
          description: 'Connect your website with Facebook, Instagram, and WhatsApp to engage with Pakistani customers.',
          category: 'SOCIAL',
          priority: 'medium',
          estimatedTime: '2-3 hours',
          difficulty: 'easy',
          tags: ['social', 'facebook', 'whatsapp']
        },
        {
          id: '6',
          title: 'Implement Contact Forms',
          description: 'Add contact forms with Pakistani phone number validation and WhatsApp integration.',
          category: 'CONTACT',
          priority: 'high',
          estimatedTime: '1-2 hours',
          difficulty: 'easy',
          tags: ['contact', 'forms', 'whatsapp']
        }
      ]

      // Filter recommendations based on site goals
      const filteredRecommendations = recommendations.filter(rec => {
        if (siteGoals?.includes('ecommerce') && rec.category === 'PAYMENT') return true
        if (siteGoals?.includes('contact') && rec.category === 'CONTACT') return true
        if (siteGoals?.includes('social-media') && rec.category === 'SOCIAL') return true
        if (rec.category === 'DESIGN' || rec.category === 'SEO') return true
        return false
      })

      return reply.send({
        success: true,
        data: {
          id: `profile-${Date.now()}`,
          aiRecommendations: filteredRecommendations
        }
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to generate recommendations'
      })
    }
  })

  // Get AI onboarding checklist
  fastify.get('/ai-onboarding/checklist/:userId', async (request, reply) => {
    try {
      const { userId } = request.params as { userId: string }
      
      const checklist = {
        id: `checklist-${userId}`,
        userId,
        steps: [
          {
            id: 'profile-setup',
            title: 'Complete AI Profile',
            description: 'Set up your AI-powered profile',
            completed: true,
            priority: 'high'
          },
          {
            id: 'first-website',
            title: 'Create Your First Website',
            description: 'Build your first website using AI recommendations',
            completed: false,
            priority: 'high'
          },
          {
            id: 'custom-domain',
            title: 'Add Custom Domain',
            description: 'Connect your own domain name',
            completed: false,
            priority: 'medium'
          },
          {
            id: 'payment-setup',
            title: 'Set Up Payments',
            description: 'Configure JazzCash/EasyPaisa integration',
            completed: false,
            priority: 'high'
          },
          {
            id: 'seo-optimization',
            title: 'SEO Optimization',
            description: 'Optimize for Pakistani search engines',
            completed: false,
            priority: 'medium'
          }
        ],
        aiQuota: {
          used: 0,
          limit: 10,
          resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        }
      }

      return reply.send({
        success: true,
        data: checklist
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch checklist'
      })
    }
  })
}