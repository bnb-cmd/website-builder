"use client";

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye } from '@/lib/icons'
import { useEcommerceStore } from '@/lib/stores/ecommerceStore'
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  MapPin,
  Edit,
  Save,
  X,
  Package,
  CreditCard
} from '@/lib/icons'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

export default function CustomerDetailPage() {
  const params = useParams()
  const customerId = params?.id as string
  
  const { 
    customers,
    isLoading,
    fetchCustomers,
    updateCustomer
  } = useEcommerceStore()
  
  const [customer, setCustomer] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    notes: ''
  })

  useEffect(() => {
    // Find customer from the customers list or fetch individual customer
    const foundCustomer = customers.find(c => c.id === customerId)
    if (foundCustomer) {
      setCustomer(foundCustomer)
      setEditData({
        name: foundCustomer.name || '',
        phone: foundCustomer.phone || '',
         notes: (foundCustomer as any).notes || ''
      })
    } else {
      // If not found in list, fetch customers
      fetchCustomers()
    }
  }, [customerId, customers])

  const handleSave = async () => {
    try {
      await updateCustomer(customerId, editData)
      toast.success('Customer updated successfully')
      setIsEditing(false)
      // Refresh customer data
      fetchCustomers()
    } catch (error) {
      toast.error('Failed to update customer')
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

  const getCustomerValueBadge = (totalSpent: number) => {
    if (totalSpent >= 50000) {
      return <Badge variant="default" className="bg-purple-600">VIP Customer</Badge>
    } else if (totalSpent >= 20000) {
      return <Badge variant="default" className="bg-blue-600">Premium Customer</Badge>
    } else if (totalSpent >= 5000) {
      return <Badge variant="default" className="bg-green-600">Regular Customer</Badge>
    } else {
      return <Badge variant="outline">New Customer</Badge>
    }
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

  if (!customer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/ecommerce/customers">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Customers
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Customer Not Found</h3>
            <p className="text-muted-foreground text-center">
              The customer you're looking for doesn't exist or has been deleted.
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
            <Link href="/dashboard/ecommerce/customers">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Customers
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {customer.name || 'Anonymous Customer'}
            </h1>
            <p className="text-muted-foreground">
              {customer.email}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {getCustomerValueBadge(customer.totalSpent)}
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Order History</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Customer Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={editData.name}
                          onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Customer name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={editData.phone}
                          onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Phone number"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={editData.notes}
                          onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Customer notes..."
                          rows={3}
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button onClick={handleSave}>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{customer.email}</span>
                      </div>
                      
                      {customer.name && (
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{customer.name}</span>
                        </div>
                      )}
                      
                      {customer.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{customer.phone}</span>
                        </div>
                      )}

                      {customer.notes && (
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <p className="text-sm">{customer.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Customer Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center p-4 border rounded-lg">
                      <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <div className="text-2xl font-bold">{customer.totalOrders}</div>
                      <div className="text-sm text-muted-foreground">Total Orders</div>
                    </div>

                    <div className="text-center p-4 border rounded-lg">
                      <DollarSign className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <div className="text-2xl font-bold">{formatCurrency(customer.totalSpent)}</div>
                      <div className="text-sm text-muted-foreground">Total Spent</div>
                    </div>

                    <div className="text-center p-4 border rounded-lg">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <div className="text-2xl font-bold">{formatCurrency(customer.averageOrderValue)}</div>
                      <div className="text-sm text-muted-foreground">Avg Order Value</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>
                    Complete order history for this customer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {customer.orders && customer.orders.length > 0 ? (
                    <div className="space-y-4">
                      {customer.orders.map((order: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">#{order.orderNumber}</h4>
                              <div className="flex items-center space-x-1">
                                {getStatusBadge(order.status)}
                                {getPaymentStatusBadge(order.paymentStatus)}
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(order.createdAt)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Package className="w-3 h-3" />
                                <span>{order.items?.length || 0} items</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(order.total)}</div>
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/dashboard/ecommerce/orders/${order.id}`}>
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                      <p className="text-muted-foreground">
                        This customer hasn't placed any orders yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Analytics</CardTitle>
                  <CardDescription>
                    Detailed insights about this customer's behavior
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Order Timeline</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>First Order:</span>
                            <span>{formatDate(customer.firstOrder)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Last Order:</span>
                            <span>{formatDate(customer.lastOrder)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Days Since Last Order:</span>
                            <span>{Math.floor((Date.now() - new Date(customer.lastOrder).getTime()) / (1000 * 60 * 60 * 24))} days</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Customer Value</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Customer Tier:</span>
                            <span>{getCustomerValueBadge(customer.totalSpent).props.children}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Lifetime Value:</span>
                            <span className="font-medium">{formatCurrency(customer.totalSpent)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Order Frequency:</span>
                            <span>{customer.totalOrders > 0 ? (customer.totalOrders / Math.max(1, Math.floor((Date.now() - new Date(customer.firstOrder).getTime()) / (1000 * 60 * 60 * 24 * 30)))) : 0} orders/month</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="w-4 h-4 mr-2" />
                Call Customer
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Edit className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </CardContent>
          </Card>

          {/* Customer Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Customer Since:</span>
                <span>{formatDate(customer.firstOrder)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Total Orders:</span>
                <span className="font-medium">{customer.totalOrders}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Total Spent:</span>
                <span className="font-medium">{formatCurrency(customer.totalSpent)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Average Order:</span>
                <span className="font-medium">{formatCurrency(customer.averageOrderValue)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
