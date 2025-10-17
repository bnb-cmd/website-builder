'use client'

import React, { useState } from 'react'
import { CreditCard, Smartphone, Wallet, Shield, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PaymentMethodProps {
  methods: Array<{
    id: string
    name: string
    type: 'card' | 'mobile' | 'bank' | 'wallet' | 'cod'
    icon: string
    description?: string
    fees?: number
    processingTime?: string
    isPopular?: boolean
    isAvailable?: boolean
  }>
  selectedMethod?: string
  onSelectMethod: (methodId: string) => void
  showFees?: boolean
  showProcessingTime?: boolean
  showPopular?: boolean
  layout?: 'grid' | 'list' | 'cards'
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
  methods = [
    {
      id: 'jazzcash',
      name: 'JazzCash',
      type: 'mobile',
      icon: '📱',
      description: 'Pay with JazzCash mobile wallet',
      fees: 0,
      processingTime: 'Instant',
      isPopular: true,
      isAvailable: true
    },
    {
      id: 'easypaisa',
      name: 'EasyPaisa',
      type: 'mobile',
      icon: '💰',
      description: 'Pay with EasyPaisa mobile wallet',
      fees: 0,
      processingTime: 'Instant',
      isPopular: true,
      isAvailable: true
    },
    {
      id: 'credit-card',
      name: 'Credit/Debit Card',
      type: 'card',
      icon: '💳',
      description: 'Visa, Mastercard, American Express',
      fees: 2.5,
      processingTime: 'Instant',
      isAvailable: true
    },
    {
      id: 'bank-transfer',
      name: 'Bank Transfer',
      type: 'bank',
      icon: '🏦',
      description: 'Direct bank transfer',
      fees: 0,
      processingTime: '1-2 business days',
      isAvailable: true
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      type: 'cod',
      icon: '💵',
      description: 'Pay when your order arrives',
      fees: 50,
      processingTime: 'On delivery',
      isAvailable: true
    }
  ],
  selectedMethod,
  onSelectMethod,
  showFees = true,
  showProcessingTime = true,
  showPopular = true,
  layout = 'cards'
}) => {
  const getMethodIcon = (method: any) => {
    switch (method.type) {
      case 'card':
        return <CreditCard className="w-6 h-6" />
      case 'mobile':
        return <Smartphone className="w-6 h-6" />
      case 'bank':
        return <Shield className="w-6 h-6" />
      case 'wallet':
        return <Wallet className="w-6 h-6" />
      case 'cod':
        return <span className="text-2xl">💵</span>
      default:
        return <span className="text-2xl">{method.icon}</span>
    }
  }

  const formatFees = (fees: number) => {
    if (fees === 0) return 'Free'
    return `PKR ${fees}`
  }

  const PaymentCard = ({ method }: { method: any }) => (
    <div
      onClick={() => method.isAvailable && onSelectMethod(method.id)}
      className={cn(
        'relative p-4 border-2 rounded-lg cursor-pointer transition-all',
        selectedMethod === method.id
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300',
        !method.isAvailable && 'opacity-50 cursor-not-allowed'
      )}
    >
      {/* Popular Badge */}
      {showPopular && method.isPopular && (
        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
          Popular
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="text-blue-600">
          {getMethodIcon(method)}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{method.name}</h3>
          {method.description && (
            <p className="text-sm text-gray-600">{method.description}</p>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        {showFees && (
          <div className="flex justify-between">
            <span className="text-gray-600">Fees:</span>
            <span className={cn(
              'font-medium',
              method.fees === 0 ? 'text-green-600' : 'text-gray-900'
            )}>
              {formatFees(method.fees)}
            </span>
          </div>
        )}
        
        {showProcessingTime && (
          <div className="flex justify-between">
            <span className="text-gray-600">Processing:</span>
            <span className="font-medium text-gray-900">{method.processingTime}</span>
          </div>
        )}
      </div>

      {/* Selected Indicator */}
      {selectedMethod === method.id && (
        <div className="absolute top-4 right-4">
          <CheckCircle className="w-5 h-5 text-blue-600" />
        </div>
      )}
    </div>
  )

  const PaymentListItem = ({ method }: { method: any }) => (
    <div
      onClick={() => method.isAvailable && onSelectMethod(method.id)}
      className={cn(
        'flex items-center justify-between p-3 border rounded-lg cursor-pointer transition',
        selectedMethod === method.id
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300',
        !method.isAvailable && 'opacity-50 cursor-not-allowed'
      )}
    >
      <div className="flex items-center gap-3">
        <div className="text-blue-600">
          {getMethodIcon(method)}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{method.name}</h3>
          {method.description && (
            <p className="text-sm text-gray-600">{method.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {showFees && (
          <span className={cn(
            'text-sm font-medium',
            method.fees === 0 ? 'text-green-600' : 'text-gray-900'
          )}>
            {formatFees(method.fees)}
          </span>
        )}
        
        {showProcessingTime && (
          <span className="text-sm text-gray-600">{method.processingTime}</span>
        )}

        {selectedMethod === method.id && (
          <CheckCircle className="w-5 h-5 text-blue-600" />
        )}
      </div>
    </div>
  )

  if (layout === 'list') {
    return (
      <div className="space-y-3">
        {methods.map((method) => (
          <PaymentListItem key={method.id} method={method} />
        ))}
      </div>
    )
  }

  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {methods.map((method) => (
          <PaymentCard key={method.id} method={method} />
        ))}
      </div>
    )
  }

  // Cards layout (default)
  return (
    <div className="space-y-4">
      {methods.map((method) => (
        <PaymentCard key={method.id} method={method} />
      ))}
    </div>
  )
}

// Component configuration for editor
export const PaymentMethodConfig = {
  id: 'payment-method',
  name: 'Payment Method',
  description: 'Payment method selector with Pakistani payment options',
  category: 'ecommerce' as const,
  icon: 'credit-card',
  defaultProps: {
    methods: [
      {
        id: 'jazzcash',
        name: 'JazzCash',
        type: 'mobile',
        icon: '📱',
        description: 'Pay with JazzCash mobile wallet',
        fees: 0,
        processingTime: 'Instant',
        isPopular: true,
        isAvailable: true
      },
      {
        id: 'easypaisa',
        name: 'EasyPaisa',
        type: 'mobile',
        icon: '💰',
        description: 'Pay with EasyPaisa mobile wallet',
        fees: 0,
        processingTime: 'Instant',
        isPopular: true,
        isAvailable: true
      },
      {
        id: 'credit-card',
        name: 'Credit/Debit Card',
        type: 'card',
        icon: '💳',
        description: 'Visa, Mastercard, American Express',
        fees: 2.5,
        processingTime: 'Instant',
        isAvailable: true
      },
      {
        id: 'cod',
        name: 'Cash on Delivery',
        type: 'cod',
        icon: '💵',
        description: 'Pay when your order arrives',
        fees: 50,
        processingTime: 'On delivery',
        isAvailable: true
      }
    ],
    showFees: true,
    showProcessingTime: true,
    showPopular: true,
    layout: 'cards'
  },
  defaultSize: { width: 100, height: 300 },
  editableFields: [
    'methods',
    'showFees',
    'showProcessingTime',
    'showPopular',
    'layout'
  ]
}
