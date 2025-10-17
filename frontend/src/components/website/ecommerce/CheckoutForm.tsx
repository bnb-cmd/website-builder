'use client'

import React, { useState } from 'react'
import { MapPin, Phone, Mail, User, CreditCard, Lock, CheckCircle } from '@/lib/icons'
import { cn } from '@/lib/utils'

export interface CheckoutFormProps {
  onPlaceOrder: (orderData: any) => void
  onPaymentMethodChange: (method: string) => void
  paymentMethods: Array<{
    id: string
    name: string
    type: 'card' | 'mobile' | 'bank' | 'cod'
    icon: string
    description?: string
    fees?: number
  }>
  selectedPaymentMethod?: string
  showBillingAddress?: boolean
  showShippingAddress?: boolean
  showPaymentMethods?: boolean
  showOrderSummary?: boolean
  layout?: 'single' | 'multi-step' | 'sidebar'
  defaultShippingAddress?: {
    name: string
    address: string
    city: string
    phone: string
    email: string
  }
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  onPlaceOrder,
  onPaymentMethodChange,
  paymentMethods = [
    {
      id: 'jazzcash',
      name: 'JazzCash',
      type: 'mobile',
      icon: '📱',
      description: 'Pay with JazzCash mobile wallet',
      fees: 0
    },
    {
      id: 'easypaisa',
      name: 'EasyPaisa',
      type: 'mobile',
      icon: '💰',
      description: 'Pay with EasyPaisa mobile wallet',
      fees: 0
    },
    {
      id: 'credit-card',
      name: 'Credit/Debit Card',
      type: 'card',
      icon: '💳',
      description: 'Visa, Mastercard, American Express',
      fees: 2.5
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      type: 'cod',
      icon: '💵',
      description: 'Pay when your order arrives',
      fees: 50
    }
  ],
  selectedPaymentMethod,
  showBillingAddress = true,
  showShippingAddress = true,
  showPaymentMethods = true,
  showOrderSummary = true,
  layout = 'single',
  defaultShippingAddress = {
    name: 'Ahmed Ali',
    address: '123 Main Street, Block A',
    city: 'Karachi, Pakistan',
    phone: '+92 300 1234567',
    email: 'ahmed@example.com'
  }
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    shipping: defaultShippingAddress,
    billing: { ...defaultShippingAddress },
    paymentMethod: selectedPaymentMethod || 'jazzcash',
    sameAsShipping: true,
    cardDetails: {
      number: '',
      expiry: '',
      cvv: '',
      name: ''
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => {
      const sectionData = prev[section as keyof typeof prev] as Record<string, any> || {}
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: value
        }
      }
    })
  }

  const handleSameAsShippingChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      sameAsShipping: checked,
      billing: checked ? prev.shipping : prev.billing
    }))
  }

  const handlePaymentMethodChange = (methodId: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: methodId }))
    onPaymentMethodChange(methodId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await onPlaceOrder(formData)
    } catch (error) {
      console.error('Error placing order:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`
  }

  const AddressForm = ({ 
    title, 
    data, 
    onChange, 
    icon 
  }: { 
    title: string
    data: any
    onChange: (field: string, value: string) => void
    icon: React.ReactNode
  }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            value={data.address}
            onChange={(e) => onChange('address', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => onChange('city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
    </div>
  )

  const PaymentMethods = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
      </div>
      
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => handlePaymentMethodChange(method.id)}
            className={cn(
              'p-4 border-2 rounded-lg cursor-pointer transition',
              formData.paymentMethod === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{method.icon}</span>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{method.name}</h4>
                {method.description && (
                  <p className="text-sm text-gray-600">{method.description}</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {method.fees === 0 ? 'Free' : `PKR ${method.fees}`}
                </div>
                {formData.paymentMethod === method.id && (
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-1" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const OrderSummary = () => (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatPrice(15000)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (GST)</span>
          <span className="font-medium">{formatPrice(2550)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-green-600">Free</span>
        </div>
      </div>
      
      <div className="border-t pt-3 mb-4">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(17550)}</span>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Lock className="w-5 h-5" />
        {isSubmitting ? 'Processing...' : 'Place Order'}
      </button>
    </div>
  )

  if (layout === 'multi-step') {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              )}>
                {step}
              </div>
              {step < 3 && (
                <div className={cn(
                  'w-16 h-0.5 mx-2',
                  currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                )} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <div className="space-y-6">
              <AddressForm
                title="Shipping Address"
                data={formData.shipping}
                onChange={(field, value) => handleInputChange('shipping', field, value)}
                icon={<MapPin className="w-5 h-5 text-gray-600" />}
              />
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <PaymentMethods />
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Review Order
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <OrderSummary />
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    )
  }

  if (layout === 'sidebar') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {showShippingAddress && (
              <AddressForm
                title="Shipping Address"
                data={formData.shipping}
                onChange={(field, value) => handleInputChange('shipping', field, value)}
                icon={<MapPin className="w-5 h-5 text-gray-600" />}
              />
            )}

            {showBillingAddress && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Billing Address</h3>
                </div>
                
                <div className="mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.sameAsShipping}
                      onChange={(e) => handleSameAsShippingChange(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Same as shipping address</span>
                  </label>
                </div>

                {!formData.sameAsShipping && (
                  <AddressForm
                    title=""
                    data={formData.billing}
                    onChange={(field, value) => handleInputChange('billing', field, value)}
                    icon={null}
                  />
                )}
              </div>
            )}

            {showPaymentMethods && <PaymentMethods />}
          </form>
        </div>
        
        <div className="lg:col-span-1">
          {showOrderSummary && <OrderSummary />}
        </div>
      </div>
    )
  }

  // Single layout (default)
  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {showShippingAddress && (
          <AddressForm
            title="Shipping Address"
            data={formData.shipping}
            onChange={(field, value) => handleInputChange('shipping', field, value)}
            icon={<MapPin className="w-5 h-5 text-gray-600" />}
          />
        )}

        {showBillingAddress && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Billing Address</h3>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.sameAsShipping}
                  onChange={(e) => handleSameAsShippingChange(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Same as shipping address</span>
              </label>
            </div>

            {!formData.sameAsShipping && (
              <AddressForm
                title=""
                data={formData.billing}
                onChange={(field, value) => handleInputChange('billing', field, value)}
                icon={null}
              />
            )}
          </div>
        )}

        {showPaymentMethods && <PaymentMethods />}
        
        {showOrderSummary && <OrderSummary />}
      </form>
    </div>
  )
}

// Component configuration for editor
export const CheckoutFormConfig = {
  id: 'checkout-form',
  name: 'Checkout Form',
  description: 'Complete checkout form with Pakistani payment methods',
  category: 'ecommerce' as const,
  icon: 'credit-card',
  defaultProps: {
    paymentMethods: [
      {
        id: 'jazzcash',
        name: 'JazzCash',
        type: 'mobile',
        icon: '📱',
        description: 'Pay with JazzCash mobile wallet',
        fees: 0
      },
      {
        id: 'easypaisa',
        name: 'EasyPaisa',
        type: 'mobile',
        icon: '💰',
        description: 'Pay with EasyPaisa mobile wallet',
        fees: 0
      },
      {
        id: 'credit-card',
        name: 'Credit/Debit Card',
        type: 'card',
        icon: '💳',
        description: 'Visa, Mastercard, American Express',
        fees: 2.5
      },
      {
        id: 'cod',
        name: 'Cash on Delivery',
        type: 'cod',
        icon: '💵',
        description: 'Pay when your order arrives',
        fees: 50
      }
    ],
    showBillingAddress: true,
    showShippingAddress: true,
    showPaymentMethods: true,
    showOrderSummary: true,
    layout: 'single'
  },
  defaultSize: { width: 100, height: 800 },
  editableFields: [
    'paymentMethods',
    'showBillingAddress',
    'showShippingAddress',
    'showPaymentMethods',
    'showOrderSummary',
    'layout',
    'defaultShippingAddress'
  ]
}
