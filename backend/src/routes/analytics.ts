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
    preHandler: [authenticate, requireOwnership('website')],
    schema: {
      description: 'Create analytics data for a website',
      tags: ['Analytics'],
      params: z.object({ websiteId: z.string() }),
      body: z.object({
        data: analyticsDataSchema,
        period: z.enum(['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
        date: z.string().datetime(),
      }),
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }
    const { data, period, date } = request.body as any
    const analytics = await analyticsService.createAnalytics(websiteId, data, period, new Date(date))
    reply.send({ success: true, data: analytics })
  })

  // GET /api/v1/analytics/:websiteId
  fastify.get('/:websiteId', {
    preHandler: [authenticate, requireOwnership('website')],
    schema: {
      description: 'Get analytics data for a website',
      tags: ['Analytics'],
      params: z.object({ websiteId: z.string() }),
      querystring: z.object({
        period: z.enum(['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).default('DAILY'),
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
      }),
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }
    const { period, startDate, endDate } = request.query as any
    const analytics = await analyticsService.getAnalytics(websiteId, period, new Date(startDate), new Date(endDate))
    reply.send({ success: true, data: analytics })
  })

  // GET /api/v1/analytics/:websiteId/insights
  fastify.get('/:websiteId/insights', {
    preHandler: [authenticate, requireOwnership('website')],
    schema: {
      description: 'Get predictive insights for a website',
      tags: ['Analytics'],
      params: z.object({ websiteId: z.string() }),
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }
    const insights = await analyticsService.getPredictiveInsights(websiteId)
    reply.send({ success: true, data: insights })
  })
}
