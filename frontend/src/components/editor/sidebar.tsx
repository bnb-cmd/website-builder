'use client'

import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ElementDefinition, ComponentCategory } from '@/types/editor'
import { 
  Type, 
  Heading, 
  Image, 
  Square, 
  Layout, 
  Form, 
  Video, 
  Gallery, 
  Map, 
  Minus, 
  Space, 
  Icon, 
  Share, 
  Star, 
  DollarSign, 
  Megaphone, 
  Mail, 
  Clock, 
  ChevronDown, 
  Tabs as TabsIcon, 
  Slider, 
  Grid, 
  Sparkles,
  Search,
  Layers,
  Palette
} from 'lucide-react'

const componentCategories: ComponentCategory[] = [
  {
    id: 'basic',
    name: 'Basic',
    icon: Layout,
    elements: [
      {
        type: 'text',
        name: 'Text',
        icon: Type,
        description: 'Add text content',
        defaultProps: { content: 'Enter your text here' },
        category: 'basic'
      },
      {
        type: 'heading',
        name: 'Heading',
        icon: Heading,
        description: 'Add headings and titles',
        defaultProps: { content: 'Your Heading', level: 'h2' },
        category: 'basic'
      },
      {
        type: 'image',
        name: 'Image',
        icon: Image,
        description: 'Add images and graphics',
        defaultProps: { src: '', alt: 'Image' },
        category: 'basic'
      },
      {
        type: 'button',
        name: 'Button',
        icon: Square,
        description: 'Add call-to-action buttons',
        defaultProps: { text: 'Click me', variant: 'primary' },
        category: 'basic'
      },
      {
        type: 'container',
        name: 'Container',
        icon: Layout,
        description: 'Group and organize elements',
        defaultProps: { layout: 'vertical' },
        category: 'basic'
      },
      {
        type: 'divider',
        name: 'Divider',
        icon: Minus,
        description: 'Add visual separators',
        defaultProps: { style: 'solid', color: '#e5e7eb' },
        category: 'basic'
      },
      {
        type: 'spacer',
        name: 'Spacer',
        icon: Space,
        description: 'Add spacing between elements',
        defaultProps: { height: '40px' },
        category: 'basic'
      }
    ]
  },
  {
    id: 'forms',
    name: 'Forms',
    icon: Form,
    elements: [
      {
        type: 'form',
        name: 'Contact Form',
        icon: Form,
        description: 'Create contact and lead forms',
        defaultProps: { 
          title: 'Contact Us',
          fields: [
            { type: 'text', label: 'Name', required: true },
            { type: 'email', label: 'Email', required: true },
            { type: 'textarea', label: 'Message', required: true }
          ]
        },
        category: 'forms'
      },
      {
        type: 'newsletter',
        name: 'Newsletter',
        icon: Mail,
        description: 'Email subscription form',
        defaultProps: { 
          title: 'Subscribe to Newsletter',
          placeholder: 'Enter your email'
        },
        category: 'forms'
      }
    ]
  },
  {
    id: 'media',
    name: 'Media',
    icon: Image,
    elements: [
      {
        type: 'video',
        name: 'Video',
        icon: Video,
        description: 'Embed videos from YouTube, Vimeo',
        defaultProps: { url: '', autoplay: false },
        category: 'media'
      },
      {
        type: 'gallery',
        name: 'Gallery',
        icon: Gallery,
        description: 'Image galleries and carousels',
        defaultProps: { images: [], layout: 'grid' },
        category: 'media'
      },
      {
        type: 'slider',
        name: 'Slider',
        icon: Slider,
        description: 'Image and content sliders',
        defaultProps: { slides: [], autoplay: true },
        category: 'media'
      }
    ]
  },
  {
    id: 'sections',
    name: 'Sections',
    icon: Grid,
    elements: [
      {
        type: 'hero',
        name: 'Hero Section',
        icon: Sparkles,
        description: 'Eye-catching hero sections',
        defaultProps: { 
          title: 'Welcome to Our Website',
          subtitle: 'Build amazing experiences',
          buttonText: 'Get Started'
        },
        category: 'sections'
      },
      {
        type: 'features',
        name: 'Features',
        icon: Star,
        description: 'Showcase features and benefits',
        defaultProps: { 
          title: 'Our Features',
          features: []
        },
        category: 'sections'
      },
      {
        type: 'testimonial',
        name: 'Testimonials',
        icon: Star,
        description: 'Customer reviews and testimonials',
        defaultProps: { 
          testimonials: []
        },
        category: 'sections'
      },
      {
        type: 'pricing',
        name: 'Pricing',
        icon: DollarSign,
        description: 'Pricing tables and plans',
        defaultProps: { 
          plans: []
        },
        category: 'sections',
        isPremium: true
      },
      {
        type: 'cta',
        name: 'Call to Action',
        icon: Megaphone,
        description: 'Convert visitors to customers',
        defaultProps: { 
          title: 'Ready to get started?',
          buttonText: 'Get Started Now'
        },
        category: 'sections'
      }
    ]
  },
  {
    id: 'navigation',
    name: 'Navigation',
    icon: Layout,
    elements: [
      {
        type: 'navbar',
        name: 'Navigation Bar',
        icon: Layout,
        description: 'Website navigation menu',
        defaultProps: { 
          logo: '',
          menuItems: []
        },
        category: 'navigation'
      },
      {
        type: 'footer',
        name: 'Footer',
        icon: Layout,
        description: 'Website footer section',
        defaultProps: { 
          copyright: '© 2024 Your Company',
          links: []
        },
        category: 'navigation'
      }
    ]
  },
  {
    id: 'advanced',
    name: 'Advanced',
    icon: Sparkles,
    elements: [
      {
        type: 'map',
        name: 'Map',
        icon: Map,
        description: 'Interactive maps',
        defaultProps: { 
          address: '',
          zoom: 15
        },
        category: 'advanced',
        isPremium: true
      },
      {
        type: 'countdown',
        name: 'Countdown',
        icon: Clock,
        description: 'Countdown timers',
        defaultProps: { 
          targetDate: new Date().toISOString(),
          title: 'Coming Soon'
        },
        category: 'advanced',
        isPremium: true
      },
      {
        type: 'accordion',
        name: 'Accordion',
        icon: ChevronDown,
        description: 'Collapsible content sections',
        defaultProps: { 
          items: []
        },
        category: 'advanced'
      },
      {
        type: 'tabs',
        name: 'Tabs',
        icon: TabsIcon,
        description: 'Tabbed content sections',
        defaultProps: { 
          tabs: []
        },
        category: 'advanced'
      }
    ]
  }
]

interface DraggableElementProps {
  element: ElementDefinition
}

function DraggableElement({ element }: DraggableElementProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `sidebar-${element.type}`,
    data: {
      type: element.type,
      element
    }
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        group cursor-grab active:cursor-grabbing p-3 rounded-lg border border-border
        hover:border-primary hover:bg-primary/5 transition-all duration-200
        ${isDragging ? 'opacity-50' : ''}
        ${element.isPremium ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950' : ''}
      `}
    >
      <div className="flex items-center space-x-3">
        <div className={`
          p-2 rounded-md 
          ${element.isPremium 
            ? 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400' 
            : 'bg-muted text-muted-foreground'
          } 
          group-hover:bg-primary group-hover:text-primary-foreground transition-colors
        `}>
          <element.icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium text-foreground">{element.name}</h4>
            {element.isPremium && (
              <div className="px-1.5 py-0.5 bg-amber-500 text-white text-xs rounded font-medium">
                PRO
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {element.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('basic')

  const filteredCategories = componentCategories.map(category => ({
    ...category,
    elements: category.elements.filter(element =>
      element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.elements.length > 0)

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg mb-3">Components</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1 flex flex-col">
        <div className="px-4 py-2">
          <TabsList className="grid w-full grid-cols-3 gap-1">
            <TabsTrigger value="basic" className="text-xs">
              <Layers className="h-3 w-3 mr-1" />
              Basic
            </TabsTrigger>
            <TabsTrigger value="sections" className="text-xs">
              <Grid className="h-3 w-3 mr-1" />
              Sections
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Advanced
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 px-4">
          {filteredCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <category.icon className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium text-sm text-foreground">{category.name}</h3>
                  </div>
                  <div className="space-y-2">
                    {category.elements.map((element) => (
                      <DraggableElement key={element.type} element={element} />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}

          {searchTerm && (
            <TabsContent value="search" className="mt-0">
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-foreground">Search Results</h3>
                {filteredCategories.map((category) => 
                  category.elements.length > 0 && (
                    <div key={category.id}>
                      <h4 className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                        {category.name}
                      </h4>
                      <div className="space-y-2">
                        {category.elements.map((element) => (
                          <DraggableElement key={element.type} element={element} />
                        ))}
                      </div>
                      <Separator className="my-4" />
                    </div>
                  )
                )}
                {filteredCategories.every(cat => cat.elements.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No components found matching "{searchTerm}"
                  </p>
                )}
              </div>
            </TabsContent>
          )}
        </ScrollArea>

        <div className="p-4 border-t border-border">
          <Button variant="outline" size="sm" className="w-full">
            <Palette className="h-4 w-4 mr-2" />
            Browse Templates
          </Button>
        </div>
      </Tabs>
    </div>
  )
}
