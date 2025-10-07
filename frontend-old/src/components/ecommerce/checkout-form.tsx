'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ShoppingCart, PaymentMethod, ShippingMethod, Address } from '@/types/ecommerce'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Truck, MapPin, User, Mail, Phone, Building } from 'lucide-react'

const checkoutSchema = z.object({
  // Customer Information
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  
  // Shipping Address
  shippingAddress: z.object({
    address1: z.string().min(5, 'Address is required'),
    address2: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    postalCode: z.string().min(4, 'Postal code is required'),
    country: z.string().min(2, 'Country is required')
  }),
  
  // Billing Address
  sameAsBilling: z.boolean().default(true),
  billingAddress: z.object({
    address1: z.string().optional(),
    address2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional()
  }).optional(),
  
  // Shipping & Payment
  shippingMethod: z.string().min(1, 'Please select a shipping method'),
  paymentMethod: z.string().min(1, 'Please select a payment method'),
  
  // Optional
  notes: z.string().optional(),
  newsletter: z.boolean().default(false),
  terms: z.boolean().refine(val => val === true, 'You must agree to the terms')
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

interface CheckoutFormProps {
  cart: ShoppingCart
  paymentMethods: PaymentMethod[]
  shippingMethods: ShippingMethod[]
  onSubmit: (data: CheckoutFormData) => Promise<void>
  loading?: boolean
}

export function CheckoutForm({
  cart,
  paymentMethods,
  shippingMethods,
  onSubmit,
  loading = false
}: CheckoutFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      sameAsBilling: true,
      newsletter: false,
      terms: false,
      shippingAddress: {
        country: 'Pakistan'
      }
    }
  })

  const sameAsBilling = watch('sameAsBilling')

  const handleFormSubmit = async (data: CheckoutFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Checkout failed:', error)
    }
  }

  const totalWithShipping = cart.total + (selectedShipping?.price || 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Checkout Form */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Customer Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+92-300-1234567"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Shipping Address</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address1">Street Address *</Label>
              <Input
                id="address1"
                {...register('shippingAddress.address1')}
                placeholder="123 Main Street"
              />
              {errors.shippingAddress?.address1 && (
                <p className="text-red-500 text-xs mt-1">{errors.shippingAddress.address1.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address2">Apartment, Suite, etc.</Label>
              <Input
                id="address2"
                {...register('shippingAddress.address2')}
                placeholder="Apt 4B"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  {...register('shippingAddress.city')}
                  placeholder="Karachi"
                />
                {errors.shippingAddress?.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.shippingAddress.city.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="state">State/Province *</Label>
                <Select onValueChange={(value) => setValue('shippingAddress.state', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sindh">Sindh</SelectItem>
                    <SelectItem value="punjab">Punjab</SelectItem>
                    <SelectItem value="kpk">Khyber Pakhtunkhwa</SelectItem>
                    <SelectItem value="balochistan">Balochistan</SelectItem>
                    <SelectItem value="islamabad">Islamabad</SelectItem>
                  </SelectContent>
                </Select>
                {errors.shippingAddress?.state && (
                  <p className="text-red-500 text-xs mt-1">{errors.shippingAddress.state.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postalCode">Postal Code *</Label>
                <Input
                  id="postalCode"
                  {...register('shippingAddress.postalCode')}
                  placeholder="75500"
                />
                {errors.shippingAddress?.postalCode && (
                  <p className="text-red-500 text-xs mt-1">{errors.shippingAddress.postalCode.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Select defaultValue="Pakistan" onValueChange={(value) => setValue('shippingAddress.country', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pakistan">Pakistan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>Shipping Method</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              onValueChange={(value) => {
                setValue('shippingMethod', value)
                const method = shippingMethods.find(m => m.id === value)
                setSelectedShipping(method || null)
              }}
            >
              {shippingMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={method.id} className="font-medium">
                        {method.name}
                      </Label>
                      <span className="font-semibold">
                        {method.price === 0 ? 'Free' : `PKR ${method.price.toLocaleString()}`}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                    <p className="text-xs text-muted-foreground">{method.estimatedDays}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
            {errors.shippingMethod && (
              <p className="text-red-500 text-xs mt-2">{errors.shippingMethod.message}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Payment Method</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              onValueChange={(value) => {
                setValue('paymentMethod', value)
                const method = paymentMethods.find(m => m.id === value)
                setSelectedPayment(method || null)
              }}
            >
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <Label htmlFor={method.id} className="font-medium">
                        {method.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                    {method.logo && (
                      <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                        <span className="text-xs">{method.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </RadioGroup>
            {errors.paymentMethod && (
              <p className="text-red-500 text-xs mt-2">{errors.paymentMethod.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Additional Options */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label htmlFor="notes">Order Notes (Optional)</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Special delivery instructions..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="newsletter"
                  {...register('newsletter')}
                />
                <Label htmlFor="newsletter" className="text-sm">
                  Subscribe to our newsletter for updates and promotions
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  {...register('terms')}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{' '}
                  <a href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>
              {errors.terms && (
                <p className="text-red-500 text-xs">{errors.terms.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cart Items */}
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <div className="relative w-12 h-12">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                        <span className="text-xs">No Image</span>
                      </div>
                    )}
                    <Badge className="absolute -top-1 -right-1 text-xs px-1">
                      {item.quantity}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      PKR {item.price.toLocaleString()} × {item.quantity}
                    </p>
                  </div>
                  <div className="font-semibold text-sm">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>PKR {cart.subtotal.toLocaleString()}</span>
              </div>
              
              {selectedShipping && (
                <div className="flex justify-between text-sm">
                  <span>Shipping ({selectedShipping.name})</span>
                  <span>
                    {selectedShipping.price === 0 ? 'Free' : `PKR ${selectedShipping.price.toLocaleString()}`}
                  </span>
                </div>
              )}
              
              {cart.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-PKR {cart.discount.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>PKR {cart.tax.toLocaleString()}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>PKR {totalWithShipping.toLocaleString()}</span>
              </div>
            </div>

            {/* Selected Payment Method */}
            {selectedPayment && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-sm font-medium">{selectedPayment.name}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedPayment.description}
                </p>
              </div>
            )}

            {/* Complete Order Button */}
            <Button
              onClick={handleSubmit(handleFormSubmit)}
              disabled={isSubmitting || loading}
              size="lg"
              className="w-full"
            >
              {isSubmitting || loading ? (
                'Processing...'
              ) : (
                `Complete Order - PKR ${totalWithShipping.toLocaleString()}`
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Your payment information is secure and encrypted
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
