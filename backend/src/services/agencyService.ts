import { Agency, AgencyClient, AgencyPlan, AgencyStatus, ClientStatus } from '@prisma/client'
import { BaseService } from './baseService'

export interface AgencyData {
  name: string
  description?: string
  website?: string
  logo?: string
  brandName?: string
  brandColors?: any
  customDomain?: string
  customLogo?: string
  features?: any
  plan?: AgencyPlan
  billingEmail?: string
}

export interface AgencyClientData {
  agencyId: string
  websiteId: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  companyName?: string
  projectType?: string
  budget?: number
  timeline?: string
  notes?: string
}

export class AgencyService extends BaseService<Agency> {
  
  protected getModelName(): string {
    return 'agency'
  }

  async createAgency(userId: string, data: AgencyData): Promise<Agency> {
    try {
      this.validateId(userId)
      return await this.prisma.agency.create({
        data: {
          userId,
          ...data,
          status: AgencyStatus.ACTIVE,
          features: data.features || {
            websiteBuilder: true,
            ecommerce: true,
            analytics: true,
            marketing: false,
            integrations: false,
            videoEditor: false,
            designSystem: false
          }
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async getAgencyByUserId(userId: string): Promise<Agency | null> {
    try {
      this.validateId(userId)
      return await this.prisma.agency.findUnique({
        where: { userId },
        include: {
          clients: {
            include: {
              website: true
            }
          }
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async updateAgency(agencyId: string, data: Partial<AgencyData>): Promise<Agency> {
    try {
      this.validateId(agencyId)
      return await this.prisma.agency.update({
        where: { id: agencyId },
        data
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async getAgencyClients(agencyId: string): Promise<AgencyClient[]> {
    try {
      this.validateId(agencyId)
      return await this.prisma.agencyClient.findMany({
        where: { agencyId },
        include: {
          website: true
        },
        orderBy: { updatedAt: 'desc' }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async addClient(data: AgencyClientData): Promise<AgencyClient> {
    try {
      this.validateId(data.agencyId)
      this.validateId(data.websiteId)
      
      return await this.prisma.agencyClient.create({
        data: {
          ...data,
          status: ClientStatus.ACTIVE
        },
        include: {
          website: true,
          agency: true
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async updateClient(clientId: string, data: Partial<AgencyClientData>): Promise<AgencyClient> {
    try {
      this.validateId(clientId)
      return await this.prisma.agencyClient.update({
        where: { id: clientId },
        data,
        include: {
          website: true,
          agency: true
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async removeClient(clientId: string): Promise<boolean> {
    try {
      this.validateId(clientId)
      await this.prisma.agencyClient.delete({
        where: { id: clientId }
      })
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  async getAgencyStats(agencyId: string): Promise<{
    totalClients: number
    activeClients: number
    completedProjects: number
    totalRevenue: number
    averageProjectValue: number
  }> {
    try {
      this.validateId(agencyId)
      
      const clients = await this.prisma.agencyClient.findMany({
        where: { agencyId }
      })

      const totalClients = clients.length
      const activeClients = clients.filter(c => c.status === ClientStatus.ACTIVE).length
      const completedProjects = clients.filter(c => c.status === ClientStatus.COMPLETED).length
      
      const totalRevenue = clients.reduce((sum, client) => {
        return sum + (client.budget?.toNumber() || 0)
      }, 0)
      
      const averageProjectValue = totalClients > 0 ? totalRevenue / totalClients : 0

      return {
        totalClients,
        activeClients,
        completedProjects,
        totalRevenue,
        averageProjectValue
      }
    } catch (error) {
      this.handleError(error)
    }
  }

  async generateWhiteLabelConfig(agencyId: string): Promise<{
    brandName: string
    brandColors: any
    customDomain?: string
    customLogo?: string
    features: any
  }> {
    try {
      this.validateId(agencyId)
      
      const agency = await this.prisma.agency.findUnique({
        where: { id: agencyId }
      })

      if (!agency) {
        throw new Error('Agency not found')
      }

      return {
        brandName: agency.brandName || agency.name,
        brandColors: agency.brandColors || {
          primary: '#3B82F6',
          secondary: '#1E40AF'
        },
        customDomain: agency.customDomain,
        customLogo: agency.customLogo,
        features: agency.features
      }
    } catch (error) {
      this.handleError(error)
    }
  }

  async upgradeAgencyPlan(agencyId: string, newPlan: AgencyPlan): Promise<Agency> {
    try {
      this.validateId(agencyId)
      
      const planFeatures = {
        STARTER: {
          websiteBuilder: true,
          ecommerce: true,
          analytics: true,
          marketing: false,
          integrations: false,
          videoEditor: false,
          designSystem: false,
          maxClients: 5,
          maxWebsites: 10
        },
        PROFESSIONAL: {
          websiteBuilder: true,
          ecommerce: true,
          analytics: true,
          marketing: true,
          integrations: true,
          videoEditor: false,
          designSystem: false,
          maxClients: 25,
          maxWebsites: 50
        },
        ENTERPRISE: {
          websiteBuilder: true,
          ecommerce: true,
          analytics: true,
          marketing: true,
          integrations: true,
          videoEditor: true,
          designSystem: true,
          maxClients: -1, // unlimited
          maxWebsites: -1 // unlimited
        }
      }

      return await this.prisma.agency.update({
        where: { id: agencyId },
        data: {
          plan: newPlan,
          features: planFeatures[newPlan]
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  // Required abstract methods from BaseService
  async create(data: any): Promise<Agency> {
    return this.prisma.agency.create({ data })
  }
  
  async findById(id: string): Promise<Agency | null> {
    return this.prisma.agency.findUnique({ where: { id } })
  }
  
  async findAll(filters?: any): Promise<Agency[]> {
    return this.prisma.agency.findMany({ where: filters })
  }
  
  async update(id: string, data: Partial<Agency>): Promise<Agency> {
    return this.prisma.agency.update({ where: { id }, data })
  }
  
  async delete(id: string): Promise<boolean> {
    await this.prisma.agency.delete({ where: { id } })
    return true
  }
}
