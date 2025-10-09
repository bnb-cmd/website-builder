import { Integration, WebsiteIntegration, IntegrationCategory, IntegrationStatus, AuthType } from '@prisma/client'
import { BaseService } from './baseService'

export interface IntegrationData {
  name: string
  description?: string
  category: IntegrationCategory
  provider: string
  iconUrl?: string
  websiteUrl?: string
  apiVersion?: string
  documentationUrl?: string
  configSchema?: any
  authType?: AuthType
  isPremium?: boolean
  price?: number
  features?: string[]
  tags?: string[]
}

export interface WebsiteIntegrationData {
  websiteId: string
  integrationId: string
  config: any
  credentials: any
}

export class IntegrationService extends BaseService<Integration> {
  
  protected getModelName(): string {
    return 'integration'
  }

  async createIntegration(data: IntegrationData): Promise<Integration> {
    try {
      return await this.prisma.integration.create({
        data: {
          ...data,
          status: IntegrationStatus.ACTIVE,
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async getIntegrations(category?: IntegrationCategory): Promise<Integration[]> {
    try {
      return await this.prisma.integration.findMany({
        where: category ? { category, status: IntegrationStatus.ACTIVE } : { status: IntegrationStatus.ACTIVE },
        orderBy: { name: 'asc' }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async getWebsiteIntegrations(websiteId: string): Promise<WebsiteIntegration[]> {
    try {
      this.validateId(websiteId)
      return await this.prisma.websiteIntegration.findMany({
        where: { websiteId },
        include: {
          integration: true
        },
        orderBy: { createdAt: 'desc' }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async installIntegration(websiteId: string, integrationId: string, config: any, credentials: any): Promise<WebsiteIntegration> {
    try {
      this.validateId(websiteId)
      this.validateId(integrationId)

      // Check if already installed
      const existing = await this.prisma.websiteIntegration.findUnique({
        where: {
          websiteId_integrationId: {
            websiteId,
            integrationId
          }
        }
      })

      if (existing) {
        throw new Error('Integration already installed')
      }

      return await this.prisma.websiteIntegration.create({
        data: {
          websiteId,
          integrationId,
          config,
          credentials,
          status: IntegrationStatus.ACTIVE,
          isEnabled: true
        },
        include: {
          integration: true
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async updateIntegrationConfig(websiteIntegrationId: string, config: any, credentials?: any): Promise<WebsiteIntegration> {
    try {
      this.validateId(websiteIntegrationId)
      
      const updateData: any = { config }
      if (credentials) {
        updateData.credentials = credentials
      }

      return await this.prisma.websiteIntegration.update({
        where: { id: websiteIntegrationId },
        data: updateData,
        include: {
          integration: true
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async toggleIntegration(websiteIntegrationId: string, isEnabled: boolean): Promise<WebsiteIntegration> {
    try {
      this.validateId(websiteIntegrationId)
      return await this.prisma.websiteIntegration.update({
        where: { id: websiteIntegrationId },
        data: { isEnabled },
        include: {
          integration: true
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async uninstallIntegration(websiteIntegrationId: string): Promise<boolean> {
    try {
      this.validateId(websiteIntegrationId)
      await this.prisma.websiteIntegration.delete({
        where: { id: websiteIntegrationId }
      })
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  async testIntegration(websiteIntegrationId: string): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      this.validateId(websiteIntegrationId)
      
      const websiteIntegration = await this.prisma.websiteIntegration.findUnique({
        where: { id: websiteIntegrationId },
        include: { integration: true }
      })

      if (!websiteIntegration) {
        throw new Error('Integration not found')
      }

      // Mock integration test - in reality, you'd call the actual integration API
      const integration = websiteIntegration.integration
      
      switch (integration.category) {
        case IntegrationCategory.ANALYTICS:
          return await this.testAnalyticsIntegration(integration, websiteIntegration.credentials)
        case IntegrationCategory.PAYMENT:
          return await this.testPaymentIntegration(integration, websiteIntegration.credentials)
        case IntegrationCategory.EMAIL:
          return await this.testEmailIntegration(integration, websiteIntegration.credentials)
        case IntegrationCategory.SOCIAL_MEDIA:
          return await this.testSocialMediaIntegration(integration, websiteIntegration.credentials)
        default:
          return { success: true, message: 'Integration test completed successfully' }
      }
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Integration test failed' 
      }
    }
  }

  private async testAnalyticsIntegration(integration: Integration, credentials: any): Promise<{ success: boolean; message: string; data?: any }> {
    // Mock Google Analytics test
    console.log(`Testing ${integration.name} with credentials:`, credentials)
    return { 
      success: true, 
      message: `${integration.name} connection successful`,
      data: { accountId: 'GA-123456789', propertyId: 'UA-123456789-1' }
    }
  }

  private async testPaymentIntegration(integration: Integration, credentials: any): Promise<{ success: boolean; message: string; data?: any }> {
    // Mock Stripe test
    console.log(`Testing ${integration.name} with credentials:`, credentials)
    return { 
      success: true, 
      message: `${integration.name} connection successful`,
      data: { accountId: 'acct_1234567890', balance: 0 }
    }
  }

  private async testEmailIntegration(integration: Integration, credentials: any): Promise<{ success: boolean; message: string; data?: any }> {
    // Mock SendGrid test
    console.log(`Testing ${integration.name} with credentials:`, credentials)
    return { 
      success: true, 
      message: `${integration.name} connection successful`,
      data: { accountId: 'SG-123456789', reputation: 100 }
    }
  }

  private async testSocialMediaIntegration(integration: Integration, credentials: any): Promise<{ success: boolean; message: string; data?: any }> {
    // Mock Facebook API test
    console.log(`Testing ${integration.name} with credentials:`, credentials)
    return { 
      success: true, 
      message: `${integration.name} connection successful`,
      data: { pageId: '123456789', pageName: 'My Business Page' }
    }
  }

  // Required abstract methods from BaseService
  async create(data: any): Promise<Integration> {
    return this.prisma.integration.create({ data })
  }
  
  async findById(id: string): Promise<Integration | null> {
    return this.prisma.integration.findUnique({ where: { id } })
  }
  
  async findAll(filters?: any): Promise<Integration[]> {
    return this.prisma.integration.findMany({ where: filters })
  }
  
  async update(id: string, data: Partial<Integration>): Promise<Integration> {
    return this.prisma.integration.update({ where: { id }, data })
  }
  
  // Required abstract methods from BaseService
  override async create(data: any): Promise<Integration> {
    return this.prisma.integration.create({ data })
  }
  
  override async findById(id: string): Promise<Integration | null> {
    return this.prisma.integration.findUnique({ where: { id } })
  }
  
  override async findAll(filters?: any): Promise<Integration[]> {
    return this.prisma.integration.findMany({ where: filters })
  }
  
  override async update(id: string, data: Partial<Integration>): Promise<Integration> {
    return this.prisma.integration.update({ where: { id }, data })
  }
  
  override async delete(id: string): Promise<boolean> {
    await this.prisma.integration.delete({ where: { id } })
    return true
  }
}
