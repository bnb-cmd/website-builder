import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Package, Truck, CheckCircle } from '@/lib/icons'
import { Badge } from '../../ui/badge'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const OrderSummaryConfig: ComponentConfig = {
  id: 'order-summary',
  name: 'Order Summary',
  category: 'ecommerce',
  icon: 'Package',
  description: 'Display order details and status',
  defaultProps: { 
    orderNumber: 'ORD-2024-001',
    orderDate: '2024-01-15',
    status: 'Shipped',
    items: [
      { name: 'Wireless Headphones', quantity: 1, price: '$99.99' },
      { name: 'Phone Case', quantity: 2, price: '$19.99' }
    ],
    subtotal: '$139.97',
    shipping: '$9.99',
    tax: '$11.20',
    total: '$161.16',
    trackingNumber: 'TRK123456789',
    estimatedDelivery: '2024-01-20',
    showTracking: true,
    showStatus: true
  },
  defaultSize: { width: 400, height: 500 },
  editableFields: ['orderNumber', 'orderDate', 'status', 'items', 'subtotal', 'shipping', 'tax', 'total', 'trackingNumber', 'estimatedDelivery', 'showTracking', 'showStatus']
}

interface OrderItem {
  name: string
  quantity: number
  price: string
}

interface OrderSummaryProps extends WebsiteComponentProps {
  orderNumber: string
  orderDate: string
  status: string
  items: OrderItem[]
  subtotal: string
  shipping: string
  tax: string
  total: string
  trackingNumber: string
  estimatedDelivery: string
  showTracking: boolean
  showStatus: boolean
}

export const WebsiteOrderSummary: React.FC<OrderSummaryProps> = ({ 
  orderNumber, 
  orderDate, 
  status, 
  items, 
  subtotal, 
  shipping, 
  tax, 
  total, 
  trackingNumber, 
  estimatedDelivery, 
  showTracking, 
  showStatus,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800'
    switch (status.toLowerCase()) {
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const padding = getResponsivePadding('p-6', deviceMode)
  const titleSize = getResponsiveTextSize('text-xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-sm', deviceMode)
  const itemSize = getResponsiveTextSize('text-sm', deviceMode)
  const totalSize = getResponsiveTextSize('text-lg', deviceMode)
  const infoSize = getResponsiveTextSize('text-sm', deviceMode)

  return (
    <div className={cn("w-full h-full bg-white border border-gray-200 rounded-lg", padding)}>
      <div className="space-y-4">
        <div className="text-center">
          <h2 
            className={cn("font-bold mb-2", titleSize)}
            onDoubleClick={onTextDoubleClick}
          >
            Order Summary
          </h2>
          <div className="space-y-1">
            <p 
              className={cn("text-gray-600", subtitleSize)}
              onDoubleClick={onTextDoubleClick}
            >
              Order #{orderNumber}
            </p>
            <p 
              className={cn("text-gray-500", subtitleSize)}
              onDoubleClick={onTextDoubleClick}
            >
              Placed on {orderDate}
            </p>
          </div>
        </div>
        
        {/* Order Status */}
        {showStatus && (
          <div className="text-center">
            <Badge className={cn("px-3 py-1", getStatusColor(status))}>
              <CheckCircle className="w-3 h-3 mr-1" />
              {status}
            </Badge>
          </div>
        )}
        
        {/* Order Items */}
        <div className="space-y-3">
          <h3 className={cn("font-semibold", itemSize)}>Items Ordered</h3>
          {(items || []).map((item, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <div>
                <span 
                  className={cn("font-medium", itemSize)}
                  onDoubleClick={onTextDoubleClick}
                >
                  {item.name}
                </span>
                <span className={cn("text-gray-500 ml-2", itemSize)}>
                  x{item.quantity}
                </span>
              </div>
              <span 
                className={cn("font-medium", itemSize)}
                onDoubleClick={onTextDoubleClick}
              >
                {item.price}
              </span>
            </div>
          ))}
        </div>
        
        {/* Order Totals */}
        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between">
            <span className={cn("text-gray-600", itemSize)}>Subtotal</span>
            <span 
              className={cn("font-medium", itemSize)}
              onDoubleClick={onTextDoubleClick}
            >
              {subtotal}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={cn("text-gray-600", itemSize)}>Shipping</span>
            <span 
              className={cn("font-medium", itemSize)}
              onDoubleClick={onTextDoubleClick}
            >
              {shipping}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={cn("text-gray-600", itemSize)}>Tax</span>
            <span 
              className={cn("font-medium", itemSize)}
              onDoubleClick={onTextDoubleClick}
            >
              {tax}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className={cn("font-bold", totalSize)}>Total</span>
            <span 
              className={cn("font-bold", totalSize)}
              onDoubleClick={onTextDoubleClick}
            >
              {total}
            </span>
          </div>
        </div>
        
        {/* Tracking Info */}
        {showTracking && (
          <div className="space-y-2 border-t pt-4">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-primary" />
              <span className={cn("font-medium", infoSize)}>Tracking Information</span>
            </div>
            <div className="space-y-1">
              <p 
                className={cn("text-gray-600", infoSize)}
                onDoubleClick={onTextDoubleClick}
              >
                Tracking #: {trackingNumber}
              </p>
              <p 
                className={cn("text-gray-600", infoSize)}
                onDoubleClick={onTextDoubleClick}
              >
                Estimated Delivery: {estimatedDelivery}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
