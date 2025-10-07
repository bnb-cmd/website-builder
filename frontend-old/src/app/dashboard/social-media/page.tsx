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
  Users,
  MessageSquare,
  Image,
  Video,
  Calendar,
  Send,
  TrendingUp,
  Heart,
  Share2,
  Eye,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Globe
} from 'lucide-react'

export default function SocialMediaPage() {
  const [activeTab, setActiveTab] = useState('posts')
  const [isPosting, setIsPosting] = useState(false)

  const platforms = [
    { name: 'Facebook', icon: Facebook, color: 'text-blue-600', followers: '2.5K', engagement: '4.2%' },
    { name: 'Instagram', icon: Instagram, color: 'text-pink-600', followers: '1.8K', engagement: '6.8%' },
    { name: 'Twitter', icon: Twitter, color: 'text-blue-400', followers: '890', engagement: '3.1%' },
    { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', followers: '1.2K', engagement: '2.9%' },
    { name: 'YouTube', icon: Youtube, color: 'text-red-600', followers: '450', engagement: '8.5%' }
  ]

  const recentPosts = [
    {
      id: 1,
      platform: 'Instagram',
      content: 'Check out our new product launch! 🚀 #innovation #tech',
      image: '/api/template-preview?id=1&category=Business&name=Product%20Launch',
      scheduled: '2024-01-15T10:00:00Z',
      status: 'published',
      engagement: { likes: 45, comments: 12, shares: 8 }
    },
    {
      id: 2,
      platform: 'Facebook',
      content: 'Behind the scenes of our latest photo shoot 📸',
      image: '/api/template-preview?id=2&category=Fashion&name=Photo%20Shoot',
      scheduled: '2024-01-16T14:30:00Z',
      status: 'scheduled',
      engagement: { likes: 0, comments: 0, shares: 0 }
    },
    {
      id: 3,
      platform: 'Twitter',
      content: 'Excited to announce our partnership with @techcompany! 🤝',
      image: null,
      scheduled: '2024-01-14T09:15:00Z',
      status: 'published',
      engagement: { likes: 23, comments: 7, shares: 15 }
    }
  ]

  const handlePost = async () => {
    setIsPosting(true)
    // Simulate posting
    setTimeout(() => {
      setIsPosting(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-500" />
            Social Media Manager
          </h1>
          <p className="text-muted-foreground">
            Manage and schedule your social media content across all platforms
          </p>
        </div>
        <Button onClick={handlePost} disabled={isPosting}>
          {isPosting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Posting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Create Post
            </>
          )}
        </Button>
      </div>

      {/* Platform Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {platforms.map((platform) => (
          <Card key={platform.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{platform.name}</CardTitle>
              <platform.icon className={`h-4 w-4 ${platform.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platform.followers}</div>
              <p className="text-xs text-muted-foreground">
                {platform.engagement} engagement
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          {/* Create New Post */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Post
              </CardTitle>
              <CardDescription>
                Write and schedule your social media content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Platforms</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platforms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Schedule</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="When to post" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">Post Now</SelectItem>
                      <SelectItem value="schedule">Schedule Later</SelectItem>
                      <SelectItem value="draft">Save as Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Content</label>
                <Textarea 
                  placeholder="What's on your mind?" 
                  className="min-h-[100px]"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Media</label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop images or videos here
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Media
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button onClick={handlePost} disabled={isPosting}>
                  {isPosting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Post Now
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Posts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Posts</h3>
            {recentPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{post.platform}</Badge>
                      <Badge 
                        variant={
                          post.status === 'published' ? 'default' :
                          post.status === 'scheduled' ? 'secondary' : 'outline'
                        }
                      >
                        {post.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm">{post.content}</p>
                    
                    {post.image && (
                      <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                        <img
                          src={post.image}
                          alt="Post content"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{post.engagement.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.engagement.comments}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Share2 className="h-4 w-4" />
                          <span>{post.engagement.shares}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(post.scheduled).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <div className="text-center py-16 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Content Calendar</h3>
            <p>Visual calendar for scheduling posts coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-16 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Social Media Analytics</h3>
            <p>Detailed analytics and insights coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-6">
          <div className="text-center py-16 text-muted-foreground">
            <Globe className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Account Management</h3>
            <p>Manage connected social media accounts coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
