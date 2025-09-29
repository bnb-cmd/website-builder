import { prisma } from '../models/database.js'
import crypto from 'crypto'

export class IntegrationMarketplaceService {
  // Integration Management
  async createIntegration(data: {
    name: string
    description?: string
    category: string
    provider: string
    iconUrl?: string
    websiteUrl?: string
    apiVersion?: string
    documentationUrl?: string
    configSchema?: any
    authType?: string
    status?: string
    isPremium?: boolean
  }) {
    const integration = await prisma.integration.create({
      data: {
        name: data.name,
        description: data.description || null,
        category: data.category.toUpperCase() as any,
        provider: data.provider,
        iconUrl: data.iconUrl || null,
        websiteUrl: data.websiteUrl || null,
        apiVersion: data.apiVersion || null,
        documentationUrl: data.documentationUrl || null,
        configSchema: data.configSchema || null,
        authType: (data.authType?.toUpperCase() as any) || 'API_KEY',
        status: (data.status?.toUpperCase() as any) || 'ACTIVE',
        isPremium: data.isPremium || false
      }
    })

    return integration
  }

  async getIntegrations(filters: {
    category?: string
    status?: string
    search?: string
    limit?: number
    offset?: number
  } = {}) {
    const {
      category,
      status,
      search,
      limit = 20,
      offset = 0
    } = filters

    const where: any = {}

    if (category) where.category = category.toUpperCase()
    if (status) where.status = status.toUpperCase()
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { provider: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [integrations, total] = await Promise.all([
      prisma.integration.findMany({
        where,
        include: {
          reviews: true
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.integration.count({ where })
    ])

    // Calculate average ratings
    const integrationsWithRatings = integrations.map(integration => ({
      ...integration,
      rating: integration.reviews.length > 0
        ? integration.reviews.reduce((sum, review) => sum + review.rating, 0) / integration.reviews.length
        : null,
      reviewCount: integration.reviews.length
    }))

    return {
      integrations: integrationsWithRatings,
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    }
  }

  async getIntegrationById(id: string) {
    const integration = await prisma.integration.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: { name: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!integration) return null

    // Calculate rating
    const rating = integration.reviews.length > 0
      ? integration.reviews.reduce((sum, review) => sum + review.rating, 0) / integration.reviews.length
      : null

    return {
      ...integration,
      rating,
      reviewCount: integration.reviews.length
    }
  }

  // Website Integration Management
  async installIntegration(websiteId: string, integrationId: string, config: Record<string, any>) {
    // Check if integration exists
    const integration = await prisma.integration.findUnique({
      where: { id: integrationId }
    })

    if (!integration) {
      throw new Error('Integration not found')
    }

    // Create website integration
    const websiteIntegration = await prisma.websiteIntegration.create({
      data: {
        websiteId,
        integrationId,
        config,
        credentials: {}, // Will be set during configuration
        status: 'INACTIVE'
      },
      include: {
        integration: true
      }
    })

    return websiteIntegration
  }

  async configureIntegration(integrationId: string, config: Record<string, any>, credentials: Record<string, any>) {
    // Encrypt credentials
    const encryptedCredentials = this.encryptCredentials(credentials)

    const updatedIntegration = await prisma.websiteIntegration.update({
      where: { id: integrationId },
      data: {
        config,
        credentials: encryptedCredentials,
        status: 'ACTIVE'
      },
      include: {
        integration: true
      }
    })

    return updatedIntegration
  }

  async uninstallIntegration(integrationId: string) {
    // Remove webhooks
    await prisma.integrationWebhook.deleteMany({
      where: { integrationId }
    })

    // Remove logs
    await prisma.integrationLog.deleteMany({
      where: { integrationId }
    })

    // Remove integration
    await prisma.websiteIntegration.delete({
      where: { id: integrationId }
    })

    return true
  }

  async getWebsiteIntegrations(websiteId: string) {
    const integrations = await prisma.websiteIntegration.findMany({
      where: { websiteId },
      include: {
        integration: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return integrations
  }

  // Webhook Management
  async createWebhook(integrationId: string, websiteId: string, event: string, url: string) {
    const secret = crypto.randomBytes(32).toString('hex')

    const webhook = await prisma.integrationWebhook.create({
      data: {
        integrationId,
        websiteId,
        event,
        url,
        secret,
        status: 'ACTIVE'
      }
    })

    return webhook
  }

  async triggerWebhook(webhookId: string, payload: any) {
    const webhook = await prisma.integrationWebhook.findUnique({
      where: { id: webhookId }
    })

    if (!webhook || webhook.status !== 'ACTIVE') {
      return
    }

    try {
      // Sign the payload
      const signature = crypto
        .createHmac('sha256', webhook.secret)
        .update(JSON.stringify(payload))
        .digest('hex')

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Event': webhook.event
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        await prisma.integrationWebhook.update({
          where: { id: webhookId },
          data: {
            lastTriggered: new Date(),
            retryCount: 0
          }
        })
      } else {
        await this.handleWebhookFailure(webhookId)
      }
    } catch (error) {
      await this.handleWebhookFailure(webhookId)
    }
  }

  private async handleWebhookFailure(webhookId: string) {
    const webhook = await prisma.integrationWebhook.findUnique({
      where: { id: webhookId }
    })

    if (!webhook) return

    const newRetryCount = webhook.retryCount + 1

    if (newRetryCount >= 5) {
      // Disable webhook after 5 failed attempts
      await prisma.integrationWebhook.update({
        where: { id: webhookId },
        data: {
          status: 'INACTIVE',
          retryCount: newRetryCount
        }
      })
    } else {
      await prisma.integrationWebhook.update({
        where: { id: webhookId },
        data: { retryCount: newRetryCount }
      })
    }
  }

  // Integration Logging
  async logIntegrationAction(
    integrationId: string,
    websiteId: string,
    action: string,
    status: 'SUCCESS' | 'ERROR' | 'WARNING',
    message: string,
    metadata?: Record<string, any>
  ) {
    await prisma.integrationLog.create({
      data: {
        integrationId,
        websiteId,
        action,
        status,
        message,
        metadata: metadata || null
      }
    })
  }

  async getIntegrationLogs(integrationId: string, limit: number = 50) {
    const logs = await prisma.integrationLog.findMany({
      where: { integrationId },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return logs
  }

  // Review Management
  async createReview(integrationId: string, userId: string, rating: number, title?: string, content?: string) {
    // Check if user already reviewed this integration
    const existingReview = await prisma.integrationReview.findUnique({
      where: {
        integrationId_userId: {
          integrationId,
          userId
        }
      }
    })

    if (existingReview) {
      throw new Error('User has already reviewed this integration')
    }

    const review = await prisma.integrationReview.create({
      data: {
        integrationId,
        userId,
        rating,
        title: title || null,
        content: content || null,
        verified: true // Assume verified for now
      }
    })

    // Update integration rating
    await this.updateIntegrationRating(integrationId)

    return review
  }

  async updateIntegrationRating(integrationId: string) {
    const reviews = await prisma.integrationReview.findMany({
      where: { integrationId },
      select: { rating: true }
    })

    if (reviews.length === 0) return

    // Note: Rating calculation removed since Integration model doesn't have rating field
    // Ratings are calculated dynamically from reviews when needed
  }

  // Category Management - Note: IntegrationCategory model doesn't exist in schema
  // These methods would need to be implemented if the model is added
  async createIntegrationCategory(_data: {
    name: string
    slug: string
    description?: string
    icon?: string
    color?: string
  }) {
    // Implementation would go here if IntegrationCategory model exists
    throw new Error('IntegrationCategory model not implemented in schema')
  }

  async getIntegrationCategories() {
    // Implementation would go here if IntegrationCategory model exists
    throw new Error('IntegrationCategory model not implemented in schema')
  }

  // Utility Methods
  private encryptCredentials(credentials: Record<string, any>): Record<string, any> {
    const encrypted: Record<string, any> = {}

    for (const [key, value] of Object.entries(credentials)) {
      // Simple encryption - in production, use proper encryption
      const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY || 'default-key')
      let encryptedValue = cipher.update(JSON.stringify(value), 'utf8', 'hex')
      encryptedValue += cipher.final('hex')
      encrypted[key] = encryptedValue
    }

    return encrypted
  }

  private decryptCredentials(encryptedCredentials: Record<string, any>): Record<string, any> {
    const decrypted: Record<string, any> = {}

    for (const [key, value] of Object.entries(encryptedCredentials)) {
      try {
        const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY || 'default-key')
        let decryptedValue = decipher.update(value as string, 'hex', 'utf8')
        decryptedValue += decipher.final('utf8')
        decrypted[key] = JSON.parse(decryptedValue)
      } catch (error) {
        decrypted[key] = null // Failed to decrypt
      }
    }

    return decrypted
  }

  // Integration Sync
  async syncIntegrationData(integrationId: string) {
    const websiteIntegration = await prisma.websiteIntegration.findUnique({
      where: { id: integrationId },
      include: { integration: true }
    })

    if (!websiteIntegration) {
      throw new Error('Website integration not found')
    }

    try {
      // Decrypt credentials
      const credentials = this.decryptCredentials(websiteIntegration.credentials)

      // Perform sync based on integration type
      const syncResult = await this.performIntegrationSync(
        websiteIntegration.integration,
        websiteIntegration.config,
        credentials
      )

      // Update last sync
      await prisma.websiteIntegration.update({
        where: { id: integrationId },
        data: {
          lastSync: new Date(),
          status: 'active',
          errorMessage: null
        }
      })

      // Log successful sync
      await this.logIntegrationAction(
        integrationId,
        websiteIntegration.websiteId,
        'sync',
        'success',
        'Integration data synchronized successfully',
        syncResult
      )

      return syncResult
    } catch (error: any) {
      // Update error status
      await prisma.websiteIntegration.update({
        where: { id: integrationId },
        data: {
          status: 'error',
          errorMessage: error.message
        }
      })

      // Log error
      await this.logIntegrationAction(
        integrationId,
        websiteIntegration.websiteId,
        'sync',
        'error',
        error.message
      )

      throw error
    }
  }

  private async performIntegrationSync(
    integration: any,
    config: Record<string, any>,
    credentials: Record<string, any>
  ) {
    // This would implement specific sync logic for different integrations
    // For example:
    // - Google Analytics: fetch latest metrics
    // - Mailchimp: sync subscriber lists
    // - Stripe: sync payment data
    // - etc.

    // Placeholder implementation
    return {
      syncedAt: new Date(),
      recordsProcessed: 0,
      status: 'completed'
    }
  }

  // Analytics
  async getIntegrationAnalytics(integrationId: string, period: '7d' | '30d' | '90d' = '30d') {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - (period === '7d' ? 7 : period === '30d' ? 30 : 90))

    const logs = await prisma.integrationLog.findMany({
      where: {
        integrationId,
        createdAt: { gte: startDate }
      },
      orderBy: { createdAt: 'desc' }
    })

    const stats = {
      totalRequests: logs.length,
      successfulRequests: logs.filter(log => log.status === 'success').length,
      failedRequests: logs.filter(log => log.status === 'error').length,
      warningRequests: logs.filter(log => log.status === 'warning').length,
      successRate: logs.length > 0
        ? (logs.filter(log => log.status === 'success').length / logs.length) * 100
        : 0,
      recentLogs: logs.slice(0, 10)
    }

    return stats
  }
}

export const integrationMarketplaceService = new IntegrationMarketplaceService()
