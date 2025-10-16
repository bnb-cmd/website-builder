import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { config } from '@/config/environment'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

export interface UploadResult {
  url: string
  key: string
  size: number
  mimeType: string
}

export interface UploadOptions {
  folder?: string
  filename?: string
  contentType?: string
  generateThumbnail?: boolean
}

class R2StorageService {
  private client: S3Client | null = null
  private bucket: string = ''
  private publicUrl: string = ''

  constructor() {
    this.initializeClient()
  }

  private initializeClient(): void {
    if (config.storage.provider !== 'r2') {
      return
    }

    const r2Config = config.storage.r2
    if (!r2Config?.accountId || !r2Config?.accessKeyId || !r2Config?.secretAccessKey || !r2Config?.bucket) {
      console.warn('R2 configuration incomplete, falling back to local storage')
      return
    }

    this.bucket = r2Config.bucket
    this.publicUrl = r2Config.publicUrl

    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${r2Config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: r2Config.accessKeyId,
        secretAccessKey: r2Config.secretAccessKey,
      },
    })

    console.log('✅ R2 Storage client initialized')
  }

  async uploadFile(
    buffer: Buffer,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    if (!this.client) {
      throw new Error('R2 client not initialized')
    }

    const {
      folder = 'uploads',
      filename,
      contentType = 'application/octet-stream',
      generateThumbnail = false
    } = options

    // Generate unique filename
    const fileExtension = filename ? path.extname(filename) : ''
    const baseName = filename ? path.basename(filename, fileExtension) : uuidv4()
    const uniqueFilename = `${baseName}-${uuidv4()}${fileExtension}`
    const key = `${folder}/${uniqueFilename}`

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        Metadata: {
          originalName: filename || 'unknown',
          uploadedAt: new Date().toISOString(),
          generateThumbnail: generateThumbnail.toString()
        }
      })

      await this.client.send(command)

      const url = this.publicUrl ? `${this.publicUrl}/${key}` : `https://${this.bucket}.r2.cloudflarestorage.com/${key}`

      return {
        url,
        key,
        size: buffer.length,
        mimeType: contentType
      }
    } catch (error) {
      console.error('R2 upload error:', error)
      throw new Error(`Failed to upload file to R2: ${error}`)
    }
  }

  async uploadImage(
    buffer: Buffer,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const contentType = options.contentType || 'image/jpeg'
    return this.uploadFile(buffer, { ...options, contentType })
  }

  async uploadDocument(
    buffer: Buffer,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const contentType = options.contentType || 'application/pdf'
    return this.uploadFile(buffer, { ...options, contentType })
  }

  async getFile(key: string): Promise<Buffer | null> {
    if (!this.client) {
      throw new Error('R2 client not initialized')
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })

      const response = await this.client.send(command)
      
      if (!response.Body) {
        return null
      }

      // Convert stream to buffer
      const chunks: Uint8Array[] = []
      const reader = response.Body.transformToByteArray()
      
      for await (const chunk of reader) {
        chunks.push(chunk)
      }

      return Buffer.concat(chunks)
    } catch (error) {
      console.error('R2 get file error:', error)
      return null
    }
  }

  async deleteFile(key: string): Promise<boolean> {
    if (!this.client) {
      throw new Error('R2 client not initialized')
    }

    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })

      await this.client.send(command)
      return true
    } catch (error) {
      console.error('R2 delete file error:', error)
      return false
    }
  }

  async fileExists(key: string): Promise<boolean> {
    if (!this.client) {
      return false
    }

    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })

      await this.client.send(command)
      return true
    } catch (error) {
      return false
    }
  }

  async getSignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<string> {
    if (!this.client) {
      throw new Error('R2 client not initialized')
    }

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: contentType,
      })

      return await getSignedUrl(this.client, command, { expiresIn })
    } catch (error) {
      console.error('R2 signed URL error:', error)
      throw new Error(`Failed to generate signed URL: ${error}`)
    }
  }

  async getSignedDownloadUrl(
    key: string,
    expiresIn: number = 3600
  ): Promise<string> {
    if (!this.client) {
      throw new Error('R2 client not initialized')
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })

      return await getSignedUrl(this.client, command, { expiresIn })
    } catch (error) {
      console.error('R2 signed URL error:', error)
      throw new Error(`Failed to generate signed URL: ${error}`)
    }
  }

  getPublicUrl(key: string): string {
    if (this.publicUrl) {
      return `${this.publicUrl}/${key}`
    }
    return `https://${this.bucket}.r2.cloudflarestorage.com/${key}`
  }

  async healthCheck(): Promise<boolean> {
    if (!this.client) {
      return false
    }

    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: 'health-check',
      })

      await this.client.send(command)
      return true
    } catch (error) {
      // If the health-check file doesn't exist, that's okay
      // We just want to test if we can connect to R2
      return error.name === 'NotFound'
    }
  }

  // Utility methods for common file operations
  async uploadUserAvatar(userId: string, buffer: Buffer, contentType: string): Promise<UploadResult> {
    return this.uploadImage(buffer, {
      folder: `avatars/${userId}`,
      filename: 'avatar.jpg',
      contentType
    })
  }

  async uploadWebsiteAsset(websiteId: string, buffer: Buffer, filename: string, contentType: string): Promise<UploadResult> {
    return this.uploadFile(buffer, {
      folder: `websites/${websiteId}/assets`,
      filename,
      contentType
    })
  }

  async uploadTemplateAsset(templateId: string, buffer: Buffer, filename: string, contentType: string): Promise<UploadResult> {
    return this.uploadFile(buffer, {
      folder: `templates/${templateId}/assets`,
      filename,
      contentType
    })
  }

  async uploadProductImage(productId: string, buffer: Buffer, filename: string, contentType: string): Promise<UploadResult> {
    return this.uploadImage(buffer, {
      folder: `products/${productId}`,
      filename,
      contentType
    })
  }

  // Clean up old files (utility for maintenance)
  async cleanupOldFiles(folder: string, olderThanDays: number = 30): Promise<number> {
    // This would require listing objects, which is more complex
    // For now, return 0 - implement if needed
    console.log(`Cleanup requested for folder: ${folder}, older than: ${olderThanDays} days`)
    return 0
  }
}

export const r2Storage = new R2StorageService()
