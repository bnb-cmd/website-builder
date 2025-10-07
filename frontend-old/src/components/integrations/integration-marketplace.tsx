'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Search, 
  Plus, 
  Settings, 
  Play, 
  Pause, 
  Trash2, 
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  DollarSign,
  Star
} from 'lucide-react'
import { apiHelpers } from '@/lib/api'
import { toast } from 'react-hot-toast'

interface Integration {
  id: string
  name: string
  description?: string
  category: string
  provider: string
  iconUrl?: string
  websiteUrl?: string
  apiVersion?: string
  documentationUrl?: string
  authType: string
  status: string
  isPremium: boolean
  price?: number
  features: string[]
  tags: string[]
}

interface WebsiteIntegration {
  id: string
  websiteId: string
  integrationId: string
  config: any
  status: string
  isEnabled: boolean
  lastUsedAt?: string
  usageCount: number
  lastError?: string
  errorCount: number
  integration: Integration
}

interface IntegrationMarketplaceProps {
  websiteId: string
}

export function IntegrationMarketplace({ websiteId }: IntegrationMarketplaceProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [installedIntegrations, setInstalledIntegrations] = useState<WebsiteIntegration[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isInstallDialogOpen, setIsInstallDialogOpen] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [loading, setLoading] = useState(true)

  const categories = [
    'ANALYTICS',
    'PAYMENT', 
    'EMAIL',
    'SOCIAL_MEDIA',
    'CRM',
    'ECOMMERCE',
    'MARKETING',
    'CUSTOMER_SUPPORT',
    'PRODUCTIVITY',
    'OTHER'
  ]

  useEffect(() => {
    fetchIntegrations()
    fetchInstalledIntegrations()
  }, [websiteId])

  const fetchIntegrations = async () => {
    try {
      const response = await apiHelpers.getIntegrations({ category: selectedCategory || undefined })
      setIntegrations(response.data.data || [])
    } catch (error) {
      toast.error('Failed to fetch integrations')
    } finally {
      setLoading(false)
    }
  }

  const fetchInstalledIntegrations = async () => {
    try {
      const response = await apiHelpers.getInstalledIntegrations(websiteId)
      setInstalledIntegrations(response.data.data || [])
    } catch (error) {
      toast.error('Failed to fetch installed integrations')
    }
  }

  const installIntegration = async (integration: Integration) => {
    try {
      // Mock configuration - in reality, this would be a form
      const config = { enabled: true }
      const credentials = { apiKey: 'mock-api-key' }
      
      await apiHelpers.installIntegration(websiteId, {
        integrationId: integration.id,
        config,
        credentials
      })
      
      toast.success(`${integration.name} installed successfully!`)
      setIsInstallDialogOpen(false)
      fetchInstalledIntegrations()
    } catch (error) {
      toast.error('Failed to install integration')
    }
  }

  const toggleIntegration = async (websiteIntegrationId: string, isEnabled: boolean) => {
    try {
      await apiHelpers.toggleIntegration(websiteIntegrationId, { isEnabled })
      toast.success(`Integration ${isEnabled ? 'enabled' : 'disabled'}`)
      fetchInstalledIntegrations()
    } catch (error) {
      toast.error('Failed to toggle integration')
    }
  }

  const uninstallIntegration = async (websiteIntegrationId: string) => {
    try {
      await apiHelpers.uninstallIntegration(websiteIntegrationId)
      toast.success('Integration uninstalled')
      fetchInstalledIntegrations()
    } catch (error) {
      toast.error('Failed to uninstall integration')
    }
  }

  const testIntegration = async (websiteIntegrationId: string) => {
    try {
      const response = await apiHelpers.testIntegration(websiteIntegrationId)
      const result = response.data.data
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Failed to test integration')
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ANALYTICS': return <BarChart3 className="h-4 w-4" />
      case 'PAYMENT': return <DollarSign className="h-4 w-4" />
      case 'EMAIL': return <Mail className="h-4 w-4" />
      case 'SOCIAL_MEDIA': return <Users className="h-4 w-4" />
      case 'CRM': return <Target className="h-4 w-4" />
      case 'ECOMMERCE': return <ShoppingCart className="h-4 w-4" />
      case 'MARKETING': return <Zap className="h-4 w-4" />
      case 'CUSTOMER_SUPPORT': return <Headphones className="h-4 w-4" />
      case 'PRODUCTIVITY': return <Settings className="h-4 w-4" />
      default: return <ExternalLink className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'INACTIVE': return <XCircle className="h-4 w-4 text-red-600" />
      case 'BETA': return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = !selectedCategory || integration.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Integration Marketplace</h1>
          <p className="text-muted-foreground">Connect your website with powerful third-party services</p>
        </div>
      </div>

      <Tabs defaultValue="marketplace" className="space-y-6">
        <TabsList>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="installed">Installed ({installedIntegrations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search integrations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {integration.iconUrl ? (
                        <img src={integration.iconUrl} alt={integration.name} className="h-8 w-8" />
                      ) : (
                        <div className="h-8 w-8 bg-primary/10 rounded flex items-center justify-center">
                          {getCategoryIcon(integration.category)}
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <CardDescription>{integration.provider}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.isPremium && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          Premium
                        </Badge>
                      )}
                      {getStatusIcon(integration.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {integration.description}
                    </p>
                    
                    <div className="flex gap-1 flex-wrap">
                      {integration.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        {getCategoryIcon(integration.category)}
                        <span>{integration.category.replace('_', ' ')}</span>
                      </div>
                      {integration.price && (
                        <div className="text-sm font-medium">
                          {integration.price} PKR
                        </div>
                      )}
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => {
                        setSelectedIntegration(integration)
                        setIsInstallDialogOpen(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Install
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="installed" className="space-y-6">
          {/* Installed Integrations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {installedIntegrations.map((websiteIntegration) => (
              <Card key={websiteIntegration.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {websiteIntegration.integration.iconUrl ? (
                        <img 
                          src={websiteIntegration.integration.iconUrl} 
                          alt={websiteIntegration.integration.name} 
                          className="h-8 w-8" 
                        />
                      ) : (
                        <div className="h-8 w-8 bg-primary/10 rounded flex items-center justify-center">
                          {getCategoryIcon(websiteIntegration.integration.category)}
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">{websiteIntegration.integration.name}</CardTitle>
                        <CardDescription>{websiteIntegration.integration.provider}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={websiteIntegration.isEnabled}
                        onCheckedChange={(checked) => toggleIntegration(websiteIntegration.id, checked)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={websiteIntegration.isEnabled ? 'default' : 'secondary'}>
                        {websiteIntegration.isEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Usage:</span>
                      <span>{websiteIntegration.usageCount} times</span>
                    </div>

                    {websiteIntegration.lastError && (
                      <div className="text-sm text-red-600">
                        Last Error: {websiteIntegration.lastError}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => testIntegration(websiteIntegration.id)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Test
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {/* Open settings dialog */}}
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Settings
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => uninstallIntegration(websiteIntegration.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Install Dialog */}
      <Dialog open={isInstallDialogOpen} onOpenChange={setIsInstallDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install {selectedIntegration?.name}</DialogTitle>
            <DialogDescription>
              Configure and install this integration for your website.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedIntegration && (
              <>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">{selectedIntegration.description}</p>
                  <div className="flex gap-2 mt-2">
                    {selectedIntegration.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsInstallDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => installIntegration(selectedIntegration)}>
                    Install Integration
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
