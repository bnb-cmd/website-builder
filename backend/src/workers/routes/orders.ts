import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { db } from '../lib/db'
import { kv } from '../lib/kv'
import { v4 as uuidv4 } from 'uuid'
import { requireEcommerceFeature } from '../middleware/packageAccess'

const orderRoutes = new Hono()

// Validation schemas
const createOrderSchema = z.object({
  websiteId: z.string().uuid(),
  customerName: z.string().min(1).max(100),
  customerPhone: z.string().regex(/^(\+92|0)?[0-9]{10}$/, 'Invalid Pakistani phone number'),
  customerEmail: z.string().email().optional(),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1),
    price: z.number().positive()
  })).min(1),
  shippingAddress: z.object({
    addressLine1: z.string().min(1).max(200),
    addressLine2: z.string().max(200).optional(),
    city: z.string().min(1).max(100),
    postalCode: z.string().max(10).optional(),
    phone: z.string().regex(/^(\+92|0)?[0-9]{10}$/, 'Invalid Pakistani phone number')
  }),
  paymentMethod: z.enum(['easypaisa', 'jazzcash', 'cod']),
  notes: z.string().max(500).optional()
})

const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
  notes: z.string().max(500).optional()
})

type Bindings = {
  DB: D1Database
  CACHE_KV: KVNamespace
}

// Helper function to validate Pakistani phone number
function validatePakistaniPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  return /^(\+92|0)?[0-9]{10}$/.test(cleaned)
}

// Helper function to format Pakistani phone number
function formatPakistaniPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  if (cleaned.startsWith('+92')) {
    return cleaned
  } else if (cleaned.startsWith('0')) {
    return '+92' + cleaned.substring(1)
  } else if (cleaned.length === 10) {
    return '+92' + cleaned
  }
  return phone
}

// POST /orders - Create new order (public endpoint for customers)
orderRoutes.post('/', zValidator('json', createOrderSchema), async (c) => {
  const { DB } = c.env as Bindings
  const orderData = c.req.valid('json')

  try {
    // Verify website exists and is published
    const website = await db.queryOne(c, 'SELECT id, name, status FROM websites WHERE id = ?', [orderData.websiteId])
    
    if (!website) {
      return c.json({
        success: false,
        error: {
          message: 'Website not found',
          code: 'WEBSITE_NOT_FOUND'
        }
      }, 404)
    }

    if (website.status !== 'PUBLISHED') {
      return c.json({
        success: false,
        error: {
          message: 'Website is not published',
          code: 'WEBSITE_NOT_PUBLISHED'
        }
      }, 400)
    }

    // Validate products exist and are active
    const productIds = orderData.items.map(item => item.productId)
    const products = await db.query(c, 'SELECT id, name, price, track_inventory, inventory FROM products WHERE id IN (' + productIds.map(() => '?').join(',') + ')', productIds)
    
    if (products.length !== productIds.length) {
      return c.json({
        success: false,
        error: {
          message: 'Some products not found',
          code: 'PRODUCTS_NOT_FOUND'
        }
      }, 400)
    }

    // Check inventory for products that track inventory
    for (const item of orderData.items) {
      const product = products.find(p => p.id === item.productId)
      if (product.track_inventory && product.inventory < item.quantity) {
        return c.json({
          success: false,
          error: {
            message: `Insufficient inventory for ${product.name}`,
            code: 'INSUFFICIENT_INVENTORY'
          }
        }, 400)
      }
    }

    // Calculate total amount
    const totalAmount = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    // Generate order ID
    const orderId = uuidv4()
    const now = new Date().toISOString()

    // Format phone numbers
    const formattedCustomerPhone = formatPakistaniPhone(orderData.customerPhone)
    const formattedShippingPhone = formatPakistaniPhone(orderData.shippingAddress.phone)

    // Create order
    await db.execute(c, `
      INSERT INTO orders (id, website_id, customer_name, customer_phone, customer_email, 
                         total_amount, currency, status, payment_method, payment_status, 
                         notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      orderId,
      orderData.websiteId,
      orderData.customerName,
      formattedCustomerPhone,
      orderData.customerEmail || null,
      totalAmount,
      'PKR',
      'pending',
      orderData.paymentMethod,
      'pending',
      orderData.notes || null,
      now,
      now
    ])

    // Create order items
    for (const item of orderData.items) {
      const itemId = uuidv4()
      await db.execute(c, `
        INSERT INTO order_items (id, order_id, product_id, quantity, price, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [itemId, orderId, item.productId, item.quantity, item.price, now])

      // Update inventory if tracking is enabled
      const product = products.find(p => p.id === item.productId)
      if (product.track_inventory) {
        await db.execute(c, 'UPDATE products SET inventory = inventory - ? WHERE id = ?', [item.quantity, item.productId])
      }
    }

    // Create shipping address
    const shippingId = uuidv4()
    await db.execute(c, `
      INSERT INTO shipping_addresses (id, order_id, address_line1, address_line2, 
                                    city, postal_code, phone, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      shippingId,
      orderId,
      orderData.shippingAddress.addressLine1,
      orderData.shippingAddress.addressLine2 || null,
      orderData.shippingAddress.city,
      orderData.shippingAddress.postalCode || null,
      formattedShippingPhone,
      now
    ])

    // Invalidate website cache
    await kv.delete(c, `website:${orderData.websiteId}:*`)

    return c.json({
      success: true,
      data: {
        orderId,
        totalAmount,
        currency: 'PKR',
        status: 'pending',
        paymentMethod: orderData.paymentMethod,
        createdAt: now
      }
    })

  } catch (error: any) {
    console.error('Create order error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to create order',
        code: 'ORDER_CREATION_FAILED'
      }
    }, 500)
  }
})

// GET /orders - List orders for website owner (authenticated)
orderRoutes.get('/', requireEcommerceFeature('orders'), async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId
  const websiteId = c.req.query('websiteId')
  const status = c.req.query('status')
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '20')
  const offset = (page - 1) * limit

  try {
    if (!userId) {
      return c.json({
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    if (!websiteId) {
      return c.json({
        success: false,
        error: {
          message: 'Website ID is required',
          code: 'WEBSITE_ID_REQUIRED'
        }
      }, 400)
    }

    // Verify website ownership
    const website = await db.queryOne(c, 'SELECT id FROM websites WHERE id = ? AND user_id = ?', [websiteId, userId])
    
    if (!website) {
      return c.json({
        success: false,
        error: {
          message: 'Website not found or access denied',
          code: 'WEBSITE_NOT_FOUND'
        }
      }, 404)
    }

    // Build query with filters
    let query = `
      SELECT o.*, 
             COUNT(oi.id) as item_count,
             GROUP_CONCAT(p.name) as product_names
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.website_id = ?
    `
    const params: any[] = [websiteId]

    if (status) {
      query += ' AND o.status = ?'
      params.push(status)
    }

    query += ' GROUP BY o.id ORDER BY o.created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const orders = await db.query(c, query, params)

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM orders WHERE website_id = ?'
    const countParams: any[] = [websiteId]

    if (status) {
      countQuery += ' AND status = ?'
      countParams.push(status)
    }

    const countResult = await db.queryOne(c, countQuery, countParams)
    const total = countResult?.total || 0

    return c.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error: any) {
    console.error('Get orders error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to retrieve orders',
        code: 'ORDERS_RETRIEVAL_FAILED'
      }
    }, 500)
  }
})

// GET /orders/:id - Get single order details
orderRoutes.get('/:id', requireEcommerceFeature('orders'), async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId
  const orderId = c.req.param('id')

  try {
    if (!userId) {
      return c.json({
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    // Get order with website ownership check
    const order = await db.queryOne(c, `
      SELECT o.*, w.name as website_name
      FROM orders o
      JOIN websites w ON o.website_id = w.id
      WHERE o.id = ? AND w.user_id = ?
    `, [orderId, userId])

    if (!order) {
      return c.json({
        success: false,
        error: {
          message: 'Order not found or access denied',
          code: 'ORDER_NOT_FOUND'
        }
      }, 404)
    }

    // Get order items with product details
    const items = await db.query(c, `
      SELECT oi.*, p.name as product_name, p.description as product_description
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [orderId])

    // Get shipping address
    const shippingAddress = await db.queryOne(c, `
      SELECT * FROM shipping_addresses WHERE order_id = ?
    `, [orderId])

    // Get payment transactions
    const payments = await db.query(c, `
      SELECT * FROM payment_transactions WHERE order_id = ?
    `, [orderId])

    return c.json({
      success: true,
      data: {
        ...order,
        items,
        shippingAddress,
        payments
      }
    })

  } catch (error: any) {
    console.error('Get order error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to retrieve order',
        code: 'ORDER_RETRIEVAL_FAILED'
      }
    }, 500)
  }
})

// PATCH /orders/:id/status - Update order status
orderRoutes.patch('/:id/status', requireEcommerceFeature('orders'), zValidator('json', updateOrderStatusSchema), async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId
  const orderId = c.req.param('id')
  const { status, notes } = c.req.valid('json')

  try {
    if (!userId) {
      return c.json({
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    // Verify order ownership
    const order = await db.queryOne(c, `
      SELECT o.* FROM orders o
      JOIN websites w ON o.website_id = w.id
      WHERE o.id = ? AND w.user_id = ?
    `, [orderId, userId])

    if (!order) {
      return c.json({
        success: false,
        error: {
          message: 'Order not found or access denied',
          code: 'ORDER_NOT_FOUND'
        }
      }, 404)
    }

    // Update order status
    await db.execute(c, `
      UPDATE orders 
      SET status = ?, notes = ?, updated_at = ?
      WHERE id = ?
    `, [status, notes || order.notes, new Date().toISOString(), orderId])

    // Invalidate cache
    await kv.delete(c, `website:${order.website_id}:*`)

    return c.json({
      success: true,
      data: {
        orderId,
        status,
        updatedAt: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error('Update order status error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to update order status',
        code: 'ORDER_UPDATE_FAILED'
      }
    }, 500)
  }
})

// GET /orders/stats - Basic order statistics
orderRoutes.get('/stats', requireEcommerceFeature('orders'), async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId
  const websiteId = c.req.query('websiteId')

  try {
    if (!userId) {
      return c.json({
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    if (!websiteId) {
      return c.json({
        success: false,
        error: {
          message: 'Website ID is required',
          code: 'WEBSITE_ID_REQUIRED'
        }
      }, 400)
    }

    // Verify website ownership
    const website = await db.queryOne(c, 'SELECT id FROM websites WHERE id = ? AND user_id = ?', [websiteId, userId])
    
    if (!website) {
      return c.json({
        success: false,
        error: {
          message: 'Website not found or access denied',
          code: 'WEBSITE_NOT_FOUND'
        }
      }, 404)
    }

    // Get order statistics
    const stats = await db.queryOne(c, `
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_orders,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_order_value
      FROM orders 
      WHERE website_id = ?
    `, [websiteId])

    // Get recent orders (last 7 days)
    const recentOrders = await db.query(c, `
      SELECT COUNT(*) as count
      FROM orders 
      WHERE website_id = ? AND created_at >= datetime('now', '-7 days')
    `, [websiteId])

    return c.json({
      success: true,
      data: {
        ...stats,
        recentOrders: recentOrders[0]?.count || 0
      }
    })

  } catch (error: any) {
    console.error('Get order stats error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to retrieve order statistics',
        code: 'ORDER_STATS_FAILED'
      }
    }, 500)
  }
})

export default orderRoutes
