import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { initDB, initKV, cacheKeys, cacheTTL } from '../lib'
import type { Env } from '../index'

const app = new Hono<{ Bindings: Env }>()

// Apply auth middleware to all routes
app.use('*', authMiddleware)

// Process payment
app.post('/process', async (c) => {
  const user = c.get('user')
  const body = await c.req.json()
  const { amount, currency, payment_method, website_id, purpose, description } = body

  if (!amount || !currency || !payment_method) {
    return c.json({ error: 'Amount, currency, and payment method are required' }, 400)
  }

  const db = initDB(c.env)

  // Verify website ownership if provided
  if (website_id) {
    const websites = await db.query(
      'SELECT id FROM websites WHERE id = ? AND user_id = ?',
      [website_id, user.id]
    )

    if (websites.length === 0) {
      return c.json({ error: 'Website not found or access denied' }, 404)
    }
  }

  const paymentId = crypto.randomUUID()
  const now = new Date().toISOString()

  try {
    // Process payment based on method
    let gatewayResponse = {}
    let gatewayId = ''

    if (payment_method === 'STRIPE') {
      // Stripe payment processing
      const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${c.env.STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          amount: (amount * 100).toString(), // Convert to cents
          currency: currency.toLowerCase(),
          'metadata[user_id]': user.id,
          'metadata[website_id]': website_id || '',
          'metadata[purpose]': purpose || 'PLATFORM_SUBSCRIPTION'
        })
      })

      const stripeData = await stripeResponse.json()
      gatewayResponse = stripeData
      gatewayId = stripeData.id
    } else if (payment_method === 'JAZZCASH') {
      // JazzCash payment processing (simplified)
      gatewayResponse = { status: 'pending', method: 'jazzcash' }
      gatewayId = `jazzcash_${Date.now()}`
    } else if (payment_method === 'EASYPAISA') {
      // EasyPaisa payment processing (simplified)
      gatewayResponse = { status: 'pending', method: 'easypaisa' }
      gatewayId = `easypaisa_${Date.now()}`
    }

    // Save payment record
    await db.execute(
      'INSERT INTO payments (id, user_id, website_id, purpose, amount, currency, status, gateway, gateway_id, gateway_data, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [paymentId, user.id, website_id, purpose || 'PLATFORM_SUBSCRIPTION', amount, currency, 'PENDING', payment_method, gatewayId, JSON.stringify(gatewayResponse), description, now, now]
    )

    return c.json({
      success: true,
      data: {
        id: paymentId,
        amount,
        currency,
        status: 'PENDING',
        gateway: payment_method,
        gatewayId,
        gatewayResponse,
        createdAt: now
      }
    })
  } catch (error) {
    console.error('Payment processing error:', error)
    return c.json({ error: 'Payment processing failed' }, 500)
  }
})

// Get payment history
app.get('/history', async (c) => {
  const user = c.get('user')
  const db = initDB(c.env)

  const payments = await db.query(
    'SELECT id, website_id, purpose, amount, currency, status, gateway, gateway_id, description, created_at FROM payments WHERE user_id = ? ORDER BY created_at DESC',
    [user.id]
  )

  return c.json({ success: true, data: payments })
})

// Get payment status
app.get('/:id/status', async (c) => {
  const user = c.get('user')
  const paymentId = c.req.param('id')
  const db = initDB(c.env)

  const payments = await db.query(
    'SELECT * FROM payments WHERE id = ? AND user_id = ?',
    [paymentId, user.id]
  )

  if (payments.length === 0) {
    return c.json({ error: 'Payment not found or access denied' }, 404)
  }

  const payment = payments[0]

  // Check status with gateway if needed
  if (payment.gateway === 'STRIPE' && payment.status === 'PENDING') {
    try {
      const stripeResponse = await fetch(`https://api.stripe.com/v1/payment_intents/${payment.gateway_id}`, {
        headers: {
          'Authorization': `Bearer ${c.env.STRIPE_SECRET_KEY}`
        }
      })

      const stripeData = await stripeResponse.json()
      
      if (stripeData.status !== payment.status) {
        // Update payment status
        await db.execute(
          'UPDATE payments SET status = ?, gateway_data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [stripeData.status.toUpperCase(), JSON.stringify(stripeData), paymentId]
        )
        
        payment.status = stripeData.status.toUpperCase()
        payment.gateway_data = JSON.stringify(stripeData)
      }
    } catch (error) {
      console.error('Status check error:', error)
    }
  }

  return c.json({ success: true, data: payment })
})

export default app
