import { Redis as UpstashRedis } from '@upstash/redis'
import IORedis from 'ioredis'

class RedisService {
  private upstashClient: UpstashRedis | null = null
  private ioredisClient: IORedis | null = null
  private fallbackCache = new Map<string, { value: string; expiry?: number }>()
  private connected = false
  
  private get client() {
    return this.upstashClient || this.ioredisClient
  }

  async connect(): Promise<void> {
    try {
      // Priority 1: Upstash (serverless, REST API)
      if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        this.upstashClient = new UpstashRedis({
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN,
        })
        console.log('✅ Redis connected (Upstash)')
        this.connected = true
        return
      }
      
      // Priority 2: Railway/Standard Redis (native protocol)
      if (process.env.REDIS_URL) {
        this.ioredisClient = new IORedis(process.env.REDIS_URL, {
          maxRetriesPerRequest: 3,
          enableReadyCheck: true,
          lazyConnect: false,
          connectTimeout: 10000,
          commandTimeout: 5000,
        })
        
        await this.ioredisClient.connect()
        console.log('✅ Redis connected (Railway/Standard)')
        this.connected = true
        return
      }
      
      // Priority 3: Fallback to in-memory (development)
      console.log('⚠️  Using in-memory cache (no Redis configured)')
      this.connected = true
    } catch (error) {
      console.error('❌ Redis connection failed:', error)
      console.log('⚠️  Falling back to in-memory cache')
      this.connected = true
    }
  }

  async disconnect(): Promise<void> {
    if (this.ioredisClient) {
      await this.ioredisClient.quit()
      this.ioredisClient = null
    }
    // Upstash doesn't need disconnect (HTTP-based)
    this.upstashClient = null
    this.connected = false
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (this.upstashClient) {
        await this.upstashClient.ping()
        return true
      }
      
      if (this.ioredisClient) {
        await this.ioredisClient.ping()
        return true
      }
      
      return this.connected
    } catch (error) {
      console.error('Redis health check failed:', error)
      return false
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      if (this.upstashClient) {
        return await this.upstashClient.get<string>(key)
      }
      
      if (this.ioredisClient) {
        return await this.ioredisClient.get(key)
      }
      
      // Fallback to in-memory
      const item = this.fallbackCache.get(key)
      if (!item) return null
      
      if (item.expiry && Date.now() > item.expiry) {
        this.fallbackCache.delete(key)
        return null
      }
      
      return item.value
    } catch (error) {
      console.error('Redis get error:', error)
      return null
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (this.upstashClient) {
        if (ttl) {
          await this.upstashClient.setex(key, ttl, value)
        } else {
          await this.upstashClient.set(key, value)
        }
        return
      }
      
      if (this.ioredisClient) {
        if (ttl) {
          await this.ioredisClient.setex(key, ttl, value)
        } else {
          await this.ioredisClient.set(key, value)
        }
        return
      }
      
      // Fallback to in-memory
      const expiry = ttl ? Date.now() + (ttl * 1000) : undefined
      this.fallbackCache.set(key, { value, expiry })
    } catch (error) {
      console.error('Redis set error:', error)
    }
  }

  async del(key: string): Promise<void> {
    try {
      if (this.upstashClient) {
        await this.upstashClient.del(key)
        return
      }
      
      if (this.ioredisClient) {
        await this.ioredisClient.del(key)
        return
      }
      
      this.fallbackCache.delete(key)
    } catch (error) {
      console.error('Redis del error:', error)
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (this.upstashClient) {
        const result = await this.upstashClient.exists(key)
        return result === 1
      }
      
      if (this.ioredisClient) {
        const result = await this.ioredisClient.exists(key)
        return result === 1
      }
      
      // Fallback to in-memory
      const item = this.fallbackCache.get(key)
      if (!item) return false
      
      if (item.expiry && Date.now() > item.expiry) {
        this.fallbackCache.delete(key)
        return false
      }
      
      return true
    } catch (error) {
      console.error('Redis exists error:', error)
      return false
    }
  }

  // Additional methods for authentication
  async getJSON<T>(key: string): Promise<T | null> {
    const value = await this.get(key)
    if (!value) return null
    
    try {
      return JSON.parse(value) as T
    } catch {
      return null
    }
  }

  async setJSON<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttl)
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      if (this.upstashClient) {
        // Upstash doesn't support pattern matching in free tier
        // Would need to implement key scanning
        console.warn('Pattern invalidation not supported with Upstash')
        return
      }
      
      if (this.ioredisClient) {
        const keys = await this.ioredisClient.keys(pattern)
        if (keys.length > 0) {
          await this.ioredisClient.del(...keys)
        }
        return
      }
      
      // Fallback to in-memory
      const regex = new RegExp(pattern.replace(/\*/g, '.*'))
      for (const key of this.fallbackCache.keys()) {
        if (regex.test(key)) {
          this.fallbackCache.delete(key)
        }
      }
    } catch (error) {
      console.error('Redis invalidatePattern error:', error)
    }
  }

  // Hash operations
  async hget(key: string, field: string): Promise<string | null> {
    try {
      if (this.upstashClient) {
        return await this.upstashClient.hget<string>(key, field)
      }
      
      if (this.ioredisClient) {
        return await this.ioredisClient.hget(key, field)
      }
      
      // Fallback to in-memory
      const hashKey = `${key}:${field}`
      return this.get(hashKey)
    } catch (error) {
      console.error('Redis hget error:', error)
      return null
    }
  }

  async hset(key: string, field: string, value: string): Promise<void> {
    try {
      if (this.upstashClient) {
        await this.upstashClient.hset(key, { [field]: value })
        return
      }
      
      if (this.ioredisClient) {
        await this.ioredisClient.hset(key, field, value)
        return
      }
      
      // Fallback to in-memory
      const hashKey = `${key}:${field}`
      await this.set(hashKey, value)
    } catch (error) {
      console.error('Redis hset error:', error)
    }
  }

  async hdel(key: string, field: string): Promise<void> {
    try {
      if (this.upstashClient) {
        await this.upstashClient.hdel(key, field)
        return
      }
      
      if (this.ioredisClient) {
        await this.ioredisClient.hdel(key, field)
        return
      }
      
      // Fallback to in-memory
      const hashKey = `${key}:${field}`
      await this.del(hashKey)
    } catch (error) {
      console.error('Redis hdel error:', error)
    }
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    try {
      if (this.upstashClient) {
        return await this.upstashClient.hgetall<Record<string, string>>(key) || {}
      }
      
      if (this.ioredisClient) {
        return await this.ioredisClient.hgetall(key)
      }
      
      // Fallback to in-memory
      const result: Record<string, string> = {}
      const prefix = `${key}:`
      
      for (const [cacheKey, item] of this.fallbackCache.entries()) {
        if (cacheKey.startsWith(prefix)) {
          const field = cacheKey.substring(prefix.length)
          if (item.expiry && Date.now() > item.expiry) {
            this.fallbackCache.delete(cacheKey)
            continue
          }
          result[field] = item.value
        }
      }
      
      return result
    } catch (error) {
      console.error('Redis hgetall error:', error)
      return {}
    }
  }

  // Additional utility methods
  async ttl(key: string): Promise<number> {
    try {
      if (this.upstashClient) {
        return await this.upstashClient.ttl(key)
      }
      
      if (this.ioredisClient) {
        return await this.ioredisClient.ttl(key)
      }
      
      // Fallback to in-memory
      const item = this.fallbackCache.get(key)
      if (!item || !item.expiry) return -1
      
      const remaining = Math.floor((item.expiry - Date.now()) / 1000)
      return remaining > 0 ? remaining : -2
    } catch (error) {
      console.error('Redis ttl error:', error)
      return -1
    }
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      if (this.upstashClient) {
        const result = await this.upstashClient.expire(key, seconds)
        return result === 1
      }
      
      if (this.ioredisClient) {
        const result = await this.ioredisClient.expire(key, seconds)
        return result === 1
      }
      
      // Fallback to in-memory
      const item = this.fallbackCache.get(key)
      if (!item) return false
      
      item.expiry = Date.now() + (seconds * 1000)
      return true
    } catch (error) {
      console.error('Redis expire error:', error)
      return false
    }
  }
}

export const redis = new RedisService()
