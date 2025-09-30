'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Zap,
  Target,
  TrendingUp,
  Users,
  MessageSquare,
  Image,
  Video,
  FileText,
  BarChart3,
  Calendar,
  Send,
  Brain,
  Sparkles,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'

export default function AIMarketingPage() {
  const [activeTab, setActiveTab] = useState('campaigns')
  const [isGenerating, setIsGenerating] = useState(false)

  const campaigns = [
    {
      id: 1,
      name: 'Summer Sale Campaign',
      status: 'active',
      type: 'email',
      audience: 'All Customers',
      sent: 1250,
      opened: 890,
      clicked: 234,
      conversions: 45,
      roi: 340
    },
    {
      id: 2,
      name: 'Product Launch',
      status: 'scheduled',
      type: 'social',
      audience: 'Tech Enthusiasts',
      sent: 0,
      opened: 0,
      clicked: 0,
      conversions: 0,
      roi: 0
    },
    {
      id: 3,
      name: 'Retargeting Ads',
      status: 'paused',
      type: 'ads',
      audience: 'Website Visitors',
      sent: 2100,
      opened: 1200,
      clicked: 180,
      conversions: 28,
      roi: 180
    }
  ]

  const aiSuggestions = [
    {
      type: 'content',
      title: 'Email Subject Line',
      suggestion: '🔥 Limited Time: 50% Off Everything + Free Shipping!',
      confidence: 92
    },
    {
      type: 'timing',
      title: 'Best Send Time',
      suggestion: 'Tuesday 2:00 PM - 3:00 PM',
      confidence: 87
    },
    {
      type: 'audience',
      title: 'Target Audience',
      suggestion: 'Customers who viewed products but didn\'t purchase',
      confidence: 94
    }
  ]

  const handleGenerateContent = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-500" />
            AI Marketing Suite
          </h1>
          <p className="text-muted-foreground">
            Leverage AI to create, optimize, and automate your marketing campaigns
          </p>
        </div>
        <Button onClick={handleGenerateContent} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Campaign
            </>
          )}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="content">Content Generation</TabsTrigger>
          <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          {/* Campaign Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">+1 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.5K</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2%</div>
                <p className="text-xs text-muted-foreground">+0.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ROI</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">340%</div>
                <p className="text-xs text-muted-foreground">+25% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Campaigns List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Campaigns</h3>
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {campaign.name}
                        <Badge 
                          variant={
                            campaign.status === 'active' ? 'default' :
                            campaign.status === 'scheduled' ? 'secondary' : 'outline'
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {campaign.type} • {campaign.audience}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {campaign.roi}%
                      </div>
                      <div className="text-sm text-muted-foreground">ROI</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-medium">{campaign.sent.toLocaleString()}</div>
                      <div className="text-muted-foreground">Sent</div>
                    </div>
                    <div>
                      <div className="font-medium">{campaign.opened.toLocaleString()}</div>
                      <div className="text-muted-foreground">Opened</div>
                    </div>
                    <div>
                      <div className="font-medium">{campaign.clicked.toLocaleString()}</div>
                      <div className="text-muted-foreground">Clicked</div>
                    </div>
                    <div>
                      <div className="font-medium">{campaign.conversions.toLocaleString()}</div>
                      <div className="text-muted-foreground">Conversions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {/* AI Content Generation */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Email Campaign
                </CardTitle>
                <CardDescription>
                  Generate personalized email content using AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Campaign Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="promotional">Promotional</SelectItem>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                      <SelectItem value="welcome">Welcome Series</SelectItem>
                      <SelectItem value="abandoned">Abandoned Cart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Target Audience</label>
                  <Input placeholder="e.g., New customers, VIP members" />
                </div>
                <div>
                  <label className="text-sm font-medium">Key Message</label>
                  <Textarea placeholder="What do you want to communicate?" />
                </div>
                <Button className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Email Content
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Social Media Posts
                </CardTitle>
                <CardDescription>
                  Create engaging social media content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Platform</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Content Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image Post</SelectItem>
                      <SelectItem value="video">Video Post</SelectItem>
                      <SelectItem value="carousel">Carousel</SelectItem>
                      <SelectItem value="story">Story</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Topic</label>
                  <Input placeholder="e.g., Product launch, Company news" />
                </div>
                <Button className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Social Content
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* AI Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Recommendations
              </CardTitle>
              <CardDescription>
                Personalized suggestions based on your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      {suggestion.type === 'content' && <FileText className="h-5 w-5 text-blue-500" />}
                      {suggestion.type === 'timing' && <Clock className="h-5 w-5 text-green-500" />}
                      {suggestion.type === 'audience' && <Users className="h-5 w-5 text-purple-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{suggestion.title}</div>
                      <div className="text-sm text-muted-foreground">{suggestion.suggestion}</div>
                    </div>
                    <div className="flex-shrink-0">
                      <Badge variant="outline">{suggestion.confidence}% confidence</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-16 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI Analytics Dashboard</h3>
            <p>Advanced analytics and insights powered by AI coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <div className="text-center py-16 text-muted-foreground">
            <Zap className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Marketing Automation</h3>
            <p>Automated workflows and triggers coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
