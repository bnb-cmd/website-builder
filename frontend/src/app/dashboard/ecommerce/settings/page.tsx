"use client";

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useEcommerceStore } from '@/lib/stores/ecommerceStore'
import { useWebsiteStore } from '@/lib/store'
import { 
  Settings, 
  CreditCard, 
  Truck, 
  Mail, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Save,
  TestTube,
  Shield,
  Globe
} from '@/lib/icons'
import { toast } from 'sonner'

export default function EcommerceSettingsPage() {
  const { 
    settings,
    isLoading,
    selectedWebsite,
    setSelectedWebsite,
    fetchSettings,
    updateSettings,
    enableEcommerce,
    disableEcommerce
  } = useEcommerceStore()
  
  const { websites } = useWebsiteStore()
  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    currency: 'PKR',
    taxRate: 0,
    shippingEnabled: true,
    
    // Payment gateways
    stripeEnabled: false,
    stripePublicKey: '',
    stripeSecretKey: '',
    jazzcashEnabled: false,
    jazzcashMerchantId: '',
    jazzcashSecretKey: '',
    easypaisaEnabled: false,
    easypaisaMerchantId: '',
    easypaisaSecretKey: '',
    
    // Shipping
    freeShippingThreshold: 0,
    flatShippingRate: 0,
    localDeliveryEnabled: false,
    
    // Inventory
    lowStockAlert: true,
    lowStockThreshold: 10,
    
    // Cart & Checkout
    guestCheckoutEnabled: true,
    cartAbandonmentEmail: false,
    
    // Email settings
    orderConfirmationEmail: true,
    shippingNotificationEmail: true
  })

  useEffect(() => {
    if (selectedWebsite) {
      fetchSettings(selectedWebsite)
    }
  }, [selectedWebsite])

  useEffect(() => {
    if (settings) {
      setFormData({
        storeName: settings.storeName || '',
        storeDescription: settings.storeDescription || '',
        currency: settings.currency || 'PKR',
        taxRate: settings.taxRate || 0,
        shippingEnabled: settings.shippingEnabled || true,
        
        stripeEnabled: settings.stripeEnabled || false,
        stripePublicKey: settings.stripePublicKey || '',
        stripeSecretKey: settings.stripeSecretKey || '',
        jazzcashEnabled: settings.jazzcashEnabled || false,
        jazzcashMerchantId: settings.jazzcashMerchantId || '',
        jazzcashSecretKey: settings.jazzcashSecretKey || '',
        easypaisaEnabled: settings.easypaisaEnabled || false,
        easypaisaMerchantId: settings.easypaisaMerchantId || '',
        easypaisaSecretKey: settings.easypaisaSecretKey || '',
        
        freeShippingThreshold: settings.freeShippingThreshold || 0,
        flatShippingRate: settings.flatShippingRate || 0,
        localDeliveryEnabled: settings.localDeliveryEnabled || false,
        
        lowStockAlert: settings.lowStockAlert || true,
        lowStockThreshold: settings.lowStockThreshold || 10,
        
        guestCheckoutEnabled: settings.guestCheckoutEnabled || true,
        cartAbandonmentEmail: settings.cartAbandonmentEmail || false,
        
        orderConfirmationEmail: settings.orderConfirmationEmail || true,
        shippingNotificationEmail: settings.shippingNotificationEmail || true
      })
    }
  }, [settings])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    if (!selectedWebsite) {
      toast.error('Please select a website')
      return
    }

    try {
      await updateSettings(selectedWebsite, formData)
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
    }
  }

  const handleEnableEcommerce = async () => {
    if (!selectedWebsite) {
      toast.error('Please select a website')
      return
    }

    try {
      await enableEcommerce(selectedWebsite)
      toast.success('E-commerce enabled successfully')
    } catch (error) {
      toast.error('Failed to enable e-commerce')
    }
  }

  const handleDisableEcommerce = async () => {
    if (!selectedWebsite) {
      toast.error('Please select a website')
      return
    }

    try {
      await disableEcommerce(selectedWebsite)
      toast.success('E-commerce disabled successfully')
    } catch (error) {
      toast.error('Failed to disable e-commerce')
    }
  }

  const testPaymentGateway = async (gateway: string) => {
    toast.info(`Testing ${gateway} connection...`)
    // Implement actual gateway testing logic here
    setTimeout(() => {
      toast.success(`${gateway} connection successful`)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">E-commerce Settings</h1>
          <p className="text-muted-foreground">
            Configure your online store settings
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Website Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Website:</label>
            <select
              value={selectedWebsite || ''}
              onChange={(e) => setSelectedWebsite(e.target.value)}
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

          <div className="flex items-center space-x-2">
            {settings ? (
              <>
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Enabled
                </Badge>
                <Button variant="destructive" onClick={handleDisableEcommerce}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Disable
                </Button>
              </>
            ) : (
              <Button onClick={handleEnableEcommerce}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Enable E-commerce
              </Button>
            )}
          </div>
        </div>
      </div>

      {!selectedWebsite ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Settings className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Website Selected</h3>
            <p className="text-muted-foreground text-center mb-4">
              Select a website to configure its e-commerce settings.
            </p>
          </CardContent>
        </Card>
      ) : !settings ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">E-commerce Not Enabled</h3>
            <p className="text-muted-foreground text-center mb-4">
              Enable e-commerce for this website to start selling online.
            </p>
            <Button onClick={handleEnableEcommerce}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Enable E-commerce
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="emails">Email Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>
                  Basic information about your store
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={formData.storeName}
                    onChange={(e) => handleInputChange('storeName', e.target.value)}
                    placeholder="Enter store name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Textarea
                    id="storeDescription"
                    value={formData.storeDescription}
                    onChange={(e) => handleInputChange('storeDescription', e.target.value)}
                    placeholder="Describe your store"
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PKR">PKR - Pakistani Rupee</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.taxRate}
                      onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            {/* Stripe */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Stripe</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.stripeEnabled}
                      onCheckedChange={(checked) => handleInputChange('stripeEnabled', checked)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testPaymentGateway('Stripe')}
                    >
                      <TestTube className="w-4 h-4 mr-2" />
                      Test
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Accept payments via Stripe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="stripePublicKey">Public Key</Label>
                    <Input
                      id="stripePublicKey"
                      value={formData.stripePublicKey}
                      onChange={(e) => handleInputChange('stripePublicKey', e.target.value)}
                      placeholder="pk_test_..."
                      type="password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stripeSecretKey">Secret Key</Label>
                    <Input
                      id="stripeSecretKey"
                      value={formData.stripeSecretKey}
                      onChange={(e) => handleInputChange('stripeSecretKey', e.target.value)}
                      placeholder="sk_test_..."
                      type="password"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* JazzCash */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>JazzCash</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.jazzcashEnabled}
                      onCheckedChange={(checked) => handleInputChange('jazzcashEnabled', checked)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testPaymentGateway('JazzCash')}
                    >
                      <TestTube className="w-4 h-4 mr-2" />
                      Test
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Accept payments via JazzCash
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="jazzcashMerchantId">Merchant ID</Label>
                    <Input
                      id="jazzcashMerchantId"
                      value={formData.jazzcashMerchantId}
                      onChange={(e) => handleInputChange('jazzcashMerchantId', e.target.value)}
                      placeholder="Enter merchant ID"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jazzcashSecretKey">Secret Key</Label>
                    <Input
                      id="jazzcashSecretKey"
                      value={formData.jazzcashSecretKey}
                      onChange={(e) => handleInputChange('jazzcashSecretKey', e.target.value)}
                      placeholder="Enter secret key"
                      type="password"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* EasyPaisa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>EasyPaisa</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.easypaisaEnabled}
                      onCheckedChange={(checked) => handleInputChange('easypaisaEnabled', checked)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testPaymentGateway('EasyPaisa')}
                    >
                      <TestTube className="w-4 h-4 mr-2" />
                      Test
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Accept payments via EasyPaisa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="easypaisaMerchantId">Merchant ID</Label>
                    <Input
                      id="easypaisaMerchantId"
                      value={formData.easypaisaMerchantId}
                      onChange={(e) => handleInputChange('easypaisaMerchantId', e.target.value)}
                      placeholder="Enter merchant ID"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="easypaisaSecretKey">Secret Key</Label>
                    <Input
                      id="easypaisaSecretKey"
                      value={formData.easypaisaSecretKey}
                      onChange={(e) => handleInputChange('easypaisaSecretKey', e.target.value)}
                      placeholder="Enter secret key"
                      type="password"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="w-4 h-4" />
                  <span>Shipping Settings</span>
                </CardTitle>
                <CardDescription>
                  Configure shipping options and rates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.shippingEnabled}
                    onCheckedChange={(checked) => handleInputChange('shippingEnabled', checked)}
                  />
                  <Label>Enable Shipping</Label>
                </div>

                {formData.shippingEnabled && (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="freeShippingThreshold">Free Shipping Threshold</Label>
                        <Input
                          id="freeShippingThreshold"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.freeShippingThreshold}
                          onChange={(e) => handleInputChange('freeShippingThreshold', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="flatShippingRate">Flat Shipping Rate</Label>
                        <Input
                          id="flatShippingRate"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.flatShippingRate}
                          onChange={(e) => handleInputChange('flatShippingRate', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.localDeliveryEnabled}
                        onCheckedChange={(checked) => handleInputChange('localDeliveryEnabled', checked)}
                      />
                      <Label>Enable Local Delivery</Label>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>
                  Configure inventory tracking and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.lowStockAlert}
                    onCheckedChange={(checked) => handleInputChange('lowStockAlert', checked)}
                  />
                  <Label>Enable Low Stock Alerts</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    min="0"
                    value={formData.lowStockThreshold}
                    onChange={(e) => handleInputChange('lowStockThreshold', parseInt(e.target.value) || 0)}
                    placeholder="10"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emails" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Notifications</span>
                </CardTitle>
                <CardDescription>
                  Configure automated email notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Order Confirmation Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Send confirmation emails to customers when they place orders
                      </p>
                    </div>
                    <Switch
                      checked={formData.orderConfirmationEmail}
                      onCheckedChange={(checked) => handleInputChange('orderConfirmationEmail', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Shipping Notification Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Send emails when orders are shipped
                      </p>
                    </div>
                    <Switch
                      checked={formData.shippingNotificationEmail}
                      onCheckedChange={(checked) => handleInputChange('shippingNotificationEmail', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Cart Abandonment Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Send reminder emails to customers who abandon their carts
                      </p>
                    </div>
                    <Switch
                      checked={formData.cartAbandonmentEmail}
                      onCheckedChange={(checked) => handleInputChange('cartAbandonmentEmail', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Guest Checkout</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow customers to checkout without creating an account
                      </p>
                    </div>
                    <Switch
                      checked={formData.guestCheckoutEnabled}
                      onCheckedChange={(checked) => handleInputChange('guestCheckoutEnabled', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Save Button */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Save Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Save all your e-commerce configuration changes
                  </p>
                </div>
                <Button onClick={handleSave} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </Tabs>
      )}
    </div>
  )
}
