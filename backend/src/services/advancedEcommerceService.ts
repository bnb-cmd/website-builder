import { prisma } from '@/models/database'
import { redis } from '@/models/redis'
import { Prisma } from '@prisma/client'

export class AdvancedEcommerceService {
  // Vendor Management
  async createVendor(data: {
    userId: string
    businessName: string
    description?: string
    website?: string
    commission: {
      percentage: number
      fixed?: number
    }
  }) {
    const vendor = await prisma.vendor.create({
      data: {
        userId: data.userId,
        businessName: data.businessName,
        description: data.description || null,
        website: data.website || null,
        commission: {
          percentage: data.commission.percentage,
          fixed: data.commission.fixed || 0
        } as Prisma.InputJsonValue,
        payoutSettings: {
          method: 'bank_transfer',
          accountDetails: {}
        } as Prisma.InputJsonValue,
        status: 'PENDING'
      }
    })

    // Cache vendor data
    await redis.set(`vendor:${vendor.id}`, JSON.stringify(vendor), 3600)

    return vendor
  }

  async getVendorById(id: string) {
    // Try cache first
    const cached = await redis.get(`vendor:${id}`)
    if (cached) return JSON.parse(cached)

    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        products: true,
        orders: {
          include: {
            items: true
          }
        }
      }
    })

    if (vendor) {
      await redis.set(`vendor:${id}`, JSON.stringify(vendor), 3600)
    }

    return vendor
  }

  async updateVendorStatus(id: string, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED', reviewedBy?: string) {
    const vendor = await prisma.vendor.update({
      where: { id },
      data: {
        status,
        reviewedBy: reviewedBy || null,
        reviewedAt: new Date()
      }
    })

    // Update cache
    await redis.set(`vendor:${id}`, JSON.stringify(vendor), 3600)

    return vendor
  }

  // Supplier Management
  async createSupplier(data: {
    name: string
    email: string
    phone?: string
    apiEndpoint?: string
    apiKey?: string;
    shippingTime: string;
    returnPolicy?: string;
    commission?: number;
  }) {
    const supplier = await prisma.supplier.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        apiEndpoint: data.apiEndpoint || null,
        apiKey: data.apiKey || null,
        shippingTime: data.shippingTime,
        returnPolicy: data.returnPolicy || null,
        commission: data.commission || null,
        status: 'ACTIVE'
      }
    });

    return supplier;
  }

  async getSupplierProducts(supplierId: string) {
    const products = await prisma.supplierProduct.findMany({
      where: { supplierId },
      orderBy: { lastSynced: 'desc' }
    })

    return products
  }

  async syncSupplierProducts(supplierId: string, products: any[]) {
    const syncedProducts = []

    for (const product of products) {
      const syncedProduct = await prisma.supplierProduct.upsert({
        where: {
          supplierId_externalId: {
            supplierId,
            externalId: product.externalId
          }
        },
        update: {
          name: product.name,
          description: product.description,
          price: product.price,
          currency: product.currency,
          images: product.images,
          stock: product.stock,
          category: product.category,
          variants: product.variants,
          lastSynced: new Date()
        },
        create: {
          supplierId,
          externalId: product.externalId,
          name: product.name,
          description: product.description,
          price: product.price,
          currency: product.currency,
          images: product.images,
          stock: product.stock,
          category: product.category,
          variants: product.variants,
          lastSynced: new Date()
        }
      })

      syncedProducts.push(syncedProduct)
    }

    return syncedProducts
  }

  // Dropshipping
  async createDropshippingOrder(data: {
    orderId: string;
    supplierId: string;
    userId: string;
    items: Array<{
      productId: string
      variantId?: string
      quantity: number
      supplierPrice: number
      sellingPrice: number
    }>
  }) {
    const profit = data.items.reduce((total, item) =>
      total + ((item.sellingPrice - item.supplierPrice) * item.quantity), 0
    )

    const cost = data.items.reduce((total, item) =>
      total + (item.supplierPrice * item.quantity), 0
    )

    const dropshippingOrder = await prisma.dropshippingOrder.create({
      data: {
        orderId: data.orderId,
        supplierId: data.supplierId,
        status: 'PENDING',
        cost,
        profit,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
            supplierPrice: item.supplierPrice,
            sellingPrice: item.sellingPrice,
            profit: (item.sellingPrice - item.supplierPrice) * item.quantity
          }))
        }
      },
      include: {
        items: true
      }
    });

    return dropshippingOrder
  }

  async updateDropshippingOrderStatus(id: string, status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'FAILED', trackingNumber?: string) {
    const updateData: any = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (status === 'DELIVERED') updateData.actualDelivery = new Date();

    const order = await prisma.dropshippingOrder.update({
      where: { id },
      data: updateData,
      include: {
        items: true
      }
    });

    return order;
  }


  // Subscription Management
  async createSubscriptionPlan(data: {
    productId: string
    name: string
    description?: string
    interval: 'daily' | 'weekly' | 'monthly' | 'yearly'
    intervalCount: number
    price: number
    trialDays?: number
  }) {
    const plan = await prisma.productSubscriptionPlan.create({
      data: {
        productId: data.productId,
        name: data.name,
        description: data.description || null,
        interval: data.interval.toUpperCase() as any,
        intervalCount: data.intervalCount,
        price: data.price,
        trialDays: data.trialDays || null,
        status: 'ACTIVE'
      }
    });

    return plan
  }

  async createSubscription(data: {
    customerId: string
    planId: string;
    trialDays?: number;
  }) {
    const plan = await prisma.productSubscriptionPlan.findUnique({
      where: { id: data.planId }
    });

    if (!plan) throw new Error('Subscription plan not found');

    const now = new Date();
    const trialEnd = data.trialDays ? new Date(now.getTime() + data.trialDays * 24 * 60 * 60 * 1000) : null;
    const currentPeriodEnd = this.calculateNextBillingDate(now, plan.interval.toLowerCase(), plan.intervalCount);
    const nextBillingDate = this.calculateNextBillingDate(currentPeriodEnd, plan.interval.toLowerCase(), plan.intervalCount);

    const subscription = await prisma.productSubscription.create({
      data: {
        customerId: data.customerId,
        planId: data.planId,
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd,
        trialEnd,
        nextBillingDate
      },
      include: {
        customer: true,
        plan: true
      }
    });

    return subscription;
  }

  async processSubscriptionBilling(subscriptionId: string) {
    const subscription = await prisma.productSubscription.findUnique({
      where: { id: subscriptionId },
      include: { customer: true, plan: true }
    });

    if (!subscription || subscription.status !== 'ACTIVE') {
      throw new Error('Subscription not found or not active');
    }

    // Create billing record
    const billing = await prisma.productSubscriptionBilling.create({
      data: {
        subscriptionId: subscription.id,
        amount: subscription.plan.price,
        currency: 'PKR',
        status: 'PENDING',
        billingDate: new Date()
      }
    });

    // Update subscription next billing date
    const nextBillingDate = this.calculateNextBillingDate(
      new Date(),
      subscription.plan.interval.toLowerCase(),
      subscription.plan.intervalCount
    );

    await prisma.productSubscription.update({
      where: { id: subscriptionId },
      data: {
        currentPeriodEnd: nextBillingDate,
        nextBillingDate: this.calculateNextBillingDate(nextBillingDate, subscription.plan.interval.toLowerCase(), subscription.plan.intervalCount)
      }
    });

    return billing;
  }

  private calculateNextBillingDate(from: Date, interval: string, count: number): Date {
    const date = new Date(from)

    switch (interval) {
      case 'daily':
        date.setDate(date.getDate() + count)
        break
      case 'weekly':
        date.setDate(date.getDate() + (count * 7))
        break
      case 'monthly':
        date.setMonth(date.getMonth() + count)
        break
      case 'yearly':
        date.setFullYear(date.getFullYear() + count)
        break
    }

    return date
  }

  // Vendor Applications
  async createVendorApplication(data: {
    userId: string
    businessName: string
    businessType: string
    description: string
    website?: string
    socialMedia?: Record<string, string>
    experience?: string
    productCategories: string[]
  }) {
    const application = await prisma.vendorApplication.create({
      data: {
        userId: data.userId,
        businessName: data.businessName,
        businessType: data.businessType,
        description: data.description,
        website: data.website || null,
        socialMedia: data.socialMedia ? data.socialMedia as Prisma.InputJsonValue : Prisma.DbNull,
        experience: data.experience || null,
        productCategories: data.productCategories as Prisma.InputJsonValue,
        status: 'PENDING'
      }
    })

    return application
  }

  async reviewVendorApplication(id: string, status: 'APPROVED' | 'REJECTED', reviewedBy: string, reviewNotes?: string) {
    const application = await prisma.vendorApplication.update({
      where: { id },
      data: {
        status,
        reviewedBy,
        reviewNotes: reviewNotes || null,
        reviewedAt: new Date()
      }
    })

    // If approved, create vendor account
    if (status === 'APPROVED') {
      await this.createVendor({
        userId: application.userId,
        businessName: application.businessName,
        description: application.description || '',
        website: application.website || '',
        commission: { percentage: 10 } // Default commission
      });
    }

    return application
  }

  // Analytics
  async getVendorAnalytics(vendorId: string, period: '7d' | '30d' | '90d' = '30d') {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - (period === '7d' ? 7 : period === '30d' ? 30 : 90))

    const [orders, products, earnings] = await Promise.all([
      prisma.order.findMany({
        where: {
          items: {
            some: {
              product: {
                vendorId
              }
            }
          },
          createdAt: {
            gte: startDate
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      }),
      prisma.product.count({
        where: { vendorId }
      }),
      prisma.vendor.findUnique({
        where: { id: vendorId },
        select: { totalEarnings: true, totalSales: true }
      })
    ])

    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) =>
      sum + order.items
        .filter(item => item.product.vendorId === vendorId)
        .reduce((itemSum, item) => itemSum + (Number(item.price) * item.quantity), 0), 0
    )

    return {
      period,
      totalOrders,
      totalRevenue,
      totalProducts: products,
      totalEarnings: earnings?.totalEarnings || 0,
      totalSales: earnings?.totalSales || 0,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
    }
  }

  async getDropshippingAnalytics(supplierId: string, period: '7d' | '30d' | '90d' = '30d') {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - (period === '7d' ? 7 : period === '30d' ? 30 : 90))

    const orders = await prisma.dropshippingOrder.findMany({
      where: {
        supplierId,
        createdAt: {
          gte: startDate
        }
      }
    })

    const totalOrders = orders.length
    const totalProfit = orders.reduce((sum, order) => sum + order.profit, 0)
    const totalCost = orders.reduce((sum, order) => sum + order.cost, 0)
    const successfulOrders = orders.filter(order =>
      ['shipped', 'delivered'].includes(order.status)
    ).length

    return {
      period,
      totalOrders,
      successfulOrders,
      totalProfit,
      totalCost,
      successRate: totalOrders > 0 ? (successfulOrders / totalOrders) * 100 : 0
    }
  }
}

export const advancedEcommerceService = new AdvancedEcommerceService()
