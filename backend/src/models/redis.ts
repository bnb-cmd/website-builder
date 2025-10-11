class RedisService {
  private connected = false
  private cache = new Map<string, { value: string; expiry?: number }>()

  async connect(): Promise<void> {
    // Mock Redis connection for minimal version
    this.connected = true
    console.log('✅ Redis connected (mock)')
  }

  async disconnect(): Promise<void> {
    this.connected = false
  }

  async healthCheck(): Promise<boolean> {
    return this.connected
  }

  async get(key: string): Promise<string | null> {
    const item = this.cache.get(key)
    if (!item) return null
    
    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }
    
    return item.value
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const expiry = ttl ? Date.now() + (ttl * 1000) : undefined
    this.cache.set(key, { value, expiry })
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key)
  }

  async exists(key: string): Promise<boolean> {
    const item = this.cache.get(key)
    if (!item) return false
    
    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key)
      return false
    }
    
    return true
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
    const regex = new RegExp(pattern.replace(/\*/g, '.*'))
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }

  // Hash operations
  async hget(key: string, field: string): Promise<string | null> {
    const hashKey = `${key}:${field}`
    return this.get(hashKey)
  }

  async hset(key: string, field: string, value: string): Promise<void> {
    const hashKey = `${key}:${field}`
    await this.set(hashKey, value)
  }

  async hdel(key: string, field: string): Promise<void> {
    const hashKey = `${key}:${field}`
    await this.del(hashKey)
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    const result: Record<string, string> = {}
    const prefix = `${key}:`
    
    for (const [cacheKey, item] of this.cache.entries()) {
      if (cacheKey.startsWith(prefix)) {
        const field = cacheKey.substring(prefix.length)
        if (item.expiry && Date.now() > item.expiry) {
          this.cache.delete(cacheKey)
          continue
        }
        result[field] = item.value
      }
    }
    
    return result
  }
}

export const redis = new RedisService()
