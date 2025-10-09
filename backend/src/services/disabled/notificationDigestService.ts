import { Notification, NotificationDigest, NotificationPreferences } from '@prisma/client'
import { NotificationService } from './notificationService'
import { MultiChannelDeliveryService } from './multiChannelDeliveryService'

export interface DigestContent {
  notifications: {
    id: string
    type: string
    title: string
    message: string
    createdAt: string
    priority: string
  }[]
  summary: {
    total: number
    unread: number
    byType: { [key: string]: number }
    urgent: number
  }
}

export interface DigestTemplate {
  period: 'DAILY' | 'WEEKLY'
  language: string
  subject: string
  htmlTemplate: string
  textTemplate: string
}

export class NotificationDigestService {
  private notificationService: NotificationService
  private deliveryService: MultiChannelDeliveryService
  private digestTemplates: Map<string, DigestTemplate> = new Map()

  constructor(
    notificationService: NotificationService,
    deliveryService: MultiChannelDeliveryService
  ) {
    this.notificationService = notificationService
    this.deliveryService = deliveryService
    this.setupDigestTemplates()
  }

  // Create digest for user
  async createDigest(userId: string, period: 'DAILY' | 'WEEKLY' = 'DAILY'): Promise<NotificationDigest> {
    try {
      const preferences = await this.notificationService.getUserPreferences(userId)
      if (!preferences) {
        throw new Error('User preferences not found')
      }

      // Get notifications for the period
      const notifications = await this.getNotificationsForPeriod(userId, period)
      
      if (notifications.length === 0) {
        throw new Error('No notifications to include in digest')
      }

      // Create digest content
      const content = this.createDigestContent(notifications)
      
      // Get template
      const template = this.getDigestTemplate(period, preferences.language)
      
      // Create digest record
      const digest = await this.notificationService.prisma.notificationDigest.create({
        data: {
          userId,
          title: this.processTemplate(template.subject, { period }),
          content: JSON.stringify(content),
          period,
          channel: preferences.emailEnabled ? 'EMAIL' : 'IN_APP'
        }
      })

      // Send digest
      await this.sendDigest(digest, template, content)

      return digest
    } catch (error) {
      console.error('Error creating digest:', error)
      throw error
    }
  }

  // Process digest for all users
  async processDigestsForAllUsers(period: 'DAILY' | 'WEEKLY' = 'DAILY'): Promise<void> {
    try {
      console.log(`Processing ${period} digests for all users...`)
      
      // Get all users with digest preferences
      const users = await this.notificationService.prisma.user.findMany({
        where: {
          notificationPreferences: {
            digestFrequency: period
          }
        },
        include: {
          notificationPreferences: true
        }
      })

      console.log(`Found ${users.length} users for ${period} digest`)

      // Process digests in batches
      const batchSize = 10
      for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize)
        
        await Promise.all(
          batch.map(async (user) => {
            try {
              await this.createDigest(user.id, period)
              console.log(`✅ Digest created for user ${user.id}`)
            } catch (error) {
              console.error(`❌ Failed to create digest for user ${user.id}:`, error)
            }
          })
        )

        // Small delay between batches to avoid overwhelming the system
        if (i + batchSize < users.length) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }

      console.log(`✅ Completed processing ${period} digests`)
    } catch (error) {
      console.error('Error processing digests for all users:', error)
    }
  }

  // Get notifications for digest period
  private async getNotificationsForPeriod(userId: string, period: 'DAILY' | 'WEEKLY'): Promise<Notification[]> {
    const now = new Date()
    const startDate = new Date()
    
    if (period === 'DAILY') {
      startDate.setDate(now.getDate() - 1)
    } else {
      startDate.setDate(now.getDate() - 7)
    }

    return await this.notificationService.getUserNotifications(userId, {
      limit: 50,
      // Add date filter when implemented
    })
  }

  // Create digest content
  private createDigestContent(notifications: Notification[]): DigestContent {
    const summary = {
      total: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      byType: {} as { [key: string]: number },
      urgent: notifications.filter(n => n.priority === 'URGENT').length
    }

    // Count by type
    notifications.forEach(notification => {
      summary.byType[notification.type] = (summary.byType[notification.type] || 0) + 1
    })

    return {
      notifications: notifications.map(notification => ({
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        createdAt: notification.createdAt.toISOString(),
        priority: notification.priority
      })),
      summary
    }
  }

  // Send digest
  private async sendDigest(digest: NotificationDigest, template: DigestTemplate, content: DigestContent): Promise<void> {
    try {
      const preferences = await this.notificationService.getUserPreferences(digest.userId)
      if (!preferences) return

      // Create email content
      const htmlContent = this.processDigestTemplate(template.htmlTemplate, content, digest)
      const textContent = this.processDigestTemplate(template.textTemplate, content, digest)

      // Send via email if enabled
      if (preferences.emailEnabled && digest.channel === 'EMAIL') {
        await this.sendDigestEmail(digest.userId, template.subject, htmlContent, textContent)
      }

      // Update digest status
      await this.notificationService.prisma.notificationDigest.update({
        where: { id: digest.id },
        data: { 
          status: 'SENT',
          sentAt: new Date()
        }
      })

    } catch (error) {
      console.error('Error sending digest:', error)
      
      // Update digest status to failed
      await this.notificationService.prisma.notificationDigest.update({
        where: { id: digest.id },
        data: { status: 'FAILED' }
      })
    }
  }

  // Send digest email
  private async sendDigestEmail(userId: string, subject: string, html: string, text: string): Promise<void> {
    try {
      // Get user email (mock - in reality, get from user profile)
      const userEmail = `user${userId}@example.com`
      
      // Use delivery service to send email
      const result = await this.deliveryService.testDelivery(userId, text)
      
      if (result.some(r => r.success)) {
        console.log(`📧 Digest email sent to ${userEmail}`)
      } else {
        throw new Error('Failed to send digest email')
      }
    } catch (error) {
      console.error('Error sending digest email:', error)
      throw error
    }
  }

  // Setup digest templates
  private setupDigestTemplates(): void {
    // Daily English template
    this.digestTemplates.set('DAILY-en', {
      period: 'DAILY',
      language: 'en',
      subject: 'Daily Digest - Pakistan Website Builder',
      htmlTemplate: `
        <!DOCTYPE html>
        <html dir="ltr" lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>{{subject}}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
            .summary { background: #f0f9ff; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .notification { padding: 15px; margin: 10px 0; background: #f9f9f9; border-left: 4px solid #3B82F6; }
            .urgent { border-left-color: #ef4444; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 Daily Digest</h1>
              <p>Pakistan Website Builder</p>
            </div>
            
            <div class="summary">
              <h3>📊 Summary</h3>
              <p><strong>{{summary.total}}</strong> notifications • <strong>{{summary.unread}}</strong> unread • <strong>{{summary.urgent}}</strong> urgent</p>
            </div>
            
            <div class="notifications">
              <h3>🔔 Recent Notifications</h3>
              {{#each notifications}}
              <div class="notification {{#if (eq priority 'URGENT')}}urgent{{/if}}">
                <h4>{{title}}</h4>
                <p>{{message}}</p>
                <small>{{createdAt}}</small>
              </div>
              {{/each}}
            </div>
            
            <div class="footer">
              <p>Pakistan Website Builder - Powered by AI</p>
              <p>🇵🇰 Made for Pakistani Businesses</p>
            </div>
          </div>
        </body>
        </html>
      `,
      textTemplate: `
        Daily Digest - Pakistan Website Builder
        
        Summary:
        - {{summary.total}} notifications
        - {{summary.unread}} unread
        - {{summary.urgent}} urgent
        
        Recent Notifications:
        {{#each notifications}}
        - {{title}}: {{message}} ({{createdAt}})
        {{/each}}
        
        Pakistan Website Builder - Powered by AI
        🇵🇰 Made for Pakistani Businesses
      `
    })

    // Daily Urdu template
    this.digestTemplates.set('DAILY-ur', {
      period: 'DAILY',
      language: 'ur',
      subject: 'روزانہ خلاصہ - پاکستان ویب سائٹ بلڈر',
      htmlTemplate: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ur">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>{{subject}}</title>
          <style>
            body { font-family: 'Noto Sans Urdu', Arial, sans-serif; line-height: 1.6; color: #333; direction: rtl; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
            .summary { background: #f0f9ff; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .notification { padding: 15px; margin: 10px 0; background: #f9f9f9; border-right: 4px solid #3B82F6; }
            .urgent { border-right-color: #ef4444; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 روزانہ خلاصہ</h1>
              <p>پاکستان ویب سائٹ بلڈر</p>
            </div>
            
            <div class="summary">
              <h3>📊 خلاصہ</h3>
              <p><strong>{{summary.total}}</strong> اطلاعات • <strong>{{summary.unread}}</strong> نہ پڑھی گئی • <strong>{{summary.urgent}}</strong> فوری</p>
            </div>
            
            <div class="notifications">
              <h3>🔔 حالیہ اطلاعات</h3>
              {{#each notifications}}
              <div class="notification {{#if (eq priority 'URGENT')}}urgent{{/if}}">
                <h4>{{title}}</h4>
                <p>{{message}}</p>
                <small>{{createdAt}}</small>
              </div>
              {{/each}}
            </div>
            
            <div class="footer">
              <p>پاکستان ویب سائٹ بلڈر - AI سے چلایا گیا</p>
              <p>🇵🇰 پاکستانی کاروباروں کے لیے بنایا گیا</p>
            </div>
          </div>
        </body>
        </html>
      `,
      textTemplate: `
        روزانہ خلاصہ - پاکستان ویب سائٹ بلڈر
        
        خلاصہ:
        - {{summary.total}} اطلاعات
        - {{summary.unread}} نہ پڑھی گئی
        - {{summary.urgent}} فوری
        
        حالیہ اطلاعات:
        {{#each notifications}}
        - {{title}}: {{message}} ({{createdAt}})
        {{/each}}
        
        پاکستان ویب سائٹ بلڈر - AI سے چلایا گیا
        🇵🇰 پاکستانی کاروباروں کے لیے بنایا گیا
      `
    })

    // Weekly templates
    this.digestTemplates.set('WEEKLY-en', {
      period: 'WEEKLY',
      language: 'en',
      subject: 'Weekly Digest - Pakistan Website Builder',
      htmlTemplate: `
        <!DOCTYPE html>
        <html dir="ltr" lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>{{subject}}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #8B5CF6; color: white; padding: 20px; text-align: center; }
            .summary { background: #f3e8ff; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .notification { padding: 15px; margin: 10px 0; background: #f9f9f9; border-left: 4px solid #8B5CF6; }
            .urgent { border-left-color: #ef4444; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📅 Weekly Digest</h1>
              <p>Pakistan Website Builder</p>
            </div>
            
            <div class="summary">
              <h3>📊 This Week's Summary</h3>
              <p><strong>{{summary.total}}</strong> notifications • <strong>{{summary.unread}}</strong> unread • <strong>{{summary.urgent}}</strong> urgent</p>
            </div>
            
            <div class="notifications">
              <h3>🔔 This Week's Notifications</h3>
              {{#each notifications}}
              <div class="notification {{#if (eq priority 'URGENT')}}urgent{{/if}}">
                <h4>{{title}}</h4>
                <p>{{message}}</p>
                <small>{{createdAt}}</small>
              </div>
              {{/each}}
            </div>
            
            <div class="footer">
              <p>Pakistan Website Builder - Powered by AI</p>
              <p>🇵🇰 Made for Pakistani Businesses</p>
            </div>
          </div>
        </body>
        </html>
      `,
      textTemplate: `
        Weekly Digest - Pakistan Website Builder
        
        This Week's Summary:
        - {{summary.total}} notifications
        - {{summary.unread}} unread
        - {{summary.urgent}} urgent
        
        This Week's Notifications:
        {{#each notifications}}
        - {{title}}: {{message}} ({{createdAt}})
        {{/each}}
        
        Pakistan Website Builder - Powered by AI
        🇵🇰 Made for Pakistani Businesses
      `
    })
  }

  // Get digest template
  private getDigestTemplate(period: 'DAILY' | 'WEEKLY', language: string): DigestTemplate {
    const key = `${period}-${language}`
    const template = this.digestTemplates.get(key)
    
    if (!template) {
      // Fallback to English
      return this.digestTemplates.get(`${period}-en`) || this.digestTemplates.get('DAILY-en')!
    }
    
    return template
  }

  // Process template with data
  private processTemplate(template: string, data: any): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key]?.toString() || match
    })
  }

  // Process digest template with content
  private processDigestTemplate(template: string, content: DigestContent, digest: NotificationDigest): string {
    let processed = template
    
    // Replace summary placeholders
    processed = processed.replace(/\{\{summary\.(\w+)\}\}/g, (match, key) => {
      return content.summary[key as keyof typeof content.summary]?.toString() || ''
    })
    
    // Replace notifications
    processed = processed.replace(/\{\{#each notifications\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, notificationTemplate) => {
      return content.notifications.map(notification => {
        let notificationHtml = notificationTemplate
        
        notificationHtml = notificationHtml.replace(/\{\{title\}\}/g, notification.title)
        notificationHtml = notificationHtml.replace(/\{\{message\}\}/g, notification.message)
        notificationHtml = notificationHtml.replace(/\{\{createdAt\}\}/g, new Date(notification.createdAt).toLocaleDateString())
        notificationHtml = notificationHtml.replace(/\{\{priority\}\}/g, notification.priority)
        
        return notificationHtml
      }).join('')
    })
    
    return processed
  }

  // Get digest statistics
  async getDigestStats(period: 'DAILY' | 'WEEKLY'): Promise<{
    totalDigests: number
    sentDigests: number
    failedDigests: number
    averageNotificationsPerDigest: number
  }> {
    try {
      const digests = await this.notificationService.prisma.notificationDigest.findMany({
        where: { period },
        orderBy: { createdAt: 'desc' },
        take: 100
      })

      const totalDigests = digests.length
      const sentDigests = digests.filter(d => d.status === 'SENT').length
      const failedDigests = digests.filter(d => d.status === 'FAILED').length
      
      const totalNotifications = digests.reduce((sum, digest) => {
        const content = JSON.parse(digest.content as string)
        return sum + content.notifications.length
      }, 0)
      
      const averageNotificationsPerDigest = totalDigests > 0 ? totalNotifications / totalDigests : 0

      return {
        totalDigests,
        sentDigests,
        failedDigests,
        averageNotificationsPerDigest
      }
    } catch (error) {
      console.error('Error getting digest stats:', error)
      return {
        totalDigests: 0,
        sentDigests: 0,
        failedDigests: 0,
        averageNotificationsPerDigest: 0
      }
    }
  }
}
