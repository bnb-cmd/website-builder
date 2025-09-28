'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Layout, 
  Search, 
  Filter, 
  Star, 
  Download, 
  Eye, 
  Heart,
  ShoppingBag,
  Building,
  Palette,
  Coffee,
  Briefcase,
  GraduationCap,
  HeartHandshake,
  Home,
  Laptop,
  Camera,
  Users,
  Globe,
  Sparkles,
  Check,
  X,
  ChevronRight
} from 'lucide-react'
import { Element } from '@/types/editor'
import { useWebsiteStore } from '@/store/website-store'
import toast from 'react-hot-toast'

interface Template {
  id: string
  name: string
  description: string
  category: string
  businessType: string
  preview: string
  thumbnail: string
  isPremium: boolean
  rating: number
  downloads: number
  tags: string[]
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  sections: Element[]
  features: string[]
}

interface TemplateBlock {
  id: string
  name: string
  category: string
  preview: string
  element: Element
  isPremium: boolean
  tags: string[]
}

const templateCategories = [
  { id: 'all', name: 'All Templates', icon: Layout },
  { id: 'business', name: 'Business', icon: Briefcase },
  { id: 'restaurant', name: 'Restaurant', icon: Coffee },
  { id: 'retail', name: 'Retail', icon: ShoppingBag },
  { id: 'realestate', name: 'Real Estate', icon: Home },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'healthcare', name: 'Healthcare', icon: HeartHandshake },
  { id: 'technology', name: 'Technology', icon: Laptop },
  { id: 'creative', name: 'Creative', icon: Camera },
  { id: 'nonprofit', name: 'Non-Profit', icon: Users },
  { id: 'personal', name: 'Personal', icon: Globe }
]

const mockTemplates: Template[] = [
  {
    id: 'restaurant-modern',
    name: 'Modern Restaurant',
    description: 'A sleek and modern template perfect for upscale restaurants and cafes',
    category: 'restaurant',
    businessType: 'RESTAURANT',
    preview: '/templates/restaurant-modern.jpg',
    thumbnail: '/templates/restaurant-modern-thumb.jpg',
    isPremium: false,
    rating: 4.8,
    downloads: 1234,
    tags: ['modern', 'clean', 'restaurant', 'food', 'responsive'],
    colors: {
      primary: '#d97706',
      secondary: '#92400e',
      accent: '#fbbf24'
    },
    sections: [],
    features: ['Menu Display', 'Online Reservations', 'Gallery', 'Contact Form']
  },
  {
    id: 'business-corporate',
    name: 'Corporate Business',
    description: 'Professional template for corporate businesses and consulting firms',
    category: 'business',
    businessType: 'SERVICE',
    preview: '/templates/business-corporate.jpg',
    thumbnail: '/templates/business-corporate-thumb.jpg',
    isPremium: true,
    rating: 4.9,
    downloads: 2345,
    tags: ['corporate', 'professional', 'business', 'services'],
    colors: {
      primary: '#1e40af',
      secondary: '#1e3a8a',
      accent: '#0f172a'
    },
    sections: [],
    features: ['Services Section', 'Team Profiles', 'Case Studies', 'Contact Form']
  },
  {
    id: 'retail-fashion',
    name: 'Fashion Store',
    description: 'Trendy e-commerce template for fashion and retail stores',
    category: 'retail',
    businessType: 'ECOMMERCE',
    preview: '/templates/retail-fashion.jpg',
    thumbnail: '/templates/retail-fashion-thumb.jpg',
    isPremium: true,
    rating: 4.7,
    downloads: 3456,
    tags: ['ecommerce', 'fashion', 'retail', 'shop', 'modern'],
    colors: {
      primary: '#ec4899',
      secondary: '#db2777',
      accent: '#f472b6'
    },
    sections: [],
    features: ['Product Catalog', 'Shopping Cart', 'Wishlist', 'Size Guide']
  }
]

const mockBlocks: TemplateBlock[] = [
  {
    id: 'hero-gradient',
    name: 'Gradient Hero',
    category: 'hero',
    preview: '/blocks/hero-gradient.jpg',
    isPremium: false,
    tags: ['hero', 'gradient', 'modern'],
    element: {
      id: 'hero-gradient-1',
      type: 'hero',
      props: {
        title: 'Welcome to Our Business',
        subtitle: 'We create amazing experiences',
        buttonText: 'Get Started'
      },
      children: [],
      style: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '600px',
        color: 'white'
      },
      position: { x: 0, y: 0 }
    }
  },
  {
    id: 'features-grid',
    name: 'Features Grid',
    category: 'features',
    preview: '/blocks/features-grid.jpg',
    isPremium: false,
    tags: ['features', 'grid', 'icons'],
    element: {
      id: 'features-grid-1',
      type: 'features',
      props: {
        title: 'Why Choose Us',
        features: [
          { icon: 'star', title: 'Quality Service', description: 'We deliver excellence' },
          { icon: 'zap', title: 'Fast Delivery', description: 'Quick turnaround times' },
          { icon: 'shield', title: 'Secure', description: 'Your data is safe with us' }
        ]
      },
      children: [],
      style: {},
      position: { x: 0, y: 0 }
    }
  },
  {
    id: 'cta-modern',
    name: 'Modern CTA',
    category: 'cta',
    preview: '/blocks/cta-modern.jpg',
    isPremium: true,
    tags: ['cta', 'modern', 'conversion'],
    element: {
      id: 'cta-modern-1',
      type: 'cta',
      props: {
        title: 'Ready to Get Started?',
        subtitle: 'Join thousands of satisfied customers',
        primaryButtonText: 'Start Free Trial',
        secondaryButtonText: 'Learn More'
      },
      children: [],
      style: {
        backgroundColor: '#1a1a1a',
        color: 'white'
      },
      position: { x: 0, y: 0 }
    }
  }
]

interface TemplateLibraryProps {
  onSelectTemplate?: (template: Template) => void
  onSelectBlock?: (block: TemplateBlock) => void
}

export function TemplateLibrary({ onSelectTemplate, onSelectBlock }: TemplateLibraryProps) {
  const [activeTab, setActiveTab] = useState('templates')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  
  const { elements, addElement, updateTheme } = useWebsiteStore()

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesPremium = !showPremiumOnly || template.isPremium
    
    return matchesCategory && matchesSearch && matchesPremium
  })

  const filteredBlocks = mockBlocks.filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         block.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesPremium = !showPremiumOnly || block.isPremium
    
    return matchesSearch && matchesPremium
  })

  const handleUseTemplate = async (template: Template) => {
    try {
      // Clear existing elements
      // In real implementation, this would be more sophisticated
      
      // Apply template colors
      updateTheme({
        colors: template.colors
      })
      
      // Add template sections
      // In real implementation, template.sections would contain actual elements
      
      toast.success(`Template "${template.name}" applied successfully!`)
      onSelectTemplate?.(template)
    } catch (error) {
      toast.error('Failed to apply template')
    }
  }

  const handleAddBlock = (block: TemplateBlock) => {
    addElement(block.element)
    toast.success(`Block "${block.name}" added to your page`)
    onSelectBlock?.(block)
  }

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fId => fId !== id)
        : [...prev, id]
    )
  }

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Template Library
          </CardTitle>
          <Badge variant="secondary">
            {filteredTemplates.length + filteredBlocks.length} items
          </Badge>
        </div>
        
        {/* Search and Filters */}
        <div className="space-y-3 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates and blocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              variant={showPremiumOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowPremiumOnly(!showPremiumOnly)}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Premium Only
            </Button>
            
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 rounded-none">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="blocks">Blocks</TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates" className="mt-0">
            <div className="flex h-[calc(100vh-280px)]">
              {/* Categories Sidebar */}
              <div className="w-48 border-r">
                <ScrollArea className="h-full">
                  <div className="p-2 space-y-1">
                    {templateCategories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? 'secondary' : 'ghost'}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <category.icon className="h-4 w-4 mr-2" />
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Templates Grid */}
              <ScrollArea className="flex-1">
                <div className="p-4">
                  {filteredTemplates.length === 0 ? (
                    <div className="text-center py-12">
                      <Palette className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-medium mb-2">No templates found</h3>
                      <p className="text-muted-foreground text-sm">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {filteredTemplates.map((template) => (
                        <Card key={template.id} className="group hover:shadow-lg transition-all">
                          <div className="relative aspect-video bg-muted">
                            {/* Template Preview */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-purple-500 opacity-20" />
                            
                            {/* Hover Actions */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="secondary">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Preview
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl">
                                  <DialogHeader>
                                    <DialogTitle>{template.name}</DialogTitle>
                                    <DialogDescription>
                                      {template.description}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="aspect-video bg-muted rounded-lg">
                                    {/* Full preview would go here */}
                                  </div>
                                </DialogContent>
                              </Dialog>
                              
                              <Button 
                                size="sm" 
                                onClick={() => handleUseTemplate(template)}
                              >
                                Use Template
                              </Button>
                            </div>
                            
                            {/* Premium Badge */}
                            {template.isPremium && (
                              <Badge className="absolute top-2 right-2 bg-amber-500">
                                PRO
                              </Badge>
                            )}
                          </div>
                          
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold">{template.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {template.description}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFavorite(template.id)}
                              >
                                <Heart 
                                  className={`h-4 w-4 ${
                                    favorites.includes(template.id) 
                                      ? 'fill-red-500 text-red-500' 
                                      : ''
                                  }`} 
                                />
                              </Button>
                            </div>
                            
                            {/* Stats */}
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                {template.rating}
                              </div>
                              <div className="flex items-center">
                                <Download className="h-4 w-4 mr-1" />
                                {template.downloads}
                              </div>
                            </div>
                            
                            {/* Features */}
                            <div className="mt-3 flex flex-wrap gap-1">
                              {template.features.slice(0, 3).map((feature, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                              {template.features.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{template.features.length - 3}
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          {/* Blocks Tab */}
          <TabsContent value="blocks" className="mt-0">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredBlocks.map((block) => (
                    <Card 
                      key={block.id} 
                      className="group hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => handleAddBlock(block)}
                    >
                      <div className="relative aspect-video bg-muted">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-20" />
                        
                        {/* Block Preview */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Layout className="h-8 w-8 text-muted-foreground" />
                        </div>
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="text-white text-center">
                            <Check className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-sm">Click to add</p>
                          </div>
                        </div>
                        
                        {/* Premium Badge */}
                        {block.isPremium && (
                          <Badge className="absolute top-2 right-2 bg-amber-500 text-xs">
                            PRO
                          </Badge>
                        )}
                      </div>
                      
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm">{block.name}</h4>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {block.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
