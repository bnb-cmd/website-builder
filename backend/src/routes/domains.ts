import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { authenticate } from '../middleware/auth'
import { DomainService } from '../services/domainService'

// Domain registration schema
const registerDomainSchema = z.object({
  domain: z.string().min(3).max(255),
  extension: z.string().min(2).max(10),
  websiteId: z.string().uuid().optional(),
  autoRenew: z.boolean().default(true),
  privacyProtection: z.boolean().default(true)
})

// DNS record schema
const dnsRecordSchema = z.object({
  type: z.enum(['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS']),
  name: z.string().min(1).max(255),
  value: z.string().min(1).max(255),
  ttl: z.number().min(300).max(86400).default(3600),
  priority: z.number().optional()
})

// Domain search schema
const domainSearchSchema = z.object({
  query: z.string().min(1).max(255),
  extensions: z.array(z.string()).optional()
})

export async function domainRoutes(fastify: FastifyInstance) {
  const domainService = new DomainService()

  // Search available domains
  fastify.get('/search', {
    schema: {
      querystring: {
        type: 'object',
        required: ['query'],
        properties: {
          query: { type: 'string', minLength: 1, maxLength: 255 },
          extensions: {
            type: 'array',
            items: { type: 'string' }
          }
        }
      }
    }
  }, async (request: FastifyRequest<{ Querystring: z.infer<typeof domainSearchSchema> }>, reply: FastifyReply) => {
    try {
      const { query, extensions } = request.query
      const results = await domainService.searchDomains(query, extensions)
      
      reply.send({
        success: true,
        results
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: 'Failed to search domains'
      })
    }
  })

  // Get user's domains
  fastify.get('/', {
    preHandler: authenticate
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = request.user.id
      const domains = await domainService.getUserDomains(userId)
      
      reply.send({
        success: true,
        domains
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: 'Failed to fetch domains'
      })
    }
  })

  // Register new domain
  fastify.post('/register', {
    preHandler: authenticate,
    schema: {
      body: {
        type: 'object',
        required: ['domain', 'extension'],
        properties: {
          domain: { type: 'string', minLength: 3, maxLength: 255 },
          extension: { type: 'string', minLength: 2, maxLength: 10 },
          websiteId: { type: 'string', format: 'uuid' },
          autoRenew: { type: 'boolean', default: true },
          privacyProtection: { type: 'boolean', default: true }
        }
      }
    }
  }, async (request: FastifyRequest<{ Body: z.infer<typeof registerDomainSchema> }>, reply: FastifyReply) => {
    try {
      const userId = request.user.id
      const { domain, extension, websiteId, autoRenew, privacyProtection } = request.body
      
      const fullDomain = `${domain}${extension}`
      
      // Check if domain is available
      const isAvailable = await domainService.checkDomainAvailability(fullDomain)
      if (!isAvailable) {
        return reply.status(400).send({
          success: false,
          error: 'Domain is not available'
        })
      }

      // Get domain pricing
      const pricing = await domainService.getDomainPricing(extension)
      
      // Create domain registration
      const domainRecord = await domainService.registerDomain({
        userId,
        domain: fullDomain,
        websiteId,
        autoRenew,
        privacyProtection,
        pricing
      })

      reply.send({
        success: true,
        domain: domainRecord,
        message: 'Domain registration initiated'
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: 'Failed to register domain'
      })
    }
  })

  // Get domain details
  fastify.get('/:id', {
    preHandler: authenticate
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const userId = request.user.id
      const domainId = request.params.id
      
      const domain = await domainService.getDomainById(domainId, userId)
      if (!domain) {
        return reply.status(404).send({
          success: false,
          error: 'Domain not found'
        })
      }

      reply.send({
        success: true,
        domain
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: 'Failed to fetch domain details'
      })
    }
  })

  // Update domain settings
  fastify.put('/:id', {
    preHandler: authenticate,
    schema: {
      body: {
        type: 'object',
        properties: {
          autoRenew: { type: 'boolean' },
          privacyProtection: { type: 'boolean' },
          websiteId: { type: 'string', format: 'uuid' }
        },
        additionalProperties: false
      }
    }
  }, async (request: FastifyRequest<{ 
    Params: { id: string },
    Body: { autoRenew?: boolean, privacyProtection?: boolean, websiteId?: string }
  }>, reply: FastifyReply) => {
    try {
      const userId = request.user.id
      const domainId = request.params.id
      const updates = request.body
      
      const domain = await domainService.updateDomain(domainId, userId, updates)
      
      reply.send({
        success: true,
        domain
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: 'Failed to update domain'
      })
    }
  })

  // Connect domain to website
  fastify.post('/:id/connect', {
    preHandler: authenticate,
    schema: {
      body: {
        type: 'object',
        required: ['websiteId'],
        properties: {
          websiteId: { type: 'string', format: 'uuid' }
        },
        additionalProperties: false
      }
    }
  }, async (request: FastifyRequest<{ 
    Params: { id: string },
    Body: { websiteId: string }
  }>, reply: FastifyReply) => {
    try {
      const userId = request.user.id
      const domainId = request.params.id
      const { websiteId } = request.body
      
      const domain = await domainService.connectDomainToWebsite(domainId, websiteId, userId)
      
      reply.send({
        success: true,
        domain,
        message: 'Domain connected to website successfully'
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: 'Failed to connect domain to website'
      })
    }
  })

  // Get DNS records for domain
  fastify.get('/:id/dns', {
    preHandler: authenticate
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const userId = request.user.id
      const domainId = request.params.id
      
      const dnsRecords = await domainService.getDNSRecords(domainId, userId)
      
      reply.send({
        success: true,
        records: dnsRecords
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: 'Failed to fetch DNS records'
      })
    }
  })

  // Add DNS record
  fastify.post('/:id/dns', {
    preHandler: authenticate,
    schema: {
      body: {
        type: 'object',
        required: ['type', 'name', 'value'],
        properties: {
          type: { type: 'string', enum: ['A','AAAA','CNAME','MX','TXT','NS'] },
          name: { type: 'string', minLength: 1, maxLength: 255 },
          value: { type: 'string', minLength: 1, maxLength: 255 },
          ttl: { type: 'number', minimum: 300, maximum: 86400, default: 3600 },
          priority: { type: 'number' }
        },
        additionalProperties: false
      }
    }
  }, async (request: FastifyRequest<{ 
    Params: { id: string },
    Body: z.infer<typeof dnsRecordSchema>
  }>, reply: FastifyReply) => {
    try {
      const userId = request.user.id
      const domainId = request.params.id
      const record = request.body
      
      const newRecord = await domainService.addDNSRecord(domainId, userId, record)
      
      reply.send({
        success: true,
        record: newRecord
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: 'Failed to add DNS record'
      })
    }
  })

  // Update DNS record
  fastify.put('/:id/dns/:recordId', {
    preHandler: authenticate,
    schema: {
      body: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['A','AAAA','CNAME','MX','TXT','NS'] },
          name: { type: 'string', minLength: 1, maxLength: 255 },
          value: { type: 'string', minLength: 1, maxLength: 255 },
          ttl: { type: 'number', minimum: 300, maximum: 86400 },
          priority: { type: 'number' }
        },
        additionalProperties: false
      }
    }
  }, async (request: FastifyRequest<{ 
    Params: { id: string, recordId: string },
    Body: Partial<z.infer<typeof dnsRecordSchema>>
  }>, reply: FastifyReply) => {
    try {
      const userId = request.user.id
      const domainId = request.params.id
      const recordId = request.params.recordId
      const updates = request.body
      
      const record = await domainService.updateDNSRecord(domainId, recordId, userId, updates)
      
      reply.send({
        success: true,
        record
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: 'Failed to update DNS record'
      })
    }
  })

  // Delete DNS record
  fastify.delete('/:id/dns/:recordId', {
    preHandler: authenticate
  }, async (request: FastifyRequest<{ Params: { id: string, recordId: string } }>, reply: FastifyReply) => {
    try {
      const userId = request.user.id
      const domainId = request.params.id
      const recordId = request.params.recordId
      
      await domainService.deleteDNSRecord(domainId, recordId, userId)
      
      reply.send({
        success: true,
        message: 'DNS record deleted successfully'
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: 'Failed to delete DNS record'
      })
    }
  })

  // Renew domain
  fastify.post('/:id/renew', {
    preHandler: authenticate,
    schema: {
      body: {
        type: 'object',
        properties: {
          years: { type: 'number', minimum: 1, maximum: 10, default: 1 }
        },
        additionalProperties: false
      }
    }
  }, async (request: FastifyRequest<{ 
    Params: { id: string },
    Body: { years: number }
  }>, reply: FastifyReply) => {
    try {
      const userId = request.user.id
      const domainId = request.params.id
      const { years } = request.body
      
      const renewal = await domainService.renewDomain(domainId, userId, years)
      
      reply.send({
        success: true,
        renewal,
        message: 'Domain renewal initiated'
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: 'Failed to renew domain'
      })
    }
  })

  // Transfer domain
  fastify.post('/:id/transfer', {
    preHandler: authenticate,
    schema: {
      body: {
        type: 'object',
        required: ['authCode'],
        properties: {
          authCode: { type: 'string', minLength: 1, maxLength: 255 }
        },
        additionalProperties: false
      }
    }
  }, async (request: FastifyRequest<{ 
    Params: { id: string },
    Body: { authCode: string }
  }>, reply: FastifyReply) => {
    try {
      const userId = request.user.id
      const domainId = request.params.id
      const { authCode } = request.body
      
      const transfer = await domainService.transferDomain(domainId, userId, authCode)
      
      reply.send({
        success: true,
        transfer,
        message: 'Domain transfer initiated'
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: 'Failed to transfer domain'
      })
    }
  })

  // Get domain pricing
  fastify.get('/pricing/:extension', async (request: FastifyRequest<{ Params: { extension: string } }>, reply: FastifyReply) => {
    try {
      const extension = request.params.extension
      const pricing = await domainService.getDomainPricing(extension)
      
      reply.send({
        success: true,
        pricing
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: 'Failed to fetch domain pricing'
      })
    }
  })

  // Get SSL certificate status
  fastify.get('/:id/ssl', {
    preHandler: authenticate
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const userId = request.user.id
      const domainId = request.params.id
      
      const sslStatus = await domainService.getSSLStatus(domainId, userId)
      
      reply.send({
        success: true,
        ssl: sslStatus
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: 'Failed to fetch SSL status'
      })
    }
  })

  // Request SSL certificate
  fastify.post('/:id/ssl', {
    preHandler: authenticate
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const userId = request.user.id
      const domainId = request.params.id
      
      const sslRequest = await domainService.requestSSLCertificate(domainId, userId)
      
      reply.send({
        success: true,
        ssl: sslRequest,
        message: 'SSL certificate request initiated'
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: 'Failed to request SSL certificate'
      })
    }
  })
}
