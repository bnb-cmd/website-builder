import { Notification, NotificationAction } from '@prisma/client'
import { NotificationService } from './notificationService'

export interface InteractiveNotificationData {
  userId: string
  type: string
  title: string
  message: string
  actions: NotificationAction[]
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  expiresIn?: number // minutes
  requiresResponse?: boolean
}

export interface ActionResponse {
  notificationId: string
  actionId: string
  userId: string
  response: any
  timestamp: Date
}

export class InteractiveNotificationService {
  private notificationService: NotificationService
  private actionHandlers: Map<string, (response: ActionResponse) => Promise<void>> = new Map()

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService
    this.setupDefaultActionHandlers()
  }

  // Create interactive notification
  async createInteractiveNotification(data: InteractiveNotificationData): Promise<Notification> {
    try {
      // Validate actions
      this.validateActions(data.actions)

      // Create notification with actions
      const notification = await this.notificationService.createNotification({
        userId: data.userId,
        type: data.type as any,
        title: data.title,
        message: data.message,
        priority: data.priority?.toUpperCase() as any,
        actions: data.actions,
        expiresAt: data.expiresIn ? new Date(Date.now() + data.expiresIn * 60 * 1000) : undefined
      })

      // If requires response, set up tracking
      if (data.requiresResponse) {
        await this.setupResponseTracking(notification.id, data.actions)
      }

      return notification
    } catch (error) {
      console.error('Error creating interactive notification:', error)
      throw error
    }
  }

  // Handle action response
  async handleActionResponse(response: ActionResponse): Promise<void> {
    try {
      // Get notification
      const notification = await this.notificationService.findById(response.notificationId)
      if (!notification) {
        throw new Error('Notification not found')
      }

      // Check if notification is expired
      if (notification.expiresAt && new Date() > notification.expiresAt) {
        throw new Error('Notification has expired')
      }

      // Parse actions
      const actions = notification.actions ? JSON.parse(notification.actions as string) : []
      const action = actions.find((a: NotificationAction) => a.action === response.actionId)
      
      if (!action) {
        throw new Error('Action not found')
      }

      // Execute action handler
      const handler = this.actionHandlers.get(response.actionId)
      if (handler) {
        await handler(response)
      }

      // Update notification
      await this.notificationService.update(response.notificationId, {
        clickedAt: new Date(),
        data: {
          ...notification.data,
          lastAction: {
            actionId: response.actionId,
            response: response.response,
            timestamp: response.timestamp
          }
        }
      })

      // Log action response
      await this.logActionResponse(response)

    } catch (error) {
      console.error('Error handling action response:', error)
      throw error
    }
  }

  // Create order confirmation notification
  async createOrderConfirmationNotification(
    userId: string,
    orderId: string,
    orderTotal: number,
    trackingUrl?: string
  ): Promise<Notification> {
    const actions: NotificationAction[] = [
      {
        label: 'Track Order',
        action: 'track_order',
        style: 'primary',
        url: trackingUrl || `/orders/${orderId}`
      },
      {
        label: 'View Details',
        action: 'view_order',
        style: 'secondary',
        url: `/orders/${orderId}`
      },
      {
        label: 'Contact Support',
        action: 'contact_support',
        style: 'secondary',
        url: '/support'
      }
    ]

    return await this.createInteractiveNotification({
      userId,
      type: 'ORDER_STATUS',
      title: `Order Confirmed - #${orderId}`,
      message: `Your order #${orderId} for PKR ${orderTotal} has been confirmed and is being processed.`,
      actions,
      priority: 'normal',
      expiresIn: 24 * 60, // 24 hours
      requiresResponse: false
    })
  }

  // Create payment confirmation notification
  async createPaymentConfirmationNotification(
    userId: string,
    amount: number,
    transactionId: string,
    paymentMethod: string
  ): Promise<Notification> {
    const actions: NotificationAction[] = [
      {
        label: 'View Receipt',
        action: 'view_receipt',
        style: 'primary',
        url: `/payments/${transactionId}`
      },
      {
        label: 'Download Invoice',
        action: 'download_invoice',
        style: 'secondary',
        url: `/payments/${transactionId}/invoice`
      }
    ]

    return await this.createInteractiveNotification({
      userId,
      type: 'PAYMENT',
      title: 'Payment Successful',
      message: `Your payment of PKR ${amount} via ${paymentMethod} has been processed successfully. Transaction ID: ${transactionId}`,
      actions,
      priority: 'high',
      expiresIn: 7 * 24 * 60, // 7 days
      requiresResponse: false
    })
  }

  // Create domain expiry notification
  async createDomainExpiryNotification(
    userId: string,
    domain: string,
    expiryDate: string,
    daysUntilExpiry: number
  ): Promise<Notification> {
    const actions: NotificationAction[] = [
      {
        label: 'Renew Now',
        action: 'renew_domain',
        style: 'primary',
        url: `/domains/${domain}/renew`
      },
      {
        label: 'View Details',
        action: 'view_domain',
        style: 'secondary',
        url: `/domains/${domain}`
      },
      {
        label: 'Remind Later',
        action: 'remind_later',
        style: 'secondary'
      }
    ]

    const priority = daysUntilExpiry <= 7 ? 'urgent' : daysUntilExpiry <= 30 ? 'high' : 'normal'

    return await this.createInteractiveNotification({
      userId,
      type: 'DOMAIN_EXPIRY',
      title: `Domain Expiry Alert - ${domain}`,
      message: `Your domain ${domain} will expire on ${expiryDate} (${daysUntilExpiry} days remaining). Renew now to avoid service interruption.`,
      actions,
      priority,
      expiresIn: daysUntilExpiry * 24 * 60, // Until expiry
      requiresResponse: true
    })
  }

  // Create AI generation complete notification
  async createAIGenerationNotification(
    userId: string,
    generationType: string,
    resultUrl: string,
    downloadUrl?: string
  ): Promise<Notification> {
    const actions: NotificationAction[] = [
      {
        label: 'View Result',
        action: 'view_result',
        style: 'primary',
        url: resultUrl
      }
    ]

    if (downloadUrl) {
      actions.push({
        label: 'Download',
        action: 'download_result',
        style: 'secondary',
        url: downloadUrl
      })
    }

    actions.push({
      label: 'Generate More',
      action: 'generate_more',
      style: 'secondary',
      url: '/ai/generate'
    })

    return await this.createInteractiveNotification({
      userId,
      type: 'AI_GENERATION_COMPLETE',
      title: `${generationType} Generation Complete`,
      message: `Your ${generationType} has been generated successfully! Click to view the result.`,
      actions,
      priority: 'normal',
      expiresIn: 3 * 24 * 60, // 3 days
      requiresResponse: false
    })
  }

  // Create collaboration invite notification
  async createCollaborationInviteNotification(
    userId: string,
    inviterName: string,
    projectName: string,
    inviteId: string
  ): Promise<Notification> {
    const actions: NotificationAction[] = [
      {
        label: 'Accept Invite',
        action: 'accept_collaboration',
        style: 'primary'
      },
      {
        label: 'Decline',
        action: 'decline_collaboration',
        style: 'danger'
      },
      {
        label: 'View Details',
        action: 'view_collaboration',
        style: 'secondary',
        url: `/collaboration/${inviteId}`
      }
    ]

    return await this.createInteractiveNotification({
      userId,
      type: 'COLLABORATION_INVITE',
      title: `Collaboration Invite from ${inviterName}`,
      message: `${inviterName} has invited you to collaborate on "${projectName}". Accept or decline the invitation.`,
      actions,
      priority: 'high',
      expiresIn: 7 * 24 * 60, // 7 days
      requiresResponse: true
    })
  }

  // Create security alert notification
  async createSecurityAlertNotification(
    userId: string,
    alertType: string,
    description: string,
    actionRequired: boolean = true
  ): Promise<Notification> {
    const actions: NotificationAction[] = [
      {
        label: 'View Details',
        action: 'view_security_alert',
        style: 'primary',
        url: '/security/alerts'
      }
    ]

    if (actionRequired) {
      actions.push({
        label: 'Secure Account',
        action: 'secure_account',
        style: 'danger',
        url: '/security/secure'
      })
    }

    return await this.createInteractiveNotification({
      userId,
      type: 'SECURITY_ALERT',
      title: `Security Alert: ${alertType}`,
      message: description,
      actions,
      priority: 'urgent',
      expiresIn: 24 * 60, // 24 hours
      requiresResponse: actionRequired
    })
  }

  // Setup default action handlers
  private setupDefaultActionHandlers(): void {
    // Track order handler
    this.actionHandlers.set('track_order', async (response) => {
      console.log(`User ${response.userId} tracked order: ${response.response}`)
    })

    // View order handler
    this.actionHandlers.set('view_order', async (response) => {
      console.log(`User ${response.userId} viewed order: ${response.response}`)
    })

    // Contact support handler
    this.actionHandlers.set('contact_support', async (response) => {
      console.log(`User ${response.userId} contacted support: ${response.response}`)
    })

    // Renew domain handler
    this.actionHandlers.set('renew_domain', async (response) => {
      console.log(`User ${response.userId} renewed domain: ${response.response}`)
    })

    // Accept collaboration handler
    this.actionHandlers.set('accept_collaboration', async (response) => {
      console.log(`User ${response.userId} accepted collaboration: ${response.response}`)
    })

    // Decline collaboration handler
    this.actionHandlers.set('decline_collaboration', async (response) => {
      console.log(`User ${response.userId} declined collaboration: ${response.response}`)
    })

    // Secure account handler
    this.actionHandlers.set('secure_account', async (response) => {
      console.log(`User ${response.userId} secured account: ${response.response}`)
    })
  }

  // Register custom action handler
  registerActionHandler(actionId: string, handler: (response: ActionResponse) => Promise<void>): void {
    this.actionHandlers.set(actionId, handler)
  }

  // Validate actions
  private validateActions(actions: NotificationAction[]): void {
    if (actions.length === 0) {
      throw new Error('At least one action is required for interactive notifications')
    }

    if (actions.length > 5) {
      throw new Error('Maximum 5 actions allowed per notification')
    }

    for (const action of actions) {
      if (!action.label || !action.action) {
        throw new Error('Action must have label and action')
      }

      if (!['primary', 'secondary', 'danger', 'success'].includes(action.style)) {
        throw new Error('Invalid action style')
      }
    }
  }

  // Setup response tracking
  private async setupResponseTracking(notificationId: string, actions: NotificationAction[]): Promise<void> {
    // Create tracking record for each action
    for (const action of actions) {
      await this.notificationService.prisma.notificationAnalytics.create({
        data: {
          notificationId,
          channelData: {
            actionId: action.action,
            requiresResponse: true,
            setupAt: new Date()
          }
        }
      })
    }
  }

  // Log action response
  private async logActionResponse(response: ActionResponse): Promise<void> {
    try {
      await this.notificationService.prisma.notificationAnalytics.create({
        data: {
          notificationId: response.notificationId,
          clickedAt: response.timestamp,
          channelData: {
            actionId: response.actionId,
            response: response.response,
            userId: response.userId
          }
        }
      })
    } catch (error) {
      console.error('Error logging action response:', error)
    }
  }

  // Get notification with actions
  async getNotificationWithActions(notificationId: string): Promise<Notification | null> {
    try {
      const notification = await this.notificationService.findById(notificationId)
      if (!notification) return null

      // Parse actions if they exist
      if (notification.actions) {
        notification.actions = JSON.parse(notification.actions as string)
      }

      return notification
    } catch (error) {
      console.error('Error getting notification with actions:', error)
      return null
    }
  }

  // Get pending interactive notifications for user
  async getPendingInteractiveNotifications(userId: string): Promise<Notification[]> {
    try {
      const notifications = await this.notificationService.getUserNotifications(userId, {
        unreadOnly: true
      })

      // Filter for interactive notifications
      return notifications.filter(notification => {
        const actions = notification.actions ? JSON.parse(notification.actions as string) : []
        return actions.length > 0
      })
    } catch (error) {
      console.error('Error getting pending interactive notifications:', error)
      return []
    }
  }
}
