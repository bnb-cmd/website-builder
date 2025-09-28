import { NotificationService } from '../services/notificationService'
import { NotificationPreferences, Notification } from '@prisma/client'

export interface OptimalTimeData {
  userId: string
  timezone: string
  optimalTimes: {
    hour: number
    dayOfWeek: number
    engagementScore: number
  }[]
  lastCalculated: Date
}

export class SmartNotificationScheduler {
  private notificationService: NotificationService
  private optimalTimesCache: Map<string, OptimalTimeData> = new Map()

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService
  }

  // AI-powered optimal send time calculation
  async calculateOptimalSendTime(userId: string): Promise<Date> {
    try {
      const preferences = await this.notificationService.getUserPreferences(userId)
      if (!preferences) {
        return new Date() // Send immediately if no preferences
      }

      // Check cache first
      const cached = this.optimalTimesCache.get(userId)
      if (cached && this.isCacheValid(cached.lastCalculated)) {
        return this.getNextOptimalTime(cached, preferences.timezone)
      }

      // Calculate optimal times based on user behavior
      const optimalData = await this.analyzeUserBehavior(userId)
      this.optimalTimesCache.set(userId, optimalData)

      return this.getNextOptimalTime(optimalData, preferences.timezone)
    } catch (error) {
      console.error('Error calculating optimal send time:', error)
      return new Date()
    }
  }

  // Analyze user behavior patterns
  private async analyzeUserBehavior(userId: string): Promise<OptimalTimeData> {
    try {
      // Get user's notification history
      const notifications = await this.notificationService.getUserNotifications(userId, {
        limit: 1000
      })

      // Get user preferences
      const preferences = await this.notificationService.getUserPreferences(userId)
      const timezone = preferences?.timezone || 'Asia/Karachi'

      // Analyze engagement patterns
      const engagementPatterns = this.analyzeEngagementPatterns(notifications)
      
      // Apply Pakistani cultural considerations
      const culturalOptimalTimes = this.applyCulturalConsiderations(engagementPatterns, timezone)

      return {
        userId,
        timezone,
        optimalTimes: culturalOptimalTimes,
        lastCalculated: new Date()
      }
    } catch (error) {
      console.error('Error analyzing user behavior:', error)
      return this.getDefaultOptimalTimes(userId, 'Asia/Karachi')
    }
  }

  // Analyze engagement patterns from notification history
  private analyzeEngagementPatterns(notifications: Notification[]): {
    hour: number
    dayOfWeek: number
    engagementScore: number
  }[] {
    const patterns: { [key: string]: { reads: number, clicks: number, total: number } } = {}

    notifications.forEach(notification => {
      const date = new Date(notification.createdAt)
      const hour = date.getHours()
      const dayOfWeek = date.getDay()
      const key = `${dayOfWeek}-${hour}`

      if (!patterns[key]) {
        patterns[key] = { reads: 0, clicks: 0, total: 0 }
      }

      patterns[key].total++
      if (notification.read) patterns[key].reads++
      if (notification.clickedAt) patterns[key].clicks++
    })

    // Calculate engagement scores
    return Object.entries(patterns).map(([key, data]) => {
      const [dayOfWeek, hour] = key.split('-').map(Number)
      const readRate = data.total > 0 ? data.reads / data.total : 0
      const clickRate = data.total > 0 ? data.clicks / data.total : 0
      const engagementScore = (readRate * 0.7) + (clickRate * 0.3) // Weighted score

      return {
        hour: Number(hour),
        dayOfWeek: Number(dayOfWeek),
        engagementScore
      }
    }).sort((a, b) => b.engagementScore - a.engagementScore)
  }

  // Apply Pakistani cultural considerations
  private applyCulturalConsiderations(
    patterns: { hour: number; dayOfWeek: number; engagementScore: number }[],
    timezone: string
  ): { hour: number; dayOfWeek: number; engagementScore: number }[] {
    
    // Pakistani cultural time adjustments
    const culturalAdjustments = {
      // Prayer times (approximate)
      fajr: 5,    // Dawn prayer
      dhuhr: 12,  // Midday prayer
      asr: 15,    // Afternoon prayer
      maghrib: 18, // Sunset prayer
      isha: 20,   // Night prayer
      
      // Business hours
      businessStart: 9,
      businessEnd: 18,
      
      // Lunch break
      lunchStart: 12,
      lunchEnd: 14,
      
      // Evening family time
      familyTimeStart: 19,
      familyTimeEnd: 22
    }

    return patterns.map(pattern => {
      let adjustedScore = pattern.engagementScore

      // Reduce score during prayer times
      if (this.isPrayerTime(pattern.hour, culturalAdjustments)) {
        adjustedScore *= 0.3
      }

      // Increase score during business hours
      if (pattern.hour >= culturalAdjustments.businessStart && 
          pattern.hour <= culturalAdjustments.businessEnd) {
        adjustedScore *= 1.2
      }

      // Reduce score during lunch break
      if (pattern.hour >= culturalAdjustments.lunchStart && 
          pattern.hour <= culturalAdjustments.lunchEnd) {
        adjustedScore *= 0.7
      }

      // Reduce score during family time
      if (pattern.hour >= culturalAdjustments.familyTimeStart && 
          pattern.hour <= culturalAdjustments.familyTimeEnd) {
        adjustedScore *= 0.8
      }

      // Weekend adjustments
      if (pattern.dayOfWeek === 0 || pattern.dayOfWeek === 6) { // Sunday or Saturday
        if (pattern.hour >= 10 && pattern.hour <= 16) {
          adjustedScore *= 1.1 // Slightly better on weekends during day
        } else {
          adjustedScore *= 0.9 // Slightly worse on weekends outside business hours
        }
      }

      return {
        ...pattern,
        engagementScore: Math.min(adjustedScore, 1.0) // Cap at 1.0
      }
    }).sort((a, b) => b.engagementScore - a.engagementScore)
  }

  // Check if time is during prayer time
  private isPrayerTime(hour: number, adjustments: any): boolean {
    const prayerTimes = [
      { start: adjustments.fajr, end: adjustments.fajr + 1 },
      { start: adjustments.dhuhr, end: adjustments.dhuhr + 1 },
      { start: adjustments.asr, end: adjustments.asr + 1 },
      { start: adjustments.maghrib, end: adjustments.maghrib + 1 },
      { start: adjustments.isha, end: adjustments.isha + 1 }
    ]

    return prayerTimes.some(prayer => hour >= prayer.start && hour <= prayer.end)
  }

  // Get default optimal times for new users
  private getDefaultOptimalTimes(userId: string, timezone: string): OptimalTimeData {
    // Default optimal times for Pakistani users
    const defaultTimes = [
      { hour: 10, dayOfWeek: 1, engagementScore: 0.8 }, // Monday 10 AM
      { hour: 14, dayOfWeek: 1, engagementScore: 0.7 }, // Monday 2 PM
      { hour: 16, dayOfWeek: 1, engagementScore: 0.6 }, // Monday 4 PM
      { hour: 10, dayOfWeek: 2, engagementScore: 0.8 }, // Tuesday 10 AM
      { hour: 14, dayOfWeek: 2, engagementScore: 0.7 }, // Tuesday 2 PM
      { hour: 16, dayOfWeek: 2, engagementScore: 0.6 }, // Tuesday 4 PM
      { hour: 10, dayOfWeek: 3, engagementScore: 0.8 }, // Wednesday 10 AM
      { hour: 14, dayOfWeek: 3, engagementScore: 0.7 }, // Wednesday 2 PM
      { hour: 16, dayOfWeek: 3, engagementScore: 0.6 }, // Wednesday 4 PM
      { hour: 10, dayOfWeek: 4, engagementScore: 0.8 }, // Thursday 10 AM
      { hour: 14, dayOfWeek: 4, engagementScore: 0.7 }, // Thursday 2 PM
      { hour: 16, dayOfWeek: 4, engagementScore: 0.6 }, // Thursday 4 PM
      { hour: 10, dayOfWeek: 5, engagementScore: 0.8 }, // Friday 10 AM
      { hour: 14, dayOfWeek: 5, engagementScore: 0.7 }, // Friday 2 PM
      { hour: 11, dayOfWeek: 6, engagementScore: 0.6 }, // Saturday 11 AM
      { hour: 15, dayOfWeek: 6, engagementScore: 0.5 }, // Saturday 3 PM
      { hour: 12, dayOfWeek: 0, engagementScore: 0.5 }, // Sunday 12 PM
      { hour: 16, dayOfWeek: 0, engagementScore: 0.4 }  // Sunday 4 PM
    ]

    return {
      userId,
      timezone,
      optimalTimes: defaultTimes,
      lastCalculated: new Date()
    }
  }

  // Get next optimal time from cached data
  private getNextOptimalTime(optimalData: OptimalTimeData, timezone: string): Date {
    const now = new Date()
    const currentHour = now.getHours()
    const currentDay = now.getDay()

    // Find the next optimal time
    const nextOptimal = optimalData.optimalTimes.find(time => {
      if (time.dayOfWeek > currentDay) return true
      if (time.dayOfWeek === currentDay && time.hour > currentHour) return true
      return false
    })

    if (nextOptimal) {
      const nextDate = new Date(now)
      const daysUntilOptimal = (nextOptimal.dayOfWeek - currentDay + 7) % 7
      nextDate.setDate(nextDate.getDate() + daysUntilOptimal)
      nextDate.setHours(nextOptimal.hour, 0, 0, 0)
      return nextDate
    }

    // If no optimal time found, use the first optimal time next week
    const firstOptimal = optimalData.optimalTimes[0]
    const nextDate = new Date(now)
    const daysUntilNextWeek = (7 - currentDay + firstOptimal.dayOfWeek) % 7
    nextDate.setDate(nextDate.getDate() + daysUntilNextWeek)
    nextDate.setHours(firstOptimal.hour, 0, 0, 0)
    return nextDate
  }

  // Check if cache is still valid (24 hours)
  private isCacheValid(lastCalculated: Date): boolean {
    const now = new Date()
    const hoursSinceLastCalculation = (now.getTime() - lastCalculated.getTime()) / (1000 * 60 * 60)
    return hoursSinceLastCalculation < 24
  }

  // Schedule notification for optimal time
  async scheduleNotification(
    userId: string,
    notificationData: any,
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
  ): Promise<Notification> {
    try {
      const preferences = await this.notificationService.getUserPreferences(userId)
      
      // For urgent notifications, send immediately
      if (priority === 'urgent') {
        return await this.notificationService.createNotification({
          ...notificationData,
          userId,
          priority: 'URGENT' as any
        })
      }

      // For high priority, send within 2 hours
      if (priority === 'high') {
        const scheduledTime = new Date()
        scheduledTime.setHours(scheduledTime.getHours() + 2)
        
        return await this.notificationService.createNotification({
          ...notificationData,
          userId,
          scheduledFor: scheduledTime,
          priority: 'HIGH' as any
        })
      }

      // For normal and low priority, use optimal scheduling
      const optimalTime = await this.calculateOptimalSendTime(userId)
      
      return await this.notificationService.createNotification({
        ...notificationData,
        userId,
        scheduledFor: optimalTime,
        priority: priority.toUpperCase() as any
      })
    } catch (error) {
      console.error('Error scheduling notification:', error)
      // Fallback to immediate delivery
      return await this.notificationService.createNotification({
        ...notificationData,
        userId
      })
    }
  }

  // Batch notifications for digest
  async createSmartDigest(userId: string, period: 'daily' | 'weekly' = 'daily'): Promise<void> {
    try {
      const preferences = await this.notificationService.getUserPreferences(userId)
      
      if (preferences?.digestFrequency === 'INSTANT') {
        return // Don't create digest for instant users
      }

      // Get optimal time for digest delivery
      const optimalTime = await this.calculateOptimalSendTime(userId)
      
      // Create digest
      await this.notificationService.createDigest(userId, period.toUpperCase() as any)
      
      console.log(`Smart digest scheduled for user ${userId} at ${optimalTime}`)
    } catch (error) {
      console.error('Error creating smart digest:', error)
    }
  }

  // Clear cache for user (useful for testing or when user behavior changes significantly)
  clearUserCache(userId: string): void {
    this.optimalTimesCache.delete(userId)
  }

  // Get cache statistics
  getCacheStats(): { size: number; users: string[] } {
    return {
      size: this.optimalTimesCache.size,
      users: Array.from(this.optimalTimesCache.keys())
    }
  }
}
