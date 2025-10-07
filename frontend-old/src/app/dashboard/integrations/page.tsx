'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  Zap,
  Settings,
  CheckCircle,
  AlertCircle,
  Plus,
  ExternalLink,
  Trash2,
  Edit,
  Play,
  Pause,
  RefreshCw,
  Search,
  Filter,
  Globe,
  Mail,
  CreditCard,
  BarChart3,
  Users,
  Calendar,
  FileText,
  Image,
  Video,
  Music,
  Database,
  Cloud,
  Shield,
  Lock,
  Unlock,
  MessageSquare
} from 'lucide-react'

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState('connected')
  const [searchQuery, setSearchQuery] = useState('')

  const connectedIntegrations = [
    {
      id: 1,
      name: 'Google Analytics',
      description: 'Track website performance and user behavior',
      category: 'Analytics',
      icon: BarChart3,
      status: 'active',
      lastSync: '2024-01-15T10:30:00Z',
      color: 'text-orange-500'
    },
    {
      id: 2,
      name: 'Mailchimp',
      description: 'Email marketing and newsletter management',
      category: 'Marketing',
      icon: Mail,
      status: 'active',
      lastSync: '2024-01-15T09:15:00Z',
      color: 'text-blue-500'
    },
    {
      id: 3,
      name: 'Stripe',
      description: 'Payment processing for e-commerce',
      category: 'Payments',
      icon: CreditCard,
      status: 'active',
      lastSync: '2024-01-14T16:45:00Z',
      color: 'text-purple-500'
    },
    {
      id: 4,
      name: 'Google Drive',
      description: 'File storage and document management',
      category: 'Storage',
      icon: Cloud,
      status: 'paused',
      lastSync: '2024-01-10T14:20:00Z',
      color: 'text-green-500'
    }
  ]

  const availableIntegrations = [
    {
      id: 5,
      name: 'Facebook Pixel',
      description: 'Track conversions and optimize Facebook ads',
      category: 'Marketing',
      icon: Users,
      color: 'text-blue-600',
      popular: true
    },
    {
      id: 6,
      name: 'HubSpot',
      description: 'CRM and marketing automation platform',
      category: 'CRM',
      icon: Users,
      color: 'text-orange-500',
      popular: true
    },
    {
      id: 7,
      name: 'Zapier',
      description: 'Automate workflows between apps',
      category: 'Automation',
      icon: Zap,
      color: 'text-red-500',
      popular: false
    },
    {
      id: 8,
      name: 'Slack',
      description: 'Team communication and notifications',
      category: 'Communication',
      icon: MessageSquare,
      color: 'text-purple-500',
      popular: false
    },
    {
      id: 9,
      name: 'Dropbox',
      description: 'Cloud storage and file sharing',
      category: 'Storage',
      icon: Cloud,
      color: 'text-blue-500',
      popular: false
    },
    {
      id: 10,
      name: 'Calendly',
      description: 'Schedule meetings and appointments',
      category: 'Scheduling',
      icon: Calendar,
      color: 'text-green-500',
      popular: false
    }
  ]

  const categories = [
    'All',
    'Analytics',
    'Marketing',
    'Payments',
    'Storage',
    'CRM',
    'Automation',
    'Communication',
    'Scheduling'
  ]

  const filteredAvailable = availableIntegrations.filter(integration =>
    integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    integration.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleConnect = (integrationId: number) => {
    console.log(`Connecting integration ${integrationId}`)
  }

  const handleDisconnect = (integrationId: number) => {
    console.log(`Disconnecting integration ${integrationId}`)
  }

  const handleToggleStatus = (integrationId: number) => {
    console.log(`Toggling status for integration ${integrationId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-500" />
            Integrations
          </h1>
          <p className="text-muted-foreground">
            Connect your favorite tools and services to enhance your website
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh All
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      {/* Integration Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {connectedIntegrations.filter(i => i.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Active integrations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableIntegrations.length}</div>
            <p className="text-xs text-muted-foreground">Ready to connect</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2m</div>
            <p className="text-xs text-muted-foreground">Minutes ago</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Flow</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2K</div>
            <p className="text-xs text-muted-foreground">Records today</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="connected">Connected ({connectedIntegrations.length})</TabsTrigger>
          <TabsTrigger value="available">Available ({availableIntegrations.length})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="connected" className="space-y-6">
          {/* Connected Integrations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connected Integrations</h3>
            {connectedIntegrations.map((integration) => (
              <Card key={integration.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <integration.icon className={`h-8 w-8 ${integration.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium">{integration.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {integration.category}
                          </Badge>
                          <Badge 
                            variant={integration.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {integration.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Last sync: {new Date(integration.lastSync).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={integration.status === 'active'} 
                        onCheckedChange={() => handleToggleStatus(integration.id)}
                      />
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === 'All' ? 'default' : 'outline'}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Available Integrations */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAvailable.map((integration) => (
              <Card key={integration.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <integration.icon className={`h-6 w-6 ${integration.color}`} />
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                    </div>
                    {integration.popular && (
                      <Badge variant="secondary" className="text-xs">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Category</span>
                      <Badge variant="outline">{integration.category}</Badge>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => handleConnect(integration.id)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Integration Settings
              </CardTitle>
              <CardDescription>
                Configure global settings for your integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto-sync</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically sync data every hour
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Error Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Get notified when integrations fail
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Data Encryption</h4>
                    <p className="text-sm text-muted-foreground">
                      Encrypt all data transferred between integrations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Debug Mode</h4>
                    <p className="text-sm text-muted-foreground">
                      Enable detailed logging for troubleshooting
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
