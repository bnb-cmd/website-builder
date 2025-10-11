import { Prisma, Cart, CartItem } from '@prisma/client'
import { BaseService } from './baseService'
import { Decimal } from '@prisma/client/runtime/library'

export { CartItem } from '@prisma/client'

export type CartWithItems = Cart & {
  items: (CartItem & {
    product: {
      id: string
      name: string
      price: Decimal
      images: string
      trackInventory: boolean
      inventory: number
      status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK'
    }
  })[]
}

export interface CartItemData {
  productId: string
  quantity: number
  price: number
  variant?: any
}

export interface CartData {
  userId?: string
  sessionId?: string
  websiteId: string
  items: CartItemData[]
  subtotal: number
  tax?: number
  shipping?: number
  discount?: number
  total: number
  expiresAt?: Date
}

export interface UpdateCartItemData {
  productId: string
  quantity: number
  variant?: any
}

export interface CartFilters {
  userId?: string
  sessionId?: string
  websiteId?: string
}

export class CartService extends BaseService<Cart> {
  constructor() {
    super()
  }

  protected getModelName(): string {
    return 'cart'
  }

  // Implement required BaseService methods
  override async create(data: Partial<Cart>): Promise<Cart> {
    try {
      const cart = await this.prisma.cart.create({
        data: data as any
      })
      return cart
    } catch (error) {
      this.handleError(error)
    }
  }

  override async findById(id: string): Promise<CartWithItems | null> {
    try {
      this.validateId(id)
      
      const cacheKey = `cart:${id}`
      const cached = await this.getCached(cacheKey)
      if (cached && typeof cached === 'object' && 'id' in cached) {
        return cached as CartWithItems
      }

      const cart = await this.prisma.cart.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  images: true,
                  trackInventory: true,
                  inventory: true,
                  status: true
                }
              }
            }
          }
        }
      })

      if (cart) {
        await this.setCached(cacheKey, cart, 1800) // 30 minutes
        return cart as CartWithItems
      }

      return null
    } catch (error) {
      this.handleError(error)
    }
  }

  override async findAll(filters?: CartFilters): Promise<Cart[]> {
    try {
      const carts = await this.prisma.cart.findMany({
        where: filters || {},
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  images: true
                }
              }
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })
      return carts
    } catch (error) {
      this.handleError(error)
    }
  }

  override async update(id: string, data: Partial<Cart>): Promise<Cart> {
    try {
      this.validateId(id)
      
      const cart = await this.prisma.cart.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      })
      
      // Invalidate cache
      await this.invalidateCache(`cart:${id}`)
      
      return cart
    } catch (error) {
      this.handleError(error)
    }
  }

  override async delete(id: string): Promise<boolean> {
    try {
      this.validateId(id)
      
      await this.prisma.cart.delete({
        where: { id }
      })
      
      // Invalidate cache
      await this.invalidateCache(`cart:${id}`)
      
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  // Cart Management Methods
  async getOrCreateCart(userId?: string, sessionId?: string, websiteId?: string): Promise<CartWithItems> {
    try {
      if (!userId && !sessionId) {
        throw new Error('Either userId or sessionId must be provided')
      }

      const whereClause: any = {}
      if (userId) whereClause.userId = userId
      if (sessionId) whereClause.sessionId = sessionId
      if (websiteId) whereClause.websiteId = websiteId

      let cart = await this.prisma.cart.findFirst({
        where: whereClause,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  images: true,
                  trackInventory: true,
                  inventory: true,
                  status: true
                }
              }
            }
          }
        }
      })

      if (!cart) {
        cart = await this.createCart({
          userId,
          sessionId,
          websiteId: websiteId || '',
          items: [],
          subtotal: 0,
          total: 0,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        })
      }

      // Always return cart with items
      return await this.findById(cart.id)
    } catch (error) {
      this.handleError(error)
    }
  }

  async createCart(data: CartData): Promise<CartWithItems> {
    try {
      const cart = await this.prisma.cart.create({
        data: {
          userId: data.userId,
          sessionId: data.sessionId,
          websiteId: data.websiteId,
          subtotal: new Decimal(data.subtotal),
          tax: data.tax ? new Decimal(data.tax) : null,
          shipping: data.shipping ? new Decimal(data.shipping) : null,
          discount: data.discount ? new Decimal(data.discount) : null,
          total: new Decimal(data.total),
          expiresAt: data.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      // Create cart items
      if (data.items && data.items.length > 0) {
        await this.prisma.cartItem.createMany({
          data: data.items.map(item => ({
            cartId: cart.id,
            productId: item.productId,
            quantity: item.quantity,
            price: new Decimal(item.price),
            variant: item.variant ? JSON.stringify(item.variant) : null
          }))
        })
      }

      await this.invalidateCache('carts:*')
      return await this.findById(cart.id)
    } catch (error) {
      this.handleError(error)
    }
  }

  async addItem(cartId: string, item: CartItemData): Promise<CartWithItems> {
    try {
      this.validateId(cartId)

      // Check if item already exists in cart
      const existingItem = await this.prisma.cartItem.findFirst({
        where: {
          cartId,
          productId: item.productId,
          variant: item.variant ? JSON.stringify(item.variant) : null
        }
      })

      if (existingItem) {
        // Update quantity
        await this.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + item.quantity,
            updatedAt: new Date()
          }
        })
      } else {
        // Add new item
        await this.prisma.cartItem.create({
          data: {
            cartId,
            productId: item.productId,
            quantity: item.quantity,
            price: new Decimal(item.price),
            variant: item.variant ? JSON.stringify(item.variant) : null
          }
        })
      }

      // Recalculate cart totals
      await this.recalculateCartTotals(cartId)
      
      // Invalidate cache
      await this.invalidateCache(`cart:${cartId}`)
      
      return await this.findById(cartId)
    } catch (error) {
      this.handleError(error)
    }
  }

  async updateItem(cartId: string, productId: string, quantity: number, variant?: any): Promise<CartWithItems> {
    try {
      this.validateId(cartId)

      if (quantity <= 0) {
        return await this.removeItem(cartId, productId, variant)
      }

      const item = await this.prisma.cartItem.findFirst({
        where: {
          cartId,
          productId,
          variant: variant ? JSON.stringify(variant) : null
        }
      })

      if (item) {
        await this.prisma.cartItem.update({
          where: { id: item.id },
          data: {
            quantity,
            updatedAt: new Date()
          }
        })

        // Recalculate cart totals
        await this.recalculateCartTotals(cartId)
        
        // Invalidate cache
        await this.invalidateCache(`cart:${cartId}`)
      }

      return await this.findById(cartId)
    } catch (error) {
      this.handleError(error)
    }
  }

  async removeItem(cartId: string, productId: string, variant?: any): Promise<CartWithItems> {
    try {
      this.validateId(cartId)

      await this.prisma.cartItem.deleteMany({
        where: {
          cartId,
          productId,
          variant: variant ? JSON.stringify(variant) : null
        }
      })

      // Recalculate cart totals
      await this.recalculateCartTotals(cartId)
      
      // Invalidate cache
      await this.invalidateCache(`cart:${cartId}`)
      
      return await this.findById(cartId)
    } catch (error) {
      this.handleError(error)
    }
  }

  async clearCart(cartId: string): Promise<CartWithItems> {
    try {
      this.validateId(cartId)

      await this.prisma.cartItem.deleteMany({
        where: { cartId }
      })

      // Reset cart totals
      await this.update(cartId, {
        subtotal: new Decimal(0),
        tax: new Decimal(0),
        shipping: new Decimal(0),
        discount: new Decimal(0),
        total: new Decimal(0)
      })

      return await this.findById(cartId)
    } catch (error) {
      this.handleError(error)
    }
  }

  async mergeCarts(sourceCartId: string, targetCartId: string): Promise<CartWithItems> {
    try {
      this.validateId(sourceCartId)
      this.validateId(targetCartId)

      const sourceCart = await this.findById(sourceCartId)
      if (!sourceCart || !sourceCart.items) {
        return await this.findById(targetCartId)
      }

      // Move items from source to target cart
      for (const item of sourceCart.items) {
        await this.addItem(targetCartId, {
          productId: item.productId,
          quantity: item.quantity,
          price: item.price.toNumber(),
          variant: item.variant ? JSON.parse(item.variant) : undefined
        })
      }

      // Delete source cart
      await this.delete(sourceCartId)

      return await this.findById(targetCartId)
    } catch (error) {
      this.handleError(error)
    }
  }

  async recalculateCartTotals(cartId: string): Promise<void> {
    try {
      const cart = await this.findById(cartId)
      if (!cart || !cart.items) return

      let subtotal = 0
      let tax = 0
      let shipping = 0
      let discount = 0

      // Calculate subtotal from items
      for (const item of cart.items) {
        subtotal += item.price.toNumber() * item.quantity
      }

      // Calculate tax (10% default)
      tax = subtotal * 0.1

      // Calculate shipping (free over $50, otherwise $5)
      shipping = subtotal >= 50 ? 0 : 5

      const total = subtotal + tax + shipping - discount

      await this.update(cartId, {
        subtotal: new Decimal(subtotal),
        tax: new Decimal(tax),
        shipping: new Decimal(shipping),
        discount: new Decimal(discount),
        total: new Decimal(total)
      })
    } catch (error) {
      console.error('Error recalculating cart totals:', error)
    }
  }

  // Cart Validation
  async validateCart(cartId: string): Promise<{
    isValid: boolean
    errors: string[]
    warnings: string[]
  }> {
    try {
      const cart = await this.findById(cartId)
      if (!cart || !cart.items) {
        return {
          isValid: false,
          errors: ['Cart not found or has no items'],
          warnings: []
        }
      }

      const errors: string[] = []
      const warnings: string[] = []

      for (const item of cart.items) {
        const product = item.product

        // Check if product is still active
        if (product.status !== 'ACTIVE') {
          errors.push(`Product "${product.name}" is no longer available`)
        }

        // Check inventory
        if (product.trackInventory && item.quantity > product.inventory) {
          if (product.inventory === 0) {
            errors.push(`Product "${product.name}" is out of stock`)
          } else {
            warnings.push(`Only ${product.inventory} units available for "${product.name}"`)
          }
        }

        // Check price changes
        if (item.price.toNumber() !== product.price.toNumber()) {
          warnings.push(`Price has changed for "${product.name}"`)
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      }
    } catch (error) {
      return {
        isValid: false,
        errors: ['Error validating cart'],
        warnings: []
      }
    }
  }

  // Cart Analytics
  async getCartStats(websiteId?: string, dateRange?: { from: Date; to: Date }): Promise<{
    totalCarts: number
    activeCarts: number
    abandonedCarts: number
    averageCartValue: number
    totalCartValue: number
    conversionRate: number
  }> {
    try {
      const whereClause: any = {}
      if (websiteId) whereClause.websiteId = websiteId
      if (dateRange) {
        whereClause.createdAt = {
          gte: dateRange.from,
          lte: dateRange.to
        }
      }

      const [
        totalCarts,
        activeCarts,
        abandonedCarts,
        cartStats
      ] = await Promise.all([
        this.prisma.cart.count({ where: whereClause }),
        this.prisma.cart.count({ 
          where: { 
            ...whereClause, 
            updatedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Active in last 24 hours
          } 
        }),
        this.prisma.cart.count({ 
          where: { 
            ...whereClause, 
            updatedAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Abandoned for 7+ days
          } 
        }),
        this.prisma.cart.aggregate({
          where: whereClause,
          _sum: { total: true },
          _avg: { total: true }
        })
      ])

      return {
        totalCarts,
        activeCarts,
        abandonedCarts,
        averageCartValue: cartStats._avg.total?.toNumber() || 0,
        totalCartValue: cartStats._sum.total?.toNumber() || 0,
        conversionRate: totalCarts > 0 ? (activeCarts / totalCarts) * 100 : 0
      }
    } catch (error) {
      this.handleError(error)
    }
  }

  // Cleanup expired carts
  async cleanupExpiredCarts(): Promise<number> {
    try {
      const result = await this.prisma.cart.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      })

      await this.invalidateCache('carts:*')
      return result.count
    } catch (error) {
      console.error('Error cleaning up expired carts:', error)
      return 0
    }
  }

  // Additional methods for routes
  async findMany(filters: CartFilters = {}): Promise<{
    carts: any[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }> {
    try {
      const carts = await this.findAll(filters)
      const total = await this.prisma.cart.count({
        where: filters
      })
      
      return {
        carts,
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
}

export const cartService = new CartService()
