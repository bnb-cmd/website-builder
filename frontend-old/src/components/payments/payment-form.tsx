'use client'

import { useState } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CreditCard, Smartphone, Building, AlertCircle, Lock } from 'lucide-react'
import { PaymentMethod } from '@/types/ecommerce'

interface PaymentFormProps {
  amount: number
  currency: string
  paymentMethods: PaymentMethod[]
  onPaymentSuccess: (paymentResult: any) => void
  onPaymentError: (error: string) => void
  loading?: boolean
}

interface PaymentMethodCardProps {
  method: PaymentMethod
  isSelected: boolean
  onSelect: () => void
}

function PaymentMethodCard({ method, isSelected, onSelect }: PaymentMethodCardProps) {
  const getIcon = () => {
    switch (method.type) {
      case 'stripe':
        return <CreditCard className="h-5 w-5" />
      case 'jazzcash':
      case 'easypaisa':
        return <Smartphone className="h-5 w-5" />
      case 'bank_transfer':
        return <Building className="h-5 w-5" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${
        isSelected ? 'border-primary bg-primary/5' : 'border-border'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center space-x-3">
        <RadioGroupItem value={method.id} id={method.id} />
        <div className="flex items-center space-x-3 flex-1">
          <div className={`p-2 rounded ${isSelected ? 'bg-primary/10' : 'bg-muted'}`}>
            {getIcon()}
          </div>
          <div className="flex-1">
            <Label htmlFor={method.id} className="font-medium cursor-pointer">
              {method.name}
            </Label>
            <p className="text-sm text-muted-foreground">{method.description}</p>
          </div>
          {method.logo && (
            <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
              <span className="text-xs font-medium">{method.type.toUpperCase()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function PaymentForm({
  amount,
  currency,
  paymentMethods,
  onPaymentSuccess,
  onPaymentError,
  loading = false
}: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // JazzCash/EasyPaisa fields
  const [mobileNumber, setMobileNumber] = useState('')
  const [cnic, setCnic] = useState('')
  
  // Bank transfer fields
  const [accountNumber, setAccountNumber] = useState('')
  const [accountTitle, setAccountTitle] = useState('')

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError('Please select a payment method')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      switch (selectedMethod.type) {
        case 'stripe':
          await handleStripePayment()
          break
        case 'jazzcash':
          await handleJazzCashPayment()
          break
        case 'easypaisa':
          await handleEasyPaisaPayment()
          break
        case 'bank_transfer':
          await handleBankTransferPayment()
          break
        default:
          throw new Error('Unsupported payment method')
      }
    } catch (error: any) {
      setError(error.message || 'Payment failed')
      onPaymentError(error.message || 'Payment failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStripePayment = async () => {
    if (!stripe || !elements) {
      throw new Error('Stripe not loaded')
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      throw new Error('Card element not found')
    }

    // Create payment intent on backend
    const response = await fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        paymentMethod: 'stripe'
      })
    })

    const { clientSecret } = await response.json()

    // Confirm payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      }
    })

    if (result.error) {
      throw new Error(result.error.message)
    } else {
      onPaymentSuccess(result.paymentIntent)
    }
  }

  const handleJazzCashPayment = async () => {
    if (!mobileNumber) {
      throw new Error('Mobile number is required for JazzCash')
    }

    // Create JazzCash payment
    const response = await fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'PKR',
        paymentMethod: 'jazzcash',
        customerPhone: mobileNumber
      })
    })

    const result = await response.json()
    
    if (result.redirectUrl) {
      // Redirect to JazzCash
      window.location.href = result.redirectUrl
    } else {
      onPaymentSuccess(result)
    }
  }

  const handleEasyPaisaPayment = async () => {
    if (!mobileNumber) {
      throw new Error('Mobile number is required for EasyPaisa')
    }

    // Create EasyPaisa payment
    const response = await fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'PKR',
        paymentMethod: 'easypaisa',
        customerPhone: mobileNumber
      })
    })

    const result = await response.json()
    
    if (result.redirectUrl) {
      // Redirect to EasyPaisa
      window.location.href = result.redirectUrl
    } else {
      onPaymentSuccess(result)
    }
  }

  const handleBankTransferPayment = async () => {
    // Create bank transfer payment
    const response = await fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'PKR',
        paymentMethod: 'bank_transfer',
        accountNumber,
        accountTitle
      })
    })

    const result = await response.json()
    onPaymentSuccess(result)
  }

  const renderPaymentFields = () => {
    if (!selectedMethod) return null

    switch (selectedMethod.type) {
      case 'stripe':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Card Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 border rounded-lg">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                    },
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center">
                <Lock className="h-3 w-3 mr-1" />
                Your payment information is secure and encrypted
              </p>
            </CardContent>
          </Card>
        )

      case 'jazzcash':
      case 'easypaisa':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedMethod.name} Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mobileNumber">Mobile Number *</Label>
                <Input
                  id="mobileNumber"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="03001234567"
                  className="mt-1"
                />
              </div>
              <Alert>
                <Smartphone className="h-4 w-4" />
                <AlertDescription>
                  You will be redirected to {selectedMethod.name} to complete your payment.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )

      case 'bank_transfer':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bank Transfer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Building className="h-4 w-4" />
                <AlertDescription>
                  Transfer the amount to the following bank account and upload the receipt.
                </AlertDescription>
              </Alert>
              
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Bank Name:</span>
                    <p>HBL Bank</p>
                  </div>
                  <div>
                    <span className="font-medium">Account Number:</span>
                    <p>1234567890</p>
                  </div>
                  <div>
                    <span className="font-medium">Account Title:</span>
                    <p>Pakistan Website Builder</p>
                  </div>
                  <div>
                    <span className="font-medium">Branch Code:</span>
                    <p>1234</p>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="accountNumber">Your Account Number *</Label>
                <Input
                  id="accountNumber"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Your bank account number"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="accountTitle">Account Title *</Label>
                <Input
                  id="accountTitle"
                  value={accountTitle}
                  onChange={(e) => setAccountTitle(e.target.value)}
                  placeholder="Your account title"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedMethod?.id}
            onValueChange={(value) => {
              const method = paymentMethods.find(m => m.id === value)
              setSelectedMethod(method || null)
              setError(null)
            }}
          >
            <div className="space-y-3">
              {paymentMethods.filter(m => m.enabled).map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  method={method}
                  isSelected={selectedMethod?.id === method.id}
                  onSelect={() => {
                    setSelectedMethod(method)
                    setError(null)
                  }}
                />
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Fields */}
      {renderPaymentFields()}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Amount</span>
              <span className="font-semibold">
                {currency} {amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Payment Method</span>
              <span>{selectedMethod?.name || 'None selected'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Process Payment Button */}
      <Button
        onClick={handlePayment}
        disabled={!selectedMethod || isProcessing || loading}
        size="lg"
        className="w-full"
      >
        {isProcessing ? (
          'Processing Payment...'
        ) : (
          `Pay ${currency} ${amount.toLocaleString()}`
        )}
      </Button>

      {/* Security Notice */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground flex items-center justify-center">
          <Lock className="h-3 w-3 mr-1" />
          Payments are secured with 256-bit SSL encryption
        </p>
      </div>
    </div>
  )
}
