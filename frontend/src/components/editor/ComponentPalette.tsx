import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ScrollArea } from '../ui/scroll-area'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
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
  MousePointer,
  Zap,
  Grid,
  Quote,
  CreditCard,
  AlignLeft,
  Minus,
  Columns,
  Highlighter,
  Info,
  BarChart3,
  Code,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Clock,
  HelpCircle,
  FileText,
  Share2,
  Search,
  Filter,
  User,
  CheckCircle,
  Award,
  Shield,
  Navigation,
  Users,
  Heart,
  Package,
  Truck,
  Lock
} from 'lucide-react'
import { 
  getComponentsByCategoryMap, 
  componentCategories,
  ComponentMetadata 
} from '../website/registry'
import { cn } from '../../lib/utils'

// Icon mapping for components
const iconMap: Record<string, React.ComponentType<any>> = {
  'heading': Type,
  'text': AlignLeft,
  'button': MousePointer,
  'image': Image,
  'divider': Minus,
  'container': Square,
  'columns': Columns,
  'hero-section': Zap,
  'gallery': Grid,
  'testimonials': Quote,
  'list': List,
  'contact-form': Mail,
  'map': MapPin,
  'phone': Phone,
  'email': Mail,
  'product-grid': Grid,
  'shopping-cart': ShoppingCart,
  'pricing-card': CreditCard,
  'video': Video,
  'calendar': Calendar,
  'typography': Type,
  'spacer': Minus,
  'icon': Star,
  'link': ExternalLink,
  'badge': Star,
  'code': Code,
  'quote': Quote,
  'highlight': Highlighter,
  'tooltip': Info,
  'progress': BarChart3,
  'grid': Grid,
  'flexbox': Layout,
  'card': Square,
  'section': Layout,
  'sidebar': Layout,
  'header': Layout,
  'footer': Layout,
  'navigation': Layout,
  'breadcrumb': ExternalLink,
  'pagination': ExternalLink,
  'accordion': ChevronDown,
  'tabs': Layout,
  'timeline': Clock,
  'faq': HelpCircle,
  'blog-post': FileText,
  'article': FileText,
  'newsletter': Mail,
  'social-media': Share2,
  'search': Search,
  'filter': Filter,
  'team-member': User,
  'service-card': CheckCircle,
  'pricing-table': CreditCard,
  'feature-list': CheckCircle,
  'about-section': Users,
  'contact-info': Phone,
  'location-card': MapPin,
  'hours': Clock,
  'reviews': Star,
  'cta': ExternalLink,
  'product-card': ShoppingCart,
  'category-filter': Filter,
  'wishlist': Heart,
  'checkout': CreditCard,
  'order-summary': Package,
  'payment-form': Lock,
  'shipping-info': Truck,
  'product-reviews': Star,
  'related-products': Grid,
  'cart-summary': ShoppingCart
}

// Category display names
const categoryDisplayNames: Record<string, string> = {
  'basic': 'Basic',
  'layout': 'Layout',
  'content': 'Content',
  'business': 'Business',
  'ecommerce': 'E-commerce',
  'media': 'Media'
}

interface ComponentPaletteProps {
  onDragStart: (component: ComponentMetadata) => void
}

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({ onDragStart }) => {
  const componentsByCategory = getComponentsByCategoryMap()
  // Start with all categories expanded by default
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())

  const handleDragStart = (e: React.DragEvent, component: ComponentMetadata) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component.config))
    e.dataTransfer.effectAllowed = 'copy'
    onDragStart(component)
    console.log('Drag started for component:', component.config.name)
  }

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  const isCategoryCollapsed = (category: string) => collapsedCategories.has(category)

  return (
    <div className="w-80 bg-background border-r">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Components</h2>
        <p className="text-sm text-muted-foreground">
          Drag components to your page
        </p>
      </div>
      
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4 space-y-4">
          {componentCategories.map((category) => {
            const categoryComponents = componentsByCategory[category]
            
            if (!categoryComponents || categoryComponents.length === 0) {
              return null
            }
            
            const isCollapsed = isCategoryCollapsed(category)
            
            return (
              <div key={category} className="space-y-2">
                {/* Category Header */}
                <Button
                  variant="ghost"
                  className="w-full justify-between p-2 h-auto font-medium text-sm text-muted-foreground uppercase tracking-wide hover:text-foreground"
                  onClick={() => toggleCategory(category)}
                >
                  <span>{categoryDisplayNames[category]}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {categoryComponents.length}
                    </Badge>
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </Button>
                
                {/* Category Components */}
                {!isCollapsed && (
                  <div className="grid grid-cols-2 gap-3 pl-2">
                    {categoryComponents.map((componentMetadata) => {
                      const component = componentMetadata.config
                      const Icon = iconMap[component.id] || Square
                      
                      return (
                        <Card
                          key={component.id}
                          className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                          draggable
                          onDragStart={(e) => handleDragStart(e, componentMetadata)}
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
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}