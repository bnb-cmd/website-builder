import { PrismaClient } from '@prisma/client'
import { BaseService } from './baseService'

interface DomainSearchResult {
  domain: string
  available: boolean
  price: number
  currency: 'PKR' | 'USD'
  suggestedAlternatives?: string[]
}

interface DomainRegistration {
  userId: string
  domain: string
  websiteId?: string
  autoRenew: boolean
  privacyProtection: boolean
  pricing: DomainPricing
}

interface DomainPricing {
  registration: number
  renewal: number
  transfer: number
  currency: 'PKR' | 'USD'
}

interface DNSRecord {
  id: string
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS'
  name: string
  value: string
  ttl: number
  priority?: number
}

interface SSLStatus {
  status: 'active' | 'pending' | 'expired' | 'none'
  issuer?: string
  expiryDate?: Date
  autoRenew: boolean
}

export class DomainService extends BaseService {
  private prisma: PrismaClient

  constructor() {
    super()
    this.prisma = new PrismaClient()
  }

  async searchDomains(query: string, extensions?: string[]): Promise<DomainSearchResult[]> {
    const defaultExtensions = ['.pk', '.com.pk', '.org.pk', '.com', '.org', '.net']
    const searchExtensions = extensions || defaultExtensions
    
    const results: DomainSearchResult[] = []
    
    for (const extension of searchExtensions) {
      const fullDomain = `${query}${extension}`
      const isAvailable = await this.checkDomainAvailability(fullDomain)
      const pricing = await this.getDomainPricing(extension)
      
      results.push({
        domain: fullDomain,
        available: isAvailable,
        price: pricing.registration,
        currency: pricing.currency
      })
      
      // If domain is not available, suggest alternatives
      if (!isAvailable) {
        const alternatives = await this.generateDomainAlternatives(query, extension)
        const lastResult = results[results.length - 1]
        lastResult.suggestedAlternatives = alternatives
      }
    }
    
    return results
  }

  async checkDomainAvailability(domain: string): Promise<boolean> {
    try {
      // In a real implementation, this would integrate with domain registrars
      // For now, we'll simulate availability based on domain patterns
      const unavailablePatterns = [
        'google', 'facebook', 'twitter', 'instagram', 'youtube', 'amazon',
        'microsoft', 'apple', 'netflix', 'spotify', 'uber', 'airbnb'
      ]
      
      const domainName = domain.split('.')[0].toLowerCase()
      return !unavailablePatterns.some(pattern => domainName.includes(pattern))
    } catch (error) {
      console.error('Error checking domain availability:', error)
      return false
    }
  }

  async generateDomainAlternatives(query: string, extension: string): Promise<string[]> {
    const alternatives: string[] = []
    const currentYear = new Date().getFullYear()
    
    // Generate common alternatives
    alternatives.push(`${query}${currentYear}${extension}`)
    alternatives.push(`${query}-pk${extension}`)
    alternatives.push(`${query}-official${extension}`)
    alternatives.push(`${query}-online${extension}`)
    alternatives.push(`${query}-site${extension}`)
    
    return alternatives.slice(0, 3) // Return top 3 alternatives
  }

  async getDomainPricing(extension: string): Promise<DomainPricing> {
    const pricingMap: Record<string, DomainPricing> = {
      '.pk': { registration: 2500, renewal: 2500, transfer: 2500, currency: 'PKR' },
      '.com.pk': { registration: 1800, renewal: 1800, transfer: 1800, currency: 'PKR' },
      '.org.pk': { registration: 2000, renewal: 2000, transfer: 2000, currency: 'PKR' },
      '.net.pk': { registration: 2000, renewal: 2000, transfer: 2000, currency: 'PKR' },
      '.com': { registration: 15, renewal: 15, transfer: 15, currency: 'USD' },
      '.org': { registration: 15, renewal: 15, transfer: 15, currency: 'USD' },
      '.net': { registration: 15, renewal: 15, transfer: 15, currency: 'USD' }
    }
    
    return pricingMap[extension] || pricingMap['.com']
  }

  async registerDomain(registration: DomainRegistration) {
    try {
      // Create domain record in database
      const domain = await this.prisma.domain.create({
        data: {
          userId: registration.userId,
          domain: registration.domain,
          websiteId: registration.websiteId,
          status: 'pending',
          autoRenew: registration.autoRenew,
          privacyProtection: registration.privacyProtection,
          pricing: registration.pricing,
          registrationDate: new Date(),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
        }
      })

      // In a real implementation, this would integrate with domain registrars
      // For now, we'll simulate the registration process
      await this.simulateDomainRegistration(domain.id)

      return domain
    } catch (error) {
      console.error('Error registering domain:', error)
      throw new Error('Failed to register domain')
    }
  }

  async simulateDomainRegistration(domainId: string) {
    // Simulate async domain registration process
    setTimeout(async () => {
      try {
        await this.prisma.domain.update({
          where: { id: domainId },
          data: { 
            status: 'active',
            registrationDate: new Date()
          }
        })
        
        // Set up default DNS records
        await this.setupDefaultDNSRecords(domainId)
        
        // Request SSL certificate
        await this.requestSSLCertificate(domainId, 'system')
      } catch (error) {
        console.error('Error in domain registration simulation:', error)
      }
    }, 5000) // Simulate 5-second registration process
  }

  async setupDefaultDNSRecords(domainId: string) {
    const defaultRecords = [
      {
        type: 'A' as const,
        name: '@',
        value: process.env.DEFAULT_IP || '192.168.1.100',
        ttl: 3600
      },
      {
        type: 'CNAME' as const,
        name: 'www',
        value: `${domainId}.websitebuilder.pk`,
        ttl: 3600
      }
    ]

    for (const record of defaultRecords) {
      await this.prisma.dNSRecord.create({
        data: {
          domainId,
          ...record
        }
      })
    }
  }

  async getUserDomains(userId: string) {
    return await this.prisma.domain.findMany({
      where: { userId },
      include: {
        dnsRecords: true,
        website: {
          select: {
            id: true,
            title: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async getDomainById(domainId: string, userId: string) {
    return await this.prisma.domain.findFirst({
      where: { 
        id: domainId,
        userId 
      },
      include: {
        dnsRecords: true,
        website: {
          select: {
            id: true,
            title: true,
            status: true
          }
        }
      }
    })
  }

  async updateDomain(domainId: string, userId: string, updates: any) {
    return await this.prisma.domain.update({
      where: { 
        id: domainId,
        userId 
      },
      data: updates,
      include: {
        dnsRecords: true,
        website: {
          select: {
            id: true,
            title: true,
            status: true
          }
        }
      }
    })
  }

  async connectDomainToWebsite(domainId: string, websiteId: string, userId: string) {
    // Verify website belongs to user
    const website = await this.prisma.website.findFirst({
      where: { 
        id: websiteId,
        userId 
      }
    })

    if (!website) {
      throw new Error('Website not found or access denied')
    }

    return await this.prisma.domain.update({
      where: { 
        id: domainId,
        userId 
      },
      data: { 
        websiteId,
        status: 'active'
      },
      include: {
        dnsRecords: true,
        website: {
          select: {
            id: true,
            title: true,
            status: true
          }
        }
      }
    })
  }

  async getDNSRecords(domainId: string, userId: string) {
    const domain = await this.prisma.domain.findFirst({
      where: { 
        id: domainId,
        userId 
      }
    })

    if (!domain) {
      throw new Error('Domain not found or access denied')
    }

    return await this.prisma.dNSRecord.findMany({
      where: { domainId },
      orderBy: { createdAt: 'asc' }
    })
  }

  async addDNSRecord(domainId: string, userId: string, record: Omit<DNSRecord, 'id'>) {
    const domain = await this.prisma.domain.findFirst({
      where: { 
        id: domainId,
        userId 
      }
    })

    if (!domain) {
      throw new Error('Domain not found or access denied')
    }

    return await this.prisma.dNSRecord.create({
      data: {
        domainId,
        ...record
      }
    })
  }

  async updateDNSRecord(domainId: string, recordId: string, userId: string, updates: Partial<Omit<DNSRecord, 'id'>>) {
    const domain = await this.prisma.domain.findFirst({
      where: { 
        id: domainId,
        userId 
      }
    })

    if (!domain) {
      throw new Error('Domain not found or access denied')
    }

    return await this.prisma.dNSRecord.update({
      where: { 
        id: recordId,
        domainId 
      },
      data: updates
    })
  }

  async deleteDNSRecord(domainId: string, recordId: string, userId: string) {
    const domain = await this.prisma.domain.findFirst({
      where: { 
        id: domainId,
        userId 
      }
    })

    if (!domain) {
      throw new Error('Domain not found or access denied')
    }

    await this.prisma.dNSRecord.delete({
      where: { 
        id: recordId,
        domainId 
      }
    })
  }

  async renewDomain(domainId: string, userId: string, years: number) {
    const domain = await this.prisma.domain.findFirst({
      where: { 
        id: domainId,
        userId 
      }
    })

    if (!domain) {
      throw new Error('Domain not found or access denied')
    }

    const newExpiryDate = new Date(domain.expiryDate.getTime() + years * 365 * 24 * 60 * 60 * 1000)

    return await this.prisma.domain.update({
      where: { id: domainId },
      data: { 
        expiryDate: newExpiryDate,
        status: 'active'
      }
    })
  }

  async transferDomain(domainId: string, userId: string, authCode: string) {
    const domain = await this.prisma.domain.findFirst({
      where: { 
        id: domainId,
        userId 
      }
    })

    if (!domain) {
      throw new Error('Domain not found or access denied')
    }

    // In a real implementation, this would initiate domain transfer with registrar
    return await this.prisma.domain.update({
      where: { id: domainId },
      data: { 
        status: 'transferring',
        transferAuthCode: authCode
      }
    })
  }

  async getSSLStatus(domainId: string, userId: string): Promise<SSLStatus> {
    const domain = await this.prisma.domain.findFirst({
      where: { 
        id: domainId,
        userId 
      }
    })

    if (!domain) {
      throw new Error('Domain not found or access denied')
    }

    // In a real implementation, this would check actual SSL certificate status
    return {
      status: 'active',
      issuer: 'Let\'s Encrypt',
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      autoRenew: true
    }
  }

  async requestSSLCertificate(domainId: string, userId: string) {
    const domain = await this.prisma.domain.findFirst({
      where: { 
        id: domainId,
        userId: userId === 'system' ? undefined : userId
      }
    })

    if (!domain) {
      throw new Error('Domain not found or access denied')
    }

    // In a real implementation, this would request SSL certificate from Let's Encrypt or similar
    return {
      status: 'pending',
      issuer: 'Let\'s Encrypt',
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      autoRenew: true
    }
  }

  async checkExpiringDomains() {
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    
    const expiringDomains = await this.prisma.domain.findMany({
      where: {
        expiryDate: {
          lte: thirtyDaysFromNow
        },
        status: 'active'
      },
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    })

    // Send renewal reminders
    for (const domain of expiringDomains) {
      await this.sendRenewalReminder(domain)
    }

    return expiringDomains
  }

  async sendRenewalReminder(domain: any) {
    // In a real implementation, this would send email notifications
    console.log(`Sending renewal reminder for domain: ${domain.domain} to ${domain.user.email}`)
  }
}
