"use client";
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Search,
  Filter,
  Eye,
  Star,
  Download,
  Heart,
  Grid,
  List,
  Sparkles,
  Crown,
  Zap,
  Palette,
  Loader2,
  Maximize2,
  GitCompare,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'

// Types for template data
interface Template {
  id: string
  name: string
  category: string
  description: string
  thumbnail: string
  isPremium: boolean
  isNew?: boolean
  rating?: number
  downloads?: number
  difficulty?: string
  estimatedTime?: string
  price?: number
  tags: string[]
  pages: string[]
  features: string[]
  elements: any[]
}

const priceFilters = [
  { value: 'all', label: 'All Prices' },
  { value: 'free', label: 'Free' },
  { value: 'premium', label: 'Premium' }
]

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'category', label: 'Category' }
]

const TemplatesPage: React.FC = () => {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceFilter, setPriceFilter] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [likedTemplates, setLikedTemplates] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'browse' | 'advanced' | 'featured' | 'my-templates' | 'favorites'>('browse')

  // Visual Template Browser state
  const [previewMode, setPreviewMode] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [comparisonMode, setComparisonMode] = useState(false)
  const [templatesToCompare, setTemplatesToCompare] = useState<Template[]>([])
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)
  const [previewAnimation, setPreviewAnimation] = useState(false)

  // New state for API data
  const [templates, setTemplates] = useState<Template[]>([])
  const [categories, setCategories] = useState([
    { value: 'all', label: 'All Categories', count: 0 }
  ])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const [advancedTemplates, setAdvancedTemplates] = useState<Template[]>([])
  const [advancedLoading, setAdvancedLoading] = useState(false)
  const [advancedError, setAdvancedError] = useState<string | null>(null)

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Mock data for now - will be replaced with real API call
        const mockTemplates: Template[] = [
          {
            id: '1',
            name: 'Modern Business',
            description: 'Professional business website with modern design',
            category: 'Business',
            thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
            preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
            pages: ['Home', 'About', 'Services', 'Contact'],
            isPremium: false,
            tags: ['business', 'professional', 'modern'],
            features: ['Responsive Design', 'SEO Optimized', 'Fast Loading'],
            elements: [],
            rating: 4.8,
            downloads: 1200,
            difficulty: 'Easy',
            estimatedTime: '15 mins',
            price: 0
          },
          {
            id: '2',
            name: 'E-commerce Store',
            description: 'Complete online store with product catalog',
            category: 'E-commerce',
            thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
            preview: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
            pages: ['Home', 'Products', 'Cart', 'Checkout'],
            isPremium: true,
            tags: ['ecommerce', 'shop', 'products'],
            features: ['Shopping Cart', 'Payment Integration', 'Product Gallery'],
            elements: [],
            rating: 4.9,
            downloads: 800,
            difficulty: 'Medium',
            estimatedTime: '30 mins',
            price: 2999
          },
          {
            id: '3',
            name: 'Restaurant Menu',
            description: 'Beautiful restaurant website with menu display',
            category: 'Restaurant',
            thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
            preview: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
            pages: ['Home', 'Menu', 'About', 'Contact'],
            isPremium: false,
            tags: ['restaurant', 'food', 'menu'],
            features: ['Menu Display', 'Online Ordering', 'Location Map'],
            elements: [],
            rating: 4.7,
            downloads: 950,
            difficulty: 'Easy',
            estimatedTime: '20 mins',
            price: 0
          }
        ]
        
        setTemplates(mockTemplates)
        setTotal(mockTemplates.length)
        
        // Generate categories from fetched templates
        const allTemplates = mockTemplates
        const uniqueCategories = [...new Set(allTemplates.map((t: Template) => t.category))] as string[]
        const categoriesWithCount = [
          { value: 'all', label: 'All Categories', count: allTemplates.length },
          ...uniqueCategories.map((cat: string) => ({
            value: cat.toLowerCase(),
            label: cat,
            count: allTemplates.filter((t: Template) => t.category === cat).length
          }))
        ]
        setCategories(categoriesWithCount)
        
      } catch (err: any) {
        console.error('Failed to fetch templates:', err)
        setError(`Failed to load templates: ${err.message || 'Unknown error'}`)
        setTemplates([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [searchQuery, selectedCategory, priceFilter])

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || template.category.toLowerCase() === selectedCategory
    
    const matchesPrice = priceFilter === 'all' || 
                        (priceFilter === 'free' && !template.isPremium) ||
                        (priceFilter === 'premium' && template.isPremium)
    
    return matchesSearch && matchesCategory && matchesPrice
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.name.localeCompare(a.name) // Sort by name as fallback
      case 'name':
        return a.name.localeCompare(b.name)
      case 'category':
        return a.category.localeCompare(b.category)
      case 'popular':
      default:
        return a.name.localeCompare(b.name) // Default sort by name
    }
  })

  const handleUseTemplate = (templateId: string) => {
    router.push(`/dashboard/websites/new?template=${templateId}`)
  }

  const toggleLike = (templateId: string) => {
    setLikedTemplates(prev =>
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    )
  }

  const handlePreviewTemplate = (template: Template) => {
    setPreviewTemplate(template)
    setPreviewMode(true)
    setPreviewAnimation(true)
    setTimeout(() => setPreviewAnimation(false), 300)
  }

  const closePreview = () => {
    setPreviewMode(false)
    setPreviewTemplate(null)
  }

  const toggleComparison = (template: Template) => {
    setTemplatesToCompare(prev => {
      const isAlreadySelected = prev.some(t => t.id === template.id)
      if (isAlreadySelected) {
        return prev.filter(t => t.id !== template.id)
      } else if (prev.length < 2) {
        return [...prev, template]
      }
      return prev
    })
  }

  const startComparison = () => {
    if (templatesToCompare.length === 2) {
      setComparisonMode(true)
      setPreviewMode(false)
    }
  }

  const exitComparison = () => {
    setComparisonMode(false)
    setTemplatesToCompare([])
  }

  return (
    <div className="space-y-6 -m-6 p-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold">Template Library</h1>
            <p className="text-muted-foreground">
              {loading ? (
                'Loading templates...'
              ) : error ? (
                'Error loading templates'
              ) : (
                `Choose from ${total}+ professionally designed templates`
              )}
            </p>
          </div>
          
          {/* Controls - Stack on mobile, row on desktop */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
            {/* View Mode Controls */}
            <div className="flex items-center space-x-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Visual Browser Controls */}
            <div className="hidden sm:block w-px h-6 bg-border mx-2" />
            <div className="flex items-center space-x-2">
              <Button
                variant={templatesToCompare.length === 2 ? 'default' : 'outline'}
                size="sm"
                onClick={startComparison}
                disabled={templatesToCompare.length !== 2}
                className="flex items-center space-x-2"
              >
                <GitCompare className="h-4 w-4" />
                <span className="hidden sm:inline">Compare ({templatesToCompare.length}/2)</span>
                <span className="sm:hidden">Compare</span>
              </Button>
              {comparisonMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exitComparison}
                  className="flex items-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="hidden sm:inline">Exit Compare</span>
                  <span className="sm:hidden">Exit</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="space-y-6">
        <TabsList>
          <TabsTrigger value="browse">Browse Templates</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Templates</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="my-templates">My Templates (3)</TabsTrigger>
          <TabsTrigger value="favorites">Favorites ({likedTemplates.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priceFilters.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="w-px h-6 bg-border" />
            <Select value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'list')}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid View</SelectItem>
                <SelectItem value="list">List View</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Template Count and Controls */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredTemplates.length} of {total} templates
            </p>
            {(searchQuery || selectedCategory !== 'all' || priceFilter !== 'all') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setPriceFilter('all')
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-muted-foreground">Loading templates...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card>
              <CardContent className="py-16 text-center space-y-4">
                <Zap className="h-12 w-12 text-red-500 mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Unable to load templates</h3>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && !error && filteredTemplates.length > 0 && (
            viewMode === 'grid' ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`group hover:shadow-lg transition-all duration-300 ${
                      hoveredTemplate === template.id ? 'ring-2 ring-primary' : ''
                    } ${
                      templatesToCompare.some(t => t.id === template.id) ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onMouseEnter={() => setHoveredTemplate(template.id)}
                    onMouseLeave={() => setHoveredTemplate(null)}
                  >
                    <CardHeader className="pb-3">
                      <div className="relative aspect-video bg-muted rounded-lg mb-3 overflow-hidden cursor-pointer group/preview">
                        {/* Template Preview Image */}
                        <div className="w-full h-full relative">
                          <img
                            src={template.thumbnail}
                            alt={template.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/preview:scale-105"
                            onClick={() => handlePreviewTemplate(template)}
                          />
                        </div>
                        {template.isPremium && (
                          <Badge className="absolute top-3 left-3 bg-amber-500 text-white">
                            Premium
                          </Badge>
                        )}
                        
                        {/* Quick Preview Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover/preview:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover/preview:opacity-100">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white/90 hover:bg-white text-black shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation()
                              setPreviewTemplate(template)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Quick Preview
                          </Button>
                        </div>
                        
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition"
                          onClick={() => handlePreviewTemplate(template)}
                        >
                          <Eye className="h-4 w-4 mr-2" /> Preview
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {template.name}
                              {template.isNew && <Badge className="bg-green-500 text-white">New</Badge>}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                              {template.description}
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleLike(template.id)}
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                likedTemplates.includes(template.id)
                                  ? 'fill-red-500 text-red-500'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                          {template.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Difficulty: {template.difficulty || 'Medium'}</span>
                        <span>Time: {template.estimatedTime || '15 mins'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                          onClick={() => toggleComparison(template)}
                        >
                          <GitCompare className="h-4 w-4" /> Compare
                        </Button>
                        <Button
                          className="flex items-center gap-2"
                          onClick={() => handleUseTemplate(template.id)}
                        >
                          <Download className="h-4 w-4" /> Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-6">
                        <div className="relative w-32 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          {template.thumbnail ? (
                            <img
                              src={template.thumbnail}
                              alt={template.name}
                              className="w-full h-full object-cover"
                              onClick={() => handlePreviewTemplate(template)}
                              onError={(event) => {
                                const target = event.target as HTMLImageElement
                                target.style.display = 'none'
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                              <Sparkles className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          {template.isNew && (
                            <Badge className="absolute top-1 left-1 text-xs bg-green-500">
                              New
                            </Badge>
                          )}
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">{template.name}</h3>
                                {template.isPremium && (
                                  <Badge className="bg-amber-500 text-white">Premium</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {template.description}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span>{template.category}</span>
                                <span>•</span>
                                <span>{template.tags.slice(0, 3).join(', ')}</span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleLike(template.id)}
                            >
                              <Heart
                                className={`h-4 w-4 ${
                                  likedTemplates.includes(template.id)
                                    ? 'fill-red-500 text-red-500'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <span>
                                <Star className="inline-block h-4 w-4 text-yellow-500 mr-1" />
                                {template.rating || '4.8'}
                              </span>
                              <span>
                                <Download className="inline-block h-4 w-4 text-muted-foreground mr-1" />
                                {template.downloads || 1200} uses
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePreviewTemplate(template)}
                              >
                                <Eye className="h-4 w-4 mr-2" /> Preview
                              </Button>
                              <Button size="sm" onClick={() => handleUseTemplate(template.id)}>
                                Use Template
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          )}

          {/* Empty State */}
          {!loading && !error && filteredTemplates.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Palette className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Try adjusting your search or filters to find more templates
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setPriceFilter('all')
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="advanced">
          <div className="text-center py-16 text-muted-foreground">
            Advanced templates coming soon...
          </div>
        </TabsContent>

        <TabsContent value="featured">
          <div className="text-center py-16 text-muted-foreground">
            Featured templates coming soon...
          </div>
        </TabsContent>

        <TabsContent value="my-templates">
          <div className="text-center py-16 text-muted-foreground">
            Your saved templates will appear here...
          </div>
        </TabsContent>

        <TabsContent value="favorites">
          <div className="text-center py-16 text-muted-foreground">
            {likedTemplates.length === 0 
              ? 'No favorite templates yet. Heart some templates to save them here!'
              : 'Your favorite templates will be displayed here...'
            }
          </div>
        </TabsContent>
      </Tabs>

      {/* Template Preview Modal */}
      {previewMode && previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`bg-background rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden ${
            previewAnimation ? 'animate-in zoom-in-95 duration-300' : ''
          }`}>
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold">{previewTemplate.name}</h2>
                <p className="text-muted-foreground">{previewTemplate.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={closePreview}
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleUseTemplate(previewTemplate.id)}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </div>
            </div>

            <div className="p-6">
              <div className="aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center">
                <div className="text-center">
                  <Eye className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Live Preview</p>
                  <p className="text-muted-foreground mb-4">
                    Interactive preview would load here
                  </p>
                  <Button variant="outline">
                    <Play className="h-4 w-4 mr-2" />
                    Start Preview
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Features</h3>
                  <div className="space-y-2">
                    {previewTemplate.features?.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    )) || (
                      <>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-sm">Responsive Design</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-sm">SEO Optimized</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-sm">Fast Loading</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Pages Included</h3>
                  <div className="space-y-2">
                    {previewTemplate.pages?.map((page, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        • {page}
                      </div>
                    )) || (
                      <>
                        <div className="text-sm text-muted-foreground">• Home Page</div>
                        <div className="text-sm text-muted-foreground">• About Page</div>
                        <div className="text-sm text-muted-foreground">• Contact Page</div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Template Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span>{previewTemplate.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Difficulty:</span>
                      <Badge variant="outline">{previewTemplate.difficulty || 'Easy'}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Setup Time:</span>
                      <span>{previewTemplate.estimatedTime || '~15 min'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium">
                        {previewTemplate.price === 0 ? 'Free' : `PKR ${previewTemplate.price}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TemplatesPage