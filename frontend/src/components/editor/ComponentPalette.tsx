"use client"

import React, { useState, useEffect } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'
import { cn } from '../../lib/utils'
import { ComponentMetadata } from '@/lib/component-config'
import { ComponentNode, PageSchema } from '../../lib/schema'
import { 
  Search,
  Plus,
  Layout,
  Type, 
  ShoppingCart,
  FileText,
  Image, 
  Video,
  Music,
  MapPin,
  Calendar,
  Users,
  Star,
  Heart,
  MessageCircle,
  Mail,
  Phone,
  Globe,
  Download,
  Upload,
  Settings,
  Palette,
  Code,
  Database,
  BarChart,
  PieChart,
  TrendingUp,
  Zap,
  Shield,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Edit,
  Save,
  Folder,
  Tag
} from 'lucide-react'

interface ComponentPaletteProps {
  onComponentDragStart: (component: ComponentMetadata) => void
  onSaveAsTemplate: (components: ComponentNode[]) => void
  pageSchema: PageSchema
}

interface ComponentCategory {
  id: string
  name: string
  icon: React.ReactNode
  components: ComponentMetadata[]
}

const ComponentPalette: React.FC<ComponentPaletteProps> = ({
  onComponentDragStart,
  onSaveAsTemplate,
  pageSchema
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('layout')
  const [isExpanded, setIsExpanded] = useState(true)

  // Component categories with enhanced metadata
  const categories: ComponentCategory[] = [
    {
      id: 'layout',
      name: 'Layout',
      icon: 'layout',
      components: [
        {
          config: {
            id: 'container',
            name: 'Container',
            description: 'Flexible container for grouping elements',
            category: 'layout',
            icon: 'layout',
            defaultProps: {
              padding: 20,
              backgroundColor: '#ffffff',
              borderRadius: 0,
              maxWidth: 1200
            },
            defaultSize: { width: 100, height: 200 },
            editableFields: ['padding', 'backgroundColor', 'borderRadius', 'maxWidth']
          },
          component: () => null
        },
        {
          config: {
            id: 'grid',
            name: 'Grid',
            description: 'CSS Grid layout system',
            category: 'layout',
            icon: 'layout',
            defaultProps: {
              columns: 3,
              gap: 20,
              alignItems: 'stretch'
            },
            defaultSize: { width: 100, height: 300 },
            editableFields: ['columns', 'gap', 'alignItems']
          },
          component: () => null
        },
        {
          config: {
            id: 'flexbox',
            name: 'Flexbox',
            description: 'Flexible box layout',
            category: 'layout',
            icon: 'layout',
            defaultProps: {
              direction: 'row',
              justifyContent: 'flex-start',
              alignItems: 'stretch',
              gap: 20
            },
            defaultSize: { width: 100, height: 200 },
            editableFields: ['direction', 'justifyContent', 'alignItems', 'gap']
          },
          component: () => null
        }
      ]
    },
    {
      id: 'content',
      name: 'Content',
      icon: 'type',
      components: [
        {
          config: {
            id: 'hero',
            name: 'Hero Section',
            description: 'Eye-catching hero section with title and CTA',
            category: 'content',
            icon: 'star',
            defaultProps: {
              title: 'Welcome to Our Website',
              subtitle: 'Create amazing experiences',
              buttonText: 'Get Started',
              buttonUrl: '#',
              backgroundImage: '',
              textColor: '#ffffff',
              buttonColor: '#3b82f6'
            },
            defaultSize: { width: 100, height: 400 },
            editableFields: ['title', 'subtitle', 'buttonText', 'buttonUrl', 'backgroundImage', 'textColor', 'buttonColor']
          },
          component: () => null
        },
        {
          config: {
            id: 'features',
            name: 'Features Grid',
            description: 'Showcase your key features',
            category: 'content',
            icon: 'zap',
            defaultProps: {
              title: 'Our Features',
              features: [
                { title: 'Feature 1', description: 'Description of feature 1', icon: 'star' },
                { title: 'Feature 2', description: 'Description of feature 2', icon: 'heart' },
                { title: 'Feature 3', description: 'Description of feature 3', icon: 'shield' }
              ],
              columns: 3
            },
            defaultSize: { width: 100, height: 500 },
            editableFields: ['title', 'features', 'columns']
          },
          component: () => null
        },
        {
          config: {
            id: 'testimonials',
            name: 'Testimonials',
            description: 'Customer testimonials and reviews',
            category: 'content',
            icon: 'message-circle',
            defaultProps: {
              title: 'What Our Customers Say',
              testimonials: [
                { name: 'John Doe', role: 'CEO', company: 'Company Inc.', content: 'Amazing service!', rating: 5 },
                { name: 'Jane Smith', role: 'Manager', company: 'Corp Ltd.', content: 'Highly recommended!', rating: 5 }
              ]
            },
            defaultSize: { width: 100, height: 400 },
            editableFields: ['title', 'testimonials']
          },
          component: () => null
        },
        {
          config: {
            id: 'blog',
            name: 'Blog Grid',
            description: 'Display blog posts in a grid layout',
            category: 'content',
            icon: 'file-text',
            defaultProps: {
              title: 'Latest Blog Posts',
              posts: [
                { title: 'Post 1', excerpt: 'Excerpt of post 1', date: '2024-01-01', image: '' },
                { title: 'Post 2', excerpt: 'Excerpt of post 2', date: '2024-01-02', image: '' }
              ],
              columns: 3
            },
            defaultSize: { width: 100, height: 600 },
            editableFields: ['title', 'posts', 'columns']
          },
          component: () => null
        }
      ]
    },
    {
      id: 'ecommerce',
      name: 'E-commerce',
      icon: 'shopping-cart',
      components: [
        {
          config: {
            id: 'product-grid',
            name: 'Product Grid',
            description: 'Display products in a grid layout',
            category: 'ecommerce',
            icon: 'shopping-cart',
            defaultProps: {
              title: 'Our Products',
              products: [
                { name: 'Product 1', price: 99, image: '', description: 'Product description' },
                { name: 'Product 2', price: 149, image: '', description: 'Product description' }
              ],
              columns: 3,
              showPrices: true,
              showAddToCart: true
            },
            defaultSize: { width: 100, height: 600 },
            editableFields: ['title', 'products', 'columns', 'showPrices', 'showAddToCart']
          },
          component: () => null
        },
        {
          config: {
            id: 'pricing-table',
            name: 'Pricing Table',
            description: 'Display pricing plans',
            category: 'ecommerce',
            icon: 'bar-chart',
            defaultProps: {
              title: 'Choose Your Plan',
              plans: [
                { name: 'Basic', price: 29, features: ['Feature 1', 'Feature 2'], popular: false },
                { name: 'Pro', price: 59, features: ['Feature 1', 'Feature 2', 'Feature 3'], popular: true },
                { name: 'Enterprise', price: 99, features: ['All Features'], popular: false }
              ]
            },
            defaultSize: { width: 100, height: 500 },
            editableFields: ['title', 'plans']
          },
          component: () => null
        }
      ]
    },
    {
      id: 'forms',
      name: 'Forms',
      icon: 'file-text',
      components: [
        {
          config: {
            id: 'contact-form',
            name: 'Contact Form',
            description: 'Contact form with validation',
            category: 'content',
            icon: 'mail',
            defaultProps: {
              title: 'Get In Touch',
              fields: [
                { name: 'name', label: 'Name', type: 'text', required: true },
                { name: 'email', label: 'Email', type: 'email', required: true },
                { name: 'message', label: 'Message', type: 'textarea', required: true }
              ],
              submitText: 'Send Message',
              successMessage: 'Thank you for your message!'
            },
            defaultSize: { width: 100, height: 400 },
            editableFields: ['title', 'fields', 'submitText', 'successMessage']
          },
          component: () => null
        },
        {
          config: {
            id: 'newsletter',
            name: 'Newsletter Signup',
            description: 'Email newsletter subscription form',
            category: 'content',
            icon: 'mail',
            defaultProps: {
              title: 'Subscribe to Our Newsletter',
              description: 'Get the latest updates and news',
              placeholder: 'Enter your email',
              buttonText: 'Subscribe',
              successMessage: 'Thank you for subscribing!'
            },
            defaultSize: { width: 100, height: 200 },
            editableFields: ['title', 'description', 'placeholder', 'buttonText', 'successMessage']
          },
          component: () => null
        }
      ]
    },
    {
      id: 'media',
      name: 'Media',
      icon: 'image',
      components: [
        {
          config: {
            id: 'gallery',
            name: 'Image Gallery',
            description: 'Responsive image gallery with lightbox',
            category: 'media',
            icon: 'image',
            defaultProps: {
              title: 'Our Gallery',
              images: [
                { src: '', alt: 'Image 1', caption: 'Caption 1' },
                { src: '', alt: 'Image 2', caption: 'Caption 2' }
              ],
              columns: 3,
              aspectRatio: '4:3',
              showCaptions: true,
              lightbox: true
            },
            defaultSize: { width: 100, height: 500 },
            editableFields: ['title', 'images', 'columns', 'aspectRatio', 'showCaptions', 'lightbox']
          },
          component: () => null
        },
        {
          config: {
            id: 'video',
            name: 'Video Player',
            description: 'Embedded video player',
            category: 'media',
            icon: 'video',
            defaultProps: {
              title: 'Watch Our Video',
              videoUrl: '',
              posterImage: '',
              autoplay: false,
              controls: true,
              loop: false
            },
            defaultSize: { width: 100, height: 400 },
            editableFields: ['title', 'videoUrl', 'posterImage', 'autoplay', 'controls', 'loop']
          },
          component: () => null
        }
      ]
    }
  ]

  // Filter components based on search query
  const filteredCategories = categories.map(category => ({
    ...category,
    components: category.components.filter(component =>
      component.config.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.config.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.components.length > 0)

  const handleDragStart = (component: ComponentMetadata) => {
    onComponentDragStart(component)
  }

  const handleSaveAsTemplate = () => {
    onSaveAsTemplate(pageSchema.components)
  }
            
            return (
    <Card className={cn(
      "w-80 bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
      isExpanded ? "translate-x-0" : "translate-x-full"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Add Section</h3>
                <Button
                  variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '←' : '→'}
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
                  </div>

        {/* Save as Template */}
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-3"
          onClick={handleSaveAsTemplate}
        >
          <Save className="w-4 h-4 mr-2" />
          Save as Template
                </Button>
      </div>

      {/* Categories */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Category Tabs */}
          <div className="flex space-x-1 mb-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex-1"
              >
                {category.icon}
                <span className="ml-1 hidden sm:inline">{category.name}</span>
              </Button>
            ))}
                              </div>
                              
          {/* Components */}
          {filteredCategories
            .filter(category => category.id === selectedCategory)
            .map((category) => (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                  {category.icon}
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {category.components.length}
                                    </Badge>
                                </div>
                                
                <div className="grid grid-cols-1 gap-2">
                  {category.components.map((component) => (
                    <div
                      key={component.config.id}
                      className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-move transition-colors"
                      draggable
                      onDragStart={() => handleDragStart(component)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {component.config.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {component.config.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {component.config.description}
                                </p>
                              </div>
                            </div>
                    </div>
                  ))}
                </div>
                  </div>
            ))}

          {/* Empty State */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <Search className="w-8 h-8 mx-auto" />
              </div>
              <p className="text-sm text-gray-500">
                No components found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}

export { ComponentPalette }
export default ComponentPalette