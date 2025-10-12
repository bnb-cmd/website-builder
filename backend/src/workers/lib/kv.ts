import type { Env } from '../index'

export interface CacheAdapter {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T, ttl?: number): Promise<void>
  delete(key: string): Promise<void>
  exists(key: string): Promise<boolean>
  getJSON<T>(key: string): Promise<T | null>
  setJSON<T>(key: string, value: T, ttl?: number): Promise<void>
  invalidatePattern(pattern: string): Promise<void>
}

export class KVAdapter implements CacheAdapter {
  constructor(private kv: KVNamespace) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.kv.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('KV get error:', error)
      return null
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const options: KVNamespacePutOptions = {}
      if (ttl) {
        options.expirationTtl = ttl
      }
      await this.kv.put(key, JSON.stringify(value), options)
    } catch (error) {
      console.error('KV set error:', error)
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.kv.delete(key)
    } catch (error) {
      console.error('KV delete error:', error)
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const value = await this.kv.get(key)
      return value !== null
    } catch (error) {
      console.error('KV exists error:', error)
      return false
    }
  }

  async getJSON<T>(key: string): Promise<T | null> {
    return this.get<T>(key)
  }

  async setJSON<T>(key: string, value: T, ttl?: number): Promise<void> {
    return this.set<T>(key, value, ttl)
  }

  async invalidatePattern(pattern: string): Promise<void> {
    // KV doesn't support pattern deletion, so we'll track keys manually
    // This is a limitation we'll work around
    console.warn('Pattern invalidation not supported in KV')
  }
}

export const initKV = (env: Env): CacheAdapter => {
  return new KVAdapter(env.CACHE)
}

// Cache key generators
export const cacheKeys = {
  user: (id: string) => `user:${id}`,
  website: (id: string) => `website:${id}`,
  page: (id: string) => `page:${id}`,
  template: (id: string) => `template:${id}`,
  media: (id: string) => `media:${id}`,
  userSites: (userId: string) => `user_sites:${userId}`,
  sitePages: (siteId: string) => `site_pages:${siteId}`,
  version: (pageId: string, version: number) => `version:${pageId}:${version}`,
  publishJob: (jobId: string) => `publish_job:${jobId}`,
  aiGeneration: (userId: string, sessionId: string) => `ai_gen:${userId}:${sessionId}`
}

// Cache TTL constants (in seconds)
export const cacheTTL = {
  user: 3600, // 1 hour
  website: 300, // 5 minutes
  page: 300, // 5 minutes
  template: 1800, // 30 minutes
  media: 3600, // 1 hour
  userSites: 300, // 5 minutes
  sitePages: 300, // 5 minutes
  version: 86400, // 24 hours
  publishJob: 3600, // 1 hour
  aiGeneration: 1800 // 30 minutes
}
