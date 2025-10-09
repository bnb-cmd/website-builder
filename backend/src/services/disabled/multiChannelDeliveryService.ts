import { Notification, NotificationChannel } from '@prisma/client'
import { NotificationService } from './notificationService'

export interface DeliveryResult {
  success: boolean
  messageId?: string
  error?: string
  deliveryTime?: number
  channelData?: any
}

export interface EmailProvider {
  sendEmail(to: string, subject: string, html: string, text?: string): Promise<DeliveryResult>
}

export interface SMSProvider {
  sendSMS(to: string, message: string): Promise<DeliveryResult>
}

export interface WhatsAppProvider {
  sendMessage(to: string, message: string, mediaUrl?: string): Promise<DeliveryResult>
}

export interface PushProvider {
  sendPush(userId: string, title: string, body: string, data?: any): Promise<DeliveryResult>
}

// Mock implementations - replace with real providers
class MockEmailProvider implements EmailProvider {
  async sendEmail(to: string, subject: string, html: string, text?: string): Promise<DeliveryResult> {
    // Mock email sending
    console.log(`📧 Email sent to ${to}: ${subject}`)
    return {
      success: true,
      messageId: `email_${Date.now()}`,
      deliveryTime: 100
    }
  }
}

class MockSMSProvider implements SMSProvider {
  async sendSMS(to: string, message: string): Promise<DeliveryResult> {
    // Mock SMS sending
    console.log(`📱 SMS sent to ${to}: ${message}`)
    return {
      success: true,
      messageId: `sms_${Date.now()}`,
      deliveryTime: 200
    }
  }
}

class MockWhatsAppProvider implements WhatsAppProvider {
  async sendMessage(to: string, message: string, mediaUrl?: string): Promise<DeliveryResult> {
    // Mock WhatsApp sending
    console.log(`💬 WhatsApp sent to ${to}: ${message}`)
    return {
      success: true,
      messageId: `whatsapp_${Date.now()}`,
      deliveryTime: 150
    }
  }
}

class MockPushProvider implements PushProvider {
  async sendPush(userId: string, title: string, body: string, data?: any): Promise<DeliveryResult> {
    // Mock push notification
    console.log(`🔔 Push sent to ${userId}: ${title}`)
    return {
      success: true,
      messageId: `push_${Date.now()}`,
      deliveryTime: 50
    }
  }
}

export class MultiChannelDeliveryService {
  private notificationService: NotificationService
  private emailProvider: EmailProvider
  private smsProvider: SMSProvider
  private whatsappProvider: WhatsAppProvider
  private pushProvider: PushProvider

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService
    
    // Initialize providers (replace with real implementations)
    this.emailProvider = new MockEmailProvider()
    this.smsProvider = new MockSMSProvider()
    this.whatsappProvider = new MockWhatsAppProvider()
    this.pushProvider = new MockPushProvider()
  }

  // Deliver notification through multiple channels
  async deliverNotification(notification: Notification): Promise<DeliveryResult[]> {
    const results: DeliveryResult[] = []
    
    try {
      // Get user preferences to determine channels
      const preferences = await this.notificationService.getUserPreferences(notification.userId)
      if (!preferences) {
        throw new Error('User preferences not found')
      }

      // Determine which channels to use based on preferences and notification type
      const channels = this.getEnabledChannels(notification, preferences)
      
      // Deliver through each channel
      for (const channel of channels) {
        try {
          const result = await this.deliverToChannel(notification, channel)
          results.push(result)
          
          // Update analytics
          await this.updateDeliveryAnalytics(notification.id, channel, result)
          
        } catch (error) {
          results.push({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }
      
      return results
    } catch (error) {
      console.error('Error delivering notification:', error)
      return [{
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }]
    }
  }

  // Deliver to specific channel
  private async deliverToChannel(notification: Notification, channel: NotificationChannel): Promise<DeliveryResult> {
    const startTime = Date.now()
    
    try {
      switch (channel) {
        case NotificationChannel.EMAIL:
          return await this.deliverEmail(notification)
          
        case NotificationChannel.SMS:
          return await this.deliverSMS(notification)
          
        case NotificationChannel.WHATSAPP:
          return await this.deliverWhatsApp(notification)
          
        case NotificationChannel.PUSH:
          return await this.deliverPush(notification)
          
        case NotificationChannel.IN_APP:
          return await this.deliverInApp(notification)
          
        default:
          throw new Error(`Unsupported channel: ${channel}`)
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        deliveryTime: Date.now() - startTime
      }
    }
  }

  // Email delivery
  private async deliverEmail(notification: Notification): Promise<DeliveryResult> {
    try {
      // Get user email (mock - in reality, get from user profile)
      const userEmail = `user${notification.userId}@example.com`
      
      // Create email content
      const subject = notification.title
      const html = this.createEmailHTML(notification)
      const text = notification.message
      
      const result = await this.emailProvider.sendEmail(userEmail, subject, html, text)
      
      return {
        ...result,
        channelData: {
          provider: 'mock',
          recipient: userEmail,
          subject,
          hasHtml: true
        }
      }
    } catch (error) {
      throw new Error(`Email delivery failed: ${error}`)
    }
  }

  // SMS delivery
  private async deliverSMS(notification: Notification): Promise<DeliveryResult> {
    try {
      // Get user phone number (mock - in reality, get from user profile)
      const userPhone = `+92${Math.floor(Math.random() * 10000000000)}`
      
      // Create SMS content (limit to 160 characters)
      const message = this.createSMSMessage(notification)
      
      const result = await this.smsProvider.sendSMS(userPhone, message)
      
      return {
        ...result,
        channelData: {
          provider: 'mock',
          recipient: userPhone,
          messageLength: message.length,
          isPakistani: userPhone.startsWith('+92')
        }
      }
    } catch (error) {
      throw new Error(`SMS delivery failed: ${error}`)
    }
  }

  // WhatsApp delivery
  private async deliverWhatsApp(notification: Notification): Promise<DeliveryResult> {
    try {
      // Get user WhatsApp number (mock - in reality, get from user profile)
      const userWhatsApp = `+92${Math.floor(Math.random() * 10000000000)}`
      
      // Create WhatsApp message
      const message = this.createWhatsAppMessage(notification)
      
      const result = await this.whatsappProvider.sendMessage(userWhatsApp, message, notification.imageUrl || undefined)
      
      return {
        ...result,
        channelData: {
          provider: 'mock',
          recipient: userWhatsApp,
          messageLength: message.length,
          hasMedia: !!notification.imageUrl,
          isPakistani: userWhatsApp.startsWith('+92')
        }
      }
    } catch (error) {
      throw new Error(`WhatsApp delivery failed: ${error}`)
    }
  }

  // Push notification delivery
  private async deliverPush(notification: Notification): Promise<DeliveryResult> {
    try {
      const result = await this.pushProvider.sendPush(
        notification.userId,
        notification.title,
        notification.message,
        notification.data
      )
      
      return {
        ...result,
        channelData: {
          provider: 'mock',
          userId: notification.userId,
          hasData: !!notification.data,
          hasActions: !!notification.actions
        }
      }
    } catch (error) {
      throw new Error(`Push delivery failed: ${error}`)
    }
  }

  // In-app delivery (already handled by NotificationService)
  private async deliverInApp(notification: Notification): Promise<DeliveryResult> {
    return {
      success: true,
      messageId: notification.id,
      deliveryTime: 0,
      channelData: {
        provider: 'websocket',
        userId: notification.userId
      }
    }
  }

  // Get enabled channels based on preferences and notification type
  private getEnabledChannels(notification: Notification, preferences: any): NotificationChannel[] {
    const channels: NotificationChannel[] = []
    
    // Always include in-app
    channels.push(NotificationChannel.IN_APP)
    
    // Add other channels based on preferences
    if (preferences.emailEnabled) {
      channels.push(NotificationChannel.EMAIL)
    }
    
    if (preferences.pushEnabled) {
      channels.push(NotificationChannel.PUSH)
    }
    
    if (preferences.smsEnabled) {
      channels.push(NotificationChannel.SMS)
    }
    
    if (preferences.whatsappEnabled) {
      channels.push(NotificationChannel.WHATSAPP)
    }
    
    // Special handling for urgent notifications
    if (notification.priority === 'URGENT') {
      // Add all available channels for urgent notifications
      if (!channels.includes(NotificationChannel.SMS)) channels.push(NotificationChannel.SMS)
      if (!channels.includes(NotificationChannel.WHATSAPP)) channels.push(NotificationChannel.WHATSAPP)
    }
    
    return channels
  }

  // Create email HTML content
  private createEmailHTML(notification: Notification): string {
    const actions = notification.actions ? JSON.parse(notification.actions as string) : []
    
    return `
      <!DOCTYPE html>
      <html dir="ltr" lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${notification.title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .actions { margin-top: 20px; }
          .btn { display: inline-block; padding: 10px 20px; margin: 5px; background: #3B82F6; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${notification.title}</h1>
          </div>
          <div class="content">
            <p>${notification.message}</p>
            ${actions.length > 0 ? `
              <div class="actions">
                ${actions.map((action: any) => `
                  <a href="${action.url || '#'}" class="btn">${action.label}</a>
                `).join('')}
              </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>Pakistan Website Builder - Powered by AI</p>
            <p>🇵🇰 Made for Pakistani Businesses</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  // Create SMS message (160 character limit)
  private createSMSMessage(notification: Notification): string {
    let message = `${notification.title}: ${notification.message}`
    
    // Truncate if too long
    if (message.length > 160) {
      message = message.substring(0, 157) + '...'
    }
    
    return message
  }

  // Create WhatsApp message with emojis
  private createWhatsAppMessage(notification: Notification): string {
    const actions = notification.actions ? JSON.parse(notification.actions as string) : []
    
    let message = `🔔 *${notification.title}*\n\n${notification.message}`
    
    if (actions.length > 0) {
      message += '\n\n📱 *Actions:*'
      actions.forEach((action: any) => {
        message += `\n• ${action.label}`
      })
    }
    
    message += '\n\n🇵🇰 Pakistan Website Builder'
    
    return message
  }

  // Update delivery analytics
  private async updateDeliveryAnalytics(
    notificationId: string, 
    channel: NotificationChannel, 
    result: DeliveryResult
  ): Promise<void> {
    try {
      // Update notification analytics
      await this.notificationService.prisma.notificationAnalytics.create({
        data: {
          notificationId,
          sentAt: new Date(),
          deliveredAt: result.success ? new Date() : null,
          deliveryTime: result.deliveryTime,
          channelData: result.channelData
        }
      })
    } catch (error) {
      console.error('Error updating delivery analytics:', error)
    }
  }

  // Test delivery to all channels
  async testDelivery(userId: string, testMessage: string): Promise<DeliveryResult[]> {
    const testNotification = {
      id: 'test',
      userId,
      type: 'INFO' as any,
      title: 'Test Notification',
      message: testMessage,
      channel: NotificationChannel.IN_APP,
      status: 'PENDING' as any,
      priority: 'NORMAL' as any,
      read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Notification

    return await this.deliverNotification(testNotification)
  }
}
