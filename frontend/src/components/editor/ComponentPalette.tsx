import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ScrollArea } from '../ui/scroll-area'
import { Badge } from '../ui/badge'
import { 
  Type, 
  Image, 
  Square, 
  Layout, 
  List, 
  Star,
  MapPin,
  Phone,
  Mail,
  ShoppingCart,
  Calendar,
  Video,
  MousePointer
} from 'lucide-react'

interface Component {
  id: string
  name: string
  icon: React.ComponentType<any>
  category: string
  isPremium?: boolean
  description: string
}

const components: Component[] = [
  // Basic Components
  {
    id: 'heading',
    name: 'Heading',
    icon: Type,
    category: 'Basic',
    description: 'Add titles and headings'
  },
  {
    id: 'text',
    name: 'Text',
    icon: Type,
    category: 'Basic',
    description: 'Add paragraphs and text content'
  },
  {
    id: 'image',
    name: 'Image',
    icon: Image,
    category: 'Basic',
    description: 'Add images and photos'
  },
  {
    id: 'button',
    name: 'Button',
    icon: MousePointer,
    category: 'Basic',
    description: 'Add clickable buttons'
  },
  {
    id: 'divider',
    name: 'Divider',
    icon: Square,
    category: 'Basic',
    description: 'Add horizontal dividers'
  },

  // Layout Components
  {
    id: 'container',
    name: 'Container',
    icon: Layout,
    category: 'Layout',
    description: 'Group and organize content'
  },
  {
    id: 'columns',
    name: 'Columns',
    icon: Layout,
    category: 'Layout',
    description: 'Create responsive columns'
  },
  {
    id: 'hero-section',
    name: 'Hero Section',
    icon: Layout,
    category: 'Layout',
    isPremium: true,
    description: 'Eye-catching hero banners'
  },

  // Content Components
  {
    id: 'gallery',
    name: 'Gallery',
    icon: Image,
    category: 'Content',
    description: 'Image galleries and carousels'
  },
  {
    id: 'testimonials',
    name: 'Testimonials',
    icon: Star,
    category: 'Content',
    description: 'Customer reviews and testimonials'
  },
  {
    id: 'list',
    name: 'List',
    icon: List,
    category: 'Content',
    description: 'Bulleted and numbered lists'
  },

  // Business Components
  {
    id: 'contact-form',
    name: 'Contact Form',
    icon: Mail,
    category: 'Business',
    description: 'Contact and inquiry forms'
  },
  {
    id: 'map',
    name: 'Map',
    icon: MapPin,
    category: 'Business',
    description: 'Embedded Google Maps'
  },
  {
    id: 'phone',
    name: 'Phone',
    icon: Phone,
    category: 'Business',
    description: 'Clickable phone numbers'
  },

  // E-commerce Components
  {
    id: 'product-grid',
    name: 'Product Grid',
    icon: ShoppingCart,
    category: 'E-commerce',
    isPremium: true,
    description: 'Display products in a grid'
  },
  {
    id: 'shopping-cart',
    name: 'Shopping Cart',
    icon: ShoppingCart,
    category: 'E-commerce',
    isPremium: true,
    description: 'Shopping cart functionality'
  },

  // Media Components
  {
    id: 'video',
    name: 'Video',
    icon: Video,
    category: 'Media',
    description: 'Embed videos from YouTube, Vimeo'
  },
  {
    id: 'calendar',
    name: 'Calendar',
    icon: Calendar,
    category: 'Media',
    isPremium: true,
    description: 'Event calendar and booking'
  }
]

const categories = [
  'Basic',
  'Layout', 
  'Content',
  'Business',
  'E-commerce',
  'Media'
]

interface ComponentPaletteProps {
  onDragStart: (component: Component) => void
}

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({ onDragStart }) => {
  const handleDragStart = (e: React.DragEvent, component: Component) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component))
    onDragStart(component)
  }

  return (
    <div className="w-80 bg-background border-r">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Components</h2>
        <p className="text-sm text-muted-foreground">
          Drag components to your page
        </p>
      </div>
      
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4 space-y-6">
          {categories.map((category) => {
            const categoryComponents = components.filter(c => c.category === category)
            
            return (
              <div key={category}>
                <h3 className="font-medium text-sm mb-3 text-muted-foreground uppercase tracking-wide">
                  {category}
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {categoryComponents.map((component) => {
                    const Icon = component.icon
                    
                    return (
                      <Card
                        key={component.id}
                        className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                        draggable
                        onDragStart={(e) => handleDragStart(e, component)}
                      >
                        <CardContent className="p-3">
                          <div className="flex flex-col items-center text-center space-y-2">
                            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded">
                              <Icon className="w-4 h-4 text-primary" />
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center justify-center space-x-1">
                                <h4 className="text-xs font-medium">{component.name}</h4>
                                {component.isPremium && (
                                  <Badge variant="secondary" className="text-xs px-1">
                                    Pro
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {component.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}