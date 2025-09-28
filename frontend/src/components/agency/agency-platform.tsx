'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Settings, 
  Eye, 
  Edit, 
  Trash2,
  Mail,
  Phone,
  Calendar,
  FileText,
  Crown,
  Star,
  Zap,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { apiHelpers } from '@/lib/api'
import { toast } from 'react-hot-toast'

interface Agency {
  id: string
  name: string
  description?: string
  website?: string
  logo?: string
  brandName?: string
  brandColors?: any
  customDomain?: string
  customLogo?: string
  features: any
  plan: string
  billingEmail?: string
  status: string
  clients: AgencyClient[]
  createdAt: string
}

interface AgencyClient {
  id: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  companyName?: string
  projectType?: string
  budget?: number
  timeline?: string
  status: string
  lastContactAt?: string
  notes?: string
  website: {
    id: string
    name: string
    status: string
  }
  createdAt: string
}

interface AgencyStats {
  totalClients: number
  activeClients: number
  completedProjects: number
  totalRevenue: number
  averageProjectValue: number
}

interface AgencyPlatformProps {
  userId: string
}

export function AgencyPlatform({ userId }: AgencyPlatformProps) {
  const [agency, setAgency] = useState<Agency | null>(null)
  const [stats, setStats] = useState<AgencyStats | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [newAgency, setNewAgency] = useState({
    name: '',
    description: '',
    website: '',
    logo: '',
    brandName: '',
    customDomain: '',
    billingEmail: '',
    plan: 'STARTER'
  })

  const [newClient, setNewClient] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    companyName: '',
    projectType: '',
    budget: 0,
    timeline: '',
    notes: '',
    websiteId: ''
  })

  useEffect(() => {
    fetchAgency()
  }, [userId])

  const fetchAgency = async () => {
    try {
      const response = await apiHelpers.getMyAgency()
      if (response.data.data) {
        setAgency(response.data.data)
        fetchStats(response.data.data.id)
      }
    } catch (error) {
      toast.error('Failed to fetch agency data')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async (agencyId: string) => {
    try {
      const response = await apiHelpers.getAgencyStats(agencyId)
      setStats(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch agency stats')
    }
  }

  const createAgency = async () => {
    try {
      await apiHelpers.createAgency(newAgency)
      toast.success('Agency created successfully!')
      setIsCreateDialogOpen(false)
      setNewAgency({
        name: '',
        description: '',
        website: '',
        logo: '',
        brandName: '',
        customDomain: '',
        billingEmail: '',
        plan: 'STARTER'
      })
      fetchAgency()
    } catch (error) {
      toast.error('Failed to create agency')
    }
  }

  const addClient = async () => {
    if (!agency) return

    try {
      await apiHelpers.addAgencyClient({
        ...newClient,
        agencyId: agency.id
      })
      toast.success('Client added successfully!')
      setIsClientDialogOpen(false)
      setNewClient({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        companyName: '',
        projectType: '',
        budget: 0,
        timeline: '',
        notes: '',
        websiteId: ''
      })
      fetchAgency()
    } catch (error) {
      toast.error('Failed to add client')
    }
  }

  const upgradePlan = async (plan: string) => {
    if (!agency) return

    try {
      await apiHelpers.upgradeAgencyPlan(agency.id, { plan })
      toast.success(`Upgraded to ${plan} plan!`)
      fetchAgency()
    } catch (error) {
      toast.error('Failed to upgrade plan')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'INACTIVE': return 'bg-gray-100 text-gray-800'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'STARTER': return <Star className="h-4 w-4" />
      case 'PROFESSIONAL': return <Zap className="h-4 w-4" />
      case 'ENTERPRISE': return <Crown className="h-4 w-4" />
      default: return <Star className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!agency) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Start Your Agency</h2>
          <p className="text-muted-foreground mb-6">
            Create your white-label agency to manage clients and build websites
          </p>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Agency
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Your Agency</DialogTitle>
                <DialogDescription>
                  Set up your white-label agency with custom branding and features.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Agency Name</label>
                    <Input
                      value={newAgency.name}
                      onChange={(e) => setNewAgency({ ...newAgency, name: e.target.value })}
                      placeholder="Enter agency name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Brand Name</label>
                    <Input
                      value={newAgency.brandName}
                      onChange={(e) => setNewAgency({ ...newAgency, brandName: e.target.value })}
                      placeholder="Client-facing brand name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newAgency.description}
                    onChange={(e) => setNewAgency({ ...newAgency, description: e.target.value })}
                    placeholder="Describe your agency"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Website</label>
                    <Input
                      value={newAgency.website}
                      onChange={(e) => setNewAgency({ ...newAgency, website: e.target.value })}
                      placeholder="https://your-agency.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Custom Domain</label>
                    <Input
                      value={newAgency.customDomain}
                      onChange={(e) => setNewAgency({ ...newAgency, customDomain: e.target.value })}
                      placeholder="app.your-agency.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Plan</label>
                    <Select value={newAgency.plan} onValueChange={(value) => setNewAgency({ ...newAgency, plan: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STARTER">Starter</SelectItem>
                        <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                        <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Billing Email</label>
                    <Input
                      value={newAgency.billingEmail}
                      onChange={(e) => setNewAgency({ ...newAgency, billingEmail: e.target.value })}
                      placeholder="billing@your-agency.com"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createAgency}>
                    Create Agency
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{agency.name}</h1>
          <p className="text-muted-foreground">White-label agency platform</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>
                  Add a new client to your agency.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Client Name</label>
                    <Input
                      value={newClient.clientName}
                      onChange={(e) => setNewClient({ ...newClient, clientName: e.target.value })}
                      placeholder="Enter client name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      value={newClient.clientEmail}
                      onChange={(e) => setNewClient({ ...newClient, clientEmail: e.target.value })}
                      placeholder="client@example.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      value={newClient.clientPhone}
                      onChange={(e) => setNewClient({ ...newClient, clientPhone: e.target.value })}
                      placeholder="+92 300 1234567"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Company</label>
                    <Input
                      value={newClient.companyName}
                      onChange={(e) => setNewClient({ ...newClient, companyName: e.target.value })}
                      placeholder="Company name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Project Type</label>
                    <Select value={newClient.projectType} onValueChange={(value) => setNewClient({ ...newClient, projectType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="portfolio">Portfolio</SelectItem>
                        <SelectItem value="blog">Blog</SelectItem>
                        <SelectItem value="landing">Landing Page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Budget (PKR)</label>
                    <Input
                      type="number"
                      value={newClient.budget}
                      onChange={(e) => setNewClient({ ...newClient, budget: parseInt(e.target.value) || 0 })}
                      placeholder="50000"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Timeline</label>
                  <Input
                    value={newClient.timeline}
                    onChange={(e) => setNewClient({ ...newClient, timeline: e.target.value })}
                    placeholder="2 weeks"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    value={newClient.notes}
                    onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsClientDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addClient}>
                    Add Client
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={() => setIsSettingsDialogOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Clients</p>
                  <p className="text-2xl font-bold">{stats.totalClients}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Clients</p>
                  <p className="text-2xl font-bold">{stats.activeClients}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{stats.completedProjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">PKR {stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-indigo-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg Project</p>
                  <p className="text-2xl font-bold">PKR {stats.averageProjectValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Agency Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Agency Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              {getPlanIcon(agency.plan)}
              <div>
                <p className="font-medium">{agency.plan} Plan</p>
                <p className="text-sm text-muted-foreground">
                  {agency.brandName || agency.name}
                </p>
              </div>
            </div>
            
            {agency.description && (
              <p className="text-sm text-muted-foreground">{agency.description}</p>
            )}
            
            <div className="flex gap-2">
              {agency.website && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <a href={agency.website} target="_blank" rel="noopener noreferrer">
                    Website
                  </a>
                </Badge>
              )}
              {agency.customDomain && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Settings className="h-3 w-3" />
                  Custom Domain
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(agency.features).map(([feature, enabled]) => (
                <div key={feature} className="flex items-center gap-2">
                  {enabled ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-sm capitalize">
                    {feature.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => upgradePlan(agency.plan === 'STARTER' ? 'PROFESSIONAL' : 'ENTERPRISE')}
              >
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Clients ({agency.clients.length})
          </CardTitle>
          <CardDescription>
            Manage your agency clients and their projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agency.clients.map((client) => (
              <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{client.clientName}</h4>
                    <p className="text-sm text-muted-foreground">{client.companyName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{client.clientEmail}</span>
                      {client.clientPhone && (
                        <>
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{client.clientPhone}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{client.projectType}</p>
                    {client.budget && (
                      <p className="text-xs text-muted-foreground">PKR {client.budget.toLocaleString()}</p>
                    )}
                    <Badge className={getStatusColor(client.status)}>
                      {client.status}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {agency.clients.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No clients yet</p>
                <p className="text-sm text-muted-foreground">Add your first client to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
