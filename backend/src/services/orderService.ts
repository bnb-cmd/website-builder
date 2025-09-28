import { Order, OrderItem, PaymentStatus, ShippingStatus, Prisma } from '@prisma/client'
import { BaseService } from './baseService'
import { ProductService } from './productService'
import { LogisticsService } from './logisticsService'

export interface CreateOrderData {
  websiteId: string
  customerEmail: string
  customerName?: string
  customerPhone?: string
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  billingAddress?: {
    name: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  subtotal: number
  tax?: number
  shipping?: number
  discount?: number
  total: number
  notes?: string
}

export interface UpdateOrderData {
  customerEmail?: string
  customerName?: string
  customerPhone?: string
  shippingAddress?: any
  billingAddress?: any
  paymentStatus?: PaymentStatus
  shippingStatus?: ShippingStatus
  trackingNumber?: string
  notes?: string
}

export interface OrderFilters {
  websiteId?: string
  customerEmail?: string
  paymentStatus?: PaymentStatus
  shippingStatus?: ShippingStatus
  dateFrom?: Date
  dateTo?: Date
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface OrderWithDetails extends Order {
  items: (OrderItem & {
    product: {
      id: string
      name: string
      images: string[]
    }
  })[]
}

export class OrderService extends BaseService<Order> {
  private productService: ProductService
  private logisticsService: LogisticsService

  constructor() {
    super()
    this.productService = new ProductService()
    this.logisticsService = new LogisticsService()
  }

  protected getModelName(): string {
    return 'order'
  }

  async create(data: CreateOrderData): Promise<OrderWithDetails> {
    try {
      this.validateRequired(data, ['websiteId', 'customerEmail', 'items', 'total'])
      
      // Generate unique order number
      const orderNumber = await this.generateOrderNumber()
      
      const order = await this.withTransaction(async (prisma) => {
        // Create order
        const createdOrder = await prisma.order.create({
          data: {
            websiteId: data.websiteId,
            orderNumber,
            customerEmail: data.customerEmail,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            shippingAddress: data.shippingAddress,
            billingAddress: data.billingAddress || data.shippingAddress,
            subtotal: data.subtotal,
            tax: data.tax || 0,
            shipping: data.shipping || 0,
            discount: data.discount || 0,
            total: data.total,
            notes: data.notes,
            paymentStatus: PaymentStatus.PENDING,
            shippingStatus: ShippingStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        
        // Create order items
        await prisma.orderItem.createMany({
          data: data.items.map(item => ({
            orderId: createdOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        })
        
        // Update product inventory
        for (const item of data.items) {
          await this.productService.updateInventory(item.productId, item.quantity, 'subtract')
        }
        
        return createdOrder
      })
      
      await this.invalidateCache('orders:*')
      
      // Return order with items
      return await this.findById(order.id) as OrderWithDetails
    } catch (error) {
      this.handleError(error)
    }
  }

  async findById(id: string): Promise<OrderWithDetails | null> {
    try {
      this.validateId(id)
      
      const cacheKey = `order:${id}`
      const cached = await this.getCached<OrderWithDetails>(cacheKey)
      if (cached) return cached
      
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true
                }
              }
            }
          }
        }
      }) as OrderWithDetails
      
      if (order) {
        await this.setCached(cacheKey, order, 1800) // 30 minutes
      }
      
      return order
    } catch (error) {
      this.handleError(error)
    }
  }

  async findByOrderNumber(orderNumber: string): Promise<OrderWithDetails | null> {
    try {
      const cacheKey = `order:number:${orderNumber}`
      const cached = await this.getCached<OrderWithDetails>(cacheKey)
      if (cached) return cached
      
      const order = await this.prisma.order.findUnique({
        where: { orderNumber },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true
                }
              }
            }
          }
        }
      }) as OrderWithDetails
      
      if (order) {
        await this.setCached(cacheKey, order, 1800) // 30 minutes
      }
      
      return order
    } catch (error) {
      this.handleError(error)
    }
  }

  async findAll(filters: OrderFilters = {}): Promise<OrderWithDetails[]> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search,
        dateFrom,
        dateTo,
        ...whereFilters
      } = filters
      
      const { skip, take } = this.getPaginationParams(page, limit)
      
      // Build where clause
      const where: Prisma.OrderWhereInput = {
        ...whereFilters
      }
      
      // Add search functionality
      if (search) {
        where.OR = [
          { orderNumber: { contains: search, mode: 'insensitive' } },
          { customerEmail: { contains: search, mode: 'insensitive' } },
          { customerName: { contains: search, mode: 'insensitive' } }
        ]
      }
      
      // Date range filter
      if (dateFrom || dateTo) {
        where.createdAt = {}
        if (dateFrom) where.createdAt.gte = dateFrom
        if (dateTo) where.createdAt.lte = dateTo
      }
      
      const orders = await this.prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: this.buildSortQuery(sortBy, sortOrder),
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true
                }
              }
            }
          }
        }
      }) as OrderWithDetails[]
      
      return orders
    } catch (error) {
      this.handleError(error)
    }
  }

  async update(id: string, data: UpdateOrderData): Promise<OrderWithDetails> {
    try {
      this.validateId(id)
      
      const order = await this.prisma.order.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      })
      
      await this.invalidateCache(`order:${id}`)
      await this.invalidateCache('orders:*')
      
      return await this.findById(id) as OrderWithDetails
    } catch (error) {
      this.handleError(error)
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      this.validateId(id)
      
      // In e-commerce, orders are typically not deleted but cancelled
      await this.update(id, { 
        paymentStatus: PaymentStatus.CANCELLED,
        shippingStatus: ShippingStatus.CANCELLED
      })
      
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  // Order Status Management
  async updatePaymentStatus(id: string, status: PaymentStatus, paymentId?: string): Promise<OrderWithDetails> {
    try {
      const updateData: UpdateOrderData = { paymentStatus: status }
      if (paymentId) {
        updateData.paymentStatus = status
      }
      
      const order = await this.update(id, updateData)
      
      // If payment is completed, update shipping status
      if (status === PaymentStatus.COMPLETED) {
        await this.update(id, { shippingStatus: ShippingStatus.PROCESSING })
      }
      
      return order
    } catch (error) {
      this.handleError(error)
    }
  }

  async updateShippingStatus(id: string, status: ShippingStatus, trackingNumber?: string): Promise<OrderWithDetails> {
    try {
      const updateData: UpdateOrderData = { shippingStatus: status }
      if (trackingNumber) {
        updateData.trackingNumber = trackingNumber
      }
      
      return await this.update(id, updateData)
    } catch (error) {
      this.handleError(error)
    }
  }

  // Order Analytics
  async getOrderStats(websiteId: string, dateRange?: { from: Date; to: Date }): Promise<{
    totalOrders: number
    totalRevenue: number
    averageOrderValue: number
    pendingOrders: number
    completedOrders: number
    cancelledOrders: number
    topProducts: Array<{ productId: string; productName: string; quantity: number; revenue: number }>
  }> {
    try {
      const cacheKey = `order:stats:${websiteId}:${dateRange?.from}:${dateRange?.to}`
      const cached = await this.getCached(cacheKey)
      if (cached) return cached
      
      const whereClause: Prisma.OrderWhereInput = { websiteId }
      if (dateRange) {
        whereClause.createdAt = {
          gte: dateRange.from,
          lte: dateRange.to
        }
      }
      
      const [
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        revenueStats,
        topProductsData
      ] = await Promise.all([
        this.prisma.order.count({ where: whereClause }),
        this.prisma.order.count({ 
          where: { ...whereClause, paymentStatus: PaymentStatus.PENDING } 
        }),
        this.prisma.order.count({ 
          where: { ...whereClause, paymentStatus: PaymentStatus.COMPLETED } 
        }),
        this.prisma.order.count({ 
          where: { ...whereClause, paymentStatus: PaymentStatus.CANCELLED } 
        }),
        this.prisma.order.aggregate({
          where: { ...whereClause, paymentStatus: PaymentStatus.COMPLETED },
          _sum: { total: true },
          _avg: { total: true }
        }),
        this.prisma.orderItem.groupBy({
          by: ['productId'],
          where: {
            order: whereClause
          },
          _sum: {
            quantity: true,
            price: true
          },
          orderBy: {
            _sum: {
              quantity: 'desc'
            }
          },
          take: 10
        })
      ])
      
      // Get product names for top products
      const productIds = topProductsData.map(item => item.productId)
      const products = await this.prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true }
      })
      
      const topProducts = topProductsData.map(item => {
        const product = products.find(p => p.id === item.productId)
        return {
          productId: item.productId,
          productName: product?.name || 'Unknown Product',
          quantity: item._sum.quantity || 0,
          revenue: item._sum.price?.toNumber() || 0
        }
      })
      
      const stats = {
        totalOrders,
        totalRevenue: revenueStats._sum.total?.toNumber() || 0,
        averageOrderValue: revenueStats._avg.total?.toNumber() || 0,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        topProducts
      }
      
      await this.setCached(cacheKey, stats, 3600) // 1 hour
      
      return stats
    } catch (error) {
      this.handleError(error)
    }
  }

  // Customer Orders
  async getCustomerOrders(customerEmail: string, websiteId?: string): Promise<OrderWithDetails[]> {
    try {
      const whereClause: Prisma.OrderWhereInput = { customerEmail }
      if (websiteId) {
        whereClause.websiteId = websiteId
      }
      
      return await this.prisma.order.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true
                }
              }
            }
          }
        }
      }) as OrderWithDetails[]
    } catch (error) {
      this.handleError(error)
    }
  }

  // Order Search
  async searchOrders(websiteId: string, query: string): Promise<OrderWithDetails[]> {
    try {
      return await this.prisma.order.findMany({
        where: {
          websiteId,
          OR: [
            { orderNumber: { contains: query, mode: 'insensitive' } },
            { customerEmail: { contains: query, mode: 'insensitive' } },
            { customerName: { contains: query, mode: 'insensitive' } }
          ]
        },
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true
                }
              }
            }
          }
        }
      }) as OrderWithDetails[]
    } catch (error) {
      this.handleError(error)
    }
  }

  // Helper Methods
  private async generateOrderNumber(): Promise<string> {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `ORD-${timestamp}-${random}`
  }

  async calculateOrderTotal(
    items: Array<{ productId: string; quantity: number }>, 
    websiteId: string,
    shippingAddress: { city: string; country: string }
  ): Promise<{
    subtotal: number
    tax: number
    shippingOptions: any[]
    total: number
  }> {
    try {
      let subtotal = 0
      let totalWeight = 0
      
      for (const item of items) {
        const product = await this.productService.findById(item.productId)
        if (product && product.websiteId === websiteId) {
          subtotal += product.price.toNumber() * item.quantity
          totalWeight += (product.weight || 0.5) * item.quantity // default weight 0.5kg
        }
      }
      
      // Calculate tax (configurable per website)
      const taxRate = 0.1 // 10% tax
      const tax = subtotal * taxRate
      
      // Get shipping rates
      const shippingOptions = await this.logisticsService.getShippingRates(
        shippingAddress,
        { weight: totalWeight, length: 10, width: 10, height: 10 }
      )
      
      // Use the cheapest shipping option as default
      const defaultShipping = shippingOptions.sort((a, b) => a.rate - b.rate)[0]?.rate || 0
      
      const total = subtotal + tax + defaultShipping
      
      return { subtotal, tax, shippingOptions, total }
    } catch (error) {
      this.handleError(error)
    }
  }

  // Bulk Operations
  async bulkUpdateStatus(
    orderIds: string[], 
    status: { payment?: PaymentStatus; shipping?: ShippingStatus }
  ): Promise<number> {
    try {
      const updateData: any = { updatedAt: new Date() }
      if (status.payment) updateData.paymentStatus = status.payment
      if (status.shipping) updateData.shippingStatus = status.shipping
      
      const result = await this.prisma.order.updateMany({
        where: { id: { in: orderIds } },
        data: updateData
      })
      
      await this.invalidateCache('orders:*')
      
      return result.count
    } catch (error) {
      this.handleError(error)
    }
  }

  // Export Orders
  async exportOrders(websiteId: string, filters?: OrderFilters): Promise<any[]> {
    try {
      const orders = await this.findAll({ ...filters, websiteId, limit: 10000 })
      
      return orders.map(order => ({
        orderNumber: order.orderNumber,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        total: order.total,
        paymentStatus: order.paymentStatus,
        shippingStatus: order.shippingStatus,
        createdAt: order.createdAt,
        items: order.items.map(item => ({
          productName: item.product.name,
          quantity: item.quantity,
          price: item.price
        }))
      }))
    } catch (error) {
      this.handleError(error)
    }
  }
}
