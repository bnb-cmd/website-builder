import { Context, Next } from 'hono'
import { verify } from 'hono/jwt'

export interface AuthUser {
  id: string
  email: string
  role: string
  iat: number
  exp: number
}

declare module 'hono' {
  interface ContextVariableMap {
    user: AuthUser
  }
}

export const authMiddleware = async (c: Context, next: Next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return c.json({ error: 'Authorization token required' }, 401)
  }

  try {
    const payload = await verify(token, c.env.JWT_SECRET)
    c.set('user', payload as AuthUser)
    await next()
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401)
  }
}

export const optionalAuthMiddleware = async (c: Context, next: Next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  
  if (token) {
    try {
      const payload = await verify(token, c.env.JWT_SECRET)
      c.set('user', payload as AuthUser)
    } catch (error) {
      // Continue without user if token is invalid
    }
  }
  
  await next()
}

export const adminMiddleware = async (c: Context, next: Next) => {
  const user = c.get('user')
  
  if (!user || user.role !== 'ADMIN') {
    return c.json({ error: 'Admin access required' }, 403)
  }
  
  await next()
}
