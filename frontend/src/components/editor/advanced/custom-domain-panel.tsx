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
  Globe,
  Search,
  ShoppingCart,
  CheckCircle,
  AlertTriangle,
  Settings,
  RefreshCw,
  ExternalLink,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Copy,
  Download,
  Upload,
  CreditCard,
  Calendar,
  MapPin
} from 'lucide-react'

interface CustomDomainPanelProps {
  onClose?: () => void
}

interface Domain {
  id: string
  name: string
  extension: string
  status: 'available' | 'registered' | 'pending' | 'active' | 'expired' | 'transferring'
  price: number
  currency: 'PKR' | 'USD'
  registrationDate?: Date
  expiryDate?: Date
  autoRenew: boolean
  dnsSettings: {
    nameservers: string[]
    records: DNSRecord[]
  }
  sslStatus: 'active' | 'pending' | 'expired' | 'none'
  websiteId?: string
}

interface DNSRecord {
  id: string
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS'
  name: string
  value: string
  ttl: number
  priority?: number
}

interface DomainSearchResult {
  domain: string
  available: boolean
  price: number
  currency: 'PKR' | 'USD'
  suggestedAlternatives?: string[]
}

export function CustomDomainPanel({ onClose }: CustomDomainPanelProps) {
  const [domains, setDomains] = useState<Domain[]>([
    {
      id: 'domain_1',
      name: 'mybusiness',
      extension: '.pk',
      status: 'active',
      price: 2500,
      currency: 'PKR',
      registrationDate: new Date('2023-01-15'),
      expiryDate: new Date('2025-01-15'),
      autoRenew: true,
      dnsSettings: {
        nameservers: ['ns1.websitebuilder.pk', 'ns2.websitebuilder.pk'],
        records: [
          { id: 'record_1', type: 'A', name: '@', value: '192.168.1.100', ttl: 3600 },
          { id: 'record_2', type: 'CNAME', name: 'www', value: 'mybusiness.pk', ttl: 3600 }
        ]
      },
      sslStatus: 'active',
      websiteId: 'website_123'
    },
    {
      id: 'domain_2',
      name: 'techstartup',
      extension: '.com.pk',
      status: 'pending',
      price: 1800,
      currency: 'PKR',
      autoRenew: false,
      dnsSettings: {
        nameservers: [],
        records: []
      },
      sslStatus: 'none',
      websiteId: 'website_456'
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<DomainSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedWebsite, setSelectedWebsite] = useState('')

  const domainExtensions = [
    { value: '.pk', label: '.pk (Pakistan)', price: 2500, currency: 'PKR' },
    { value: '.com.pk', label: '.com.pk (Pakistan Commercial)', price: 1800, currency: 'PKR' },
    { value: '.org.pk', label: '.org.pk (Pakistan Organization)', price: 2000, currency: 'PKR' },
    { value: '.net.pk', label: '.net.pk (Pakistan Network)', price: 2000, currency: 'PKR' },
    { value: '.com', label: '.com (International)', price: 15, currency: 'USD' },
    { value: '.org', label: '.org (International)', price: 15, currency: 'USD' },
    { value: '.net', label: '.net (International)', price: 15, currency: 'USD' }
  ]

  const searchDomains = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    // Simulate domain search API
    setTimeout(() => {
      const results: DomainSearchResult[] = [
        {
          domain: `${searchQuery}.pk`,
          available: true,
          price: 2500,
          currency: 'PKR'
        },
        {
          domain: `${searchQuery}.com.pk`,
          available: true,
          price: 1800,
          currency: 'PKR'
        },
        {
          domain: `${searchQuery}.com`,
          available: false,
          price: 15,
          currency: 'USD'
        },
        {
          domain: `${searchQuery}2024.pk`,
          available: true,
          price: 2500,
          currency: 'PKR'
        }
      ]
      setSearchResults(results)
      setIsSearching(false)
    }, 1500)
  }

  const registerDomain = (domain: DomainSearchResult) => {
    const newDomain: Domain = {
      id: `domain_${Date.now()}`,
      name: domain.domain.split('.')[0],
      extension: domain.domain.split('.')[1],
      status: 'pending',
      price: domain.price,
      currency: domain.currency,
      autoRenew: true,
      dnsSettings: {
        nameservers: [],
        records: []
      },
      sslStatus: 'none',
      websiteId: selectedWebsite || undefined
    }
    setDomains([...domains, newDomain])
  }

  const connectDomainToWebsite = (domainId: string, websiteId: string) => {
    setDomains(domains.map(d => 
      d.id === domainId ? { ...d, websiteId, status: 'active' } : d
    ))
  }

  const updateDNSRecord = (domainId: string, recordId: string, updates: Partial<DNSRecord>) => {
    setDomains(domains.map(d => 
      d.id === domainId ? {
        ...d,
        dnsSettings: {
          ...d.dnsSettings,
          records: d.dnsSettings.records.map(r => 
            r.id === recordId ? { ...r, ...updates } : r
          )
        }
      } : d
    ))
  }

  const addDNSRecord = (domainId: string) => {
    const newRecord: DNSRecord = {
      id: `record_${Date.now()}`,
      type: 'A',
      name: '',
      value: '',
      ttl: 3600
    }
    setDomains(domains.map(d => 
      d.id === domainId ? {
        ...d,
        dnsSettings: {
          ...d.dnsSettings,
          records: [...d.dnsSettings.records, newRecord]
        }
      } : d
    ))
  }

  const deleteDNSRecord = (domainId: string, recordId: string) => {
    setDomains(domains.map(d => 
      d.id === domainId ? {
        ...d,
        dnsSettings: {
          ...d.dnsSettings,
          records: d.dnsSettings.records.filter(r => r.id !== recordId)
        }
      } : d
    ))
  }

  const getStatusColor = (status: Domain['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'pending': return 'bg-yellow-500'
      case 'expired': return 'bg-red-500'
      case 'transferring': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getSSLStatusColor = (status: Domain['sslStatus']) => {
    switch (status) {
      case 'active': return 'text-green-600'
      case 'pending': return 'text-yellow-600'
      case 'expired': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Custom Domains
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
          Buy, connect, and manage custom domains for your websites.
        </p>
      </div>

      <Tabs defaultValue="search" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="search">Search & Buy</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
          <TabsTrigger value="dns">DNS Settings</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="search" className="p-4 mt-0">
            <div className="space-y-4">
              {/* Domain Search */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Search Available Domains</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Domain Name</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="mybusiness"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button onClick={searchDomains} disabled={isSearching}>
                          {isSearching ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Search className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Connect to Website</Label>
                      <Select value={selectedWebsite} onValueChange={setSelectedWebsite}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select website to connect" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="website_123">My Business Website</SelectItem>
                          <SelectItem value="website_456">Tech Startup Site</SelectItem>
                          <SelectItem value="website_789">Portfolio Site</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Available Domains</h4>
                  {searchResults.map((result, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-lg">{result.domain}</span>
                            {result.available ? (
                              <Badge variant="default" className="bg-green-500">
                                Available
                              </Badge>
                            ) : (
                              <Badge variant="destructive">Taken</Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {result.currency === 'PKR' ? '₨' : '$'}{result.price}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {result.currency === 'PKR' ? 'per year' : 'per year'}
                            </p>
                          </div>
                        </div>

                        {result.available && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onClick={() => registerDomain(result)}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Register Domain
                            </Button>
                            <Button size="sm" variant="outline">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        )}

                        {result.suggestedAlternatives && (
                          <div className="mt-2 pt-2 border-t">
                            <p className="text-xs text-muted-foreground mb-1">Suggestions:</p>
                            <div className="flex flex-wrap gap-1">
                              {result.suggestedAlternatives.map((alt, altIndex) => (
                                <Badge key={altIndex} variant="outline" className="text-xs">
                                  {alt}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Popular Extensions */}
              <div className="space-y-3">
                <h4 className="font-medium">Popular Extensions</h4>
                <div className="grid gap-2">
                  {domainExtensions.map(ext => (
                    <Card key={ext.value}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{ext.label}</p>
                            <p className="text-xs text-muted-foreground">
                              Starting from {ext.currency === 'PKR' ? '₨' : '$'}{ext.price}/year
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            Browse
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manage" className="p-4 mt-0">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">My Domains</h4>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Domain
                </Button>
              </div>

              {domains.length > 0 ? (
                domains.map(domain => (
                  <Card key={domain.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(domain.status)}`} />
                          <div>
                            <p className="font-semibold">{domain.name}{domain.extension}</p>
                            <p className="text-sm text-muted-foreground">
                              {domain.status === 'active' && domain.websiteId && 'Connected to website'}
                              {domain.status === 'pending' && 'Registration in progress'}
                              {domain.status === 'expired' && 'Expired - needs renewal'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {domain.sslStatus === 'active' ? (
                            <Lock className="h-4 w-4 text-green-600" />
                          ) : (
                            <Unlock className="h-4 w-4 text-gray-400" />
                          )}
                          <Badge variant="outline">{domain.status}</Badge>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span>Registration:</span>
                          <span>{domain.registrationDate?.toLocaleDateString() || 'Pending'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Expiry:</span>
                          <span>{domain.expiryDate?.toLocaleDateString() || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Auto-renew:</span>
                          <Switch 
                            checked={domain.autoRenew} 
                            onCheckedChange={(checked) => 
                              setDomains(domains.map(d => 
                                d.id === domain.id ? { ...d, autoRenew: checked } : d
                              ))
                            }
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>SSL Status:</span>
                          <span className={getSSLStatusColor(domain.sslStatus)}>
                            {domain.sslStatus}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-1" />
                          Settings
                        </Button>
                        <Button size="sm" variant="outline">
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Refresh
                        </Button>
                        <Button size="sm" variant="outline">
                          <CreditCard className="h-4 w-4 mr-1" />
                          Renew
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground py-8">
                  No domains registered yet.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="dns" className="p-4 mt-0">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">DNS Management</h4>
                <Button size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh DNS
                </Button>
              </div>

              {domains.filter(d => d.status === 'active').map(domain => (
                <Card key={domain.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium">{domain.name}{domain.extension}</h5>
                      <Badge variant="outline">Active</Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label>Nameservers</Label>
                        <div className="space-y-1 mt-1">
                          {domain.dnsSettings.nameservers.map((ns, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <code className="text-xs bg-muted p-1 rounded flex-1">{ns}</code>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>DNS Records</Label>
                          <Button size="sm" onClick={() => addDNSRecord(domain.id)}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Record
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          {domain.dnsSettings.records.map(record => (
                            <div key={record.id} className="flex items-center gap-2 p-2 border rounded">
                              <Select
                                value={record.type}
                                onValueChange={(value: DNSRecord['type']) => 
                                  updateDNSRecord(domain.id, record.id, { type: value })
                                }
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="A">A</SelectItem>
                                  <SelectItem value="AAAA">AAAA</SelectItem>
                                  <SelectItem value="CNAME">CNAME</SelectItem>
                                  <SelectItem value="MX">MX</SelectItem>
                                  <SelectItem value="TXT">TXT</SelectItem>
                                  <SelectItem value="NS">NS</SelectItem>
                                </SelectContent>
                              </Select>
                              
                              <Input
                                placeholder="Name"
                                value={record.name}
                                onChange={(e) => 
                                  updateDNSRecord(domain.id, record.id, { name: e.target.value })
                                }
                                className="flex-1"
                              />
                              
                              <Input
                                placeholder="Value"
                                value={record.value}
                                onChange={(e) => 
                                  updateDNSRecord(domain.id, record.id, { value: e.target.value })
                                }
                                className="flex-1"
                              />
                              
                              <Input
                                placeholder="TTL"
                                type="number"
                                value={record.ttl}
                                onChange={(e) => 
                                  updateDNSRecord(domain.id, record.id, { ttl: parseInt(e.target.value) })
                                }
                                className="w-20"
                              />
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteDNSRecord(domain.id, record.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
