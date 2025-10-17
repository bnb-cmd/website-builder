'use client'

import React, { useState } from 'react'
import { MapPin, Phone, Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface OrderTrackingProps {
  order: {
    id: string
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    orderDate: string
    estimatedDelivery?: string
    trackingNumber?: string
    carrier?: string
    items: Array<{
      id: string
      name: string
      quantity: number
      price: number
    }>
    total: number
    shippingAddress: {
      name: string
      address: string
      city: string
      phone: string
    }
  }
  trackingSteps?: Array<{
    id: string
    title: string
    description: string
    status: 'completed' | 'current' | 'pending'
    date?: string
    time?: string
  }>
  showTrackingNumber?: boolean
  showCarrier?: boolean
  showEstimatedDelivery?: boolean
  showItems?: boolean
  showAddress?: boolean
  layout?: 'timeline' | 'status' | 'detailed'
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({
  order = {
    id: 'ORD-2024-001',
    status: 'shipped',
    orderDate: '2024-01-15',
    estimatedDelivery: '2024-01-20',
    trackingNumber: 'TRK123456789',
    carrier: 'TCS',
    items: [
      { id: '1', name: 'Wireless Headphones', quantity: 1, price: 15000 },
      { id: '2', name: 'Phone Case', quantity: 2, price: 2000 }
    ],
    total: 19000,
    shippingAddress: {
      name: 'Ahmed Ali',
      address: '123 Main Street, Block A',
      city: 'Karachi, Pakistan',
      phone: '+92 300 1234567'
    }
  },
  trackingSteps = [
    {
      id: 'order-placed',
      title: 'Order Placed',
      description: 'Your order has been placed successfully',
      status: 'completed',
      date: '2024-01-15',
      time: '10:30 AM'
    },
    {
      id: 'confirmed',
      title: 'Order Confirmed',
      description: 'Payment confirmed and order is being processed',
      status: 'completed',
      date: '2024-01-15',
      time: '11:15 AM'
    },
    {
      id: 'processing',
      title: 'Processing',
      description: 'Your order is being prepared for shipment',
      status: 'completed',
      date: '2024-01-16',
      time: '09:00 AM'
    },
    {
      id: 'shipped',
      title: 'Shipped',
      description: 'Your order has been shipped',
      status: 'current',
      date: '2024-01-17',
      time: '02:30 PM'
    },
    {
      id: 'delivered',
      title: 'Delivered',
      description: 'Your order has been delivered',
      status: 'pending'
    }
  ],
  showTrackingNumber = true,
  showCarrier = true,
  showEstimatedDelivery = true,
  showItems = true,
  showAddress = true,
  layout = 'timeline'
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'current':
        return 'text-blue-600 bg-blue-100'
      case 'pending':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5" />
      case 'current':
        return <AlertCircle className="w-5 h-5" />
      case 'pending':
        return <Clock className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const TimelineView = () => (
    <div className="space-y-6">
      {/* Order Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order #{order.id}</h2>
            <p className="text-gray-600">Placed on {formatDate(order.orderDate)}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{formatPrice(order.total)}</div>
            <div className={cn(
              'px-3 py-1 rounded-full text-sm font-medium capitalize',
              getStatusColor(order.status)
            )}>
              {order.status}
            </div>
          </div>
        </div>

        {/* Tracking Info */}
        {(showTrackingNumber || showCarrier || showEstimatedDelivery) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {showTrackingNumber && order.trackingNumber && (
              <div>
                <label className="text-sm font-medium text-gray-700">Tracking Number</label>
                <p className="text-gray-900 font-mono">{order.trackingNumber}</p>
              </div>
            )}
            {showCarrier && order.carrier && (
              <div>
                <label className="text-sm font-medium text-gray-700">Carrier</label>
                <p className="text-gray-900">{order.carrier}</p>
              </div>
            )}
            {showEstimatedDelivery && order.estimatedDelivery && (
              <div>
                <label className="text-sm font-medium text-gray-700">Estimated Delivery</label>
                <p className="text-gray-900">{formatDate(order.estimatedDelivery)}</p>
              </div>
            )}
          </div>
        )}

        {/* Items */}
        {showItems && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <span className="font-medium text-gray-900">{item.name}</span>
                    <span className="text-gray-600 ml-2">× {item.quantity}</span>
                  </div>
                  <span className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shipping Address */}
        {showAddress && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                  <p className="text-gray-700">{order.shippingAddress.address}</p>
                  <p className="text-gray-700">{order.shippingAddress.city}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">{order.shippingAddress.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-6">Order Progress</h3>
        <div className="space-y-4">
          {trackingSteps.map((step, index) => (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  getStatusColor(step.status)
                )}>
                  {getStatusIcon(step.status)}
                </div>
                {index < trackingSteps.length - 1 && (
                  <div className={cn(
                    'w-0.5 h-8 mt-2',
                    step.status === 'completed' ? 'bg-green-300' : 'bg-gray-300'
                  )} />
                )}
              </div>
              
              <div className="flex-1 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{step.title}</h4>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  {step.date && step.time && (
                    <div className="text-sm text-gray-500 text-right">
                      <div>{step.date}</div>
                      <div>{step.time}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const StatusView = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="text-center">
        <div className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4',
          getStatusColor(order.status)
        )}>
          {getStatusIcon(order.status)}
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Order #{order.id}</h2>
        <div className={cn(
          'px-4 py-2 rounded-full text-sm font-medium capitalize inline-block mb-4',
          getStatusColor(order.status)
        )}>
          {order.status}
        </div>
        <p className="text-gray-600 mb-6">
          {order.status === 'delivered' 
            ? 'Your order has been delivered successfully!'
            : order.status === 'shipped'
            ? 'Your order is on its way'
            : 'Your order is being processed'
          }
        </p>
        
        {showTrackingNumber && order.trackingNumber && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">Tracking Number</p>
            <p className="font-mono text-lg font-bold">{order.trackingNumber}</p>
          </div>
        )}
      </div>
    </div>
  )

  if (layout === 'status') {
    return <StatusView />
  }

  if (layout === 'detailed') {
    return <TimelineView />
  }

  // Timeline layout (default)
  return <TimelineView />
}

// Component configuration for editor
export const OrderTrackingConfig = {
  id: 'order-tracking',
  name: 'Order Tracking',
  description: 'Order tracking component with timeline and status updates',
  category: 'ecommerce' as const,
  icon: 'package',
  defaultProps: {
    order: {
      id: 'ORD-2024-001',
      status: 'shipped',
      orderDate: '2024-01-15',
      estimatedDelivery: '2024-01-20',
      trackingNumber: 'TRK123456789',
      carrier: 'TCS',
      items: [
        { id: '1', name: 'Wireless Headphones', quantity: 1, price: 15000 },
        { id: '2', name: 'Phone Case', quantity: 2, price: 2000 }
      ],
      total: 19000,
      shippingAddress: {
        name: 'Ahmed Ali',
        address: '123 Main Street, Block A',
        city: 'Karachi, Pakistan',
        phone: '+92 300 1234567'
      }
    },
    showTrackingNumber: true,
    showCarrier: true,
    showEstimatedDelivery: true,
    showItems: true,
    showAddress: true,
    layout: 'timeline'
  },
  defaultSize: { width: 100, height: 600 },
  editableFields: [
    'order',
    'trackingSteps',
    'showTrackingNumber',
    'showCarrier',
    'showEstimatedDelivery',
    'showItems',
    'showAddress',
    'layout'
  ]
}
