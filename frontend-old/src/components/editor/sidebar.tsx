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
  Video, 
  Map, 
  Minus, 
  Space, 
  Star, 
  DollarSign, 
  Megaphone, 
  Mail, 
  Clock, 
  ChevronDown, 
  Grid, 
  Sparkles,
  Search,
  Layers,
  Palette,
  X
} from 'lucide-react'
import { FormIcon, GalleryIcon, SliderIcon, TabsIcon } from '@/components/icons/custom-icons'

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
    icon: FormIcon,
    elements: [
      {
        type: 'form',
        name: 'Contact Form',
        icon: FormIcon,
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
        icon: GalleryIcon,
        description: 'Image galleries and carousels',
        defaultProps: { images: [], layout: 'grid' },
        category: 'media'
      },
      {
        type: 'slider',
        name: 'Slider',
        icon: SliderIcon,
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
        group cursor-grab active:cursor-grabbing p-3 rounded-xl border border-border/50
        hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg hover:-translate-y-0.5
        transition-all duration-200 ease-out
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${element.isPremium ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:border-amber-800 dark:from-amber-950 dark:to-amber-900/50' : 'bg-background/50'}
      `}
    >
      <div className="flex items-center space-x-3">
        <div className={`
          p-2 rounded-lg shadow-sm
          ${element.isPremium 
            ? 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 dark:from-amber-900 dark:to-amber-800 dark:text-amber-300' 
            : 'bg-gradient-to-br from-muted to-muted/50 text-muted-foreground'
          } 
          group-hover:from-primary group-hover:to-primary/80 group-hover:text-primary-foreground group-hover:shadow-md
          transition-all duration-200
        `}>
          <element.icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium text-foreground">{element.name}</h4>
            {element.isPremium && (
              <div className="px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs rounded-md font-semibold shadow-sm">
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

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
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
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50
        w-80 sm:w-96 lg:w-80
        bg-card/95 backdrop-blur-md border-r border-border/50
        flex flex-col
        shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg">Components</h2>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
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
                <span className="hidden sm:inline">Basic</span>
              </TabsTrigger>
              <TabsTrigger value="sections" className="text-xs">
                <Grid className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Sections</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Advanced</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Recently Used Section */}
            {selectedCategory === 'basic' && (
              <div className="px-4 py-3 border-b border-border/50 bg-muted/20">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="h-3.5 w-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Recently Used</span>
                </div>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {['text', 'button', 'image'].map((type) => {
                    const element = componentCategories
                      .flatMap(cat => cat.elements)
                      .find(el => el.type === type)
                    if (!element) return null
                    return (
                      <div
                        key={type}
                        className="flex-shrink-0 w-16 h-16 rounded-lg border border-border/50 bg-background/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-grab flex flex-col items-center justify-center gap-1 group"
                      >
                        <element.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-[10px] text-muted-foreground group-hover:text-foreground">{element.name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {filteredCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <category.icon className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-medium text-sm text-foreground">{category.name}</h3>
                    </div>
                    <div className="space-y-2 px-4">
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
          </div>

        <div className="p-4 border-t border-border">
          <Button variant="outline" size="sm" className="w-full">
            <Palette className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Browse Templates</span>
            <span className="sm:hidden">Templates</span>
          </Button>
        </div>
      </Tabs>
    </div>
    </>
  )
}
