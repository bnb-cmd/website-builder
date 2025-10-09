class RedisService {
  private connected = false

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
    return null
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    // Mock implementation
  }

  async del(key: string): Promise<void> {
    // Mock implementation
  }

  async exists(key: string): Promise<boolean> {
    return false
  }
}

export const redis = new RedisService()
