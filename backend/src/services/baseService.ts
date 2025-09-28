import { PrismaClient } from '@prisma/client'
import { db } from '@/models/database'
import { redis } from '@/models/redis'

export abstract class BaseService<T> {
  protected prisma: PrismaClient
  protected cache: typeof redis

  constructor() {
    this.prisma = db.getClient()
    this.cache = redis
  }

  // Abstract methods that must be implemented by subclasses
  abstract create(data: Partial<T>): Promise<T>
  abstract findById(id: string): Promise<T | null>
  abstract findAll(filters?: any): Promise<T[]>
  abstract update(id: string, data: Partial<T>): Promise<T>
  abstract delete(id: string): Promise<boolean>

  // Common error handling
  protected handleError(error: any): never {
    console.error('Service error:', error)
    
    // Handle Prisma specific errors
    if (error.code === 'P2002') {
      throw new Error('Resource already exists')
    }
    if (error.code === 'P2025') {
      throw new Error('Resource not found')
    }
    if (error.code === 'P2003') {
      throw new Error('Foreign key constraint failed')
    }
    if (error.code === 'P2014') {
      throw new Error('Invalid ID provided')
    }
    
    throw new Error(error.message || 'Internal server error')
  }

  // Common validation
  protected validateId(id: string): void {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw new Error('Invalid ID provided')
    }
  }

  protected validateRequired(data: any, requiredFields: string[]): void {
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        throw new Error(`Required field '${field}' is missing`)
      }
    }
  }

  // Pagination helper
  protected getPaginationParams(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    return { skip, take: limit }
  }

  // Cache helpers
  protected async getCached<T>(key: string): Promise<T | null> {
    try {
      return await this.cache.getJSON<T>(key)
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  protected async setCached<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    try {
      await this.cache.setJSON(key, value, ttl)
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  protected async invalidateCache(pattern: string): Promise<void> {
    try {
      await this.cache.invalidatePattern(pattern)
    } catch (error) {
      console.error('Cache invalidation error:', error)
    }
  }

  // Transaction helper
  protected async withTransaction<R>(
    fn: (prisma: PrismaClient) => Promise<R>
  ): Promise<R> {
    return await this.prisma.$transaction(fn)
  }

  // Soft delete helper
  protected async softDelete(
    model: any,
    id: string,
    deletedAtField: string = 'deletedAt'
  ): Promise<T> {
    try {
      return await model.update({
        where: { id },
        data: { [deletedAtField]: new Date() }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  // Bulk operations
  protected async bulkCreate(data: Partial<T>[]): Promise<T[]> {
    try {
      // This would need to be implemented by each service
      // as it depends on the specific model
      throw new Error('Bulk create not implemented')
    } catch (error) {
      this.handleError(error)
    }
  }

  protected async bulkUpdate(
    updates: Array<{ id: string; data: Partial<T> }>
  ): Promise<T[]> {
    try {
      // This would need to be implemented by each service
      // as it depends on the specific model
      throw new Error('Bulk update not implemented')
    } catch (error) {
      this.handleError(error)
    }
  }

  protected async bulkDelete(ids: string[]): Promise<number> {
    try {
      // This would need to be implemented by each service
      // as it depends on the specific model
      throw new Error('Bulk delete not implemented')
    } catch (error) {
      this.handleError(error)
    }
  }

  // Search helper
  protected buildSearchQuery(searchTerm: string, searchFields: string[]) {
    if (!searchTerm || searchFields.length === 0) {
      return {}
    }

    return {
      OR: searchFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive' as const
        }
      }))
    }
  }

  // Date range helper
  protected buildDateRangeQuery(
    startDate?: Date,
    endDate?: Date,
    dateField: string = 'createdAt'
  ) {
    const query: any = {}
    
    if (startDate || endDate) {
      query[dateField] = {}
      
      if (startDate) {
        query[dateField].gte = startDate
      }
      
      if (endDate) {
        query[dateField].lte = endDate
      }
    }
    
    return query
  }

  // Sorting helper
  protected buildSortQuery(sortBy?: string, sortOrder: 'asc' | 'desc' = 'desc') {
    if (!sortBy) {
      return { createdAt: 'desc' }
    }
    
    return { [sortBy]: sortOrder }
  }

  // Count helper
  protected async count(filters?: any): Promise<number> {
    try {
      return await (this.prisma as any)[this.getModelName()].count({
        where: filters
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  // Abstract method to get model name for dynamic operations
  protected abstract getModelName(): string

  // Health check
  public async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`
      return true
    } catch (error) {
      console.error('Service health check failed:', error)
      return false
    }
  }

  // Performance monitoring
  public async getPerformanceMetrics(): Promise<{
    queryCount: number
    averageQueryTime: number
    cacheHitRate: number
  }> {
    // This would be implemented with actual metrics collection
    return {
      queryCount: 0,
      averageQueryTime: 0,
      cacheHitRate: 0
    }
  }
}
