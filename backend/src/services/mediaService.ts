import { MediaAsset, VideoProject, VideoClip, MediaType, AssetStatus, ProjectStatus } from '@prisma/client'
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

  // Media Asset Management
  async createMediaAsset(websiteId: string, userId: string, data: MediaAssetData): Promise<MediaAsset> {
    try {
      this.validateId(websiteId)
      this.validateId(userId)
      return await this.prisma.mediaAsset.create({
        data: {
          websiteId,
          userId,
          ...data,
          status: AssetStatus.ACTIVE
        } as any
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async getMediaAssets(websiteId: string, type?: MediaType): Promise<MediaAsset[]> {
    try {
      this.validateId(websiteId)
      return await this.prisma.mediaAsset.findMany({
        where: {
          websiteId,
          ...(type && { type }),
          status: AssetStatus.ACTIVE
        },
        orderBy: { createdAt: 'desc' }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async generateAIMedia(prompt: string, type: MediaType, websiteId: string, userId: string): Promise<MediaAsset> {
    try {
      // Mock AI media generation - in reality, you'd integrate with DALL-E, Midjourney, etc.
      const mockAsset = {
        name: `AI Generated ${type}`,
        type,
        url: `https://api.example.com/generated/${type.toLowerCase()}/${Date.now()}.${type === MediaType.IMAGE ? 'jpg' : 'mp4'}`,
        thumbnailUrl: type === MediaType.VIDEO ? `https://api.example.com/thumbnails/${Date.now()}.jpg` : undefined,
        size: type === MediaType.IMAGE ? 1024000 : 10240000, // 1MB for images, 10MB for videos
        duration: type === MediaType.VIDEO ? 30 : undefined,
        width: type === MediaType.IMAGE ? 1920 : 1920,
        height: type === MediaType.IMAGE ? 1080 : 1080,
        metadata: { generated: true, prompt },
        tags: ['ai-generated'],
        aiGenerated: true,
        aiPrompt: prompt
      }

      return await this.createMediaAsset(websiteId, userId, mockAsset)
    } catch (error) {
      this.handleError(error)
    }
  }

  // Video Project Management
  async createVideoProject(websiteId: string, userId: string, data: VideoProjectData): Promise<VideoProject> {
    try {
      this.validateId(websiteId)
      this.validateId(userId)
      return await this.prisma.videoProject.create({
        data: {
          websiteId,
          userId,
          ...data,
          status: ProjectStatus.DRAFT,
          timeline: data.timeline || { tracks: [], effects: [] }
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async getVideoProjects(websiteId: string): Promise<VideoProject[]> {
    try {
      this.validateId(websiteId)
      return await this.prisma.videoProject.findMany({
        where: { websiteId },
        include: {
          clips: {
            include: {
              asset: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async updateVideoProject(projectId: string, data: Partial<VideoProjectData>): Promise<VideoProject> {
    try {
      this.validateId(projectId)
      return await this.prisma.videoProject.update({
        where: { id: projectId },
        data
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  // Video Clip Management
  async addVideoClip(projectId: string, data: VideoClipData): Promise<VideoClip> {
    try {
      this.validateId(projectId)
      return await this.prisma.videoClip.create({
        data: {
          projectId,
          ...data
        } as any,
        include: {
          asset: true
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async updateVideoClip(clipId: string, data: Partial<VideoClipData>): Promise<VideoClip> {
    try {
      this.validateId(clipId)
      return await this.prisma.videoClip.update({
        where: { id: clipId },
        data,
        include: {
          asset: true
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async deleteVideoClip(clipId: string): Promise<boolean> {
    try {
      this.validateId(clipId)
      await this.prisma.videoClip.delete({
        where: { id: clipId }
      })
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  // Video Processing
  async exportVideo(projectId: string, settings: any): Promise<{ success: boolean; downloadUrl?: string; error?: string }> {
    try {
      this.validateId(projectId)
      
      const project = await this.prisma.videoProject.findUnique({
        where: { id: projectId },
        include: {
          clips: {
            include: {
              asset: true
            }
          }
        }
      })

      if (!project) {
        throw new Error('Project not found')
      }

      // Update project status to processing
      await this.prisma.videoProject.update({
        where: { id: projectId },
        data: { status: ProjectStatus.PROCESSING }
      })

      // Mock video processing - in reality, you'd use FFmpeg or similar
      console.log('Processing video project:', project.name)
      console.log('Export settings:', settings)
      
      // Simulate processing time
      setTimeout(async () => {
        try {
          const downloadUrl = `https://api.example.com/exports/${projectId}.mp4`
          
          await this.prisma.videoProject.update({
            where: { id: projectId },
            data: { 
              status: ProjectStatus.COMPLETED,
              exportSettings: settings
            }
          })
          
          console.log('Video export completed:', downloadUrl)
        } catch (error) {
          await this.prisma.videoProject.update({
            where: { id: projectId },
            data: { status: ProjectStatus.FAILED }
          })
        }
      }, 5000) // 5 second delay

      return { 
        success: true, 
        downloadUrl: `https://api.example.com/exports/${projectId}.mp4` 
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Export failed' 
      }
    }
  }

  // Required abstract methods from BaseService
  override async create(data: any): Promise<MediaAsset> {
    return this.prisma.mediaAsset.create({ data })
  }
  
  override async findById(id: string): Promise<MediaAsset | null> {
    return this.prisma.mediaAsset.findUnique({ where: { id } })
  }
  
  override async findAll(filters?: any): Promise<MediaAsset[]> {
    return this.prisma.mediaAsset.findMany({ where: filters })
  }
  
  override async update(id: string, data: Partial<MediaAsset>): Promise<MediaAsset> {
    return this.prisma.mediaAsset.update({ where: { id }, data })
  }
  
  override async delete(id: string): Promise<boolean> {
    await this.prisma.mediaAsset.delete({ where: { id } })
    return true
  }

  // Cloudinary Integration Methods
  async uploadToCloudinary(file: Buffer | string, options: {
    folder?: string
    publicId?: string
    resourceType?: 'image' | 'video' | 'raw' | 'auto'
    transformation?: any
  } = {}): Promise<{
    publicId: string
    url: string
    secureUrl: string
    width?: number
    height?: number
    format: string
    bytes: number
  }> {
    try {
      if (config.storage.provider !== 'cloudinary') {
        throw new Error('Cloudinary is not configured as the storage provider')
      }

      const uploadOptions: any = {
        resource_type: options.resourceType || 'auto',
        folder: options.folder || 'website-builder',
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
      throw new Error('Failed to upload to Cloudinary')
    }
  }

  async deleteFromCloudinary(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image'): Promise<boolean> {
    try {
      if (config.storage.provider !== 'cloudinary') {
        throw new Error('Cloudinary is not configured as the storage provider')
      }

      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType
      })
      
      return result.result === 'ok'
    } catch (error) {
      console.error('Cloudinary delete error:', error)
      return false
    }
  }

  async generateCloudinaryUrl(publicId: string, transformations: any = {}): Promise<string> {
    try {
      if (config.storage.provider !== 'cloudinary') {
        throw new Error('Cloudinary is not configured as the storage provider')
      }

      return cloudinary.url(publicId, {
        ...transformations,
        secure: true
      })
    } catch (error) {
      console.error('Cloudinary URL generation error:', error)
      throw new Error('Failed to generate Cloudinary URL')
    }
  }

  async createMediaAssetWithUpload(websiteId: string, userId: string, file: Buffer | string, data: Partial<MediaAssetData>): Promise<MediaAsset> {
    try {
      this.validateId(websiteId)
      this.validateId(userId)

      // Upload to Cloudinary
      const uploadResult = await this.uploadToCloudinary(file, {
        folder: `websites/${websiteId}/media`,
        resourceType: this.getResourceType(data.type)
      })

      // Create media asset record
      const mediaAsset = await this.prisma.mediaAsset.create({
        data: {
          websiteId,
          userId,
          name: data.name || uploadResult.publicId,
          type: data.type,
          url: uploadResult.secureUrl,
          thumbnail: this.generateThumbnailUrl(uploadResult.publicId, data.type),
          size: uploadResult.bytes,
          mimeType: this.getMimeType(data.type, uploadResult.format),
          width: uploadResult.width,
          height: uploadResult.height,
          duration: data.duration,
          metadata: JSON.stringify({
            cloudinary: {
              publicId: uploadResult.publicId,
              format: uploadResult.format,
              originalUrl: uploadResult.url
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

  private getResourceType(type: MediaType): 'image' | 'video' | 'raw' | 'auto' {
    switch (type) {
      case 'IMAGE':
      case 'GIF':
      case 'SVG':
        return 'image'
      case 'VIDEO':
        return 'video'
      case 'AUDIO':
      case 'PDF':
        return 'raw'
      default:
        return 'auto'
    }
  }

  private getMimeType(type: MediaType, format?: string): string {
    const mimeTypes: Record<MediaType, string> = {
      IMAGE: 'image/jpeg',
      VIDEO: 'video/mp4',
      AUDIO: 'audio/mpeg',
      GIF: 'image/gif',
      SVG: 'image/svg+xml',
      PDF: 'application/pdf',
      DOCUMENT: 'application/pdf'
    }
    
    if (format && type === 'IMAGE') {
      return `image/${format}`
    }
    
    return mimeTypes[type] || 'application/octet-stream'
  }

  private generateThumbnailUrl(publicId: string, type: MediaType): string | null {
    if (type === 'VIDEO') {
      return cloudinary.url(publicId, {
        resource_type: 'video',
        format: 'jpg',
        transformation: [
          { width: 300, height: 200, crop: 'fill', quality: 'auto' }
        ],
        secure: true
      })
    }
    
    if (type === 'IMAGE' || type === 'GIF') {
      return cloudinary.url(publicId, {
        transformation: [
          { width: 300, height: 200, crop: 'fill', quality: 'auto' }
        ],
        secure: true
      })
    }
    
    return null
  }
}

export const mediaService = new MediaService()
