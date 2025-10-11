import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { FastifyRequest } from 'fastify'
import { User, UserRole } from '@prisma/client'
import { redis } from '@/models/redis'
import { authConfig } from '@/config/environment'

export interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export class AuthService {
  private readonly jwtSecret: string
  private readonly jwtExpiry: string
  private readonly refreshExpiry: string

  constructor() {
    this.jwtSecret = authConfig.jwtSecret
    this.jwtExpiry = authConfig.jwtExpiresIn
    this.refreshExpiry = authConfig.refreshTokenExpiresIn
  }

  /**
   * Generate a pair of access and refresh tokens
   */
  generateTokenPair(user: User): TokenPair {
    const sessionId = crypto.randomUUID()
    
    const accessTokenPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      sessionId,
      type: 'access'
    }

    const refreshTokenPayload = {
      userId: user.id,
      sessionId,
      type: 'refresh'
    }

    const accessToken = jwt.sign(accessTokenPayload, this.jwtSecret, {
      expiresIn: '7d'
    })

    const refreshToken = jwt.sign(refreshTokenPayload, this.jwtSecret, {
      expiresIn: '30d'
    })

    // Store session in Redis
    this.storeSession(sessionId, user)

    return {
      accessToken,
      refreshToken,
      expiresIn: this.parseExpiry(this.jwtExpiry)
    }
  }

  /**
   * Refresh an access token using a refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<TokenPair | null> {
    try {
      const decoded = jwt.verify(refreshToken, this.jwtSecret) as any
      
      if (decoded.type !== 'refresh') {
        return null
      }

      // Get session data
      const session = await this.getSession(decoded.sessionId)
      if (!session) {
        return null
      }

      // Generate new token pair
      const newTokenPair = this.generateTokenPair(session)

      // Blacklist old refresh token
      await this.blacklistToken(refreshToken)

      return newTokenPair
    } catch (error) {
      console.error('Token refresh failed:', error)
      return null
    }
  }

  /**
   * Blacklist a token (for logout)
   */
  async blacklistToken(token: string): Promise<void> {
    try {
      const decoded = jwt.decode(token) as any
      if (decoded && decoded.exp) {
        const ttl = decoded.exp - Math.floor(Date.now() / 1000)
        if (ttl > 0) {
          await redis.set(`blacklist:${token}`, 'true', ttl)
        }
      }
    } catch (error) {
      console.error('Token blacklisting failed:', error)
    }
  }

  /**
   * Hash a password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, authConfig.bcryptRounds)
  }

  /**
   * Verify a password against its hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  /**
   * Validate password strength
   */
  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Generate a secure random token
   */
  generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  /**
   * Extract token from request headers
   */
  extractTokenFromRequest(request: FastifyRequest): string | null {
    const authHeader = request.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }
    return null
  }

  /**
   * Store session data in Redis
   */
  private async storeSession(sessionId: string, user: User): Promise<void> {
    try {
      const key = `session:${sessionId}`
      const sessionData = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      }
      await redis.setJSON(key, sessionData, 7 * 24 * 60 * 60) // 7 days
    } catch (error) {
      console.error('Session storage failed:', error)
    }
  }

  /**
   * Get session data from Redis
   */
  private async getSession(sessionId: string): Promise<User | null> {
    try {
      const key = `session:${sessionId}`
      const sessionData = await redis.getJSON(key)
      if (!sessionData) return null

      // Return as User object
      return {
        id: (sessionData as any).userId,
        email: (sessionData as any).email,
        name: (sessionData as any).name,
        role: (sessionData as any).role,
        password: '', // Not needed for token generation
        phone: '',
        avatar: '',
        status: 'ACTIVE' as any,
        businessType: null,
        city: '',
        companyName: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
        preferredLanguage: 'ENGLISH' as any,
        aiQuotaUsed: 0,
        aiQuotaResetAt: null
      } as User
    } catch (error) {
      console.error('Session retrieval failed:', error)
      return null
    }
  }

  /**
   * Parse expiry string to seconds
   */
  private parseExpiry(expiry: string): number {
    const match = expiry.match(/(\d+)([smhd])/)
    if (!match) return 3600 // Default 1 hour

    const value = parseInt(match[1])
    const unit = match[2]

    switch (unit) {
      case 's': return value
      case 'm': return value * 60
      case 'h': return value * 60 * 60
      case 'd': return value * 24 * 60 * 60
      default: return 3600
    }
  }

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}