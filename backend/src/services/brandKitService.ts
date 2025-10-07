import { PrismaClient } from '@prisma/client'
import { BaseService } from './baseService'

interface BrandKit {
  id: string
  userId: string
  name: string
  description?: string
  websiteId?: string
  inheritsFrom?: string
  isDefault: boolean
  logo?: {
    primary?: string
    secondary?: string
    favicon?: string
    variations?: string[]
  }
  colors?: {
    primary?: string
    secondary?: string
    accent?: string
    neutral?: string[]
    success?: string
    warning?: string
    error?: string
  }
  typography?: {
    heading?: string
    body?: string
    accent?: string
    sizes?: {
      h1?: string
      h2?: string
      h3?: string
      h4?: string
      h5?: string
      h6?: string
      body?: string
      small?: string
    }
  }
  imagery?: {
    style?: string
    mood?: string
    templates?: string[]
  }
  guidelines?: {
    logoUsage?: string
    colorUsage?: string
    spacing?: string
  }
  createdAt: Date
  updatedAt: Date
}

interface CreateBrandKitData {
  userId: string
  name: string
  description?: string
  websiteId?: string
  inheritsFrom?: string
  logo?: any
  colors?: any
  typography?: any
  imagery?: any
  guidelines?: any
}

interface BrandKitStats {
  websitesUsing: number
  assetsCount: number
  lastUsed: Date
  viewsCount: number
}

export class BrandKitService extends BaseService {
  private prisma: PrismaClient

  constructor() {
    super()
    this.prisma = new PrismaClient()
  }

  async getUserBrandKits(userId: string): Promise<BrandKit[]> {
    try {
      // This would query the database for user's brand kits
      // For now, returning mock data
      return [
        {
          id: 'global-1',
          userId,
          name: 'My Company Brand',
          description: 'Main brand identity for all projects',
          isDefault: true,
          logo: {
            primary: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200',
            secondary: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200',
            favicon: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=32'
          },
          colors: {
            primary: '#3B82F6',
            secondary: '#10B981',
            accent: '#F59E0B',
            neutral: ['#F9FAFB', '#6B7280', '#111827']
          },
          typography: {
            heading: 'Inter',
            body: 'Inter',
            accent: 'Playfair Display'
          },
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-15')
        }
      ]
    } catch (error) {
      console.error('Error fetching user brand kits:', error)
      throw new Error('Failed to fetch brand kits')
    }
  }

  async getGlobalBrandKit(userId: string): Promise<BrandKit | null> {
    try {
      const brandKits = await this.getUserBrandKits(userId)
      return brandKits.find(kit => kit.isDefault) || null
    } catch (error) {
      console.error('Error fetching global brand kit:', error)
      throw new Error('Failed to fetch global brand kit')
    }
  }

  async getBrandKitById(id: string, userId: string): Promise<BrandKit | null> {
    try {
      const brandKits = await this.getUserBrandKits(userId)
      return brandKits.find(kit => kit.id === id) || null
    } catch (error) {
      console.error('Error fetching brand kit by ID:', error)
      throw new Error('Failed to fetch brand kit')
    }
  }

  async createBrandKit(data: CreateBrandKitData): Promise<BrandKit> {
    try {
      // This would create a new brand kit in the database
      const brandKit: BrandKit = {
        id: `brand-${Date.now()}`,
        userId: data.userId,
        name: data.name,
        description: data.description,
        websiteId: data.websiteId,
        inheritsFrom: data.inheritsFrom,
        isDefault: false,
        logo: data.logo,
        colors: data.colors,
        typography: data.typography,
        imagery: data.imagery,
        guidelines: data.guidelines,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // If inheriting from global brand kit, merge the data
      if (data.inheritsFrom) {
        const globalBrandKit = await this.getGlobalBrandKit(data.userId)
        if (globalBrandKit) {
          brandKit.logo = { ...globalBrandKit.logo, ...data.logo }
          brandKit.colors = { ...globalBrandKit.colors, ...data.colors }
          brandKit.typography = { ...globalBrandKit.typography, ...data.typography }
          brandKit.imagery = { ...globalBrandKit.imagery, ...data.imagery }
          brandKit.guidelines = { ...globalBrandKit.guidelines, ...data.guidelines }
        }
      }

      console.log('Created brand kit:', brandKit)
      return brandKit
    } catch (error) {
      console.error('Error creating brand kit:', error)
      throw new Error('Failed to create brand kit')
    }
  }

  async updateBrandKit(id: string, userId: string, updates: Partial<BrandKit>): Promise<BrandKit | null> {
    try {
      const brandKit = await this.getBrandKitById(id, userId)
      if (!brandKit) {
        return null
      }

      const updatedBrandKit = {
        ...brandKit,
        ...updates,
        updatedAt: new Date()
      }

      console.log('Updated brand kit:', updatedBrandKit)
      return updatedBrandKit
    } catch (error) {
      console.error('Error updating brand kit:', error)
      throw new Error('Failed to update brand kit')
    }
  }

  async deleteBrandKit(id: string, userId: string): Promise<boolean> {
    try {
      const brandKit = await this.getBrandKitById(id, userId)
      if (!brandKit) {
        return false
      }

      // Don't allow deletion of global brand kit
      if (brandKit.isDefault) {
        throw new Error('Cannot delete global brand kit')
      }

      console.log('Deleted brand kit:', id)
      return true
    } catch (error) {
      console.error('Error deleting brand kit:', error)
      throw new Error('Failed to delete brand kit')
    }
  }

  async duplicateBrandKit(id: string, userId: string): Promise<BrandKit | null> {
    try {
      const originalBrandKit = await this.getBrandKitById(id, userId)
      if (!originalBrandKit) {
        return null
      }

      const duplicatedBrandKit: BrandKit = {
        ...originalBrandKit,
        id: `brand-${Date.now()}`,
        name: `${originalBrandKit.name} (Copy)`,
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      console.log('Duplicated brand kit:', duplicatedBrandKit)
      return duplicatedBrandKit
    } catch (error) {
      console.error('Error duplicating brand kit:', error)
      throw new Error('Failed to duplicate brand kit')
    }
  }

  async applyBrandKitToWebsite(brandKitId: string, websiteId: string, userId: string): Promise<boolean> {
    try {
      const brandKit = await this.getBrandKitById(brandKitId, userId)
      if (!brandKit) {
        return false
      }

      // This would apply the brand kit to the website
      console.log(`Applied brand kit ${brandKitId} to website ${websiteId}`)
      return true
    } catch (error) {
      console.error('Error applying brand kit to website:', error)
      throw new Error('Failed to apply brand kit to website')
    }
  }

  async exportBrandKit(id: string, userId: string): Promise<any> {
    try {
      const brandKit = await this.getBrandKitById(id, userId)
      if (!brandKit) {
        return null
      }

      const exportData = {
        brandKit,
        exportedAt: new Date(),
        version: '1.0',
        format: 'json'
      }

      console.log('Exported brand kit:', exportData)
      return exportData
    } catch (error) {
      console.error('Error exporting brand kit:', error)
      throw new Error('Failed to export brand kit')
    }
  }

  async uploadBrandAsset(brandKitId: string, userId: string, assetData: any): Promise<string | null> {
    try {
      const brandKit = await this.getBrandKitById(brandKitId, userId)
      if (!brandKit) {
        return null
      }

      // This would handle file upload to cloud storage
      const assetUrl = `https://storage.example.com/brand-assets/${brandKitId}/${assetData.filename}`
      
      console.log('Uploaded brand asset:', assetUrl)
      return assetUrl
    } catch (error) {
      console.error('Error uploading brand asset:', error)
      throw new Error('Failed to upload brand asset')
    }
  }

  async getBrandKitStats(id: string, userId: string): Promise<BrandKitStats | null> {
    try {
      const brandKit = await this.getBrandKitById(id, userId)
      if (!brandKit) {
        return null
      }

      const stats: BrandKitStats = {
        websitesUsing: brandKit.isDefault ? 5 : 1,
        assetsCount: Object.keys(brandKit.logo || {}).length + 
                    Object.keys(brandKit.colors || {}).length +
                    Object.keys(brandKit.typography || {}).length,
        lastUsed: brandKit.updatedAt,
        viewsCount: Math.floor(Math.random() * 100)
      }

      return stats
    } catch (error) {
      console.error('Error fetching brand kit stats:', error)
      throw new Error('Failed to fetch brand kit stats')
    }
  }

  // Override methods from BaseService
  async validateUserAccess(userId: string, resourceId: string): Promise<boolean> {
    try {
      const brandKit = await this.getBrandKitById(resourceId, userId)
      return brandKit !== null
    } catch (error) {
      return false
    }
  }

  async logActivity(userId: string, action: string, details: any): Promise<void> {
    console.log(`Brand Kit Activity: ${action} by user ${userId}`, details)
  }
}
