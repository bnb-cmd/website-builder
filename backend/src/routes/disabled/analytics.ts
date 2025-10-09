import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { AnalyticsService } from '@/services/analyticsService'
import { authenticate, requireOwnership } from '@/middleware/auth'

const analyticsDataSchema = z.object({
  pageViews: z.number().min(0),
  uniqueVisitors: z.number().min(0),
  bounceRate: z.number().min(0).max(1),
  avgSessionDuration: z.number().min(0),
  conversionRate: z.number().min(0).max(1),
  revenue: z.number().min(0),
  orders: z.number().min(0),
  avgOrderValue: z.number().min(0),
  organicTraffic: z.number().min(0),
  socialTraffic: z.number().min(0),
  directTraffic: z.number().min(0),
  referralTraffic: z.number().min(0),
  mobileTraffic: z.number().min(0),
  desktopTraffic: z.number().min(0),
  tabletTraffic: z.number().min(0),
  topCountries: z.record(z.string(), z.number()),
  topCities: z.record(z.string(), z.number()),
  pageLoadTime: z.number().min(0),
  coreWebVitals: z.object({
    lcp: z.number(),
    fid: z.number(),
    cls: z.number(),
  }),
})

export async function analyticsRoutes(fastify: FastifyInstance) {
  const analyticsService = new AnalyticsService()

  // POST /api/v1/analytics/:websiteId
  fastify.post('/:websiteId', {
    preHandler: [authenticate, requireOwnership('websiteId')],
    schema: {
      params: {
        type: 'object',
        required: ['websiteId'],
        properties: {
          websiteId: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        required: ['data','period','date'],
        properties: {
          data: {
            type: 'object',
            properties: {
              pageViews: { type: 'number', minimum: 0 },
              uniqueVisitors: { type: 'number', minimum: 0 },
              bounceRate: { type: 'number', minimum: 0, maximum: 1 },
              avgSessionDuration: { type: 'number', minimum: 0 },
              conversionRate: { type: 'number', minimum: 0, maximum: 1 },
              revenue: { type: 'number', minimum: 0 },
              orders: { type: 'number', minimum: 0 },
              avgOrderValue: { type: 'number', minimum: 0 },
              organicTraffic: { type: 'number', minimum: 0 },
              socialTraffic: { type: 'number', minimum: 0 },
              directTraffic: { type: 'number', minimum: 0 },
              referralTraffic: { type: 'number', minimum: 0 },
              mobileTraffic: { type: 'number', minimum: 0 },
              desktopTraffic: { type: 'number', minimum: 0 },
              tabletTraffic: { type: 'number', minimum: 0 },
              topCountries: { type: 'object', additionalProperties: { type: 'number' } },
              topCities: { type: 'object', additionalProperties: { type: 'number' } },
              pageLoadTime: { type: 'number', minimum: 0 },
              coreWebVitals: {
                type: 'object',
                required: ['lcp','fid','cls'],
                properties: {
                  lcp: { type: 'number' },
                  fid: { type: 'number' },
                  cls: { type: 'number' }
                }
              }
            },
            additionalProperties: false
          },
          period: { type: 'string', enum: ['HOURLY','DAILY','WEEKLY','MONTHLY','YEARLY'] },
          date: { type: 'string' }
        },
        additionalProperties: false
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }
    const { data, period, date } = request.body as any
    const analytics = await analyticsService.createAnalytics(websiteId, data, period, new Date(date))
    reply.send({ success: true, data: analytics })
  })

  // GET /api/v1/analytics/:websiteId
  fastify.get('/:websiteId', {
    preHandler: [authenticate, requireOwnership('websiteId')],
    schema: {
      params: {
        type: 'object',
        required: ['websiteId'],
        properties: {
          websiteId: { type: 'string' }
        }
      },
      querystring: {
        type: 'object',
        required: ['startDate','endDate'],
        properties: {
          period: { type: 'string', enum: ['HOURLY','DAILY','WEEKLY','MONTHLY','YEARLY'], default: 'DAILY' },
          startDate: { type: 'string' },
          endDate: { type: 'string' }
        },
        additionalProperties: false
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }
    const { period, startDate, endDate } = request.query as any
    const analytics = await analyticsService.getAnalytics(websiteId, period, new Date(startDate), new Date(endDate))
    reply.send({ success: true, data: analytics })
  })

  // GET /api/v1/analytics/:websiteId/insights
  fastify.get('/:websiteId/insights', {
    preHandler: [authenticate, requireOwnership('websiteId')],
    schema: {
      params: {
        type: 'object',
        required: ['websiteId'],
        properties: {
          websiteId: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }
    const insights = await analyticsService.getPredictiveInsights(websiteId)
    reply.send({ success: true, data: insights })
  })
}
