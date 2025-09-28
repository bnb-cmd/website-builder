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
  Mail, 
  MessageSquare, 
  Smartphone, 
  Send, 
  BarChart3, 
  Play, 
  Pause, 
  Plus,
  Users,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { apiHelpers } from '@/lib/api'
import { toast } from 'react-hot-toast'

interface Campaign {
  id: string
  name: string
  type: string
  status: string
  channels: string[]
  message: string
  mediaUrls: string[]
  sentCount: number
  deliveredCount: number
  openedCount: number
  clickedCount: number
  convertedCount: number
  createdAt: string
}

interface CampaignMetrics {
  sentCount: number
  deliveredCount: number
  openedCount: number
  clickedCount: number
  convertedCount: number
  openRate: number
  clickRate: number
  conversionRate: number
}

interface MarketingDashboardProps {
  websiteId: string
}

export function MarketingDashboard({ websiteId }: MarketingDashboardProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [metrics, setMetrics] = useState<CampaignMetrics | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Form state for new campaign
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'EMAIL',
    channels: ['EMAIL'],
    message: '',
    mediaUrls: [] as string[],
    targetAudience: {},
    schedule: null,
  })

  useEffect(() => {
    fetchCampaigns()
  }, [websiteId])

  const fetchCampaigns = async () => {
    try {
      const response = await apiHelpers.getMarketingCampaigns(websiteId)
      setCampaigns(response.data.data || [])
    } catch (error) {
      toast.error('Failed to fetch campaigns')
    } finally {
      setLoading(false)
    }
  }

  const fetchCampaignMetrics = async (campaignId: string) => {
    try {
      const response = await apiHelpers.getCampaignMetrics(campaignId)
      setMetrics(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch campaign metrics')
    }
  }

  const createCampaign = async () => {
    try {
      await apiHelpers.createMarketingCampaign(websiteId, newCampaign)
      toast.success('Campaign created successfully!')
      setIsCreateDialogOpen(false)
      setNewCampaign({
        name: '',
        type: 'EMAIL',
        channels: ['EMAIL'],
        message: '',
        mediaUrls: [],
        targetAudience: {},
        schedule: null,
      })
      fetchCampaigns()
    } catch (error) {
      toast.error('Failed to create campaign')
    }
  }

  const updateCampaignStatus = async (campaignId: string, status: string) => {
    try {
      await apiHelpers.updateCampaignStatus(campaignId, { status })
      toast.success(`Campaign ${status.toLowerCase()}`)
      fetchCampaigns()
    } catch (error) {
      toast.error('Failed to update campaign status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800'
      case 'RUNNING': return 'bg-green-100 text-green-800'
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED': return 'bg-purple-100 text-purple-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'EMAIL': return <Mail className="h-4 w-4" />
      case 'SMS': return <MessageSquare className="h-4 w-4" />
      case 'WHATSAPP': return <Smartphone className="h-4 w-4" />
      case 'PUSH': return <Send className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

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
          <h1 className="text-3xl font-bold">Marketing Automation</h1>
          <p className="text-muted-foreground">Create and manage multi-channel marketing campaigns</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Set up a new marketing campaign to reach your audience across multiple channels.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Campaign Name</label>
                <Input
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  placeholder="Enter campaign name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Campaign Type</label>
                <Select value={newCampaign.type} onValueChange={(value) => setNewCampaign({ ...newCampaign, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMAIL">Email</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                    <SelectItem value="PUSH_NOTIFICATION">Push Notification</SelectItem>
                    <SelectItem value="SOCIAL_MEDIA">Social Media</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Channels</label>
                <div className="flex gap-2 mt-2">
                  {['EMAIL', 'SMS', 'WHATSAPP', 'PUSH'].map((channel) => (
                    <Button
                      key={channel}
                      variant={newCampaign.channels.includes(channel) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        const channels = newCampaign.channels.includes(channel)
                          ? newCampaign.channels.filter(c => c !== channel)
                          : [...newCampaign.channels, channel]
                        setNewCampaign({ ...newCampaign, channels })
                      }}
                    >
                      {getChannelIcon(channel)}
                      <span className="ml-1">{channel}</span>
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={newCampaign.message}
                  onChange={(e) => setNewCampaign({ ...newCampaign, message: e.target.value })}
                  placeholder="Enter your message content"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createCampaign}>
                  Create Campaign
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaigns List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <CardDescription>{campaign.type}</CardDescription>
                </div>
                <Badge className={getStatusColor(campaign.status)}>
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-2">
                  {campaign.channels.map((channel) => (
                    <div key={channel} className="flex items-center gap-1 text-sm text-muted-foreground">
                      {getChannelIcon(channel)}
                      <span>{channel}</span>
                    </div>
                  ))}
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {campaign.message}
                </p>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    Sent: {campaign.sentCount}
                  </span>
                  <span className="text-muted-foreground">
                    Opened: {campaign.openedCount}
                  </span>
                </div>

                <div className="flex gap-2">
                  {campaign.status === 'DRAFT' && (
                    <Button
                      size="sm"
                      onClick={() => updateCampaignStatus(campaign.id, 'RUNNING')}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Start
                    </Button>
                  )}
                  {campaign.status === 'RUNNING' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateCampaignStatus(campaign.id, 'PAUSED')}
                    >
                      <Pause className="h-3 w-3 mr-1" />
                      Pause
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedCampaign(campaign)
                      fetchCampaignMetrics(campaign.id)
                    }}
                  >
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Metrics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaign Metrics Modal */}
      {selectedCampaign && metrics && (
        <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedCampaign.name} - Performance Metrics</DialogTitle>
              <DialogDescription>
                Detailed analytics and performance data for this campaign.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Sent</p>
                      <p className="text-2xl font-bold">{metrics.sentCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Delivered</p>
                      <p className="text-2xl font-bold">{metrics.deliveredCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Opened</p>
                      <p className="text-2xl font-bold">{metrics.openedCount}</p>
                      <p className="text-xs text-muted-foreground">{metrics.openRate.toFixed(1)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Clicked</p>
                      <p className="text-2xl font-bold">{metrics.clickedCount}</p>
                      <p className="text-xs text-muted-foreground">{metrics.clickRate.toFixed(1)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
