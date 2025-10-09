import { PrismaClient } from '@prisma/client'

class DatabaseService {
  private client: PrismaClient | null = null

  getClient(): PrismaClient {
    if (!this.client) {
      this.client = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
      })
    }
    return this.client
  }

  async connect(): Promise<void> {
    try {
      await this.getClient().$connect()
      console.log('✅ Database connected successfully')
    } catch (error) {
      console.error('❌ Database connection failed:', error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.$disconnect()
      this.client = null
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.getClient().$queryRaw`SELECT 1`
      return true
    } catch (error) {
      console.error('Database health check failed:', error)
      return false
    }
  }
}

export const db = new DatabaseService()
