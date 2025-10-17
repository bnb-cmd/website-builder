"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { cn } from '../../lib/utils'
import { CreditCard, Smartphone, Truck } from '@/lib/icons'

export interface CheckoutFormProps {
  items: Array<{
    id: string
    productId: string
    name: string
    price: number
    quantity: number
  }>
  onPlaceOrder: (orderData: OrderData) => Promise<void>
  language: 'ENGLISH' | 'URDU'
  className?: string
}

export interface OrderData {
  customerName: string
  customerPhone: string
  customerEmail?: string
  shippingAddress: {
    addressLine1: string
    addressLine2?: string
    city: string
    postalCode?: string
    phone: string
  }
  paymentMethod: 'easypaisa' | 'jazzcash' | 'cod'
  notes?: string
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  items,
  onPlaceOrder,
  language,
  className
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<OrderData>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    shippingAddress: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      postalCode: '',
      phone: ''
    },
    paymentMethod: 'cod',
    notes: ''
  })

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString('en-PK')}`
  }

  const translations = {
    ENGLISH: {
      checkout: 'Checkout',
      customerInfo: 'Customer Information',
      shippingAddress: 'Shipping Address',
      paymentMethod: 'Payment Method',
      orderSummary: 'Order Summary',
      placeOrder: 'Place Order',
      name: 'Full Name',
      phone: 'Phone Number',
      email: 'Email (Optional)',
      addressLine1: 'Address Line 1',
      addressLine2: 'Address Line 2 (Optional)',
      city: 'City',
      postalCode: 'Postal Code (Optional)',
      notes: 'Order Notes (Optional)',
      easypaisa: 'EasyPaisa',
      jazzcash: 'JazzCash',
      cod: 'Cash on Delivery',
      subtotal: 'Subtotal',
      total: 'Total',
      required: 'Required',
      invalidPhone: 'Please enter a valid Pakistani phone number',
      invalidEmail: 'Please enter a valid email address'
    },
    URDU: {
      checkout: 'خریداری مکمل کریں',
      customerInfo: 'کسٹمر کی معلومات',
      shippingAddress: 'شپنگ ایڈریس',
      paymentMethod: 'ادائیگی کا طریقہ',
      orderSummary: 'آرڈر کا خلاصہ',
      placeOrder: 'آرڈر دیں',
      name: 'پورا نام',
      phone: 'فون نمبر',
      email: 'ای میل (اختیاری)',
      addressLine1: 'ایڈریس لائن 1',
      addressLine2: 'ایڈریس لائن 2 (اختیاری)',
      city: 'شہر',
      postalCode: 'پوسٹل کوڈ (اختیاری)',
      notes: 'آرڈر نوٹس (اختیاری)',
      easypaisa: 'ایزی پیسہ',
      jazzcash: 'جاز کیش',
      cod: 'کیش آن ڈیلیوری',
      subtotal: 'ذیلی کل',
      total: 'کل',
      required: 'ضروری',
      invalidPhone: 'براہ کرم درست پاکستانی فون نمبر درج کریں',
      invalidEmail: 'براہ کرم درست ای میل ایڈریس درج کریں'
    }
  }

  const t = translations[language]

  const validatePakistaniPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '')
    return /^(\+92|0)?[0-9]{10}$/.test(cleaned)
  }

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.customerName.trim()) {
      alert(language === 'URDU' ? 'نام درج کریں' : 'Please enter your name')
      return
    }

    if (!formData.customerPhone.trim()) {
      alert(language === 'URDU' ? 'فون نمبر درج کریں' : 'Please enter your phone number')
      return
    }

    if (!validatePakistaniPhone(formData.customerPhone)) {
      alert(t.invalidPhone)
      return
    }

    if (formData.customerEmail && !validateEmail(formData.customerEmail)) {
      alert(t.invalidEmail)
      return
    }

    if (!formData.shippingAddress.addressLine1.trim()) {
      alert(language === 'URDU' ? 'ایڈریس درج کریں' : 'Please enter your address')
      return
    }

    if (!formData.shippingAddress.city.trim()) {
      alert(language === 'URDU' ? 'شہر درج کریں' : 'Please enter your city')
      return
    }

    setIsSubmitting(true)
    try {
      await onPlaceOrder(formData)
    } catch (error) {
      console.error('Order placement error:', error)
      alert(language === 'URDU' ? 'آرڈر میں خرابی آئی' : 'Error placing order')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn("max-w-4xl mx-auto p-6", className)} dir={language === 'URDU' ? 'rtl' : 'ltr'}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {t.customerInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customerName" className="text-sm font-medium">
                    {t.name} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder={language === 'URDU' ? 'آپ کا پورا نام' : 'Enter your full name'}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="customerPhone" className="text-sm font-medium">
                    {t.phone} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    placeholder={language === 'URDU' ? '+92 300 1234567' : '+92 300 1234567'}
                    required
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {language === 'URDU' ? 'پاکستانی فون نمبر فارمیٹ' : 'Pakistani phone number format'}
                  </p>
                </div>

                <div>
                  <Label htmlFor="customerEmail" className="text-sm font-medium">
                    {t.email}
                  </Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    placeholder={language === 'URDU' ? 'example@email.com' : 'example@email.com'}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {t.shippingAddress}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="addressLine1" className="text-sm font-medium">
                    {t.addressLine1} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="addressLine1"
                    value={formData.shippingAddress.addressLine1}
                    onChange={(e) => handleAddressChange('addressLine1', e.target.value)}
                    placeholder={language === 'URDU' ? 'گلی نمبر، گھر نمبر' : 'Street address, house number'}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="addressLine2" className="text-sm font-medium">
                    {t.addressLine2}
                  </Label>
                  <Input
                    id="addressLine2"
                    value={formData.shippingAddress.addressLine2}
                    onChange={(e) => handleAddressChange('addressLine2', e.target.value)}
                    placeholder={language === 'URDU' ? 'اپارٹمنٹ، یونٹ، وغیرہ' : 'Apartment, unit, etc.'}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium">
                      {t.city} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      value={formData.shippingAddress.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      placeholder={language === 'URDU' ? 'شہر' : 'City'}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="postalCode" className="text-sm font-medium">
                      {t.postalCode}
                    </Label>
                    <Input
                      id="postalCode"
                      value={formData.shippingAddress.postalCode}
                      onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                      placeholder={language === 'URDU' ? '12345' : '12345'}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {t.paymentMethod}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleInputChange('paymentMethod', value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="easypaisa" id="easypaisa" />
                    <Label htmlFor="easypaisa" className="flex items-center space-x-2 cursor-pointer">
                      <Smartphone className="h-4 w-4" />
                      <span>{t.easypaisa}</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="jazzcash" id="jazzcash" />
                    <Label htmlFor="jazzcash" className="flex items-center space-x-2 cursor-pointer">
                      <Smartphone className="h-4 w-4" />
                      <span>{t.jazzcash}</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center space-x-2 cursor-pointer">
                      <Truck className="h-4 w-4" />
                      <span>{t.cod}</span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {t.notes}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder={language === 'URDU' ? 'کوئی خاص ہدایات یا نوٹس' : 'Any special instructions or notes'}
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {t.orderSummary}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {language === 'URDU' ? 'مقدار' : 'Qty'}: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <hr />

                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {t.subtotal}:
                  </span>
                  <span className="text-sm">
                    {formatPrice(totalAmount)}
                  </span>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">
                    {t.total}:
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(totalAmount)}
                  </span>
                </div>

                {/* Place Order Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {language === 'URDU' ? 'آرڈر دیا جا رہا ہے...' : 'Placing Order...'}
                    </span>
                  ) : (
                    t.placeOrder
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CheckoutForm
