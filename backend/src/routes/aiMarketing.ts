import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { AIMarketingService } from '@/services/aiMarketingService'
import { authenticate } from '@/middleware/auth'
import { CampaignType, CampaignStatus, CampaignChannel } from '@prisma/client'

// Validation schemas
const createCampaignSchema = z.object({
  websiteId: z.string().uuid(),
  name: z.string().min(1).max(100),
  type: z.enum(['EMAIL', 'SMS', 'SOCIAL', 'PUSH', 'RETARGETING', 'AB_TEST']),
  description: z.string().max(500).optional(),
  channel: z.enum(['EMAIL', 'SMS', 'FACEBOOK', 'INSTAGRAM', 'TWITTER', 'LINKEDIN', 'PUSH_NOTIFICATION']).optional(),
  targetAudience: z.string().optional(),
  budget: z.number().min(0).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  goals: z.string().optional(),
  metrics: z.string().optional(),
  useAI: z.boolean().default(false) // Cost control flag
})

const updateCampaignSchema = createCampaignSchema.partial().extend({
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED']).optional()
})

const generateInsightsSchema = z.object({
  useAI: z.boolean().default(false),
  campaignId: z.string().uuid()
})

const audienceSegmentsSchema = z.object({
  websiteId: z.string().uuid()
})

const predictiveAnalyticsSchema = z.object({
  websiteId: z.string().uuid()
})

const abTestSchema = z.object({
  campaignId: z.string().uuid(),
  variations: z.array(z.object({
    name: z.string().min(1),
    content: z.string().min(1)
  })).min(2)
})

const analyticsSchema = z.object({
  campaignId: z.string().uuid(),
  period: z.enum(['7d', '30d', '90d']).default('30d')
})

export async function aiMarketingRoutes(fastify: FastifyInstance) {
  const aiMarketingService = new AIMarketingService()

  // POST /api/v1/ai-marketing/campaigns - Create a new campaign
  fastify.post('/campaigns', {
    preHandler: [authenticate],
    schema: {
      description: 'Create a new AI-powered marketing campaign',
      tags: ['AI Marketing'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['websiteId', 'name', 'type'],
        properties: {
          websiteId: { type: 'string', format: 'uuid' },
          name: { type: 'string', minLength: 1, maxLength: 100 },
          type: { type: 'string', enum: ['EMAIL', 'SMS', 'SOCIAL', 'PUSH', 'RETARGETING', 'AB_TEST'] },
          description: { type: 'string', maxLength: 500 },
          channel: { type: 'string', enum: ['EMAIL', 'SMS', 'FACEBOOK', 'INSTAGRAM', 'TWITTER', 'LINKEDIN', 'PUSH_NOTIFICATION'] },
          targetAudience: { type: 'string' },
          budget: { type: 'number', minimum: 0 },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          goals: { type: 'string' },
          metrics: { type: 'string' },
          useAI: { type: 'boolean', default: false }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const validatedData = createCampaignSchema.parse(request.body)
      const userId = (request as any).user.id

      // Check AI quota if AI features are requested
      if (validatedData.useAI) {
        const quota = await aiMarketingService.getUserQuota(userId)
        if (quota.used >= quota.monthlyLimit) {
          return reply.status(429).send({
            success: false,
            error: {
              message: 'AI quota exceeded. Upgrade your plan or wait for quota reset.',
              code: 'AI_QUOTA_EXCEEDED',
              quota: {
                used: quota.used,
                limit: quota.monthlyLimit,
                resetDate: quota.resetDate,
                tier: quota.tier
              },
              timestamp: new Date().toISOString()
            }
          })
        }
      }

      const campaign = await aiMarketingService.createCampaign(validatedData as any)

      return reply.status(201).send({
        success: true,
        data: { campaign },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Create campaign error:', error)
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: {
            message: 'Validation error',
            code: 'VALIDATION_ERROR',
            details: error.errors,
            timestamp: new Date().toISOString()
          }
        })
      }
      
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to create campaign',
          code: 'CAMPAIGN_CREATION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // PUT /api/v1/ai-marketing/campaigns/:id - Update campaign
  fastify.put('/campaigns/:id', {
    preHandler: [authenticate],
    schema: {
      description: 'Update an existing marketing campaign',
      tags: ['AI Marketing'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          description: { type: 'string', maxLength: 500 },
          type: { type: 'string', enum: ['EMAIL', 'SMS', 'SOCIAL', 'PUSH', 'RETARGETING', 'AB_TEST'] },
          status: { type: 'string', enum: ['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'] },
          channel: { type: 'string', enum: ['EMAIL', 'SMS', 'FACEBOOK', 'INSTAGRAM', 'TWITTER', 'LINKEDIN', 'PUSH_NOTIFICATION'] },
          targetAudience: { type: 'string' },
          budget: { type: 'number', minimum: 0 },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          goals: { type: 'string' },
          metrics: { type: 'string' },
          useAI: { type: 'boolean' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const validatedData = updateCampaignSchema.parse(request.body)

      const campaign = await aiMarketingService.updateCampaign(id, validatedData as any)

      return reply.send({
        success: true,
        data: { campaign },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Update campaign error:', error)
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: {
            message: 'Validation error',
            code: 'VALIDATION_ERROR',
            details: error.errors,
            timestamp: new Date().toISOString()
          }
        })
      }
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to update campaign',
          code: 'CAMPAIGN_UPDATE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/ai-marketing/campaigns/:id/insights - Get campaign insights
  fastify.get('/campaigns/:id/insights', {
    preHandler: [authenticate],
    schema: {
      description: 'Get AI-powered insights for a campaign',
      tags: ['AI Marketing'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      },
      querystring: {
        type: 'object',
        properties: {
          useAI: { type: 'boolean', default: false }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const { useAI } = request.query as { useAI: boolean }
      const userId = (request as any).user.id

      const insights = await aiMarketingService.generateInsights(id, userId, useAI)

      return reply.send({
        success: true,
        data: { 
          insights,
          aiEnabled: useAI,
          cost: insights.reduce((sum, insight) => sum + ((insight.cost as number) || 0), 0)
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get insights error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to generate insights',
          code: 'INSIGHTS_GENERATION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/ai-marketing/websites/:id/audience-segments - Get audience segments
  fastify.get('/websites/:id/audience-segments', {
    preHandler: [authenticate],
    schema: {
      description: 'Get AI-powered audience segments for a website',
      tags: ['AI Marketing'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const segments = await aiMarketingService.generateAudienceSegments(id)

      return reply.send({
        success: true,
        data: { 
          segments,
          cost: 0 // Always free
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get audience segments error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to generate audience segments',
          code: 'SEGMENTS_GENERATION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/ai-marketing/websites/:id/predictive-analytics - Get predictive analytics
  fastify.get('/websites/:id/predictive-analytics', {
    preHandler: [authenticate],
    schema: {
      description: 'Get predictive analytics for a website',
      tags: ['AI Marketing'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const analytics = await aiMarketingService.generatePredictiveAnalytics(id)

      return reply.send({
        success: true,
        data: { 
          analytics,
          cost: 0 // Always free
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get predictive analytics error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to generate predictive analytics',
          code: 'ANALYTICS_GENERATION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/ai-marketing/campaigns/:id/ab-test - Create A/B test
  fastify.post('/campaigns/:id/ab-test', {
    preHandler: [authenticate],
    schema: {
      description: 'Create an A/B test for a campaign',
      tags: ['AI Marketing'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      },
      body: {
        type: 'object',
        required: ['variations'],
        properties: {
          variations: {
            type: 'array',
            minItems: 2,
            items: {
              type: 'object',
              required: ['name', 'content'],
              properties: {
                name: { type: 'string', minLength: 1 },
                content: { type: 'string', minLength: 1 }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const { variations } = request.body as { variations: Array<{ name: string; content: string }> }
      
      const abTest = await aiMarketingService.createABTest(id, variations)

      return reply.status(201).send({
        success: true,
        data: { 
          abTest,
          cost: 0 // Always free
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Create A/B test error:', error)
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: {
            message: 'Validation error',
            code: 'VALIDATION_ERROR',
            details: error.errors,
            timestamp: new Date().toISOString()
          }
        })
      }
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to create A/B test',
          code: 'AB_TEST_CREATION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/ai-marketing/campaigns/:id/analytics - Get campaign analytics
  fastify.get('/campaigns/:id/analytics', {
    preHandler: [authenticate],
    schema: {
      description: 'Get detailed analytics for a campaign',
      tags: ['AI Marketing'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      },
      querystring: {
        type: 'object',
        properties: {
          period: { type: 'string', enum: ['7d', '30d', '90d'], default: '30d' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const { period } = request.query as { period: '7d' | '30d' | '90d' }
      
      const analytics = await aiMarketingService.getCampaignAnalytics(id, period)

      return reply.send({
        success: true,
        data: { 
          analytics,
          cost: 0 // Always free
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get campaign analytics error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve campaign analytics',
          code: 'ANALYTICS_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/ai-marketing/quota - Get user AI quota
  fastify.get('/quota', {
    preHandler: [authenticate],
    schema: {
      description: 'Get user AI quota information',
      tags: ['AI Marketing'],
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    try {
      const userId = (request as any).user.id
      const quota = await aiMarketingService.getUserQuota(userId)

      return reply.send({
        success: true,
        data: { quota },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get quota error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve quota information',
          code: 'QUOTA_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/ai-marketing/campaigns - List campaigns
  fastify.get('/campaigns', {
    preHandler: [authenticate],
    schema: {
      description: 'List all marketing campaigns',
      tags: ['AI Marketing'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          websiteId: { type: 'string', format: 'uuid' },
          status: { type: 'string', enum: ['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'] },
          page: { type: 'number', default: 1 },
          limit: { type: 'number', default: 20 }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const query = request.query as any
      const { page, limit, ...filters } = query
      
      const campaigns = await aiMarketingService.findAll({
        ...filters,
        skip: (page - 1) * limit,
        take: limit
      })

      return reply.send({
        success: true,
        data: { 
          campaigns,
          pagination: {
            page,
            limit,
            total: campaigns.length
          }
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('List campaigns error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve campaigns',
          code: 'CAMPAIGNS_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // DELETE /api/v1/ai-marketing/campaigns/:id - Delete campaign
  fastify.delete('/campaigns/:id', {
    preHandler: [authenticate],
    schema: {
      description: 'Delete a marketing campaign',
      tags: ['AI Marketing'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const deleted = await aiMarketingService.delete(id)

      return reply.send({
        success: true,
        data: { deleted },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Delete campaign error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to delete campaign',
          code: 'CAMPAIGN_DELETION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })
}
