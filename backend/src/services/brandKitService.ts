import { PrismaClient, BrandKit } from '@prisma/client'
import { BaseService } from './baseService'

export interface BrandKitData {
  name: string
  description?: string
  inheritsFrom?: string
  isDefault?: boolean
  logoPrimary?: string
  logoSecondary?: string
  logoFavicon?: string
  logoVariations?: string
  colorPrimary?: string
  colorSecondary?: string
  colorAccent?: string
  colorNeutral?: string
  colorSuccess?: string
  colorWarning?: string
  colorError?: string
  fontHeading?: string
  fontBody?: string
  fontAccent?: string
  fontSizeH1?: string
  fontSizeH2?: string
  fontSizeH3?: string
  fontSizeH4?: string
  fontSizeH5?: string
  fontSizeH6?: string
  fontSizeBody?: string
  fontSizeSmall?: string
  imageStyle?: string
  imageMood?: string
  imageTemplates?: string
  logoUsageRules?: string
  colorUsageRules?: string
  spacingRules?: string
  typographyRules?: string
  imageGuidelines?: string
}

export interface BrandKitAnalytics {
  totalViews: number
  websitesUsing: number
  assetsCount: number
  lastUsed: Date
  viewsCount: number
}

export class BrandKitService extends BaseService<BrandKit> {
  constructor() {
    super()
  }

  protected getModelName(): string {
    return 'brandKit'
  }

  // Implement required BaseService methods
  override async create(data: Partial<BrandKit>): Promise<BrandKit> {
    try {
      const brandKit = await this.prisma.brandKit.create({
        data: data as any
      })
      return brandKit
    } catch (error) {
      this.handleError(error)
    }
  }

  override async findById(id: string): Promise<BrandKit | null> {
    try {
      this.validateId(id)
      
      const brandKit = await this.prisma.brandKit.findUnique({
        where: { id }
      })
      
      return brandKit
    } catch (error) {
      this.handleError(error)
    }
  }

  override async findAll(filters?: any): Promise<BrandKit[]> {
    try {
      const brandKits = await this.prisma.brandKit.findMany({
        where: filters || {},
        orderBy: { createdAt: 'desc' }
      })
      return brandKits
    } catch (error) {
      this.handleError(error)
    }
  }

  override async update(id: string, data: Partial<BrandKit>): Promise<BrandKit> {
    try {
      this.validateId(id)
      
      const brandKit = await this.prisma.brandKit.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      })
      
      return brandKit
    } catch (error) {
      this.handleError(error)
    }
  }

  override async delete(id: string): Promise<boolean> {
    try {
      this.validateId(id)
      
      await this.prisma.brandKit.delete({
        where: { id }
      })
      
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  override async count(filters?: any): Promise<number> {
    try {
      return await this.prisma.brandKit.count({ where: filters })
    } catch (error) {
      this.handleError(error)
    }
  }

  override async bulkCreate(data: Partial<BrandKit>[]): Promise<BrandKit[]> {
    throw new Error('Bulk create not implemented for brand kits')
  }

  override async bulkUpdate(updates: { id: string; data: Partial<BrandKit> }[]): Promise<BrandKit[]> {
    throw new Error('Bulk update not implemented for brand kits')
  }

  override async bulkDelete(ids: string[]): Promise<number> {
    try {
      const result = await this.prisma.brandKit.deleteMany({
        where: { id: { in: ids } }
      })
      return result.count
    } catch (error) {
      this.handleError(error)
    }
  }

  // Brand Kit Management Methods
  async createBrandKit(userId: string, data: BrandKitData): Promise<BrandKit> {
    try {
      this.validateId(userId)
      
      const brandKit = await this.prisma.brandKit.create({
        data: {
          userId,
          name: data.name,
          description: data.description,
          inheritsFrom: data.inheritsFrom,
          isDefault: data.isDefault || false,
          logoPrimary: data.logoPrimary,
          logoSecondary: data.logoSecondary,
          logoFavicon: data.logoFavicon,
          logoVariations: data.logoVariations,
          colorPrimary: data.colorPrimary,
          colorSecondary: data.colorSecondary,
          colorAccent: data.colorAccent,
          colorNeutral: data.colorNeutral,
          colorSuccess: data.colorSuccess,
          colorWarning: data.colorWarning,
          colorError: data.colorError,
          fontHeading: data.fontHeading,
          fontBody: data.fontBody,
          fontAccent: data.fontAccent,
          fontSizeH1: data.fontSizeH1,
          fontSizeH2: data.fontSizeH2,
          fontSizeH3: data.fontSizeH3,
          fontSizeH4: data.fontSizeH4,
          fontSizeH5: data.fontSizeH5,
          fontSizeH6: data.fontSizeH6,
          fontSizeBody: data.fontSizeBody,
          fontSizeSmall: data.fontSizeSmall,
          imageStyle: data.imageStyle,
          imageMood: data.imageMood,
          imageTemplates: data.imageTemplates,
          logoUsageRules: data.logoUsageRules,
          colorUsageRules: data.colorUsageRules,
          spacingRules: data.spacingRules,
          typographyRules: data.typographyRules,
          imageGuidelines: data.imageGuidelines,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      await this.invalidateCache(`brandKit:user:${userId}`)
      return brandKit
    } catch (error) {
      this.handleError(error)
    }
  }

  async getBrandKitsByUser(userId: string): Promise<BrandKit[]> {
    try {
      this.validateId(userId)
      
      const brandKits = await this.prisma.brandKit.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      })
      
      return brandKits
    } catch (error) {
      this.handleError(error)
    }
  }

  async applyToWebsite(brandKitId: string, websiteId: string): Promise<boolean> {
    try {
      this.validateId(brandKitId)
      this.validateId(websiteId)
      
      // Update website to reference this brand kit
      await this.prisma.website.update({
        where: { id: websiteId },
        data: { updatedAt: new Date() }
      })
      
      // Log the application
      await this.logActivity(brandKitId, 'APPLIED_TO_WEBSITE', { websiteId })
      
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  async getBrandKitAnalytics(brandKitId: string): Promise<BrandKitAnalytics> {
    try {
      this.validateId(brandKitId)
      
      // Mock analytics data - in real implementation, this would query actual usage data
      return {
        totalViews: 0,
        websitesUsing: 0,
        assetsCount: 0,
        lastUsed: new Date(),
        viewsCount: 0
      }
    } catch (error) {
      this.handleError(error)
    }
  }

  async uploadBrandAsset(brandKitId: string, assetData: {
    type: string
    file: string
    filename: string
    mimeType: string
  }): Promise<any> {
    try {
      this.validateId(brandKitId)
      
      // Mock upload - in real implementation, this would handle file upload
      return {
        id: 'mock-asset-id',
        url: 'mock-url',
        type: assetData.type,
        filename: assetData.filename
      }
    } catch (error) {
      this.handleError(error)
    }
  }

  async getBrandTemplates(brandKitId: string): Promise<any[]> {
    try {
      this.validateId(brandKitId)
      
      // Mock templates - in real implementation, this would query template data
      return []
    } catch (error) {
      this.handleError(error)
    }
  }

  async logActivity(brandKitId: string, action: string, details: any): Promise<void> {
    console.log(`Brand Kit Activity: ${action} for brand kit ${brandKitId}`, details)
  }
}

export const brandKitService = new BrandKitService()