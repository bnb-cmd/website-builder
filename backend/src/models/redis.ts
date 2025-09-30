import Redis from 'ioredis'
import { config, redisConfig } from '@/config/environment'

export class RedisService {
  private static instance: RedisService
  private redis: Redis

  private constructor() {
    this.redis = new Redis(redisConfig.url, {
      password: redisConfig.password,
      db: redisConfig.db,
      enableReadyCheck: true,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keepAlive: 30000,
      connectTimeout: 10000,
      commandTimeout: 5000
    })

    this.redis.on('connect', () => {
      console.log('✅ Redis connected successfully')
    })

    this.redis.on('error', (error) => {
      console.error('❌ Redis connection error:', error)
    })

    this.redis.on('close', () => {
      console.log('⚠️ Redis connection closed')
    })

    this.redis.on('reconnecting', () => {
      console.log('🔄 Redis reconnecting...')
    })
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService()
    }
    return RedisService.instance
  }

  public getClient(): Redis {
    return this.redis
  }

  // Basic operations
  public async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.setex(key, ttl, value)
    } else {
      await this.redis.set(key, value)
    }
  }

  public async get(key: string): Promise<string | null> {
    return await this.redis.get(key)
  }

  public async del(key: string): Promise<number> {
    return await this.redis.del(key)
  }

  public async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key)
    return result === 1
  }

  public async expire(key: string, ttl: number): Promise<boolean> {
    const result = await this.redis.expire(key, ttl)
    return result === 1
  }

  public async ttl(key: string): Promise<number> {
    return await this.redis.ttl(key)
  }

  // JSON operations
  public async setJSON<T>(key: string, value: T, ttl?: number): Promise<void> {
    const jsonValue = JSON.stringify(value)
    await this.set(key, jsonValue, ttl)
  }

  public async getJSON<T>(key: string): Promise<T | null> {
    const value = await this.get(key)
    if (!value) return null
    
    try {
      return JSON.parse(value) as T
    } catch (error) {
      console.error('Failed to parse JSON from Redis:', error)
      return null
    }
  }

  // Hash operations
  public async hset(key: string, field: string, value: string): Promise<number> {
    return await this.redis.hset(key, field, value)
  }

  public async hget(key: string, field: string): Promise<string | null> {
    return await this.redis.hget(key, field)
  }

  public async hgetall(key: string): Promise<Record<string, string>> {
    return await this.redis.hgetall(key)
  }

  public async hdel(key: string, field: string): Promise<number> {
    return await this.redis.hdel(key, field)
  }

  // List operations
  public async lpush(key: string, ...values: string[]): Promise<number> {
    return await this.redis.lpush(key, ...values)
  }

  public async rpush(key: string, ...values: string[]): Promise<number> {
    return await this.redis.rpush(key, ...values)
  }

  public async lpop(key: string): Promise<string | null> {
    return await this.redis.lpop(key)
  }

  public async rpop(key: string): Promise<string | null> {
    return await this.redis.rpop(key)
  }

  public async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return await this.redis.lrange(key, start, stop)
  }

  public async llen(key: string): Promise<number> {
    return await this.redis.llen(key)
  }

  // Set operations
  public async sadd(key: string, ...members: string[]): Promise<number> {
    return await this.redis.sadd(key, ...members)
  }

  public async srem(key: string, ...members: string[]): Promise<number> {
    return await this.redis.srem(key, ...members)
  }

  public async smembers(key: string): Promise<string[]> {
    return await this.redis.smembers(key)
  }

  public async sismember(key: string, member: string): Promise<boolean> {
    const result = await this.redis.sismember(key, member)
    return result === 1
  }

  // Sorted set operations
  public async zadd(key: string, score: number, member: string): Promise<number> {
    return await this.redis.zadd(key, score, member)
  }

  public async zrange(key: string, start: number, stop: number): Promise<string[]> {
    return await this.redis.zrange(key, start, stop)
  }

  public async zrangebyscore(key: string, min: number, max: number): Promise<string[]> {
    return await this.redis.zrangebyscore(key, min, max)
  }

  public async zrem(key: string, member: string): Promise<number> {
    return await this.redis.zrem(key, member)
  }

  // Pattern operations
  public async keys(pattern: string): Promise<string[]> {
    return await this.redis.keys(pattern)
  }

  public async scan(cursor: string = '0', pattern?: string, count?: number): Promise<[string, string[]]> {
    const args: any[] = [cursor]
    if (pattern) {
      args.push('MATCH', pattern)
    }
    if (count) {
      args.push('COUNT', count)
    }
    const result = await this.redis.scan(...args)
    return [result[0], result[1]]
  }

  // Batch operations
  public async mget(...keys: string[]): Promise<(string | null)[]> {
    return await this.redis.mget(...keys)
  }

  public async mset(keyValuePairs: Record<string, string>): Promise<void> {
    const args: string[] = []
    for (const [key, value] of Object.entries(keyValuePairs)) {
      args.push(key, value)
    }
    await this.redis.mset(...args)
  }

  // Pipeline operations
  public pipeline() {
    return this.redis.pipeline()
  }

  // Pub/Sub operations
  public async publish(channel: string, message: string): Promise<number> {
    return await this.redis.publish(channel, message)
  }

  public async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    const subscriber = this.redis.duplicate()
    await subscriber.subscribe(channel)
    
    subscriber.on('message', (receivedChannel, message) => {
      if (receivedChannel === channel) {
        callback(message)
      }
    })
  }

  // Cache helpers
  public async cache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 3600
  ): Promise<T> {
    const cached = await this.getJSON<T>(key)
    if (cached !== null) {
      return cached
    }

    const data = await fetcher()
    await this.setJSON(key, data, ttl)
    return data
  }

  public async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.keys(pattern)
    if (keys.length > 0) {
      await this.redis.del(...keys)
    }
  }

  // Session management
  public async setSession(sessionId: string, data: any, ttl: number = 86400): Promise<void> {
    await this.setJSON(`session:${sessionId}`, data, ttl)
  }

  public async getSession(sessionId: string): Promise<any> {
    return await this.getJSON(`session:${sessionId}`)
  }

  public async deleteSession(sessionId: string): Promise<void> {
    await this.del(`session:${sessionId}`)
  }

  // Rate limiting
  public async rateLimit(
    key: string,
    limit: number,
    window: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Date.now()
    const windowStart = now - window * 1000
    
    const pipeline = this.redis.pipeline()
    
    // Remove old entries
    pipeline.zremrangebyscore(key, 0, windowStart)
    
    // Count current entries
    pipeline.zcard(key)
    
    // Add current request
    pipeline.zadd(key, now, `${now}-${Math.random()}`)
    
    // Set expiry
    pipeline.expire(key, Math.ceil(window))
    
    const results = await pipeline.exec()
    
    if (!results) {
      throw new Error('Pipeline execution failed')
    }
    
    const currentCount = results[1][1] as number
    const allowed = currentCount < limit
    const remaining = Math.max(0, limit - currentCount - 1)
    const resetTime = now + window * 1000
    
    return { allowed, remaining, resetTime }
  }

  // Health check
  public async healthCheck(): Promise<boolean> {
    try {
      await this.redis.ping()
      return true
    } catch (error) {
      console.error('Redis health check failed:', error)
      return false
    }
  }

  // Connection info
  public async getInfo(): Promise<Record<string, string>> {
    const info = await this.redis.info()
    return info as Record<string, string>
  }

  // Cleanup
  public async disconnect(): Promise<void> {
    await this.redis.disconnect()
  }
}

// Export singleton instance
export const redis = RedisService.getInstance()

// Graceful shutdown handler
process.on('SIGINT', async () => {
  console.log('🔄 Gracefully shutting down Redis connection...')
  await redis.disconnect()
})

process.on('SIGTERM', async () => {
  console.log('🔄 Gracefully shutting down Redis connection...')
  await redis.disconnect()
})
