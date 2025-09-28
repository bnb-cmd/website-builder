import { 
  Notification, 
  NotificationPreferences, 
  NotificationTemplate, 
  NotificationAnalytics,
  NotificationDigest,
  NotificationType,
  NotificationChannel,
  NotificationStatus,
  NotificationPriority,
  User
} from '@prisma/client'
import { BaseService } from './baseService'
import { EventEmitter } from 'events'

export interface NotificationData {
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: any
  channel?: NotificationChannel
  priority?: NotificationPriority
  actions?: NotificationAction[]
  imageUrl?: string
  scheduledFor?: Date
  expiresAt?: Date
}

export interface NotificationAction {
  label: string
  action: string
  style: 'primary' | 'secondary' | 'danger' | 'success'
  url?: string
}

export interface TemplateData {
  [key: string]: string | number | boolean
}

export class NotificationService extends BaseService<Notification> {
  private eventEmitter: EventEmitter
  private webSocketConnections: Map<string, any> = new Map()

  constructor(prisma: any) {
    super(prisma)
    this.eventEmitter = new EventEmitter()
  }

  protected getModelName(): string {
    return 'notification'
  }

  // Core notification creation and delivery
  async createNotification(data: NotificationData): Promise<Notification> {
    try {
      this.validateId(data.userId)

      // Get user preferences
      const preferences = await this.getUserPreferences(data.userId)
      
      // Check if notification type is enabled
      if (!this.isNotificationTypeEnabled(data.type, preferences)) {
        throw new Error(`Notification type ${data.type} is disabled for user`)
      }

      // Check quiet hours
      if (this.isInQuietHours(preferences)) {
        // Schedule for later or send via digest
        if (preferences.digestFrequency === 'INSTANT') {
          data.scheduledFor = this.getNextAvailableTime(preferences)
        }
      }

      // Create notification
      const notification = await this.prisma.notification.create({
        data: {
          ...data,
          channel: data.channel || NotificationChannel.IN_APP,
          priority: data.priority || NotificationPriority.NORMAL,
          status: NotificationStatus.PENDING,
          actions: data.actions ? JSON.stringify(data.actions) : null
        }
      })

      // Send notification based on preferences
      await this.deliverNotification(notification, preferences)

      // Emit real-time event
      this.eventEmitter.emit('notification:created', notification)

      return notification
    } catch (error) {
      this.handleError(error)
    }
  }

  // Template-based notification creation
  async createNotificationFromTemplate(
    userId: string,
    templateType: NotificationType,
    templateData: TemplateData,
    channel: NotificationChannel = NotificationChannel.IN_APP
  ): Promise<Notification> {
    try {
      const preferences = await this.getUserPreferences(userId)
      const language = preferences?.language || 'en'

      // Get template
      const template = await this.prisma.notificationTemplate.findUnique({
        where: {
          type_channel_language: {
            type: templateType,
            channel,
            language
          }
        }
      })

      if (!template) {
        throw new Error(`Template not found for ${templateType} in ${language}`)
      }

      // Process template with data
      const title = this.processTemplate(template.title, templateData)
      const message = this.processTemplate(template.message, templateData)

      return await this.createNotification({
        userId,
        type: templateType,
        title,
        message,
        channel,
        data: templateData,
        imageUrl: template.imageUrl
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  // Real-time delivery
  private async deliverNotification(
    notification: Notification, 
    preferences: NotificationPreferences | null
  ): Promise<void> {
    try {
      const channels = this.getEnabledChannels(preferences)
      
      for (const channel of channels) {
        switch (channel) {
          case NotificationChannel.IN_APP:
            await this.deliverInApp(notification)
            break
          case NotificationChannel.EMAIL:
            await this.deliverEmail(notification, preferences)
            break
          case NotificationChannel.SMS:
            await this.deliverSMS(notification, preferences)
            break
          case NotificationChannel.WHATSAPP:
            await this.deliverWhatsApp(notification, preferences)
            break
          case NotificationChannel.PUSH:
            await this.deliverPush(notification, preferences)
            break
        }
      }

      // Update status
      await this.prisma.notification.update({
        where: { id: notification.id },
        data: { status: NotificationStatus.SENT }
      })

    } catch (error) {
      await this.prisma.notification.update({
        where: { id: notification.id },
        data: { status: NotificationStatus.FAILED }
      })
      throw error
    }
  }

  // Channel-specific delivery methods
  private async deliverInApp(notification: Notification): Promise<void> {
    // Send via WebSocket if user is online
    const connection = this.webSocketConnections.get(notification.userId)
    if (connection) {
      connection.send(JSON.stringify({
        type: 'notification',
        data: notification
      }))
    }

    // Create analytics record
    await this.prisma.notificationAnalytics.create({
      data: {
        notificationId: notification.id,
        sentAt: new Date(),
        deliveredAt: new Date()
      }
    })
  }

  private async deliverEmail(notification: Notification, preferences: NotificationPreferences | null): Promise<void> {
    // Mock email delivery - integrate with your email service
    console.log(`Sending email notification to user ${notification.userId}: ${notification.title}`)
    
    await this.prisma.notificationAnalytics.create({
      data: {
        notificationId: notification.id,
        sentAt: new Date(),
        channelData: { emailProvider: 'mock' }
      }
    })
  }

  private async deliverSMS(notification: Notification, preferences: NotificationPreferences | null): Promise<void> {
    // Mock SMS delivery - integrate with SMS provider
    console.log(`Sending SMS notification to user ${notification.userId}: ${notification.title}`)
    
    await this.prisma.notificationAnalytics.create({
      data: {
        notificationId: notification.id,
        sentAt: new Date(),
        channelData: { smsProvider: 'mock' }
      }
    })
  }

  private async deliverWhatsApp(notification: Notification, preferences: NotificationPreferences | null): Promise<void> {
    // Mock WhatsApp delivery - integrate with WhatsApp Business API
    console.log(`Sending WhatsApp notification to user ${notification.userId}: ${notification.title}`)
    
    await this.prisma.notificationAnalytics.create({
      data: {
        notificationId: notification.id,
        sentAt: new Date(),
        channelData: { whatsappProvider: 'mock' }
      }
    })
  }

  private async deliverPush(notification: Notification, preferences: NotificationPreferences | null): Promise<void> {
    // Mock push notification delivery
    console.log(`Sending push notification to user ${notification.userId}: ${notification.title}`)
    
    await this.prisma.notificationAnalytics.create({
      data: {
        notificationId: notification.id,
        sentAt: new Date(),
        channelData: { pushProvider: 'mock' }
      }
    })
  }

  // User preferences management
  async getUserPreferences(userId: string): Promise<NotificationPreferences | null> {
    try {
      this.validateId(userId)
      
      let preferences = await this.prisma.notificationPreferences.findUnique({
        where: { userId }
      })

      // Create default preferences if none exist
      if (!preferences) {
        preferences = await this.prisma.notificationPreferences.create({
          data: {
            userId,
            emailEnabled: true,
            pushEnabled: true,
            smsEnabled: false,
            whatsappEnabled: false,
            enabledTypes: Object.values(NotificationType),
            timezone: 'Asia/Karachi',
            digestFrequency: 'DAILY',
            language: 'en'
          }
        })
      }

      return preferences
    } catch (error) {
      this.handleError(error)
    }
  }

  async updateUserPreferences(userId: string, data: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    try {
      this.validateId(userId)
      
      return await this.prisma.notificationPreferences.upsert({
        where: { userId },
        update: data,
        create: {
          userId,
          ...data
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  // Notification management
  async getUserNotifications(
    userId: string, 
    options: {
      limit?: number
      offset?: number
      type?: NotificationType
      status?: NotificationStatus
      unreadOnly?: boolean
    } = {}
  ): Promise<Notification[]> {
    try {
      this.validateId(userId)
      
      const { limit = 50, offset = 0, type, status, unreadOnly } = options
      
      const where: any = { userId }
      if (type) where.type = type
      if (status) where.status = status
      if (unreadOnly) where.read = false

      return await this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          analytics: true
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    try {
      this.validateId(notificationId)
      
      const notification = await this.prisma.notification.update({
        where: { id: notificationId },
        data: {
          read: true,
          readAt: new Date()
        }
      })

      // Update analytics
      await this.prisma.notificationAnalytics.updateMany({
        where: { notificationId },
        data: { readAt: new Date() }
      })

      return notification
    } catch (error) {
      this.handleError(error)
    }
  }

  async markAllAsRead(userId: string): Promise<number> {
    try {
      this.validateId(userId)
      
      const result = await this.prisma.notification.updateMany({
        where: { 
          userId,
          read: false
        },
        data: {
          read: true,
          readAt: new Date()
        }
      })

      // Update analytics for all unread notifications
      const unreadNotifications = await this.prisma.notification.findMany({
        where: { userId, read: false },
        select: { id: true }
      })

      for (const notification of unreadNotifications) {
        await this.prisma.notificationAnalytics.updateMany({
          where: { notificationId: notification.id },
          data: { readAt: new Date() }
        })
      }

      return result.count
    } catch (error) {
      this.handleError(error)
    }
  }

  // Template management
  async createTemplate(data: {
    type: NotificationType
    channel: NotificationChannel
    language: string
    title: string
    message: string
    subject?: string
    variables?: any
    imageUrl?: string
    color?: string
  }): Promise<NotificationTemplate> {
    try {
      return await this.prisma.notificationTemplate.create({
        data: {
          ...data,
          variables: data.variables ? JSON.stringify(data.variables) : null
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  // Digest system
  async createDigest(userId: string, period: 'DAILY' | 'WEEKLY' = 'DAILY'): Promise<NotificationDigest> {
    try {
      this.validateId(userId)
      
      // Get notifications for the period
      const startDate = period === 'DAILY' 
        ? new Date(Date.now() - 24 * 60 * 60 * 1000)
        : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

      const notifications = await this.prisma.notification.findMany({
        where: {
          userId,
          createdAt: { gte: startDate },
          status: NotificationStatus.SENT
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      })

      // Create digest content
      const content = notifications.map(notification => ({
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        createdAt: notification.createdAt,
        read: notification.read
      }))

      const digest = await this.prisma.notificationDigest.create({
        data: {
          userId,
          title: `${period} Notification Digest`,
          content: JSON.stringify(content),
          period,
          channel: NotificationChannel.EMAIL
        }
      })

      return digest
    } catch (error) {
      this.handleError(error)
    }
  }

  // Analytics
  async getNotificationAnalytics(userId: string, days: number = 30): Promise<{
    totalSent: number
    totalRead: number
    totalClicked: number
    openRate: number
    clickRate: number
    channelBreakdown: any
    typeBreakdown: any
  }> {
    try {
      this.validateId(userId)
      
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

      const notifications = await this.prisma.notification.findMany({
        where: {
          userId,
          createdAt: { gte: startDate }
        },
        include: {
          analytics: true
        }
      })

      const totalSent = notifications.length
      const totalRead = notifications.filter(n => n.read).length
      const totalClicked = notifications.filter(n => n.clickedAt).length

      const openRate = totalSent > 0 ? (totalRead / totalSent) * 100 : 0
      const clickRate = totalSent > 0 ? (totalClicked / totalSent) * 100 : 0

      // Channel breakdown
      const channelBreakdown = notifications.reduce((acc, notification) => {
        acc[notification.channel] = (acc[notification.channel] || 0) + 1
        return acc
      }, {} as any)

      // Type breakdown
      const typeBreakdown = notifications.reduce((acc, notification) => {
        acc[notification.type] = (acc[notification.type] || 0) + 1
        return acc
      }, {} as any)

      return {
        totalSent,
        totalRead,
        totalClicked,
        openRate,
        clickRate,
        channelBreakdown,
        typeBreakdown
      }
    } catch (error) {
      this.handleError(error)
    }
  }

  // WebSocket management
  addWebSocketConnection(userId: string, connection: any): void {
    this.webSocketConnections.set(userId, connection)
  }

  removeWebSocketConnection(userId: string): void {
    this.webSocketConnections.delete(userId)
  }

  // Helper methods
  private isNotificationTypeEnabled(type: NotificationType, preferences: NotificationPreferences | null): boolean {
    if (!preferences) return true
    return preferences.enabledTypes.includes(type)
  }

  private isInQuietHours(preferences: NotificationPreferences | null): boolean {
    if (!preferences?.quietHoursStart || !preferences?.quietHoursEnd) return false
    
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    const startTime = this.parseTime(preferences.quietHoursStart)
    const endTime = this.parseTime(preferences.quietHoursEnd)
    
    return currentTime >= startTime && currentTime <= endTime
  }

  private parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number)
    return hours * 60 + minutes
  }

  private getNextAvailableTime(preferences: NotificationPreferences | null): Date {
    if (!preferences?.quietHoursEnd) return new Date()
    
    const now = new Date()
    const [hours, minutes] = preferences.quietHoursEnd.split(':').map(Number)
    const nextAvailable = new Date(now)
    nextAvailable.setHours(hours, minutes, 0, 0)
    
    if (nextAvailable <= now) {
      nextAvailable.setDate(nextAvailable.getDate() + 1)
    }
    
    return nextAvailable
  }

  private getEnabledChannels(preferences: NotificationPreferences | null): NotificationChannel[] {
    if (!preferences) return [NotificationChannel.IN_APP]
    
    const channels: NotificationChannel[] = [NotificationChannel.IN_APP]
    
    if (preferences.emailEnabled) channels.push(NotificationChannel.EMAIL)
    if (preferences.pushEnabled) channels.push(NotificationChannel.PUSH)
    if (preferences.smsEnabled) channels.push(NotificationChannel.SMS)
    if (preferences.whatsappEnabled) channels.push(NotificationChannel.WHATSAPP)
    
    return channels
  }

  private processTemplate(template: string, data: TemplateData): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key]?.toString() || match
    })
  }

  // Required abstract methods from BaseService
  async create(data: any): Promise<Notification> {
    return this.prisma.notification.create({ data })
  }
  
  async findById(id: string): Promise<Notification | null> {
    return this.prisma.notification.findUnique({ where: { id } })
  }
  
  async findAll(filters?: any): Promise<Notification[]> {
    return this.prisma.notification.findMany({ where: filters })
  }
  
  async update(id: string, data: Partial<Notification>): Promise<Notification> {
    return this.prisma.notification.update({ where: { id }, data })
  }
  
  async delete(id: string): Promise<boolean> {
    await this.prisma.notification.delete({ where: { id } })
    return true
  }
}
