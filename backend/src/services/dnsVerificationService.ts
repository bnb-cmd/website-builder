import { PrismaClient } from '@prisma/client'
import { BaseService } from './baseService'

interface DNSRecord {
  type: string
  name: string
  value: string
  ttl: number
}

interface DNSVerificationResult {
  isValid: boolean
  records: DNSRecord[]
  responseTime: number
  provider: string
  error?: string
  lastChecked: Date
}

interface DNSProvider {
  name: string
  baseUrl: string
  apiKey?: string
  rateLimit: number
  cost: string
}

export class DNSVerificationService extends BaseService {
  private prisma: PrismaClient
  private providers: DNSProvider[]
  private currentProviderIndex: number = 0

  constructor() {
    super()
    this.prisma = new PrismaClient()
    
    // Configure multiple DNS providers for failover
    this.providers = [
      {
        name: 'DNSimple',
        baseUrl: 'https://api.dnsimple.com/v2',
        apiKey: process.env.DNSIMPLE_API_KEY,
        rateLimit: 1000,
        cost: '$5/month'
      },
      {
        name: 'Namecheap',
        baseUrl: 'https://api.namecheap.com/xml.response',
        apiKey: process.env.NAMECHEAP_API_KEY,
        rateLimit: 3000,
        cost: 'FREE'
      },
      {
        name: 'GoDaddy',
        baseUrl: 'https://api.godaddy.com/v1',
        apiKey: process.env.GODADDY_API_KEY,
        rateLimit: 1000,
        cost: 'FREE'
      },
      {
        name: 'Cloudflare',
        baseUrl: 'https://api.cloudflare.com/client/v4',
        apiKey: process.env.CLOUDFLARE_API_KEY,
        rateLimit: 1200,
        cost: 'FREE'
      }
    ]
  }

  /**
   * Verify domain DNS configuration using external APIs
   */
  async verifyDomainDNS(domain: string, expectedRecords: DNSRecord[]): Promise<DNSVerificationResult> {
    const startTime = Date.now()
    
    // Try each provider until one succeeds
    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[this.currentProviderIndex]
      
      try {
        const result = await this.queryDNSWithProvider(domain, provider, expectedRecords)
        
        if (result.isValid) {
          // Rotate to next provider for load balancing
          this.currentProviderIndex = (this.currentProviderIndex + 1) % this.providers.length
          
          return {
            ...result,
            responseTime: Date.now() - startTime,
            provider: provider.name,
            lastChecked: new Date()
          }
        }
      } catch (error) {
        console.warn(`DNS verification failed with ${provider.name}:`, error.message)
        
        // Try next provider
        this.currentProviderIndex = (this.currentProviderIndex + 1) % this.providers.length
      }
    }
    
    // All providers failed
    return {
      isValid: false,
      records: [],
      responseTime: Date.now() - startTime,
      provider: 'All providers failed',
      error: 'All DNS providers are currently unavailable',
      lastChecked: new Date()
    }
  }

  /**
   * Query DNS records using a specific provider
   */
  private async queryDNSWithProvider(
    domain: string, 
    provider: DNSProvider, 
    expectedRecords: DNSRecord[]
  ): Promise<Omit<DNSVerificationResult, 'responseTime' | 'provider' | 'lastChecked'>> {
    
    switch (provider.name) {
      case 'DNSimple':
        return await this.queryDNSimple(domain, provider, expectedRecords)
      case 'Namecheap':
        return await this.queryNamecheap(domain, provider, expectedRecords)
      case 'GoDaddy':
        return await this.queryGoDaddy(domain, provider, expectedRecords)
      case 'Cloudflare':
        return await this.queryCloudflare(domain, provider, expectedRecords)
      default:
        throw new Error(`Unsupported provider: ${provider.name}`)
    }
  }

  /**
   * DNSimple API implementation
   */
  private async queryDNSimple(
    domain: string, 
    provider: DNSProvider, 
    expectedRecords: DNSRecord[]
  ) {
    if (!provider.apiKey) {
      throw new Error('DNSimple API key not configured')
    }

    const response = await fetch(`${provider.baseUrl}/records`, {
      headers: {
        'Authorization': `Bearer ${provider.apiKey}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`DNSimple API error: ${response.status}`)
    }

    const data = await response.json()
    const records = data.data || []

    return this.validateRecords(records, expectedRecords)
  }

  /**
   * Namecheap API implementation
   */
  private async queryNamecheap(
    domain: string, 
    provider: DNSProvider, 
    expectedRecords: DNSRecord[]
  ) {
    if (!provider.apiKey) {
      throw new Error('Namecheap API key not configured')
    }

    const params = new URLSearchParams({
      ApiUser: process.env.NAMECHEAP_API_USER || '',
      ApiKey: provider.apiKey,
      UserName: process.env.NAMECHEAP_USERNAME || '',
      Command: 'namecheap.domains.dns.getList',
      ClientIp: process.env.NAMECHEAP_CLIENT_IP || '127.0.0.1',
      Domain: domain
    })

    const response = await fetch(`${provider.baseUrl}?${params}`)
    const xmlText = await response.text()
    
    // Parse XML response (simplified)
    const records = this.parseNamecheapXML(xmlText)

    return this.validateRecords(records, expectedRecords)
  }

  /**
   * GoDaddy API implementation
   */
  private async queryGoDaddy(
    domain: string, 
    provider: DNSProvider, 
    expectedRecords: DNSRecord[]
  ) {
    if (!provider.apiKey) {
      throw new Error('GoDaddy API key not configured')
    }

    const response = await fetch(`${provider.baseUrl}/domains/${domain}/records`, {
      headers: {
        'Authorization': `sso-key ${provider.apiKey}:${process.env.GODADDY_API_SECRET}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`GoDaddy API error: ${response.status}`)
    }

    const records = await response.json()

    return this.validateRecords(records, expectedRecords)
  }

  /**
   * Cloudflare API implementation
   */
  private async queryCloudflare(
    domain: string, 
    provider: DNSProvider, 
    expectedRecords: DNSRecord[]
  ) {
    if (!provider.apiKey) {
      throw new Error('Cloudflare API key not configured')
    }

    // Get zone ID first
    const zoneResponse = await fetch(`${provider.baseUrl}/zones?name=${domain}`, {
      headers: {
        'Authorization': `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    const zoneData = await zoneResponse.json()
    const zoneId = zoneData.result?.[0]?.id

    if (!zoneId) {
      throw new Error('Zone not found in Cloudflare')
    }

    // Get DNS records
    const recordsResponse = await fetch(`${provider.baseUrl}/zones/${zoneId}/dns_records`, {
      headers: {
        'Authorization': `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    const recordsData = await recordsResponse.json()
    const records = recordsData.result || []

    return this.validateRecords(records, expectedRecords)
  }

  /**
   * Validate DNS records against expected configuration
   */
  private validateRecords(actualRecords: any[], expectedRecords: DNSRecord[]): Omit<DNSVerificationResult, 'responseTime' | 'provider' | 'lastChecked'> {
    const isValid = expectedRecords.every(expected => {
      return actualRecords.some(actual => {
        return actual.type === expected.type &&
               actual.name === expected.name &&
               actual.value === expected.value
      })
    })

    return {
      isValid,
      records: actualRecords.map(record => ({
        type: record.type,
        name: record.name,
        value: record.value,
        ttl: record.ttl || 3600
      }))
    }
  }

  /**
   * Parse Namecheap XML response (simplified)
   */
  private parseNamecheapXML(xmlText: string): DNSRecord[] {
    // This is a simplified XML parser
    // In production, use a proper XML parsing library like 'xml2js'
    const records: DNSRecord[] = []
    
    // Extract DNS records from XML (simplified regex approach)
    const recordRegex = /<record.*?type="([^"]*)".*?name="([^"]*)".*?value="([^"]*)".*?ttl="([^"]*)"/g
    let match
    
    while ((match = recordRegex.exec(xmlText)) !== null) {
      records.push({
        type: match[1],
        name: match[2],
        value: match[3],
        ttl: parseInt(match[4])
      })
    }
    
    return records
  }

  /**
   * Start automated verification for a domain
   */
  async startAutomatedVerification(domainId: string, intervalMinutes: number = 5) {
    const domain = await this.prisma.domain.findUnique({
      where: { id: domainId }
    })

    if (!domain) {
      throw new Error('Domain not found')
    }

    // Expected DNS records for this domain
    const expectedRecords: DNSRecord[] = [
      {
        type: 'A',
        name: '@',
        value: process.env.PLATFORM_IP || '192.168.1.100',
        ttl: 3600
      },
      {
        type: 'CNAME',
        name: 'www',
        value: `${domain.subdomain || 'default'}.webbuilder.com`,
        ttl: 3600
      }
    ]

    // Start verification polling
    const intervalId = setInterval(async () => {
      try {
        const verification = await this.verifyDomainDNS(domain.domain, expectedRecords)
        
        // Update domain status
        await this.prisma.domain.update({
          where: { id: domainId },
          data: {
            status: verification.isValid ? 'active' : 'pending_verification',
            lastVerified: verification.lastChecked,
            verificationData: JSON.stringify(verification)
          }
        })

        // Send notifications if status changed
        if (verification.isValid && domain.status !== 'active') {
          await this.sendVerificationSuccessNotification(domain.userId, domain.domain)
        } else if (!verification.isValid && domain.status === 'active') {
          await this.sendVerificationFailureNotification(domain.userId, domain.domain)
        }

        // Log verification result
        console.log(`Domain verification for ${domain.domain}:`, {
          isValid: verification.isValid,
          provider: verification.provider,
          responseTime: verification.responseTime
        })

      } catch (error) {
        console.error(`Verification error for domain ${domain.domain}:`, error)
      }
    }, intervalMinutes * 60 * 1000)

    // Store interval ID for cleanup
    await this.prisma.domain.update({
      where: { id: domainId },
      data: {
        verificationIntervalId: intervalId.toString()
      }
    })

    return intervalId
  }

  /**
   * Stop automated verification for a domain
   */
  async stopAutomatedVerification(domainId: string) {
    const domain = await this.prisma.domain.findUnique({
      where: { id: domainId }
    })

    if (domain?.verificationIntervalId) {
      clearInterval(parseInt(domain.verificationIntervalId))
      
      await this.prisma.domain.update({
        where: { id: domainId },
        data: {
          verificationIntervalId: null
        }
      })
    }
  }

  /**
   * Send verification success notification
   */
  private async sendVerificationSuccessNotification(userId: string, domain: string) {
    // Implement notification logic (email, push notification, etc.)
    console.log(`✅ Domain ${domain} verification successful for user ${userId}`)
    
    // You can integrate with your notification service here
    // await this.notificationService.sendEmail(userId, {
    //   subject: 'Domain Verification Successful',
    //   body: `Your domain ${domain} has been successfully verified and is now active.`
    // })
  }

  /**
   * Send verification failure notification
   */
  private async sendVerificationFailureNotification(userId: string, domain: string) {
    // Implement notification logic
    console.log(`❌ Domain ${domain} verification failed for user ${userId}`)
    
    // await this.notificationService.sendEmail(userId, {
    //   subject: 'Domain Verification Failed',
    //   body: `Your domain ${domain} verification failed. Please check your DNS configuration.`
    // })
  }

  /**
   * Get verification statistics
   */
  async getVerificationStats() {
    const stats = await this.prisma.domain.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    })

    const totalDomains = await this.prisma.domain.count()
    const activeDomains = stats.find(s => s.status === 'active')?._count.status || 0
    const pendingDomains = stats.find(s => s.status === 'pending_verification')?._count.status || 0

    return {
      total: totalDomains,
      active: activeDomains,
      pending: pendingDomains,
      successRate: totalDomains > 0 ? (activeDomains / totalDomains) * 100 : 0,
      providers: this.providers.map(p => ({
        name: p.name,
        cost: p.cost,
        rateLimit: p.rateLimit
      }))
    }
  }

  /**
   * Override BaseService methods
   */
  protected async handleError(error: Error, context: string): Promise<void> {
    console.error(`DNS Verification Service Error [${context}]:`, error)
  }

  protected async logActivity(activity: string, metadata?: any): Promise<void> {
    console.log(`DNS Verification Activity: ${activity}`, metadata)
  }
}
