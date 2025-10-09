import Stripe from 'stripe'
import { PaymentGateway, PaymentStatus, Prisma } from '@prisma/client'
import { BaseService } from './baseService'
import { paymentConfig } from '@/config/environment'
import { OrderService } from './orderService'

export interface CreatePaymentIntentData {
  amount: number
  currency: string
  orderId: string
  customerEmail: string
  gateway: PaymentGateway
  metadata?: Record<string, string>
}

export interface PaymentResult {
  success: boolean
  paymentId?: string
  clientSecret?: string
  redirectUrl?: string
  error?: string
  gatewayResponse?: any
}

export interface JazzCashPaymentData {
  merchantId: string
  password: string
  amount: number
  orderId: string
  returnUrl: string
  cancelUrl: string
  customerEmail: string
  customerPhone?: string
}

export interface EasyPaisaPaymentData {
  merchantId: string
  password: string
  amount: number
  orderId: string
  returnUrl: string
  cancelUrl: string
  customerEmail: string
  customerPhone?: string
}

export class PaymentService extends BaseService<any> {
  private stripe: Stripe
  private orderService: OrderService

  constructor() {
    super()
    this.stripe = new Stripe(paymentConfig.stripe.secretKey)
    this.orderService = new OrderService()
  }

  protected getModelName(): string {
    return 'payment'
  }

  // Base methods (required by BaseService)
  async create(data: any): Promise<any> {
    return await this.prisma.payment.create({ data })
  }

  async findById(id: string): Promise<any> {
    return await this.prisma.payment.findUnique({ where: { id } })
  }

  async findAll(filters?: any): Promise<any[]> {
    return await this.prisma.payment.findMany({ where: filters })
  }

  async update(id: string, data: any): Promise<any> {
    return await this.prisma.payment.update({ where: { id }, data })
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.payment.delete({ where: { id } })
    return true
  }

  // Payment Intent Creation
  async createPaymentIntent(data: CreatePaymentIntentData): Promise<PaymentResult> {
    try {
      const { amount, currency, orderId, customerEmail, gateway, metadata } = data

      switch (gateway) {
        case PaymentGateway.STRIPE:
          return await this.createStripePaymentIntent({
            amount,
            currency,
            orderId,
            customerEmail,
            metadata
          })

        case PaymentGateway.JAZZCASH:
          return await this.createJazzCashPayment({
            merchantId: paymentConfig.jazzcash.merchantId,
            password: paymentConfig.jazzcash.password,
            amount,
            orderId,
            returnUrl: paymentConfig.jazzcash.returnUrl,
            cancelUrl: paymentConfig.jazzcash.cancelUrl,
            customerEmail
          })

        case PaymentGateway.EASYPAISA:
          return await this.createEasyPaisaPayment({
            merchantId: paymentConfig.easypaisa.merchantId,
            password: paymentConfig.easypaisa.password,
            amount,
            orderId,
            returnUrl: paymentConfig.easypaisa.returnUrl,
            cancelUrl: paymentConfig.easypaisa.cancelUrl,
            customerEmail
          })

        case PaymentGateway.BANK_TRANSFER:
          return await this.createBankTransferPayment({
            amount,
            currency,
            orderId,
            customerEmail
          })

        default:
          throw new Error(`Unsupported payment gateway: ${gateway}`)
      }
    } catch (error) {
      console.error('Payment intent creation failed:', error)
      return {
        success: false,
        error: error.message || 'Payment intent creation failed'
      }
    }
  }

  // Stripe Payment Integration
  private async createStripePaymentIntent(data: {
    amount: number
    currency: string
    orderId: string
    customerEmail: string
    metadata?: Record<string, string>
  }): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency.toLowerCase(),
        metadata: {
          orderId: data.orderId,
          customerEmail: data.customerEmail,
          ...data.metadata
        },
        automatic_payment_methods: {
          enabled: true
        }
      })

      // Save payment record
      await this.create({
        gateway: PaymentGateway.STRIPE,
        gatewayId: paymentIntent.id,
        amount: data.amount,
        currency: data.currency,
        status: PaymentStatus.PENDING,
        gatewayData: paymentIntent,
        userId: null // Will be set when order is linked
      })

      return {
        success: true,
        paymentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        gatewayResponse: paymentIntent
      }
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error)
      throw error
    }
  }

  // JazzCash Payment Integration
  private async createJazzCashPayment(data: JazzCashPaymentData): Promise<PaymentResult> {
    try {
      // JazzCash integration would go here
      // This is a mock implementation - you would integrate with actual JazzCash API
      
      const transactionId = `JC${Date.now()}`
      const redirectUrl = `https://sandbox.jazzcash.com.pk/ApplicationAPI/API/Payment/DoTransaction?pp_TxnRefNo=${transactionId}`

      // Save payment record
      await this.create({
        gateway: PaymentGateway.JAZZCASH,
        gatewayId: transactionId,
        amount: data.amount,
        currency: 'PKR',
        status: PaymentStatus.PENDING,
        gatewayData: {
          merchantId: data.merchantId,
          transactionId,
          amount: data.amount,
          orderId: data.orderId,
          customerEmail: data.customerEmail,
          returnUrl: data.returnUrl,
          cancelUrl: data.cancelUrl
        },
        userId: null
      })

      return {
        success: true,
        paymentId: transactionId,
        redirectUrl,
        gatewayResponse: {
          transactionId,
          redirectUrl
        }
      }
    } catch (error) {
      console.error('JazzCash payment creation failed:', error)
      throw error
    }
  }

  // EasyPaisa Payment Integration
  private async createEasyPaisaPayment(data: EasyPaisaPaymentData): Promise<PaymentResult> {
    try {
      // EasyPaisa integration would go here
      // This is a mock implementation - you would integrate with actual EasyPaisa API
      
      const transactionId = `EP${Date.now()}`
      const redirectUrl = `https://easypaisa.com.pk/easypay/Index.jsf?storeId=${data.merchantId}&transactionId=${transactionId}`

      // Save payment record
      await this.create({
        gateway: PaymentGateway.EASYPAISA,
        gatewayId: transactionId,
        amount: data.amount,
        currency: 'PKR',
        status: PaymentStatus.PENDING,
        gatewayData: {
          merchantId: data.merchantId,
          transactionId,
          amount: data.amount,
          orderId: data.orderId,
          customerEmail: data.customerEmail,
          returnUrl: data.returnUrl,
          cancelUrl: data.cancelUrl
        },
        userId: null
      })

      return {
        success: true,
        paymentId: transactionId,
        redirectUrl,
        gatewayResponse: {
          transactionId,
          redirectUrl
        }
      }
    } catch (error) {
      console.error('EasyPaisa payment creation failed:', error)
      throw error
    }
  }

  // Bank Transfer Payment
  private async createBankTransferPayment(data: {
    amount: number
    currency: string
    orderId: string
    customerEmail: string
  }): Promise<PaymentResult> {
    try {
      const transactionId = `BT${Date.now()}`

      // Save payment record
      await this.create({
        gateway: PaymentGateway.BANK_TRANSFER,
        gatewayId: transactionId,
        amount: data.amount,
        currency: data.currency,
        status: PaymentStatus.PENDING,
        gatewayData: {
          transactionId,
          orderId: data.orderId,
          customerEmail: data.customerEmail,
          bankDetails: {
            bankName: 'HBL Bank',
            accountNumber: '1234567890',
            accountTitle: 'Pakistan Website Builder',
            branchCode: '1234'
          }
        },
        userId: null
      })

      return {
        success: true,
        paymentId: transactionId,
        gatewayResponse: {
          transactionId,
          bankDetails: {
            bankName: 'HBL Bank',
            accountNumber: '1234567890',
            accountTitle: 'Pakistan Website Builder',
            branchCode: '1234',
            instructions: 'Please transfer the amount and share the transaction receipt'
          }
        }
      }
    } catch (error) {
      console.error('Bank transfer payment creation failed:', error)
      throw error
    }
  }

  // Payment Confirmation
  async confirmPayment(paymentId: string, gatewayData?: any): Promise<PaymentResult> {
    try {
      const payment = await this.findById(paymentId)
      if (!payment) {
        throw new Error('Payment not found')
      }

      let success = false
      let updatedGatewayData = payment.gatewayData

      switch (payment.gateway) {
        case PaymentGateway.STRIPE:
          success = await this.confirmStripePayment(payment.gatewayId, gatewayData)
          break

        case PaymentGateway.JAZZCASH:
          success = await this.confirmJazzCashPayment(payment.gatewayId, gatewayData)
          updatedGatewayData = { ...payment.gatewayData, ...gatewayData }
          break

        case PaymentGateway.EASYPAISA:
          success = await this.confirmEasyPaisaPayment(payment.gatewayId, gatewayData)
          updatedGatewayData = { ...payment.gatewayData, ...gatewayData }
          break

        case PaymentGateway.BANK_TRANSFER:
          success = true // Manual confirmation required
          updatedGatewayData = { ...payment.gatewayData, ...gatewayData }
          break

        default:
          throw new Error(`Unsupported payment gateway: ${payment.gateway}`)
      }

      // Update payment status
      const newStatus = success ? PaymentStatus.COMPLETED : PaymentStatus.FAILED
      await this.update(paymentId, {
        status: newStatus,
        gatewayData: updatedGatewayData
      })

      // Update order status if payment is successful
      if (success && payment.gatewayData?.orderId) {
        await this.orderService.updatePaymentStatus(
          payment.gatewayData.orderId,
          newStatus,
          paymentId
        )
      }

      return {
        success,
        paymentId,
        gatewayResponse: updatedGatewayData
      }
    } catch (error) {
      console.error('Payment confirmation failed:', error)
      return {
        success: false,
        error: error.message || 'Payment confirmation failed'
      }
    }
  }

  // Gateway-specific confirmation methods
  private async confirmStripePayment(paymentIntentId: string, gatewayData?: any): Promise<boolean> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId)
      return paymentIntent.status === 'succeeded'
    } catch (error) {
      console.error('Stripe payment confirmation failed:', error)
      return false
    }
  }

  private async confirmJazzCashPayment(transactionId: string, gatewayData?: any): Promise<boolean> {
    try {
      // JazzCash payment confirmation logic would go here
      // This is a mock implementation
      
      // In real implementation, you would:
      // 1. Call JazzCash API to verify transaction status
      // 2. Verify the response signature
      // 3. Check transaction amount and other details
      
      const isValid = gatewayData?.status === 'success' && gatewayData?.transactionId === transactionId
      return isValid
    } catch (error) {
      console.error('JazzCash payment confirmation failed:', error)
      return false
    }
  }

  private async confirmEasyPaisaPayment(transactionId: string, gatewayData?: any): Promise<boolean> {
    try {
      // EasyPaisa payment confirmation logic would go here
      // This is a mock implementation
      
      const isValid = gatewayData?.status === 'success' && gatewayData?.transactionId === transactionId
      return isValid
    } catch (error) {
      console.error('EasyPaisa payment confirmation failed:', error)
      return false
    }
  }

  // Webhook Handlers
  async handleStripeWebhook(payload: string, signature: string): Promise<void> {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        paymentConfig.stripe.webhookSecret
      )

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handleStripePaymentSuccess(event.data.object as Stripe.PaymentIntent)
          break

        case 'payment_intent.payment_failed':
          await this.handleStripePaymentFailed(event.data.object as Stripe.PaymentIntent)
          break

        default:
          console.log(`Unhandled Stripe event type: ${event.type}`)
      }
    } catch (error) {
      console.error('Stripe webhook handling failed:', error)
      throw error
    }
  }

  private async handleStripePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const payment = await this.prisma.payment.findFirst({
      where: { gatewayId: paymentIntent.id }
    })

    if (payment) {
      await this.confirmPayment(payment.id, { status: 'succeeded' })
    }
  }

  private async handleStripePaymentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const payment = await this.prisma.payment.findFirst({
      where: { gatewayId: paymentIntent.id }
    })

    if (payment) {
      await this.update(payment.id, { status: PaymentStatus.FAILED })
    }
  }

  // Refund Processing
  async processRefund(paymentId: string, amount?: number, reason?: string): Promise<PaymentResult> {
    try {
      const payment = await this.findById(paymentId)
      if (!payment) {
        throw new Error('Payment not found')
      }

      if (payment.status !== PaymentStatus.COMPLETED) {
        throw new Error('Cannot refund incomplete payment')
      }

      let refundResult: any = {}

      switch (payment.gateway) {
        case PaymentGateway.STRIPE:
          refundResult = await this.processStripeRefund(payment.gatewayId, amount, reason)
          break

        case PaymentGateway.JAZZCASH:
        case PaymentGateway.EASYPAISA:
        case PaymentGateway.BANK_TRANSFER:
          // These require manual processing
          refundResult = {
            id: `refund_${Date.now()}`,
            status: 'pending',
            amount: amount || payment.amount
          }
          break

        default:
          throw new Error(`Refunds not supported for gateway: ${payment.gateway}`)
      }

      // Update payment status
      await this.update(paymentId, {
        status: PaymentStatus.REFUNDED,
        gatewayData: {
          ...payment.gatewayData,
          refund: refundResult
        }
      })

      return {
        success: true,
        paymentId,
        gatewayResponse: refundResult
      }
    } catch (error) {
      console.error('Refund processing failed:', error)
      return {
        success: false,
        error: error.message || 'Refund processing failed'
      }
    }
  }

  private async processStripeRefund(paymentIntentId: string, amount?: number, reason?: string): Promise<any> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents
        reason: reason as any
      })

      return refund
    } catch (error) {
      console.error('Stripe refund failed:', error)
      throw error
    }
  }

  // Payment Analytics
  async getPaymentStats(websiteId?: string, dateRange?: { from: Date; to: Date }): Promise<{
    totalPayments: number
    totalRevenue: number
    successfulPayments: number
    failedPayments: number
    refundedPayments: number
    paymentsByGateway: Record<string, { count: number; revenue: number }>
  }> {
    try {
      const whereClause: any = {}
      if (websiteId) {
        // Filter by website through orders
        whereClause.gatewayData = {
          path: ['orderId'],
          not: null
        }
      }
      if (dateRange) {
        whereClause.createdAt = {
          gte: dateRange.from,
          lte: dateRange.to
        }
      }

      const [
        totalPayments,
        successfulPayments,
        failedPayments,
        refundedPayments,
        revenueStats,
        gatewayStats
      ] = await Promise.all([
        this.prisma.payment.count({ where: whereClause }),
        this.prisma.payment.count({ 
          where: { ...whereClause, status: PaymentStatus.COMPLETED } 
        }),
        this.prisma.payment.count({ 
          where: { ...whereClause, status: PaymentStatus.FAILED } 
        }),
        this.prisma.payment.count({ 
          where: { ...whereClause, status: PaymentStatus.REFUNDED } 
        }),
        this.prisma.payment.aggregate({
          where: { ...whereClause, status: PaymentStatus.COMPLETED },
          _sum: { amount: true }
        }),
        this.prisma.payment.groupBy({
          by: ['gateway'],
          where: { ...whereClause, status: PaymentStatus.COMPLETED },
          _count: { gateway: true },
          _sum: { amount: true }
        })
      ])

      const paymentsByGateway = gatewayStats.reduce((acc, stat) => {
        acc[stat.gateway] = {
          count: stat._count.gateway,
          revenue: stat._sum.amount?.toNumber() || 0
        }
        return acc
      }, {} as Record<string, { count: number; revenue: number }>)

      return {
        totalPayments,
        totalRevenue: revenueStats._sum.amount?.toNumber() || 0,
        successfulPayments,
        failedPayments,
        refundedPayments,
        paymentsByGateway
      }
    } catch (error) {
      this.handleError(error)
    }
  }

  // Required abstract methods from BaseService
  override async create(data: any): Promise<any> {
    return this.prisma.payment.create({ data })
  }
  
  override async findById(id: string): Promise<any | null> {
    return this.prisma.payment.findUnique({ where: { id } })
  }
  
  override async findAll(filters?: any): Promise<any[]> {
    return this.prisma.payment.findMany({ where: filters })
  }
  
  override async update(id: string, data: Partial<any>): Promise<any> {
    return this.prisma.payment.update({ where: { id }, data })
  }
  
  override async delete(id: string): Promise<boolean> {
    await this.prisma.payment.delete({ where: { id } })
    return true
  }
}
