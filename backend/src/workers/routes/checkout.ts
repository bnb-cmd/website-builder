import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { db } from '../lib/db'
import { kv } from '../lib/kv'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'
import { requireEcommerceFeature } from '../middleware/packageAccess'

const checkoutRoutes = new Hono()

// Validation schemas
const initiatePaymentSchema = z.object({
  orderId: z.string().uuid(),
  paymentMethod: z.enum(['easypaisa', 'jazzcash', 'cod']),
  returnUrl: z.string().url().optional()
})

const easypaisaCallbackSchema = z.object({
  transactionId: z.string(),
  orderId: z.string(),
  amount: z.string(),
  status: z.string(),
  signature: z.string()
})

const jazzcashCallbackSchema = z.object({
  transactionId: z.string(),
  orderId: z.string(),
  amount: z.string(),
  status: z.string(),
  signature: z.string()
})

const codConfirmSchema = z.object({
  orderId: z.string().uuid(),
  confirmed: z.boolean()
})

type Bindings = {
  DB: D1Database
  CACHE_KV: KVNamespace
  EASYPAISA_STORE_ID: string
  EASYPAISA_MERCHANT_KEY: string
  JAZZCASH_MERCHANT_ID: string
  JAZZCASH_PASSWORD: string
}

// Helper function to generate HMAC signature
function generateHMAC(data: string, key: string): string {
  return crypto.createHmac('sha256', key).update(data).digest('hex')
}

// Helper function to verify HMAC signature
function verifyHMAC(data: string, signature: string, key: string): boolean {
  const expectedSignature = generateHMAC(data, key)
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
}

// POST /checkout/initiate - Start payment process
checkoutRoutes.post('/initiate', requireEcommerceFeature('orders'), zValidator('json', initiatePaymentSchema), async (c) => {
  const { DB, EASYPAISA_STORE_ID, EASYPAISA_MERCHANT_KEY, JAZZCASH_MERCHANT_ID, JAZZCASH_PASSWORD } = c.env as Bindings
  const { orderId, paymentMethod, returnUrl } = c.req.valid('json')

  try {
    // Get order details
    const order = await db.queryOne(c, `
      SELECT o.*, w.name as website_name
      FROM orders o
      JOIN websites w ON o.website_id = w.id
      WHERE o.id = ?
    `, [orderId])

    if (!order) {
      return c.json({
        success: false,
        error: {
          message: 'Order not found',
          code: 'ORDER_NOT_FOUND'
        }
      }, 404)
    }

    if (order.payment_status !== 'pending') {
      return c.json({
        success: false,
        error: {
          message: 'Order payment already processed',
          code: 'PAYMENT_ALREADY_PROCESSED'
        }
      }, 400)
    }

    const transactionId = uuidv4()
    const now = new Date().toISOString()

    let paymentData: any = {}

    if (paymentMethod === 'easypaisa') {
      // Easypaisa MA (Merchant Account) integration
      const easypaisaData = {
        storeId: EASYPAISA_STORE_ID,
        orderId: orderId,
        amount: Math.round(order.total_amount * 100), // Convert to paisa
        currency: 'PKR',
        transactionId: transactionId,
        returnUrl: returnUrl || `${c.req.url.split('/api')[0]}/checkout/success`,
        cancelUrl: `${c.req.url.split('/api')[0]}/checkout/cancel`,
        timestamp: Math.floor(Date.now() / 1000)
      }

      // Generate signature for Easypaisa
      const signatureData = `${easypaisaData.storeId}${easypaisaData.orderId}${easypaisaData.amount}${easypaisaData.currency}${easypaisaData.transactionId}${easypaisaData.timestamp}`
      easypaisaData.signature = generateHMAC(signatureData, EASYPAISA_MERCHANT_KEY)

      paymentData = {
        gateway: 'easypaisa',
        gatewayTransactionId: transactionId,
        amount: order.total_amount,
        currency: 'PKR',
        status: 'initiated',
        gatewayResponse: JSON.stringify(easypaisaData),
        paymentUrl: `https://easypaisa.com.pk/api/payment/initiate`
      }

    } else if (paymentMethod === 'jazzcash') {
      // JazzCash Mobile Wallet integration
      const jazzcashData = {
        merchantId: JAZZCASH_MERCHANT_ID,
        orderId: orderId,
        amount: Math.round(order.total_amount * 100), // Convert to paisa
        currency: 'PKR',
        transactionId: transactionId,
        returnUrl: returnUrl || `${c.req.url.split('/api')[0]}/checkout/success`,
        cancelUrl: `${c.req.url.split('/api')[0]}/checkout/cancel`,
        timestamp: Math.floor(Date.now() / 1000)
      }

      // Generate signature for JazzCash
      const signatureData = `${jazzcashData.merchantId}${jazzcashData.orderId}${jazzcashData.amount}${jazzcashData.currency}${jazzcashData.transactionId}${jazzcashData.timestamp}`
      jazzcashData.signature = generateHMAC(signatureData, JAZZCASH_PASSWORD)

      paymentData = {
        gateway: 'jazzcash',
        gatewayTransactionId: transactionId,
        amount: order.total_amount,
        currency: 'PKR',
        status: 'initiated',
        gatewayResponse: JSON.stringify(jazzcashData),
        paymentUrl: `https://sandbox.jazzcash.com.pk/api/payment/initiate`
      }

    } else if (paymentMethod === 'cod') {
      // Cash on Delivery - no external payment gateway
      paymentData = {
        gateway: 'cod',
        gatewayTransactionId: transactionId,
        amount: order.total_amount,
        currency: 'PKR',
        status: 'pending',
        gatewayResponse: JSON.stringify({ method: 'cod', confirmed: false }),
        paymentUrl: null
      }
    }

    // Create payment transaction record
    await db.execute(c, `
      INSERT INTO payment_transactions (id, order_id, gateway, gateway_transaction_id, 
                                      amount, currency, status, gateway_response, 
                                      created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      transactionId,
      orderId,
      paymentData.gateway,
      paymentData.gatewayTransactionId,
      paymentData.amount,
      paymentData.currency,
      paymentData.status,
      paymentData.gatewayResponse,
      now,
      now
    ])

    // Update order payment status
    await db.execute(c, `
      UPDATE orders 
      SET payment_status = ?, updated_at = ?
      WHERE id = ?
    `, [paymentData.status, now, orderId])

    return c.json({
      success: true,
      data: {
        transactionId,
        paymentMethod,
        amount: order.total_amount,
        currency: 'PKR',
        status: paymentData.status,
        paymentUrl: paymentData.paymentUrl,
        gatewayData: paymentData.gatewayResponse
      }
    })

  } catch (error: any) {
    console.error('Initiate payment error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to initiate payment',
        code: 'PAYMENT_INITIATION_FAILED'
      }
    }, 500)
  }
})

// POST /checkout/easypaisa/callback - Easypaisa webhook
checkoutRoutes.post('/easypaisa/callback', zValidator('json', easypaisaCallbackSchema), async (c) => {
  const { DB, EASYPAISA_MERCHANT_KEY } = c.env as Bindings
  const callbackData = c.req.valid('json')

  try {
    // Verify signature
    const signatureData = `${callbackData.transactionId}${callbackData.orderId}${callbackData.amount}${callbackData.status}`
    const isValidSignature = verifyHMAC(signatureData, callbackData.signature, EASYPAISA_MERCHANT_KEY)

    if (!isValidSignature) {
      console.error('Invalid Easypaisa signature')
      return c.json({
        success: false,
        error: {
          message: 'Invalid signature',
          code: 'INVALID_SIGNATURE'
        }
      }, 400)
    }

    // Get payment transaction
    const transaction = await db.queryOne(c, `
      SELECT pt.*, o.status as order_status
      FROM payment_transactions pt
      JOIN orders o ON pt.order_id = o.id
      WHERE pt.gateway_transaction_id = ?
    `, [callbackData.transactionId])

    if (!transaction) {
      return c.json({
        success: false,
        error: {
          message: 'Transaction not found',
          code: 'TRANSACTION_NOT_FOUND'
        }
      }, 404)
    }

    const now = new Date().toISOString()
    const isSuccess = callbackData.status === 'success'

    // Update payment transaction
    await db.execute(c, `
      UPDATE payment_transactions 
      SET status = ?, gateway_response = ?, updated_at = ?
      WHERE id = ?
    `, [
      isSuccess ? 'completed' : 'failed',
      JSON.stringify(callbackData),
      now,
      transaction.id
    ])

    // Update order payment status
    await db.execute(c, `
      UPDATE orders 
      SET payment_status = ?, status = ?, updated_at = ?
      WHERE id = ?
    `, [
      isSuccess ? 'paid' : 'failed',
      isSuccess ? 'confirmed' : transaction.order_status,
      now,
      transaction.order_id
    ])

    // Invalidate cache
    await kv.delete(c, `website:*:*`)

    return c.json({
      success: true,
      data: {
        transactionId: callbackData.transactionId,
        orderId: callbackData.orderId,
        status: isSuccess ? 'completed' : 'failed'
      }
    })

  } catch (error: any) {
    console.error('Easypaisa callback error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to process callback',
        code: 'CALLBACK_PROCESSING_FAILED'
      }
    }, 500)
  }
})

// POST /checkout/jazzcash/callback - JazzCash webhook
checkoutRoutes.post('/jazzcash/callback', zValidator('json', jazzcashCallbackSchema), async (c) => {
  const { DB, JAZZCASH_PASSWORD } = c.env as Bindings
  const callbackData = c.req.valid('json')

  try {
    // Verify signature
    const signatureData = `${callbackData.transactionId}${callbackData.orderId}${callbackData.amount}${callbackData.status}`
    const isValidSignature = verifyHMAC(signatureData, callbackData.signature, JAZZCASH_PASSWORD)

    if (!isValidSignature) {
      console.error('Invalid JazzCash signature')
      return c.json({
        success: false,
        error: {
          message: 'Invalid signature',
          code: 'INVALID_SIGNATURE'
        }
      }, 400)
    }

    // Get payment transaction
    const transaction = await db.queryOne(c, `
      SELECT pt.*, o.status as order_status
      FROM payment_transactions pt
      JOIN orders o ON pt.order_id = o.id
      WHERE pt.gateway_transaction_id = ?
    `, [callbackData.transactionId])

    if (!transaction) {
      return c.json({
        success: false,
        error: {
          message: 'Transaction not found',
          code: 'TRANSACTION_NOT_FOUND'
        }
      }, 404)
    }

    const now = new Date().toISOString()
    const isSuccess = callbackData.status === 'success'

    // Update payment transaction
    await db.execute(c, `
      UPDATE payment_transactions 
      SET status = ?, gateway_response = ?, updated_at = ?
      WHERE id = ?
    `, [
      isSuccess ? 'completed' : 'failed',
      JSON.stringify(callbackData),
      now,
      transaction.id
    ])

    // Update order payment status
    await db.execute(c, `
      UPDATE orders 
      SET payment_status = ?, status = ?, updated_at = ?
      WHERE id = ?
    `, [
      isSuccess ? 'paid' : 'failed',
      isSuccess ? 'confirmed' : transaction.order_status,
      now,
      transaction.order_id
    ])

    // Invalidate cache
    await kv.delete(c, `website:*:*`)

    return c.json({
      success: true,
      data: {
        transactionId: callbackData.transactionId,
        orderId: callbackData.orderId,
        status: isSuccess ? 'completed' : 'failed'
      }
    })

  } catch (error: any) {
    console.error('JazzCash callback error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to process callback',
        code: 'CALLBACK_PROCESSING_FAILED'
      }
    }, 500)
  }
})

// POST /checkout/cod/confirm - Confirm COD order
checkoutRoutes.post('/cod/confirm', zValidator('json', codConfirmSchema), async (c) => {
  const { DB } = c.env as Bindings
  const { orderId, confirmed } = c.req.valid('json')

  try {
    // Get order details
    const order = await db.queryOne(c, 'SELECT * FROM orders WHERE id = ?', [orderId])

    if (!order) {
      return c.json({
        success: false,
        error: {
          message: 'Order not found',
          code: 'ORDER_NOT_FOUND'
        }
      }, 404)
    }

    if (order.payment_method !== 'cod') {
      return c.json({
        success: false,
        error: {
          message: 'Order is not COD',
          code: 'INVALID_PAYMENT_METHOD'
        }
      }, 400)
    }

    const now = new Date().toISOString()

    if (confirmed) {
      // Confirm COD order
      await db.execute(c, `
        UPDATE orders 
        SET payment_status = 'paid', status = 'confirmed', updated_at = ?
        WHERE id = ?
      `, [now, orderId])

      // Update payment transaction if exists
      await db.execute(c, `
        UPDATE payment_transactions 
        SET status = 'completed', gateway_response = ?, updated_at = ?
        WHERE order_id = ?
      `, [JSON.stringify({ method: 'cod', confirmed: true }), now, orderId])

    } else {
      // Cancel COD order
      await db.execute(c, `
        UPDATE orders 
        SET payment_status = 'cancelled', status = 'cancelled', updated_at = ?
        WHERE id = ?
      `, [now, orderId])

      // Update payment transaction if exists
      await db.execute(c, `
        UPDATE payment_transactions 
        SET status = 'cancelled', gateway_response = ?, updated_at = ?
        WHERE order_id = ?
      `, [JSON.stringify({ method: 'cod', confirmed: false }), now, orderId])
    }

    // Invalidate cache
    await kv.delete(c, `website:${order.website_id}:*`)

    return c.json({
      success: true,
      data: {
        orderId,
        status: confirmed ? 'confirmed' : 'cancelled',
        paymentStatus: confirmed ? 'paid' : 'cancelled',
        updatedAt: now
      }
    })

  } catch (error: any) {
    console.error('COD confirm error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to confirm COD order',
        code: 'COD_CONFIRMATION_FAILED'
      }
    }, 500)
  }
})

// GET /checkout/:orderId/status - Check payment status
checkoutRoutes.get('/:orderId/status', async (c) => {
  const { DB } = c.env as Bindings
  const orderId = c.req.param('orderId')

  try {
    // Get order and payment status
    const order = await db.queryOne(c, `
      SELECT o.*, pt.status as payment_transaction_status, pt.gateway_response
      FROM orders o
      LEFT JOIN payment_transactions pt ON o.id = pt.order_id
      WHERE o.id = ?
    `, [orderId])

    if (!order) {
      return c.json({
        success: false,
        error: {
          message: 'Order not found',
          code: 'ORDER_NOT_FOUND'
        }
      }, 404)
    }

    return c.json({
      success: true,
      data: {
        orderId,
        status: order.status,
        paymentStatus: order.payment_status,
        paymentMethod: order.payment_method,
        amount: order.total_amount,
        currency: order.currency,
        transactionStatus: order.payment_transaction_status,
        gatewayResponse: order.gateway_response ? JSON.parse(order.gateway_response) : null,
        createdAt: order.created_at,
        updatedAt: order.updated_at
      }
    })

  } catch (error: any) {
    console.error('Get payment status error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to get payment status',
        code: 'PAYMENT_STATUS_FAILED'
      }
    }, 500)
  }
})

export default checkoutRoutes
