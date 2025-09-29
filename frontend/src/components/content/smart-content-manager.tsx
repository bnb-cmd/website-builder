'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  Calendar as CalendarIcon,
  Clock,
  FileText,
  Image,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Share,
  BarChart3,
  Zap,
  Target,
  TrendingUp,
  Users,
  MessageSquare,
  Star,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { apiHelpers } from '@/lib/api'
import type {
  Content,
  ContentCategory,
  ContentSchedule,
  ContentAnalytics,
  ContentTemplate,
  ContentStatus,
  ContentType
} from '@/types/ecommerce'

interface SmartContentManagerProps {
  websiteId: string
}

export function SmartContentManager({ websiteId }: SmartContentManagerProps) {
  const [contents, setContents] = useState<Content[]>([])
  const [categories, setCategories] = useState<ContentCategory[]>([])
  const [templates, setTemplates] = useState<ContentTemplate[]>([])
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [scheduleDate, setScheduleDate] = useState<Date>()
  const [schedulePlatforms, setSchedulePlatforms] = useState<string[]>([])

  // Content Form State
  const [contentForm, setContentForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    categoryId: '',
    tags: [] as string[],
    type: 'blog_post' as ContentType,
    seo: {
      title: '',
      description: '',
      keywords: [] as string[],
      noIndex: false,
      noFollow: false
    }
  })

  useEffect(() => {
    loadContents()
    loadCategories()
    loadTemplates()
  }, [websiteId])

  const loadContents = async () => {
    try {
      setIsLoading(true)
      const response = await apiHelpers.getContents(websiteId, {
        search: searchQuery,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined
      })
      setContents(response.data.contents || [])
    } catch (error) {
      console.error('Failed to load contents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await apiHelpers.getContentCategories(websiteId)
      setCategories(response.data.categories || [])
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const loadTemplates = async () => {
    try {
      const response = await apiHelpers.getContentTemplates()
      setTemplates(response.data.templates || [])
    } catch (error) {
      console.error('Failed to load templates:', error)
    }
  }

  const handleCreateContent = async () => {
    try {
      setIsLoading(true)
      await apiHelpers.createContent(websiteId, {
        ...contentForm,
        status: 'draft' as ContentStatus
      })
      setShowCreateModal(false)
      resetContentForm()
      loadContents()
    } catch (error) {
      console.error('Failed to create content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleScheduleContent = async (contentId: string) => {
    if (!scheduleDate) return

    try {
      setIsLoading(true)
      await apiHelpers.scheduleContent(contentId, {
        scheduledAt: scheduleDate.toISOString(),
        platforms: schedulePlatforms
      })
      setShowScheduleModal(false)
      setScheduleDate(undefined)
      setSchedulePlatforms([])
      loadContents()
    } catch (error) {
      console.error('Failed to schedule content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAISEOOptimization = async (contentId: string) => {
    try {
      setIsLoading(true)
      await apiHelpers.optimizeContentSEO(contentId)
      loadContents()
    } catch (error) {
      console.error('Failed to optimize SEO:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetContentForm = () => {
    setContentForm({
      title: '',
      content: '',
      excerpt: '',
      categoryId: '',
      tags: [],
      type: 'blog_post',
      seo: {
        title: '',
        description: '',
        keywords: [],
        noIndex: false,
        noFollow: false
      }
    })
  }

  const filteredContents = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || content.status === statusFilter
    const matchesType = typeFilter === 'all' || content.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: ContentStatus) => {
    switch (status) {
      case 'published': return 'bg-green-500'
      case 'scheduled': return 'bg-blue-500'
      case 'draft': return 'bg-yellow-500'
      case 'archived': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getSEOScore = (content: Content): number => {
    let score = 0
    if (content.seo.title && content.seo.title.length > 0) score += 20
    if (content.seo.description && content.seo.description.length > 50) score += 20
    if (content.seo.keywords && content.seo.keywords.length > 0) score += 20
    if (content.title.length > 0) score += 15
    if (content.excerpt && content.excerpt.length > 0) score += 15
    if (content.featuredImage) score += 10
    return Math.min(score, 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Smart Content Manager</h1>
          <p className="text-muted-foreground">
            AI-powered content creation, scheduling, and SEO optimization
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Content</span>
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="blog_post">Blog Post</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="page">Page</SelectItem>
                <SelectItem value="product_description">Product Description</SelectItem>
                <SelectItem value="landing_page">Landing Page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContents.map((content) => (
          <Card key={content.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{content.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {content.excerpt || content.content.substring(0, 100)}...
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(content.status)}>
                  {content.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* SEO Score */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center space-x-1">
                    <Target className="h-4 w-4" />
                    <span>SEO Score</span>
                  </span>
                  <span className="font-medium">{getSEOScore(content)}%</span>
                </div>
                <Progress value={getSEOScore(content)} className="h-2" />
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center space-x-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{format(new Date(content.createdAt), 'MMM dd')}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{content.type.replace('_', ' ')}</span>
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedContent(content)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAISEOOptimization(content.id)}
                    disabled={isLoading}
                  >
                    <Zap className="h-4 w-4" />
                  </Button>
                  {content.status === 'draft' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedContent(content)
                        setShowScheduleModal(true)
                      }}
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/content/${content.slug}`, '_blank')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Content Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create New Content</CardTitle>
              <CardDescription>
                Use AI-powered templates or create from scratch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Template Selection */}
              <div>
                <Label className="text-base font-medium">Choose a Template</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                  {templates.slice(0, 6).map((template) => (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        setContentForm(prev => ({
                          ...prev,
                          content: template.content,
                          title: template.name
                        }))
                      }}
                    >
                      <CardContent className="p-4 text-center">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h3 className="font-medium text-sm">{template.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {template.category}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Content Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={contentForm.title}
                      onChange={(e) => setContentForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter content title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Content Type</Label>
                    <Select
                      value={contentForm.type}
                      onValueChange={(value: ContentType) => setContentForm(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog_post">Blog Post</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="news">News</SelectItem>
                        <SelectItem value="page">Page</SelectItem>
                        <SelectItem value="product_description">Product Description</SelectItem>
                        <SelectItem value="landing_page">Landing Page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={contentForm.categoryId}
                      onValueChange={(value) => setContentForm(prev => ({ ...prev, categoryId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={contentForm.excerpt}
                      onChange={(e) => setContentForm(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Brief summary of the content"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={contentForm.content}
                      onChange={(e) => setContentForm(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your content here..."
                      rows={12}
                      className="font-mono text-sm"
                    />
                  </div>

                  {/* SEO Settings */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">SEO Settings</Label>
                    <div>
                      <Label htmlFor="seo-title" className="text-xs">SEO Title</Label>
                      <Input
                        id="seo-title"
                        value={contentForm.seo.title}
                        onChange={(e) => setContentForm(prev => ({
                          ...prev,
                          seo: { ...prev.seo, title: e.target.value }
                        }))}
                        placeholder="Custom SEO title"
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="seo-description" className="text-xs">Meta Description</Label>
                      <Textarea
                        id="seo-description"
                        value={contentForm.seo.description}
                        onChange={(e) => setContentForm(prev => ({
                          ...prev,
                          seo: { ...prev.seo, description: e.target.value }
                        }))}
                        placeholder="SEO description (150-160 characters)"
                        rows={2}
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false)
                    resetContentForm()
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateContent}
                  disabled={isLoading || !contentForm.title.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Content'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Schedule Content</CardTitle>
              <CardDescription>
                Schedule "{selectedContent.title}" for publication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Date & Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !scheduleDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={scheduleDate}
                      onSelect={setScheduleDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Social Media Platforms</Label>
                <div className="space-y-2 mt-2">
                  {['facebook', 'twitter', 'linkedin', 'instagram'].map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={platform}
                        checked={schedulePlatforms.includes(platform)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSchedulePlatforms(prev => [...prev, platform])
                          } else {
                            setSchedulePlatforms(prev => prev.filter(p => p !== platform))
                          }
                        }}
                        className="rounded"
                      />
                      <Label htmlFor={platform} className="capitalize">
                        {platform}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowScheduleModal(false)
                    setScheduleDate(undefined)
                    setSchedulePlatforms([])
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleScheduleContent(selectedContent.id)}
                  disabled={isLoading || !scheduleDate}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    'Schedule'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
