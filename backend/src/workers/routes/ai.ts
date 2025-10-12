import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { db } from '../lib/db'
import { kv } from '../lib/kv'

const aiRoutes = new Hono()

// Validation schemas
const generateContentSchema = z.object({
  prompt: z.string().min(1).max(2000),
  type: z.enum(['hero', 'features', 'testimonials', 'content', 'seo', 'cta', 'about', 'contact']),
  language: z.enum(['ENGLISH', 'URDU']).default('ENGLISH'),
  context: z.record(z.any()).optional(),
  tone: z.enum(['professional', 'casual', 'friendly', 'formal', 'creative']).default('professional'),
  length: z.enum(['short', 'medium', 'long']).default('medium')
})

const generateImageSchema = z.object({
  prompt: z.string().min(1).max(500),
  style: z.enum(['realistic', 'illustration', 'minimalist', 'vintage', 'modern']).default('realistic'),
  size: z.enum(['square', 'landscape', 'portrait']).default('landscape'),
  language: z.enum(['ENGLISH', 'URDU']).default('ENGLISH')
})

const optimizeSEOSchema = z.object({
  content: z.string().min(1),
  targetKeywords: z.array(z.string()).optional(),
  language: z.enum(['ENGLISH', 'URDU']).default('ENGLISH'),
  contentType: z.enum(['page', 'blog', 'product', 'service']).default('page')
})

type Bindings = {
  DB: D1Database
  CACHE_KV: KVNamespace
  AI_API_KEY: string
}

// Helper function to check AI quota
const checkAIQuota = async (c: any, userId: string) => {
  const user = await db.queryOne(c, `
    SELECT aiQuotaUsed, aiQuotaResetAt 
    FROM users 
    WHERE id = ?
  `, [userId])

  if (!user) {
    return { allowed: false, reason: 'User not found' }
  }

  const now = new Date()
  const resetAt = new Date(user.aiQuotaResetAt)

  // Reset quota if reset date has passed
  if (resetAt < now) {
    await db.execute(c, `
      UPDATE users 
      SET aiQuotaUsed = 0, aiQuotaResetAt = ?
      WHERE id = ?
    `, [new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), userId]) // Reset in 30 days
    return { allowed: true, quotaUsed: 0, quotaLimit: 100 }
  }

  const quotaLimit = 100 // Monthly limit
  const quotaUsed = user.aiQuotaUsed || 0

  if (quotaUsed >= quotaLimit) {
    return { allowed: false, reason: 'AI quota exceeded', quotaUsed, quotaLimit }
  }

  return { allowed: true, quotaUsed, quotaLimit }
}

// Helper function to increment AI quota
const incrementAIQuota = async (c: any, userId: string) => {
  await db.execute(c, `
    UPDATE users 
    SET aiQuotaUsed = aiQuotaUsed + 1, updatedAt = ?
    WHERE id = ?
  `, [new Date().toISOString(), userId])
}

// Helper function to call AI API
const callAIAPI = async (prompt: string, options: any = {}) => {
  // This would integrate with OpenAI, Anthropic, or other AI providers
  // For now, we'll return mock responses
  
  const mockResponses = {
    hero: {
      ENGLISH: {
        title: "Transform Your Business with Our Solutions",
        subtitle: "Discover innovative tools and strategies that will revolutionize your workflow and boost productivity.",
        cta: "Get Started Today"
      },
      URDU: {
        title: "ہماری خدمات کے ساتھ اپنے کاروبار کو تبدیل کریں",
        subtitle: "جدید ٹولز اور حکمت عملی دریافت کریں جو آپ کے کام کو انقلابی بنائیں گے۔",
        cta: "آج ہی شروع کریں"
      }
    },
    features: {
      ENGLISH: [
        { title: "Easy to Use", description: "Intuitive interface designed for everyone" },
        { title: "Powerful Features", description: "Advanced capabilities for professionals" },
        { title: "24/7 Support", description: "Round-the-clock assistance when you need it" }
      ],
      URDU: [
        { title: "استعمال میں آسان", description: "ہر کسی کے لیے بنایا گیا آسان انٹرفیس" },
        { title: "طاقتور خصوصیات", description: "پیشہ ور افراد کے لیے جدید صلاحیتیں" },
        { title: "24/7 سپورٹ", description: "جب آپ کو ضرورت ہو تو ہر وقت مدد" }
      ]
    },
    testimonials: {
      ENGLISH: [
        { name: "Sarah Johnson", role: "CEO, TechCorp", content: "This platform has revolutionized our workflow. Highly recommended!" },
        { name: "Mike Chen", role: "Marketing Director", content: "The best tool we've used for our campaigns. Amazing results!" }
      ],
      URDU: [
        { name: "سارہ جانسن", role: "سی ای او، ٹیک کارپ", content: "اس پلیٹ فارم نے ہمارے کام کو انقلابی بنایا ہے۔ انتہائی سفارش!" },
        { name: "مائیک چن", role: "مارکیٹنگ ڈائریکٹر", content: "ہماری مہمات کے لیے بہترین ٹول۔ حیرت انگیز نتائج!" }
      ]
    }
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  return mockResponses[options.type]?.[options.language] || mockResponses.hero[options.language]
}

// POST /generate/content - Generate content using AI
aiRoutes.post('/generate/content', zValidator('json', generateContentSchema), async (c) => {
  const { AI_API_KEY } = c.env as Bindings
  const userId = c.get('user')?.userId
  const { prompt, type, language, context, tone, length } = c.req.valid('json')

  try {
    if (!userId) {
      return c.json({
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    // Check AI quota
    const quotaCheck = await checkAIQuota(c, userId)
    if (!quotaCheck.allowed) {
      return c.json({
        success: false,
        error: {
          message: quotaCheck.reason,
          code: 'AI_QUOTA_EXCEEDED',
          quotaUsed: quotaCheck.quotaUsed,
          quotaLimit: quotaCheck.quotaLimit
        }
      }, 429)
    }

    // Generate content using AI
    const generatedContent = await callAIAPI(prompt, {
      type,
      language,
      context,
      tone,
      length
    })

    // Increment AI quota
    await incrementAIQuota(c, userId)

    // Store generation history
    const generationId = crypto.randomUUID()
    await db.execute(c, `
      INSERT INTO ai_generations (id, userId, type, prompt, response, language, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      generationId, userId, type, prompt, JSON.stringify(generatedContent),
      language, new Date().toISOString()
    ])

    return c.json({
      success: true,
      data: {
        id: generationId,
        content: generatedContent,
        quotaUsed: quotaCheck.quotaUsed + 1,
        quotaLimit: quotaCheck.quotaLimit
      }
    })

  } catch (error: any) {
    console.error('Generate content error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to generate content',
        code: 'GENERATE_CONTENT_ERROR'
      }
    }, 500)
  }
})

// POST /generate/image - Generate image using AI
aiRoutes.post('/generate/image', zValidator('json', generateImageSchema), async (c) => {
  const { AI_API_KEY } = c.env as Bindings
  const userId = c.get('user')?.userId
  const { prompt, style, size, language } = c.req.valid('json')

  try {
    if (!userId) {
      return c.json({
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    // Check AI quota
    const quotaCheck = await checkAIQuota(c, userId)
    if (!quotaCheck.allowed) {
      return c.json({
        success: false,
        error: {
          message: quotaCheck.reason,
          code: 'AI_QUOTA_EXCEEDED',
          quotaUsed: quotaCheck.quotaUsed,
          quotaLimit: quotaCheck.quotaLimit
        }
      }, 429)
    }

    // Generate image using AI (mock implementation)
    const imageUrl = `https://images.example.com/generated/${crypto.randomUUID()}.jpg`

    // Increment AI quota
    await incrementAIQuota(c, userId)

    // Store generation history
    const generationId = crypto.randomUUID()
    await db.execute(c, `
      INSERT INTO ai_generations (id, userId, type, prompt, response, language, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      generationId, userId, 'image', prompt, JSON.stringify({ imageUrl, style, size }),
      language, new Date().toISOString()
    ])

    return c.json({
      success: true,
      data: {
        id: generationId,
        imageUrl,
        style,
        size,
        quotaUsed: quotaCheck.quotaUsed + 1,
        quotaLimit: quotaCheck.quotaLimit
      }
    })

  } catch (error: any) {
    console.error('Generate image error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to generate image',
        code: 'GENERATE_IMAGE_ERROR'
      }
    }, 500)
  }
})

// POST /optimize/seo - Optimize content for SEO
aiRoutes.post('/optimize/seo', zValidator('json', optimizeSEOSchema), async (c) => {
  const { AI_API_KEY } = c.env as Bindings
  const userId = c.get('user')?.userId
  const { content, targetKeywords, language, contentType } = c.req.valid('json')

  try {
    if (!userId) {
      return c.json({
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    // Check AI quota
    const quotaCheck = await checkAIQuota(c, userId)
    if (!quotaCheck.allowed) {
      return c.json({
        success: false,
        error: {
          message: quotaCheck.reason,
          code: 'AI_QUOTA_EXCEEDED',
          quotaUsed: quotaCheck.quotaUsed,
          quotaLimit: quotaCheck.quotaLimit
        }
      }, 429)
    }

    // Generate SEO optimization suggestions
    const seoOptimization = {
      title: language === 'URDU' ? 'بہترین SEO عنوان' : 'Optimized Title',
      description: language === 'URDU' ? 'SEO کے لیے بہترین تفصیل' : 'Optimized meta description',
      keywords: targetKeywords || ['keyword1', 'keyword2', 'keyword3'],
      suggestions: [
        language === 'URDU' ? 'کلیدی الفاظ کا استعمال بڑھائیں' : 'Increase keyword density',
        language === 'URDU' ? 'ہیڈنگز شامل کریں' : 'Add more headings',
        language === 'URDU' ? 'تصاویر میں alt text شامل کریں' : 'Add alt text to images'
      ],
      score: 85
    }

    // Increment AI quota
    await incrementAIQuota(c, userId)

    // Store generation history
    const generationId = crypto.randomUUID()
    await db.execute(c, `
      INSERT INTO ai_generations (id, userId, type, prompt, response, language, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      generationId, userId, 'seo', content, JSON.stringify(seoOptimization),
      language, new Date().toISOString()
    ])

    return c.json({
      success: true,
      data: {
        id: generationId,
        optimization: seoOptimization,
        quotaUsed: quotaCheck.quotaUsed + 1,
        quotaLimit: quotaCheck.quotaLimit
      }
    })

  } catch (error: any) {
    console.error('Optimize SEO error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to optimize SEO',
        code: 'OPTIMIZE_SEO_ERROR'
      }
    }, 500)
  }
})

// GET /generations - Get user's AI generation history
aiRoutes.get('/generations', async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId

  try {
    if (!userId) {
      return c.json({
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    const limit = parseInt(c.req.query('limit') || '20')
    const offset = parseInt(c.req.query('offset') || '0')

    const generations = await db.query(c, `
      SELECT id, type, prompt, response, language, createdAt
      FROM ai_generations 
      WHERE userId = ?
      ORDER BY createdAt DESC
      LIMIT ? OFFSET ?
    `, [userId, limit, offset])

    return c.json({
      success: true,
      data: generations
    })

  } catch (error: any) {
    console.error('Get generations error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to get generations',
        code: 'GET_GENERATIONS_ERROR'
      }
    }, 500)
  }
})

// GET /quota - Get user's AI quota status
aiRoutes.get('/quota', async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId

  try {
    if (!userId) {
      return c.json({
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    const user = await db.queryOne(c, `
      SELECT aiQuotaUsed, aiQuotaResetAt 
      FROM users 
      WHERE id = ?
    `, [userId])

    if (!user) {
      return c.json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      }, 404)
    }

    const quotaLimit = 100
    const quotaUsed = user.aiQuotaUsed || 0
    const resetAt = new Date(user.aiQuotaResetAt)

    return c.json({
      success: true,
      data: {
        quotaUsed,
        quotaLimit,
        remaining: quotaLimit - quotaUsed,
        resetAt: resetAt.toISOString(),
        percentage: Math.round((quotaUsed / quotaLimit) * 100)
      }
    })

  } catch (error: any) {
    console.error('Get quota error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to get quota',
        code: 'GET_QUOTA_ERROR'
      }
    }, 500)
  }
})

// POST /analyze/content - Analyze content for improvements
aiRoutes.post('/analyze/content', async (c) => {
  const { AI_API_KEY } = c.env as Bindings
  const userId = c.get('user')?.userId
  const { content, language = 'ENGLISH' } = await c.req.json()

  try {
    if (!userId) {
      return c.json({
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    if (!content) {
      return c.json({
        success: false,
        error: {
          message: 'Content is required',
          code: 'CONTENT_REQUIRED'
        }
      }, 400)
    }

    // Check AI quota
    const quotaCheck = await checkAIQuota(c, userId)
    if (!quotaCheck.allowed) {
      return c.json({
        success: false,
        error: {
          message: quotaCheck.reason,
          code: 'AI_QUOTA_EXCEEDED',
          quotaUsed: quotaCheck.quotaUsed,
          quotaLimit: quotaCheck.quotaLimit
        }
      }, 429)
    }

    // Analyze content (mock implementation)
    const analysis = {
      readability: {
        score: 75,
        level: language === 'URDU' ? 'آسان' : 'Easy',
        suggestions: [
          language === 'URDU' ? 'جملے کو مختصر کریں' : 'Shorten sentences',
          language === 'URDU' ? 'مشکل الفاظ کو آسان کریں' : 'Simplify complex words'
        ]
      },
      seo: {
        score: 80,
        suggestions: [
          language === 'URDU' ? 'کلیدی الفاظ شامل کریں' : 'Add keywords',
          language === 'URDU' ? 'ہیڈنگز شامل کریں' : 'Add headings'
        ]
      },
      engagement: {
        score: 70,
        suggestions: [
          language === 'URDU' ? 'سوالات شامل کریں' : 'Add questions',
          language === 'URDU' ? 'کال ٹو ایکشن شامل کریں' : 'Add call-to-action'
        ]
      },
      overall: {
        score: 75,
        grade: 'B',
        summary: language === 'URDU' ? 'اچھا مواد، کچھ بہتری کی گنجائش' : 'Good content with room for improvement'
      }
    }

    // Increment AI quota
    await incrementAIQuota(c, userId)

    // Store analysis
    const analysisId = crypto.randomUUID()
    await db.execute(c, `
      INSERT INTO ai_generations (id, userId, type, prompt, response, language, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      analysisId, userId, 'analysis', content, JSON.stringify(analysis),
      language, new Date().toISOString()
    ])

    return c.json({
      success: true,
      data: {
        id: analysisId,
        analysis,
        quotaUsed: quotaCheck.quotaUsed + 1,
        quotaLimit: quotaCheck.quotaLimit
      }
    })

  } catch (error: any) {
    console.error('Analyze content error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to analyze content',
        code: 'ANALYZE_CONTENT_ERROR'
      }
    }, 500)
  }
})

export { aiRoutes }