import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { authenticate } from '../middleware/auth'
import { AIService } from '../services/aiService'

// Validation schemas
const analyzeWebsiteSchema = z.object({
  websiteId: z.string().uuid(),
  url: z.string().url().optional()
})

const generateSitemapSchema = z.object({
  websiteId: z.string().uuid(),
  includeImages: z.boolean().optional().default(true),
  includeBlog: z.boolean().optional().default(true)
})

const keywordResearchSchema = z.object({
  keyword: z.string().min(1),
  language: z.enum(['ENGLISH', 'URDU', 'PUNJABI', 'SINDHI', 'PASHTO']).default('ENGLISH'),
  country: z.string().optional().default('PK'),
  maxResults: z.number().min(1).max(100).optional().default(20)
})

const updateMetaTagsSchema = z.object({
  websiteId: z.string().uuid(),
  pageId: z.string().uuid().optional(),
  metaTitle: z.string().max(60),
  metaDescription: z.string().max(160),
  metaKeywords: z.array(z.string()).max(10),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().url().optional(),
  twitterCard: z.enum(['summary', 'summary_large_image', 'app', 'player']).optional()
})

const socialMediaPostSchema = z.object({
  websiteId: z.string().uuid(),
  platform: z.enum(['facebook', 'twitter', 'instagram', 'linkedin', 'youtube']),
  content: z.string().min(1).max(280),
  scheduledAt: z.string().datetime().optional(),
  imageUrl: z.string().url().optional(),
  hashtags: z.array(z.string()).optional()
})

const seoAnalysisSchema = z.object({
  websiteId: z.string().uuid(),
  includeTechnical: z.boolean().optional().default(true),
  includeContent: z.boolean().optional().default(true),
  includeSocial: z.boolean().optional().default(true)
})

export async function seoRoutes(fastify: FastifyInstance) {
  const aiService = new AIService()

  // GET /api/v1/seo/analysis/:websiteId
  fastify.get('/analysis/:websiteId', {
    preHandler: [authenticate],
    schema: {
      description: 'Get comprehensive SEO analysis for a website',
      tags: ['SEO'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          websiteId: { type: 'string', format: 'uuid' }
        },
        required: ['websiteId']
      },
      querystring: {
        type: 'object',
        properties: {
          includeTechnical: { type: 'boolean', default: true },
          includeContent: { type: 'boolean', default: true },
          includeSocial: { type: 'boolean', default: true }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                overallScore: { type: 'number', example: 78 },
                technicalSEO: {
                  type: 'object',
                  properties: {
                    score: { type: 'number' },
                    issues: { type: 'array', items: { type: 'string' } },
                    recommendations: { type: 'array', items: { type: 'string' } }
                  }
                },
                contentSEO: {
                  type: 'object',
                  properties: {
                    score: { type: 'number' },
                    keywordDensity: { type: 'object' },
                    readabilityScore: { type: 'number' },
                    recommendations: { type: 'array', items: { type: 'string' } }
                  }
                },
                socialSEO: {
                  type: 'object',
                  properties: {
                    score: { type: 'number' },
                    socialSignals: { type: 'object' },
                    recommendations: { type: 'array', items: { type: 'string' } }
                  }
                }
              }
            }
          }
        },
        401: { $ref: 'Error' },
        404: { $ref: 'Error' }
      }
    }
  }, async (request: FastifyRequest<{ Params: { websiteId: string }, Querystring: any }>, reply: FastifyReply) => {
    try {
      const { websiteId } = request.params
      const { includeTechnical, includeContent, includeSocial } = request.query

      // Get website data
      const website = await fastify.prisma.website.findUnique({
        where: { id: websiteId },
        include: {
          pages: true,
          user: true
        }
      })

      if (!website) {
        return reply.status(404).send({ success: false, error: 'Website not found' })
      }

      // Perform SEO analysis
      const analysis = await performSEOAnalysis(website, { includeTechnical, includeContent, includeSocial })

      reply.send({
        success: true,
        data: analysis
      })
    } catch (error) {
      fastify.log.error(error)
      reply.status(500).send({ success: false, error: 'Failed to analyze SEO' })
    }
  })

  // POST /api/v1/seo/analyze-website
  fastify.post('/analyze-website', {
    preHandler: [authenticate],
    schema: {
      description: 'Analyze a website for SEO issues',
      tags: ['SEO'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['websiteId'],
        properties: {
          websiteId: { type: 'string', format: 'uuid' },
          url: { type: 'string', format: 'uri' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                issues: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      type: { type: 'string', enum: ['error', 'warning', 'info'] },
                      message: { type: 'string' },
                      priority: { type: 'string', enum: ['high', 'medium', 'low'] },
                      fix: { type: 'string' }
                    }
                  }
                },
                score: { type: 'number', example: 78 },
                recommendations: { type: 'array', items: { type: 'string' } }
              }
            }
          }
        },
        401: { $ref: 'Error' }
      }
    }
  }, async (request: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
    try {
      const data = analyzeWebsiteSchema.parse(request.body)
      
      // Simulate website analysis
      const analysis = await analyzeWebsiteSEO(data.websiteId, data.url)

      reply.send({
        success: true,
        data: analysis
      })
    } catch (error) {
      fastify.log.error(error)
      reply.status(500).send({ success: false, error: 'Failed to analyze website' })
    }
  })

  // POST /api/v1/seo/generate-sitemap
  fastify.post('/generate-sitemap', {
    preHandler: [authenticate],
    schema: {
      description: 'Generate XML sitemap for a website',
      tags: ['SEO'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['websiteId'],
        properties: {
          websiteId: { type: 'string', format: 'uuid' },
          includeImages: { type: 'boolean', default: true },
          includeBlog: { type: 'boolean', default: true }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                sitemapUrl: { type: 'string' },
                pages: { type: 'number' },
                lastModified: { type: 'string', format: 'date-time' },
                urls: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      url: { type: 'string' },
                      priority: { type: 'number' },
                      changefreq: { type: 'string' },
                      lastmod: { type: 'string', format: 'date-time' }
                    }
                  }
                }
              }
            }
          }
        },
        401: { $ref: 'Error' }
      }
    }
  }, async (request: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
    try {
      const data = generateSitemapSchema.parse(request.body)
      
      const sitemap = await generateSitemap(data.websiteId, data.includeImages, data.includeBlog)

      reply.send({
        success: true,
        data: sitemap
      })
    } catch (error) {
      fastify.log.error(error)
      reply.status(500).send({ success: false, error: 'Failed to generate sitemap' })
    }
  })

  // POST /api/v1/seo/keyword-research
  fastify.post('/keyword-research', {
    preHandler: [authenticate],
    schema: {
      description: 'Research keywords for SEO',
      tags: ['SEO'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['keyword'],
        properties: {
          keyword: { type: 'string', minLength: 1 },
          language: { type: 'string', enum: ['ENGLISH', 'URDU', 'PUNJABI', 'SINDHI', 'PASHTO'], default: 'ENGLISH' },
          country: { type: 'string', default: 'PK' },
          maxResults: { type: 'number', minimum: 1, maximum: 100, default: 20 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                keywords: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      keyword: { type: 'string' },
                      volume: { type: 'number' },
                      difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
                      cpc: { type: 'number' },
                      competition: { type: 'string' }
                    }
                  }
                },
                suggestions: { type: 'array', items: { type: 'string' } }
              }
            }
          }
        },
        401: { $ref: 'Error' }
      }
    }
  }, async (request: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
    try {
      const data = keywordResearchSchema.parse(request.body)
      
      const keywords = await researchKeywords(data.keyword, data.language, data.country, data.maxResults)

      reply.send({
        success: true,
        data: keywords
      })
    } catch (error) {
      fastify.log.error(error)
      reply.status(500).send({ success: false, error: 'Failed to research keywords' })
    }
  })

  // PUT /api/v1/seo/meta-tags
  fastify.put('/meta-tags', {
    preHandler: [authenticate],
    schema: {
      description: 'Update meta tags for a website or page',
      tags: ['SEO'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['websiteId', 'metaTitle', 'metaDescription', 'metaKeywords'],
        properties: {
          websiteId: { type: 'string', format: 'uuid' },
          pageId: { type: 'string', format: 'uuid' },
          metaTitle: { type: 'string', maxLength: 60 },
          metaDescription: { type: 'string', maxLength: 160 },
          metaKeywords: { type: 'array', items: { type: 'string' }, maxItems: 10 },
          ogTitle: { type: 'string' },
          ogDescription: { type: 'string' },
          ogImage: { type: 'string', format: 'uri' },
          twitterCard: { type: 'string', enum: ['summary', 'summary_large_image', 'app', 'player'] }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                metaTags: { type: 'object' },
                preview: { type: 'object' }
              }
            }
          }
        },
        401: { $ref: 'Error' }
      }
    }
  }, async (request: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
    try {
      const data = updateMetaTagsSchema.parse(request.body)
      
      const result = await updateMetaTags(data)

      reply.send({
        success: true,
        data: result
      })
    } catch (error) {
      fastify.log.error(error)
      reply.status(500).send({ success: false, error: 'Failed to update meta tags' })
    }
  })

  // POST /api/v1/seo/social-media-post
  fastify.post('/social-media-post', {
    preHandler: [authenticate],
    schema: {
      description: 'Schedule a social media post',
      tags: ['SEO'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['websiteId', 'platform', 'content'],
        properties: {
          websiteId: { type: 'string', format: 'uuid' },
          platform: { type: 'string', enum: ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'] },
          content: { type: 'string', minLength: 1, maxLength: 280 },
          scheduledAt: { type: 'string', format: 'date-time' },
          imageUrl: { type: 'string', format: 'uri' },
          hashtags: { type: 'array', items: { type: 'string' } }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                postId: { type: 'string' },
                status: { type: 'string', enum: ['scheduled', 'published', 'failed'] },
                scheduledAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        401: { $ref: 'Error' }
      }
    }
  }, async (request: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
    try {
      const data = socialMediaPostSchema.parse(request.body)
      
      const post = await scheduleSocialMediaPost(data)

      reply.send({
        success: true,
        data: post
      })
    } catch (error) {
      fastify.log.error(error)
      reply.status(500).send({ success: false, error: 'Failed to schedule social media post' })
    }
  })

  // GET /api/v1/seo/social-media-posts/:websiteId
  fastify.get('/social-media-posts/:websiteId', {
    preHandler: [authenticate],
    schema: {
      description: 'Get scheduled social media posts for a website',
      tags: ['SEO'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          websiteId: { type: 'string', format: 'uuid' }
        },
        required: ['websiteId']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  platform: { type: 'string' },
                  content: { type: 'string' },
                  scheduledAt: { type: 'string', format: 'date-time' },
                  status: { type: 'string', enum: ['scheduled', 'published', 'failed'] }
                }
              }
            }
          }
        },
        401: { $ref: 'Error' }
      }
    }
  }, async (request: FastifyRequest<{ Params: { websiteId: string } }>, reply: FastifyReply) => {
    try {
      const { websiteId } = request.params
      
      const posts = await getSocialMediaPosts(websiteId)

      reply.send({
        success: true,
        data: posts
      })
    } catch (error) {
      fastify.log.error(error)
      reply.status(500).send({ success: false, error: 'Failed to get social media posts' })
    }
  })
}

// Helper functions
async function performSEOAnalysis(website: any, options: any) {
  // Simulate comprehensive SEO analysis
  return {
    overallScore: Math.floor(Math.random() * 30) + 70,
    technicalSEO: {
      score: Math.floor(Math.random() * 30) + 70,
      issues: [
        'Missing alt text on images',
        'Slow page load time',
        'Missing meta description'
      ],
      recommendations: [
        'Add alt text to all images',
        'Optimize images for web',
        'Enable compression'
      ]
    },
    contentSEO: {
      score: Math.floor(Math.random() * 30) + 70,
      keywordDensity: { 'website builder': 2.3, 'pakistan': 1.8 },
      readabilityScore: Math.floor(Math.random() * 30) + 70,
      recommendations: [
        'Add more internal links',
        'Improve heading structure',
        'Optimize keyword density'
      ]
    },
    socialSEO: {
      score: Math.floor(Math.random() * 30) + 70,
      socialSignals: { shares: 45, likes: 123, comments: 12 },
      recommendations: [
        'Add social sharing buttons',
        'Create engaging social content',
        'Optimize Open Graph tags'
      ]
    }
  }
}

async function analyzeWebsiteSEO(websiteId: string, url?: string) {
  // Simulate website SEO analysis
  return {
    issues: [
      {
        type: 'warning',
        message: 'Meta description too long (165 characters)',
        priority: 'medium',
        fix: 'Shorten meta description to 160 characters or less'
      },
      {
        type: 'error',
        message: 'Missing alt text on 3 images',
        priority: 'high',
        fix: 'Add descriptive alt text to all images'
      },
      {
        type: 'info',
        message: 'Consider adding more internal links',
        priority: 'low',
        fix: 'Add relevant internal links to improve page authority'
      }
    ],
    score: Math.floor(Math.random() * 30) + 70,
    recommendations: [
      'Optimize page load speed',
      'Add structured data markup',
      'Improve mobile responsiveness',
      'Create XML sitemap'
    ]
  }
}

async function generateSitemap(websiteId: string, includeImages: boolean, includeBlog: boolean) {
  // Simulate sitemap generation
  const urls = [
    {
      url: '/',
      priority: 1.0,
      changefreq: 'daily',
      lastmod: new Date().toISOString()
    },
    {
      url: '/about',
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: new Date().toISOString()
    },
    {
      url: '/services',
      priority: 0.9,
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
    }
  ]

  if (includeBlog) {
    urls.push({
      url: '/blog',
      priority: 0.8,
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
    })
  }

  return {
    sitemapUrl: `https://yourplatform.com/sitemaps/${websiteId}.xml`,
    pages: urls.length,
    lastModified: new Date().toISOString(),
    urls
  }
}

async function researchKeywords(keyword: string, language: string, country: string, maxResults: number) {
  // Simulate keyword research
  const keywords = [
    {
      keyword: `${keyword} pakistan`,
      volume: Math.floor(Math.random() * 1000) + 100,
      difficulty: 'medium',
      cpc: Math.random() * 3 + 1,
      competition: 'medium'
    },
    {
      keyword: `best ${keyword}`,
      volume: Math.floor(Math.random() * 2000) + 500,
      difficulty: 'hard',
      cpc: Math.random() * 5 + 2,
      competition: 'high'
    },
    {
      keyword: `${keyword} guide`,
      volume: Math.floor(Math.random() * 800) + 200,
      difficulty: 'easy',
      cpc: Math.random() * 2 + 0.5,
      competition: 'low'
    }
  ]

  return {
    keywords: keywords.slice(0, maxResults),
    suggestions: [
      'Focus on long-tail keywords for better ranking',
      'Target local keywords for Pakistani market',
      'Consider Urdu keywords for local audience'
    ]
  }
}

async function updateMetaTags(data: any) {
  // Simulate meta tags update
  return {
    metaTags: {
      title: data.metaTitle,
      description: data.metaDescription,
      keywords: data.metaKeywords,
      ogTitle: data.ogTitle || data.metaTitle,
      ogDescription: data.ogDescription || data.metaDescription,
      ogImage: data.ogImage,
      twitterCard: data.twitterCard || 'summary'
    },
    preview: {
      titleLength: data.metaTitle.length,
      descriptionLength: data.metaDescription.length,
      isValid: data.metaTitle.length <= 60 && data.metaDescription.length <= 160
    }
  }
}

async function scheduleSocialMediaPost(data: any) {
  // Simulate social media post scheduling
  return {
    postId: `post_${Date.now()}`,
    status: 'scheduled',
    scheduledAt: data.scheduledAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }
}

async function getSocialMediaPosts(websiteId: string) {
  // Simulate getting social media posts
  return [
    {
      id: 'post_1',
      platform: 'facebook',
      content: '🚀 Just launched my new website! Built with Pakistan Website Builder - so easy to use!',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled'
    },
    {
      id: 'post_2',
      platform: 'twitter',
      content: 'Check out my new portfolio website! #WebDesign #Pakistan',
      scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled'
    }
  ]
}
