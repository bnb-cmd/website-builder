import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { authenticate } from '../middleware/auth'
import { DNSVerificationService } from '../services/dnsVerificationService'

// Schemas
const verifyDomainSchema = {
  body: {
    type: 'object',
    required: ['domain'],
    properties: {
      domain: { type: 'string', minLength: 1 },
      expectedRecords: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string' },
            name: { type: 'string' },
            value: { type: 'string' },
            ttl: { type: 'number' }
          }
        }
      }
    }
  }
}

const startVerificationSchema = {
  params: {
    type: 'object',
    required: ['domainId'],
    properties: {
      domainId: { type: 'string' }
    }
  },
  body: {
    type: 'object',
    properties: {
      intervalMinutes: { type: 'number', minimum: 1, maximum: 60 }
    }
  }
}

const stopVerificationSchema = {
  params: {
    type: 'object',
    required: ['domainId'],
    properties: {
      domainId: { type: 'string' }
    }
  }
}

export async function dnsVerificationRoutes(fastify: FastifyInstance) {
  const dnsService = new DNSVerificationService()

  // Verify domain DNS configuration
  fastify.post('/verify', { 
    preHandler: authenticate,
    schema: verifyDomainSchema 
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { domain, expectedRecords } = request.body as any
      const userId = request.user.id

      // Default expected records if not provided
      const defaultRecords = [
        {
          type: 'A',
          name: '@',
          value: process.env.PLATFORM_IP || '192.168.1.100',
          ttl: 3600
        },
        {
          type: 'CNAME',
          name: 'www',
          value: `${domain.split('.')[0]}.webbuilder.com`,
          ttl: 3600
        }
      ]

      const verification = await dnsService.verifyDomainDNS(
        domain, 
        expectedRecords || defaultRecords
      )

      reply.send({
        success: true,
        verification,
        message: verification.isValid 
          ? 'Domain DNS configuration is correct' 
          : 'Domain DNS configuration needs attention'
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: 'Failed to verify domain DNS configuration'
      })
    }
  })

  // Start automated verification for a domain
  fastify.post('/verify/:domainId/start', { 
    preHandler: authenticate,
    schema: startVerificationSchema 
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { domainId } = request.params as any
      const { intervalMinutes = 5 } = request.body as any
      const userId = request.user.id

      // Verify user owns this domain
      const domain = await fastify.prisma.domain.findFirst({
        where: { 
          id: domainId,
          userId: userId
        }
      })

      if (!domain) {
        return reply.status(404).send({
          success: false,
          error: 'Domain not found or access denied'
        })
      }

      const intervalId = await dnsService.startAutomatedVerification(domainId, intervalMinutes)

      reply.send({
        success: true,
        message: 'Automated verification started',
        intervalId: intervalId.toString(),
        intervalMinutes
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: 'Failed to start automated verification'
      })
    }
  })

  // Stop automated verification for a domain
  fastify.post('/verify/:domainId/stop', { 
    preHandler: authenticate,
    schema: stopVerificationSchema 
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { domainId } = request.params as any
      const userId = request.user.id

      // Verify user owns this domain
      const domain = await fastify.prisma.domain.findFirst({
        where: { 
          id: domainId,
          userId: userId
        }
      })

      if (!domain) {
        return reply.status(404).send({
          success: false,
          error: 'Domain not found or access denied'
        })
      }

      await dnsService.stopAutomatedVerification(domainId)

      reply.send({
        success: true,
        message: 'Automated verification stopped'
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: 'Failed to stop automated verification'
      })
    }
  })

  // Get verification statistics
  fastify.get('/stats', { 
    preHandler: authenticate 
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const stats = await dnsService.getVerificationStats()

      reply.send({
        success: true,
        stats
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: 'Failed to get verification statistics'
      })
    }
  })

  // Get available DNS providers
  fastify.get('/providers', { 
    preHandler: authenticate 
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const providers = [
        {
          name: 'DNSimple',
          cost: '$5/month',
          features: [
            'DNS record queries',
            'Domain management',
            'SSL certificates',
            'Webhooks support'
          ],
          rateLimit: '1000/hour',
          reliability: '99.9%'
        },
        {
          name: 'Namecheap',
          cost: 'FREE',
          features: [
            'DNS record queries',
            'Domain management',
            'Basic domain info'
          ],
          rateLimit: '3000/hour',
          reliability: '99.5%'
        },
        {
          name: 'GoDaddy',
          cost: 'FREE',
          features: [
            'DNS record queries',
            'Domain management',
            'Domain search'
          ],
          rateLimit: '1000/hour',
          reliability: '99.7%'
        },
        {
          name: 'Cloudflare',
          cost: 'FREE',
          features: [
            'DNS record queries',
            'Zone management',
            'SSL certificates',
            'CDN integration'
          ],
          rateLimit: '1200/hour',
          reliability: '99.9%'
        }
      ]

      reply.send({
        success: true,
        providers
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: 'Failed to get DNS providers'
      })
    }
  })

  // Test DNS provider connectivity
  fastify.post('/test-provider', { 
    preHandler: authenticate,
    schema: {
      body: {
        type: 'object',
        required: ['provider', 'domain'],
        properties: {
          provider: { type: 'string' },
          domain: { type: 'string' }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { provider, domain } = request.body as any

      // Test the specific provider
      const testResult = await dnsService.testProvider(provider, domain)

      reply.send({
        success: true,
        provider,
        domain,
        result: testResult
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: 'Failed to test DNS provider'
      })
    }
  })
}
