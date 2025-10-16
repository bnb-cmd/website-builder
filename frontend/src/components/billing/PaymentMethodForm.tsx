"use client";

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Banknote,
  Smartphone
} from 'lucide-react'
import { toast } from 'sonner'

interface PaymentMethod {
  id: string
  type: 'card' | 'bank' | 'mobile'
  last4?: string
  brand?: string
  name?: string
  isDefault: boolean
}

interface PaymentMethodFormProps {
  onAddMethod?: (method: any) => void
  onRemoveMethod?: (methodId: string) => void
  onSetDefault?: (methodId: string) => void
}

export function PaymentMethodForm({ 
  onAddMethod, 
  onRemoveMethod, 
  onSetDefault 
}: PaymentMethodFormProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [paymentType, setPaymentType] = useState<'card' | 'bank' | 'mobile'>('card')
  const [loading, setLoading] = useState(false)

  // Mock payment methods - replace with actual data from API
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      name: 'John Doe',
      isDefault: true
    }
  ])

  const handleAddMethod = async (formData: any) => {
    try {
      setLoading(true)
      
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Payment method added successfully')
      setShowAddForm(false)
      onAddMethod?.(formData)
    } catch (error) {
      toast.error('Failed to add payment method')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMethod = async (methodId: string) => {
    try {
      setLoading(true)
      
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast.success('Payment method removed')
      onRemoveMethod?.(methodId)
    } catch (error) {
      toast.error('Failed to remove payment method')
    } finally {
      setLoading(false)
    }
  }

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'card': return <CreditCard className="h-5 w-5" />
      case 'bank': return <Banknote className="h-5 w-5" />
      case 'mobile': return <Smartphone className="h-5 w-5" />
      default: return <CreditCard className="h-5 w-5" />
    }
  }

  const getPaymentTypeName = (type: string) => {
    switch (type) {
      case 'card': return 'Credit/Debit Card'
      case 'bank': return 'Bank Transfer'
      case 'mobile': return 'Mobile Payment'
      default: return 'Payment Method'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Methods
        </CardTitle>
        <CardDescription>
          Manage your payment methods for subscriptions and purchases
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Payment Methods */}
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  {getPaymentIcon(method.type)}
                </div>
                <div>
                  <div className="font-medium">
                    {getPaymentTypeName(method.type)}
                    {method.isDefault && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {method.type === 'card' && method.brand && method.last4 && (
                      `${method.brand} •••• ${method.last4}`
                    )}
                    {method.type === 'bank' && 'Bank Account'}
                    {method.type === 'mobile' && 'Mobile Wallet'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!method.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSetDefault?.(method.id)}
                  >
                    Set Default
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveMethod(method.id)}
                  disabled={method.isDefault}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Add New Payment Method */}
        {!showAddForm ? (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        ) : (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-lg">Add Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="payment-type">Payment Type</Label>
                <Select value={paymentType} onValueChange={(value: any) => setPaymentType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="mobile">Mobile Payment (JazzCash/EasyPaisa)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentType === 'card' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input 
                      id="card-number" 
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" maxLength={4} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="card-name">Cardholder Name</Label>
                    <Input id="card-name" placeholder="John Doe" />
                  </div>
                </div>
              )}

              {paymentType === 'bank' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bank-name">Bank Name</Label>
                    <Input id="bank-name" placeholder="HBL Bank" />
                  </div>
                  <div>
                    <Label htmlFor="account-number">Account Number</Label>
                    <Input id="account-number" placeholder="1234567890" />
                  </div>
                  <div>
                    <Label htmlFor="account-title">Account Title</Label>
                    <Input id="account-title" placeholder="John Doe" />
                  </div>
                </div>
              )}

              {paymentType === 'mobile' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mobile-provider">Mobile Provider</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jazzcash">JazzCash</SelectItem>
                        <SelectItem value="easypaisa">EasyPaisa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="mobile-number">Mobile Number</Label>
                    <Input id="mobile-number" placeholder="+92 300 1234567" />
                  </div>
                </div>
              )}

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Your payment information is encrypted and secure. We never store your full card details.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => handleAddMethod({ type: paymentType })}
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Payment Method'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Notice */}
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            All payments are processed securely using industry-standard encryption. 
            Your payment information is never stored on our servers.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
