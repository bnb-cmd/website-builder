'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { 
  Mail, 
  MessageSquare, 
  Share2, 
  Target, 
  TrendingUp,
  Users,
  Calendar,
  Clock,
  DollarSign,
  BarChart,
  Send,
  Bot,
  Zap,
  Bell,
  Gift,
  Sparkles,
  Heart,
  ShoppingBag,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe
} from 'lucide-react'

interface MarketingToolsProps {
  websiteId: string
  onCampaignCreate?: (campaign: any) => void
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  preview: string
  category: string
}

interface Campaign {
  id: string
  name: string
  type: 'email' | 'social' | 'sms' | 'push'
  status: 'draft' | 'scheduled' | 'active' | 'completed'
  audience: number
  engagement: number
  schedule?: Date
}

export function MarketingTools({ websiteId, onCampaignCreate }: MarketingToolsProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Summer Sale Campaign',
      type: 'email',
      status: 'active',
      audience: 2500,
      engagement: 23.5
    },
    {
      id: '2',
      name: 'New Product Launch',
      type: 'social',
      status: 'scheduled',
      audience: 5000,
      engagement: 0,
      schedule: new Date(Date.now() + 86400000)
    }
  ])

  const emailTemplates: EmailTemplate[] = [
    {
      id: '1',
      name: 'Welcome Email',
      subject: 'Welcome to {{company_name}}!',
      preview: 'Thank you for joining us. Here\'s what you need to know...',
      category: 'Onboarding'
    },
    {
      id: '2',
      name: 'Promotional Offer',
      subject: '🎉 Special Offer Just for You!',
      preview: 'Get {{discount}}% off your next purchase. Limited time only!',
      category: 'Promotions'
    },
    {
      id: '3',
      name: 'Cart Abandonment',
      subject: 'You left something behind...',
      preview: 'Complete your purchase and get free shipping!',
      category: 'E-commerce'
    },
    {
      id: '4',
      name: 'Newsletter',
      subject: '{{month}} Newsletter: Top Stories & Updates',
      preview: 'Here\'s what\'s new this month at {{company_name}}',
      category: 'Newsletter'
    }
  ]

  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [emailContent, setEmailContent] = useState({
    subject: '',
    preheader: '',
    content: '',
    cta: { text: 'Shop Now', link: '' }
  })

  const [socialPost, setSocialPost] = useState({
    content: '',
    platforms: [] as string[],
    schedule: 'now',
    media: [] as string[]
  })

  const [automationRules, setAutomationRules] = useState([
    {
      id: '1',
      trigger: 'user_signup',
      action: 'send_welcome_email',
      delay: '0',
      active: true
    },
    {
      id: '2',
      trigger: 'cart_abandoned',
      action: 'send_reminder',
      delay: '2h',
      active: true
    },
    {
      id: '3',
      trigger: 'purchase_made',
      action: 'send_thank_you',
      delay: '0',
      active: true
    }
  ])

  const socialPlatforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-900' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-sky-500' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-900' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-red-600' }
  ]

  const togglePlatform = (platformId: string) => {
    setSocialPost(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Campaign Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Email Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,543</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+5.2%</span> growth
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Open Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23.8%</div>
            <Progress value={23.8} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR 485K</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="email" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="email">Email Marketing</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="ai">AI Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Campaign Builder</CardTitle>
              <CardDescription>
                Create and send professional email campaigns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Choose Template</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {emailTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template.id)
                        setEmailContent({
                          subject: template.subject,
                          preheader: template.preview,
                          content: '',
                          cta: { text: 'Shop Now', link: '' }
                        })
                      }}
                      className={`
                        p-4 rounded-lg border cursor-pointer transition-all
                        ${selectedTemplate === template.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{template.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {template.preview}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedTemplate && (
                <>
                  <div>
                    <Label htmlFor="subject">Email Subject</Label>
                    <Input
                      id="subject"
                      value={emailContent.subject}
                      onChange={(e) => setEmailContent({ ...emailContent, subject: e.target.value })}
                      placeholder="Enter email subject..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="preheader">Preheader Text</Label>
                    <Input
                      id="preheader"
                      value={emailContent.preheader}
                      onChange={(e) => setEmailContent({ ...emailContent, preheader: e.target.value })}
                      placeholder="Preview text that appears after subject..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Email Content</Label>
                    <Textarea
                      id="content"
                      value={emailContent.content}
                      onChange={(e) => setEmailContent({ ...emailContent, content: e.target.value })}
                      placeholder="Write your email content..."
                      rows={6}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cta-text">CTA Button Text</Label>
                      <Input
                        id="cta-text"
                        value={emailContent.cta.text}
                        onChange={(e) => setEmailContent({ 
                          ...emailContent, 
                          cta: { ...emailContent.cta, text: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cta-link">CTA Link</Label>
                      <Input
                        id="cta-link"
                        value={emailContent.cta.link}
                        onChange={(e) => setEmailContent({ 
                          ...emailContent, 
                          cta: { ...emailContent.cta, link: e.target.value }
                        })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Send Campaign
                    </Button>
                    <Button variant="outline">
                      <Clock className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                    <Button variant="outline">
                      Save Draft
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Manager</CardTitle>
              <CardDescription>
                Schedule and publish to multiple platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Select Platforms</Label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {socialPlatforms.map((platform) => {
                    const Icon = platform.icon
                    const isSelected = socialPost.platforms.includes(platform.id)
                    
                    return (
                      <button
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        className={`
                          flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
                          ${isSelected 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border hover:border-primary/50'
                          }
                        `}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{platform.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <Label htmlFor="social-content">Post Content</Label>
                <Textarea
                  id="social-content"
                  value={socialPost.content}
                  onChange={(e) => setSocialPost({ ...socialPost, content: e.target.value })}
                  placeholder="What's on your mind?"
                  rows={4}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Add emojis, hashtags, and mentions</span>
                  <span>{socialPost.content.length}/280</span>
                </div>
              </div>

              <div>
                <Label>Media Attachments</Label>
                <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop images or videos here
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Browse Files
                  </Button>
                </div>
              </div>

              <div>
                <Label>Posting Schedule</Label>
                <Select value={socialPost.schedule} onValueChange={(v) => setSocialPost({ ...socialPost, schedule: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Post Now</SelectItem>
                    <SelectItem value="schedule">Schedule for Later</SelectItem>
                    <SelectItem value="optimal">Post at Optimal Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Publish to {socialPost.platforms.length || 'Selected'} Platforms
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Automation</CardTitle>
              <CardDescription>
                Set up automated workflows to engage customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {automationRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">
                          When: {rule.trigger.replace('_', ' ').toUpperCase()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Then: {rule.action.replace('_', ' ')} 
                          {rule.delay !== '0' && ` after ${rule.delay}`}
                        </div>
                      </div>
                    </div>
                    <Switch checked={rule.active} />
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create New Automation
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Journey Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 border-2 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Target className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Visual journey builder coming soon
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          campaign.status === 'active' ? 'bg-green-500' :
                          campaign.status === 'scheduled' ? 'bg-yellow-500' :
                          campaign.status === 'draft' ? 'bg-gray-500' :
                          'bg-blue-900'
                        }`} />
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {campaign.type} • {campaign.audience.toLocaleString()} recipients
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{campaign.engagement}%</p>
                        <p className="text-xs text-muted-foreground">Engagement</p>
                      </div>
                    </div>
                    <Progress value={campaign.engagement} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Marketing Assistant
              </CardTitle>
              <CardDescription>
                Get AI-powered suggestions and content generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Email Subject Lines
                </Button>
                <Button variant="outline" className="justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Create Social Media Posts
                </Button>
                <Button variant="outline" className="justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Audience Segmentation
                </Button>
                <Button variant="outline" className="justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Predict Best Send Times
                </Button>
                <Button variant="outline" className="justify-start">
                  <Gift className="h-4 w-4 mr-2" />
                  Personalization Ideas
                </Button>
                <Button variant="outline" className="justify-start">
                  <BarChart className="h-4 w-4 mr-2" />
                  Campaign Optimization
                </Button>
              </div>

              <div className="bg-primary/10 rounded-lg p-4">
                <h4 className="font-medium mb-2">AI Insights</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Heart className="h-4 w-4 text-primary mt-0.5" />
                    <span>Your audience engages most on Tuesdays at 2 PM PKT</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-primary mt-0.5" />
                    <span>Consider segmenting users who haven't engaged in 30 days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 text-primary mt-0.5" />
                    <span>Promotional emails generate 3x more revenue on weekends</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
