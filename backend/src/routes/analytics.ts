import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { AnalyticsService } from '@/services/analyticsService'
import { authenticate, requireOwnership } from '@/middleware/auth'

// Validation schemas
const createAnalyticsSchema = z.object({
  visitors: z.number().min(0),
  pageViews: z.number().min(0),
  bounceRate: z.number().min(0).max(1).optional(),
  avgSessionDuration: z.number().min(0).optional(),
  conversionRate: z.number().min(0).max(1).optional(),
  revenue: z.number().min(0).optional(),
  orders: z.number().min(0).optional(),
  avgOrderValue: z.number().min(0).optional(),
  organicTraffic: z.number().min(0).optional(),
  socialTraffic: z.number().min(0).optional(),
  directTraffic: z.number().min(0).optional(),
  referralTraffic: z.number().min(0).optional(),
  mobileTraffic: z.number().min(0).optional(),
  desktopTraffic: z.number().min(0).optional(),
  tabletTraffic: z.number().min(0).optional(),
  topCountries: z.record(z.string(), z.number()).optional(),
  topCities: z.record(z.string(), z.number()).optional(),
  pageLoadTime: z.number().min(0).optional(),
  coreWebVitals: z.object({
    lcp: z.number().min(0),
    fid: z.number().min(0),
    cls: z.number().min(0)
  }).optional(),
  topPages: z.array(z.object({
    path: z.string(),
    views: z.number().min(0),
    uniqueViews: z.number().min(0)
  })).optional(),
  referrers: z.array(z.object({
    domain: z.string(),
    visits: z.number().min(0)
  })).optional(),
  devices: z.object({
    mobile: z.number().min(0),
    desktop: z.number().min(0),
    tablet: z.number().min(0)
  }).optional(),
  browsers: z.record(z.string(), z.number()).optional(),
  operatingSystems: z.record(z.string(), z.number()).optional(),
  screenResolutions: z.record(z.string(), z.number()).optional(),
  timeOnSite: z.number().min(0).optional(),
  exitRate: z.number().min(0).max(1).optional(),
  newVisitors: z.number().min(0).optional(),
  returningVisitors: z.number().min(0).optional()
})

const updateAnalyticsSchema = createAnalyticsSchema.partial()

const querySchema = z.object({
  startDate: z.string().transform(str => new Date(str)).optional(),
  endDate: z.string().transform(str => new Date(str)).optional(),
  period: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).default('DAILY'),
  days: z.string().transform(Number).default('30')
})

export async function analyticsRoutes(fastify: FastifyInstance) {
  const analyticsService = new AnalyticsService()

  // POST /api/v1/analytics/:websiteId - Create analytics record
  fastify.post('/:websiteId', {
    schema: {
      description: 'Create analytics record for website',
      tags: ['Analytics'],
      params: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' }
        },
        required: ['websiteId']
      },
      body: {
        type: 'object',
        required: ['visitors', 'pageViews'],
        properties: {
          visitors: { type: 'number', minimum: 0 },
          pageViews: { type: 'number', minimum: 0 },
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
          topCountries: { type: 'object' },
          topCities: { type: 'object' },
          pageLoadTime: { type: 'number', minimum: 0 },
          coreWebVitals: {
            type: 'object',
            properties: {
              lcp: { type: 'number', minimum: 0 },
              fid: { type: 'number', minimum: 0 },
              cls: { type: 'number', minimum: 0 }
            }
          },
          topPages: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                path: { type: 'string' },
                views: { type: 'number', minimum: 0 },
                uniqueViews: { type: 'number', minimum: 0 }
              }
            }
          },
          referrers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                domain: { type: 'string' },
                visits: { type: 'number', minimum: 0 }
              }
            }
          },
          devices: {
            type: 'object',
            properties: {
              mobile: { type: 'number', minimum: 0 },
              desktop: { type: 'number', minimum: 0 },
              tablet: { type: 'number', minimum: 0 }
            }
          },
          browsers: { type: 'object' },
          operatingSystems: { type: 'object' },
          screenResolutions: { type: 'object' },
          timeOnSite: { type: 'number', minimum: 0 },
          exitRate: { type: 'number', minimum: 0, maximum: 1 },
          newVisitors: { type: 'number', minimum: 0 },
          returningVisitors: { type: 'number', minimum: 0 }
        }
      }
    },
    preHandler: authenticate
  }, async (request, reply) => {
    try {
      const { websiteId } = request.params as { websiteId: string }
      const validatedData = request.body as any
      
      // Ensure required fields are present
      if (validatedData.visitors === undefined || validatedData.pageViews === undefined) {
        return reply.status(400).send({
          success: false,
          error: {
            message: 'visitors and pageViews are required',
            code: 'VALIDATION_ERROR',
            timestamp: new Date().toISOString()
          }
        })
      }
      
      const analytics = await analyticsService.createAnalytics(websiteId, validatedData as any)

      return reply.status(201).send({
        success: true,
        data: { analytics },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Create analytics error:', error)
      
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to create analytics record',
          code: 'CREATE_ANALYTICS_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/analytics/:websiteId - Get analytics for website
  fastify.get('/:websiteId', {
    schema: {
      description: 'Get analytics data for website',
      tags: ['Analytics'],
      params: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' }
        },
        required: ['websiteId']
      },
      querystring: {
        type: 'object',
        properties: {
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' },
          period: { type: 'string', enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] }
        }
      }
    },
    preHandler: authenticate
  }, async (request, reply) => {
    try {
      const { websiteId } = request.params as { websiteId: string }
      const query = request.query as any
      
      const analytics = await analyticsService.getWebsiteAnalytics(websiteId, {
        websiteId,
        startDate: query.startDate,
        endDate: query.endDate,
        period: query.period
      })

      return reply.send({
        success: true,
        data: { analytics },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get analytics error:', error)
      
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to fetch analytics',
          code: 'FETCH_ANALYTICS_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/analytics/:websiteId/summary - Get analytics summary
  fastify.get('/:websiteId/summary', {
    schema: {
      description: 'Get analytics summary for website',
      tags: ['Analytics'],
      params: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' }
        },
        required: ['websiteId']
      },
      querystring: {
        type: 'object',
        properties: {
          period: { type: 'string', enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'], default: 'DAILY' },
          days: { type: 'number', default: 30 }
        }
      }
    },
    preHandler: authenticate
  }, async (request, reply) => {
    try {
      const { websiteId } = request.params as { websiteId: string }
      const query = request.query as any
      
      const summary = await analyticsService.getAnalyticsSummary(
        websiteId, 
        query.period, 
        query.days
      )

      return reply.send({
        success: true,
        data: { summary },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get analytics summary error:', error)
      
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to fetch analytics summary',
          code: 'FETCH_SUMMARY_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/analytics/:websiteId/trends - Get analytics trends
  fastify.get('/:websiteId/trends', {
    schema: {
      description: 'Get analytics trends for website',
      tags: ['Analytics'],
      params: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' }
        },
        required: ['websiteId']
      },
      querystring: {
        type: 'object',
        properties: {
          period: { type: 'string', enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'], default: 'DAILY' },
          days: { type: 'number', default: 30 }
        }
      }
    },
    preHandler: authenticate
  }, async (request, reply) => {
    try {
      const { websiteId } = request.params as { websiteId: string }
      const query = request.query as any
      
      const trends = await analyticsService.getAnalyticsTrends(
        websiteId, 
        query.period, 
        query.days
      )

      return reply.send({
        success: true,
        data: { trends },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get analytics trends error:', error)
      
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to fetch analytics trends',
          code: 'FETCH_TRENDS_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/analytics/:websiteId/insights - Get predictive insights
  fastify.get('/:websiteId/insights', {
    schema: {
      description: 'Get predictive insights for website',
      tags: ['Analytics'],
      params: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' }
        },
        required: ['websiteId']
      }
    },
    preHandler: authenticate
  }, async (request, reply) => {
    try {
      const { websiteId } = request.params as { websiteId: string }
      
      const insights = await analyticsService.getPredictiveInsights(websiteId)

      return reply.send({
        success: true,
        data: { insights },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get predictive insights error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to fetch predictive insights',
          code: 'FETCH_INSIGHTS_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // PUT /api/v1/analytics/:id - Update analytics record
  fastify.put('/:id', {
    schema: {
      description: 'Update analytics record',
      tags: ['Analytics'],
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
          visitors: { type: 'number', minimum: 0 },
          pageViews: { type: 'number', minimum: 0 },
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
          topCountries: { type: 'object' },
          topCities: { type: 'object' },
          pageLoadTime: { type: 'number', minimum: 0 },
          coreWebVitals: {
            type: 'object',
            properties: {
              lcp: { type: 'number', minimum: 0 },
              fid: { type: 'number', minimum: 0 },
              cls: { type: 'number', minimum: 0 }
            }
          },
          topPages: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                path: { type: 'string' },
                views: { type: 'number', minimum: 0 },
                uniqueViews: { type: 'number', minimum: 0 }
              }
            }
          },
          referrers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                domain: { type: 'string' },
                visits: { type: 'number', minimum: 0 }
              }
            }
          },
          devices: {
            type: 'object',
            properties: {
              mobile: { type: 'number', minimum: 0 },
              desktop: { type: 'number', minimum: 0 },
              tablet: { type: 'number', minimum: 0 }
            }
          },
          browsers: { type: 'object' },
          operatingSystems: { type: 'object' },
          screenResolutions: { type: 'object' },
          timeOnSite: { type: 'number', minimum: 0 },
          exitRate: { type: 'number', minimum: 0, maximum: 1 },
          newVisitors: { type: 'number', minimum: 0 },
          returningVisitors: { type: 'number', minimum: 0 }
        }
      }
    },
    preHandler: authenticate
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const validatedData = request.body as any
      
      const analytics = await analyticsService.updateAnalytics(id, validatedData as any)

      return reply.send({
        success: true,
        data: { analytics },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Update analytics error:', error)
      
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to update analytics record',
          code: 'UPDATE_ANALYTICS_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // DELETE /api/v1/analytics/:id - Delete analytics record
  fastify.delete('/:id', {
    schema: {
      description: 'Delete analytics record',
      tags: ['Analytics'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    },
    preHandler: authenticate
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      await analyticsService.deleteAnalytics(id)

      return reply.send({
        success: true,
        data: { message: 'Analytics record deleted successfully' },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Delete analytics error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to delete analytics record',
          code: 'DELETE_ANALYTICS_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/analytics/:websiteId/bulk - Bulk create analytics records
  fastify.post('/:websiteId/bulk', {
    schema: {
      description: 'Bulk create analytics records',
      tags: ['Analytics'],
      params: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' }
        },
        required: ['websiteId']
      },
      body: {
        type: 'object',
        required: ['records'],
        properties: {
          records: {
            type: 'array',
            items: {
              type: 'object',
              required: ['data', 'period', 'date'],
              properties: {
                data: {
                  type: 'object',
                  required: ['visitors', 'pageViews'],
                  properties: {
                    visitors: { type: 'number', minimum: 0 },
                    pageViews: { type: 'number', minimum: 0 },
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
                    topCountries: { type: 'object' },
                    topCities: { type: 'object' },
                    pageLoadTime: { type: 'number', minimum: 0 },
                    coreWebVitals: {
                      type: 'object',
                      properties: {
                        lcp: { type: 'number', minimum: 0 },
                        fid: { type: 'number', minimum: 0 },
                        cls: { type: 'number', minimum: 0 }
                      }
                    },
                    topPages: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          path: { type: 'string' },
                          views: { type: 'number', minimum: 0 },
                          uniqueViews: { type: 'number', minimum: 0 }
                        }
                      }
                    },
                    referrers: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          domain: { type: 'string' },
                          visits: { type: 'number', minimum: 0 }
                        }
                      }
                    },
                    devices: {
                      type: 'object',
                      properties: {
                        mobile: { type: 'number', minimum: 0 },
                        desktop: { type: 'number', minimum: 0 },
                        tablet: { type: 'number', minimum: 0 }
                      }
                    },
                    browsers: { type: 'object' },
                    operatingSystems: { type: 'object' },
                    screenResolutions: { type: 'object' },
                    timeOnSite: { type: 'number', minimum: 0 },
                    exitRate: { type: 'number', minimum: 0, maximum: 1 },
                    newVisitors: { type: 'number', minimum: 0 },
                    returningVisitors: { type: 'number', minimum: 0 }
                  }
                },
                period: { type: 'string', enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] },
                date: { type: 'string', format: 'date-time' }
              }
            }
          }
        }
      }
    },
    preHandler: authenticate
  }, async (request, reply) => {
    try {
      const { websiteId } = request.params as { websiteId: string }
      const { records } = request.body as { records: Array<{
        data: any
        period: string
        date: string
      }> }
      
      const processedRecords = records.map(record => ({
        data: createAnalyticsSchema.parse(record.data) as any,
        period: record.period,
        date: new Date(record.date)
      }))
      
      const analytics = await analyticsService.bulkCreateAnalytics(websiteId, processedRecords)

      return reply.status(201).send({
        success: true,
        data: { analytics },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Bulk create analytics error:', error)
      
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to bulk create analytics records',
          code: 'BULK_CREATE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })
}
