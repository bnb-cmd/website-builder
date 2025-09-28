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
  Code,
  Download,
  Upload,
  Key,
  Globe,
  Users,
  BarChart,
  Settings,
  Copy,
  Eye,
  Play,
  Terminal,
  Package,
  BookOpen,
  Zap
} from 'lucide-react'

interface DeveloperPortalPanelProps {
  onClose?: () => void
}

interface DeveloperApp {
  id: string
  name: string
  description: string
  apiKey: string
  status: 'active' | 'inactive' | 'pending'
  permissions: string[]
  usage: {
    requests: number
    limit: number
    resetDate: Date
  }
  createdAt: Date
}

interface APIDocumentation {
  id: string
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  description: string
  parameters: Array<{
    name: string
    type: string
    required: boolean
    description: string
  }>
  example: string
}

export function DeveloperPortalPanel({ onClose }: DeveloperPortalPanelProps) {
  const [apps, setApps] = useState<DeveloperApp[]>([
    {
      id: 'app_1',
      name: 'Website Analytics App',
      description: 'Custom analytics integration for client websites',
      apiKey: 'pk_live_51H...abc123',
      status: 'active',
      permissions: ['websites:read', 'analytics:write', 'users:read'],
      usage: {
        requests: 15420,
        limit: 50000,
        resetDate: new Date('2024-04-01')
      },
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'app_2',
      name: 'Form Builder Integration',
      description: 'Custom form handling and data collection',
      apiKey: 'pk_test_51H...def456',
      status: 'pending',
      permissions: ['forms:write', 'data:read'],
      usage: {
        requests: 0,
        limit: 10000,
        resetDate: new Date('2024-04-01')
      },
      createdAt: new Date('2024-03-01')
    }
  ])

  const [apiDocs, setApiDocs] = useState<APIDocumentation[]>([
    {
      id: 'api_1',
      endpoint: '/api/v1/websites',
      method: 'GET',
      description: 'Retrieve all websites for authenticated user',
      parameters: [
        { name: 'page', type: 'number', required: false, description: 'Page number for pagination' },
        { name: 'limit', type: 'number', required: false, description: 'Number of items per page' }
      ],
      example: `curl -X GET "https://api.websitebuilder.pk/v1/websites" \\
  -H "Authorization: Bearer YOUR_API_KEY"`
    },
    {
      id: 'api_2',
      endpoint: '/api/v1/websites/{id}',
      method: 'PUT',
      description: 'Update website content and settings',
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Website ID' },
        { name: 'title', type: 'string', required: false, description: 'Website title' },
        { name: 'content', type: 'object', required: false, description: 'Website content structure' }
      ],
      example: `curl -X PUT "https://api.websitebuilder.pk/v1/websites/123" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Updated Website Title"}'`
    }
  ])

  const [newApp, setNewApp] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  })

  const [isTestingAPI, setIsTestingAPI] = useState<string | null>(null)

  const createApp = () => {
    if (!newApp.name.trim()) return

    const app: DeveloperApp = {
      id: `app_${Date.now()}`,
      name: newApp.name,
      description: newApp.description,
      apiKey: `pk_${Math.random().toString(36).substring(2, 15)}`,
      status: 'pending',
      permissions: newApp.permissions,
      usage: {
        requests: 0,
        limit: 10000,
        resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      },
      createdAt: new Date()
    }

    setApps([...apps, app])
    setNewApp({ name: '', description: '', permissions: [] })
  }

  const toggleAppStatus = (id: string) => {
    setApps(apps.map(app => 
      app.id === id ? { 
        ...app, 
        status: app.status === 'active' ? 'inactive' : 'active' 
      } : app
    ))
  }

  const testAPI = async (endpoint: string) => {
    setIsTestingAPI(endpoint)
    // Simulate API test
    setTimeout(() => {
      setIsTestingAPI(null)
    }, 2000)
  }

  const getStatusColor = (status: DeveloperApp['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'inactive': return 'bg-red-500'
      default: return 'bg-yellow-500'
    }
  }

  const getMethodColor = (method: APIDocumentation['method']) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800'
      case 'POST': return 'bg-slate-100 text-slate-900'
      case 'PUT': return 'bg-yellow-100 text-yellow-800'
      case 'DELETE': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Code className="h-5 w-5" />
            Developer Portal
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
          Build custom apps and integrations with our API.
        </p>
      </div>

      <Tabs defaultValue="apps" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="apps">My Apps</TabsTrigger>
          <TabsTrigger value="api">API Docs</TabsTrigger>
          <TabsTrigger value="sdk">SDK</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="apps" className="p-4 mt-0">
            <div className="space-y-4">
              {/* Create New App */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Create New App</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>App Name</Label>
                      <Input
                        placeholder="e.g., 'Custom Analytics Integration'"
                        value={newApp.name}
                        onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <textarea
                        placeholder="Describe what your app does..."
                        value={newApp.description}
                        onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                        className="w-full p-2 border border-border rounded-md text-sm bg-background"
                        rows={3}
                      />
                    </div>
                    <Button className="w-full" onClick={createApp}>
                      <Package className="h-4 w-4 mr-2" />
                      Create App
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Existing Apps */}
              <div className="space-y-3">
                <h4 className="font-medium">My Applications</h4>
                {apps.map(app => (
                  <Card key={app.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold">{app.name}</p>
                          <p className="text-sm text-muted-foreground">{app.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(app.status)}`} />
                          <Badge variant="outline">{app.status}</Badge>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span>API Key:</span>
                          <div className="flex items-center gap-1">
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {app.apiKey.substring(0, 20)}...
                            </code>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Usage:</span>
                          <span>{app.usage.requests.toLocaleString()} / {app.usage.limit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Permissions:</span>
                          <div className="flex gap-1">
                            {app.permissions.slice(0, 2).map(perm => (
                              <Badge key={perm} variant="secondary" className="text-xs">
                                {perm}
                              </Badge>
                            ))}
                            {app.permissions.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{app.permissions.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleAppStatus(app.id)}
                        >
                          {app.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="api" className="p-4 mt-0">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">API Documentation</h4>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download SDK
                </Button>
              </div>

              {apiDocs.map(doc => (
                <Card key={doc.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getMethodColor(doc.method)}>
                          {doc.method}
                        </Badge>
                        <code className="text-sm font-mono">{doc.endpoint}</code>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => testAPI(doc.endpoint)}
                        disabled={isTestingAPI === doc.endpoint}
                      >
                        {isTestingAPI === doc.endpoint ? (
                          <Play className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>

                    {doc.parameters.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-2">Parameters:</p>
                        <div className="space-y-1">
                          {doc.parameters.map((param, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                {param.name}
                              </code>
                              <span className="text-muted-foreground">
                                ({param.type}{param.required ? ', required' : ', optional'})
                              </span>
                              <span className="text-xs text-muted-foreground">
                                - {param.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium mb-2">Example:</p>
                      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                        <code>{doc.example}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sdk" className="p-4 mt-0">
            <div className="space-y-4">
              <h4 className="font-medium">SDK Downloads</h4>
              
              <div className="grid gap-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Code className="h-5 w-5 text-slate-900" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">JavaScript SDK</p>
                        <p className="text-sm text-muted-foreground">For web applications</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Terminal className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Node.js SDK</p>
                        <p className="text-sm text-muted-foreground">For server-side applications</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Package className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Python SDK</p>
                        <p className="text-sm text-muted-foreground">For Python applications</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-4">
                  <h5 className="font-medium mb-2">Quick Start</h5>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <p className="font-medium">1. Install SDK:</p>
                      <code className="text-xs bg-muted p-1 rounded">npm install @websitebuilder/sdk</code>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">2. Initialize:</p>
                      <code className="text-xs bg-muted p-1 rounded">const client = new WebsiteBuilder('YOUR_API_KEY')</code>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">3. Make requests:</p>
                      <code className="text-xs bg-muted p-1 rounded">const websites = await client.websites.list()</code>
                    </div>
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
