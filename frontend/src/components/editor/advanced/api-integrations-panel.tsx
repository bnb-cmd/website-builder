'use client'

import { useState } from 'react'
import { Element } from '@/types/editor'
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
  Webhook,
  Plus,
  Trash2,
  Copy,
  Settings,
  TestTube,
  CheckCircle,
  AlertTriangle,
  Zap,
  Database,
  Mail,
  MessageSquare,
  Calendar,
  CreditCard,
  MapPin,
  Users
} from 'lucide-react'

interface APIIntegrationsPanelProps {
  element: Element
  onUpdateElement: (elementId: string, updates: Partial<Element>) => void
  onClose?: () => void
}

interface APIIntegration {
  id: string
  name: string
  type: 'webhook' | 'api' | 'form-submission' | 'analytics' | 'payment' | 'email' | 'sms' | 'calendar' | 'maps' | 'social'
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers: Record<string, string>
  payload: string
  isActive: boolean
  trigger: 'onSubmit' | 'onClick' | 'onLoad' | 'onCustom'
  testResult?: { success: boolean; response: string; timestamp: Date }
}

const integrationTypes = [
  { value: 'webhook', label: 'Webhook', icon: Webhook, description: 'Send data to external URLs' },
  { value: 'api', label: 'REST API', icon: Database, description: 'Connect to REST APIs' },
  { value: 'form-submission', label: 'Form Submission', icon: Settings, description: 'Handle form data' },
  { value: 'analytics', label: 'Analytics', icon: Zap, description: 'Track user behavior' },
  { value: 'payment', label: 'Payment', icon: CreditCard, description: 'Process payments' },
  { value: 'email', label: 'Email Service', icon: Mail, description: 'Send emails' },
  { value: 'sms', label: 'SMS Service', icon: MessageSquare, description: 'Send SMS messages' },
  { value: 'calendar', label: 'Calendar', icon: Calendar, description: 'Manage events' },
  { value: 'maps', label: 'Maps', icon: MapPin, description: 'Location services' },
  { value: 'social', label: 'Social Media', icon: Users, description: 'Social integrations' }
]

export function APIIntegrationsPanel({ element, onUpdateElement, onClose }: APIIntegrationsPanelProps) {
  const [integrations, setIntegrations] = useState<APIIntegration[]>(
    element.apiIntegrations || []
  )
  const [newIntegration, setNewIntegration] = useState<Partial<APIIntegration>>({
    name: '',
    type: 'webhook',
    endpoint: '',
    method: 'POST',
    headers: {},
    payload: '{}',
    isActive: true,
    trigger: 'onSubmit'
  })
  const [isTesting, setIsTesting] = useState<string | null>(null)

  const updateIntegrations = (updatedIntegrations: APIIntegration[]) => {
    setIntegrations(updatedIntegrations)
    onUpdateElement(element.id, { apiIntegrations: updatedIntegrations })
  }

  const addIntegration = () => {
    if (!newIntegration.name || !newIntegration.endpoint) return

    const integration: APIIntegration = {
      id: `api_${Date.now()}`,
      name: newIntegration.name!,
      type: newIntegration.type!,
      endpoint: newIntegration.endpoint!,
      method: newIntegration.method!,
      headers: newIntegration.headers!,
      payload: newIntegration.payload!,
      isActive: newIntegration.isActive!,
      trigger: newIntegration.trigger!
    }

    updateIntegrations([...integrations, integration])
    setNewIntegration({
      name: '',
      type: 'webhook',
      endpoint: '',
      method: 'POST',
      headers: {},
      payload: '{}',
      isActive: true,
      trigger: 'onSubmit'
    })
  }

  const toggleIntegration = (id: string) => {
    updateIntegrations(integrations.map(i => 
      i.id === id ? { ...i, isActive: !i.isActive } : i
    ))
  }

  const deleteIntegration = (id: string) => {
    updateIntegrations(integrations.filter(i => i.id !== id))
  }

  const testIntegration = async (id: string) => {
    setIsTesting(id)
    const integration = integrations.find(i => i.id === id)
    
    if (!integration) return

    // Simulate API test
    setTimeout(() => {
      const success = Math.random() > 0.3 // 70% success rate for demo
      const testResult = {
        success,
        response: success 
          ? JSON.stringify({ message: 'Integration test successful', timestamp: new Date().toISOString() })
          : JSON.stringify({ error: 'Connection failed', code: 500 }),
        timestamp: new Date()
      }

      updateIntegrations(integrations.map(i => 
        i.id === id ? { ...i, testResult } : i
      ))
      setIsTesting(null)
    }, 2000)
  }

  const getIntegrationIcon = (type: APIIntegration['type']) => {
    const config = integrationTypes.find(t => t.value === type)
    return config?.icon || Webhook
  }

  const getIntegrationColor = (type: APIIntegration['type']) => {
    switch (type) {
      case 'webhook': return 'bg-blue-500'
      case 'api': return 'bg-green-500'
      case 'payment': return 'bg-purple-500'
      case 'email': return 'bg-red-500'
      case 'analytics': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Webhook className="h-5 w-5" />
            API Integrations
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
          Connect <Badge variant="secondary">#{element.id.substring(0, 8)}</Badge> to external services.
        </p>
      </div>

      <Tabs defaultValue="integrations" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="integrations" className="p-4 mt-0">
            <div className="space-y-4">
              {/* Add New Integration */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Add New Integration</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Integration Type</Label>
                      <Select
                        value={newIntegration.type}
                        onValueChange={(value: APIIntegration['type']) => 
                          setNewIntegration({ ...newIntegration, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {integrationTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <type.icon className="h-4 w-4" />
                                <div>
                                  <p className="font-medium">{type.label}</p>
                                  <p className="text-xs text-muted-foreground">{type.description}</p>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Name</Label>
                      <Input
                        placeholder="e.g., 'Contact Form Webhook'"
                        value={newIntegration.name}
                        onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label>Endpoint URL</Label>
                      <Input
                        placeholder="https://api.example.com/webhook"
                        value={newIntegration.endpoint}
                        onChange={(e) => setNewIntegration({ ...newIntegration, endpoint: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Method</Label>
                        <Select
                          value={newIntegration.method}
                          onValueChange={(value: APIIntegration['method']) => 
                            setNewIntegration({ ...newIntegration, method: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                            <SelectItem value="DELETE">DELETE</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Trigger</Label>
                        <Select
                          value={newIntegration.trigger}
                          onValueChange={(value: APIIntegration['trigger']) => 
                            setNewIntegration({ ...newIntegration, trigger: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="onSubmit">On Submit</SelectItem>
                            <SelectItem value="onClick">On Click</SelectItem>
                            <SelectItem value="onLoad">On Load</SelectItem>
                            <SelectItem value="onCustom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Payload (JSON)</Label>
                      <textarea
                        placeholder='{"name": "{{form.name}}", "email": "{{form.email}}"}'
                        value={newIntegration.payload}
                        onChange={(e) => setNewIntegration({ ...newIntegration, payload: e.target.value })}
                        className="w-full p-2 border border-border rounded-md text-sm bg-background font-mono"
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newIntegration.isActive}
                        onCheckedChange={(checked) => 
                          setNewIntegration({ ...newIntegration, isActive: checked })
                        }
                      />
                      <Label>Active</Label>
                    </div>

                    <Button className="w-full" onClick={addIntegration}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Integration
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Existing Integrations */}
              <div className="space-y-3">
                <h4 className="font-medium">Active Integrations</h4>
                {integrations.length > 0 ? (
                  integrations.map(integration => {
                    const IconComponent = getIntegrationIcon(integration.type)
                    return (
                      <Card key={integration.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg ${getIntegrationColor(integration.type)} flex items-center justify-center`}>
                                <IconComponent className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold">{integration.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {integration.method} • {integration.endpoint}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Switch
                                checked={integration.isActive}
                                onCheckedChange={() => toggleIntegration(integration.id)}
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => testIntegration(integration.id)}
                                disabled={isTesting === integration.id}
                              >
                                {isTesting === integration.id ? (
                                  <TestTube className="h-4 w-4 animate-spin" />
                                ) : (
                                  <TestTube className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteIntegration(integration.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Type:</span>
                              <Badge variant="outline">{integration.type}</Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Trigger:</span>
                              <span>{integration.trigger}</span>
                            </div>
                            {integration.testResult && (
                              <div className="flex items-center gap-2 text-sm">
                                <span>Last Test:</span>
                                {integration.testResult.success ? (
                                  <div className="flex items-center gap-1 text-green-600">
                                    <CheckCircle className="h-4 w-4" />
                                    Success
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-red-600">
                                    <AlertTriangle className="h-4 w-4" />
                                    Failed
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    No integrations configured yet.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="p-4 mt-0">
            <div className="space-y-4">
              <h4 className="font-medium">Integration Templates</h4>
              <div className="grid gap-3">
                {integrationTypes.map(type => (
                  <Card key={type.value}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <type.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{type.label}</p>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Copy className="h-4 w-4 mr-2" />
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
