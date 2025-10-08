import { Product, Prisma } from '@prisma/client'
import { BaseService } from './baseService'
import { ProductStatus } from '@/types/enums'

export interface CreateProductData {
  websiteId: string
  name: string
  description?: string
  price: number
  comparePrice?: number
  sku?: string
  images?: string[]
  trackInventory?: boolean
  inventory?: number
  lowStockThreshold?: number
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
  status?: ProductStatus
}

export interface UpdateProductData {
  name?: string
  description?: string | null
  price?: number
  comparePrice?: number
  sku?: string
  images?: string[]
  trackInventory?: boolean
  inventory?: number
  lowStockThreshold?: number
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
  status?: ProductStatus
  variants?: string
}

export interface ProductFilters {
  websiteId?: string
  status?: ProductStatus
  priceMin?: number
  priceMax?: number
  inStock?: boolean
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export class ProductService extends BaseService<Product> {
  protected getModelName(): string {
    return 'product'
  }

  override async create(data: CreateProductData): Promise<Product> {
    try {
      this.validateRequired(data, ['websiteId', 'name', 'price'])
      
      const product = await this.prisma.product.create({
        data: {
          websiteId: data.websiteId,
          name: data.name,
          description: data.description || null,
          price: data.price,
          comparePrice: data.comparePrice || null,
          sku: data.sku || null,
          images: data.images ? data.images.join(',') : null,
          trackInventory: data.trackInventory || false,
          inventory: data.inventory || 0,
          lowStockThreshold: data.lowStockThreshold || 5,
          metaTitle: data.metaTitle || null,
          metaDescription: data.metaDescription || null,
          metaKeywords: data.metaKeywords ? data.metaKeywords.join(',') : null,
          status: data.status || ProductStatus.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      
      await this.invalidateCache('products:*')
      
      return product
    } catch (error) {
      this.handleError(error)
    }
  }

  override async findById(id: string): Promise<Product | null> {
    try {
      this.validateId(id)
      
      const cacheKey = `product:${id}`
      const cached = await this.getCached<Product>(cacheKey)
      if (cached) return cached
      
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: {
          website: {
            select: {
              id: true,
              name: true,
              subdomain: true,
              customDomain: true
            }
          }
        }
      })
      
      if (product) {
        await this.setCached(cacheKey, product, 1800) // 30 minutes
      }
      
      return product
    } catch (error) {
      this.handleError(error)
    }
  }

  override async findAll(filters: ProductFilters = {}): Promise<Product[]> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search,
        priceMin,
        priceMax,
        inStock,
        ...whereFilters
      } = filters
      
      const { skip, take } = this.getPaginationParams(page, limit)
      
      // Build where clause
      const where: Prisma.ProductWhereInput = {
        ...whereFilters
      }
      
      // Add search functionality
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { description: { contains: search } },
          { sku: { contains: search } }
        ]
      }
      
      // Price range filter
      if (priceMin !== undefined || priceMax !== undefined) {
        where.price = {}
        if (priceMin !== undefined) where.price.gte = priceMin
        if (priceMax !== undefined) where.price.lte = priceMax
      }
      
      // Stock filter
      if (inStock !== undefined) {
        if (inStock) {
          where.OR = [
            { trackInventory: false },
            { AND: [{ trackInventory: true }, { inventory: { gt: 0 } }] }
          ]
        } else {
          where.AND = [
            { trackInventory: true },
            { inventory: { lte: 0 } }
          ]
        }
      }
      
      const products = await this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        include: {
          website: {
            select: {
              id: true,
              name: true,
              subdomain: true,
              customDomain: true
            }
          }
        }
      })
      
      return products
    } catch (error) {
      this.handleError(error)
    }
  }

  override async update(id: string, data: UpdateProductData): Promise<Product> {
    try {
      this.validateId(id)
      
      const product = await this.prisma.product.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description || null,
          price: data.price,
          comparePrice: data.comparePrice || null,
          sku: data.sku || null,
          images: data.images ? data.images.join(',') : null,
          trackInventory: data.trackInventory,
          inventory: data.inventory,
          lowStockThreshold: data.lowStockThreshold,
          metaTitle: data.metaTitle || null,
          metaDescription: data.metaDescription || null,
          metaKeywords: data.metaKeywords ? data.metaKeywords.join(',') : null,
          status: data.status,
          updatedAt: new Date()
        }
      })
      
      await this.invalidateCache(`product:${id}`)
      await this.invalidateCache('products:*')
      
      return product
    } catch (error) {
      this.handleError(error)
    }
  }

  override async delete(id: string): Promise<boolean> {
    try {
      this.validateId(id)
      
      await this.prisma.product.update({
        where: { id },
        data: {
          status: ProductStatus.OUT_OF_STOCK,
          updatedAt: new Date()
        }
      })
      
      await this.invalidateCache(`product:${id}`)
      await this.invalidateCache('products:*')
      
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  // Inventory Management
  async updateInventory(id: string, quantity: number, operation: 'add' | 'subtract' | 'set'): Promise<Product> {
    try {
      this.validateId(id)
      
      const product = await this.findById(id)
      if (!product) {
        throw new Error('Product not found')
      }
      
      if (!product.trackInventory) {
        throw new Error('Inventory tracking is not enabled for this product')
      }
      
      let newInventory: number
      switch (operation) {
        case 'add':
          newInventory = product.inventory + quantity
          break
        case 'subtract':
          newInventory = Math.max(0, product.inventory - quantity)
          break
        case 'set':
          newInventory = Math.max(0, quantity)
          break
        default:
          throw new Error('Invalid operation')
      }
      
      const updatedProduct = await this.update(id, { inventory: newInventory })
      
      // Check for low stock
      if (newInventory <= product.lowStockThreshold) {
        // Send low stock notification (implement notification service)
        console.log(`Low stock alert for product ${product.name}: ${newInventory} remaining`)
      }
      
      return updatedProduct
    } catch (error) {
      this.handleError(error)
    }
  }

  async bulkUpdateInventory(updates: Array<{ id: string; quantity: number; operation: 'add' | 'subtract' | 'set' }>): Promise<void> {
    try {
      await this.withTransaction(async (prisma) => {
        for (const update of updates) {
          await this.updateInventory(update.id, update.quantity, update.operation)
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  // Product Status Management
  async publish(id: string): Promise<Product> {
    try {
      return await this.update(id, { status: ProductStatus.ACTIVE })
    } catch (error) {
      this.handleError(error)
    }
  }

  async unpublish(id: string): Promise<Product> {
    try {
      return await this.update(id, { status: ProductStatus.INACTIVE })
    } catch (error) {
      this.handleError(error)
    }
  }

  // Analytics
  async getProductStats(websiteId: string): Promise<{
    totalProducts: number
    activeProducts: number
    outOfStockProducts: number
    lowStockProducts: number
    totalValue: number
    averagePrice: number
  }> {
    try {
      const cacheKey = `product:stats:${websiteId}`
      const cached = await this.getCached(cacheKey)
      if (cached) return cached
      
      const [
        totalProducts,
        activeProducts,
        outOfStockProducts,
        lowStockProducts,
        priceStats
      ] = await Promise.all([
        this.prisma.product.count({ where: { websiteId } }),
        this.prisma.product.count({ 
          where: { websiteId, status: ProductStatus.ACTIVE } 
        }),
        this.prisma.product.count({ 
          where: { websiteId, status: ProductStatus.OUT_OF_STOCK } 
        }),
        this.prisma.product.count({
          where: {
            websiteId,
            trackInventory: true,
            inventory: { lte: this.prisma.product.fields.lowStockThreshold }
          }
        }),
        this.prisma.product.aggregate({
          where: { websiteId, status: ProductStatus.ACTIVE },
          _sum: { price: true },
          _avg: { price: true }
        })
      ])
      
      const stats = {
        totalProducts,
        activeProducts,
        outOfStockProducts,
        lowStockProducts,
        totalValue: priceStats._sum.price?.toNumber() || 0,
        averagePrice: priceStats._avg.price?.toNumber() || 0
      }
      
      await this.setCached(cacheKey, stats, 1800) // 30 minutes
      
      return stats
    } catch (error) {
      this.handleError(error)
    }
  }

  // Search and Filter
  async searchProducts(websiteId: string, query: string, filters?: {
    category?: string
    priceMin?: number
    priceMax?: number
    inStock?: boolean
  }): Promise<Product[]> {
    try {
      const where: Prisma.ProductWhereInput = {
        websiteId,
        status: ProductStatus.ACTIVE,
        OR: [
          { name: { contains: query } },
          { description: { contains: query } }
        ]
      }
      
      // Apply additional filters
      if (filters?.priceMin !== undefined || filters?.priceMax !== undefined) {
        where.price = {}
        if (filters.priceMin !== undefined) where.price.gte = filters.priceMin
        if (filters.priceMax !== undefined) where.price.lte = filters.priceMax
      }
      
      if (filters?.inStock) {
        where.OR = [
          { trackInventory: false },
          { AND: [{ trackInventory: true }, { inventory: { gt: 0 } }] }
        ]
      }
      
      return await this.prisma.product.findMany({
        where,
        orderBy: { name: 'asc' }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  // Featured Products
  async getFeaturedProducts(websiteId: string, limit: number = 8): Promise<Product[]> {
    try {
      const cacheKey = `product:featured:${websiteId}:${limit}`
      const cached = await this.getCached<Product[]>(cacheKey)
      if (cached) return cached
      
      const products = await this.prisma.product.findMany({
        where: {
          websiteId,
          status: ProductStatus.ACTIVE
        },
        take: limit,
        orderBy: [
          { createdAt: 'desc' }
        ]
      })
      
      await this.setCached(cacheKey, products, 3600) // 1 hour
      
      return products
    } catch (error) {
      this.handleError(error)
    }
  }

  // Related Products
  async getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
    try {
      const product = await this.findById(productId)
      if (!product) return []
      
      return await this.prisma.product.findMany({
        where: {
          websiteId: product.websiteId,
          status: ProductStatus.ACTIVE,
          id: { not: productId }
        },
        take: limit,
        orderBy: { createdAt: 'desc' }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  // Additional methods for routes
  async findMany(filters: ProductFilters = {}): Promise<{
    products: Product[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }> {
    try {
      const products = await this.findAll(filters)
      const total = await this.prisma.product.count({
        where: this.buildWhereClause(filters)
      })
      
      return {
        products,
        pagination: {
          page: filters.page || 1,
          limit: filters.limit || 20,
          total,
          pages: Math.ceil(total / (filters.limit || 20))
        }
      }
    } catch (error) {
      this.handleError(error)
    }
  }

  async addVariants(id: string, variants: any[]): Promise<Product> {
    try {
      this.validateId(id)
      
      const product = await this.findById(id)
      if (!product) {
        throw new Error('Product not found')
      }
      
      const updatedProduct = await this.update(id, {
        variants: JSON.stringify(variants)
      })
      
      return updatedProduct
    } catch (error) {
      this.handleError(error)
    }
  }

  async bulkUpdateByIds(productIds: string[], updates: any): Promise<{
    updated: number
    failed: number
  }> {
    try {
      let updated = 0
      let failed = 0
      
      for (const id of productIds) {
        try {
          await this.update(id, updates)
          updated++
        } catch (error) {
          failed++
        }
      }
      
      return { updated, failed }
    } catch (error) {
      this.handleError(error)
    }
  }

  private buildWhereClause(filters: ProductFilters): any {
    const where: any = {}
    
    if (filters.websiteId) where.websiteId = filters.websiteId
    if (filters.status) where.status = filters.status
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
        { sku: { contains: filters.search } }
      ]
    }
    
    return where
  }

  // Bulk Operations
  override async bulkCreate(products: CreateProductData[]): Promise<Product[]> {
    try {
      const result = await this.prisma.product.createMany({
        data: products.map(product => ({
          websiteId: product.websiteId,
          name: product.name,
          description: product.description || null,
          price: product.price,
          comparePrice: product.comparePrice || null,
          sku: product.sku || null,
          images: product.images ? product.images.join(',') : null,
          trackInventory: product.trackInventory || false,
          inventory: product.inventory || 0,
          lowStockThreshold: product.lowStockThreshold || 5,
          metaTitle: product.metaTitle || null,
          metaDescription: product.metaDescription || null,
          metaKeywords: product.metaKeywords ? product.metaKeywords.join(',') : null,
          status: product.status || ProductStatus.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date()
        })),
        skipDuplicates: true
      })
      
      await this.invalidateCache('products:*')
      
      return await this.prisma.product.findMany({
        where: {
          name: { in: products.map(p => p.name) }
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  override async bulkUpdate(updates: Array<{ id: string; data: UpdateProductData }>): Promise<Product[]> {
    try {
      const results: Product[] = []
      
      for (const update of updates) {
        const product = await this.update(update.id, update.data)
        results.push(product)
      }
      
      return results
    } catch (error) {
      this.handleError(error)
    }
  }

  override async bulkDelete(ids: string[]): Promise<number> {
    try {
      const result = await this.prisma.product.updateMany({
        where: { id: { in: ids } },
        data: {
          status: ProductStatus.INACTIVE,
          updatedAt: new Date()
        }
      })
      
      await this.invalidateCache('products:*')
      
      return result.count
    } catch (error) {
      this.handleError(error)
    }
  }
}
