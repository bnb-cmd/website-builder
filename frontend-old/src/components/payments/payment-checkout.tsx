'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Loader2, 
  CreditCard, 
  Smartphone, 
  Building2, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Shield
} from 'lucide-react'

interface PaymentCheckoutProps {
  subscriptionId: string
  paymentGateway: string
  amount: number
  currency: string
  subscriptionName: string
  onSuccess: (paymentId: string) => void
  onCancel: () => void
}

export function PaymentCheckout({ 
  subscriptionId, 
  paymentGateway, 
  amount, 
  currency, 
  subscriptionName,
  onSuccess, 
  onCancel 
}: PaymentCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentData, setPaymentData] = useState({
    customerEmail: '',
    customerPhone: '',
    customerName: ''
  })
  const [paymentResult, setPaymentResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const formatPrice = (amount: number, currency: string) => {
    return `₨${amount.toLocaleString()}`
  }

  const getGatewayIcon = (gateway: string) => {
    switch (gateway) {
      case 'JAZZCASH':
      case 'EASYPAISA':
        return <Smartphone className="w-5 h-5" />
      case 'BANK_TRANSFER':
        return <Building2 className="w-5 h-5" />
      case 'STRIPE':
        return <CreditCard className="w-5 h-5" />
      default:
        return <CreditCard className="w-5 h-5" />
    }
  }

  const getGatewayName = (gateway: string) => {
    switch (gateway) {
      case 'JAZZCASH':
        return 'JazzCash'
      case 'EASYPAISA':
        return 'EasyPaisa'
      case 'BANK_TRANSFER':
        return 'Bank Transfer'
      case 'STRIPE':
        return 'Credit Card'
      default:
        return gateway
    }
  }

  const handlePayment = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/v1/subscriptions/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current-user-id', // This should come from auth context
          subscriptionId,
          paymentGateway,
          customerEmail: paymentData.customerEmail,
          customerPhone: paymentData.customerPhone
        })
      })

      const result = await response.json()

      if (result.success) {
        setPaymentResult(result.data)
        
        // If there's a redirect URL, redirect to payment gateway
        if (result.data.redirectUrl) {
          window.location.href = result.data.redirectUrl
        } else if (result.data.clientSecret) {
          // Handle Stripe payment
          handleStripePayment(result.data.clientSecret)
        }
      } else {
        setError(result.error || 'Payment failed')
      }
    } catch (error) {
      setError('Payment processing failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStripePayment = async (clientSecret: string) => {
    // This would integrate with Stripe Elements
    // For now, we'll just show a success message
    onSuccess('stripe-payment-id')
  }

  const renderPaymentForm = () => {
    switch (paymentGateway) {
      case 'JAZZCASH':
      case 'EASYPAISA':
        return (
          <div className="space-y-4">
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertDescription>
                You will be redirected to {getGatewayName(paymentGateway)} to complete your payment securely.
              </AlertDescription>
            </Alert>
            
            <div>
              <Label htmlFor="customerPhone">Mobile Number *</Label>
              <Input
                id="customerPhone"
                type="tel"
                value={paymentData.customerPhone}
                onChange={(e) => setPaymentData(prev => ({ ...prev, customerPhone: e.target.value }))}
                placeholder="+92 300 1234567"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="customerEmail">Email Address *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={paymentData.customerEmail}
                onChange={(e) => setPaymentData(prev => ({ ...prev, customerEmail: e.target.value }))}
                placeholder="your@email.com"
                className="mt-1"
              />
            </div>
          </div>
        )

      case 'BANK_TRANSFER':
        return (
          <div className="space-y-4">
            <Alert>
              <Building2 className="h-4 w-4" />
              <AlertDescription>
                Complete your payment by transferring the amount to our bank account. 
                You will receive confirmation once the payment is verified.
              </AlertDescription>
            </Alert>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Bank Transfer Details</h4>
              <div className="space-y-1 text-sm">
                <div><strong>Bank:</strong> HBL Bank</div>
                <div><strong>Account Title:</strong> Pakistan Website Builder</div>
                <div><strong>Account Number:</strong> 1234567890</div>
                <div><strong>Branch Code:</strong> 1234</div>
                <div><strong>Amount:</strong> {formatPrice(amount, currency)}</div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="customerEmail">Email Address *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={paymentData.customerEmail}
                onChange={(e) => setPaymentData(prev => ({ ...prev, customerEmail: e.target.value }))}
                placeholder="your@email.com"
                className="mt-1"
              />
            </div>
          </div>
        )

      case 'STRIPE':
        return (
          <div className="space-y-4">
            <Alert>
              <CreditCard className="h-4 w-4" />
              <AlertDescription>
                Enter your card details securely. We use Stripe for international card processing.
              </AlertDescription>
            </Alert>
            
            <div>
              <Label htmlFor="customerName">Cardholder Name *</Label>
              <Input
                id="customerName"
                value={paymentData.customerName}
                onChange={(e) => setPaymentData(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="John Doe"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="customerEmail">Email Address *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={paymentData.customerEmail}
                onChange={(e) => setPaymentData(prev => ({ ...prev, customerEmail: e.target.value }))}
                placeholder="your@email.com"
                className="mt-1"
              />
            </div>
            
            {/* Stripe Elements would go here */}
            <div className="p-4 border rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">
                Stripe Elements integration would be implemented here for card input.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    if (paymentGateway === 'BANK_TRANSFER') {
      return paymentData.customerEmail.trim() !== ''
    }
    return paymentData.customerEmail.trim() !== '' && 
           (paymentData.customerPhone.trim() !== '' || paymentData.customerName.trim() !== '')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Secure Payment</span>
          </CardTitle>
          <CardDescription>
            Complete your subscription upgrade with secure payment processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <div className="font-medium">{subscriptionName}</div>
              <div className="text-sm text-gray-600">Monthly Subscription</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatPrice(amount, currency)}</div>
              <div className="text-sm text-gray-600">per month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {getGatewayIcon(paymentGateway)}
            <span>Payment Method</span>
          </CardTitle>
          <CardDescription>
            Paying with {getGatewayName(paymentGateway)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderPaymentForm()}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800">Secure Payment</h4>
              <p className="text-sm text-green-700 mt-1">
                Your payment information is encrypted and secure. We never store your payment details.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Plans
        </Button>
        
        <Button 
          onClick={handlePayment} 
          disabled={!canProceed() || isLoading}
          className="min-w-[150px]"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4 mr-2" />
          )}
          {isLoading ? 'Processing...' : `Pay ${formatPrice(amount, currency)}`}
        </Button>
      </div>

      {/* Payment Gateway Logos */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">Secured by</p>
        <div className="flex justify-center space-x-4">
          {paymentGateway === 'JAZZCASH' && (
            <Badge variant="outline" className="px-3 py-1">
              JazzCash
            </Badge>
          )}
          {paymentGateway === 'EASYPAISA' && (
            <Badge variant="outline" className="px-3 py-1">
              EasyPaisa
            </Badge>
          )}
          {paymentGateway === 'STRIPE' && (
            <Badge variant="outline" className="px-3 py-1">
              Stripe
            </Badge>
          )}
          <Badge variant="outline" className="px-3 py-1">
            SSL Encrypted
          </Badge>
        </div>
      </div>
    </div>
  )
}
