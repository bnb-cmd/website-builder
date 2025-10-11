import { Prisma, InventoryTransaction, InventoryReservation, InventoryTransactionType, InventoryReservationStatus } from '@prisma/client'
import { BaseService } from './baseService'
import { Decimal } from '@prisma/client/runtime/library'

export { InventoryTransaction, InventoryReservation, InventoryTransactionType, InventoryReservationStatus } from '@prisma/client'

export interface InventoryTransactionData {
  productId: string
  type: InventoryTransactionType
  quantity: number
  reason?: string
  reference?: string
  notes?: string
  cost?: number
}

export interface InventoryAlert {
  productId: string
  type: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVERSTOCK' | 'EXPIRING'
  message: string
  threshold?: number
  currentStock?: number
}

export interface InventoryReport {
  productId: string
  productName: string
  currentStock: number
  reservedStock: number
  availableStock: number
  lowStockThreshold: number
  totalValue: number
  lastMovement: Date
  movementsCount: number
}

export interface InventoryFilters {
  productId?: string
  websiteId?: string
  type?: string
  dateFrom?: Date
  dateTo?: Date
  lowStock?: boolean
  outOfStock?: boolean
}

export class InventoryService extends BaseService<InventoryTransaction> {
  constructor() {
    super()
  }

  protected getModelName(): string {
    return 'inventoryTransaction'
  }

  // Implement required BaseService methods
  override async create(data: Partial<InventoryTransaction>): Promise<InventoryTransaction> {
    try {
      const transaction = await this.prisma.inventoryTransaction.create({
        data: data as any
      })
      return transaction
    } catch (error) {
      this.handleError(error)
    }
  }

  override async findById(id: string): Promise<InventoryTransaction | null> {
    try {
      this.validateId(id)
      
      const cacheKey = `inventory:${id}`
      const cached = await this.getCached(cacheKey)
      if (cached && typeof cached === 'object' && 'id' in cached) {
        return cached as InventoryTransaction
      }

      const transaction = await this.prisma.inventoryTransaction.findUnique({
        where: { id },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              price: true,
              trackInventory: true,
              inventory: true,
              lowStockThreshold: true
            }
          }
        }
      })

      if (transaction) {
        await this.setCached(cacheKey, transaction, 1800) // 30 minutes
      }

      return transaction
    } catch (error) {
      this.handleError(error)
    }
  }

  override async findAll(filters?: InventoryFilters): Promise<InventoryTransaction[]> {
    try {
      const {
        productId,
        websiteId,
        type,
        dateFrom,
        dateTo,
        lowStock,
        outOfStock,
        ...whereFilters
      } = filters || {}
      
      const where: Prisma.InventoryTransactionWhereInput = {}

      if (productId) where.productId = productId
      if (type) where.type = type as any
      if (dateFrom || dateTo) {
        where.createdAt = {}
        if (dateFrom) where.createdAt.gte = dateFrom
        if (dateTo) where.createdAt.lte = dateTo
      }

      if (websiteId) {
        where.product = {
          websiteId
        }
      }
      
      const transactions = await this.prisma.inventoryTransaction.findMany({
        where,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              price: true,
              websiteId: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      return transactions
    } catch (error) {
      this.handleError(error)
    }
  }

  override async update(id: string, data: Partial<InventoryTransaction>): Promise<InventoryTransaction> {
    try {
      this.validateId(id)
      
      const transaction = await this.prisma.inventoryTransaction.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      })
      
      // Invalidate cache
      await this.invalidateCache(`inventory:${id}`)
      
      return transaction
    } catch (error) {
      this.handleError(error)
    }
  }

  override async delete(id: string): Promise<boolean> {
    try {
      this.validateId(id)
      
      await this.prisma.inventoryTransaction.delete({
        where: { id }
      })
      
      // Invalidate cache
      await this.invalidateCache(`inventory:${id}`)
      
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  // Inventory Management Methods
  async recordTransaction(data: InventoryTransactionData): Promise<InventoryTransaction> {
    try {
      // Validate product exists and tracks inventory
      const product = await this.prisma.product.findUnique({
        where: { id: data.productId }
      })

      if (!product) {
        throw new Error('Product not found')
      }

      if (!product.trackInventory) {
        throw new Error('Inventory tracking is not enabled for this product')
      }

      // Create transaction record
      const inventoryTransaction = await this.prisma.inventoryTransaction.create({
        data: {
          productId: data.productId,
          type: data.type,
          quantity: data.quantity,
          reason: data.reason || null,
          reference: data.reference || null,
          notes: data.notes || null,
          cost: data.cost ? new Decimal(data.cost) : null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      // Update product inventory
      await this.updateProductInventory(data.productId, data.type, data.quantity)

      // Check for alerts
      await this.checkInventoryAlerts(data.productId)

      await this.invalidateCache(`inventory:product:${data.productId}`)
      
      return inventoryTransaction
    } catch (error) {
      this.handleError(error)
    }
  }

  async updateProductInventory(productId: string, type: InventoryTransactionType, quantity: number): Promise<void> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId }
      })

      if (!product || !product.trackInventory) return

      let newInventory = product.inventory || 0

      switch (type) {
        case InventoryTransactionType.IN:
        case InventoryTransactionType.RETURN:
          newInventory += quantity
          break
        case InventoryTransactionType.OUT:
        case InventoryTransactionType.DAMAGE:
        case InventoryTransactionType.LOSS:
          newInventory = Math.max(0, newInventory - quantity)
          break
        case InventoryTransactionType.ADJUSTMENT:
          newInventory = Math.max(0, quantity)
          break
      }

      await this.prisma.product.update({
        where: { id: productId },
        data: {
          inventory: newInventory,
          updatedAt: new Date()
        }
      })
    } catch (error) {
      console.error('Error updating product inventory:', error)
    }
  }

  async reserveInventory(productId: string, quantity: number, orderId: string): Promise<boolean> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId }
      })

      if (!product || !product.trackInventory) {
        return false
      }

      if (product.inventory < quantity) {
        return false
      }

      // Create reservation record
      await this.prisma.inventoryReservation.create({
        data: {
          productId,
          orderId,
          quantity,
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      // Record transaction
      await this.recordTransaction({
        productId,
        type: InventoryTransactionType.OUT,
        quantity,
        reason: 'ORDER_RESERVATION',
        reference: orderId,
        notes: `Reserved for order ${orderId}`
      })

      return true
    } catch (error) {
      console.error('Error reserving inventory:', error)
      return false
    }
  }

  async releaseReservation(orderId: string): Promise<void> {
    try {
      const reservations = await this.prisma.inventoryReservation.findMany({
        where: {
          orderId,
          status: 'ACTIVE'
        }
      })

      for (const reservation of reservations) {
        // Record return transaction
        await this.recordTransaction({
          productId: reservation.productId,
          type: InventoryTransactionType.RETURN,
          quantity: reservation.quantity,
          reason: 'ORDER_CANCELLATION',
          reference: orderId,
          notes: `Released reservation for cancelled order ${orderId}`
        })

        // Update reservation status
        await this.prisma.inventoryReservation.update({
          where: { id: reservation.id },
          data: {
            status: 'RELEASED',
            updatedAt: new Date()
          }
        })
      }
    } catch (error) {
      console.error('Error releasing reservation:', error)
    }
  }

  async fulfillReservation(orderId: string): Promise<void> {
    try {
      const reservations = await this.prisma.inventoryReservation.findMany({
        where: {
          orderId,
          status: 'ACTIVE'
        }
      })

      for (const reservation of reservations) {
        // Update reservation status
        await this.prisma.inventoryReservation.update({
          where: { id: reservation.id },
          data: {
            status: 'FULFILLED',
            updatedAt: new Date()
          }
        })
      }
    } catch (error) {
      console.error('Error fulfilling reservation:', error)
    }
  }

  // Inventory Alerts
  async checkInventoryAlerts(productId: string): Promise<InventoryAlert[]> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId }
      })

      if (!product || !product.trackInventory) {
        return []
      }

      const alerts: InventoryAlert[] = []

      // Check low stock
      if (product.inventory <= product.lowStockThreshold) {
        alerts.push({
          productId,
          type: product.inventory === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
          message: product.inventory === 0 
            ? `Product "${product.name}" is out of stock`
            : `Product "${product.name}" is low on stock (${product.inventory} remaining)`,
          threshold: product.lowStockThreshold,
          currentStock: product.inventory
        })
      }

      // Check overstock (more than 3x low stock threshold)
      if (product.inventory > product.lowStockThreshold * 3) {
        alerts.push({
          productId,
          type: 'OVERSTOCK',
          message: `Product "${product.name}" is overstocked (${product.inventory} units)`,
          threshold: product.lowStockThreshold * 3,
          currentStock: product.inventory
        })
      }

      return alerts
    } catch (error) {
      console.error('Error checking inventory alerts:', error)
      return []
    }
  }

  async getAllAlerts(websiteId?: string): Promise<InventoryAlert[]> {
    try {
      const whereClause: any = { trackInventory: true }
      if (websiteId) whereClause.websiteId = websiteId

      const products = await this.prisma.product.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          inventory: true,
          lowStockThreshold: true
        }
      })

      const alerts: InventoryAlert[] = []

      for (const product of products) {
        const productAlerts = await this.checkInventoryAlerts(product.id)
        alerts.push(...productAlerts)
      }

      return alerts
    } catch (error) {
      console.error('Error getting all alerts:', error)
      return []
    }
  }

  // Inventory Reports
  async getInventoryReport(websiteId?: string): Promise<InventoryReport[]> {
    try {
      const whereClause: any = { trackInventory: true }
      if (websiteId) whereClause.websiteId = websiteId

      const products = await this.prisma.product.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          inventory: true,
          lowStockThreshold: true,
          trackInventory: true,
          updatedAt: true
        }
      })

      const reports: InventoryReport[] = []

      for (const product of products) {
        const reservedStock = 0 // TODO: Calculate from reservations
        const availableStock = product.inventory - reservedStock
        const totalValue = 0 // TODO: Calculate from price
        const lastMovement = product.updatedAt

        reports.push({
          productId: product.id,
          productName: product.name,
          currentStock: product.inventory,
          reservedStock,
          availableStock,
          lowStockThreshold: product.lowStockThreshold,
          totalValue,
          lastMovement,
          movementsCount: 0 // Would need to count transactions
        })
      }

      return reports
    } catch (error) {
      this.handleError(error)
    }
  }

  async getInventoryMovements(productId: string, limit: number = 50): Promise<any[]> {
    try {
      return await this.prisma.inventoryTransaction.findMany({
        where: { productId },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  // Bulk Operations
  async bulkAdjustInventory(adjustments: Array<{ productId: string; quantity: number; reason?: string }>): Promise<void> {
    try {
      await this.prisma.$transaction(async (prisma) => {
        for (const adjustment of adjustments) {
          await this.recordTransaction({
            productId: adjustment.productId,
            type: InventoryTransactionType.ADJUSTMENT,
            quantity: adjustment.quantity,
            reason: adjustment.reason || 'BULK_ADJUSTMENT'
          })
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async bulkReceiveInventory(receipts: Array<{ productId: string; quantity: number; cost?: number; reference?: string }>): Promise<void> {
    try {
      await this.prisma.$transaction(async (prisma) => {
        for (const receipt of receipts) {
          await this.recordTransaction({
            productId: receipt.productId,
            type: InventoryTransactionType.IN,
            quantity: receipt.quantity,
            cost: receipt.cost,
            reference: receipt.reference,
            reason: 'STOCK_RECEIPT'
          })
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  // Analytics
  async getInventoryAnalytics(websiteId?: string, dateRange?: { from: Date; to: Date }): Promise<{
    totalProducts: number
    totalValue: number
    lowStockProducts: number
    outOfStockProducts: number
    totalMovements: number
    movementsByType: Record<string, number>
    topMovingProducts: Array<{ productId: string; productName: string; movements: number }>
  }> {
    try {
      const whereClause: any = { trackInventory: true }
      if (websiteId) whereClause.websiteId = websiteId

      const [
        products,
        movements,
        movementsByType,
        topMovingProducts
      ] = await Promise.all([
        this.prisma.product.findMany({
          where: whereClause,
          select: {
            id: true,
            name: true,
            inventory: true,
            lowStockThreshold: true,
            price: true
          }
        }),
        this.prisma.inventoryTransaction.count({
          where: dateRange ? {
            createdAt: {
              gte: dateRange.from,
              lte: dateRange.to
            }
          } : {}
        }),
        this.prisma.inventoryTransaction.groupBy({
          by: ['type'],
          where: dateRange ? {
            createdAt: {
              gte: dateRange.from,
              lte: dateRange.to
            }
          } : {},
          _count: { type: true }
        }),
        this.prisma.inventoryTransaction.groupBy({
          by: ['productId'],
          where: dateRange ? {
            createdAt: {
              gte: dateRange.from,
              lte: dateRange.to
            }
          } : {},
          _count: { productId: true },
          orderBy: {
            _count: {
              productId: 'desc'
            }
          },
          take: 10
        })
      ])

      const totalValue = products.reduce((sum, product) => 
        sum + (product.price.toNumber() * product.inventory), 0
      )

      const lowStockProducts = products.filter(p => 
        p.inventory <= p.lowStockThreshold && p.inventory > 0
      ).length

      const outOfStockProducts = products.filter(p => p.inventory === 0).length

      const movementsByTypeMap = movementsByType.reduce((acc, item) => {
        acc[item.type] = item._count.type
        return acc
      }, {} as Record<string, number>)

      // Get product names for top moving products
      const productIds = topMovingProducts.map(item => item.productId)
      const productNames = await this.prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true }
      })

      const topMovingProductsWithNames = topMovingProducts.map(item => {
        const product = productNames.find(p => p.id === item.productId)
        return {
          productId: item.productId,
          productName: product?.name || 'Unknown Product',
          movements: item._count.productId
        }
      })

      return {
        totalProducts: products.length,
        totalValue,
        lowStockProducts,
        outOfStockProducts,
        totalMovements: movements,
        movementsByType: movementsByTypeMap,
        topMovingProducts: topMovingProductsWithNames
      }
    } catch (error) {
      this.handleError(error)
    }
  }

  // Additional methods for routes
  async findMany(filters: InventoryFilters = {}): Promise<{
    transactions: any[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }> {
    try {
      const transactions = await this.findAll(filters)
      const total = await this.prisma.inventoryTransaction.count({
        where: this.buildWhereClause(filters)
      })
      
      return {
        transactions,
        pagination: {
          page: 1,
          limit: 20,
          total,
          pages: Math.ceil(total / 20)
        }
      }
    } catch (error) {
      this.handleError(error)
    }
  }

  private buildWhereClause(filters: InventoryFilters): any {
    const where: any = {}
    
    if (filters.productId) where.productId = filters.productId
    if (filters.type) where.type = filters.type
    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {}
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom
      if (filters.dateTo) where.createdAt.lte = filters.dateTo
    }
    if (filters.websiteId) {
      where.product = { websiteId: filters.websiteId }
    }
    
    return where
  }
}

export const inventoryService = new InventoryService()
