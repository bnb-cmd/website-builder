import { PrismaClient } from '@prisma/client'
import { config, databaseConfig } from '@/config/environment'

export class DatabaseService {
  private static instance: DatabaseService
  private prisma: PrismaClient

  private constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseConfig.url
        }
      },
      log: config.server.nodeEnv === 'development' 
        ? ['query', 'info', 'warn', 'error'] 
        : ['error'],
      errorFormat: 'pretty'
    })
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  public getClient(): PrismaClient {
    return this.prisma
  }

  public async connect(): Promise<void> {
    try {
      await this.prisma.$connect()
      console.log('✅ Database connected successfully')
    } catch (error) {
      console.error('❌ Database connection failed:', error)
      throw error
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect()
      console.log('✅ Database disconnected successfully')
    } catch (error) {
      console.error('❌ Database disconnection failed:', error)
      throw error
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`
      return true
    } catch (error) {
      console.error('❌ Database health check failed:', error)
      return false
    }
  }

  public async transaction<T>(
    fn: (prisma: PrismaClient) => Promise<T>
  ): Promise<T> {
    return await this.prisma.$transaction(fn)
  }

  public async executeRaw<T = any>(query: string, ...params: any[]): Promise<T> {
    return await this.prisma.$queryRawUnsafe(query, ...params)
  }

  // Database migration helpers
  public async migrate(): Promise<void> {
    // This would typically be handled by Prisma CLI
    // but we can add custom migration logic here if needed
    console.log('🔄 Running database migrations...')
  }

  public async seed(): Promise<void> {
    console.log('🌱 Seeding database...')
    // Add seeding logic here
  }

  public async reset(): Promise<void> {
    console.log('🔄 Resetting database...')
    await this.prisma.$executeRaw`TRUNCATE TABLE "users" CASCADE`
    await this.prisma.$executeRaw`TRUNCATE TABLE "websites" CASCADE`
    await this.prisma.$executeRaw`TRUNCATE TABLE "templates" CASCADE`
    // Add more tables as needed
  }

  // Performance monitoring
  public async getConnectionInfo(): Promise<{
    activeConnections: number
    totalConnections: number
    maxConnections: number
  }> {
    try {
      const result = await this.prisma.$queryRaw<Array<{
        active_connections: number
        total_connections: number
        max_connections: number
      }>>`
        SELECT 
          (SELECT count(*) FROM pg_stat_activity WHERE state = 'active') as active_connections,
          (SELECT count(*) FROM pg_stat_activity) as total_connections,
          (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max_connections
      `
      
      return result[0] || {
        activeConnections: 0,
        totalConnections: 0,
        maxConnections: 0
      }
    } catch (error) {
      console.error('Failed to get connection info:', error)
      return {
        activeConnections: 0,
        totalConnections: 0,
        maxConnections: 0
      }
    }
  }

  // Database optimization
  public async optimize(): Promise<void> {
    console.log('🔧 Optimizing database...')
    
    try {
      // Analyze tables for better query planning
      await this.prisma.$executeRaw`ANALYZE`
      
      // Update table statistics
      await this.prisma.$executeRaw`VACUUM ANALYZE`
      
      console.log('✅ Database optimization completed')
    } catch (error) {
      console.error('❌ Database optimization failed:', error)
      throw error
    }
  }

  // Backup and restore helpers
  public async createBackup(): Promise<string> {
    console.log('💾 Creating database backup...')
    // This would typically use pg_dump or similar tools
    // For now, we'll just return a placeholder
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    return `backup-${timestamp}.sql`
  }

  public async restoreBackup(backupFile: string): Promise<void> {
    console.log(`🔄 Restoring database from ${backupFile}...`)
    // This would typically use pg_restore or similar tools
    // Implementation depends on the backup format
  }

  // Cleanup methods
  public async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up database...')
    
    try {
      // Clean up expired sessions
      await this.prisma.userSession.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      })

      // Clean up old AI generations (older than 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      await this.prisma.aIGeneration.deleteMany({
        where: {
          createdAt: {
            lt: thirtyDaysAgo
          }
        }
      })

      // Clean up old website visitors (older than 90 days)
      const ninetyDaysAgo = new Date()
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
      
      await this.prisma.websiteVisitor.deleteMany({
        where: {
          createdAt: {
            lt: ninetyDaysAgo
          }
        }
      })

      console.log('✅ Database cleanup completed')
    } catch (error) {
      console.error('❌ Database cleanup failed:', error)
      throw error
    }
  }
}

// Export singleton instance
export const db = DatabaseService.getInstance()

// Graceful shutdown handler
process.on('SIGINT', async () => {
  console.log('🔄 Gracefully shutting down database connection...')
  await db.disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('🔄 Gracefully shutting down database connection...')
  await db.disconnect()
  process.exit(0)
})
