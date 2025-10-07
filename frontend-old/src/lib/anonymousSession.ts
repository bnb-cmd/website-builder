import { v4 as uuid } from 'uuid'

export interface AnonymousSession {
  id: string
  createdAt: number
  expiresAt: number
  conversationData: {
    businessName?: string
    businessType?: string
    intent?: string
    industry?: string
    targetAudience?: string
    preferredLanguage?: string
    brandColors?: {
      primary: string
      secondary: string
      accent: string
    }
    features?: string[]
    siteGoals?: string[]
    brandTone?: string
    keywords?: string[]
  }
  messages: Array<{
    id: string
    type: 'user' | 'ai'
    content: string
    timestamp: number
  }>
  generatedWebsiteId?: string
  currentStep: string
}

class AnonymousSessionManager {
  private sessionKey = 'anonymous_session'
  private SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

  createSession(): AnonymousSession {
    const session: AnonymousSession = {
      id: uuid(),
      createdAt: Date.now(),
      expiresAt: Date.now() + this.SESSION_DURATION,
      conversationData: {},
      messages: [],
      currentStep: 'initial'
    }
    
    this.saveSession(session)
    return session
  }

  getSession(): AnonymousSession | null {
    try {
      const stored = localStorage.getItem(this.sessionKey)
      if (!stored) return null

      const session: AnonymousSession = JSON.parse(stored)
      
      // Check if expired
      if (session.expiresAt < Date.now()) {
        this.clearSession()
        return null
      }

      return session
    } catch (error) {
      console.error('Failed to get anonymous session:', error)
      return null
    }
  }

  getOrCreateSession(): AnonymousSession {
    const existing = this.getSession()
    if (existing) return existing
    return this.createSession()
  }

  updateSession(updates: Partial<AnonymousSession>): AnonymousSession | null {
    const session = this.getSession()
    if (!session) return null

    const updated = { ...session, ...updates }
    this.saveSession(updated)
    return updated
  }

  updateConversationData(data: Partial<AnonymousSession['conversationData']>): AnonymousSession | null {
    const session = this.getSession()
    if (!session) return null

    const updated = {
      ...session,
      conversationData: {
        ...session.conversationData,
        ...data
      }
    }
    
    this.saveSession(updated)
    return updated
  }

  addMessage(type: 'user' | 'ai', content: string): AnonymousSession | null {
    const session = this.getSession()
    if (!session) return null

    const message = {
      id: uuid(),
      type,
      content,
      timestamp: Date.now()
    }

    const updated = {
      ...session,
      messages: [...session.messages, message]
    }

    this.saveSession(updated)
    return updated
  }

  private saveSession(session: AnonymousSession): void {
    try {
      localStorage.setItem(this.sessionKey, JSON.stringify(session))
    } catch (error) {
      console.error('Failed to save anonymous session:', error)
    }
  }

  clearSession(): void {
    localStorage.removeItem(this.sessionKey)
  }

  hasSession(): boolean {
    return this.getSession() !== null
  }

  getSessionId(): string | null {
    const session = this.getSession()
    return session?.id || null
  }
}

export const anonymousSessionManager = new AnonymousSessionManager()
