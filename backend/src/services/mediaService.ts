import { MediaAsset, VideoProject, VideoClip, MediaType, AssetStatus, ProjectStatus } from '@prisma/client'
import { BaseService } from './baseService'
import { config } from '@/config/environment'
import { r2Storage } from './r2Storage'

export interface MediaAssetData {
  name: string
  type: MediaType
  url: string
  thumbnailUrl?: string
  size: number
  duration?: number
  width?: number
  height?: number
  metadata?: any
  tags?: string[]
  aiGenerated?: boolean
  aiPrompt?: string
}

export interface VideoProjectData {
  name: string
  description?: string
  resolution?: string
  frameRate?: number
  timeline?: any
  exportSettings?: any
}

export interface VideoClipData {
  name: string
  assetId?: string
  startTime?: number
  endTime?: number
  position?: number
  effects?: any
  filters?: any
  transform?: any
}

export class MediaService extends BaseService<MediaAsset> {
  
  protected getModelName(): string {
    return 'mediaAsset'
  }

  // Implement required BaseService methods
  async create(data: Partial<MediaAsset>): Promise<MediaAsset> {
    const assetData: MediaAssetData = {
      name: data.name || '',
      type: data.type!,
      url: data.url || '',
      size: data.size || 0,
      width: data.width,
      height: data.height,
      duration: data.duration,
      metadata: data.metadata ? JSON.parse(data.metadata) : undefined,
      tags: data.tags ? data.tags.split(',') : undefined,
      aiGenerated: data.aiGenerated,
      aiPrompt: data.aiPrompt
    }
    return this.createMediaAsset(data.websiteId!, data.userId!, assetData)
  }

  async findById(id: string): Promise<MediaAsset | null> {
    try {
      this.validateId(id)
      return await this.prisma.mediaAsset.findUnique({
        where: { id }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async findAll(filters?: any): Promise<MediaAsset[]> {
    try {
      return await this.prisma.mediaAsset.findMany({
        where: filters || {},
        orderBy: { createdAt: 'desc' }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async update(id: string, data: Partial<MediaAsset>): Promise<MediaAsset> {
    const assetData: Partial<MediaAssetData> = {
      name: data.name,
      url: data.url,
      thumbnailUrl: data.thumbnail,
      metadata: data.metadata ? JSON.parse(data.metadata) : undefined,
      tags: data.tags ? data.tags.split(',') : undefined
    }
    return this.updateMediaAsset(id, assetData)
  }

  async delete(id: string): Promise<boolean> {
    return this.deleteMediaAsset(id)
  }

  async createMediaAsset(websiteId: string, userId: string, data: MediaAssetData): Promise<MediaAsset> {
    try {
      this.validateId(websiteId)
      this.validateId(userId)

      const mediaAsset = await this.prisma.mediaAsset.create({
        data: {
          websiteId,
          userId,
          name: data.name,
          type: data.type,
          url: data.url,
          thumbnail: data.thumbnailUrl,
          size: data.size,
          mimeType: this.getMimeType(data.type),
          width: data.width,
          height: data.height,
          duration: data.duration,
          metadata: JSON.stringify(data.metadata || {}),
          tags: data.tags ? data.tags.join(',') : null,
          aiGenerated: data.aiGenerated || false,
          aiPrompt: data.aiPrompt,
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      await this.invalidateCache(`media:website:${websiteId}`)
      return mediaAsset
    } catch (error) {
      this.handleError(error)
    }
  }

  async createMediaAssetWithUpload(websiteId: string, userId: string, file: Buffer | string, data: Partial<MediaAssetData>): Promise<MediaAsset> {
    try {
      this.validateId(websiteId)
      this.validateId(userId)

      // Upload to R2
      const uploadResult = await r2Storage.uploadFile(file as Buffer, {
        folder: `websites/${websiteId}/media`,
        filename: data.name,
        contentType: this.getMimeType(data.type),
        generateThumbnail: data.type === 'IMAGE'
      })

      // Create media asset record
      const mediaAsset = await this.prisma.mediaAsset.create({
        data: {
          websiteId,
          userId,
          name: data.name || uploadResult.key.split('/').pop() || 'unknown',
          type: data.type,
          url: uploadResult.url,
          thumbnail: data.type === 'IMAGE' ? uploadResult.url : null,
          size: uploadResult.size,
          mimeType: uploadResult.mimeType,
          width: data.width,
          height: data.height,
          duration: data.duration,
          metadata: JSON.stringify({
            storage: {
              provider: 'r2',
              key: uploadResult.key,
              bucket: config.storage.r2?.bucket
            },
            ...data.metadata
          }),
          tags: data.tags ? data.tags.join(',') : null,
          aiGenerated: data.aiGenerated || false,
          aiPrompt: data.aiPrompt,
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      await this.invalidateCache(`media:website:${websiteId}`)
      return mediaAsset
    } catch (error) {
      this.handleError(error)
    }
  }

  async getMediaAssetsByWebsite(websiteId: string, filters?: {
    type?: MediaType
    tags?: string[]
    search?: string
  }): Promise<MediaAsset[]> {
    try {
      this.validateId(websiteId)

      const where: any = {
        websiteId,
        status: 'ACTIVE'
      }

      if (filters?.type) {
        where.type = filters.type
      }

      if (filters?.tags && filters.tags.length > 0) {
        where.tags = {
          contains: filters.tags.join(',')
        }
      }

      if (filters?.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { tags: { contains: filters.search, mode: 'insensitive' } }
        ]
      }

      return await this.prisma.mediaAsset.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async updateMediaAsset(id: string, data: Partial<MediaAssetData>): Promise<MediaAsset> {
    try {
      this.validateId(id)

      const updateData: any = {
        updatedAt: new Date()
      }

      if (data.name) updateData.name = data.name
      if (data.url) updateData.url = data.url
      if (data.thumbnailUrl) updateData.thumbnail = data.thumbnailUrl
      if (data.metadata) updateData.metadata = JSON.stringify(data.metadata)
      if (data.tags) updateData.tags = data.tags.join(',')

      const mediaAsset = await this.prisma.mediaAsset.update({
        where: { id },
        data: updateData
      })

      await this.invalidateCache(`media:website:${mediaAsset.websiteId}`)
      return mediaAsset
    } catch (error) {
      this.handleError(error)
    }
  }

  async deleteMediaAsset(id: string): Promise<boolean> {
    try {
      this.validateId(id)

      const mediaAsset = await this.prisma.mediaAsset.findUnique({
        where: { id }
      })

      if (!mediaAsset) {
        throw new Error('Media asset not found')
      }

      // Delete from R2 storage
      await r2Storage.deleteFile(mediaAsset.url)

      // Delete from database
      await this.prisma.mediaAsset.delete({
        where: { id }
      })

      await this.invalidateCache(`media:website:${mediaAsset.websiteId}`)
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  async generateR2Url(key: string, transformations: any = {}): Promise<string> {
    try {
      // Generate R2 public URL
      const baseUrl = config.storage.r2?.publicUrl || `https://${config.storage.r2?.bucket}.r2.cloudflarestorage.com`
      const url = `${baseUrl}/${key}`
      
      return url
    } catch (error) {
      console.error('R2 URL generation error:', error)
      throw new Error('Failed to generate URL')
    }
  }

  private getMimeType(type: MediaType): string {
    switch (type) {
      case 'IMAGE':
      case 'GIF':
        return 'image/jpeg'
      case 'VIDEO':
        return 'video/mp4'
      case 'AUDIO':
        return 'audio/mpeg'
      case 'DOCUMENT':
        return 'application/pdf'
      default:
        return 'application/octet-stream'
    }
  }

  private generateThumbnailUrl(key: string, type: MediaType): string | null {
    if (type === 'IMAGE') {
      return key // R2 URL is the same for thumbnails
    }
    return null
  }

  // Video Project methods
  async createVideoProject(websiteId: string, userId: string, data: VideoProjectData): Promise<VideoProject> {
    try {
      this.validateId(websiteId)
      this.validateId(userId)

      const videoProject = await this.prisma.videoProject.create({
        data: {
          websiteId,
          userId,
          name: data.name,
          description: data.description,
          resolution: data.resolution || '1920x1080',
          frameRate: data.frameRate || 30,
          timeline: JSON.stringify(data.timeline || {}),
          exportSettings: JSON.stringify(data.exportSettings || {}),
          status: 'DRAFT',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      return videoProject
    } catch (error) {
      this.handleError(error)
    }
  }

  async getVideoProjectsByWebsite(websiteId: string): Promise<VideoProject[]> {
    try {
      this.validateId(websiteId)

      return await this.prisma.videoProject.findMany({
        where: { websiteId },
        orderBy: { createdAt: 'desc' }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async updateVideoProject(id: string, data: Partial<VideoProjectData>): Promise<VideoProject> {
    try {
      this.validateId(id)

      const updateData: any = {
        updatedAt: new Date()
      }

      if (data.name) updateData.name = data.name
      if (data.description) updateData.description = data.description
      if (data.resolution) updateData.resolution = data.resolution
      if (data.frameRate) updateData.frameRate = data.frameRate
      if (data.timeline) updateData.timeline = JSON.stringify(data.timeline)
      if (data.exportSettings) updateData.exportSettings = JSON.stringify(data.exportSettings)

      return await this.prisma.videoProject.update({
        where: { id },
        data: updateData
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async deleteVideoProject(id: string): Promise<boolean> {
    try {
      this.validateId(id)

      await this.prisma.videoProject.delete({
        where: { id }
      })

      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  // Video Clip methods
  async createVideoClip(projectId: string, data: VideoClipData): Promise<VideoClip> {
    try {
      this.validateId(projectId)

      const videoClip = await this.prisma.videoClip.create({
        data: {
          projectId,
          name: data.name,
          assetId: data.assetId,
          startTime: data.startTime || 0,
          endTime: data.endTime || 0,
          position: data.position || 0,
          effects: JSON.stringify(data.effects || {}),
          filters: JSON.stringify(data.filters || {}),
          transform: JSON.stringify(data.transform || {}),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      return videoClip
    } catch (error) {
      this.handleError(error)
    }
  }

  async getVideoClipsByProject(projectId: string): Promise<VideoClip[]> {
    try {
      this.validateId(projectId)

      return await this.prisma.videoClip.findMany({
        where: { projectId },
        orderBy: { position: 'asc' }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async updateVideoClip(id: string, data: Partial<VideoClipData>): Promise<VideoClip> {
    try {
      this.validateId(id)

      const updateData: any = {
        updatedAt: new Date()
      }

      if (data.name) updateData.name = data.name
      if (data.assetId) updateData.assetId = data.assetId
      if (data.startTime !== undefined) updateData.startTime = data.startTime
      if (data.endTime !== undefined) updateData.endTime = data.endTime
      if (data.position !== undefined) updateData.position = data.position
      if (data.effects) updateData.effects = JSON.stringify(data.effects)
      if (data.filters) updateData.filters = JSON.stringify(data.filters)
      if (data.transform) updateData.transform = JSON.stringify(data.transform)

      return await this.prisma.videoClip.update({
        where: { id },
        data: updateData
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  // Legacy method for backward compatibility
  async getMediaAssets(websiteId: string, filters?: any): Promise<MediaAsset[]> {
    return this.getMediaAssetsByWebsite(websiteId, filters)
  }

  // Legacy method for backward compatibility
  async addVideoClip(projectId: string, data: VideoClipData): Promise<VideoClip> {
    return this.createVideoClip(projectId, data)
  }

  // Legacy method for backward compatibility
  async uploadToCloudinary(file: Buffer | string, options: any): Promise<any> {
    return this.createMediaAssetWithUpload('', '', file, options)
  }

  // Legacy method for backward compatibility
  async generateCloudinaryUrl(publicId: string, transformations: any = {}): Promise<string> {
    return this.generateR2Url(publicId, transformations)
  }
}

export const mediaService = new MediaService()