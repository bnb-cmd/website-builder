import { prisma } from '../models/database.js'
import { redis } from '../models/redis.js'
import crypto from 'crypto'

export class SocialMediaHubService {

  // Social Account Management
  async connectSocialAccount(websiteId: string, platform: string, authCode: string): Promise<any> {
    // Exchange auth code for access token
    const tokens = await this.exchangeAuthCode(platform, authCode)

    // Get account information
    const accountInfo = await this.getAccountInfo(platform, tokens.access_token)

    // Encrypt tokens
    const encryptedTokens = this.encryptTokens(tokens)

    const account = await prisma.socialAccount.create({
      data: {
        websiteId,
        platform: platform.toUpperCase() as any,
        accountId: accountInfo.id,
        accountName: accountInfo.name,
        username: accountInfo.username || accountInfo.name,
        avatar: accountInfo.avatar,
        accessToken: encryptedTokens.accessToken,
        refreshToken: encryptedTokens.refreshToken || null,
        tokenExpiresAt: tokens.expires_at ? new Date(tokens.expires_at * 1000) : null,
        scopes: tokens.scope ? tokens.scope.split(',') : [],
        status: 'ACTIVE'
      }
    })

    return account
  }

  async disconnectSocialAccount(accountId: string): Promise<void> {
    await prisma.socialAccount.delete({ where: { id: accountId } })
    await redis.del(`social_account:${accountId}`)
  }

  async getSocialAccounts(websiteId: string): Promise<any[]> {
    const accounts = await prisma.socialAccount.findMany({
      where: { websiteId },
      orderBy: { createdAt: 'desc' }
    })

    // Decrypt tokens for internal use
    return accounts.map(account => ({
      ...account,
      accessToken: this.decryptToken(account.accessToken),
      refreshToken: account.refreshToken ? this.decryptToken(account.refreshToken) : undefined
    }))
  }

  async refreshSocialToken(accountId: string): Promise<void> {
    const account = await prisma.socialAccount.findUnique({ where: { id: accountId } })
    if (!account || !account.refreshToken) return

    const refreshToken = this.decryptToken(account.refreshToken)
    const newTokens = await this.refreshAccessToken(account.platform, refreshToken)

    const encryptedTokens = this.encryptTokens(newTokens)

    await prisma.socialAccount.update({
      where: { id: accountId },
      data: {
        accessToken: encryptedTokens.accessToken,
        refreshToken: encryptedTokens.refreshToken || null,
        tokenExpiresAt: newTokens.expires_at ? new Date(newTokens.expires_at * 1000) : null,
        status: 'ACTIVE',
        errorMessage: null,
        lastSynced: new Date()
      }
    })
  }

  // Social Post Management
  async createSocialPost(data: {
    websiteId: string
    contentId?: string
    platform: string
    accountId: string
    content: any
    scheduledAt?: string
  }): Promise<any> {
    const post = await prisma.socialPost.create({
      data: {
        websiteId: data.websiteId,
        contentId: data.contentId || null,
        platform: data.platform.toUpperCase() as any,
        accountId: data.accountId,
        content: data.content,
        status: data.scheduledAt ? 'SCHEDULED' : 'DRAFT',
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        engagement: {
          likes: 0,
          shares: 0,
          comments: 0,
          clicks: 0,
          impressions: 0,
          reach: 0,
          saved: 0
        }
      }
    })

    return post
  }

  async scheduleany(postId: string, scheduledAt: string): Promise<void> {
    await prisma.socialPost.update({
      where: { id: postId },
      data: {
        status: 'SCHEDULED',
        scheduledAt: new Date(scheduledAt).toISOString()
      }
    })
  }

  async publishSocialPost(postId: string): Promise<void> {
    const post = await prisma.socialPost.findUnique({
      where: { id: postId },
      include: { account: true }
    })

    if (!post || post.status !== 'SCHEDULED') return

    try {
      // Publish to social platform
      const publishedPost = await this.publishToPlatform(post)

      await prisma.socialPost.update({
        where: { id: postId },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date().toISOString(),
          postId: publishedPost.id,
          url: publishedPost.url
        }
      })

    } catch (error: any) {
      await prisma.socialPost.update({
        where: { id: postId },
        data: {
          status: 'FAILED'
        }
      })
    }
  }

  async getSocialPosts(websiteId: string, filters: {
    platform?: string
    status?: string
    limit?: number
    offset?: number
  } = {}): Promise<{ posts: any[]; total: number }> {
    const { platform, status, limit = 20, offset = 0 } = filters

    const where: any = { websiteId }
    if (platform) where.platform = platform
    if (status) where.status = status

    const [posts, total] = await Promise.all([
      prisma.socialPost.findMany({
        where,
        include: { account: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.socialPost.count({ where })
    ])

    return { posts, total }
  }

  // Social Campaign Management
  async createany(data: {
    websiteId: string
    name: string
    description?: string
    platforms: string[]
    accounts: string[]
    schedule: any
    targeting?: any
    budget?: any
  }): Promise<any> {
    const campaign = await prisma.socialCampaign.create({
      data: {
        websiteId: data.websiteId,
        name: data.name,
        description: data.description || null,
        platforms: data.platforms.map(p => p.toUpperCase() as any),
        accounts: data.accounts,
        status: 'DRAFT',
        schedule: data.schedule,
        targeting: data.targeting,
        budget: data.budget ? {
          ...data.budget,
          totalSpent: 0
        } : null,
        analytics: {
          totalPosts: 0,
          totalEngagement: 0,
          totalImpressions: 0,
          totalClicks: 0,
          averageEngagementRate: 0,
          platformBreakdown: {}
        }
      }
    })

    return campaign
  }

  async addPostToCampaign(campaignId: string, postData: any): Promise<any> {
    const campaign = await prisma.socialCampaign.findUnique({ where: { id: campaignId } })
    if (!campaign) throw new Error('Campaign not found')

    const post = await this.createany({
      websiteId: campaign.websiteId,
      ...postData
    })

    // Update campaign analytics
    await this.updateCampaignAnalytics(campaignId)

    return post
  }

  async updateCampaignAnalytics(campaignId: string): Promise<void> {
    const campaign = await prisma.socialCampaign.findUnique({
      where: { id: campaignId },
      include: { posts: true }
    })

    if (!campaign) return

    const totalPosts = campaign.posts.length
    const totalEngagement = campaign.posts.reduce((sum, post) => {
      const engagement = post.engagement as any
      return sum + (engagement?.likes || 0) + (engagement?.shares || 0) + (engagement?.comments || 0)
    }, 0)
    const totalImpressions = campaign.posts.reduce((sum, post) => {
      const engagement = post.engagement as any
      return sum + (engagement?.impressions || 0)
    }, 0)
    const totalClicks = campaign.posts.reduce((sum, post) => {
      const engagement = post.engagement as any
      return sum + (engagement?.clicks || 0)
    }, 0)
    const averageEngagementRate = totalImpressions > 0 ? (totalEngagement / totalImpressions) * 100 : 0

    const platformBreakdown: any = {}
    campaign.posts.forEach(post => {
      if (!platformBreakdown[post.platform]) {
        platformBreakdown[post.platform] = {
          likes: 0, shares: 0, comments: 0, clicks: 0, impressions: 0, reach: 0, saved: 0
        }
      }
      const engagement = post.engagement as any
      platformBreakdown[post.platform].likes += engagement?.likes || 0
      platformBreakdown[post.platform].shares += engagement?.shares || 0
      platformBreakdown[post.platform].comments += engagement?.comments || 0
      platformBreakdown[post.platform].clicks += engagement?.clicks || 0
      platformBreakdown[post.platform].impressions += engagement?.impressions || 0
      platformBreakdown[post.platform].reach += engagement?.reach || 0
      platformBreakdown[post.platform].saved += engagement?.saved || 0
    })

    await prisma.socialCampaign.update({
      where: { id: campaignId },
      data: {
        analytics: {
          totalPosts,
          totalEngagement,
          totalImpressions,
          totalClicks,
          averageEngagementRate,
          platformBreakdown
        }
      }
    })
  }

  // Social Automation
  async createAutomationRule(data: {
    websiteId: string
    name: string
    trigger: any
    conditions: any[]
    actions: any[]
  }): Promise<any> {
    const rule = await prisma.socialAutomationRule.create({
      data: {
        websiteId: data.websiteId,
        name: data.name,
        trigger: data.trigger,
        conditions: data.conditions,
        actions: data.actions,
        status: 'ACTIVE'
      }
    })

    return rule
  }

  async processAutomationRules(websiteId: string, triggerType: string, triggerData: any): Promise<void> {
    const rules = await prisma.socialAutomationRule.findMany({
      where: {
        websiteId,
        status: 'ACTIVE',
        trigger: { path: ['type'], equals: triggerType }
      }
    })

    for (const rule of rules) {
      if (this.evaluateAutomationConditions(rule.conditions, triggerData)) {
        await this.executeAutomationActions(rule.actions, triggerData)
        await prisma.socialAutomationRule.update({
          where: { id: rule.id },
          data: { lastTriggered: new Date().toISOString() }
        })
      }
    }
  }

  private evaluateAutomationConditions(conditions: any[], data: any): boolean {
    return conditions.every(condition => {
      const value = data[condition.field]
      switch (condition.operator) {
        case 'equals': return value === condition.value
        case 'contains': return String(value).includes(condition.value)
        case 'greater_than': return Number(value) > Number(condition.value)
        case 'less_than': return Number(value) < Number(condition.value)
        case 'in': return Array.isArray(condition.value) && condition.value.includes(value)
        default: return false
      }
    })
  }

  private async executeAutomationActions(actions: any[], data: any): Promise<void> {
    for (const action of actions) {
      switch (action.type) {
        case 'post_content':
          await this.createSocialPost({
            websiteId: data.websiteId,
            platform: action.platform,
            accountId: action.accountId,
            content: action.parameters.content
          })
          break
        case 'send_notification':
          // Send notification logic
          break
        case 'update_analytics':
          // Update analytics logic
          break
      }
    }
  }

  // Social Analytics
  async getany(websiteId: string, platform?: string, period: '7d' | '30d' | '90d' = '30d'): Promise<any[]> {
    const accounts = await this.getSocialAccounts(websiteId)
    const analytics: any[] = []

    for (const account of accounts) {
      if (platform && account.platform !== platform) continue

      try {
        const accountAnalytics = await this.fetchPlatformAnalytics(account, period)
        analytics.push(accountAnalytics)
      } catch (error) {
        console.error(`Failed to fetch analytics for ${account.platform}:${account.accountId}`)
      }
    }

    return analytics
  }

  private async fetchPlatformAnalytics(account: any, period: string): Promise<any> {
    // This would integrate with actual social media APIs
    // For now, return mock data
    const mockAnalytics: any = {
      platform: account.platform,
      accountId: account.accountId,
      period: period as '7d' | '30d' | '90d',
      followers: {
        current: 1250,
        previous: 1200,
        change: 50,
        changePercent: 4.17
      },
      engagement: {
        total: 450,
        average: 15,
        rate: 3.2,
        trend: [12, 18, 15, 22, 16, 14, 15]
      },
      posts: {
        total: 30,
        topPerforming: []
      },
      demographics: {
        locations: [
          { name: 'Pakistan', percentage: 65 },
          { name: 'United States', percentage: 15 },
          { name: 'United Kingdom', percentage: 10 }
        ],
        ages: [
          { range: '18-24', percentage: 25 },
          { range: '25-34', percentage: 35 },
          { range: '35-44', percentage: 25 }
        ],
        genders: [
          { gender: 'male', percentage: 55 },
          { gender: 'female', percentage: 42 },
          { gender: 'other', percentage: 3 }
        ]
      },
      generatedAt: new Date().toISOString()
    }

    return mockAnalytics
  }

  // Content Suggestions
  async generateContentSuggestions(websiteId: string, platform: string): Promise<any[]> {
    // Analyze website content and generate suggestions
    const suggestions: any[] = []

    // Mock suggestions based on content analysis
    suggestions.push({
      id: crypto.randomUUID(),
      websiteId,
      platform,
      contentType: 'text',
      title: 'Share your latest blog post',
      content: {
        text: 'Just published a new blog post! Check it out and let me know your thoughts. #blog #content',
        hashtags: ['blog', 'content', 'website']
      },
      reasoning: 'Based on your recent blog post publication',
      predictedEngagement: 25,
      bestTimeToPost: '14:00',
      hashtags: ['blog', 'content', 'website'],
      createdAt: new Date().toISOString()
    })

    return suggestions
  }

  // Platform Integration Helpers
  private async exchangeAuthCode(_platform: string, _authCode: string): Promise<any> {
    // Implement OAuth flow for each platform
    // This would exchange the authorization code for access tokens

    // Mock response
    return {
      access_token: 'mock_access_token',
      refresh_token: 'mock_refresh_token',
      expires_in: 3600,
      scope: 'read,write'
    }
  }

  private async refreshAccessToken(_platform: string, _refreshToken: string): Promise<any> {
    // Implement token refresh for each platform

    // Mock response
    return {
      access_token: 'new_mock_access_token',
      refresh_token: _refreshToken,
      expires_in: 3600
    }
  }

  private async getAccountInfo(_platform: string, _accessToken: string): Promise<any> {
    // Fetch account information from platform APIs

    // Mock response
    return {
      id: '123456789',
      name: 'Test Account',
      username: 'testaccount',
      avatar: 'https://example.com/avatar.jpg'
    }
  }

  private async publishToPlatform(post: any): Promise<any> {
    // Implement publishing logic for each platform

    // Mock response
    return {
      id: `post_${Date.now()}`,
      url: `https://${post.platform}.com/p/${Date.now()}`
    }
  }

  // Utility Methods
  private encryptTokens(tokens: any): { accessToken: string; refreshToken?: string } {
    const algorithm = 'aes-256-cbc'
    const key = crypto.scryptSync(process.env['SOCIAL_ENCRYPTION_KEY'] || 'default-key', 'salt', 32)

    const cipher = crypto.createCipher(algorithm, key)
    let encrypted = cipher.update(JSON.stringify(tokens), 'utf8', 'hex')
    encrypted += cipher.final('hex')

    return {
      accessToken: encrypted,
      refreshToken: tokens.refresh_token
    }
  }

  private decryptToken(encryptedToken: string): string {
    try {
      const algorithm = 'aes-256-cbc'
      const key = crypto.scryptSync(process.env['SOCIAL_ENCRYPTION_KEY'] || 'default-key', 'salt', 32)

      const decipher = crypto.createDecipher(algorithm, key)
      let decrypted = decipher.update(encryptedToken, 'hex', 'utf8')
      decrypted += decipher.final('utf8')

      const tokens = JSON.parse(decrypted)
      return tokens.access_token
    } catch (error) {
      throw new Error('Failed to decrypt token')
    }
  }

  // Scheduled Posting Processor
  async processScheduledPosts(): Promise<number> {
    const now = new Date()
    const scheduledPosts = await prisma.socialPost.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledAt: { lte: now }
      },
      include: { account: true }
    })

    let processedCount = 0
    for (const post of scheduledPosts) {
      await this.publishSocialPost(post.id)
      processedCount++
    }

    return processedCount
  }

  // Bulk Operations
  async bulkSchedulePosts(posts: Array<{
    websiteId: string
    platform: string
    accountId: string
    content: any
    scheduledAt: string
  }>): Promise<any[]> {
    const createdPosts: any[] = []

    for (const postData of posts) {
      const post = await this.createSocialPost(postData)
      createdPosts.push(post)
    }

    return createdPosts
  }

  // Engagement Tracking
  async updatePostEngagement(postId: string, engagement: any): Promise<void> {
    await prisma.socialPost.update({
      where: { id: postId },
      data: { engagement }
    })

    // Update campaign analytics if post belongs to a campaign
    const post = await prisma.socialPost.findUnique({
      where: { id: postId },
      include: { campaign: true }
    })

    if (post?.campaign) {
      await this.updateCampaignAnalytics(post.campaign.id)
    }
  }
}

export const socialMediaHubService = new SocialMediaHubService()
