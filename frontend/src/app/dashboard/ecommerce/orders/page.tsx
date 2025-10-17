"use client";

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEcommerceStore } from '@/lib/stores/ecommerceStore'
import { useWebsiteStore } from '@/lib/store'
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Eye,
  Package,
  Truck,
  CreditCard,
  User,
  Calendar,
  ArrowLeft,
  MoreHorizontal
} from '@/lib/icons'
import Link from 'next/link'
import { toast } from 'sonner'

export default function OrdersPage() {
  const { 
    orders, 
    isLoading, 
    selectedWebsite, 
    setSelectedWebsite,
    orderFilters,
    setOrderFilters,
    fetchOrders,
    updateOrderStatus
  } = useEcommerceStore()
  
  const { websites } = useWebsiteStore()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (selectedWebsite) {
      fetchOrders()
    }
  }, [selectedWebsite, orderFilters])

  const handleWebsiteChange = (websiteId: string) => {
    setSelectedWebsite(websiteId)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setOrderFilters({ customerEmail: value, page: 1 })
  }

  const handleStatusFilter = (status: string) => {
    setOrderFilters({ status: status === 'all' ? undefined : status, page: 1 })
  }

  const handlePaymentStatusFilter = (status: string) => {
    setOrderFilters({ paymentStatus: status === 'all' ? undefined : status, page: 1 })
  }

  const handleSort = (sortBy: string) => {
    setOrderFilters({ sortBy, page: 1 })
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      toast.success('Order status updated')
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount)
  }

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'No date'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid date'
    return date.toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage customer orders and track fulfillment
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Website Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Website:</label>
            <select
              value={selectedWebsite || ''}
              onChange={(e) => handleWebsiteChange(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="">Select a website</option>
              {websites.map((website) => (
                <option key={website.id} value={website.id}>
                  {website.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {!selectedWebsite ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Website Selected</h3>
            <p className="text-muted-foreground text-center mb-4">
              Select a website to view and manage its orders.
            </p>
            <Button asChild>
              <Link href="/dashboard/websites">
                Go to Websites
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Orders</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by customer email..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="sm:w-48">
                  <Label>Order Status</Label>
                  <Select onValueChange={handleStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PROCESSING">Processing</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:w-48">
                  <Label>Payment Status</Label>
                  <Select onValueChange={handlePaymentStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Payments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Payments</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                      <SelectItem value="REFUNDED">Refunded</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:w-48">
                  <Label>Sort By</Label>
                  <Select onValueChange={handleSort}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Date Created</SelectItem>
                      <SelectItem value="total">Order Total</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      <div className="h-3 bg-muted rounded w-1/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4">
                          <h3 className="font-semibold">#{order.orderNumber}</h3>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(order.shippingStatus)}
                            {getPaymentStatusBadge(order.paymentStatus)}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{order.customerName || order.customerEmail}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Package className="w-4 h-4" />
                            <span>{order.items?.length || 0} items</span>
                          </div>
                        </div>

                        <div className="text-lg font-semibold">
                          {formatCurrency(order.total)}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Select
                          value={order.shippingStatus}
                          onValueChange={(value) => handleStatusUpdate(order.id, value)}
                        >
                          <SelectTrigger className="w-32">
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

                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/ecommerce/orders/${order.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Link>
                        </Button>

                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    {order.items && order.items.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="space-y-2">
                          {order.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span>{item.product?.name || `Product ${item.productId}`}</span>
                              <span className="text-muted-foreground">
                                {item.quantity} × {formatCurrency(item.price)}
                              </span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="text-sm text-muted-foreground">
                              +{order.items.length - 3} more items
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    {searchTerm || orderFilters.status || orderFilters.paymentStatus
                      ? 'No orders match your current filters.' 
                      : 'Orders will appear here when customers make purchases.'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pagination */}
          {orders.length > 0 && (
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {orders.length} orders
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={orderFilters.page === 1}
                      onClick={() => setOrderFilters({ page: orderFilters.page - 1 })}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOrderFilters({ page: orderFilters.page + 1 })}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
