"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { cn } from '../../lib/utils'
import { Eye, Phone, Mail, MapPin, Calendar, DollarSign, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react'

export interface Order {
  id: string
  websiteId: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  totalAmount: number
  currency: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: 'easypaisa' | 'jazzcash' | 'cod'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'cancelled'
  notes?: string
  createdAt: string
  updatedAt: string
  items: Array<{
    id: string
    productId: string
    name: string
    quantity: number
    price: number
  }>
  shippingAddress: {
    addressLine1: string
    addressLine2?: string
    city: string
    postalCode?: string
    phone: string
  }
}

export interface OrderStats {
  totalOrders: number
  pendingOrders: number
  confirmedOrders: number
  deliveredOrders: number
  cancelledOrders: number
  totalRevenue: number
  averageOrderValue: number
  recentOrders: number
}

export interface OrdersDashboardProps {
  websiteId: string
  orders: Order[]
  stats: OrderStats
  onUpdateOrderStatus: (orderId: string, status: Order['status'], notes?: string) => Promise<void>
  language: 'ENGLISH' | 'URDU'
  className?: string
}

const OrdersDashboard: React.FC<OrdersDashboardProps> = ({
  websiteId,
  orders,
  stats,
  onUpdateOrderStatus,
  language,
  className
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const translations = {
    ENGLISH: {
      orders: 'Orders',
      orderDetails: 'Order Details',
      stats: 'Statistics',
      totalOrders: 'Total Orders',
      pendingOrders: 'Pending',
      confirmedOrders: 'Confirmed',
      deliveredOrders: 'Delivered',
      cancelledOrders: 'Cancelled',
      totalRevenue: 'Total Revenue',
      averageOrderValue: 'Avg Order Value',
      recentOrders: 'Recent (7 days)',
      filterByStatus: 'Filter by Status',
      filterByPayment: 'Filter by Payment',
      searchOrders: 'Search orders...',
      all: 'All',
      pending: 'Pending',
      confirmed: 'Confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      easypaisa: 'EasyPaisa',
      jazzcash: 'JazzCash',
      cod: 'Cash on Delivery',
      orderId: 'Order ID',
      customer: 'Customer',
      amount: 'Amount',
      status: 'Status',
      payment: 'Payment',
      date: 'Date',
      actions: 'Actions',
      view: 'View',
      updateStatus: 'Update Status',
      customerInfo: 'Customer Information',
      shippingAddress: 'Shipping Address',
      orderItems: 'Order Items',
      paymentInfo: 'Payment Information',
      orderNotes: 'Order Notes',
      noOrders: 'No orders found',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      city: 'City',
      postalCode: 'Postal Code',
      quantity: 'Qty',
      price: 'Price',
      subtotal: 'Subtotal',
      total: 'Total',
      method: 'Method',
      paymentStatus: 'Payment Status',
      notes: 'Notes',
      noNotes: 'No notes',
      updateStatusTitle: 'Update Order Status',
      newStatus: 'New Status',
      statusNotes: 'Status Notes (Optional)',
      save: 'Save',
      cancel: 'Cancel',
      updating: 'Updating...',
      statusUpdated: 'Order status updated successfully',
      statusUpdateError: 'Failed to update order status'
    },
    URDU: {
      orders: 'آرڈرز',
      orderDetails: 'آرڈر کی تفصیلات',
      stats: 'اعداد و شمار',
      totalOrders: 'کل آرڈرز',
      pendingOrders: 'زیر التواء',
      confirmedOrders: 'تصدیق شدہ',
      deliveredOrders: 'ڈیلیور شدہ',
      cancelledOrders: 'منسوخ شدہ',
      totalRevenue: 'کل آمدنی',
      averageOrderValue: 'اوسط آرڈر ویلیو',
      recentOrders: 'حالیہ (7 دن)',
      filterByStatus: 'حالت کے لحاظ سے فلٹر',
      filterByPayment: 'ادائیگی کے لحاظ سے فلٹر',
      searchOrders: 'آرڈرز تلاش کریں...',
      all: 'تمام',
      pending: 'زیر التواء',
      confirmed: 'تصدیق شدہ',
      processing: 'پروسیسنگ',
      shipped: 'بھیجا گیا',
      delivered: 'ڈیلیور شدہ',
      cancelled: 'منسوخ شدہ',
      easypaisa: 'ایزی پیسہ',
      jazzcash: 'جاز کیش',
      cod: 'کیش آن ڈیلیوری',
      orderId: 'آرڈر آئی ڈی',
      customer: 'کسٹمر',
      amount: 'رقم',
      status: 'حالت',
      payment: 'ادائیگی',
      date: 'تاریخ',
      actions: 'اعمال',
      view: 'دیکھیں',
      updateStatus: 'حالت اپڈیٹ کریں',
      customerInfo: 'کسٹمر کی معلومات',
      shippingAddress: 'شپنگ ایڈریس',
      orderItems: 'آرڈر آئٹمز',
      paymentInfo: 'ادائیگی کی معلومات',
      orderNotes: 'آرڈر نوٹس',
      noOrders: 'کوئی آرڈر نہیں ملا',
      phone: 'فون',
      email: 'ای میل',
      address: 'ایڈریس',
      city: 'شہر',
      postalCode: 'پوسٹل کوڈ',
      quantity: 'مقدار',
      price: 'قیمت',
      subtotal: 'ذیلی کل',
      total: 'کل',
      method: 'طریقہ',
      paymentStatus: 'ادائیگی کی حالت',
      notes: 'نوٹس',
      noNotes: 'کوئی نوٹس نہیں',
      updateStatusTitle: 'آرڈر کی حالت اپڈیٹ کریں',
      newStatus: 'نئی حالت',
      statusNotes: 'حالت نوٹس (اختیاری)',
      save: 'محفوظ کریں',
      cancel: 'منسوخ کریں',
      updating: 'اپڈیٹ کر رہے ہیں...',
      statusUpdated: 'آرڈر کی حالت کامیابی سے اپڈیٹ ہوئی',
      statusUpdateError: 'آرڈر کی حالت اپڈیٹ کرنے میں ناکام'
    }
  }

  const t = translations[language]

  const formatPrice = (price: number, currency: string = 'PKR') => {
    if (currency === 'PKR') {
      return `Rs. ${price.toLocaleString('en-PK')}`
    }
    return `${currency} ${price.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'URDU' ? 'ur-PK' : 'en-PK')
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'processing':
        return <Package className="h-4 w-4 text-purple-500" />
      case 'shipped':
        return <Truck className="h-4 w-4 text-indigo-500" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-purple-100 text-purple-800'
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesPayment = filterPaymentMethod === 'all' || order.paymentMethod === filterPaymentMethod
    const matchesSearch = searchQuery === '' || 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesStatus && matchesPayment && matchesSearch
  })

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status'], notes?: string) => {
    setIsUpdating(true)
    try {
      await onUpdateOrderStatus(orderId, newStatus, notes)
      setIsDetailsOpen(false)
      setSelectedOrder(null)
    } catch (error) {
      console.error('Update status error:', error)
      alert(t.statusUpdateError)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className={cn("space-y-6", className)} dir={language === 'URDU' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t.orders}</h2>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalOrders}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.pendingOrders}</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.deliveredOrders}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.deliveredOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalRevenue}</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={t.searchOrders}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t.filterByStatus} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.all}</SelectItem>
                <SelectItem value="pending">{t.pending}</SelectItem>
                <SelectItem value="confirmed">{t.confirmed}</SelectItem>
                <SelectItem value="processing">{t.processing}</SelectItem>
                <SelectItem value="shipped">{t.shipped}</SelectItem>
                <SelectItem value="delivered">{t.delivered}</SelectItem>
                <SelectItem value="cancelled">{t.cancelled}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPaymentMethod} onValueChange={setFilterPaymentMethod}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t.filterByPayment} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.all}</SelectItem>
                <SelectItem value="easypaisa">{t.easypaisa}</SelectItem>
                <SelectItem value="jazzcash">{t.jazzcash}</SelectItem>
                <SelectItem value="cod">{t.cod}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">{t.noOrders}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.orderId}</TableHead>
                  <TableHead>{t.customer}</TableHead>
                  <TableHead>{t.amount}</TableHead>
                  <TableHead>{t.status}</TableHead>
                  <TableHead>{t.payment}</TableHead>
                  <TableHead>{t.date}</TableHead>
                  <TableHead>{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <span className="font-mono text-sm">{order.id.substring(0, 8)}...</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{order.customerPhone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{formatPrice(order.totalAmount, order.currency)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("flex items-center gap-1 w-fit", getStatusColor(order.status))}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-xs">
                          {order.paymentMethod.toUpperCase()}
                        </Badge>
                        <Badge className={cn("text-xs", getPaymentStatusColor(order.paymentStatus))}>
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order)
                            setIsDetailsOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.orderDetails}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.customerInfo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{selectedOrder.customerPhone}</span>
                  </div>
                  {selectedOrder.customerEmail && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{selectedOrder.customerEmail}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.shippingAddress}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <div>
                      <p>{selectedOrder.shippingAddress.addressLine1}</p>
                      {selectedOrder.shippingAddress.addressLine2 && (
                        <p>{selectedOrder.shippingAddress.addressLine2}</p>
                      )}
                      <p>{selectedOrder.shippingAddress.city}</p>
                      {selectedOrder.shippingAddress.postalCode && (
                        <p>{selectedOrder.shippingAddress.postalCode}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.orderItems}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {t.quantity}: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(item.price)}</p>
                          <p className="text-sm text-gray-500">
                            {t.total}: {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="text-lg font-bold">{t.total}:</span>
                      <span className="text-lg font-bold">{formatPrice(selectedOrder.totalAmount, selectedOrder.currency)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.paymentInfo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>{t.method}:</span>
                    <Badge variant="outline">{selectedOrder.paymentMethod.toUpperCase()}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.paymentStatus}:</span>
                    <Badge className={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                      {selectedOrder.paymentStatus}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Order Notes */}
              {selectedOrder.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t.orderNotes}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{selectedOrder.notes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Status Update */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.updateStatus}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="status">{t.newStatus}</Label>
                      <Select
                        value={selectedOrder.status}
                        onValueChange={(value) => setSelectedOrder(prev => prev ? { ...prev, status: value as Order['status'] } : null)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">{t.pending}</SelectItem>
                          <SelectItem value="confirmed">{t.confirmed}</SelectItem>
                          <SelectItem value="processing">{t.processing}</SelectItem>
                          <SelectItem value="shipped">{t.shipped}</SelectItem>
                          <SelectItem value="delivered">{t.delivered}</SelectItem>
                          <SelectItem value="cancelled">{t.cancelled}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">{t.statusNotes}</Label>
                      <Textarea
                        id="notes"
                        value={selectedOrder.notes || ''}
                        onChange={(e) => setSelectedOrder(prev => prev ? { ...prev, notes: e.target.value } : null)}
                        placeholder={language === 'URDU' ? 'حالت کے بارے میں نوٹس' : 'Notes about the status'}
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                        {t.cancel}
                      </Button>
                      <Button 
                        onClick={() => handleUpdateStatus(selectedOrder.id, selectedOrder.status, selectedOrder.notes)}
                        disabled={isUpdating}
                      >
                        {isUpdating ? t.updating : t.save}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OrdersDashboard
