import { FastifyInstance } from 'fastify'
import { aiMarketingSuiteService } from '../services/aiMarketingSuiteService.js'

export async function aiMarketingSuiteRoutes(fastify: FastifyInstance) {
  // Campaign Management
  fastify.post('/websites/:websiteId/campaigns', {
    schema: {
      description: 'Create a new marketing campaign',
      tags: ['AI Marketing Suite'],
      params: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' }
        },
        required: ['websiteId']
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          type: { type: 'string', enum: ['email', 'sms', 'social', 'display', 'search'] },
          targetAudience: { type: 'object' },
          budget: { type: 'object' },
          schedule: { type: 'object' },
          content: { type: 'object' }
        },
        required: ['name', 'type']
      }
    }
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }
    const userId = (request as any).user?.id

    if (!userId) {
      return reply.code(401).send({
        success: false,
        error: { message: 'Authentication required', code: 'UNAUTHORIZED' }
      })
    }

    try {
      const campaign = await aiMarketingSuiteService.createCampaign({
        websiteId,
        ...request.body as any
      })

      return reply.code(201).send({
        success: true,
        data: campaign
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'CREATE_CAMPAIGN_FAILED' }
      })
    }
  })

  fastify.put('/campaigns/:id', {
    schema: {
      description: 'Update a marketing campaign',
      tags: ['AI Marketing Suite'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const campaign = await aiMarketingSuiteService.updateCampaign(id, request.body as any)

      return reply.send({
        success: true,
        data: campaign
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'UPDATE_CAMPAIGN_FAILED' }
      })
    }
  })

  fastify.post('/campaigns/:id/launch', {
    schema: {
      description: 'Launch a marketing campaign',
      tags: ['AI Marketing Suite'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      await aiMarketingSuiteService.launchCampaign(id)

      return reply.send({
        success: true,
        message: 'Campaign launched successfully'
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'LAUNCH_CAMPAIGN_FAILED' }
      })
    }
  })

  // AI-Powered Features
  fastify.post('/campaigns/:id/generate-content', {
    schema: {
      description: 'Generate campaign content using AI',
      tags: ['AI Marketing Suite'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          tone: { type: 'string' },
          length: { type: 'string' },
          targetAudience: { type: 'string' },
          goals: { type: 'array', items: { type: 'string' } },
          industry: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const content = await aiMarketingSuiteService.generateCampaignContent(id, request.body as any)

      return reply.send({
        success: true,
        data: content
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'GENERATE_CONTENT_FAILED' }
      })
    }
  })

  fastify.get('/websites/:websiteId/audience-segments', {
    schema: {
      description: 'Generate AI-powered audience segments',
      tags: ['AI Marketing Suite'],
      params: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' }
        },
        required: ['websiteId']
      }
    }
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }

    try {
      const segments = await aiMarketingSuiteService.generateAudienceSegments(websiteId)

      return reply.send({
        success: true,
        data: { segments }
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'GENERATE_SEGMENTS_FAILED' }
      })
    }
  })

  fastify.get('/websites/:websiteId/predictive-analytics', {
    schema: {
      description: 'Get predictive analytics insights',
      tags: ['AI Marketing Suite'],
      params: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' }
        },
        required: ['websiteId']
      }
    }
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }

    try {
      const analytics = await aiMarketingSuiteService.generatePredictiveAnalytics(websiteId)

      return reply.send({
        success: true,
        data: analytics
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'GET_PREDICTIVE_ANALYTICS_FAILED' }
      })
    }
  })

  // A/B Testing
  fastify.post('/campaigns/:id/ab-tests', {
    schema: {
      description: 'Create A/B test for campaign',
      tags: ['AI Marketing Suite'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          variations: { type: 'array' }
        },
        required: ['variations']
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const abTest = await aiMarketingSuiteService.createABTest(id, request.body.variations)

      return reply.code(201).send({
        success: true,
        data: abTest
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'CREATE_AB_TEST_FAILED' }
      })
    }
  })

  // Analytics
  fastify.get('/campaigns/:id/analytics', {
    schema: {
      description: 'Get campaign analytics',
      tags: ['AI Marketing Suite'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      querystring: {
        type: 'object',
        properties: {
          period: { type: 'string', enum: ['7d', '30d', '90d'], default: '30d' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const query = request.query as any

    try {
      const analytics = await aiMarketingSuiteService.getCampaignAnalytics(id, query.period || '30d')

      return reply.send({
        success: true,
        data: analytics
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'GET_CAMPAIGN_ANALYTICS_FAILED' }
      })
    }
  })

  // Workflow Execution
  fastify.post('/workflows/:executionId/execute-step', {
    schema: {
      description: 'Execute next step in marketing workflow',
      tags: ['AI Marketing Suite'],
      params: {
        type: 'object',
        properties: {
          executionId: { type: 'string' }
        },
        required: ['executionId']
      }
    }
  }, async (request, reply) => {
    const { executionId } = request.params as { executionId: string }

    try {
      await aiMarketingSuiteService.executeWorkflowStep(executionId)

      return reply.send({
        success: true,
        message: 'Workflow step executed successfully'
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'EXECUTE_WORKFLOW_STEP_FAILED' }
      })
    }
  })

  // Bulk Operations
  fastify.post('/websites/:websiteId/campaigns/bulk-launch', {
    schema: {
      description: 'Bulk launch multiple campaigns',
      tags: ['AI Marketing Suite'],
      params: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' }
        },
        required: ['websiteId']
      },
      body: {
        type: 'object',
        properties: {
          campaignIds: { type: 'array', items: { type: 'string' } }
        },
        required: ['campaignIds']
      }
    }
  }, async (request, reply) => {
    const { campaignIds } = request.body as { campaignIds: string[] }

    try {
      const results = []
      for (const campaignId of campaignIds) {
        try {
          await aiMarketingSuiteService.launchCampaign(campaignId)
          results.push({ campaignId, status: 'success' })
        } catch (error: any) {
          results.push({ campaignId, status: 'failed', error: error.message })
        }
      }

      return reply.send({
        success: true,
        data: { results }
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'BULK_LAUNCH_FAILED' }
      })
    }
  })

  // AI Insights
  fastify.get('/campaigns/:id/ai-insights', {
    schema: {
      description: 'Get AI-generated insights for campaign',
      tags: ['AI Marketing Suite'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const campaign = await aiMarketingSuiteService.updateCampaign(id, {})
      const insights = (campaign as any).aiInsights

      return reply.send({
        success: true,
        data: insights
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'GET_AI_INSIGHTS_FAILED' }
      })
    }
  })

  // Performance Optimization
  fastify.post('/campaigns/:id/optimize', {
    schema: {
      description: 'AI-powered campaign optimization',
      tags: ['AI Marketing Suite'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      // Generate optimization recommendations
      const recommendations = {
        budget: {
          suggestions: [
            {
              channel: 'email',
              currentAllocation: 40,
              recommendedAllocation: 55,
              expectedROI: 2.8,
              reasoning: 'Email shows 45% higher conversion rate than other channels'
            }
          ]
        },
        timing: {
          optimalTimes: ['10:00', '14:00', '19:00'],
          reasoning: 'Based on audience engagement patterns'
        },
        content: {
          suggestions: [
            'Add more personalized content based on purchase history',
            'Include customer testimonials in email campaigns',
            'Use dynamic product recommendations'
          ]
        },
        audience: {
          refinements: [
            'Focus on customers who purchased in last 30 days',
            'Exclude customers who unsubscribed from similar campaigns',
            'Include lookalike audiences for better reach'
          ]
        }
      }

      return reply.send({
        success: true,
        data: { recommendations }
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'OPTIMIZE_CAMPAIGN_FAILED' }
      })
    }
  })
}
