'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Loader2
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

export default function TemplatesPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceFilter, setPriceFilter] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [likedTemplates, setLikedTemplates] = useState<string[]>([])
  
  // New state for API data
  const [templates, setTemplates] = useState<Template[]>([])
  const [categories, setCategories] = useState([
    { value: 'all', label: 'All Categories', count: 0 }
  ])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Direct fetch for debugging
        const fetchResponse = await fetch('http://localhost:3005/v1/templates?limit=20')
        if (!fetchResponse.ok) {
          throw new Error(`HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`)
        }
        const response = { data: await fetchResponse.json() }
        
        setTemplates(response.data.templates || [])
        setTotal(response.data.total || 0)
        
        // Generate categories from fetched templates
        const allTemplates = response.data.templates || []
        const uniqueCategories = [...new Set(allTemplates.map((t: Template) => t.category))]
        const categoriesWithCount = [
          { value: 'all', label: 'All Categories', count: allTemplates.length },
          ...uniqueCategories.map(cat => ({
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

  const handlePreviewTemplate = (template: any) => {
    window.open(template.previewUrl, '_blank')
  }

  const toggleLike = (templateId: string) => {
    setLikedTemplates(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
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
        <div className="flex items-center space-x-2">
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
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList>
          <TabsTrigger value="browse">Browse Templates</TabsTrigger>
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
          </div>

          {/* Results Summary */}
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
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading templates...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Palette className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Failed to load templates</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {error}
                </p>
                <Button
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Templates Grid */}
          {!loading && !error && viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="relative aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                      {template.thumbnail ? (
                        <img 
                          src={template.thumbnail} 
                          alt={template.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to gradient if image fails to load
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextElementSibling!.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <div className="text-center">
                          <Eye className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-xs text-muted-foreground">{template.category}</p>
                        </div>
                      </div>
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {template.isPremium && (
                          <Badge className="bg-yellow-500">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => toggleLike(template.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Heart 
                            className={`h-4 w-4 ${
                              likedTemplates.includes(template.id) 
                                ? 'fill-red-500 text-red-500' 
                                : ''
                            }`} 
                          />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handlePreviewTemplate(template)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription className="capitalize">{template.category}</CardDescription>
                        </div>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                            4.8
                          </span>
                          <span className="flex items-center">
                            <Download className="h-3 w-3 mr-1" />
                            {Math.floor(Math.random() * 1000) + 100}
                          </span>
                          <span className="flex items-center">
                            <Heart className="h-3 w-3 mr-1" />
                            {Math.floor(Math.random() * 500) + 50}
                          </span>
                        </div>
                        <div className="font-semibold text-foreground">
                          {template.isPremium ? 'Premium' : 'Free'}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1">
                        {template.features?.length > 0 ? (
                          <>
                            {template.features.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {template.features.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{template.features.length - 3} more
                              </Badge>
                            )}
                          </>
                        ) : (
                          <>
                            <Badge variant="secondary" className="text-xs">Responsive</Badge>
                            <Badge variant="secondary" className="text-xs">Modern</Badge>
                            <Badge variant="secondary" className="text-xs">Fast</Badge>
                          </>
                        )}
                      </div>

                      {/* Use Button */}
                      <Button 
                        className="w-full" 
                        onClick={() => handleUseTemplate(template.id)}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !loading && !error ? (
            /* List View */
            <div className="space-y-4">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-6">
                      {/* Thumbnail */}
                      <div className="relative w-32 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <Eye className="h-6 w-6 text-muted-foreground" />
                        </div>
                        {template.isNew && (
                          <Badge className="absolute top-1 left-1 text-xs bg-green-500">
                            New
                          </Badge>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{template.name}</h3>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{template.category}</Badge>
                            {template.isPremium && (
                              <Badge className="bg-yellow-500">Premium</Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                              {template.rating} ({template.downloads} downloads)
                            </span>
                            <span>Difficulty: {template.difficulty}</span>
                            <span>Setup: ~{template.estimatedTime}</span>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <div className="font-semibold">
                              {template.price === 0 ? 'Free' : `PKR ${template.price}`}
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handlePreviewTemplate(template)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleUseTemplate(template.id)}
                            >
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
          ) : null}

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
    </div>
  )
}
