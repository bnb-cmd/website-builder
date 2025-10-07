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
  FormInput as Form, 
  Video, 
  Images as Gallery, 
  MapPin as Map, 
  Minus, 
  Space, 
  Sparkle as Icon, 
  Share2 as Share, 
  Star, 
  DollarSign, 
  Megaphone, 
  Mail, 
  Clock, 
  ChevronDown, 
  Tabs as TabsIcon, 
  Play as Slider, 
  Grid, 
  Sparkles,
  Search,
  Layers,
  Palette,
  Music,
  Code,
  Info,
  Briefcase,
  MessageSquare,
  Users,
  HelpCircle,
  List,
  Play,
  ChevronRight,
  GitBranch,
  TrendingUp,
  BarChart,
  Filter,
  ExternalLink,
  Bell,
  Award,
  Handshake,
  ShoppingCart,
  CreditCard,
  Heart,
  GitCompare,
  Eye,
  Menu,
  Sidebar as SidebarIcon,
  MoreHorizontal,
  LogIn,
  UserPlus,
  Download,
  FileText,
  Columns,
  Timer,
  Table,
  Package,
  Globe,
  Zap,
  Terminal,
  FileDown,
  Navigation,
  MessageCircle,
  ThumbsUp,
  Share as ShareIcon,
  ShoppingBag,
  Package2,
  BarChart3,
  Activity,
  Percent,
  Calendar,
  Link2,
  Home,
  BookOpen,
  RefreshCw
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
        type: 'icon',
        name: 'Icon',
        icon: Icon,
        description: 'Add icons and symbols',
        defaultProps: { icon: 'star', size: 24 },
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
    id: 'layout',
    name: 'Layout',
    icon: Grid,
    elements: [
      {
        type: 'container',
        name: 'Container',
        icon: Layout,
        description: 'Group and organize elements',
        defaultProps: { layout: 'vertical' },
        category: 'layout'
      },
      {
        type: 'grid',
        name: 'Grid',
        icon: Grid,
        description: 'Create grid layouts',
        defaultProps: { columns: 3, gap: 16 },
        category: 'layout'
      },
      {
        type: 'flexbox',
        name: 'Flexbox',
        icon: Columns,
        description: 'Flexible box layouts',
        defaultProps: { direction: 'row', align: 'center' },
        category: 'layout'
      },
      {
        type: 'section',
        name: 'Section',
        icon: Square,
        description: 'Page sections',
        defaultProps: { padding: '60px 0' },
        category: 'layout'
      },
      {
        type: 'column',
        name: 'Column',
        icon: Columns,
        description: 'Single column',
        defaultProps: { width: '100%' },
        category: 'layout'
      },
      {
        type: 'row',
        name: 'Row',
        icon: Layout,
        description: 'Horizontal row',
        defaultProps: { gap: 16 },
        category: 'layout'
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
        description: 'Embed videos',
        defaultProps: { url: '', autoplay: false },
        category: 'media'
      },
      {
        type: 'audio',
        name: 'Audio',
        icon: Music,
        description: 'Audio player',
        defaultProps: { src: '', controls: true },
        category: 'media'
      },
      {
        type: 'gallery',
        name: 'Gallery',
        icon: Gallery,
        description: 'Image galleries',
        defaultProps: { images: [], layout: 'grid' },
        category: 'media'
      },
      {
        type: 'carousel',
        name: 'Carousel',
        icon: ChevronRight,
        description: 'Image carousel',
        defaultProps: { images: [], autoplay: true },
        category: 'media'
      },
      {
        type: 'slider',
        name: 'Slider',
        icon: Slider,
        description: 'Content slider',
        defaultProps: { slides: [], autoplay: true },
        category: 'media'
      },
      {
        type: 'embed',
        name: 'Embed',
        icon: Code,
        description: 'Embed external content',
        defaultProps: { code: '' },
        category: 'media'
      },
      {
        type: 'pdf',
        name: 'PDF Viewer',
        icon: FileText,
        description: 'Display PDF files',
        defaultProps: { src: '', height: '600px' },
        category: 'media',
        isPremium: true
      }
    ]
  },
  {
    id: 'content',
    name: 'Content',
    icon: FileText,
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
        category: 'content'
      },
      {
        type: 'features',
        name: 'Features',
        icon: Star,
        description: 'Showcase features',
        defaultProps: { 
          title: 'Our Features',
          features: []
        },
        category: 'content'
      },
      {
        type: 'about',
        name: 'About Us',
        icon: Info,
        description: 'About section',
        defaultProps: { 
          title: 'About Us',
          content: ''
        },
        category: 'content'
      },
      {
        type: 'services',
        name: 'Services',
        icon: Briefcase,
        description: 'Service listings',
        defaultProps: { 
          title: 'Our Services',
          services: []
        },
        category: 'content'
      },
      {
        type: 'portfolio',
        name: 'Portfolio',
        icon: Image,
        description: 'Project showcase',
        defaultProps: { 
          projects: []
        },
        category: 'content',
        isPremium: true
      },
      {
        type: 'testimonial',
        name: 'Testimonials',
        icon: MessageSquare,
        description: 'Customer reviews',
        defaultProps: { 
          testimonials: []
        },
        category: 'content'
      },
      {
        type: 'team',
        name: 'Team',
        icon: Users,
        description: 'Team members',
        defaultProps: { 
          members: []
        },
        category: 'content'
      },
      {
        type: 'clients',
        name: 'Clients',
        icon: Users,
        description: 'Client logos',
        defaultProps: { 
          clients: []
        },
        category: 'content'
      },
      {
        type: 'partners',
        name: 'Partners',
        icon: Handshake,
        description: 'Partner logos',
        defaultProps: { 
          partners: []
        },
        category: 'content'
      },
      {
        type: 'awards',
        name: 'Awards',
        icon: Award,
        description: 'Awards & achievements',
        defaultProps: { 
          awards: []
        },
        category: 'content',
        isPremium: true
      },
      {
        type: 'pricing',
        name: 'Pricing',
        icon: DollarSign,
        description: 'Pricing tables',
        defaultProps: { 
          plans: []
        },
        category: 'content'
      },
      {
        type: 'faq',
        name: 'FAQ',
        icon: HelpCircle,
        description: 'Frequently asked questions',
        defaultProps: { 
          faqs: []
        },
        category: 'content'
      },
      {
        type: 'cta',
        name: 'Call to Action',
        icon: Megaphone,
        description: 'Convert visitors',
        defaultProps: { 
          title: 'Ready to get started?',
          buttonText: 'Get Started Now'
        },
        category: 'content'
      },
      {
        type: 'contact',
        name: 'Contact',
        icon: Mail,
        description: 'Contact information',
        defaultProps: { 
          title: 'Contact Us',
          showMap: true
        },
        category: 'content'
      }
    ]
  },
  {
    id: 'interactive',
    name: 'Interactive',
    icon: Zap,
    elements: [
      {
        type: 'form',
        name: 'Contact Form',
        icon: Form,
        description: 'Contact forms',
        defaultProps: { 
          title: 'Contact Us',
          fields: []
        },
        category: 'interactive'
      },
      {
        type: 'accordion',
        name: 'Accordion',
        icon: ChevronDown,
        description: 'Collapsible content',
        defaultProps: { 
          items: []
        },
        category: 'interactive'
      },
      {
        type: 'tabs',
        name: 'Tabs',
        icon: TabsIcon,
        description: 'Tabbed content',
        defaultProps: { 
          tabs: []
        },
        category: 'interactive'
      },
      {
        type: 'timeline',
        name: 'Timeline',
        icon: GitBranch,
        description: 'Timeline display',
        defaultProps: { 
          events: []
        },
        category: 'interactive',
        isPremium: true
      },
      {
        type: 'progress',
        name: 'Progress Bar',
        icon: TrendingUp,
        description: 'Progress indicators',
        defaultProps: { 
          value: 50,
          max: 100
        },
        category: 'interactive'
      },
      {
        type: 'stats',
        name: 'Statistics',
        icon: BarChart,
        description: 'Stat counters',
        defaultProps: { 
          stats: []
        },
        category: 'interactive'
      },
      {
        type: 'chart',
        name: 'Chart',
        icon: BarChart3,
        description: 'Data charts',
        defaultProps: { 
          type: 'bar',
          data: []
        },
        category: 'interactive',
        isPremium: true
      },
      {
        type: 'table',
        name: 'Table',
        icon: Table,
        description: 'Data tables',
        defaultProps: { 
          headers: [],
          rows: []
        },
        category: 'interactive'
      },
      {
        type: 'countdown',
        name: 'Countdown',
        icon: Timer,
        description: 'Countdown timer',
        defaultProps: { 
          targetDate: new Date().toISOString(),
          title: 'Coming Soon'
        },
        category: 'interactive'
      },
      {
        type: 'map',
        name: 'Map',
        icon: Map,
        description: 'Interactive maps',
        defaultProps: { 
          address: '',
          zoom: 15
        },
        category: 'interactive',
        isPremium: true
      },
      {
        type: 'search',
        name: 'Search Bar',
        icon: Search,
        description: 'Search functionality',
        defaultProps: { 
          placeholder: 'Search...'
        },
        category: 'interactive'
      },
      {
        type: 'filter',
        name: 'Filter',
        icon: Filter,
        description: 'Content filters',
        defaultProps: { 
          filters: []
        },
        category: 'interactive',
        isPremium: true
      }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: Megaphone,
    elements: [
      {
        type: 'newsletter',
        name: 'Newsletter',
        icon: Mail,
        description: 'Email subscription',
        defaultProps: { 
          title: 'Subscribe to Newsletter',
          placeholder: 'Enter your email'
        },
        category: 'marketing'
      },
      {
        type: 'banner',
        name: 'Banner',
        icon: Image,
        description: 'Promotional banners',
        defaultProps: { 
          title: 'Special Offer!',
          dismissible: true
        },
        category: 'marketing'
      },
      {
        type: 'popup',
        name: 'Popup',
        icon: ExternalLink,
        description: 'Popup modals',
        defaultProps: { 
          trigger: 'timer',
          delay: 5000
        },
        category: 'marketing',
        isPremium: true
      },
      {
        type: 'notification',
        name: 'Notification',
        icon: Bell,
        description: 'Notification bars',
        defaultProps: { 
          message: 'Welcome!',
          position: 'top'
        },
        category: 'marketing'
      },
      {
        type: 'social',
        name: 'Social Links',
        icon: Share,
        description: 'Social media links',
        defaultProps: { 
          platforms: []
        },
        category: 'marketing'
      },
      {
        type: 'share',
        name: 'Share Buttons',
        icon: ShareIcon,
        description: 'Content sharing',
        defaultProps: { 
          platforms: ['facebook', 'twitter', 'linkedin']
        },
        category: 'marketing'
      }
    ]
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    icon: ShoppingCart,
    elements: [
      {
        type: 'cart',
        name: 'Shopping Cart',
        icon: ShoppingCart,
        description: 'Cart display',
        defaultProps: { 
          showCount: true
        },
        category: 'ecommerce',
        isPremium: true
      },
      {
        type: 'checkout',
        name: 'Checkout',
        icon: CreditCard,
        description: 'Checkout form',
        defaultProps: { 
          steps: ['shipping', 'payment', 'confirm']
        },
        category: 'ecommerce',
        isPremium: true
      },
      {
        type: 'wishlist',
        name: 'Wishlist',
        icon: Heart,
        description: 'Wishlist button',
        defaultProps: { 
          showCount: true
        },
        category: 'ecommerce',
        isPremium: true
      },
      {
        type: 'compare',
        name: 'Compare',
        icon: GitCompare,
        description: 'Product comparison',
        defaultProps: { 
          maxItems: 3
        },
        category: 'ecommerce',
        isPremium: true
      },
      {
        type: 'quickview',
        name: 'Quick View',
        icon: Eye,
        description: 'Quick product view',
        defaultProps: { 
          productId: ''
        },
        category: 'ecommerce',
        isPremium: true
      },
      {
        type: 'rating',
        name: 'Rating',
        icon: Star,
        description: 'Star ratings',
        defaultProps: { 
          rating: 4.5,
          showCount: true
        },
        category: 'ecommerce'
      }
    ]
  },
  {
    id: 'navigation',
    name: 'Navigation',
    icon: Navigation,
    elements: [
      {
        type: 'navbar',
        name: 'Navigation Bar',
        icon: Menu,
        description: 'Main navigation',
        defaultProps: { 
          logo: '',
          menuItems: []
        },
        category: 'navigation'
      },
      {
        type: 'sidebar',
        name: 'Sidebar',
        icon: SidebarIcon,
        description: 'Side navigation',
        defaultProps: { 
          position: 'left',
          items: []
        },
        category: 'navigation'
      },
      {
        type: 'footer',
        name: 'Footer',
        icon: Layout,
        description: 'Website footer',
        defaultProps: { 
          copyright: '© 2025 Your Company',
          links: []
        },
        category: 'navigation'
      },
      {
        type: 'breadcrumb',
        name: 'Breadcrumb',
        icon: ChevronRight,
        description: 'Navigation path',
        defaultProps: { 
          items: []
        },
        category: 'navigation'
      },
      {
        type: 'pagination',
        name: 'Pagination',
        icon: MoreHorizontal,
        description: 'Page navigation',
        defaultProps: { 
          currentPage: 1,
          totalPages: 10
        },
        category: 'navigation'
      }
    ]
  },
  {
    id: 'blog',
    name: 'Blog & Comments',
    icon: BookOpen,
    elements: [
      {
        type: 'blog',
        name: 'Blog Post',
        icon: FileText,
        description: 'Blog article',
        defaultProps: { 
          title: '',
          content: '',
          author: ''
        },
        category: 'blog'
      },
      {
        type: 'comments',
        name: 'Comments',
        icon: MessageCircle,
        description: 'Comment section',
        defaultProps: { 
          allowReplies: true
        },
        category: 'blog',
        isPremium: true
      },
      {
        type: 'code',
        name: 'Code Block',
        icon: Terminal,
        description: 'Code display',
        defaultProps: { 
          language: 'javascript',
          code: ''
        },
        category: 'blog'
      }
    ]
  },
  {
    id: 'user',
    name: 'User Account',
    icon: Users,
    elements: [
      {
        type: 'login',
        name: 'Login Form',
        icon: LogIn,
        description: 'User login',
        defaultProps: { 
          showRemember: true,
          showForgot: true
        },
        category: 'user'
      },
      {
        type: 'register',
        name: 'Register Form',
        icon: UserPlus,
        description: 'User registration',
        defaultProps: { 
          fields: ['name', 'email', 'password']
        },
        category: 'user'
      },
      {
        type: 'download',
        name: 'Download',
        icon: Download,
        description: 'File download',
        defaultProps: { 
          fileName: '',
          fileUrl: ''
        },
        category: 'user'
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

export function SidebarEnhanced() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState('all')

  const filteredCategories = componentCategories.map(category => ({
    ...category,
    elements: category.elements.filter(element =>
      element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.elements.length > 0)

  const allElements = componentCategories.flatMap(cat => cat.elements)
  const filteredElements = allElements.filter(element =>
    element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    element.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col">
        <div className="px-4 py-2">
          <TabsList className="grid w-full grid-cols-2 gap-1">
            <TabsTrigger value="all" className="text-xs">
              <Layers className="h-3 w-3 mr-1" />
              All
            </TabsTrigger>
            <TabsTrigger value="categories" className="text-xs">
              <Grid className="h-3 w-3 mr-1" />
              Categories
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 px-4">
          <TabsContent value="all" className="mt-0">
            <div className="space-y-2 pb-4">
              {searchTerm ? (
                <>
                  <h3 className="font-medium text-sm text-foreground mb-3">
                    Search Results ({filteredElements.length})
                  </h3>
                  {filteredElements.map((element) => (
                    <DraggableElement key={element.type} element={element} />
                  ))}
                  {filteredElements.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No components found matching "{searchTerm}"
                    </p>
                  )}
                </>
              ) : (
                <>
                  {componentCategories.map((category) => (
                    <div key={category.id} className="mb-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <category.icon className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium text-sm text-foreground">{category.name}</h3>
                        <span className="text-xs text-muted-foreground">({category.elements.length})</span>
                      </div>
                      <div className="space-y-2">
                        {category.elements.map((element) => (
                          <DraggableElement key={element.type} element={element} />
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-0">
            <div className="space-y-1 pb-4">
              {componentCategories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    const element = document.getElementById(`category-${category.id}`)
                    element?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <category.icon className="h-4 w-4 mr-2" />
                  {category.name}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {category.elements.length}
                  </span>
                </Button>
              ))}
            </div>
            <Separator className="mb-4" />
            {filteredCategories.map((category) => (
              <div key={category.id} id={`category-${category.id}`} className="mb-6">
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
            ))}
          </TabsContent>
        </ScrollArea>

        <div className="p-4 border-t border-border space-y-2">
          <Button variant="outline" size="sm" className="w-full" onClick={() => window.open('/templates', '_blank')}>
            <Palette className="h-4 w-4 mr-2" />
            Browse Templates
          </Button>
          <Button variant="outline" size="sm" className="w-full" onClick={() => window.open('/blocks', '_blank')}>
            <Package className="h-4 w-4 mr-2" />
            Pre-built Blocks
          </Button>
        </div>
      </Tabs>
    </div>
  )
}
