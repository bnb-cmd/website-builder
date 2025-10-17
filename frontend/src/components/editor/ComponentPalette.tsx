"use client"

import React, { useState, useEffect } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'
import { cn } from '../../lib/utils'
import { ComponentMetadata } from '@/lib/component-config'
import { ComponentNode, PageSchema } from '../../lib/schema'
import { getComponentRegistry, getComponentsByCategory } from '../website/registry'
import {
  FiSearch as Search,
  FiPlus as Plus,
  FiLayout as Layout,
  FiType as Type,
  FiShoppingCart as ShoppingCart,
  FiFileText as FileText,
  FiImage as Image,
  FiVideo as Video,
  FiMusic as Music,
  FiMapPin as MapPin,
  FiCalendar as Calendar,
  FiUsers as Users,
  FiStar as Star,
  FiHeart as Heart,
  FiMessageCircle as MessageCircle,
  FiMail as Mail,
  FiPhone as Phone,
  FiGlobe as Globe,
  FiDownload as Download,
  FiUpload as Upload,
  FiSettings as Settings,
  FiCode as Code,
  FiDatabase as Database,
  FiBarChart as BarChart,
  FiPieChart as PieChart,
  FiTrendingUp as TrendingUp,
  FiZap as Zap,
  FiShield as Shield,
  FiLock as Lock,
  FiUnlock as Unlock,
  FiEye as Eye,
  FiEyeOff as EyeOff,
  FiCopy as Copy,
  FiTrash2 as Trash2,
  FiEdit as Edit,
  FiSave as Save,
  FiFolder as Folder,
  FiTag as Tag,
  FiHome as Building,
  FiChevronDown as ChevronDown,
  FiChevronRight as ChevronRight,
  FiChevronLeft as ChevronLeft,
  FiImage as Images,
  FiClock as Timer,
  FiLayers as Layers,
  FiSquare as Square,
  FiBarChart as BarChart3,
  FiStar as StarIcon,
  FiShare2 as Share2,
  FiArrowUp as ArrowUp,
  FiFileText as StickyNote,
  FiFileText as ScrollText,
  FiMousePointer as MousePointer,
  FiLoader as Loader,
  FiGrid as Grid3X3Icon,
  FiCreditCard as CreditCard,
  FiPackage as Package,
  FiFilter as Filter,
  FiEye as EyeIcon,
  FiShoppingBag as ShoppingBag,
  FiStar as Review,
  FiGitBranch as Compare,
  FiSearch as SearchIcon,
  FiSun as Lightbulb,
  FiGift as Gift,
  FiFileText as FileTextIcon,
  FiTruck as Truck,
  FiCheckCircle as CheckCircle,
  FiShoppingCart as ShoppingCartIcon,
  FiUser as User,
  FiClock as Clock,
  FiMapPin as MapPinIcon,
  FiPhone as PhoneIcon,
  FiMail as MailIcon,
  FiGlobe as GlobeIcon,
  FiCalendar as CalendarIcon,
  FiUsers as UsersIcon,
  FiMessageCircle as MessageCircleIcon,
  FiHeart as HeartIcon,
  FiStar as StarIcon2,
  FiMusic as MusicIcon,
  FiVideo as VideoIcon,
  FiImage as ImageIcon,
  FiFileText as FileTextIcon2,
  FiPlus as PlusIcon,
  FiDownload as DownloadIcon,
  FiUpload as UploadIcon,
  FiSettings as SettingsIcon,
  FiCode as CodeIcon,
  FiDatabase as DatabaseIcon,
  FiBarChart as BarChartIcon,
  FiPieChart as PieChartIcon,
  FiTrendingUp as TrendingUpIcon,
  FiShield as ShieldIcon,
  FiLock as LockIcon,
  FiUnlock as UnlockIcon,
  FiEye as EyeIcon2,
  FiEyeOff as EyeOffIcon,
  FiCopy as CopyIcon,
  FiTrash2 as Trash2Icon,
  FiEdit as EditIcon,
  FiSave as SaveIcon,
  FiFolder as FolderIcon,
  FiTag as TagIcon,
  FiHome as BuildingIcon,
  FiDollarSign as DollarSign,
  FiPlay as Play
} from 'react-icons/fi'
import { MdPalette as Palette, MdPalette as PaletteIcon } from 'react-icons/md'

interface ComponentPaletteProps {
  onComponentDragStart: (component: ComponentMetadata) => void
  onSaveAsTemplate: (components: ComponentNode[]) => void
  pageSchema: PageSchema
  collapsed?: boolean
  onToggleCollapse?: () => void
}

// Icon mapping function
const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    // Layout icons
    'layout': Layout,
    'grid': Grid3X3Icon,
    'container': Square,
    'section': Layers,
    
    // Content icons
    'text': Type,
    'heading': Type,
    'paragraph': FileText,
    'list': FileText,
    'quote': MessageCircle,
    'accordion': Layers,
    'timeline': Clock,
    'faq': MessageCircle,
    
    // Business icons
    'contact': Phone,
    'form': FileText,
    'team': Users,
    'service': Settings,
    'pricing': DollarSign,
    'about': User,
    'testimonial': Star,
    'feature': CheckCircle,
    'cta': ArrowUp,
    'stats': BarChart3,
    'map': MapPin,
    'hours': Clock,
    'reviews': Star,
    'location': MapPin,
    'appointment': Calendar,
    'newsletter': Mail,
    'job': Users,
    'event': Calendar,
    'feedback': MessageCircle,
    'survey': FileText,
    'lead': User,
    
    // E-commerce icons
    'product': Package,
    'cart': ShoppingCart,
    'checkout': CreditCard,
    'payment': CreditCard,
    'shipping': Truck,
    'order': Package,
    'wishlist': Heart,
    'review': Star,
    'filter': Filter,
    'search': Search,
    'comparison': Compare,
    'recommendation': Lightbulb,
    'bundle': Gift,
    'variant': Settings,
    'gallery': Images,
    'specification': FileText,
    'category': Tag,
    
    // Media icons
    'image': Image,
    'video': Video,
    'audio': Music,
    'player': Play,
    'lightbox': Eye,
    'carousel': Images,
    'slider': Images,
    
    // Interactive icons
    'timer': Timer,
    'tabs': Layers,
    'modal': Square,
    'beforeafter': Compare,
    'progress': BarChart3,
    'rating': Star,
    'share': Share2,
    'backtotop': ArrowUp,
    'sticky': StickyNote,
    'scroll': ScrollText,
    'hotspot': MousePointer,
    'parallax': Layers,
    'lazy': Loader,
    
    // Default fallback
    'default': Square
  }
  
  return iconMap[iconName] || iconMap['default']
}

// Draggable Component Item
const DraggableComponent: React.FC<{ component: ComponentMetadata }> = ({ component }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${component.config.id}`,
    data: {
      fromPalette: true,
      id: component.config.id,
      config: component.config
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
      className={cn(
        "p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-move transition-colors",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {React.createElement(getIconComponent(component.config.icon) || Square, { className: "w-5 h-5 text-gray-600" })}
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
  )
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
  pageSchema,
  collapsed = false,
  onToggleCollapse
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(true)
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())

  // Get all registered components dynamically
  const registry = getComponentRegistry()
  const allComponents = Object.values(registry)
  
  // Group components by category
  const categories: ComponentCategory[] = [
    {
      id: 'layout',
      name: 'Layout',
      icon: <Layout className="w-4 h-4" />,
      components: getComponentsByCategory('layout')
    },
    {
      id: 'content',
      name: 'Content',
      icon: <Type className="w-4 h-4" />,
      components: getComponentsByCategory('content')
    },
    {
      id: 'business',
      name: 'Business',
      icon: <Building className="w-4 h-4" />,
      components: getComponentsByCategory('business')
    },
    {
      id: 'ecommerce',
      name: 'E-commerce',
      icon: <ShoppingCart className="w-4 h-4" />,
      components: getComponentsByCategory('ecommerce')
    },
    {
      id: 'media',
      name: 'Media',
      icon: <Image className="w-4 h-4" />,
      components: getComponentsByCategory('media')
    },
    {
      id: 'interactive',
      name: 'Interactive',
      icon: <Zap className="w-4 h-4" />,
      components: getComponentsByCategory('interactive')
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

  const handleSaveAsTemplate = () => {
    onSaveAsTemplate(pageSchema.components)
  }

  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }
            
  return (
    <Card className={cn(
      "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64 lg:w-72 xl:w-80",
      isExpanded ? "translate-x-0" : "translate-x-full"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          {!collapsed && (
            <h3 className="text-lg font-semibold text-gray-900">Add Section</h3>
          )}
          {collapsed && (
            <div className="flex flex-col items-center space-y-2">
              <Palette className="w-5 h-5 text-gray-600" />
              <span className="text-xs text-gray-500 font-medium">Components</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            {!collapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8 p-0"
              >
                {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            )}
            {onToggleCollapse && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                className="h-8 w-8 p-0"
                title={collapsed ? "Expand palette" : "Collapse palette"}
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* Save as Template */}
        {!collapsed && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3"
            onClick={handleSaveAsTemplate}
          >
            <Save className="w-4 h-4 mr-2" />
            Save as Template
          </Button>
        )}
      </div>

      {/* Categories */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Vertical Category List */}
          <div className={cn("space-y-4", collapsed && "space-y-2")}>
            {filteredCategories.map((category) => {
              const isCollapsed = collapsedCategories.has(category.id)
              
              if (collapsed) {
                // Show only icons when palette is collapsed
                return (
                  <div key={category.id} className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0"
                      onClick={() => toggleCategory(category.id)}
                      title={category.name}
                    >
                      {category.icon}
                    </Button>
                  </div>
                )
              }
              
              return (
                <div key={category.id} className="space-y-2">
                  <div 
                    className="flex items-center justify-between text-sm font-medium text-gray-700 mb-3 cursor-pointer hover:text-gray-900 transition-colors"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="flex items-center space-x-2">
                      {category.icon}
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.components.length}
                      </Badge>
                    </div>
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                  
                  {!isCollapsed && (
                    <div className="grid grid-cols-1 gap-2">
                      {category.components.map((component) => (
                        <DraggableComponent 
                          key={component.config.id}
                          component={component}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

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