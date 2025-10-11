import { PrismaClient } from '@prisma/client'
import { BaseService } from './baseService'
import { config } from '@/config/environment'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
if (config.storage.provider === 'cloudinary') {
  cloudinary.config({
    cloud_name: config.storage.cloudinary?.cloudName,
    api_key: config.storage.cloudinary?.apiKey,
    api_secret: config.storage.cloudinary?.apiSecret
  })
}

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
  orientation?: 'landscape' | 'portrait' | 'square'
  color?: string
  isPremium?: boolean
  search?: string
}

export interface ImageSearchResult {
  images: any[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export class ImageLibraryService extends BaseService<any> {
  constructor() {
    super()
  }

  protected getModelName(): string {
    return 'imageLibrary'
  }

  // Implement required BaseService methods
  override async create(data: Partial<any>): Promise<any> {
    try {
      const image = await this.prisma.imageLibrary.create({
        data: data as any
      })
      return image
    } catch (error) {
      this.handleError(error)
    }
  }

  override async findById(id: string): Promise<any | null> {
    try {
      this.validateId(id)
      
      const image = await this.prisma.imageLibrary.findUnique({
        where: { id }
      })
      
      return image
    } catch (error) {
      this.handleError(error)
    }
  }

  override async findAll(filters?: any): Promise<any[]> {
    try {
      const images = await this.prisma.imageLibrary.findMany({
        where: filters || {},
        orderBy: { createdAt: 'desc' }
      })
      return images
    } catch (error) {
      this.handleError(error)
    }
  }

  override async update(id: string, data: Partial<any>): Promise<any> {
    try {
      this.validateId(id)
      
      const image = await this.prisma.imageLibrary.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      })
      
      return image
    } catch (error) {
      this.handleError(error)
    }
  }

  override async delete(id: string): Promise<boolean> {
    try {
      this.validateId(id)
      
      await this.prisma.imageLibrary.delete({
        where: { id }
      })
      
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  // Image Library Management Methods
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
      
      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { tags: { contains: filters.search, mode: 'insensitive' } }
        ]
      }

      const [images, total] = await Promise.all([
        this.prisma.imageLibrary.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        this.prisma.imageLibrary.count({ where })
      ])

      return {
        images,
        total,
        page,
        limit,
        hasMore: skip + limit < total
      }
    } catch (error) {
      this.handleError(error)
    }
  }

  async addImage(data: ImageLibraryData): Promise<any> {
    try {
      const image = await this.prisma.imageLibrary.create({
        data: {
          name: data.name,
          category: data.category,
          tags: data.tags.join(','),
          url: data.url,
          thumbnail: data.thumbnail,
          width: data.width,
          height: data.height,
          source: data.source,
          license: data.license,
          isPremium: data.isPremium || false,
          downloadCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      
      return image
    } catch (error) {
      this.handleError(error)
    }
  }

  async updateImage(id: string, data: Partial<ImageLibraryData>): Promise<any> {
    try {
      this.validateId(id)
      
      const updateData: any = { ...data }
      if (data.tags) {
        updateData.tags = data.tags.join(',')
      }
      
      const image = await this.prisma.imageLibrary.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date()
        }
      })
      
      return image
    } catch (error) {
      this.handleError(error)
    }
  }

  async deleteImage(id: string): Promise<boolean> {
    try {
      this.validateId(id)
      
      await this.prisma.imageLibrary.delete({
        where: { id }
      })
      
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  async incrementDownloadCount(id: string): Promise<void> {
    try {
      this.validateId(id)
      
      await this.prisma.imageLibrary.update({
        where: { id },
        data: {
          downloadCount: {
            increment: 1
          }
        }
      })
    } catch (error) {
      console.error('Error incrementing download count:', error)
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const categories = await this.prisma.imageLibrary.findMany({
        select: { category: true },
        distinct: ['category']
      })
      
      return categories.map(c => c.category)
    } catch (error) {
      this.handleError(error)
    }
  }

  async getPopularImages(limit = 10): Promise<any[]> {
    try {
      const images = await this.prisma.imageLibrary.findMany({
        orderBy: { downloadCount: 'desc' },
        take: limit
      })
      
      return images
    } catch (error) {
      this.handleError(error)
    }
  }

  async getRecentImages(limit = 10): Promise<any[]> {
    try {
      const images = await this.prisma.imageLibrary.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit
      })
      
      return images
    } catch (error) {
      this.handleError(error)
    }
  }

  // Cloudinary Integration Methods
  async uploadImageToCloudinary(file: Buffer | string, options: {
    folder?: string
    publicId?: string
    transformation?: any
  } = {}): Promise<{
    publicId: string
    url: string
    secureUrl: string
    width: number
    height: number
    format: string
    bytes: number
  }> {
    try {
      if (config.storage.provider !== 'cloudinary') {
        throw new Error('Cloudinary is not configured as the storage provider')
      }

      const uploadOptions: any = {
        resource_type: 'image',
        folder: options.folder || 'image-library',
        ...options.transformation
      }

      if (options.publicId) {
        uploadOptions.public_id = options.publicId
      }

      const result = await cloudinary.uploader.upload(file as string, uploadOptions)
      
      return {
        publicId: result.public_id,
        url: result.url,
        secureUrl: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      throw new Error('Failed to upload image to Cloudinary')
    }
  }

  async addImageFromCloudinary(cloudinaryResult: any, data: Partial<ImageLibraryData>): Promise<void> {
    try {
      await this.prisma.imageLibrary.create({
        data: {
          name: data.name || cloudinaryResult.publicId,
          category: data.category || 'general',
          tags: data.tags ? data.tags.join(',') : '',
          url: cloudinaryResult.secureUrl,
          thumbnail: this.generateThumbnailUrl(cloudinaryResult.publicId),
          width: cloudinaryResult.width,
          height: cloudinaryResult.height,
          source: 'cloudinary',
          license: data.license || 'commercial',
          isPremium: data.isPremium || false,
          downloadCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    } catch (error) {
      console.error('Error adding image from Cloudinary:', error)
      throw new Error('Failed to add image from Cloudinary')
    }
  }

  private generateThumbnailUrl(publicId: string): string {
    return cloudinary.url(publicId, {
      transformation: [
        { width: 300, height: 200, crop: 'fill', quality: 'auto' }
      ],
      secure: true
    })
  }

  async generateOptimizedUrl(publicId: string, options: {
    width?: number
    height?: number
    quality?: string
    format?: string
  } = {}): Promise<string> {
    try {
      if (config.storage.provider !== 'cloudinary') {
        throw new Error('Cloudinary is not configured as the storage provider')
      }

      const transformations: any = {}

      if (options.width) transformations.width = options.width
      if (options.height) transformations.height = options.height
      if (options.quality) transformations.quality = options.quality
      if (options.format) transformations.format = options.format

      return cloudinary.url(publicId, {
        ...transformations,
        secure: true
      })
    } catch (error) {
      console.error('Cloudinary URL generation error:', error)
      throw new Error('Failed to generate optimized URL')
    }
  }

  override async count(filters?: any): Promise<number> {
    try {
      return await this.prisma.imageLibrary.count({ where: filters })
    } catch (error) {
      this.handleError(error)
    }
  }

  override async bulkCreate(data: Partial<any>[]): Promise<any[]> {
    throw new Error('Bulk create not implemented for image library')
  }

  override async bulkUpdate(updates: { id: string; data: Partial<any> }[]): Promise<any[]> {
    throw new Error('Bulk update not implemented for image library')
  }

  override async bulkDelete(ids: string[]): Promise<number> {
    try {
      const result = await this.prisma.imageLibrary.deleteMany({
        where: { id: { in: ids } }
      })
      return result.count
    } catch (error) {
      this.handleError(error)
    }
  }
}

export const imageLibraryService = new ImageLibraryService()
