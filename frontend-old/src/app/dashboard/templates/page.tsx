'use client'

import { useState, useEffect } from 'react'
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
import { apiHelpers } from '@/lib/api'

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

// Helper function to get template-specific gradient colors
const getTemplateGradient = (category: string) => {
  const gradients: { [key: string]: string } = {
    'Business': 'from-blue-50 to-indigo-100',
    'E-commerce': 'from-green-50 to-emerald-100',
    'Restaurant': 'from-orange-50 to-red-100',
    'Portfolio': 'from-purple-50 to-pink-100',
    'Education': 'from-yellow-50 to-orange-100',
    'Medical': 'from-teal-50 to-cyan-100',
    'Real Estate': 'from-gray-50 to-slate-100',
    'Events': 'from-pink-50 to-rose-100',
    'Blog': 'from-indigo-50 to-blue-100',
    'Non-Profit': 'from-emerald-50 to-green-100',
    'Fitness': 'from-red-50 to-pink-100',
    'Travel': 'from-cyan-50 to-blue-100',
    'Fashion': 'from-rose-50 to-pink-100',
    'Technology': 'from-violet-50 to-purple-100',
    'default': 'from-gray-50 to-slate-100'
  }
  return gradients[category] || gradients.default
}

// Helper function to render template-specific preview
const renderTemplatePreview = (template: Template) => {
  const category = template.category.toLowerCase()
  
  if (category.includes('business') || category.includes('consulting')) {
    return (
      <>
        {/* Header */}
        <div className="h-3 bg-blue-300 rounded w-3/4"></div>
        {/* Content blocks */}
        <div className="space-y-1">
          <div className="h-2 bg-blue-200 rounded w-full"></div>
          <div className="h-2 bg-blue-200 rounded w-5/6"></div>
          <div className="h-2 bg-blue-200 rounded w-4/6"></div>
        </div>
        {/* Services grid */}
        <div className="grid grid-cols-3 gap-1 mt-2">
          <div className="h-8 bg-blue-200 rounded"></div>
          <div className="h-8 bg-blue-200 rounded"></div>
          <div className="h-8 bg-blue-200 rounded"></div>
        </div>
        {/* Footer */}
        <div className="h-2 bg-blue-300 rounded w-1/2 mt-2"></div>
      </>
    )
  }
  
  if (category.includes('ecommerce') || category.includes('fashion') || category.includes('shop')) {
    return (
      <>
        {/* Header */}
        <div className="h-3 bg-green-300 rounded w-3/4"></div>
        {/* Product grid */}
        <div className="grid grid-cols-2 gap-1 mt-2">
          <div className="h-12 bg-green-200 rounded"></div>
          <div className="h-12 bg-green-200 rounded"></div>
          <div className="h-12 bg-green-200 rounded"></div>
          <div className="h-12 bg-green-200 rounded"></div>
        </div>
        {/* Price tags */}
        <div className="flex justify-between mt-1">
          <div className="h-2 bg-green-300 rounded w-1/4"></div>
          <div className="h-2 bg-green-300 rounded w-1/4"></div>
        </div>
        {/* Footer */}
        <div className="h-2 bg-green-300 rounded w-1/2 mt-2"></div>
      </>
    )
  }
  
  if (category.includes('restaurant') || category.includes('food')) {
    return (
      <>
        {/* Header */}
        <div className="h-3 bg-orange-300 rounded w-3/4"></div>
        {/* Menu items */}
        <div className="space-y-1 mt-2">
          <div className="h-2 bg-orange-200 rounded w-full"></div>
          <div className="h-2 bg-orange-200 rounded w-5/6"></div>
          <div className="h-2 bg-orange-200 rounded w-4/6"></div>
          <div className="h-2 bg-orange-200 rounded w-3/4"></div>
        </div>
        {/* Image placeholder */}
        <div className="h-8 bg-orange-200 rounded mt-2"></div>
        {/* Footer */}
        <div className="h-2 bg-orange-300 rounded w-1/2 mt-2"></div>
      </>
    )
  }
  
  if (category.includes('portfolio') || category.includes('creative')) {
    return (
      <>
        {/* Header */}
        <div className="h-3 bg-purple-300 rounded w-3/4"></div>
        {/* Gallery grid */}
        <div className="grid grid-cols-2 gap-1 mt-2">
          <div className="h-8 bg-purple-200 rounded"></div>
          <div className="h-8 bg-purple-200 rounded"></div>
          <div className="h-6 bg-purple-200 rounded"></div>
          <div className="h-6 bg-purple-200 rounded"></div>
        </div>
        {/* Footer */}
        <div className="h-2 bg-purple-300 rounded w-1/2 mt-2"></div>
      </>
    )
  }
  
  // Default preview for other categories
  return (
    <>
      {/* Header */}
      <div className="h-3 bg-gray-300 rounded w-3/4"></div>
      {/* Content blocks */}
      <div className="space-y-1">
        <div className="h-2 bg-gray-200 rounded w-full"></div>
        <div className="h-2 bg-gray-200 rounded w-5/6"></div>
        <div className="h-2 bg-gray-200 rounded w-4/6"></div>
      </div>
      {/* Image placeholder */}
      <div className="h-12 bg-gray-200 rounded mt-2"></div>
      {/* Footer */}
      <div className="h-2 bg-gray-300 rounded w-1/2 mt-2"></div>
    </>
  )
}

export default function TemplatesPage() {
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
        
        const response = await apiHelpers.getTemplates({ limit: 20 })
        
        setTemplates(response.data.templates || [])
        setTotal(response.data.total || 0)
        
        // Generate categories from fetched templates
        const allTemplates = response.data.templates || []
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

  useEffect(() => {
    if (activeTab !== 'advanced') return

    const fetchAdvancedTemplates = async () => {
      try {
        setAdvancedLoading(true)
        setAdvancedError(null)

        const response = await apiHelpers.getAdvancedTemplates({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchQuery || undefined,
          pricingModel: priceFilter === 'all' ? undefined : priceFilter
        })

        const result = response.data.data
        const catalogTemplates = result?.templates ?? result?.data?.templates ?? []
        setAdvancedTemplates(catalogTemplates)

        if (catalogTemplates.length && categories.length === 1) {
          const uniqueCategories = [...new Set(catalogTemplates.map((t: Template) => t.category))] as string[]
          const advancedCategories = uniqueCategories.map(cat => ({
            value: cat.toLowerCase(),
            label: cat,
            count: catalogTemplates.filter((t: Template) => t.category === cat).length
          }))

          setCategories(prev => {
            const existing = new Map(prev.map(cat => [cat.value, cat]))
            for (const cat of advancedCategories) {
              if (!existing.has(cat.value)) {
                existing.set(cat.value, cat)
              }
            }
            return Array.from(existing.values())
          })
        }
      } catch (err: any) {
        console.error('Failed to fetch advanced templates:', err)
        setAdvancedError(`Failed to load advanced templates: ${err.message || 'Unknown error'}`)
        setAdvancedTemplates([])
      } finally {
        setAdvancedLoading(false)
      }
    }

    fetchAdvancedTemplates()
  }, [activeTab, searchQuery, selectedCategory, priceFilter])

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
                            src={`/api/template-preview?id=${template.id}&category=${encodeURIComponent(template.category)}&name=${encodeURIComponent(template.name)}`}
                            alt={template.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/preview:scale-105"
                            onClick={() => handlePreviewTemplate(template)}
                          />
                          
                          {/* Fallback Template Preview */}
                          <div 
                            className={`absolute inset-0 flex items-center justify-center ${template.thumbnail ? 'hidden' : 'flex'}`}
                            style={{ display: template.thumbnail ? 'none' : 'flex' }}
                          >
                            <div className={`w-full h-full bg-gradient-to-br ${getTemplateGradient(template.category)} flex flex-col items-center justify-center p-4`}>
                              <div className="w-full max-w-[200px] space-y-2">
                                {/* Template-specific preview based on category */}
                                {renderTemplatePreview(template)}
                              </div>
                            </div>
                          </div>
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

          {/* Template Preview Modal */}
          {previewMode && previewTemplate && (
            <Card className={`fixed inset-0 z-50 m-auto max-w-4xl overflow-hidden shadow-2xl ${
              previewAnimation ? 'animate-in fade-in duration-300' : ''
            }`}>
              {/* existing preview markup... */}
            </Card>
          )}

          {/* Comparison Mode */}
          {comparisonMode && templatesToCompare.length === 2 && (
            <Card className="fixed inset-0 z-50 m-auto max-w-5xl overflow-hidden shadow-2xl">
              {/* existing comparison markup... */}
            </Card>
          )}
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Advanced Templates
              </h2>
              <p className="text-muted-foreground">
                Premium, AI-enhanced templates with marketplace and collaboration features.
              </p>
            </div>
          </div>

          {advancedLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-muted-foreground">Loading advanced templates...</span>
              </div>
            </div>
          )}

          {advancedError && (
            <Card>
              <CardContent className="py-16 text-center space-y-4">
                <Zap className="h-12 w-12 text-red-500 mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Unable to load advanced templates</h3>
                  <p className="text-muted-foreground">{advancedError}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {!advancedLoading && !advancedError && advancedTemplates.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Crown className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No advanced templates available</h3>
                <p className="text-muted-foreground text-center">
                  Try adjusting your filters or check back later for new premium releases.
                </p>
              </CardContent>
            </Card>
          )}

          {!advancedLoading && !advancedError && advancedTemplates.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {advancedTemplates.map((template) => (
                <Card key={template.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="relative aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg mb-3 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <Sparkles className="h-10 w-10" />
                      </div>
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <Badge variant="secondary" className="bg-purple-500/10 text-purple-500 border-0">
                          Advanced
                        </Badge>
                        {template.isPremium && (
                          <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-0">
                            Premium
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle className="text-xl flex items-center gap-2">
                            {template.name}
                            {template.isNew && <Badge className="bg-green-500 text-white">New</Badge>}
                          </CardTitle>
                          <CardDescription className="line-clamp-2 text-sm">
                            {template.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                        {(template.features ?? []).slice(0, 2).map(feature => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {(template.features ?? []).length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{(template.features ?? []).length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Estimated setup: {template.estimatedTime || '15 mins'}</span>
                      {typeof template.price === 'number' && template.price > 0 ? (
                        <span className="font-medium text-primary">
                          Rs {template.price.toLocaleString()}
                        </span>
                      ) : (
                        <span>Included in premium plan</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => handlePreviewTemplate(template)}
                      >
                        <Eye className="h-4 w-4" /> Preview
                      </Button>
                      <Button
                        className="flex items-center gap-2"
                        onClick={() => handleUseTemplate(template.id)}
                      >
                        <Sparkles className="h-4 w-4" /> Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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

      {/* Quick Preview Modal */}
      {previewTemplate && !previewMode && (
        <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{previewTemplate.name} - Quick Preview</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{previewTemplate.category}</Badge>
                  {previewTemplate.isPremium && (
                    <Badge className="bg-amber-500 text-white">Premium</Badge>
                  )}
                </div>
              </DialogTitle>
              <DialogDescription>
                {previewTemplate.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Template Preview */}
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={`/api/template-preview?id=${previewTemplate.id}&category=${encodeURIComponent(previewTemplate.category)}&name=${encodeURIComponent(previewTemplate.name)}`}
                  alt={previewTemplate.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Difficulty: {previewTemplate.difficulty || 'Easy'}</span>
                  <span>Time: {previewTemplate.estimatedTime || '~15 min'}</span>
                  <span>Price: {previewTemplate.price === 0 ? 'Free' : `PKR ${previewTemplate.price}`}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPreviewTemplate(null)
                      setPreviewMode(true)
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Full Preview
                  </Button>
                  <Button onClick={() => handleUseTemplate(previewTemplate.id)}>
                    <Download className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Template Comparison View */}
      {comparisonMode && templatesToCompare.length === 2 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Template Comparison</h2>
              <Button variant="outline" onClick={exitComparison}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Exit Comparison
              </Button>
            </div>

            <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {templatesToCompare.map((template, index) => (
                  <Card key={template.id} className="relative">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{template.name}</span>
                        <Badge variant={index === 0 ? 'default' : 'secondary'}>
                          Template {index + 1}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Preview */}
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <Eye className="h-8 w-8 text-muted-foreground" />
                      </div>

                      {/* Comparison Grid */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">Category:</span>
                          <p>{template.category}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Price:</span>
                          <p>{template.price === 0 ? 'Free' : `PKR ${template.price}`}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Difficulty:</span>
                          <p>{template.difficulty || 'Easy'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Setup Time:</span>
                          <p>{template.estimatedTime || '~15 min'}</p>
                        </div>
                      </div>

                      {/* Features Comparison */}
                      <div>
                        <h4 className="font-medium mb-3">Features</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {template.features?.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center space-x-2">
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
                            </>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        className="w-full"
                        variant={index === 0 ? 'default' : 'outline'}
                        onClick={() => {
                          exitComparison()
                          handleUseTemplate(template.id)
                        }}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Choose This Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Side-by-side feature comparison */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Feature Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Feature</th>
                        <th className="text-center p-3 font-medium">{templatesToCompare[0].name}</th>
                        <th className="text-center p-3 font-medium">{templatesToCompare[1].name}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Mobile Friendly', 'Customizable'].map((feature, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-3 text-sm">{feature}</td>
                          <td className="p-3 text-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full mx-auto" />
                          </td>
                          <td className="p-3 text-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full mx-auto" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
