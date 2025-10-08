import { PrismaClient } from '@prisma/client'
import { BaseService } from './baseService'

export interface ImageLibraryData {
  name: string
  category: string
  tags: string[]
  url: string
  thumbnail: string
  width: number
  height: number
  source: string
  license: string
  isPremium?: boolean
}

export interface ImageSearchFilters {
  category?: string
  tags?: string[]
  isPremium?: boolean
  source?: string
  orientation?: 'landscape' | 'portrait' | 'square'
  color?: string
}

export interface ImageSearchResult {
  images: ImageLibraryData[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export class ImageLibraryService extends BaseService {
  private prisma: PrismaClient

  constructor() {
    super()
    this.prisma = new PrismaClient()
  }

  async getImages(filters: ImageSearchFilters = {}, page = 1, limit = 20): Promise<ImageSearchResult> {
    try {
      const skip = (page - 1) * limit
      
      const where: any = {}
      
      if (filters.category) {
        where.category = filters.category
      }
      
      if (filters.tags && filters.tags.length > 0) {
        where.tags = {
          contains: filters.tags.join(',')
        }
      }
      
      if (filters.isPremium !== undefined) {
        where.isPremium = filters.isPremium
      }
      
      if (filters.source) {
        where.source = filters.source
      }

      const [images, total] = await Promise.all([
        this.prisma.imageLibrary.findMany({
          where,
          skip,
          take: limit,
          orderBy: { downloadCount: 'desc' }
        }),
        this.prisma.imageLibrary.count({ where })
      ])

      return {
        images: images.map(img => ({
          ...img,
          tags: img.tags.split(',').filter(tag => tag.trim())
        })),
        total,
        page,
        limit,
        hasMore: skip + limit < total
      }
    } catch (error) {
      console.error('Error fetching images:', error)
      throw new Error('Failed to fetch images')
    }
  }

  async searchImages(query: string, filters: ImageSearchFilters = {}, page = 1, limit = 20): Promise<ImageSearchResult> {
    try {
      const skip = (page - 1) * limit
      
      const where: any = {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { tags: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } }
        ]
      }
      
      if (filters.category) {
        where.category = filters.category
      }
      
      if (filters.tags && filters.tags.length > 0) {
        where.tags = {
          contains: filters.tags.join(',')
        }
      }
      
      if (filters.isPremium !== undefined) {
        where.isPremium = filters.isPremium
      }
      
      if (filters.source) {
        where.source = filters.source
      }

      const [images, total] = await Promise.all([
        this.prisma.imageLibrary.findMany({
          where,
          skip,
          take: limit,
          orderBy: { downloadCount: 'desc' }
        }),
        this.prisma.imageLibrary.count({ where })
      ])

      return {
        images: images.map(img => ({
          ...img,
          tags: img.tags.split(',').filter(tag => tag.trim())
        })),
        total,
        page,
        limit,
        hasMore: skip + limit < total
      }
    } catch (error) {
      console.error('Error searching images:', error)
      throw new Error('Failed to search images')
    }
  }

  async getImagesByCategory(category: string, limit = 50): Promise<ImageLibraryData[]> {
    try {
      const images = await this.prisma.imageLibrary.findMany({
        where: { category },
        take: limit,
        orderBy: { downloadCount: 'desc' }
      })

      return images.map(img => ({
        ...img,
        tags: img.tags.split(',').filter(tag => tag.trim())
      }))
    } catch (error) {
      console.error('Error fetching images by category:', error)
      throw new Error('Failed to fetch images by category')
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const categories = await this.prisma.imageLibrary.findMany({
        select: { category: true },
        distinct: ['category'],
        orderBy: { category: 'asc' }
      })

      return categories.map(c => c.category)
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw new Error('Failed to fetch categories')
    }
  }

  async addCustomImage(websiteId: string, imageData: ImageLibraryData): Promise<string> {
    try {
      const image = await this.prisma.imageLibrary.create({
        data: {
          ...imageData,
          tags: imageData.tags.join(','),
          source: 'custom'
        }
      })

      return image.id
    } catch (error) {
      console.error('Error adding custom image:', error)
      throw new Error('Failed to add custom image')
    }
  }

  async incrementDownloadCount(imageId: string): Promise<void> {
    try {
      await this.prisma.imageLibrary.update({
        where: { id: imageId },
        data: {
          downloadCount: {
            increment: 1
          }
        }
      })
    } catch (error) {
      console.error('Error incrementing download count:', error)
      // Don't throw error for analytics
    }
  }

  async getImageById(imageId: string): Promise<ImageLibraryData | null> {
    try {
      const image = await this.prisma.imageLibrary.findUnique({
        where: { id: imageId }
      })

      if (!image) return null

      return {
        ...image,
        tags: image.tags.split(',').filter(tag => tag.trim())
      }
    } catch (error) {
      console.error('Error fetching image by ID:', error)
      throw new Error('Failed to fetch image')
    }
  }

  async getPopularImages(limit = 20): Promise<ImageLibraryData[]> {
    try {
      const images = await this.prisma.imageLibrary.findMany({
        take: limit,
        orderBy: { downloadCount: 'desc' }
      })

      return images.map(img => ({
        ...img,
        tags: img.tags.split(',').filter(tag => tag.trim())
      }))
    } catch (error) {
      console.error('Error fetching popular images:', error)
      throw new Error('Failed to fetch popular images')
    }
  }

  async getHeroImages(limit = 30): Promise<ImageLibraryData[]> {
    try {
      const images = await this.prisma.imageLibrary.findMany({
        where: { category: 'hero' },
        take: limit,
        orderBy: { downloadCount: 'desc' }
      })

      return images.map(img => ({
        ...img,
        tags: img.tags.split(',').filter(tag => tag.trim())
      }))
    } catch (error) {
      console.error('Error fetching hero images:', error)
      throw new Error('Failed to fetch hero images')
    }
  }

  async syncWithStockPhotos(): Promise<void> {
    try {
      // This would integrate with Unsplash, Pexels, Pixabay APIs
      // For now, we'll implement the structure
      console.log('Stock photo sync not implemented yet')
    } catch (error) {
      console.error('Error syncing with stock photos:', error)
      throw new Error('Failed to sync with stock photos')
    }
  }

  async deleteImage(imageId: string): Promise<void> {
    try {
      await this.prisma.imageLibrary.delete({
        where: { id: imageId }
      })
    } catch (error) {
      console.error('Error deleting image:', error)
      throw new Error('Failed to delete image')
    }
  }

  async updateImage(imageId: string, data: Partial<ImageLibraryData>): Promise<void> {
    try {
      await this.prisma.imageLibrary.update({
        where: { id: imageId },
        data: {
          ...data,
          tags: data.tags ? data.tags.join(',') : undefined
        }
      })
    } catch (error) {
      console.error('Error updating image:', error)
      throw new Error('Failed to update image')
    }
  }
}
