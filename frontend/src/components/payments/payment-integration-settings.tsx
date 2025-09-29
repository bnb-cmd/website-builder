'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react'

interface PaymentGateway {
  id: string
  name: string
  type: 'JAZZCASH' | 'EASYPAISA' | 'BANK_TRANSFER' | 'STRIPE'
  isActive: boolean
  settings: {
    merchantId?: string
    merchantPassword?: string
    apiKey?: string
    displayName?: string
    [key: string]: any
  }
}

interface PaymentIntegrationSettingsProps {
  websiteId: string
  onSave: (gateways: PaymentGateway[]) => void
}

export function PaymentIntegrationSettings({ websiteId, onSave }: PaymentIntegrationSettingsProps) {
  const [gateways, setGateways] = useState<PaymentGateway[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [newGateway, setNewGateway] = useState<Partial<PaymentGateway> | null>(null)

  const availableGateways = [
    { value: 'JAZZCASH', label: 'JazzCash', description: 'Mobile wallet payments', icon: Smartphone },
    { value: 'EASYPAISA', label: 'EasyPaisa', description: 'Mobile wallet payments', icon: Smartphone },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer', description: 'Direct bank transfer', icon: Building2 },
    { value: 'STRIPE', label: 'Credit Card', description: 'International cards', icon: CreditCard }
  ]

  useEffect(() => {
    loadPaymentGateways()
  }, [websiteId])

  const loadPaymentGateways = async () => {
    setIsLoading(true)
    try {
      // Mock data - in real implementation, this would call the API
      const mockGateways: PaymentGateway[] = [
        {
          id: '1',
          name: 'JazzCash',
          type: 'JAZZCASH',
          isActive: true,
          settings: {
            merchantId: 'JC123456',
            merchantPassword: '••••••••',
            displayName: 'JazzCash Payments'
          }
        }
      ]
      setGateways(mockGateways)
    } catch (error) {
      console.error('Failed to load payment gateways:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(gateways)
    } catch (error) {
      console.error('Failed to save payment gateways:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleGateway = (gatewayId: string) => {
    setGateways(prev => 
      prev.map(gateway => 
        gateway.id === gatewayId 
          ? { ...gateway, isActive: !gateway.isActive }
          : gateway
      )
    )
  }

  const handleUpdateGateway = (gatewayId: string, field: string, value: any) => {
    setGateways(prev => 
      prev.map(gateway => 
        gateway.id === gatewayId 
          ? { 
              ...gateway, 
              settings: { ...gateway.settings, [field]: value }
            }
          : gateway
      )
    )
  }

  const handleAddGateway = () => {
    if (newGateway?.type) {
      const gatewayConfig = availableGateways.find(g => g.value === newGateway.type)
      const newGatewayData: PaymentGateway = {
        id: Date.now().toString(),
        name: gatewayConfig?.label || '',
        type: newGateway.type as any,
        isActive: false,
        settings: {}
      }
      setGateways(prev => [...prev, newGatewayData])
      setNewGateway(null)
    }
  }

  const handleRemoveGateway = (gatewayId: string) => {
    setGateways(prev => prev.filter(gateway => gateway.id !== gatewayId))
  }

  const toggleSecretVisibility = (gatewayId: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [gatewayId]: !prev[gatewayId]
    }))
  }

  const getGatewayIcon = (type: string) => {
    const gateway = availableGateways.find(g => g.value === type)
    const IconComponent = gateway?.icon || CreditCard
    return <IconComponent className="w-5 h-5" />
  }

  const getGatewayDescription = (type: string) => {
    const gateway = availableGateways.find(g => g.value === type)
    return gateway?.description || ''
  }

  const renderGatewaySettings = (gateway: PaymentGateway) => {
    switch (gateway.type) {
      case 'JAZZCASH':
      case 'EASYPAISA':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor={`merchantId-${gateway.id}`}>Merchant ID</Label>
              <Input
                id={`merchantId-${gateway.id}`}
                value={gateway.settings.merchantId || ''}
                onChange={(e) => handleUpdateGateway(gateway.id, 'merchantId', e.target.value)}
                placeholder="Enter merchant ID"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor={`merchantPassword-${gateway.id}`}>Merchant Password</Label>
              <div className="relative mt-1">
                <Input
                  id={`merchantPassword-${gateway.id}`}
                  type={showSecrets[gateway.id] ? 'text' : 'password'}
                  value={gateway.settings.merchantPassword || ''}
                  onChange={(e) => handleUpdateGateway(gateway.id, 'merchantPassword', e.target.value)}
                  placeholder="Enter merchant password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => toggleSecretVisibility(gateway.id)}
                >
                  {showSecrets[gateway.id] ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor={`displayName-${gateway.id}`}>Display Name</Label>
              <Input
                id={`displayName-${gateway.id}`}
                value={gateway.settings.displayName || ''}
                onChange={(e) => handleUpdateGateway(gateway.id, 'displayName', e.target.value)}
                placeholder="Payment method name"
                className="mt-1"
              />
            </div>
          </div>
        )

      case 'STRIPE':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor={`apiKey-${gateway.id}`}>API Key</Label>
              <div className="relative mt-1">
                <Input
                  id={`apiKey-${gateway.id}`}
                  type={showSecrets[gateway.id] ? 'text' : 'password'}
                  value={gateway.settings.apiKey || ''}
                  onChange={(e) => handleUpdateGateway(gateway.id, 'apiKey', e.target.value)}
                  placeholder="sk_test_..."
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => toggleSecretVisibility(gateway.id)}
                >
                  {showSecrets[gateway.id] ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor={`displayName-${gateway.id}`}>Display Name</Label>
              <Input
                id={`displayName-${gateway.id}`}
                value={gateway.settings.displayName || ''}
                onChange={(e) => handleUpdateGateway(gateway.id, 'displayName', e.target.value)}
                placeholder="Credit Card Payments"
                className="mt-1"
              />
            </div>
          </div>
        )

      case 'BANK_TRANSFER':
        return (
          <div className="space-y-4">
            <Alert>
              <Building2 className="h-4 w-4" />
              <AlertDescription>
                Bank transfer details will be displayed to customers. 
                Make sure to provide accurate information.
              </AlertDescription>
            </Alert>
            
            <div>
              <Label htmlFor={`displayName-${gateway.id}`}>Display Name</Label>
              <Input
                id={`displayName-${gateway.id}`}
                value={gateway.settings.displayName || ''}
                onChange={(e) => handleUpdateGateway(gateway.id, 'displayName', e.target.value)}
                placeholder="Bank Transfer"
                className="mt-1"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payment Integration</h2>
          <p className="text-gray-600">
            Configure payment gateways for your website
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4 mr-2" />
          )}
          Save Settings
        </Button>
      </div>

      {/* Active Gateways */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Configured Payment Methods</h3>
        
        {gateways.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No Payment Methods</h3>
              <p className="text-gray-600 mb-4">
                Add payment gateways to accept payments on your website
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {gateways.map((gateway) => (
              <Card key={gateway.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getGatewayIcon(gateway.type)}
                      <div>
                        <CardTitle className="text-lg">{gateway.name}</CardTitle>
                        <CardDescription>
                          {getGatewayDescription(gateway.type)}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={gateway.isActive ? 'default' : 'secondary'}>
                        {gateway.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Switch
                        checked={gateway.isActive}
                        onCheckedChange={() => handleToggleGateway(gateway.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveGateway(gateway.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {renderGatewaySettings(gateway)}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add New Gateway */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Payment Method</span>
          </CardTitle>
          <CardDescription>
            Add a new payment gateway to your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Payment Gateway</Label>
              <Select 
                value={newGateway?.type || ''} 
                onValueChange={(value) => setNewGateway({ type: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select payment gateway" />
                </SelectTrigger>
                <SelectContent>
                  {availableGateways.map((gateway) => (
                    <SelectItem key={gateway.value} value={gateway.value}>
                      <div className="flex items-center space-x-2">
                        <gateway.icon className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{gateway.label}</div>
                          <div className="text-sm text-gray-600">{gateway.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleAddGateway}
              disabled={!newGateway?.type}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Information */}
      <Alert>
        <Settings className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Make sure to test your payment integration 
          before going live. Use sandbox/test credentials for development.
        </AlertDescription>
      </Alert>
    </div>
  )
}
