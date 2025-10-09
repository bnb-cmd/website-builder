import Redis from 'ioredis';
import { config } from '@/config/environment';

interface SessionData {
  [key: string]: any;
  expiresAt?: number;
}

export class RedisSessionStore {
  private client: Redis;
  private ttl: number;

  constructor() {
    // Parse the Redis URL to extract connection details
    const redisUrl = new URL(config.redis.url);
    const auth = redisUrl.username ? `${redisUrl.username}:${redisUrl.password}` : undefined;
    
    this.client = new Redis({
      host: redisUrl.hostname,
      port: parseInt(redisUrl.port, 10) || 6379,
      password: auth || config.redis.password,
      db: config.redis.db || 0,
      keyPrefix: 'session:'
    });
    
    // Use TTL from config or default to 24 hours
    this.ttl = config.redis.sessionTtl || 24 * 60 * 60;
  }

  /**
   * Get session data by session ID
   */
  async get(sessionId: string): Promise<SessionData | null> {
    try {
      const data = await this.client.get(sessionId);
      if (!data) return null;
      
      const parsedData = JSON.parse(data);
      
      // Check if session is expired
      if (parsedData.expiresAt && parsedData.expiresAt < Date.now()) {
        await this.destroy(sessionId);
        return null;
      }
      
      return parsedData;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  /**
   * Set session data
   */
  async set(sessionId: string, data: SessionData, ttl?: number): Promise<boolean> {
    try {
      const sessionData = {
        ...data,
        updatedAt: Date.now(),
        expiresAt: Date.now() + (ttl || this.ttl) * 1000
      };
      
      const result = await this.client.set(
        sessionId,
        JSON.stringify(sessionData),
        'EX',
        ttl || this.ttl
      );
      
      return result === 'OK';
    } catch (error) {
      console.error('Error setting session:', error);
      return false;
    }
  }

  /**
   * Destroy a session
   */
  async destroy(sessionId: string): Promise<boolean> {
    try {
      const result = await this.client.del(sessionId);
      return result > 0;
    } catch (error) {
      console.error('Error destroying session:', error);
      return false;
    }
  }

  /**
   * Refresh session TTL
   */
  async touch(sessionId: string, ttl?: number): Promise<boolean> {
    try {
      const data = await this.get(sessionId);
      if (!data) return false;
      
      return this.set(sessionId, data, ttl || this.ttl);
    } catch (error) {
      console.error('Error touching session:', error);
      return false;
    }
  }

  /**
   * Get all sessions (for admin purposes)
   */
  async getAllSessions(): Promise<{ [key: string]: SessionData }> {
    try {
      const keys = await this.client.keys('*');
      const sessions: { [key: string]: SessionData } = {};
      
      for (const key of keys) {
        const sessionId = key.replace('session:', '');
        const data = await this.get(sessionId);
        if (data) {
          sessions[sessionId] = data;
        }
      }
      
      return sessions;
    } catch (error) {
      console.error('Error getting all sessions:', error);
      return {};
    }
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    try {
      const keys = await this.client.keys('*');
      let count = 0;
      
      for (const key of keys) {
        const sessionId = key.replace('session:', '');
        const data = await this.get(sessionId);
        
        // If get returns null, the session is expired and was deleted
        if (!data) {
          count++;
        }
      }
      
      return count;
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error);
      return 0;
    }
  }

  /**
   * Close the Redis connection
   */
  async close(): Promise<void> {
    try {
      await this.client.quit();
    } catch (error) {
      console.error('Error closing Redis connection:', error);
    }
  }
}

// Create a singleton instance
export const redisSessionStore = new RedisSessionStore();

// Clean up expired sessions every hour
setInterval(() => {
  redisSessionStore.cleanupExpiredSessions()
    .then(count => {
      if (count > 0) {
        console.log(`Cleaned up ${count} expired sessions`);
      }
    })
    .catch(console.error);
}, 60 * 60 * 1000); // Every hour

// Handle process termination
process.on('SIGTERM', async () => {
  await redisSessionStore.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await redisSessionStore.close();
  process.exit(0);
});
