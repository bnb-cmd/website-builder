'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Search, 
  Globe, 
  Calendar,
  Shield,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Zap
} from 'lucide-react'

// Demo domain data
const demoDomainsData = [
  {
    id: 'domain-1',
    name: 'mybusiness.pk',
    status: 'active',
    price: 2500,
    currency: 'PKR',
    registrationDate: new Date('2024-01-15'),
    expiryDate: new Date('2025-01-15'),
    autoRenew: true,
    sslStatus: 'active',
    websiteConnected: 'My Restaurant'
  },
  {
    id: 'domain-2',
    name: 'techsolutions.com.pk',
    status: 'pending',
    price: 1800,
    currency: 'PKR',
    registrationDate: new Date('2024-09-20'),
    expiryDate: new Date('2025-09-20'),
    autoRenew: false,
    sslStatus: 'none',
    websiteConnected: 'Tech Solutions'
  },
  {
    id: 'domain-3',
    name: 'fashionstore.com',
    status: 'expired',
    price: 15,
    currency: 'USD',
    registrationDate: new Date('2023-05-10'),
    expiryDate: new Date('2024-05-10'),
    autoRenew: false,
    sslStatus: 'expired',
    websiteConnected: null
  }
]

const domainExtensions = [
  { value: '.pk', label: '.pk (Pakistan)', price: 2500, currency: 'PKR' },
  { value: '.com.pk', label: '.com.pk (Commercial)', price: 1800, currency: 'PKR' },
  { value: '.org.pk', label: '.org.pk (Organization)', price: 2000, currency: 'PKR' },
  { value: '.net.pk', label: '.net.pk (Network)', price: 2000, currency: 'PKR' },
  { value: '.com', label: '.com (International)', price: 15, currency: 'USD' },
  { value: '.org', label: '.org (International)', price: 15, currency: 'USD' },
  { value: '.net', label: '.net (International)', price: 15, currency: 'USD' }
]

interface DomainSearchResult {
  domain: string
  available: boolean
  price: number
  currency: 'PKR' | 'USD'
  suggestion?: boolean
}

export default function DomainsPage() {
  const [domains, setDomains] = useState(demoDomainsData)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedExtension, setSelectedExtension] = useState('.pk')
  const [searchResults, setSearchResults] = useState<DomainSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    
    // Simulate domain search API
    setTimeout(() => {
      const results: DomainSearchResult[] = [
        {
          domain: `${searchQuery}${selectedExtension}`,
          available: Math.random() > 0.5,
          price: domainExtensions.find(ext => ext.value === selectedExtension)?.price || 2500,
          currency: (domainExtensions.find(ext => ext.value === selectedExtension)?.currency as 'PKR' | 'USD') || 'PKR'
        },
        {
          domain: `${searchQuery}2024.pk`,
          available: true,
          price: 2500,
          currency: 'PKR',
          suggestion: true
        },
        {
          domain: `${searchQuery}-online.pk`,
          available: true,
          price: 2500,
          currency: 'PKR',
          suggestion: true
        }
      ]
      setSearchResults(results)
      setIsSearching(false)
    }, 1500)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'expired':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Globe className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      pending: 'secondary',
      expired: 'destructive'
    } as const
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const handleRegisterDomain = (domain: DomainSearchResult) => {
    const newDomain = {
      id: `domain-${Date.now()}`,
      name: domain.domain,
      status: 'pending' as const,
      price: domain.price,
      currency: domain.currency,
      registrationDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      autoRenew: true,
      sslStatus: 'none' as const,
      websiteConnected: null
    }
    setDomains([...domains, newDomain])
    setSearchResults([])
    setSearchQuery('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Domain Management</h1>
          <p className="text-muted-foreground">
            Search, register, and manage your custom domains
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            DNS Settings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Register Domain
          </Button>
        </div>
      </div>

      <Tabs defaultValue="search" className="space-y-6">
        <TabsList>
          <TabsTrigger value="search">Search & Register</TabsTrigger>
          <TabsTrigger value="manage">My Domains ({domains.length})</TabsTrigger>
          <TabsTrigger value="transfer">Transfer Domain</TabsTrigger>
        </TabsList>

        {/* Domain Search Tab */}
        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Search Available Domains
              </CardTitle>
              <CardDescription>
                Find the perfect domain for your website. Pakistani domains (.pk) start from PKR 1,800
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-3">
                <div className="flex-1">
                  <Label htmlFor="domain-search">Domain Name</Label>
                  <Input
                    id="domain-search"
                    placeholder="Enter domain name (without extension)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="w-48">
                  <Label htmlFor="extension">Extension</Label>
                  <Select value={selectedExtension} onValueChange={setSelectedExtension}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {domainExtensions.map((ext) => (
                        <SelectItem key={ext.value} value={ext.value}>
                          {ext.label} - {ext.currency} {ext.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleSearch} 
                    disabled={!searchQuery.trim() || isSearching}
                    className="h-10"
                  >
                    {isSearching ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium">Search Results</h3>
                  <div className="grid gap-3">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Globe className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{result.domain}</div>
                            {result.suggestion && (
                              <Badge variant="outline" className="text-xs">
                                Suggested Alternative
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="font-medium">
                              {result.currency} {result.price}/year
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {result.available ? 'Available' : 'Not Available'}
                            </div>
                          </div>
                          {result.available ? (
                            <Button onClick={() => handleRegisterDomain(result)}>
                              Register
                            </Button>
                          ) : (
                            <Button variant="outline" disabled>
                              Taken
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Domain Extensions Info */}
          <Card>
            <CardHeader>
              <CardTitle>Available Extensions</CardTitle>
              <CardDescription>
                Choose from Pakistani and international domain extensions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {domainExtensions.map((ext) => (
                  <div key={ext.value} className="p-4 border rounded-lg">
                    <div className="font-medium">{ext.value}</div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {ext.label.split('(')[1]?.replace(')', '')}
                    </div>
                    <div className="text-lg font-semibold">
                      {ext.currency} {ext.price}/year
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Domains Tab */}
        <TabsContent value="manage" className="space-y-6">
          {domains.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Globe className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No domains registered</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Register your first custom domain to get started
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Register Domain
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {domains.map((domain) => (
                <Card key={domain.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(domain.status)}
                        <div>
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold">{domain.name}</h3>
                            {getStatusBadge(domain.status)}
                            {domain.sslStatus === 'active' && (
                              <Badge variant="outline" className="text-green-600">
                                <Shield className="h-3 w-3 mr-1" />
                                SSL
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Expires: {domain.expiryDate.toLocaleDateString()}
                            </span>
                            {domain.websiteConnected && (
                              <span className="flex items-center">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Connected to: {domain.websiteConnected}
                              </span>
                            )}
                            {domain.autoRenew && (
                              <span className="flex items-center">
                                <Zap className="h-3 w-3 mr-1" />
                                Auto-renew
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right mr-4">
                          <div className="font-medium">
                            {domain.currency} {domain.price}/year
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {domain.status === 'expired' ? 'Renewal required' : 'Next billing'}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                        {domain.status === 'expired' && (
                          <Button size="sm">
                            Renew
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Transfer Domain Tab */}
        <TabsContent value="transfer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transfer Existing Domain</CardTitle>
              <CardDescription>
                Transfer your domain from another registrar to Pakistan Builder
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transfer-domain">Domain to Transfer</Label>
                <Input
                  id="transfer-domain"
                  placeholder="example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-code">Authorization Code</Label>
                <Input
                  id="auth-code"
                  placeholder="Enter EPP/Auth code from current registrar"
                />
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Transfer Requirements:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Domain must be unlocked at current registrar</li>
                  <li>• Authorization code (EPP code) required</li>
                  <li>• Domain must be at least 60 days old</li>
                  <li>• Transfer process typically takes 5-7 days</li>
                </ul>
              </div>
              <Button>
                Start Transfer Process
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
