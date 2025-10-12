import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { db } from '../lib/db'
import { kv } from '../lib/kv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const authRoutes = new Hono()

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  password: z.string().min(8),
  phone: z.string().optional(),
  businessType: z.enum(['INDIVIDUAL', 'BUSINESS', 'NONPROFIT', 'EDUCATION']).optional(),
  city: z.string().optional(),
  companyName: z.string().optional(),
  preferredLanguage: z.enum(['ENGLISH', 'URDU']).default('ENGLISH')
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8)
})

const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  businessType: z.enum(['INDIVIDUAL', 'BUSINESS', 'NONPROFIT', 'EDUCATION']).optional(),
  city: z.string().optional(),
  companyName: z.string().optional(),
  preferredLanguage: z.enum(['ENGLISH', 'URDU']).optional(),
  avatar: z.string().url().optional()
})

type Bindings = {
  DB: D1Database
  CACHE_KV: KVNamespace
  JWT_SECRET: string
}

// Helper function to generate JWT token
const generateToken = (userId: string, email: string, role: string = 'USER') => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  )
}

// POST /register - User registration
authRoutes.post('/register', zValidator('json', registerSchema), async (c) => {
  const { DB, CACHE_KV, JWT_SECRET } = c.env as Bindings
  const { email, name, password, phone, businessType, city, companyName, preferredLanguage } = c.req.valid('json')

  try {
    // Check if user already exists
    const existingUser = await db.queryOne(c, 'SELECT id FROM users WHERE email = ?', [email])
    if (existingUser) {
      return c.json({
        success: false,
        error: {
          message: 'User with this email already exists',
          code: 'USER_EXISTS'
        }
      }, 409)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const userId = crypto.randomUUID()
    await db.execute(c, `
      INSERT INTO users (id, email, name, password, phone, businessType, city, companyName, preferredLanguage, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId, email, name, hashedPassword, phone, businessType, city, companyName, preferredLanguage,
      new Date().toISOString(), new Date().toISOString()
    ])

    // Generate token
    const token = generateToken(userId, email)

    // Store session in KV
    await kv.setJSON(c, `session:${userId}`, {
      userId,
      email,
      role: 'USER',
      createdAt: new Date().toISOString()
    }, 7 * 24 * 60 * 60) // 7 days

    return c.json({
      success: true,
      data: {
        user: {
          id: userId,
          email,
          name,
          phone,
          businessType,
          city,
          companyName,
          preferredLanguage,
          role: 'USER',
          status: 'ACTIVE'
        },
        token
      }
    })

  } catch (error: any) {
    console.error('Registration error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Registration failed',
        code: 'REGISTRATION_ERROR'
      }
    }, 500)
  }
})

// POST /login - User login
authRoutes.post('/login', zValidator('json', loginSchema), async (c) => {
  const { DB, CACHE_KV } = c.env as Bindings
  const { email, password } = c.req.valid('json')

  try {
    // Find user
    const user = await db.queryOne(c, 'SELECT * FROM users WHERE email = ?', [email])
    if (!user) {
      return c.json({
        success: false,
        error: {
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        }
      }, 401)
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return c.json({
        success: false,
        error: {
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        }
      }, 401)
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      return c.json({
        success: false,
        error: {
          message: 'Account is not active',
          code: 'ACCOUNT_INACTIVE'
        }
      }, 403)
    }

    // Update last login
    await db.execute(c, 'UPDATE users SET lastLoginAt = ? WHERE id = ?', [new Date().toISOString(), user.id])

    // Generate token
    const token = generateToken(user.id, user.email, user.role)

    // Store session in KV
    await kv.setJSON(c, `session:${user.id}`, {
      userId: user.id,
      email: user.email,
      role: user.role,
      createdAt: new Date().toISOString()
    }, 7 * 24 * 60 * 60) // 7 days

    return c.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          businessType: user.businessType,
          city: user.city,
          companyName: user.companyName,
          preferredLanguage: user.preferredLanguage,
          role: user.role,
          status: user.status,
          avatar: user.avatar,
          lastLoginAt: user.lastLoginAt
        },
        token
      }
    })

  } catch (error: any) {
    console.error('Login error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Login failed',
        code: 'LOGIN_ERROR'
      }
    }, 500)
  }
})

// POST /logout - User logout
authRoutes.post('/logout', async (c) => {
  const { CACHE_KV } = c.env as Bindings
  const userId = c.get('user')?.userId

  try {
    if (userId) {
      // Remove session from KV
      await kv.delete(c, `session:${userId}`)
    }

    return c.json({
      success: true,
      message: 'Logged out successfully'
    })

  } catch (error: any) {
    console.error('Logout error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Logout failed',
        code: 'LOGOUT_ERROR'
      }
    }, 500)
  }
})

// GET /profile - Get user profile
authRoutes.get('/profile', async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId

  try {
    if (!userId) {
      return c.json({
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    const user = await db.queryOne(c, `
      SELECT id, email, name, phone, businessType, city, companyName, 
             preferredLanguage, role, status, avatar, createdAt, updatedAt, lastLoginAt
      FROM users WHERE id = ?
    `, [userId])

    if (!user) {
      return c.json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      }, 404)
    }

    return c.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          businessType: user.businessType,
          city: user.city,
          companyName: user.companyName,
          preferredLanguage: user.preferredLanguage,
          role: user.role,
          status: user.status,
          avatar: user.avatar,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLoginAt: user.lastLoginAt
        }
      }
    })

  } catch (error: any) {
    console.error('Get profile error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to get profile',
        code: 'GET_PROFILE_ERROR'
      }
    }, 500)
  }
})

// PUT /profile - Update user profile
authRoutes.put('/profile', zValidator('json', updateProfileSchema), async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId
  const updateData = c.req.valid('json')

  try {
    if (!userId) {
      return c.json({
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    // Build dynamic update query
    const fields = Object.keys(updateData).filter(key => updateData[key] !== undefined)
    if (fields.length === 0) {
      return c.json({
        success: false,
        error: {
          message: 'No fields to update',
          code: 'NO_FIELDS_TO_UPDATE'
        }
      }, 400)
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ')
    const values = fields.map(field => updateData[field])
    values.push(new Date().toISOString(), userId)

    await db.execute(c, `
      UPDATE users 
      SET ${setClause}, updatedAt = ?
      WHERE id = ?
    `, values)

    // Get updated user
    const user = await db.queryOne(c, `
      SELECT id, email, name, phone, businessType, city, companyName, 
             preferredLanguage, role, status, avatar, createdAt, updatedAt, lastLoginAt
      FROM users WHERE id = ?
    `, [userId])

    return c.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          businessType: user.businessType,
          city: user.city,
          companyName: user.companyName,
          preferredLanguage: user.preferredLanguage,
          role: user.role,
          status: user.status,
          avatar: user.avatar,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLoginAt: user.lastLoginAt
        }
      }
    })

  } catch (error: any) {
    console.error('Update profile error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to update profile',
        code: 'UPDATE_PROFILE_ERROR'
      }
    }, 500)
  }
})

// POST /change-password - Change password
authRoutes.post('/change-password', zValidator('json', changePasswordSchema), async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId
  const { currentPassword, newPassword } = c.req.valid('json')

  try {
    if (!userId) {
      return c.json({
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    // Get current user
    const user = await db.queryOne(c, 'SELECT password FROM users WHERE id = ?', [userId])
    if (!user) {
      return c.json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      }, 404)
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      return c.json({
        success: false,
        error: {
          message: 'Current password is incorrect',
          code: 'INVALID_CURRENT_PASSWORD'
        }
      }, 400)
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // Update password
    await db.execute(c, `
      UPDATE users 
      SET password = ?, updatedAt = ?
      WHERE id = ?
    `, [hashedNewPassword, new Date().toISOString(), userId])

    return c.json({
      success: true,
      message: 'Password changed successfully'
    })

  } catch (error: any) {
    console.error('Change password error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to change password',
        code: 'CHANGE_PASSWORD_ERROR'
      }
    }, 500)
  }
})

// POST /forgot-password - Forgot password
authRoutes.post('/forgot-password', async (c) => {
  const { DB, CACHE_KV } = c.env as Bindings
  const { email } = await c.req.json()

  try {
    if (!email) {
      return c.json({
        success: false,
        error: {
          message: 'Email is required',
          code: 'EMAIL_REQUIRED'
        }
      }, 400)
    }

    // Check if user exists
    const user = await db.queryOne(c, 'SELECT id, email, name FROM users WHERE email = ?', [email])
    if (!user) {
      // Don't reveal if user exists or not
      return c.json({
        success: true,
        message: 'If an account with that email exists, we sent a password reset link'
      })
    }

    // Generate reset token
    const resetToken = crypto.randomUUID()
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Store reset token in KV
    await kv.setJSON(c, `reset_token:${resetToken}`, {
      userId: user.id,
      email: user.email,
      expiresAt: resetExpiry.toISOString()
    }, 60 * 60) // 1 hour TTL

    // TODO: Send email with reset link
    // For now, just return success
    console.log(`Password reset token for ${email}: ${resetToken}`)

    return c.json({
      success: true,
      message: 'If an account with that email exists, we sent a password reset link'
    })

  } catch (error: any) {
    console.error('Forgot password error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to process password reset request',
        code: 'FORGOT_PASSWORD_ERROR'
      }
    }, 500)
  }
})

// POST /reset-password - Reset password
authRoutes.post('/reset-password', async (c) => {
  const { DB, CACHE_KV } = c.env as Bindings
  const { token, newPassword } = await c.req.json()

  try {
    if (!token || !newPassword) {
      return c.json({
        success: false,
        error: {
          message: 'Token and new password are required',
          code: 'TOKEN_AND_PASSWORD_REQUIRED'
        }
      }, 400)
    }

    // Get reset token data
    const resetData = await kv.getJSON(c, `reset_token:${token}`)
    if (!resetData) {
      return c.json({
        success: false,
        error: {
          message: 'Invalid or expired reset token',
          code: 'INVALID_RESET_TOKEN'
        }
      }, 400)
    }

    // Check if token is expired
    if (new Date(resetData.expiresAt) < new Date()) {
      await kv.delete(c, `reset_token:${token}`)
      return c.json({
        success: false,
        error: {
          message: 'Reset token has expired',
          code: 'RESET_TOKEN_EXPIRED'
        }
      }, 400)
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update password
    await db.execute(c, `
      UPDATE users 
      SET password = ?, updatedAt = ?
      WHERE id = ?
    `, [hashedPassword, new Date().toISOString(), resetData.userId])

    // Delete reset token
    await kv.delete(c, `reset_token:${token}`)

    return c.json({
      success: true,
      message: 'Password reset successfully'
    })

  } catch (error: any) {
    console.error('Reset password error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to reset password',
        code: 'RESET_PASSWORD_ERROR'
      }
    }, 500)
  }
})

// GET /verify-email - Verify email
authRoutes.get('/verify-email', async (c) => {
  const { DB, CACHE_KV } = c.env as Bindings
  const token = c.req.query('token')

  try {
    if (!token) {
      return c.json({
        success: false,
        error: {
          message: 'Verification token is required',
          code: 'TOKEN_REQUIRED'
        }
      }, 400)
    }

    // Get verification token data
    const verificationData = await kv.getJSON(c, `verify_token:${token}`)
    if (!verificationData) {
      return c.json({
        success: false,
        error: {
          message: 'Invalid verification token',
          code: 'INVALID_VERIFICATION_TOKEN'
        }
      }, 400)
    }

    // Update user email verification status
    await db.execute(c, `
      UPDATE users 
      SET emailVerified = true, updatedAt = ?
      WHERE id = ?
    `, [new Date().toISOString(), verificationData.userId])

    // Delete verification token
    await kv.delete(c, `verify_token:${token}`)

    return c.json({
      success: true,
      message: 'Email verified successfully'
    })

  } catch (error: any) {
    console.error('Verify email error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to verify email',
        code: 'VERIFY_EMAIL_ERROR'
      }
    }, 500)
  }
})

export { authRoutes }