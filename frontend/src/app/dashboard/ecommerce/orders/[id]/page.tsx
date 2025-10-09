"use client";

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEcommerceStore } from '@/lib/stores/ecommerceStore'
import { 
  ArrowLeft,
  Package,
  Truck,
  CreditCard,
  User,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Edit,
  Save,
  X,
  Printer,
  Download
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

export default function OrderDetailPage() {
  const params = useParams()
  const orderId = params?.id as string
  
  const { 
    orders,
    isLoading,
    fetchOrders,
    updateOrderStatus,
    addTracking
  } = useEcommerceStore()
  
  const [order, setOrder] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [trackingData, setTrackingData] = useState({
    trackingNumber: '',
    carrier: '',
    trackingUrl: ''
  })

  useEffect(() => {
    // Find order from the orders list or fetch individual order
    const foundOrder = orders.find(o => o.id === orderId)
    if (foundOrder) {
      setOrder(foundOrder)
    } else {
      // If not found in list, fetch individual order
      fetchOrders()
    }
  }, [orderId, orders])

  const handleStatusUpdate = async (newStatus: string, notes?: string) => {
    try {
      await updateOrderStatus(orderId, newStatus, notes)
      toast.success('Order status updated')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  const handleTrackingUpdate = async () => {
    if (!trackingData.trackingNumber || !trackingData.carrier) {
      toast.error('Please fill in tracking number and carrier')
      return
    }

    try {
      await addTracking(orderId, trackingData)
      toast.success('Tracking information added')
      setTrackingData({ trackingNumber: '', carrier: '', trackingUrl: '' })
    } catch (error) {
      toast.error('Failed to add tracking information')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="text-yellow-600">Pending</Badge>
      case 'PROCESSING':
        return <Badge variant="default" className="text-blue-600">Processing</Badge>
      case 'SHIPPED':
        return <Badge variant="default" className="text-purple-600">Shipped</Badge>
      case 'DELIVERED':
        return <Badge variant="default" className="text-green-600">Delivered</Badge>
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="text-yellow-600">Pending</Badge>
      case 'COMPLETED':
        return <Badge variant="default" className="text-green-600">Paid</Badge>
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>
      case 'REFUNDED':
        return <Badge variant="secondary" className="text-orange-600">Refunded</Badge>
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-48 bg-muted rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-24 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/ecommerce/orders">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Order Not Found</h3>
            <p className="text-muted-foreground text-center">
              The order you're looking for doesn't exist or has been deleted.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/ecommerce/orders">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Order #{order.orderNumber}</h1>
            <p className="text-muted-foreground">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Order Status
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Shipping Status:</span>
                  {isEditing ? (
                    <Select
                      value={order.shippingStatus}
                      onValueChange={(value) => handleStatusUpdate(value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PROCESSING">Processing</SelectItem>
                        <SelectItem value="SHIPPED">Shipped</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    getStatusBadge(order.shippingStatus)
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Payment Status:</span>
                  {getPaymentStatusBadge(order.paymentStatus)}
                </div>
              </div>

              {order.trackingNumber && (
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Tracking:</span>
                  <span className="text-sm">{order.trackingNumber}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.product?.name || `Product ${item.productId}`}</h4>
                        <p className="text-sm text-muted-foreground">
                          SKU: {item.product?.sku || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.price)}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">
                        Total: {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tracking Information */}
          <Card>
            <CardHeader>
              <CardTitle>Tracking Information</CardTitle>
              <CardDescription>
                Add or update tracking details for this order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="trackingNumber">Tracking Number</Label>
                  <Input
                    id="trackingNumber"
                    value={trackingData.trackingNumber}
                    onChange={(e) => setTrackingData(prev => ({ ...prev, trackingNumber: e.target.value }))}
                    placeholder="Enter tracking number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carrier">Carrier</Label>
                  <Input
                    id="carrier"
                    value={trackingData.carrier}
                    onChange={(e) => setTrackingData(prev => ({ ...prev, carrier: e.target.value }))}
                    placeholder="e.g., TCS, Leopards, DHL"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trackingUrl">Tracking URL (Optional)</Label>
                <Input
                  id="trackingUrl"
                  value={trackingData.trackingUrl}
                  onChange={(e) => setTrackingData(prev => ({ ...prev, trackingUrl: e.target.value }))}
                  placeholder="https://tracking.example.com/track/..."
                />
              </div>

              <Button onClick={handleTrackingUpdate}>
                <Save className="w-4 h-4 mr-2" />
                Add Tracking
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Customer</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{order.customerEmail}</span>
              </div>
              
              {order.customerName && (
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{order.customerName}</span>
                </div>
              )}
              
              {order.customerPhone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{order.customerPhone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Shipping Address</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.shippingAddress ? (
                <div className="text-sm space-y-1">
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p>{order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No shipping address provided</p>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
              )}
              
              {order.shipping > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span>{formatCurrency(order.shipping)}</span>
                </div>
              )}
              
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount:</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Method:</span>
                <span>{order.paymentMethod || 'N/A'}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Status:</span>
                {getPaymentStatusBadge(order.paymentStatus)}
              </div>
              
              {order.paymentId && (
                <div className="flex justify-between text-sm">
                  <span>Payment ID:</span>
                  <span className="font-mono text-xs">{order.paymentId}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
