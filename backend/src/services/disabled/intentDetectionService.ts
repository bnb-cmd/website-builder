export interface Intent {
  type: 'ecommerce' | 'portfolio' | 'blog' | 'business' | 'restaurant' | 'education' | 'event' | 'landing' | 'other'
  confidence: number
  industry?: string
  features: string[]
  suggestedTemplate?: string
  keywords: string[]
}

export class IntentDetectionService {
  private intentPatterns = {
    ecommerce: {
      keywords: ['store', 'shop', 'sell', 'products', 'ecommerce', 'e-commerce', 'online store', 'marketplace', 'cart', 'checkout', 'buy', 'purchase', 'دکان', 'خریداری'],
      features: ['product-catalog', 'shopping-cart', 'checkout', 'payment-integration', 'inventory'],
      templates: ['ecommerce-modern', 'ecommerce-minimal', 'ecommerce-fashion']
    },
    portfolio: {
      keywords: ['portfolio', 'showcase', 'work', 'projects', 'gallery', 'photographer', 'designer', 'artist', 'creative', 'پورٹ فولیو'],
      features: ['gallery', 'project-showcase', 'about', 'contact-form'],
      templates: ['portfolio-creative', 'portfolio-minimal', 'portfolio-photography']
    },
    blog: {
      keywords: ['blog', 'articles', 'news', 'content', 'writing', 'magazine', 'publication', 'بلاگ', 'مضامین'],
      features: ['blog-posts', 'categories', 'search', 'comments', 'rss'],
      templates: ['blog-modern', 'blog-magazine', 'blog-minimal']
    },
    business: {
      keywords: ['company', 'business', 'corporate', 'services', 'agency', 'consulting', 'professional', 'کمپنی', 'کاروبار'],
      features: ['services', 'about', 'team', 'contact-form', 'testimonials'],
      templates: ['business-corporate', 'business-agency', 'business-consulting']
    },
    restaurant: {
      keywords: ['restaurant', 'cafe', 'food', 'menu', 'dining', 'eatery', 'bistro', 'ریستوراں', 'کھانا'],
      features: ['menu', 'reservations', 'gallery', 'contact', 'location'],
      templates: ['restaurant-modern', 'restaurant-elegant', 'cafe-cozy']
    },
    education: {
      keywords: ['school', 'course', 'learning', 'education', 'training', 'academy', 'institute', 'تعلیم', 'کورس'],
      features: ['courses', 'enrollment', 'instructors', 'schedule', 'testimonials'],
      templates: ['education-modern', 'education-academy', 'education-online']
    },
    event: {
      keywords: ['event', 'conference', 'wedding', 'party', 'booking', 'celebration', 'تقریب', 'شادی'],
      features: ['event-details', 'registration', 'schedule', 'speakers', 'venue'],
      templates: ['event-conference', 'event-wedding', 'event-festival']
    },
    landing: {
      keywords: ['landing page', 'product launch', 'campaign', 'promotion', 'coming soon', 'waitlist'],
      features: ['hero', 'features', 'cta', 'email-capture', 'countdown'],
      templates: ['landing-product', 'landing-saas', 'landing-app']
    }
  }

  private industryPatterns = {
    fashion: ['clothing', 'fashion', 'apparel', 'clothes', 'boutique', 'wear', 'کپڑے', 'فیشن'],
    technology: ['tech', 'software', 'app', 'digital', 'it', 'saas', 'ٹیکنالوجی'],
    food: ['food', 'restaurant', 'cafe', 'bakery', 'catering', 'کھانا', 'ریستوراں'],
    health: ['health', 'fitness', 'wellness', 'medical', 'clinic', 'صحت'],
    education: ['education', 'learning', 'school', 'course', 'training', 'تعلیم'],
    real_estate: ['real estate', 'property', 'housing', 'apartment', 'رئیل اسٹیٹ'],
    beauty: ['beauty', 'salon', 'spa', 'cosmetics', 'خوبصورتی'],
    automotive: ['car', 'auto', 'vehicle', 'automotive', 'گاڑی'],
    finance: ['finance', 'banking', 'investment', 'insurance', 'مالیات'],
    travel: ['travel', 'tourism', 'hotel', 'vacation', 'سفر']
  }

  detectIntent(userInput: string): Intent {
    const input = userInput.toLowerCase()
    let bestMatch: Intent = {
      type: 'other',
      confidence: 0,
      features: [],
      keywords: []
    }

    // Check each intent type
    for (const [intentType, config] of Object.entries(this.intentPatterns)) {
      const matchCount = config.keywords.filter(keyword => 
        input.includes(keyword.toLowerCase())
      ).length

      const confidence = matchCount / config.keywords.length

      if (confidence > bestMatch.confidence) {
        bestMatch = {
          type: intentType as Intent['type'],
          confidence,
          features: config.features,
          suggestedTemplate: config.templates[0],
          keywords: config.keywords.filter(k => input.includes(k.toLowerCase()))
        }
      }
    }

    // Detect industry
    for (const [industry, keywords] of Object.entries(this.industryPatterns)) {
      const hasIndustryKeyword = keywords.some(keyword => 
        input.includes(keyword.toLowerCase())
      )
      if (hasIndustryKeyword) {
        bestMatch.industry = industry
        break
      }
    }

    // If confidence is too low, mark as other
    if (bestMatch.confidence < 0.1) {
      bestMatch.type = 'other'
    }

    return bestMatch
  }

  generateFollowUpQuestions(intent: Intent): string[] {
    const questions: string[] = []

    switch (intent.type) {
      case 'ecommerce':
        questions.push(
          "What type of products will you sell?",
          "Do you need payment integration? (JazzCash/EasyPaisa)",
          "Will you ship products or offer local pickup?"
        )
        break
      case 'portfolio':
        questions.push(
          "What type of work do you want to showcase?",
          "Do you need a contact form for inquiries?",
          "Would you like to include client testimonials?"
        )
        break
      case 'blog':
        questions.push(
          "What topics will you write about?",
          "Do you want categories and tags?",
          "Will you have multiple authors?"
        )
        break
      case 'business':
        questions.push(
          "What services does your business offer?",
          "Do you want to showcase your team?",
          "Do you need a booking or appointment system?"
        )
        break
      case 'restaurant':
        questions.push(
          "Do you want to display your menu online?",
          "Do you need table reservations?",
          "Would you like online ordering?"
        )
        break
      default:
        questions.push(
          "What's the main goal of your website?",
          "Who is your target audience?",
          "What features are most important to you?"
        )
    }

    return questions
  }

  suggestFeatures(intent: Intent): Array<{
    id: string
    name: string
    description: string
    recommended: boolean
  }> {
    const baseFeatures = [
      { id: 'contact-form', name: 'Contact Form', description: 'Let visitors reach out to you', recommended: true },
      { id: 'social-media', name: 'Social Media Links', description: 'Connect your social profiles', recommended: true },
      { id: 'seo', name: 'SEO Optimization', description: 'Improve search engine visibility', recommended: true }
    ]

    const intentSpecificFeatures: Record<string, Array<any>> = {
      ecommerce: [
        { id: 'product-catalog', name: 'Product Catalog', description: 'Showcase your products', recommended: true },
        { id: 'shopping-cart', name: 'Shopping Cart', description: 'Let customers add items to cart', recommended: true },
        { id: 'payment-gateway', name: 'Payment Integration', description: 'JazzCash, EasyPaisa, Stripe', recommended: true },
        { id: 'inventory', name: 'Inventory Management', description: 'Track stock levels', recommended: false }
      ],
      portfolio: [
        { id: 'gallery', name: 'Image Gallery', description: 'Display your work beautifully', recommended: true },
        { id: 'project-pages', name: 'Project Pages', description: 'Detailed case studies', recommended: true },
        { id: 'testimonials', name: 'Client Testimonials', description: 'Show social proof', recommended: false }
      ],
      blog: [
        { id: 'blog-posts', name: 'Blog Posts', description: 'Write and publish articles', recommended: true },
        { id: 'categories', name: 'Categories & Tags', description: 'Organize your content', recommended: true },
        { id: 'comments', name: 'Comments', description: 'Engage with readers', recommended: false }
      ],
      restaurant: [
        { id: 'menu', name: 'Digital Menu', description: 'Display your dishes', recommended: true },
        { id: 'reservations', name: 'Table Reservations', description: 'Book tables online', recommended: true },
        { id: 'online-ordering', name: 'Online Ordering', description: 'Food delivery integration', recommended: false }
      ]
    }

    const specificFeatures = intentSpecificFeatures[intent.type] || []
    return [...specificFeatures, ...baseFeatures]
  }

  detectLanguagePreference(userInput: string): 'ENGLISH' | 'URDU' | 'PUNJABI' {
    // Check for Urdu characters
    const urduPattern = /[\u0600-\u06FF]/
    if (urduPattern.test(userInput)) {
      return 'URDU'
    }

    // Check for common Urdu/Punjabi keywords in English
    const urduKeywords = ['urdu', 'اردو', 'pakistan', 'pakistani', 'پاکستان']
    const punjabiKeywords = ['punjabi', 'پنجابی']

    const input = userInput.toLowerCase()
    if (urduKeywords.some((k: string) => input.includes(k))) {
      return 'URDU'
    }
    if (punjabiKeywords.some((k: string) => input.includes(k))) {
      return 'PUNJABI'
    }

    return 'ENGLISH'
  }
}
