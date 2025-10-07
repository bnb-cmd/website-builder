'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Palette,
  Upload,
  Eye,
  Save,
  Settings,
  Globe,
  Shield,
  Users,
  CreditCard,
  Mail,
  MessageSquare,
  Download,
  Copy,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

interface WhiteLabelPanelProps {
  onClose?: () => void
}

interface WhiteLabelConfig {
  id: string
  agencyName: string
  logo: string
  primaryColor: string
  secondaryColor: string
  domain: string
  customCss: string
  features: {
    removeBranding: boolean
    customDomain: boolean
    customEmail: boolean
    customSupport: boolean
    customAnalytics: boolean
    customPayments: boolean
  }
  pricing: {
    plan: 'basic' | 'pro' | 'enterprise'
    monthlyFee: number
    setupFee: number
    transactionFee: number
  }
  status: 'draft' | 'active' | 'suspended'
}

export function WhiteLabelPanel({ onClose }: WhiteLabelPanelProps) {
  const [configs, setConfigs] = useState<WhiteLabelConfig[]>([
    {
      id: 'wl_1',
      agencyName: 'Digital Solutions PK',
      logo: '',
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      domain: 'builder.digitalsolutions.pk',
      customCss: '',
      features: {
        removeBranding: true,
        customDomain: true,
        customEmail: false,
        customSupport: false,
        customAnalytics: true,
        customPayments: false
      },
      pricing: {
        plan: 'pro',
        monthlyFee: 299,
        setupFee: 500,
        transactionFee: 2.5
      },
      status: 'active'
    }
  ])

  const [newConfig, setNewConfig] = useState<Partial<WhiteLabelConfig>>({
    agencyName: '',
    logo: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    domain: '',
    customCss: '',
    features: {
      removeBranding: true,
      customDomain: false,
      customEmail: false,
      customSupport: false,
      customAnalytics: false,
      customPayments: false
    },
    pricing: {
      plan: 'basic',
      monthlyFee: 99,
      setupFee: 200,
      transactionFee: 3.5
    },
    status: 'draft'
  })

  const [isPreviewing, setIsPreviewing] = useState<string | null>(null)

  const addConfig = () => {
    if (!newConfig.agencyName || !newConfig.domain) return

    const config: WhiteLabelConfig = {
      id: `wl_${Date.now()}`,
      agencyName: newConfig.agencyName!,
      logo: newConfig.logo!,
      primaryColor: newConfig.primaryColor!,
      secondaryColor: newConfig.secondaryColor!,
      domain: newConfig.domain!,
      customCss: newConfig.customCss!,
      features: newConfig.features!,
      pricing: newConfig.pricing!,
      status: newConfig.status!
    }

    setConfigs([...configs, config])
    setNewConfig({
      agencyName: '',
      logo: '',
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      domain: '',
      customCss: '',
      features: {
        removeBranding: true,
        customDomain: false,
        customEmail: false,
        customSupport: false,
        customAnalytics: false,
        customPayments: false
      },
      pricing: {
        plan: 'basic',
        monthlyFee: 99,
        setupFee: 200,
        transactionFee: 3.5
      },
      status: 'draft'
    })
  }

  const toggleConfigStatus = (id: string) => {
    setConfigs(configs.map(c => 
      c.id === id ? { 
        ...c, 
        status: c.status === 'active' ? 'suspended' : 'active' 
      } : c
    ))
  }

  const previewConfig = (id: string) => {
    setIsPreviewing(isPreviewing === id ? null : id)
  }

  const getStatusColor = (status: WhiteLabelConfig['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'suspended': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getPlanColor = (plan: WhiteLabelConfig['pricing']['plan']) => {
    switch (plan) {
      case 'basic': return 'bg-blue-900'
      case 'pro': return 'bg-purple-500'
      case 'enterprise': return 'bg-gold-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Palette className="h-5 w-5" />
            White-Label Solutions
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            ×
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Allow agencies to rebrand the platform as their own.
        </p>
      </div>

      <Tabs defaultValue="configs" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="configs">Configurations</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="configs" className="p-4 mt-0">
            <div className="space-y-4">
              {configs.length > 0 ? (
                configs.map(config => (
                  <Card key={config.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: config.primaryColor }}
                          >
                            {config.agencyName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold">{config.agencyName}</p>
                            <p className="text-sm text-muted-foreground">{config.domain}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(config.status)}`} />
                          <Badge variant="outline" className="ml-2">
                            {config.pricing.plan}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span>Monthly Fee:</span>
                          <span className="font-medium">${config.pricing.monthlyFee}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Setup Fee:</span>
                          <span className="font-medium">${config.pricing.setupFee}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Transaction Fee:</span>
                          <span className="font-medium">{config.pricing.transactionFee}%</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <p className="text-sm font-medium">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(config.features).map(([key, enabled]) => (
                            enabled && (
                              <Badge key={key} variant="secondary" className="text-xs">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </Badge>
                            )
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => previewConfig(config.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleConfigStatus(config.id)}
                        >
                          {config.status === 'active' ? 'Suspend' : 'Activate'}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>

                      {isPreviewing === config.id && (
                        <div className="mt-4 p-3 border rounded-md bg-muted/50">
                          <p className="text-sm font-medium mb-2">Preview:</p>
                          <div className="text-xs space-y-1">
                            <p>• Brand: {config.agencyName}</p>
                            <p>• Domain: {config.domain}</p>
                            <p>• Colors: {config.primaryColor} / {config.secondaryColor}</p>
                            <p>• Status: {config.status}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground py-8">
                  No white-label configurations yet.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="create" className="p-4 mt-0">
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Create White-Label Configuration</h4>
                  <div className="space-y-4">
                    <div>
                      <Label>Agency Name</Label>
                      <Input
                        placeholder="e.g., 'Digital Solutions PK'"
                        value={newConfig.agencyName}
                        onChange={(e) => setNewConfig({ ...newConfig, agencyName: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label>Custom Domain</Label>
                      <Input
                        placeholder="e.g., 'builder.yourcompany.com'"
                        value={newConfig.domain}
                        onChange={(e) => setNewConfig({ ...newConfig, domain: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Primary Color</Label>
                        <Input
                          type="color"
                          value={newConfig.primaryColor}
                          onChange={(e) => setNewConfig({ ...newConfig, primaryColor: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Secondary Color</Label>
                        <Input
                          type="color"
                          value={newConfig.secondaryColor}
                          onChange={(e) => setNewConfig({ ...newConfig, secondaryColor: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Pricing Plan</Label>
                      <Select
                        value={newConfig.pricing?.plan}
                        onValueChange={(value: WhiteLabelConfig['pricing']['plan']) => 
                          setNewConfig({ 
                            ...newConfig, 
                            pricing: { ...newConfig.pricing!, plan: value }
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic - $99/month</SelectItem>
                          <SelectItem value="pro">Pro - $299/month</SelectItem>
                          <SelectItem value="enterprise">Enterprise - $599/month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Features</Label>
                      <div className="space-y-2 mt-2">
                        {Object.entries(newConfig.features || {}).map(([key, enabled]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Switch
                              checked={enabled}
                              onCheckedChange={(checked) => 
                                setNewConfig({
                                  ...newConfig,
                                  features: { ...newConfig.features!, [key]: checked }
                                })
                              }
                            />
                            <Label className="text-sm">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Custom CSS</Label>
                      <textarea
                        placeholder="/* Custom CSS for white-label styling */"
                        value={newConfig.customCss}
                        onChange={(e) => setNewConfig({ ...newConfig, customCss: e.target.value })}
                        className="w-full p-2 border border-border rounded-md text-sm bg-background font-mono"
                        rows={4}
                      />
                    </div>

                    <Button className="w-full" onClick={addConfig}>
                      <Save className="h-4 w-4 mr-2" />
                      Create Configuration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
