import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu'
import { Link, useRouter } from '../lib/router'
import { useTemplateStore, useWebsiteStore } from '../lib/store'
import { ImageWithFallback } from '../components/figma/ImageWithFallback'
import { 
  Search, 
  Filter,
  Eye,
  Plus,
  Crown,
  Grid3X3,
  List,
  Star,
  Heart,
  Download
} from 'lucide-react'

const categories = [
  { id: 'all', name: 'All Templates', count: 50 },
  { id: 'business', name: 'Business', count: 12 },
  { id: 'ecommerce', name: 'E-commerce', count: 8 },
  { id: 'restaurant', name: 'Restaurant', count: 6 },
  { id: 'portfolio', name: 'Portfolio', count: 10 },
  { id: 'blog', name: 'Blog', count: 7 },
  { id: 'landing', name: 'Landing Page', count: 9 },
  { id: 'agency', name: 'Agency', count: 5 },
  { id: 'education', name: 'Education', count: 4 },
]

// Mock template data - in production this would come from the API
const mockTemplates = [
  {
    id: '1',
    name: 'Modern Business Pro',
    description: 'Professional business website with modern design and advanced features',
    category: 'business',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    pages: [],
    isPremium: true,
    tags: ['business', 'professional', 'modern', 'corporate'],
    rating: 4.8,
    downloads: 1250,
    featured: true
  },
  {
    id: '2',
    name: 'E-commerce Starter',
    description: 'Complete online store with product catalog, cart, and checkout',
    category: 'ecommerce',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    preview: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    pages: [],
    isPremium: true,
    tags: ['ecommerce', 'shop', 'products', 'cart'],
    rating: 4.9,
    downloads: 980,
    featured: true
  },
  {
    id: '3',
    name: 'Restaurant Menu',
    description: 'Beautiful restaurant website with menu display and ordering system',
    category: 'restaurant',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    preview: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    pages: [],
    isPremium: false,
    tags: ['restaurant', 'food', 'menu', 'ordering'],
    rating: 4.7,
    downloads: 750,
    featured: false
  },
  {
    id: '4',
    name: 'Creative Portfolio',
    description: 'Showcase your work with this stunning portfolio template',
    category: 'portfolio',
    thumbnail: 'https://images.unsplash.com/photo-1627757818592-ce2649563a6c?w=400',
    preview: 'https://images.unsplash.com/photo-1627757818592-ce2649563a6c?w=800',
    pages: [],
    isPremium: false,
    tags: ['portfolio', 'creative', 'showcase', 'gallery'],
    rating: 4.6,
    downloads: 650,
    featured: false
  },
  {
    id: '5',
    name: 'Tech Startup',
    description: 'Modern landing page perfect for tech startups and SaaS companies',
    category: 'landing',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    pages: [],
    isPremium: true,
    tags: ['startup', 'tech', 'saas', 'landing'],
    rating: 4.8,
    downloads: 890,
    featured: true
  },
  {
    id: '6',
    name: 'Blog Minimal',
    description: 'Clean and minimal blog template for content creators',
    category: 'blog',
    thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400',
    preview: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800',
    pages: [],
    isPremium: false,
    tags: ['blog', 'minimal', 'content', 'writing'],
    rating: 4.5,
    downloads: 420,
    featured: false
  }
]

type ViewMode = 'grid' | 'list'

export const TemplatesPage: React.FC = () => {
  const { templates, fetchTemplates, isLoading } = useTemplateStore()
  const { createWebsite } = useWebsiteStore()
  const { navigate } = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  // Use mock data for now since the store might be empty
  const allTemplates = [...templates, ...mockTemplates]

  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'featured':
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      case 'popular':
        return (b.downloads || 0) - (a.downloads || 0)
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      case 'newest':
        return new Date(b.id).getTime() - new Date(a.id).getTime()
      default:
        return 0
    }
  })

  const handleUseTemplate = async (template: any) => {
    try {
      const newWebsite = await createWebsite({
        name: `${template.name} Website`,
        template: template.id,
        thumbnail: template.thumbnail
      })
      navigate(`/dashboard/websites/${newWebsite.id}/edit`)
    } catch (error) {
      console.error('Failed to create website from template:', error)
    }
  }

  const TemplateCard: React.FC<{ template: any }> = ({ template }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg glass-effect overflow-hidden">
      <div className="relative overflow-hidden">
        <ImageWithFallback
          src={template.thumbnail}
          alt={template.name}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
          <div className="flex space-x-3">
            <Button size="sm" className="glass-effect border-white/20 text-white hover:bg-white/10" onClick={() => window.open(template.preview, '_blank')}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm" className="gradient-primary text-white hover:shadow-glow" onClick={() => handleUseTemplate(template)}>
              <Plus className="h-4 w-4 mr-2" />
              Use Template
            </Button>
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex space-x-2">
          {template.featured && (
            <Badge className="gradient-primary text-white shadow-lg">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {template.isPremium && (
            <Badge className="gradient-warm text-white shadow-lg">
              <Crown className="h-3 w-3 mr-1" />
              Pro
            </Badge>
          )}
        </div>
        
        {/* Rating */}
        {template.rating && (
          <div className="absolute top-4 right-4 glass-effect rounded-lg px-3 py-1 text-white text-sm flex items-center shadow-lg">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            {template.rating}
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg truncate flex-1">{template.name}</h3>
          <Button variant="ghost" size="sm" className="ml-2">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {template.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {template.tags?.slice(0, 2).map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          {template.downloads && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Download className="h-3 w-3 mr-1" />
              {template.downloads}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const TemplateListItem: React.FC<{ template: any }> = ({ template }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <ImageWithFallback
              src={template.thumbnail}
              alt={template.name}
              className="w-20 h-16 object-cover rounded"
            />
            {template.isPremium && (
              <Crown className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold truncate">{template.name}</h3>
              {template.featured && (
                <Badge variant="default" className="text-xs">Featured</Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
              {template.description}
            </p>
            
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              {template.rating && (
                <div className="flex items-center">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {template.rating}
                </div>
              )}
              {template.downloads && (
                <div className="flex items-center">
                  <Download className="h-3 w-3 mr-1" />
                  {template.downloads}
                </div>
              )}
              <Badge variant="outline" className="text-xs">
                {template.category}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(template.preview, '_blank')}
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button
              size="sm"
              onClick={() => handleUseTemplate(template)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Use Template
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <Grid3X3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gradient">Templates</h1>
                <p className="text-muted-foreground text-lg">
                  Choose from hundreds of professionally designed templates
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Badge className="gradient-accent text-white">50+</Badge>
                <span>Premium Templates</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="gradient-secondary text-white">Mobile</Badge>
                <span>Responsive Design</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            
            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  {sortBy === 'featured' ? 'Featured' : 
                   sortBy === 'popular' ? 'Popular' :
                   sortBy === 'rating' ? 'Highest Rated' : 'Newest'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('featured')}>
                  Featured
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('popular')}>
                  Most Popular
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('rating')}>
                  Highest Rated
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('newest')}>
                  Newest
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
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

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          {/* Category Tabs */}
          <TabsList className="w-full justify-start overflow-x-auto">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="whitespace-nowrap">
                {category.name} ({category.count})
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Content */}
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              {isLoading ? (
                <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-4'}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i}>
                      <div className="w-full h-48 bg-muted animate-pulse rounded-t-lg" />
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded animate-pulse" />
                          <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : sortedTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Grid3X3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No templates found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or browse a different category
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">
                      {sortedTemplates.length} template{sortedTemplates.length === 1 ? '' : 's'} found
                    </p>
                  </div>

                  <div className={
                    viewMode === 'grid' 
                      ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                      : 'space-y-4'
                  }>
                    {sortedTemplates.map((template) => (
                      viewMode === 'grid' ? (
                        <TemplateCard key={template.id} template={template} />
                      ) : (
                        <TemplateListItem key={template.id} template={template} />
                      )
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}