'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Search,
  Grid,
  List,
  Sparkles,
  Star,
  Zap,
  Heart,
  Eye,
  Copy,
  Plus,
  Layout,
  Type,
  Image,
  Square,
  Circle,
  Triangle,
  MousePointer,
  FormInput,
  ShoppingCart,
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  Globe,
  Video,
  Music,
  FileText,
  Link,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List as ListIcon,
  Quote,
  Code,
  Table,
  Columns,
  Rows,
  Box,
  Package,
  Truck,
  Star as StarIcon,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Settings,
  Filter,
  SortAsc,
  SortDesc,
  Download,
  Upload,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Move,
  Maximize2,
  Crop,
  Wand2,
  Palette,
  Brush,
  Eraser,
  Scissors,
  CopyIcon,
  Paste,
  Cut,
  SearchIcon,
  FilterIcon,
  Building,
  GraduationCap,
  Briefcase,
  Utensils,
  Home,
  BookOpen,
  Award,
  Trophy,
  Target,
  Zap as ZapIcon,
  Flame,
  Sparkles as SparklesIcon,
  Gem,
  Crown,
  Shield,
  Ticket,
  Gift,
  Lock,
  Share,
  Users,
  Maximize2,
  HelpCircle,
  GitCompare,
  Bell,
  Clock,
  Mic,
  ChevronRight,
  Calculator
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ComponentDefinition {
  id: string
  name: string
  description: string
  category: string
  subcategory?: string
  icon: any
  preview: React.ComponentType<any>
  defaultProps?: Record<string, any>
  variants?: string[]
  tags: string[]
  aiSuggestions?: {
    context: string[]
    score: number
    reasoning: string
  }[]
  complexity: 'basic' | 'intermediate' | 'advanced'
  popularity: number
  usage: 'low' | 'medium' | 'high'
}

interface ComponentLibraryProps {
  onComponentSelect: (component: ComponentDefinition) => void
  currentContext?: string[]
  searchQuery?: string
}

// Component Categories
const categories = [
  { id: 'layout', name: 'Layout', icon: Layout, color: 'bg-blue-500' },
  { id: 'content', name: 'Content', icon: Type, color: 'bg-green-500' },
  { id: 'interactive', name: 'Interactive', icon: MousePointer, color: 'bg-purple-500' },
  { id: 'forms', name: 'Forms', icon: FormInput, color: 'bg-orange-500' },
  { id: 'commerce', name: 'E-commerce', icon: ShoppingCart, color: 'bg-red-500' },
  { id: 'marketing', name: 'Marketing', icon: TrendingUp, color: 'bg-pink-500' },
  { id: 'data', name: 'Data & Charts', icon: BarChart3, color: 'bg-indigo-500' },
  { id: 'media', name: 'Media', icon: Image, color: 'bg-teal-500' },
  { id: 'navigation', name: 'Navigation', icon: Menu, color: 'bg-gray-500' },
  { id: 'feedback', name: 'Feedback', icon: MessageSquare, color: 'bg-yellow-500' },
  { id: 'advanced', name: 'Advanced', icon: Zap, color: 'bg-purple-600' },
  { id: 'utility', name: 'Utility', icon: Settings, color: 'bg-slate-500' },
  { id: 'business', name: 'Business', icon: Building, color: 'bg-blue-600' },
  { id: 'creative', name: 'Creative', icon: Palette, color: 'bg-pink-500' },
  { id: 'entertainment', name: 'Entertainment', icon: Music, color: 'bg-purple-500' },
  { id: 'education', name: 'Education', icon: GraduationCap, color: 'bg-green-600' },
  { id: 'events', name: 'Events', icon: Calendar, color: 'bg-orange-500' },
  { id: 'portfolio', name: 'Portfolio', icon: Briefcase, color: 'bg-indigo-500' },
  { id: 'restaurant', name: 'Restaurant', icon: Utensils, color: 'bg-red-500' },
  { id: 'healthcare', name: 'Healthcare', icon: Heart, color: 'bg-red-600' },
  { id: 'real-estate', name: 'Real Estate', icon: Home, color: 'bg-teal-500' }
]

// Component Definitions - LOTS of components!
const componentDefinitions: ComponentDefinition[] = [
  // Layout Components
  {
    id: 'container',
    name: 'Container',
    description: 'Responsive container with customizable width and padding',
    category: 'layout',
    icon: Box,
    preview: () => <div className="w-full h-8 bg-muted rounded border-2 border-dashed border-muted-foreground/30 flex items-center justify-center"><Box className="h-4 w-4" /></div>,
    defaultProps: { maxWidth: '1200px', padding: '1rem' },
    variants: ['full-width', 'centered', 'fluid'],
    tags: ['layout', 'container', 'responsive', 'spacing'],
    complexity: 'basic',
    popularity: 95,
    usage: 'high',
    aiSuggestions: [
      {
        context: ['landing-page', 'homepage'],
        score: 90,
        reasoning: 'Containers are essential for structuring page layouts'
      }
    ]
  },
  {
    id: 'grid',
    name: 'Grid Layout',
    description: 'CSS Grid system with responsive breakpoints',
    category: 'layout',
    icon: Grid,
    preview: () => (
      <div className="grid grid-cols-3 gap-1 w-full h-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-muted rounded" />
        ))}
      </div>
    ),
    defaultProps: { columns: 3, gap: '1rem', responsive: true },
    variants: ['2-column', '3-column', '4-column', 'auto-fit'],
    tags: ['grid', 'layout', 'responsive', 'columns'],
    complexity: 'intermediate',
    popularity: 88,
    usage: 'high'
  },
  {
    id: 'flexbox',
    name: 'Flex Container',
    description: 'Flexible box layout for dynamic content arrangement',
    category: 'layout',
    icon: Rows,
    preview: () => (
      <div className="flex space-x-1 w-full h-8">
        <div className="flex-1 bg-muted rounded" />
        <div className="flex-1 bg-muted rounded" />
        <div className="flex-1 bg-muted rounded" />
      </div>
    ),
    defaultProps: { direction: 'row', justify: 'start', align: 'center' },
    variants: ['horizontal', 'vertical', 'wrap', 'no-wrap'],
    tags: ['flex', 'flexbox', 'layout', 'alignment'],
    complexity: 'intermediate',
    popularity: 85,
    usage: 'high'
  },
  {
    id: 'section',
    name: 'Section',
    description: 'Semantic section with background and spacing options',
    category: 'layout',
    icon: Square,
    preview: () => <div className="w-full h-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded border flex items-center justify-center"><Square className="h-4 w-4" /></div>,
    defaultProps: { background: 'white', padding: '2rem', margin: '0' },
    variants: ['hero', 'content', 'footer', 'sidebar'],
    tags: ['section', 'semantic', 'background', 'spacing'],
    complexity: 'basic',
    popularity: 92,
    usage: 'high'
  },
  {
    id: 'columns',
    name: 'Column Layout',
    description: 'Multi-column layout with responsive behavior',
    category: 'layout',
    icon: Columns,
    preview: () => (
      <div className="flex space-x-2 w-full h-8">
        <div className="flex-1 bg-muted rounded" />
        <div className="w-px bg-border" />
        <div className="flex-1 bg-muted rounded" />
      </div>
    ),
    defaultProps: { count: 2, gap: '2rem', responsive: true },
    variants: ['2-column', '3-column', 'sidebar-main', 'main-sidebar'],
    tags: ['columns', 'layout', 'sidebar', 'responsive'],
    complexity: 'intermediate',
    popularity: 80,
    usage: 'medium'
  },

  // Content Components
  {
    id: 'heading',
    name: 'Heading',
    description: 'Typography hierarchy with multiple heading levels',
    category: 'content',
    icon: Type,
    preview: () => <div className="w-full h-8 flex items-center"><Type className="h-4 w-4 mr-2" /><span className="font-bold">Heading</span></div>,
    defaultProps: { level: 'h1', text: 'Heading Text', align: 'left' },
    variants: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    tags: ['heading', 'typography', 'text', 'hierarchy'],
    complexity: 'basic',
    popularity: 98,
    usage: 'high'
  },
  {
    id: 'paragraph',
    name: 'Paragraph',
    description: 'Rich text paragraph with formatting options',
    category: 'content',
    icon: FileText,
    preview: () => <div className="w-full h-8 flex items-center"><FileText className="h-4 w-4 mr-2" /><span className="text-sm">Paragraph text content</span></div>,
    defaultProps: { text: 'This is a paragraph of text content.', align: 'left' },
    variants: ['regular', 'lead', 'small', 'muted'],
    tags: ['paragraph', 'text', 'content', 'formatting'],
    complexity: 'basic',
    popularity: 95,
    usage: 'high'
  },
  {
    id: 'image',
    name: 'Image',
    description: 'Responsive image with lazy loading and optimization',
    category: 'media',
    icon: Image,
    preview: () => <div className="w-full h-16 bg-muted rounded flex items-center justify-center"><Image className="h-6 w-6 text-muted-foreground" /></div>,
    defaultProps: { src: '', alt: '', lazy: true, responsive: true },
    variants: ['rounded', 'circle', 'thumbnail', 'hero'],
    tags: ['image', 'media', 'responsive', 'optimization'],
    complexity: 'basic',
    popularity: 90,
    usage: 'high'
  },
  {
    id: 'video',
    name: 'Video Player',
    description: 'HTML5 video player with controls and autoplay options',
    category: 'media',
    icon: Video,
    preview: () => <div className="w-full h-16 bg-muted rounded flex items-center justify-center"><Video className="h-6 w-6 text-muted-foreground" /></div>,
    defaultProps: { src: '', controls: true, autoplay: false, loop: false },
    variants: ['standard', 'background', 'modal', 'playlist'],
    tags: ['video', 'media', 'player', 'multimedia'],
    complexity: 'intermediate',
    popularity: 75,
    usage: 'medium'
  },
  {
    id: 'quote',
    name: 'Quote Block',
    description: 'Pull quote or testimonial with attribution',
    category: 'content',
    icon: Quote,
    preview: () => <div className="w-full h-12 bg-muted rounded p-2 flex items-center"><Quote className="h-4 w-4 mr-2 text-muted-foreground" /><span className="text-xs italic">Quote text...</span></div>,
    defaultProps: { text: '"This is a quote"', author: 'Author Name', role: 'Role/Company' },
    variants: ['pull-quote', 'testimonial', 'blockquote'],
    tags: ['quote', 'testimonial', 'content', 'attribution'],
    complexity: 'basic',
    popularity: 70,
    usage: 'medium'
  },

  // Interactive Components
  {
    id: 'button',
    name: 'Button',
    description: 'Interactive button with multiple styles and states',
    category: 'interactive',
    icon: Square,
    preview: () => <div className="w-20 h-8 bg-primary rounded flex items-center justify-center"><span className="text-xs text-primary-foreground font-medium">Button</span></div>,
    defaultProps: { text: 'Click me', variant: 'primary', size: 'medium' },
    variants: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    tags: ['button', 'interactive', 'cta', 'action'],
    complexity: 'basic',
    popularity: 100,
    usage: 'high'
  },
  {
    id: 'accordion',
    name: 'Accordion',
    description: 'Collapsible content panels for FAQ and detailed information',
    category: 'interactive',
    icon: ChevronDown,
    preview: () => (
      <div className="w-full space-y-1">
        <div className="h-8 bg-muted rounded flex items-center justify-between px-3"><span className="text-xs">Item 1</span><ChevronDown className="h-3 w-3" /></div>
        <div className="h-8 bg-muted rounded flex items-center justify-between px-3"><span className="text-xs">Item 2</span><ChevronRight className="h-3 w-3" /></div>
      </div>
    ),
    defaultProps: { items: [], multiple: false, defaultOpen: [] },
    variants: ['single', 'multiple', 'styled', 'minimal'],
    tags: ['accordion', 'collapsible', 'faq', 'expandable'],
    complexity: 'intermediate',
    popularity: 78,
    usage: 'medium'
  },
  {
    id: 'tabs',
    name: 'Tab Navigation',
    description: 'Tabbed interface for organizing content',
    category: 'interactive',
    icon: List,
    preview: () => (
      <div className="w-full">
        <div className="flex space-x-1 mb-2">
          <div className="h-6 bg-primary rounded px-2 flex items-center"><span className="text-xs text-primary-foreground">Tab 1</span></div>
          <div className="h-6 bg-muted rounded px-2 flex items-center"><span className="text-xs">Tab 2</span></div>
        </div>
        <div className="h-8 bg-muted/50 rounded"></div>
      </div>
    ),
    defaultProps: { tabs: [], defaultTab: 0, orientation: 'horizontal' },
    variants: ['horizontal', 'vertical', 'pills', 'underline'],
    tags: ['tabs', 'navigation', 'content', 'organization'],
    complexity: 'intermediate',
    popularity: 82,
    usage: 'high'
  },
  {
    id: 'carousel',
    name: 'Carousel',
    description: 'Image or content slider with navigation controls',
    category: 'interactive',
    icon: ArrowRight,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded flex items-center justify-between p-3">
        <ArrowLeft className="h-4 w-4" />
        <div className="flex space-x-2">
          <div className="w-8 h-6 bg-muted-foreground/30 rounded"></div>
          <div className="w-8 h-6 bg-primary rounded"></div>
          <div className="w-8 h-6 bg-muted-foreground/30 rounded"></div>
        </div>
        <ArrowRight className="h-4 w-4" />
      </div>
    ),
    defaultProps: { items: [], autoplay: false, showDots: true, showArrows: true },
    variants: ['images', 'cards', 'testimonials', 'products'],
    tags: ['carousel', 'slider', 'gallery', 'navigation'],
    complexity: 'intermediate',
    popularity: 76,
    usage: 'medium'
  },
  {
    id: 'modal',
    name: 'Modal Dialog',
    description: 'Popup dialog for forms, confirmations, or additional content',
    category: 'interactive',
    icon: Square,
    preview: () => <div className="w-full h-12 bg-muted rounded border-2 border-dashed flex items-center justify-center"><span className="text-xs">Modal Trigger</span></div>,
    defaultProps: { trigger: null, title: 'Modal Title', size: 'medium' },
    variants: ['small', 'medium', 'large', 'fullscreen'],
    tags: ['modal', 'dialog', 'popup', 'overlay'],
    complexity: 'intermediate',
    popularity: 85,
    usage: 'high'
  },

  // Form Components
  {
    id: 'text-input',
    name: 'Text Input',
    description: 'Single-line text input field',
    category: 'forms',
    icon: FormInput,
    preview: () => <div className="w-full h-8 bg-muted rounded border flex items-center px-3"><span className="text-xs text-muted-foreground">Input field</span></div>,
    defaultProps: { placeholder: 'Enter text...', type: 'text', required: false },
    variants: ['text', 'email', 'password', 'search', 'url'],
    tags: ['input', 'form', 'text', 'field'],
    complexity: 'basic',
    popularity: 100,
    usage: 'high'
  },
  {
    id: 'textarea',
    name: 'Text Area',
    description: 'Multi-line text input for longer content',
    category: 'forms',
    icon: FileText,
    preview: () => <div className="w-full h-12 bg-muted rounded border p-2"><span className="text-xs text-muted-foreground">Multi-line text...</span></div>,
    defaultProps: { placeholder: 'Enter longer text...', rows: 4, required: false },
    variants: ['basic', 'rich-text', 'code', 'comment'],
    tags: ['textarea', 'form', 'text', 'multiline'],
    complexity: 'basic',
    popularity: 90,
    usage: 'high'
  },
  {
    id: 'select',
    name: 'Select Dropdown',
    description: 'Dropdown selection from predefined options',
    category: 'forms',
    icon: ChevronDown,
    preview: () => <div className="w-full h-8 bg-muted rounded border flex items-center justify-between px-3"><span className="text-xs">Select option</span><ChevronDown className="h-3 w-3" /></div>,
    defaultProps: { options: [], placeholder: 'Select...', multiple: false },
    variants: ['single', 'multiple', 'searchable', 'grouped'],
    tags: ['select', 'dropdown', 'form', 'options'],
    complexity: 'intermediate',
    popularity: 95,
    usage: 'high'
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    description: 'Boolean selection with check mark',
    category: 'forms',
    icon: CheckCircle,
    preview: () => <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-muted rounded border"></div><span className="text-xs">Checkbox option</span></div>,
    defaultProps: { label: 'Option', checked: false, required: false },
    variants: ['basic', 'switch', 'toggle', 'radio-group'],
    tags: ['checkbox', 'form', 'boolean', 'selection'],
    complexity: 'basic',
    popularity: 98,
    usage: 'high'
  },
  {
    id: 'contact-form',
    name: 'Contact Form',
    description: 'Complete contact form with validation',
    category: 'forms',
    icon: Mail,
    preview: () => (
      <div className="w-full space-y-2">
        <div className="h-6 bg-muted rounded"></div>
        <div className="h-6 bg-muted rounded"></div>
        <div className="h-8 bg-primary rounded flex items-center justify-center"><span className="text-xs text-primary-foreground">Send Message</span></div>
      </div>
    ),
    defaultProps: { fields: ['name', 'email', 'message'], submitText: 'Send Message' },
    variants: ['basic', 'detailed', 'newsletter', 'appointment'],
    tags: ['form', 'contact', 'validation', 'submission'],
    complexity: 'advanced',
    popularity: 88,
    usage: 'high'
  },

  // E-commerce Components
  {
    id: 'product-card',
    name: 'Product Card',
    description: 'Product display with image, title, price, and actions',
    category: 'commerce',
    icon: Package,
    preview: () => (
      <div className="w-full h-32 bg-muted rounded p-3 space-y-2">
        <div className="h-12 bg-muted-foreground/20 rounded"></div>
        <div className="h-3 bg-muted-foreground/20 rounded w-3/4"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-muted-foreground/20 rounded w-1/4"></div>
          <div className="h-6 bg-primary rounded w-16"></div>
        </div>
      </div>
    ),
    defaultProps: { image: '', title: '', price: 0, currency: 'PKR', inStock: true },
    variants: ['basic', 'detailed', 'compact', 'featured'],
    tags: ['product', 'card', 'ecommerce', 'commerce'],
    complexity: 'intermediate',
    popularity: 85,
    usage: 'high'
  },
  {
    id: 'shopping-cart',
    name: 'Shopping Cart',
    description: 'Cart summary with items, totals, and checkout',
    category: 'commerce',
    icon: ShoppingCart,
    preview: () => (
      <div className="w-full h-24 bg-muted rounded p-3 space-y-2">
        <div className="flex justify-between">
          <span className="text-xs">2 items</span>
          <ShoppingCart className="h-4 w-4" />
        </div>
        <div className="h-3 bg-muted-foreground/20 rounded"></div>
        <div className="h-6 bg-primary rounded flex items-center justify-center"><span className="text-xs text-primary-foreground">Checkout</span></div>
      </div>
    ),
    defaultProps: { items: [], showTotals: true, showCheckout: true },
    variants: ['sidebar', 'modal', 'page', 'mini'],
    tags: ['cart', 'shopping', 'checkout', 'ecommerce'],
    complexity: 'advanced',
    popularity: 80,
    usage: 'high'
  },
  {
    id: 'pricing-table',
    name: 'Pricing Table',
    description: 'Comparison table for pricing plans',
    category: 'commerce',
    icon: CreditCard,
    preview: () => (
      <div className="w-full h-32 bg-muted rounded p-3">
        <div className="text-center space-y-2">
          <div className="h-4 bg-muted-foreground/20 rounded w-1/2 mx-auto"></div>
          <div className="h-6 bg-primary rounded w-16 mx-auto"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-3/4 mx-auto"></div>
          <div className="h-6 bg-primary rounded flex items-center justify-center"><span className="text-xs text-primary-foreground">Select</span></div>
        </div>
      </div>
    ),
    defaultProps: { plans: [], highlighted: null, currency: 'PKR' },
    variants: ['3-column', '4-column', 'comparison', 'simple'],
    tags: ['pricing', 'plans', 'comparison', 'commerce'],
    complexity: 'advanced',
    popularity: 75,
    usage: 'high'
  },
  {
    id: 'product-gallery',
    name: 'Product Gallery',
    description: 'Product image gallery with zoom and thumbnails',
    category: 'commerce',
    icon: Image,
    preview: () => (
      <div className="w-full h-24 bg-muted rounded p-3 flex space-x-2">
        <div className="flex-1 bg-muted-foreground/20 rounded"></div>
        <div className="w-8 space-y-1">
          <div className="h-6 bg-muted-foreground/30 rounded"></div>
          <div className="h-6 bg-muted-foreground/30 rounded"></div>
          <div className="h-6 bg-muted-foreground/30 rounded"></div>
        </div>
      </div>
    ),
    defaultProps: { images: [], showThumbnails: true, zoom: true },
    variants: ['basic', 'lightbox', 'carousel', 'grid'],
    tags: ['gallery', 'product', 'images', 'zoom'],
    complexity: 'intermediate',
    popularity: 70,
    usage: 'medium'
  },
  {
    id: 'review-system',
    name: 'Review System',
    description: 'Star ratings and customer reviews',
    category: 'commerce',
    icon: Star,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="flex space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <div className="h-3 bg-muted-foreground/20 rounded w-full"></div>
        <div className="h-2 bg-muted-foreground/20 rounded w-3/4"></div>
      </div>
    ),
    defaultProps: { rating: 4.5, totalReviews: 0, showForm: false },
    variants: ['stars-only', 'detailed', 'summary', 'interactive'],
    tags: ['reviews', 'ratings', 'stars', 'feedback'],
    complexity: 'intermediate',
    popularity: 78,
    usage: 'medium'
  },

  // Marketing Components
  {
    id: 'hero-section',
    name: 'Hero Section',
    description: 'Large banner with headline, subtext, and CTA',
    category: 'marketing',
    icon: Zap,
    preview: () => (
      <div className="w-full h-20 bg-gradient-to-r from-primary/20 to-secondary/20 rounded flex items-center justify-center">
        <div className="text-center space-y-1">
          <div className="h-4 bg-muted-foreground/20 rounded w-24"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-32"></div>
          <div className="h-6 bg-primary rounded w-20"></div>
        </div>
      </div>
    ),
    defaultProps: { headline: 'Welcome!', subtext: 'Your hero text here', ctaText: 'Get Started' },
    variants: ['centered', 'left-aligned', 'with-image', 'video-background'],
    tags: ['hero', 'banner', 'cta', 'landing'],
    complexity: 'intermediate',
    popularity: 95,
    usage: 'high'
  },
  {
    id: 'testimonial',
    name: 'Testimonial',
    description: 'Customer testimonial with photo and quote',
    category: 'marketing',
    icon: MessageSquare,
    preview: () => (
      <div className="w-full h-20 bg-muted rounded p-3 flex space-x-3">
        <div className="w-8 h-8 bg-muted-foreground/20 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-muted-foreground/20 rounded w-full"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-3/4"></div>
          <div className="h-2 bg-muted-foreground/20 rounded w-1/2"></div>
        </div>
      </div>
    ),
    defaultProps: { quote: '', author: '', role: '', avatar: '' },
    variants: ['card', 'inline', 'slider', 'grid'],
    tags: ['testimonial', 'review', 'social-proof', 'trust'],
    complexity: 'basic',
    popularity: 88,
    usage: 'high'
  },
  {
    id: 'cta-banner',
    name: 'Call-to-Action',
    description: 'Prominent call-to-action banner',
    category: 'marketing',
    icon: ArrowRight,
    preview: () => (
      <div className="w-full h-12 bg-primary rounded flex items-center justify-between p-3">
        <span className="text-xs text-primary-foreground font-medium">Call to Action</span>
        <ArrowRight className="h-4 w-4 text-primary-foreground" />
      </div>
    ),
    defaultProps: { text: 'Get Started Today', buttonText: 'Click Here', link: '#' },
    variants: ['banner', 'card', 'inline', 'floating'],
    tags: ['cta', 'action', 'conversion', 'button'],
    complexity: 'basic',
    popularity: 92,
    usage: 'high'
  },
  {
    id: 'feature-list',
    name: 'Feature List',
    description: 'List of features or benefits with icons',
    category: 'marketing',
    icon: CheckCircle,
    preview: () => (
      <div className="w-full space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-xs">Feature {i + 1}</span>
          </div>
        ))}
      </div>
    ),
    defaultProps: { features: [], showIcons: true, layout: 'vertical' },
    variants: ['icons', 'numbers', 'bullets', 'cards'],
    tags: ['features', 'benefits', 'list', 'icons'],
    complexity: 'basic',
    popularity: 85,
    usage: 'high'
  },
  {
    id: 'newsletter-signup',
    name: 'Newsletter Signup',
    description: 'Email subscription form with compelling copy',
    category: 'marketing',
    icon: Mail,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="h-3 bg-muted-foreground/20 rounded w-3/4"></div>
        <div className="flex space-x-2">
          <div className="flex-1 h-6 bg-muted rounded"></div>
          <div className="h-6 bg-primary rounded w-16"></div>
        </div>
      </div>
    ),
    defaultProps: { headline: 'Stay Updated', placeholder: 'Enter your email', buttonText: 'Subscribe' },
    variants: ['inline', 'card', 'modal', 'footer'],
    tags: ['newsletter', 'email', 'subscription', 'marketing'],
    complexity: 'intermediate',
    popularity: 80,
    usage: 'medium'
  },

  // Data & Charts
  {
    id: 'bar-chart',
    name: 'Bar Chart',
    description: 'Bar chart for comparing data values',
    category: 'data',
    icon: BarChart3,
    preview: () => (
      <div className="w-full h-20 bg-muted rounded p-3 flex items-end justify-between space-x-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-primary rounded-t flex-1"
            style={{ height: `${20 + Math.random() * 60}%` }}
          />
        ))}
      </div>
    ),
    defaultProps: { data: [], colors: ['#3b82f6'], showLabels: true },
    variants: ['vertical', 'horizontal', 'stacked', 'grouped'],
    tags: ['chart', 'bar', 'data', 'visualization'],
    complexity: 'intermediate',
    popularity: 75,
    usage: 'medium'
  },
  {
    id: 'line-chart',
    name: 'Line Chart',
    description: 'Line chart for showing trends over time',
    category: 'data',
    icon: TrendingUp,
    preview: () => (
      <div className="w-full h-20 bg-muted rounded p-3 relative">
        <svg className="w-full h-full" viewBox="0 0 100 40">
          <path
            d="M0,30 Q25,10 50,20 T100,15"
            stroke="#3b82f6"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>
    ),
    defaultProps: { data: [], colors: ['#3b82f6'], showPoints: true },
    variants: ['single', 'multiple', 'area', 'smooth'],
    tags: ['chart', 'line', 'trend', 'time-series'],
    complexity: 'intermediate',
    popularity: 78,
    usage: 'medium'
  },
  {
    id: 'pie-chart',
    name: 'Pie Chart',
    description: 'Pie chart for showing proportions',
    category: 'data',
    icon: PieChart,
    preview: () => (
      <div className="w-full h-20 bg-muted rounded p-3 flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-primary"></div>
          <div className="absolute inset-0 rounded-full border-4 border-secondary border-l-transparent border-b-transparent transform rotate-90"></div>
        </div>
      </div>
    ),
    defaultProps: { data: [], colors: ['#3b82f6', '#10b981'], showLabels: true },
    variants: ['basic', 'donut', 'legend', 'interactive'],
    tags: ['chart', 'pie', 'proportion', 'percentage'],
    complexity: 'intermediate',
    popularity: 72,
    usage: 'medium'
  },
  {
    id: 'stats-counter',
    name: 'Statistics Counter',
    description: 'Animated counter for key metrics',
    category: 'data',
    icon: TrendingUp,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 text-center space-y-2">
        <div className="text-lg font-bold">1,234</div>
        <div className="text-xs text-muted-foreground">Metric Name</div>
      </div>
    ),
    defaultProps: { value: 0, label: 'Metric', duration: 2000, prefix: '', suffix: '' },
    variants: ['basic', 'card', 'animated', 'comparison'],
    tags: ['stats', 'counter', 'metrics', 'animation'],
    complexity: 'basic',
    popularity: 82,
    usage: 'medium'
  },
  {
    id: 'data-table',
    name: 'Data Table',
    description: 'Sortable table for displaying tabular data',
    category: 'data',
    icon: Table,
    preview: () => (
      <div className="w-full bg-muted rounded overflow-hidden">
        <div className="h-6 bg-muted-foreground/20 border-b"></div>
        <div className="h-4 bg-muted border-b"></div>
        <div className="h-4 bg-muted border-b"></div>
        <div className="h-4 bg-muted"></div>
      </div>
    ),
    defaultProps: { data: [], columns: [], sortable: true, pagination: false },
    variants: ['basic', 'striped', 'bordered', 'compact'],
    tags: ['table', 'data', 'sortable', 'pagination'],
    complexity: 'advanced',
    popularity: 70,
    usage: 'medium'
  },

  // Navigation Components
  {
    id: 'navigation-bar',
    name: 'Navigation Bar',
    description: 'Site navigation with logo and menu items',
    category: 'navigation',
    icon: Menu,
    preview: () => (
      <div className="w-full h-10 bg-muted rounded flex items-center justify-between px-3">
        <div className="w-8 h-4 bg-muted-foreground/20 rounded"></div>
        <div className="flex space-x-2">
          <div className="w-12 h-4 bg-muted-foreground/20 rounded"></div>
          <div className="w-12 h-4 bg-muted-foreground/20 rounded"></div>
          <div className="w-12 h-4 bg-muted-foreground/20 rounded"></div>
        </div>
        <div className="w-6 h-4 bg-muted-foreground/20 rounded"></div>
      </div>
    ),
    defaultProps: { logo: '', menuItems: [], sticky: false, transparent: false },
    variants: ['horizontal', 'vertical', 'mega-menu', 'minimal'],
    tags: ['navigation', 'menu', 'header', 'nav'],
    complexity: 'intermediate',
    popularity: 100,
    usage: 'high'
  },
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    description: 'Navigation path indicator',
    category: 'navigation',
    icon: ChevronRight,
    preview: () => (
      <div className="w-full h-6 bg-muted rounded flex items-center px-3 space-x-2">
        <span className="text-xs">Home</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-xs">Section</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-xs font-medium">Current</span>
      </div>
    ),
    defaultProps: { items: [], separator: '>', homeText: 'Home' },
    variants: ['basic', 'styled', 'minimal'],
    tags: ['breadcrumb', 'navigation', 'path', 'hierarchy'],
    complexity: 'basic',
    popularity: 85,
    usage: 'medium'
  },
  {
    id: 'footer',
    name: 'Footer',
    description: 'Site footer with links and information',
    category: 'navigation',
    icon: Square,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="flex justify-between">
          <div className="w-16 h-4 bg-muted-foreground/20 rounded"></div>
          <div className="flex space-x-4">
            <div className="w-8 h-4 bg-muted-foreground/20 rounded"></div>
            <div className="w-8 h-4 bg-muted-foreground/20 rounded"></div>
            <div className="w-8 h-4 bg-muted-foreground/20 rounded"></div>
          </div>
        </div>
        <div className="h-3 bg-muted-foreground/20 rounded w-full"></div>
      </div>
    ),
    defaultProps: { links: [], copyright: '', socialLinks: [] },
    variants: ['simple', 'detailed', 'multi-column', 'minimal'],
    tags: ['footer', 'links', 'copyright', 'social'],
    complexity: 'intermediate',
    popularity: 95,
    usage: 'high'
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    description: 'Collapsible sidebar navigation',
    category: 'navigation',
    icon: Menu,
    preview: () => (
      <div className="w-20 h-32 bg-muted rounded p-2 space-y-2">
        <div className="w-full h-6 bg-muted-foreground/20 rounded"></div>
        <div className="w-full h-6 bg-muted-foreground/20 rounded"></div>
        <div className="w-full h-6 bg-muted-foreground/20 rounded"></div>
        <div className="w-full h-6 bg-muted-foreground/20 rounded"></div>
      </div>
    ),
    defaultProps: { items: [], collapsible: true, position: 'left' },
    variants: ['left', 'right', 'floating', 'fixed'],
    tags: ['sidebar', 'navigation', 'menu', 'collapsible'],
    complexity: 'intermediate',
    popularity: 78,
    usage: 'medium'
  },
  {
    id: 'pagination',
    name: 'Pagination',
    description: 'Page navigation for content lists',
    category: 'navigation',
    icon: ChevronRight,
    preview: () => (
      <div className="w-full h-8 bg-muted rounded flex items-center justify-center space-x-2">
        <ChevronLeft className="h-4 w-4" />
        <div className="flex space-x-1">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center"><span className="text-xs text-primary-foreground">1</span></div>
          <div className="w-6 h-6 bg-muted rounded flex items-center justify-center"><span className="text-xs">2</span></div>
          <div className="w-6 h-6 bg-muted rounded flex items-center justify-center"><span className="text-xs">3</span></div>
        </div>
        <ChevronRight className="h-4 w-4" />
      </div>
    ),
    defaultProps: { currentPage: 1, totalPages: 10, showNumbers: true },
    variants: ['numbers', 'arrows-only', 'compact', 'detailed'],
    tags: ['pagination', 'navigation', 'pages', 'numbers'],
    complexity: 'intermediate',
    popularity: 80,
    usage: 'medium'
  },

  // Feedback Components
  {
    id: 'alert',
    name: 'Alert',
    description: 'Notification message with different severity levels',
    category: 'feedback',
    icon: AlertCircle,
    preview: () => (
      <div className="w-full h-10 bg-yellow-50 border border-yellow-200 rounded flex items-center p-2">
        <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
        <span className="text-xs text-yellow-800">Alert message</span>
      </div>
    ),
    defaultProps: { type: 'info', message: 'Alert message', dismissible: false },
    variants: ['info', 'success', 'warning', 'error'],
    tags: ['alert', 'notification', 'message', 'feedback'],
    complexity: 'basic',
    popularity: 90,
    usage: 'high'
  },
  {
    id: 'toast',
    name: 'Toast Notification',
    description: 'Temporary notification that appears and disappears',
    category: 'feedback',
    icon: MessageSquare,
    preview: () => (
      <div className="w-64 h-12 bg-background border rounded shadow-lg p-3">
        <div className="flex items-start space-x-2">
          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
          <div>
            <div className="text-xs font-medium">Success!</div>
            <div className="text-xs text-muted-foreground">Action completed</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: { type: 'info', title: 'Notification', message: '', duration: 5000 },
    variants: ['success', 'error', 'warning', 'info'],
    tags: ['toast', 'notification', 'temporary', 'feedback'],
    complexity: 'intermediate',
    popularity: 85,
    usage: 'medium'
  },
  {
    id: 'progress-bar',
    name: 'Progress Bar',
    description: 'Visual progress indicator',
    category: 'feedback',
    icon: TrendingUp,
    preview: () => (
      <div className="w-full space-y-2">
        <div className="w-full h-2 bg-muted rounded overflow-hidden">
          <div className="h-full bg-primary rounded" style={{ width: '60%' }}></div>
        </div>
        <div className="text-xs text-center text-muted-foreground">60% complete</div>
      </div>
    ),
    defaultProps: { value: 0, max: 100, showLabel: false, color: 'primary' },
    variants: ['linear', 'circular', 'stepped', 'animated'],
    tags: ['progress', 'bar', 'indicator', 'loading'],
    complexity: 'basic',
    popularity: 88,
    usage: 'medium'
  },
  {
    id: 'loading-spinner',
    name: 'Loading Spinner',
    description: 'Animated loading indicator',
    category: 'feedback',
    icon: RotateCcw,
    preview: () => (
      <div className="w-full h-12 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    ),
    defaultProps: { size: 'medium', color: 'primary' },
    variants: ['spinner', 'dots', 'pulse', 'bars'],
    tags: ['loading', 'spinner', 'animation', 'wait'],
    complexity: 'basic',
    popularity: 95,
    usage: 'high'
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    description: 'Information tooltip on hover',
    category: 'feedback',
    icon: Info,
    preview: () => (
      <div className="w-full h-8 bg-muted rounded flex items-center justify-center">
        <Info className="h-4 w-4 mr-2" />
        <span className="text-xs">Hover for tooltip</span>
      </div>
    ),
    defaultProps: { content: 'Tooltip content', position: 'top' },
    variants: ['top', 'bottom', 'left', 'right', 'auto'],
    tags: ['tooltip', 'information', 'hover', 'help'],
    complexity: 'basic',
    popularity: 82,
    usage: 'medium'
  },

  // Advanced Components - Calendar & Date/Time
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Interactive calendar for date selection and event display',
    category: 'advanced',
    icon: Calendar,
    preview: () => (
      <div className="w-full h-32 bg-muted rounded p-3">
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="text-xs font-medium">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className={`text-xs p-1 rounded ${i === 15 ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>
              {((i % 31) + 1).toString()}
            </div>
          ))}
        </div>
      </div>
    ),
    defaultProps: { selectedDate: null, events: [], showEvents: true },
    variants: ['date-picker', 'event-calendar', 'month-view', 'week-view'],
    tags: ['calendar', 'date', 'events', 'picker'],
    complexity: 'advanced',
    popularity: 75,
    usage: 'medium'
  },
  {
    id: 'date-picker',
    name: 'Date Picker',
    description: 'Date selection input with calendar popup',
    category: 'forms',
    icon: Calendar,
    preview: () => (
      <div className="w-full h-8 bg-muted rounded border flex items-center justify-between px-3">
        <span className="text-xs">Select date</span>
        <Calendar className="h-4 w-4" />
      </div>
    ),
    defaultProps: { placeholder: 'Select date', format: 'MM/DD/YYYY' },
    variants: ['single', 'range', 'time', 'datetime'],
    tags: ['date', 'picker', 'calendar', 'input'],
    complexity: 'intermediate',
    popularity: 78,
    usage: 'medium'
  },
  {
    id: 'time-picker',
    name: 'Time Picker',
    description: 'Time selection input with clock interface',
    category: 'forms',
    icon: Clock,
    preview: () => (
      <div className="w-full h-8 bg-muted rounded border flex items-center justify-between px-3">
        <span className="text-xs">Select time</span>
        <Clock className="h-4 w-4" />
      </div>
    ),
    defaultProps: { placeholder: 'Select time', format: '12h', step: 15 },
    variants: ['12h', '24h', 'with-seconds', 'range'],
    tags: ['time', 'picker', 'clock', 'input'],
    complexity: 'intermediate',
    popularity: 70,
    usage: 'medium'
  },
  {
    id: 'countdown-timer',
    name: 'Countdown Timer',
    description: 'Animated countdown timer for events and deadlines',
    category: 'advanced',
    icon: Clock,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-bold">24:00:00</div>
          <div className="text-xs text-muted-foreground">Days Hours Minutes</div>
        </div>
      </div>
    ),
    defaultProps: { targetDate: '', showLabels: true, style: 'digital' },
    variants: ['digital', 'circular', 'cards', 'minimal'],
    tags: ['countdown', 'timer', 'event', 'deadline'],
    complexity: 'advanced',
    popularity: 65,
    usage: 'medium'
  },

  // Maps & Location Components
  {
    id: 'map',
    name: 'Interactive Map',
    description: 'Google Maps integration with markers and controls',
    category: 'advanced',
    icon: MapPin,
    preview: () => (
      <div className="w-full h-32 bg-muted rounded flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <div className="text-xs">Interactive Map</div>
        </div>
      </div>
    ),
    defaultProps: { center: [0, 0], zoom: 10, markers: [], style: 'standard' },
    variants: ['standard', 'satellite', 'terrain', 'street-view'],
    tags: ['map', 'location', 'google-maps', 'markers'],
    complexity: 'advanced',
    popularity: 70,
    usage: 'medium'
  },
  {
    id: 'location-picker',
    name: 'Location Picker',
    description: 'Address search and location selection',
    category: 'forms',
    icon: MapPin,
    preview: () => (
      <div className="w-full space-y-2">
        <div className="h-8 bg-muted rounded border flex items-center px-3">
          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-xs">Search for location...</span>
        </div>
        <div className="h-20 bg-muted rounded border"></div>
      </div>
    ),
    defaultProps: { placeholder: 'Search for location...', showMap: true },
    variants: ['search-only', 'with-map', 'autocomplete', 'geocoding'],
    tags: ['location', 'address', 'search', 'geocoding'],
    complexity: 'advanced',
    popularity: 68,
    usage: 'medium'
  },

  // Animation & Effects Components
  {
    id: 'animation-wrapper',
    name: 'Animation Wrapper',
    description: 'Wrapper component for adding animations to content',
    category: 'advanced',
    icon: Zap,
    preview: () => (
      <div className="w-full h-16 bg-gradient-to-r from-primary/20 to-secondary/20 rounded flex items-center justify-center">
        <Zap className="h-6 w-6 text-primary mr-2" />
        <span className="text-sm font-medium">Animated Content</span>
      </div>
    ),
    defaultProps: { animation: 'fade-in', duration: 1000, delay: 0 },
    variants: ['fade', 'slide', 'bounce', 'scale', 'rotate'],
    tags: ['animation', 'effects', 'motion', 'transition'],
    complexity: 'intermediate',
    popularity: 72,
    usage: 'medium'
  },
  {
    id: 'parallax-section',
    name: 'Parallax Section',
    description: 'Background image with parallax scrolling effect',
    category: 'layout',
    icon: Image,
    preview: () => (
      <div className="w-full h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <span className="text-white text-sm">Parallax Effect</span>
        </div>
      </div>
    ),
    defaultProps: { backgroundImage: '', speed: 0.5, height: '400px' },
    variants: ['slow', 'medium', 'fast', 'reverse'],
    tags: ['parallax', 'scrolling', 'background', 'effect'],
    complexity: 'advanced',
    popularity: 65,
    usage: 'medium'
  },

  // Social Media Components
  {
    id: 'social-share',
    name: 'Social Share Buttons',
    description: 'Social media sharing buttons with customizable platforms',
    category: 'marketing',
    icon: Share,
    preview: () => (
      <div className="w-full h-8 bg-muted rounded flex items-center justify-center space-x-2">
        <div className="w-6 h-6 bg-blue-500 rounded"></div>
        <div className="w-6 h-6 bg-blue-600 rounded"></div>
        <div className="w-6 h-6 bg-red-500 rounded"></div>
        <div className="w-6 h-6 bg-pink-500 rounded"></div>
      </div>
    ),
    defaultProps: { platforms: ['facebook', 'twitter', 'linkedin'], size: 'medium' },
    variants: ['horizontal', 'vertical', 'circle', 'square'],
    tags: ['social', 'share', 'buttons', 'platforms'],
    complexity: 'basic',
    popularity: 85,
    usage: 'high'
  },
  {
    id: 'social-feed',
    name: 'Social Media Feed',
    description: 'Display social media posts from various platforms',
    category: 'marketing',
    icon: Users,
    preview: () => (
      <div className="w-full space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 bg-muted rounded border p-2 flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <div className="h-2 bg-muted-foreground/20 rounded w-3/4 mb-1"></div>
              <div className="h-2 bg-muted-foreground/20 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    ),
    defaultProps: { platforms: ['instagram', 'twitter'], maxPosts: 10 },
    variants: ['grid', 'carousel', 'list', 'masonry'],
    tags: ['social', 'feed', 'posts', 'embed'],
    complexity: 'advanced',
    popularity: 75,
    usage: 'medium'
  },

  // Advanced Form Components
  {
    id: 'multi-step-form',
    name: 'Multi-Step Form',
    description: 'Form wizard with progress indicator and step validation',
    category: 'forms',
    icon: FileText,
    preview: () => (
      <div className="w-full h-24 bg-muted rounded p-3 space-y-2">
        <div className="flex justify-between">
          {[1, 2, 3].map(step => (
            <div key={step} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
              step === 1 ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground'
            }`}>
              {step}
            </div>
          ))}
        </div>
        <div className="h-8 bg-muted-foreground/20 rounded"></div>
        <div className="flex justify-between text-xs">
          <span>Previous</span>
          <span>Next</span>
        </div>
      </div>
    ),
    defaultProps: { steps: [], showProgress: true, validateSteps: true },
    variants: ['horizontal', 'vertical', 'numbered', 'icons'],
    tags: ['form', 'wizard', 'steps', 'progress'],
    complexity: 'advanced',
    popularity: 78,
    usage: 'medium'
  },
  {
    id: 'file-upload',
    name: 'File Upload',
    description: 'Drag-and-drop file upload with preview and validation',
    category: 'forms',
    icon: Upload,
    preview: () => (
      <div className="w-full h-20 bg-muted rounded border-2 border-dashed border-muted-foreground/50 flex flex-col items-center justify-center">
        <Upload className="h-6 w-6 text-muted-foreground mb-1" />
        <span className="text-xs text-muted-foreground">Drop files here</span>
      </div>
    ),
    defaultProps: { accept: '*', multiple: false, maxSize: 10, showPreview: true },
    variants: ['drag-drop', 'button-only', 'image-only', 'document'],
    tags: ['upload', 'file', 'drag-drop', 'validation'],
    complexity: 'intermediate',
    popularity: 82,
    usage: 'medium'
  },
  {
    id: 'autocomplete',
    name: 'Autocomplete Input',
    description: 'Input field with autocomplete suggestions',
    category: 'forms',
    icon: Search,
    preview: () => (
      <div className="w-full space-y-1">
        <div className="h-8 bg-muted rounded border flex items-center px-3">
          <Search className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-xs">Search...</span>
        </div>
        <div className="bg-muted border rounded p-2 space-y-1">
          <div className="h-4 bg-muted-foreground/20 rounded"></div>
          <div className="h-4 bg-muted-foreground/20 rounded"></div>
        </div>
      </div>
    ),
    defaultProps: { suggestions: [], minChars: 2, maxSuggestions: 5 },
    variants: ['local', 'remote', 'tags', 'multi-select'],
    tags: ['autocomplete', 'search', 'suggestions', 'input'],
    complexity: 'intermediate',
    popularity: 80,
    usage: 'medium'
  },

  // Advanced Interactive Components
  {
    id: 'lightbox',
    name: 'Lightbox Gallery',
    description: 'Modal image gallery with navigation and zoom',
    category: 'media',
    icon: Maximize2,
    preview: () => (
      <div className="w-full h-20 bg-muted rounded p-2">
        <div className="grid grid-cols-4 gap-1 h-full">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-muted-foreground/20 rounded"></div>
          ))}
        </div>
      </div>
    ),
    defaultProps: { images: [], showThumbnails: true, enableZoom: true },
    variants: ['single', 'gallery', 'video', 'mixed'],
    tags: ['lightbox', 'gallery', 'modal', 'zoom'],
    complexity: 'intermediate',
    popularity: 75,
    usage: 'medium'
  },
  {
    id: 'masonry-grid',
    name: 'Masonry Grid',
    description: 'Pinterest-style grid layout for images and content',
    category: 'layout',
    icon: Grid,
    preview: () => (
      <div className="w-full h-24 bg-muted rounded p-2">
        <div className="flex space-x-1 h-full">
          <div className="w-1/5 space-y-1">
            <div className="bg-muted-foreground/20 rounded h-3/4"></div>
            <div className="bg-muted-foreground/20 rounded h-1/4"></div>
          </div>
          <div className="w-1/5 space-y-1">
            <div className="bg-muted-foreground/20 rounded h-1/2"></div>
            <div className="bg-muted-foreground/20 rounded h-1/4"></div>
            <div className="bg-muted-foreground/20 rounded h-1/4"></div>
          </div>
          <div className="w-1/5 space-y-1">
            <div className="bg-muted-foreground/20 rounded h-2/3"></div>
            <div className="bg-muted-foreground/20 rounded h-1/3"></div>
          </div>
          <div className="w-1/5 space-y-1">
            <div className="bg-muted-foreground/20 rounded h-1/3"></div>
            <div className="bg-muted-foreground/20 rounded h-2/3"></div>
          </div>
          <div className="w-1/5 space-y-1">
            <div className="bg-muted-foreground/20 rounded h-3/4"></div>
            <div className="bg-muted-foreground/20 rounded h-1/4"></div>
          </div>
        </div>
      </div>
    ),
    defaultProps: { columns: 3, gap: '1rem', responsive: true },
    variants: ['fixed-columns', 'responsive', 'with-gutters', 'no-gutters'],
    tags: ['masonry', 'grid', 'pinterest', 'layout'],
    complexity: 'intermediate',
    popularity: 70,
    usage: 'medium'
  },
  {
    id: 'sticky-navigation',
    name: 'Sticky Navigation',
    description: 'Navigation bar that sticks to the top when scrolling',
    category: 'navigation',
    icon: Menu,
    preview: () => (
      <div className="w-full h-10 bg-muted rounded border-b-2 border-primary flex items-center px-3">
        <span className="text-xs font-medium mr-4">Logo</span>
        <div className="flex space-x-4">
          <span className="text-xs">Home</span>
          <span className="text-xs">About</span>
          <span className="text-xs">Contact</span>
        </div>
      </div>
    ),
    defaultProps: { background: 'white', shadow: true, transparent: false },
    variants: ['solid', 'transparent', 'blur', 'gradient'],
    tags: ['sticky', 'navigation', 'header', 'scroll'],
    complexity: 'intermediate',
    popularity: 85,
    usage: 'high'
  },
  {
    id: 'mega-menu',
    name: 'Mega Menu',
    description: 'Large dropdown menu with multiple columns and content',
    category: 'navigation',
    icon: Menu,
    preview: () => (
      <div className="w-full space-y-1">
        <div className="h-8 bg-muted rounded flex items-center justify-between px-3">
          <span className="text-xs">Products</span>
          <ChevronDown className="h-3 w-3" />
        </div>
        <div className="h-24 bg-muted rounded border p-2">
          <div className="grid grid-cols-3 gap-2 h-full">
            <div className="space-y-1">
              <div className="h-2 bg-muted-foreground/20 rounded"></div>
              <div className="h-2 bg-muted-foreground/20 rounded w-3/4"></div>
            </div>
            <div className="space-y-1">
              <div className="h-2 bg-muted-foreground/20 rounded"></div>
              <div className="h-2 bg-muted-foreground/20 rounded w-2/3"></div>
            </div>
            <div className="space-y-1">
              <div className="h-2 bg-muted-foreground/20 rounded"></div>
              <div className="h-2 bg-muted-foreground/20 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    ),
    defaultProps: { trigger: 'hover', columns: 3, showImages: false },
    variants: ['hover', 'click', 'with-images', 'compact'],
    tags: ['mega-menu', 'dropdown', 'navigation', 'columns'],
    complexity: 'advanced',
    popularity: 65,
    usage: 'medium'
  },

  // Content & Blog Components
  {
    id: 'blog-post',
    name: 'Blog Post Card',
    description: 'Blog post preview with image, title, excerpt, and metadata',
    category: 'content',
    icon: FileText,
    preview: () => (
      <div className="w-full h-40 bg-muted rounded border p-3 space-y-2">
        <div className="h-16 bg-muted-foreground/20 rounded"></div>
        <div className="h-3 bg-muted-foreground/20 rounded w-3/4"></div>
        <div className="h-2 bg-muted-foreground/20 rounded w-1/2"></div>
        <div className="flex justify-between text-xs">
          <span>Author</span>
          <span>Dec 1, 2023</span>
        </div>
      </div>
    ),
    defaultProps: { showImage: true, showExcerpt: true, showAuthor: true },
    variants: ['card', 'list', 'minimal', 'featured'],
    tags: ['blog', 'post', 'article', 'content'],
    complexity: 'intermediate',
    popularity: 80,
    usage: 'high'
  },
  {
    id: 'content-slider',
    name: 'Content Slider',
    description: 'Content carousel for testimonials, features, or portfolio',
    category: 'interactive',
    icon: ArrowRight,
    preview: () => (
      <div className="w-full h-24 bg-muted rounded flex items-center justify-center relative">
        <div className="text-center">
          <div className="h-4 bg-muted-foreground/20 rounded w-16 mx-auto mb-2"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-24 mx-auto"></div>
        </div>
        <ArrowLeft className="absolute left-2 h-4 w-4" />
        <ArrowRight className="absolute right-2 h-4 w-4" />
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <div className="w-2 h-2 bg-muted-foreground/30 rounded-full"></div>
          <div className="w-2 h-2 bg-muted-foreground/30 rounded-full"></div>
        </div>
      </div>
    ),
    defaultProps: { items: [], showDots: true, showArrows: true, autoplay: false },
    variants: ['testimonials', 'features', 'portfolio', 'news'],
    tags: ['slider', 'carousel', 'content', 'testimonials'],
    complexity: 'intermediate',
    popularity: 78,
    usage: 'medium'
  },
  {
    id: 'faq-section',
    name: 'FAQ Section',
    description: 'Frequently asked questions with expandable answers',
    category: 'content',
    icon: HelpCircle,
    preview: () => (
      <div className="w-full space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Question {i + 1}?</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            {i === 0 && <div className="text-xs text-muted-foreground">Answer text...</div>}
          </div>
        ))}
      </div>
    ),
    defaultProps: { questions: [], defaultOpen: [], searchable: false },
    variants: ['accordion', 'grid', 'searchable', 'categorized'],
    tags: ['faq', 'questions', 'help', 'support'],
    complexity: 'intermediate',
    popularity: 75,
    usage: 'medium'
  },

  // Advanced Media Components
  {
    id: 'audio-player',
    name: 'Audio Player',
    description: 'HTML5 audio player with playlist support',
    category: 'media',
    icon: Music,
    preview: () => (
      <div className="w-full h-12 bg-muted rounded flex items-center justify-between px-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary rounded"></div>
          <span className="text-xs">Song Title</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-16 h-2 bg-muted-foreground/20 rounded"></div>
          <div className="w-4 h-4 bg-muted-foreground/30 rounded"></div>
        </div>
      </div>
    ),
    defaultProps: { src: '', playlist: [], showPlaylist: false },
    variants: ['minimal', 'full', 'playlist', 'visualizer'],
    tags: ['audio', 'player', 'music', 'playlist'],
    complexity: 'intermediate',
    popularity: 65,
    usage: 'medium'
  },
  {
    id: 'video-background',
    name: 'Video Background',
    description: 'Full-screen video background with overlay content',
    category: 'media',
    icon: Video,
    preview: () => (
      <div className="w-full h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <Video className="h-6 w-6 text-white mr-2" />
          <span className="text-white text-sm">Video Background</span>
        </div>
      </div>
    ),
    defaultProps: { src: '', overlay: true, autoplay: true, muted: true },
    variants: ['fullscreen', 'hero', 'section', 'modal'],
    tags: ['video', 'background', 'fullscreen', 'overlay'],
    complexity: 'advanced',
    popularity: 70,
    usage: 'medium'
  },

  // Utility Components
  {
    id: 'code-snippet',
    name: 'Code Snippet',
    description: 'Syntax-highlighted code block with copy functionality',
    category: 'utility',
    icon: Code,
    preview: () => (
      <div className="w-full h-16 bg-gray-900 rounded p-3 font-mono text-xs text-green-400">
        <div>function hello() {'{'}</div>
        <div className="ml-4">console.log('Hello World!');</div>
        <div>{'}'}</div>
      </div>
    ),
    defaultProps: { code: '', language: 'javascript', showLineNumbers: false },
    variants: ['light', 'dark', 'copy-button', 'line-numbers'],
    tags: ['code', 'syntax', 'highlighting', 'programming'],
    complexity: 'intermediate',
    popularity: 60,
    usage: 'medium'
  },
  {
    id: 'table-of-contents',
    name: 'Table of Contents',
    description: 'Auto-generated navigation for page headings',
    category: 'utility',
    icon: List,
    preview: () => (
      <div className="w-full h-24 bg-muted rounded p-3 space-y-1">
        <div className="text-xs font-medium mb-2">Contents</div>
        <div className="text-xs text-muted-foreground ml-2">• Introduction</div>
        <div className="text-xs text-muted-foreground ml-4">• Getting Started</div>
        <div className="text-xs text-muted-foreground ml-2">• Advanced Features</div>
        <div className="text-xs text-muted-foreground ml-4">• API Reference</div>
      </div>
    ),
    defaultProps: { maxDepth: 3, collapsible: false, smoothScroll: true },
    variants: ['numbered', 'bulleted', 'collapsible', 'sticky'],
    tags: ['toc', 'navigation', 'headings', 'scroll'],
    complexity: 'intermediate',
    popularity: 55,
    usage: 'medium'
  },
  {
    id: 'search-bar',
    name: 'Search Bar',
    description: 'Search input with autocomplete and filtering',
    category: 'interactive',
    icon: Search,
    preview: () => (
      <div className="w-full h-10 bg-muted rounded border flex items-center px-3">
        <Search className="h-4 w-4 mr-2 text-muted-foreground" />
        <span className="text-sm text-muted-foreground flex-1">Search...</span>
        <div className="w-6 h-6 bg-primary rounded"></div>
      </div>
    ),
    defaultProps: { placeholder: 'Search...', showSuggestions: true, filters: [] },
    variants: ['basic', 'advanced', 'instant', 'debounced'],
    tags: ['search', 'input', 'autocomplete', 'filtering'],
    complexity: 'intermediate',
    popularity: 85,
    usage: 'high'
  },
  {
    id: 'step-indicator',
    name: 'Step Indicator',
    description: 'Progress indicator for multi-step processes',
    category: 'feedback',
    icon: CheckCircle,
    preview: () => (
      <div className="w-full h-8 bg-muted rounded flex items-center justify-between px-4">
        {[1, 2, 3, 4].map(step => (
          <div key={step} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
            step <= 2 ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground'
          }`}>
            {step <= 2 ? '✓' : step}
          </div>
        ))}
      </div>
    ),
    defaultProps: { steps: [], currentStep: 0, showLabels: false },
    variants: ['numbered', 'icons', 'minimal', 'detailed'],
    tags: ['steps', 'progress', 'indicator', 'wizard'],
    complexity: 'basic',
    popularity: 75,
    usage: 'medium'
  },
  {
    id: 'comparison-table',
    name: 'Comparison Table',
    description: 'Feature comparison table for products or plans',
    category: 'marketing',
    icon: GitCompare,
    preview: () => (
      <div className="w-full h-24 bg-muted rounded overflow-hidden">
        <div className="grid grid-cols-4 gap-1 p-2">
          <div className="text-xs font-medium">Feature</div>
          <div className="text-xs text-center">Basic</div>
          <div className="text-xs text-center">Pro</div>
          <div className="text-xs text-center">Enterprise</div>
        </div>
        <div className="border-t">
          <div className="grid grid-cols-4 gap-1 p-2">
            <div className="text-xs">Users</div>
            <div className="text-xs text-center">1</div>
            <div className="text-xs text-center">10</div>
            <div className="text-xs text-center">Unlimited</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: { features: [], plans: [], highlight: null },
    variants: ['basic', 'featured', 'interactive', 'pricing'],
    tags: ['comparison', 'table', 'features', 'plans'],
    complexity: 'advanced',
    popularity: 70,
    usage: 'medium'
  },
  {
    id: 'weather-widget',
    name: 'Weather Widget',
    description: 'Weather information display with icons and forecast',
    category: 'utility',
    icon: Globe,
    preview: () => (
      <div className="w-full h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded p-3 flex items-center justify-between">
        <div>
          <div className="text-white text-lg font-bold">72°F</div>
          <div className="text-white text-sm">Sunny</div>
          <div className="text-white text-xs">Lahore, PK</div>
        </div>
        <div className="text-white text-4xl">☀️</div>
      </div>
    ),
    defaultProps: { location: 'auto', units: 'metric', showForecast: false },
    variants: ['current', 'forecast', 'detailed', 'minimal'],
    tags: ['weather', 'forecast', 'location', 'climate'],
    complexity: 'intermediate',
    popularity: 65,
    usage: 'medium'
  },
  {
    id: 'live-chat',
    name: 'Live Chat Widget',
    description: 'Customer support chat widget with real-time messaging',
    category: 'interactive',
    icon: MessageSquare,
    preview: () => (
      <div className="w-16 h-16 bg-primary rounded-full fixed bottom-4 right-4 flex items-center justify-center shadow-lg">
        <MessageSquare className="h-6 w-6 text-primary-foreground" />
      </div>
    ),
    defaultProps: { position: 'bottom-right', online: true, greeting: 'Hello! How can we help?' },
    variants: ['floating', 'inline', 'popup', 'sidebar'],
    tags: ['chat', 'support', 'live', 'messaging'],
    complexity: 'advanced',
    popularity: 75,
    usage: 'medium'
  },
  {
    id: 'notification-bell',
    name: 'Notification Bell',
    description: 'Notification indicator with dropdown menu',
    category: 'feedback',
    icon: Bell,
    preview: () => (
      <div className="relative">
        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
          <Bell className="h-4 w-4" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">3</span>
        </div>
      </div>
    ),
    defaultProps: { notifications: [], showBadge: true, position: 'top-right' },
    variants: ['dropdown', 'toast', 'modal', 'sidebar'],
    tags: ['notification', 'bell', 'alerts', 'messages'],
    complexity: 'intermediate',
    popularity: 80,
    usage: 'high'
  },
  {
    id: 'user-avatar',
    name: 'User Avatar',
    description: 'User profile image with fallback initials',
    category: 'content',
    icon: User,
    preview: () => (
      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
        <span className="text-primary-foreground font-medium text-sm">JD</span>
      </div>
    ),
    defaultProps: { size: 'medium', showBorder: false, fallback: 'initials' },
    variants: ['circle', 'square', 'with-border', 'with-status'],
    tags: ['avatar', 'user', 'profile', 'image'],
    complexity: 'basic',
    popularity: 90,
    usage: 'high'
  },
  {
    id: 'badge-system',
    name: 'Badge System',
    description: 'Status badges, labels, and tags with various styles',
    category: 'content',
    icon: Star,
    preview: () => (
      <div className="flex flex-wrap gap-2">
        <div className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">New</div>
        <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Popular</div>
        <div className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Sale</div>
      </div>
    ),
    defaultProps: { text: 'Badge', variant: 'default', size: 'small' },
    variants: ['pill', 'rounded', 'square', 'with-icon'],
    tags: ['badge', 'label', 'tag', 'status'],
    complexity: 'basic',
    popularity: 85,
    usage: 'high'
  },
  {
    id: 'empty-state',
    name: 'Empty State',
    description: 'Placeholder content for empty data states',
    category: 'feedback',
    icon: FileText,
    preview: () => (
      <div className="w-full h-32 bg-muted rounded flex flex-col items-center justify-center p-4">
        <FileText className="h-8 w-8 text-muted-foreground mb-2" />
        <div className="text-sm font-medium mb-1">No data yet</div>
        <div className="text-xs text-muted-foreground text-center">Get started by adding your first item</div>
      </div>
    ),
    defaultProps: { icon: 'file', title: 'No data', description: 'Add your first item to get started' },
    variants: ['search', 'error', 'success', 'custom'],
    tags: ['empty', 'placeholder', 'state', 'no-data'],
    complexity: 'basic',
    popularity: 75,
    usage: 'medium'
  },
  {
    id: 'color-picker',
    name: 'Color Picker',
    description: 'Color selection tool with palette and hex input',
    category: 'utility',
    icon: Palette,
    preview: () => (
      <div className="w-full h-8 bg-muted rounded border flex items-center justify-between px-3">
        <div className="w-4 h-4 bg-primary rounded"></div>
        <span className="text-xs">#3b82f6</span>
        <Palette className="h-4 w-4" />
      </div>
    ),
    defaultProps: { value: '#3b82f6', format: 'hex', showPalette: true },
    variants: ['palette', 'spectrum', 'wheel', 'input-only'],
    tags: ['color', 'picker', 'palette', 'hex'],
    complexity: 'intermediate',
    popularity: 70,
    usage: 'medium'
  },
  {
    id: 'font-picker',
    name: 'Font Picker',
    description: 'Typography selection with live preview',
    category: 'utility',
    icon: Type,
    preview: () => (
      <div className="w-full h-8 bg-muted rounded border flex items-center justify-between px-3">
        <span className="text-sm font-serif">Aa</span>
        <span className="text-xs">Inter</span>
        <ChevronDown className="h-4 w-4" />
      </div>
    ),
    defaultProps: { selectedFont: 'Inter', showPreview: true, googleFonts: true },
    variants: ['dropdown', 'grid', 'searchable', 'categorized'],
    tags: ['font', 'typography', 'picker', 'text'],
    complexity: 'intermediate',
    popularity: 65,
    usage: 'medium'
  },
  {
    id: 'icon-picker',
    name: 'Icon Picker',
    description: 'Icon selection from large icon library',
    category: 'utility',
    icon: Star,
    preview: () => (
      <div className="w-full h-8 bg-muted rounded border flex items-center justify-between px-3">
        <Star className="h-4 w-4" />
        <span className="text-xs">Select icon...</span>
        <ChevronDown className="h-4 w-4" />
      </div>
    ),
    defaultProps: { selectedIcon: '', iconSet: 'lucide', showSearch: true },
    variants: ['grid', 'list', 'searchable', 'categorized'],
    tags: ['icon', 'picker', 'library', 'selection'],
    complexity: 'intermediate',
    popularity: 75,
    usage: 'medium'
  },

  // Wix-Style Business Components
  {
    id: 'services-showcase',
    name: 'Services Showcase',
    description: 'Display business services with icons and descriptions',
    category: 'business',
    icon: Briefcase,
    preview: () => (
      <div className="w-full h-24 bg-muted rounded p-3 grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className="w-6 h-6 bg-primary rounded mx-auto mb-1"></div>
          <div className="text-xs">Service 1</div>
        </div>
        <div className="text-center">
          <div className="w-6 h-6 bg-primary rounded mx-auto mb-1"></div>
          <div className="text-xs">Service 2</div>
        </div>
        <div className="text-center">
          <div className="w-6 h-6 bg-primary rounded mx-auto mb-1"></div>
          <div className="text-xs">Service 3</div>
        </div>
      </div>
    ),
    defaultProps: { services: [], layout: 'grid', showIcons: true },
    variants: ['grid', 'list', 'carousel', 'timeline'],
    tags: ['services', 'business', 'showcase', 'portfolio'],
    complexity: 'intermediate',
    popularity: 85,
    usage: 'high'
  },
  {
    id: 'team-members',
    name: 'Team Members',
    description: 'Display team members with photos and roles',
    category: 'business',
    icon: Users,
    preview: () => (
      <div className="w-full h-20 bg-muted rounded p-3 flex justify-center space-x-3">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-full mx-auto mb-1"></div>
          <div className="text-xs">John Doe</div>
          <div className="text-xs text-muted-foreground">CEO</div>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-full mx-auto mb-1"></div>
          <div className="text-xs">Jane Smith</div>
          <div className="text-xs text-muted-foreground">CTO</div>
        </div>
      </div>
    ),
    defaultProps: { members: [], layout: 'grid', showSocial: false },
    variants: ['grid', 'list', 'carousel', 'masonry'],
    tags: ['team', 'members', 'staff', 'about'],
    complexity: 'basic',
    popularity: 88,
    usage: 'high'
  },
  {
    id: 'testimonials-wall',
    name: 'Testimonials Wall',
    description: 'Customer testimonials in various layouts',
    category: 'business',
    icon: MessageSquare,
    preview: () => (
      <div className="w-full h-24 bg-muted rounded p-3 grid grid-cols-2 gap-2">
        <div className="p-2 bg-background rounded border">
          <div className="text-xs italic mb-1">"Great service!"</div>
          <div className="text-xs font-medium">- Customer</div>
        </div>
        <div className="p-2 bg-background rounded border">
          <div className="text-xs italic mb-1">"Highly recommend"</div>
          <div className="text-xs font-medium">- Client</div>
        </div>
      </div>
    ),
    defaultProps: { testimonials: [], layout: 'grid', showRating: true },
    variants: ['grid', 'slider', 'masonry', 'timeline'],
    tags: ['testimonials', 'reviews', 'social-proof', 'trust'],
    complexity: 'intermediate',
    popularity: 90,
    usage: 'high'
  },
  {
    id: 'business-hours',
    name: 'Business Hours',
    description: 'Display opening hours and availability',
    category: 'business',
    icon: Clock,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3">
        <div className="text-sm font-medium mb-2">Business Hours</div>
        <div className="text-xs space-y-1">
          <div>Mon-Fri: 9AM-6PM</div>
          <div>Sat: 10AM-4PM</div>
          <div>Sun: Closed</div>
        </div>
      </div>
    ),
    defaultProps: { hours: {}, showCurrentStatus: true, timezone: 'local' },
    variants: ['list', 'table', 'compact', 'detailed'],
    tags: ['hours', 'business', 'opening', 'availability'],
    complexity: 'basic',
    popularity: 75,
    usage: 'medium'
  },
  {
    id: 'contact-cards',
    name: 'Contact Cards',
    description: 'Contact information display with multiple formats',
    category: 'business',
    icon: Phone,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 flex space-x-3">
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4" />
          <span className="text-xs">+1 234 567 890</span>
        </div>
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4" />
          <span className="text-xs">info@company.com</span>
        </div>
      </div>
    ),
    defaultProps: { contacts: [], layout: 'horizontal', showIcons: true },
    variants: ['horizontal', 'vertical', 'cards', 'minimal'],
    tags: ['contact', 'information', 'business', 'communication'],
    complexity: 'basic',
    popularity: 82,
    usage: 'high'
  },

  // Canva-Style Creative Components
  {
    id: 'shape-elements',
    name: 'Shape Elements',
    description: 'Geometric shapes and design elements',
    category: 'creative',
    icon: Triangle,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded flex items-center justify-center space-x-2">
        <div className="w-6 h-6 bg-primary rounded"></div>
        <Triangle className="w-6 h-6 text-primary" />
        <div className="w-6 h-6 bg-primary rounded-full"></div>
        <Square className="w-6 h-6 text-primary" />
      </div>
    ),
    defaultProps: { shapes: ['circle', 'square', 'triangle'], colors: [], sizes: [] },
    variants: ['basic', 'organic', 'geometric', 'custom'],
    tags: ['shapes', 'design', 'elements', 'graphics'],
    complexity: 'basic',
    popularity: 80,
    usage: 'high'
  },
  {
    id: 'text-effects',
    name: 'Text Effects',
    description: 'Advanced typography with effects and animations',
    category: 'creative',
    icon: Type,
    preview: () => (
      <div className="w-full h-12 bg-gradient-to-r from-primary to-secondary rounded flex items-center justify-center">
        <span className="text-white font-bold text-sm">TEXT EFFECTS</span>
      </div>
    ),
    defaultProps: { text: 'Your Text', effect: 'gradient', animation: 'none' },
    variants: ['gradient', 'shadow', 'outline', 'glow', '3d'],
    tags: ['text', 'effects', 'typography', 'animation'],
    complexity: 'intermediate',
    popularity: 78,
    usage: 'medium'
  },
  {
    id: 'design-frames',
    name: 'Design Frames',
    description: 'Decorative frames and borders for content',
    category: 'creative',
    icon: Square,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-2">
        <div className="w-full h-full border-4 border-primary rounded-lg flex items-center justify-center">
          <span className="text-xs">Frame Content</span>
        </div>
      </div>
    ),
    defaultProps: { style: 'simple', color: '#000000', thickness: 2 },
    variants: ['simple', 'ornate', 'modern', 'vintage'],
    tags: ['frames', 'borders', 'design', 'decorative'],
    complexity: 'basic',
    popularity: 70,
    usage: 'medium'
  },
  {
    id: 'color-palettes',
    name: 'Color Palettes',
    description: 'Pre-designed color schemes and pickers',
    category: 'creative',
    icon: Palette,
    preview: () => (
      <div className="w-full h-8 bg-muted rounded flex space-x-1 p-1">
        <div className="flex-1 bg-red-500 rounded"></div>
        <div className="flex-1 bg-blue-500 rounded"></div>
        <div className="flex-1 bg-green-500 rounded"></div>
        <div className="flex-1 bg-yellow-500 rounded"></div>
        <div className="flex-1 bg-purple-500 rounded"></div>
      </div>
    ),
    defaultProps: { palette: 'default', customColors: [] },
    variants: ['warm', 'cool', 'pastel', 'vibrant', 'monochrome'],
    tags: ['colors', 'palettes', 'design', 'themes'],
    complexity: 'basic',
    popularity: 85,
    usage: 'high'
  },
  {
    id: 'pattern-overlays',
    name: 'Pattern Overlays',
    description: 'Background patterns and textures',
    category: 'creative',
    icon: Grid,
    preview: () => (
      <div className="w-full h-12 bg-muted rounded opacity-50" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 1px, transparent 4px)'
      }}>
        <div className="w-full h-full bg-primary/20 rounded flex items-center justify-center">
          <span className="text-xs">Pattern Overlay</span>
        </div>
      </div>
    ),
    defaultProps: { pattern: 'dots', opacity: 0.5, color: '#000000' },
    variants: ['dots', 'stripes', 'chevrons', 'geometric', 'organic'],
    tags: ['patterns', 'overlays', 'textures', 'backgrounds'],
    complexity: 'basic',
    popularity: 65,
    usage: 'medium'
  },

  // Shopify-Style Advanced E-commerce
  {
    id: 'product-filters',
    name: 'Product Filters',
    description: 'Advanced filtering for product catalogs',
    category: 'commerce',
    icon: Filter,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="flex space-x-2">
          <div className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded">Price: $0-$50</div>
          <div className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded">Category: Electronics</div>
        </div>
        <div className="text-xs text-muted-foreground">12 products found</div>
      </div>
    ),
    defaultProps: { filters: [], showCounts: true, layout: 'horizontal' },
    variants: ['horizontal', 'vertical', 'dropdown', 'sidebar'],
    tags: ['filters', 'products', 'search', 'catalog'],
    complexity: 'advanced',
    popularity: 80,
    usage: 'high'
  },
  {
    id: 'wishlist-widget',
    name: 'Wishlist Widget',
    description: 'Save and manage favorite products',
    category: 'commerce',
    icon: Heart,
    preview: () => (
      <div className="w-full h-12 bg-muted rounded p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Heart className="h-4 w-4 text-red-500" />
          <span className="text-sm">Wishlist (3)</span>
        </div>
        <Button size="sm" variant="outline">View All</Button>
      </div>
    ),
    defaultProps: { showCount: true, layout: 'compact', allowSharing: false },
    variants: ['compact', 'detailed', 'sidebar', 'modal'],
    tags: ['wishlist', 'favorites', 'products', 'shopping'],
    complexity: 'intermediate',
    popularity: 75,
    usage: 'medium'
  },
  {
    id: 'shipping-calculator',
    name: 'Shipping Calculator',
    description: 'Calculate shipping costs and delivery times',
    category: 'commerce',
    icon: Truck,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Shipping Calculator</div>
        <div className="flex justify-between text-xs">
          <span>Standard Shipping</span>
          <span>$5.99 (3-5 days)</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>Express Shipping</span>
          <span>$12.99 (1-2 days)</span>
        </div>
      </div>
    ),
    defaultProps: { methods: [], showEstimates: true, currency: 'USD' },
    variants: ['simple', 'detailed', 'interactive', 'map-based'],
    tags: ['shipping', 'calculator', 'delivery', 'costs'],
    complexity: 'advanced',
    popularity: 70,
    usage: 'medium'
  },
  {
    id: 'customer-reviews',
    name: 'Customer Reviews',
    description: 'Advanced review system with ratings and filters',
    category: 'commerce',
    icon: Star,
    preview: () => (
      <div className="w-full h-20 bg-muted rounded p-3 space-y-2">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
          </div>
          <span className="text-sm font-medium">4.8 (127 reviews)</span>
        </div>
        <div className="text-xs text-muted-foreground">Most helpful reviews first</div>
      </div>
    ),
    defaultProps: { productId: '', showFilters: true, sortBy: 'helpful' },
    variants: ['summary', 'detailed', 'carousel', 'grid'],
    tags: ['reviews', 'ratings', 'customers', 'feedback'],
    complexity: 'advanced',
    popularity: 85,
    usage: 'high'
  },
  {
    id: 'loyalty-program',
    name: 'Loyalty Program',
    description: 'Customer loyalty and rewards display',
    category: 'commerce',
    icon: Trophy,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Gold Member</span>
          </div>
          <span className="text-sm">2,450 points</span>
        </div>
        <div className="w-full bg-background rounded-full h-2">
          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }}></div>
        </div>
        <div className="text-xs text-muted-foreground">750 points to Platinum</div>
      </div>
    ),
    defaultProps: { tiers: [], currentPoints: 0, showProgress: true },
    variants: ['simple', 'detailed', 'gamified', 'progress-bars'],
    tags: ['loyalty', 'rewards', 'points', 'membership'],
    complexity: 'advanced',
    popularity: 65,
    usage: 'medium'
  },

  // Education Components
  {
    id: 'course-catalog',
    name: 'Course Catalog',
    description: 'Display educational courses and programs',
    category: 'education',
    icon: GraduationCap,
    preview: () => (
      <div className="w-full h-20 bg-muted rounded p-3 space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded"></div>
          <div>
            <div className="text-sm font-medium">Web Development Bootcamp</div>
            <div className="text-xs text-muted-foreground">12 weeks • $299</div>
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded">Beginner</div>
          <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Online</div>
        </div>
      </div>
    ),
    defaultProps: { courses: [], showFilters: true, layout: 'grid' },
    variants: ['grid', 'list', 'featured', 'categories'],
    tags: ['courses', 'education', 'learning', 'training'],
    complexity: 'advanced',
    popularity: 75,
    usage: 'medium'
  },
  {
    id: 'quiz-builder',
    name: 'Quiz Builder',
    description: 'Interactive quizzes and assessments',
    category: 'education',
    icon: Target,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">JavaScript Fundamentals Quiz</div>
        <div className="text-xs text-muted-foreground">Question 1 of 10</div>
        <div className="space-y-1">
          <div className="h-6 bg-background border rounded px-2 flex items-center">
            <span className="text-xs">Option A</span>
          </div>
          <div className="h-6 bg-background border rounded px-2 flex items-center">
            <span className="text-xs">Option B</span>
          </div>
        </div>
      </div>
    ),
    defaultProps: { questions: [], showResults: true, timeLimit: 0 },
    variants: ['multiple-choice', 'true-false', 'essay', 'mixed'],
    tags: ['quiz', 'assessment', 'education', 'interactive'],
    complexity: 'advanced',
    popularity: 70,
    usage: 'medium'
  },

  // Event Components
  {
    id: 'event-calendar',
    name: 'Event Calendar',
    description: 'Interactive calendar for events and scheduling',
    category: 'events',
    icon: Calendar,
    preview: () => (
      <div className="w-full h-24 bg-muted rounded p-3">
        <div className="text-center mb-2">
          <div className="text-sm font-medium">October 2024</div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="text-xs font-medium">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 mt-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`text-xs p-1 rounded ${i === 3 ? 'bg-primary text-primary-foreground' : ''}`}>
              {15 + i}
            </div>
          ))}
        </div>
      </div>
    ),
    defaultProps: { events: [], view: 'month', showFilters: true },
    variants: ['month', 'week', 'day', 'agenda'],
    tags: ['calendar', 'events', 'scheduling', 'dates'],
    complexity: 'advanced',
    popularity: 78,
    usage: 'medium'
  },
  {
    id: 'event-tickets',
    name: 'Event Tickets',
    description: 'Ticket sales and event registration',
    category: 'events',
    icon: Ticket,
    preview: () => (
      <div className="w-full h-20 bg-muted rounded p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Concert Tickets</div>
            <div className="text-xs text-muted-foreground">Oct 15, 2024 • 8:00 PM</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">$45</div>
            <div className="text-xs text-muted-foreground">per ticket</div>
          </div>
        </div>
        <Button className="w-full" size="sm">Get Tickets</Button>
      </div>
    ),
    defaultProps: { event: {}, ticketTypes: [], showQuantity: true },
    variants: ['single', 'multiple', 'timed', 'vip'],
    tags: ['tickets', 'events', 'registration', 'sales'],
    complexity: 'advanced',
    popularity: 72,
    usage: 'medium'
  },

  // Portfolio Components
  {
    id: 'portfolio-grid',
    name: 'Portfolio Grid',
    description: 'Showcase work with filterable grid layout',
    category: 'portfolio',
    icon: Briefcase,
    preview: () => (
      <div className="w-full h-24 bg-muted rounded p-2">
        <div className="grid grid-cols-3 gap-1 h-full">
          <div className="bg-primary rounded"></div>
          <div className="bg-secondary rounded"></div>
          <div className="bg-accent rounded"></div>
          <div className="bg-primary/50 rounded"></div>
          <div className="bg-secondary/50 rounded"></div>
          <div className="bg-accent/50 rounded"></div>
        </div>
      </div>
    ),
    defaultProps: { items: [], categories: [], showFilters: true },
    variants: ['grid', 'masonry', 'carousel', 'fullscreen'],
    tags: ['portfolio', 'showcase', 'work', 'gallery'],
    complexity: 'intermediate',
    popularity: 85,
    usage: 'high'
  },
  {
    id: 'case-study',
    name: 'Case Study',
    description: 'Detailed project case studies with before/after',
    category: 'portfolio',
    icon: FileText,
    preview: () => (
      <div className="w-full h-20 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Brand Redesign Project</div>
        <div className="flex space-x-4 text-xs text-muted-foreground">
          <span>Client: ABC Corp</span>
          <span>Duration: 3 months</span>
          <span>Result: +150% engagement</span>
        </div>
        <div className="flex space-x-2">
          <div className="w-8 h-6 bg-primary/20 rounded"></div>
          <div className="w-8 h-6 bg-secondary/20 rounded"></div>
          <div className="text-xs">Before/After</div>
        </div>
      </div>
    ),
    defaultProps: { title: '', client: '', results: [], images: [] },
    variants: ['detailed', 'compact', 'timeline', 'interactive'],
    tags: ['case-study', 'project', 'results', 'showcase'],
    complexity: 'advanced',
    popularity: 75,
    usage: 'medium'
  },

  // Restaurant Components
  {
    id: 'menu-display',
    name: 'Menu Display',
    description: 'Restaurant menu with categories and pricing',
    category: 'restaurant',
    icon: Utensils,
    preview: () => (
      <div className="w-full h-20 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Main Courses</div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Grilled Salmon</span>
            <span>$24.99</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Beef Tenderloin</span>
            <span>$32.99</span>
          </div>
        </div>
      </div>
    ),
    defaultProps: { categories: [], items: [], showPrices: true, currency: 'USD' },
    variants: ['grid', 'list', 'tabs', 'accordion'],
    tags: ['menu', 'restaurant', 'food', 'pricing'],
    complexity: 'intermediate',
    popularity: 78,
    usage: 'medium'
  },
  {
    id: 'reservation-system',
    name: 'Reservation System',
    description: 'Table reservation booking interface',
    category: 'restaurant',
    icon: Calendar,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Make a Reservation</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="font-medium">2</div>
            <div className="text-muted-foreground">Guests</div>
          </div>
          <div className="text-center">
            <div className="font-medium">7:00 PM</div>
            <div className="text-muted-foreground">Time</div>
          </div>
          <div className="text-center">
            <div className="font-medium">Today</div>
            <div className="text-muted-foreground">Date</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: { maxGuests: 10, timeSlots: [], showCalendar: true },
    variants: ['simple', 'detailed', 'calendar', 'form'],
    tags: ['reservation', 'booking', 'restaurant', 'table'],
    complexity: 'advanced',
    popularity: 70,
    usage: 'medium'
  },

  // Healthcare Components
  {
    id: 'appointment-booking',
    name: 'Appointment Booking',
    description: 'Medical appointment scheduling system',
    category: 'healthcare',
    icon: Calendar,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Book Appointment</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="font-medium">Dr. Smith</div>
            <div className="text-muted-foreground">Cardiologist</div>
          </div>
          <div>
            <div className="font-medium">Oct 20</div>
            <div className="text-muted-foreground">2:00 PM</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: { doctors: [], services: [], showInsurance: false },
    variants: ['simple', 'detailed', 'telemedicine', 'follow-up'],
    tags: ['appointment', 'booking', 'healthcare', 'medical'],
    complexity: 'advanced',
    popularity: 75,
    usage: 'medium'
  },
  {
    id: 'patient-portal',
    name: 'Patient Portal',
    description: 'Medical records and appointment management',
    category: 'healthcare',
    icon: Heart,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">My Health Portal</div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">3</div>
            <div className="text-muted-foreground">Upcoming</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">12</div>
            <div className="text-muted-foreground">Completed</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: { patientId: '', showRecords: true, allowBooking: true },
    variants: ['dashboard', 'records', 'appointments', 'billing'],
    tags: ['patient', 'portal', 'healthcare', 'records'],
    complexity: 'advanced',
    popularity: 70,
    usage: 'medium'
  },

  // Real Estate Components
  {
    id: 'property-listing',
    name: 'Property Listing',
    description: 'Real estate property showcase with details',
    category: 'real-estate',
    icon: Home,
    preview: () => (
      <div className="w-full h-20 bg-muted rounded p-3 space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded"></div>
          <div>
            <div className="text-sm font-medium">Modern Apartment</div>
            <div className="text-xs text-muted-foreground">3 beds • 2 baths • 1,200 sqft</div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm font-bold">$450,000</div>
          <Button size="sm" variant="outline">View Details</Button>
        </div>
      </div>
    ),
    defaultProps: { property: {}, showGallery: true, showMap: false },
    variants: ['card', 'detailed', 'gallery', 'map-view'],
    tags: ['property', 'real-estate', 'listing', 'homes'],
    complexity: 'intermediate',
    popularity: 80,
    usage: 'medium'
  },
  {
    id: 'mortgage-calculator',
    name: 'Mortgage Calculator',
    description: 'Home loan calculation and planning tool',
    category: 'real-estate',
    icon: Calculator,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Mortgage Calculator</div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Home Price:</span>
            <span>$400,000</span>
          </div>
          <div className="flex justify-between">
            <span>Monthly Payment:</span>
            <span>$2,150</span>
          </div>
        </div>
      </div>
    ),
    defaultProps: { price: 0, downPayment: 20, interestRate: 4.5, loanTerm: 30 },
    variants: ['simple', 'detailed', 'comparison', 'amortization'],
    tags: ['mortgage', 'calculator', 'loan', 'real-estate'],
    complexity: 'advanced',
    popularity: 65,
    usage: 'medium'
  },

  // Advanced Wix-Style Components
  {
    id: 'survey-builder',
    name: 'Survey Builder',
    description: 'Create interactive surveys and feedback forms',
    category: 'business',
    icon: FileText,
    preview: () => (
      <div className="w-full h-20 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Customer Satisfaction Survey</div>
        <div className="space-y-1">
          <div className="text-xs">How satisfied are you with our service?</div>
          <div className="flex space-x-1">
            {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 text-yellow-400" />)}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">Question 1 of 5</div>
      </div>
    ),
    defaultProps: { questions: [], showProgress: true, allowAnonymous: false },
    variants: ['single-page', 'multi-step', 'quiz', 'feedback'],
    tags: ['survey', 'feedback', 'forms', 'research'],
    complexity: 'advanced',
    popularity: 75,
    usage: 'medium'
  },
  {
    id: 'membership-system',
    name: 'Membership System',
    description: 'User registration and membership management',
    category: 'business',
    icon: Shield,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Premium Membership</div>
        <div className="flex items-center justify-between text-xs">
          <span>Access Level:</span>
          <span className="px-2 py-1 bg-primary text-primary-foreground rounded">Gold</span>
        </div>
        <div className="text-xs text-muted-foreground">Valid until Dec 31, 2024</div>
      </div>
    ),
    defaultProps: { tiers: [], features: [], showPricing: true },
    variants: ['simple', 'tiered', 'feature-based', 'time-limited'],
    tags: ['membership', 'subscription', 'access', 'premium'],
    complexity: 'advanced',
    popularity: 70,
    usage: 'medium'
  },
  {
    id: 'calculator-builder',
    name: 'Calculator Builder',
    description: 'Custom calculators for quotes, estimates, and conversions',
    category: 'business',
    icon: Calculator,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Project Cost Calculator</div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Hours:</span>
            <span>40</span>
          </div>
          <div className="flex justify-between">
            <span>Rate:</span>
            <span>$75/hr</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total:</span>
            <span>$3,000</span>
          </div>
        </div>
      </div>
    ),
    defaultProps: { fields: [], formulas: [], currency: 'USD' },
    variants: ['quote', 'estimate', 'converter', 'custom'],
    tags: ['calculator', 'quote', 'estimate', 'pricing'],
    complexity: 'advanced',
    popularity: 68,
    usage: 'medium'
  },
  {
    id: 'social-wall',
    name: 'Social Wall',
    description: 'Display social media posts in a unified wall',
    category: 'marketing',
    icon: Users,
    preview: () => (
      <div className="w-full h-20 bg-muted rounded p-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-100 p-2 rounded text-xs">
            <div className="font-medium">Facebook</div>
            <div>Latest post...</div>
          </div>
          <div className="bg-pink-100 p-2 rounded text-xs">
            <div className="font-medium">Instagram</div>
            <div>Photo update...</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: { platforms: [], maxPosts: 20, layout: 'grid' },
    variants: ['grid', 'masonry', 'carousel', 'timeline'],
    tags: ['social', 'wall', 'feed', 'unified'],
    complexity: 'advanced',
    popularity: 72,
    usage: 'medium'
  },
  {
    id: 'booking-system',
    name: 'Booking System',
    description: 'Appointment and service booking with calendar',
    category: 'business',
    icon: Calendar,
    preview: () => (
      <div className="w-full h-18 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Book a Consultation</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="font-medium">Available Times</div>
            <div className="text-muted-foreground">2:00 PM, 3:30 PM</div>
          </div>
          <div>
            <div className="font-medium">Duration</div>
            <div className="text-muted-foreground">60 minutes</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: { services: [], timeSlots: [], bufferTime: 15 },
    variants: ['calendar', 'list', 'time-slots', 'availability'],
    tags: ['booking', 'appointment', 'calendar', 'scheduling'],
    complexity: 'advanced',
    popularity: 80,
    usage: 'high'
  },

  // Advanced Shopify-Style E-commerce
  {
    id: 'product-comparison',
    name: 'Product Comparison',
    description: 'Side-by-side product comparison tool',
    category: 'commerce',
    icon: GitCompare,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-center">
            <div className="w-8 h-8 bg-primary rounded mx-auto mb-1"></div>
            <div>Product A</div>
            <div className="text-muted-foreground">$29.99</div>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-secondary rounded mx-auto mb-1"></div>
            <div>Product B</div>
            <div className="text-muted-foreground">$34.99</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: { products: [], features: [], highlight: null },
    variants: ['table', 'cards', 'detailed', 'minimal'],
    tags: ['comparison', 'products', 'features', 'decision'],
    complexity: 'advanced',
    popularity: 78,
    usage: 'medium'
  },
  {
    id: 'upsell-cross-sell',
    name: 'Upsell/Cross-sell',
    description: 'Recommended products and bundles',
    category: 'commerce',
    icon: TrendingUp,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Frequently Bought Together</div>
        <div className="flex space-x-2">
          <div className="w-6 h-6 bg-primary rounded"></div>
          <div className="w-6 h-6 bg-secondary rounded"></div>
          <div className="w-6 h-6 bg-accent rounded"></div>
        </div>
        <div className="text-xs text-muted-foreground">Save 15% when bought together</div>
      </div>
    ),
    defaultProps: { products: [], discount: 0, layout: 'horizontal' },
    variants: ['bundle', 'related', 'frequently-bought', 'recommendations'],
    tags: ['upsell', 'cross-sell', 'recommendations', 'bundles'],
    complexity: 'advanced',
    popularity: 82,
    usage: 'high'
  },
  {
    id: 'product-customizer',
    name: 'Product Customizer',
    description: 'Interactive product customization tool',
    category: 'commerce',
    icon: Palette,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Customize Your Product</div>
        <div className="grid grid-cols-3 gap-1 text-xs">
          <div className="text-center">
            <div className="w-4 h-4 bg-red-500 rounded mb-1"></div>
            <div>Color</div>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 bg-blue-500 rounded mb-1"></div>
            <div>Size</div>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 bg-green-500 rounded mb-1"></div>
            <div>Style</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: { options: [], basePrice: 0, preview: true },
    variants: ['simple', 'advanced', '3d-preview', 'live-preview'],
    tags: ['customizer', 'personalization', 'options', 'interactive'],
    complexity: 'advanced',
    popularity: 75,
    usage: 'medium'
  },
  {
    id: 'inventory-display',
    name: 'Inventory Display',
    description: 'Stock levels and availability indicators',
    category: 'commerce',
    icon: Package,
    preview: () => (
      <div className="w-full h-12 bg-muted rounded p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Package className="h-4 w-4" />
          <span className="text-sm">In Stock</span>
        </div>
        <span className="text-sm font-medium text-green-600">12 available</span>
      </div>
    ),
    defaultProps: { stock: 0, lowStockThreshold: 5, showExact: true },
    variants: ['badge', 'text', 'progress-bar', 'detailed'],
    tags: ['inventory', 'stock', 'availability', 'quantity'],
    complexity: 'intermediate',
    popularity: 85,
    usage: 'high'
  },
  {
    id: 'order-tracking',
    name: 'Order Tracking',
    description: 'Real-time order status and tracking',
    category: 'commerce',
    icon: Truck,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Order #12345</div>
        <div className="flex items-center justify-between text-xs">
          <span>Status:</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">In Transit</span>
        </div>
        <div className="text-xs text-muted-foreground">Expected delivery: Tomorrow</div>
      </div>
    ),
    defaultProps: { orderId: '', status: 'pending', trackingNumber: '' },
    variants: ['simple', 'detailed', 'timeline', 'map-tracking'],
    tags: ['tracking', 'orders', 'delivery', 'status'],
    complexity: 'advanced',
    popularity: 80,
    usage: 'high'
  },
  {
    id: 'gift-cards',
    name: 'Gift Cards',
    description: 'Digital gift card purchase and redemption',
    category: 'commerce',
    icon: Gift,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Digital Gift Card</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="font-medium">$25</div>
            <div className="text-muted-foreground">Value</div>
          </div>
          <div className="text-center">
            <div className="font-medium">Valid</div>
            <div className="text-muted-foreground">1 Year</div>
          </div>
          <div className="text-center">
            <div className="font-medium">No</div>
            <div className="text-muted-foreground">Fees</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: { denominations: [], validity: 365, design: 'default' },
    variants: ['digital', 'physical', 'custom', 'bulk'],
    tags: ['gift-cards', 'gifts', 'redemption', 'value'],
    complexity: 'advanced',
    popularity: 65,
    usage: 'medium'
  },

  // Advanced Canva-Style Creative Components
  {
    id: 'advanced-text-effects',
    name: 'Advanced Text Effects',
    description: 'Professional typography with gradients, shadows, and animations',
    category: 'creative',
    icon: Type,
    preview: () => (
      <div className="w-full h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded flex items-center justify-center relative overflow-hidden">
        <span className="text-white font-bold text-lg tracking-wider drop-shadow-lg">
          TEXT EFFECTS
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      </div>
    ),
    defaultProps: { text: 'Your Text', gradient: true, shadow: true, animation: 'glow' },
    variants: ['gradient', 'metallic', 'neon', 'vintage', '3d', 'animated'],
    tags: ['typography', 'effects', 'gradients', 'animations'],
    complexity: 'advanced',
    popularity: 78,
    usage: 'high'
  },
  {
    id: 'graphic-elements',
    name: 'Graphic Elements',
    description: 'Illustrations, icons, and decorative elements',
    category: 'creative',
    icon: Sparkles,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded flex items-center justify-center space-x-4">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg transform rotate-45"></div>
        <Sparkles className="w-6 h-6 text-yellow-500" />
        <div className="w-6 h-6 bg-red-500 rounded-full animate-bounce"></div>
        <div className="w-8 h-2 bg-green-500 rounded-full"></div>
      </div>
    ),
    defaultProps: { elements: ['stars', 'arrows', 'badges'], style: 'modern' },
    variants: ['minimal', 'playful', 'corporate', 'vintage'],
    tags: ['graphics', 'illustrations', 'decorative', 'elements'],
    complexity: 'intermediate',
    popularity: 82,
    usage: 'high'
  },
  {
    id: 'photo-filters',
    name: 'Photo Filters',
    description: 'Instagram-style photo filters and effects',
    category: 'creative',
    icon: Image,
    preview: () => (
      <div className="w-full h-16 bg-gradient-to-r from-gray-300 to-gray-600 rounded flex items-center justify-center space-x-2">
        <div className="w-8 h-8 bg-muted rounded border-2 border-white flex items-center justify-center">
          <span className="text-xs font-medium">B&W</span>
        </div>
        <div className="w-8 h-8 bg-muted rounded border-2 border-white flex items-center justify-center">
          <span className="text-xs font-medium">VINT</span>
        </div>
        <div className="w-8 h-8 bg-muted rounded border-2 border-white flex items-center justify-center">
          <span className="text-xs font-medium">HDR</span>
        </div>
      </div>
    ),
    defaultProps: { filters: ['normal', 'vintage', 'dramatic'], intensity: 50 },
    variants: ['basic', 'advanced', 'presets', 'custom'],
    tags: ['filters', 'photo', 'effects', 'instagram'],
    complexity: 'intermediate',
    popularity: 80,
    usage: 'high'
  },
  {
    id: 'brand-kit',
    name: 'Brand Kit',
    description: 'Consistent branding elements and color schemes',
    category: 'creative',
    icon: Gem,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Brand Colors</div>
        <div className="flex space-x-2">
          <div className="w-6 h-6 bg-blue-600 rounded"></div>
          <div className="w-6 h-6 bg-green-600 rounded"></div>
          <div className="w-6 h-6 bg-orange-600 rounded"></div>
          <div className="w-6 h-6 bg-purple-600 rounded"></div>
        </div>
        <div className="text-xs text-muted-foreground">Consistent across all elements</div>
      </div>
    ),
    defaultProps: { colors: [], fonts: [], logos: [], guidelines: [] },
    variants: ['minimal', 'complete', 'flexible', 'strict'],
    tags: ['branding', 'colors', 'consistency', 'identity'],
    complexity: 'advanced',
    popularity: 70,
    usage: 'medium'
  },

  // Advanced Interactive Components
  {
    id: 'interactive-timeline',
    name: 'Interactive Timeline',
    description: 'Visual timeline with clickable events and animations',
    category: 'interactive',
    icon: Clock,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3">
        <div className="flex items-center justify-center space-x-4">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <div className="flex-1 h-0.5 bg-muted-foreground/30"></div>
          <div className="w-3 h-3 bg-muted-foreground/50 rounded-full"></div>
          <div className="flex-1 h-0.5 bg-muted-foreground/30"></div>
          <div className="w-3 h-3 bg-muted-foreground/50 rounded-full"></div>
        </div>
        <div className="text-center text-xs mt-2">2020 → 2021 → 2022</div>
      </div>
    ),
    defaultProps: { events: [], orientation: 'horizontal', animations: true },
    variants: ['horizontal', 'vertical', 'interactive', 'animated'],
    tags: ['timeline', 'history', 'events', 'progress'],
    complexity: 'advanced',
    popularity: 75,
    usage: 'medium'
  },
  {
    id: 'gamification-elements',
    name: 'Gamification Elements',
    description: 'Points, badges, progress bars, and achievement systems',
    category: 'interactive',
    icon: Trophy,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Level 5</span>
          </div>
          <span className="text-xs text-muted-foreground">2,450 XP</span>
        </div>
        <div className="w-full bg-background rounded-full h-2">
          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }}></div>
        </div>
        <div className="text-xs text-muted-foreground">550 XP to Level 6</div>
      </div>
    ),
    defaultProps: { points: 0, badges: [], achievements: [], leaderboards: false },
    variants: ['points', 'badges', 'levels', 'leaderboards'],
    tags: ['gamification', 'points', 'badges', 'achievements'],
    complexity: 'advanced',
    popularity: 68,
    usage: 'medium'
  },
  {
    id: 'advanced-forms',
    name: 'Advanced Forms',
    description: 'Multi-step forms with conditional logic and validation',
    category: 'forms',
    icon: FileText,
    preview: () => (
      <div className="w-full h-20 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Multi-Step Form</div>
        <div className="flex space-x-2">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground">1</div>
          <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs">2</div>
          <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs">3</div>
        </div>
        <div className="text-xs text-muted-foreground">Step 1: Personal Information</div>
      </div>
    ),
    defaultProps: { steps: [], conditions: [], validations: [], saveProgress: true },
    variants: ['wizard', 'accordion', 'tabs', 'conditional'],
    tags: ['forms', 'multi-step', 'conditional', 'validation'],
    complexity: 'advanced',
    popularity: 85,
    usage: 'high'
  },
  {
    id: 'data-collector',
    name: 'Data Collector',
    description: 'Advanced data collection with analytics and insights',
    category: 'interactive',
    icon: BarChart3,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Data Insights</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="text-lg font-bold">1,247</div>
            <div className="text-muted-foreground">Visitors</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">23%</div>
            <div className="text-muted-foreground">Conversion</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">$12.5K</div>
            <div className="text-muted-foreground">Revenue</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: { metrics: [], timeframe: '30d', exportable: true },
    variants: ['dashboard', 'reports', 'real-time', 'historical'],
    tags: ['data', 'analytics', 'insights', 'metrics'],
    complexity: 'advanced',
    popularity: 72,
    usage: 'medium'
  },
  {
    id: 'collaboration-tools',
    name: 'Collaboration Tools',
    description: 'Real-time collaboration and commenting system',
    category: 'interactive',
    icon: Users,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-green-500 rounded-full"></div>
          <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
          <div className="w-6 h-6 bg-red-500 rounded-full"></div>
          <span className="text-sm font-medium">3 collaborators online</span>
        </div>
        <div className="text-xs text-muted-foreground">Last edited 2 minutes ago</div>
      </div>
    ),
    defaultProps: { users: [], permissions: [], comments: [], realTime: true },
    variants: ['comments', 'cursors', 'permissions', 'version-control'],
    tags: ['collaboration', 'comments', 'real-time', 'team'],
    complexity: 'advanced',
    popularity: 70,
    usage: 'medium'
  },

  // Ultimate Professional Components
  {
    id: 'ai-content-generator',
    name: 'AI Content Generator',
    description: 'AI-powered content creation and optimization',
    category: 'content',
    icon: ZapIcon,
    preview: () => (
      <div className="w-full h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded p-3 flex items-center space-x-3">
        <ZapIcon className="h-6 w-6 text-white" />
        <div>
          <div className="text-white text-sm font-medium">AI Content Generator</div>
          <div className="text-white/80 text-xs">Generate blog posts, descriptions, headlines</div>
        </div>
      </div>
    ),
    defaultProps: { contentType: 'blog', tone: 'professional', length: 'medium' },
    variants: ['blog-posts', 'product-descriptions', 'headlines', 'social-media'],
    tags: ['ai', 'content', 'generator', 'automation'],
    complexity: 'advanced',
    popularity: 85,
    usage: 'high'
  },
  {
    id: 'advanced-analytics',
    name: 'Advanced Analytics Dashboard',
    description: 'Comprehensive website analytics and insights',
    category: 'data',
    icon: TrendingUp,
    preview: () => (
      <div className="w-full h-20 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Analytics Dashboard</div>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">15.2K</div>
            <div className="text-muted-foreground">Visitors</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">+24%</div>
            <div className="text-muted-foreground">Growth</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">2.8M</div>
            <div className="text-muted-foreground">Page Views</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">4.2m</div>
            <div className="text-muted-foreground">Avg. Time</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: { metrics: [], timeframe: '30d', compare: false },
    variants: ['traffic', 'conversion', 'engagement', 'revenue'],
    tags: ['analytics', 'insights', 'metrics', 'dashboard'],
    complexity: 'advanced',
    popularity: 88,
    usage: 'high'
  },
  {
    id: 'seo-optimizer',
    name: 'SEO Optimizer',
    description: 'AI-powered SEO analysis and optimization',
    category: 'marketing',
    icon: Target,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">SEO Score</div>
          <div className="flex items-center space-x-1">
            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <span className="text-xs font-medium">85/100</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Meta Tags ✓</span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Keywords ✓</span>
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Images ⚠</span>
        </div>
      </div>
    ),
    defaultProps: { url: '', keywords: [], competitors: [] },
    variants: ['on-page', 'technical', 'content', 'backlinks'],
    tags: ['seo', 'optimization', 'analysis', 'ranking'],
    complexity: 'advanced',
    popularity: 82,
    usage: 'high'
  },
  {
    id: 'crm-integration',
    name: 'CRM Integration',
    description: 'Customer relationship management system',
    category: 'business',
    icon: Users,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">CRM Dashboard</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="text-lg font-bold">1,247</div>
            <div className="text-muted-foreground">Leads</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">23</div>
            <div className="text-muted-foreground">New Today</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">$45K</div>
            <div className="text-muted-foreground">Pipeline</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: { contacts: [], deals: [], activities: [] },
    variants: ['sales', 'marketing', 'support', 'analytics'],
    tags: ['crm', 'customers', 'leads', 'sales'],
    complexity: 'advanced',
    popularity: 75,
    usage: 'medium'
  },
  {
    id: 'project-management',
    name: 'Project Management',
    description: 'Task management and project tracking',
    category: 'business',
    icon: Briefcase,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Project Overview</div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span>Website Redesign</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">In Progress</span>
          </div>
          <div className="w-full bg-background rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <div className="text-xs text-muted-foreground">Due: Dec 31, 2024</div>
        </div>
      </div>
    ),
    defaultProps: { projects: [], tasks: [], team: [], timeline: true },
    variants: ['kanban', 'timeline', 'list', 'calendar'],
    tags: ['projects', 'tasks', 'management', 'team'],
    complexity: 'advanced',
    popularity: 78,
    usage: 'medium'
  },
  {
    id: 'video-conferencing',
    name: 'Video Conferencing',
    description: 'Integrated video meeting and webinar system',
    category: 'interactive',
    icon: Video,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <Video className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium">Team Meeting</div>
            <div className="text-xs text-muted-foreground">Today at 3:00 PM</div>
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">8 attendees</div>
          <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">60 min</div>
        </div>
      </div>
    ),
    defaultProps: { meetingId: '', participants: [], recording: false },
    variants: ['meeting', 'webinar', 'interview', 'presentation'],
    tags: ['video', 'conferencing', 'meetings', 'webinars'],
    complexity: 'advanced',
    popularity: 72,
    usage: 'medium'
  },
  {
    id: 'document-management',
    name: 'Document Management',
    description: 'File storage, sharing, and collaboration',
    category: 'business',
    icon: FileText,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Document Library</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="w-6 h-6 bg-blue-500 rounded mb-1 mx-auto"></div>
            <div>PDF</div>
            <div className="text-muted-foreground">23</div>
          </div>
          <div className="text-center">
            <div className="w-6 h-6 bg-green-500 rounded mb-1 mx-auto"></div>
            <div>Images</div>
            <div className="text-muted-foreground">45</div>
          </div>
          <div className="text-center">
            <div className="w-6 h-6 bg-purple-500 rounded mb-1 mx-auto"></div>
            <div>Docs</div>
            <div className="text-muted-foreground">12</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: { files: [], folders: [], permissions: [], search: true },
    variants: ['files', 'folders', 'sharing', 'collaboration'],
    tags: ['documents', 'files', 'storage', 'sharing'],
    complexity: 'advanced',
    popularity: 70,
    usage: 'medium'
  },
  {
    id: 'payment-processing',
    name: 'Payment Processing',
    description: 'Integrated payment gateway and processing',
    category: 'commerce',
    icon: CreditCard,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Payment Methods</div>
        <div className="flex space-x-2">
          <div className="px-3 py-2 bg-blue-100 text-blue-800 text-xs rounded">💳 Card</div>
          <div className="px-3 py-2 bg-green-100 text-green-800 text-xs rounded">🅿️ PayPal</div>
          <div className="px-3 py-2 bg-purple-100 text-purple-800 text-xs rounded">📱 Apple Pay</div>
        </div>
        <div className="text-xs text-muted-foreground">Secure • PCI Compliant • Multiple currencies</div>
      </div>
    ),
    defaultProps: { methods: [], currencies: [], fees: [], security: true },
    variants: ['cards', 'digital-wallets', 'bank-transfer', 'crypto'],
    tags: ['payments', 'processing', 'gateways', 'security'],
    complexity: 'advanced',
    popularity: 85,
    usage: 'high'
  },
  {
    id: 'email-marketing',
    name: 'Email Marketing',
    description: 'Email campaign creation and automation',
    category: 'marketing',
    icon: Mail,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Email Campaigns</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="text-lg font-bold">24.5K</div>
            <div className="text-muted-foreground">Sent</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">32%</div>
            <div className="text-muted-foreground">Open Rate</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">4.2%</div>
            <div className="text-muted-foreground">Click Rate</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: { campaigns: [], templates: [], automation: [], analytics: true },
    variants: ['newsletters', 'promotions', 'automations', 'welcome-series'],
    tags: ['email', 'marketing', 'campaigns', 'automation'],
    complexity: 'advanced',
    popularity: 80,
    usage: 'high'
  },
  {
    id: 'social-commerce',
    name: 'Social Commerce',
    description: 'Shoppable social media integration',
    category: 'commerce',
    icon: ShoppingCart,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Social Shopping</div>
        <div className="flex space-x-4 text-xs">
          <div className="text-center">
            <div className="w-8 h-8 bg-pink-500 rounded mb-1 mx-auto"></div>
            <div>Instagram Shop</div>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-500 rounded mb-1 mx-auto"></div>
            <div>Facebook Shop</div>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-green-500 rounded mb-1 mx-auto"></div>
            <div>TikTok Shop</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: { platforms: [], products: [], tracking: true },
    variants: ['instagram', 'facebook', 'tiktok', 'pinterest'],
    tags: ['social-commerce', 'shoppable', 'integration', 'platforms'],
    complexity: 'advanced',
    popularity: 75,
    usage: 'medium'
  },
  {
    id: 'loyalty-program-advanced',
    name: 'Advanced Loyalty Program',
    description: 'Multi-tier loyalty and rewards system',
    category: 'commerce',
    icon: Crown,
    preview: () => (
      <div className="w-full h-18 bg-gradient-to-r from-yellow-400 to-orange-500 rounded p-3 text-white">
        <div className="text-sm font-medium mb-2">VIP Loyalty Program</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <Crown className="h-4 w-4 mx-auto mb-1" />
            <div>Gold Tier</div>
          </div>
          <div className="text-center">
            <Gem className="h-4 w-4 mx-auto mb-1" />
            <div>10,500 Points</div>
          </div>
          <div className="text-center">
            <Trophy className="h-4 w-4 mx-auto mb-1" />
            <div>Level 8</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: { tiers: [], rewards: [], gamification: true, personalization: true },
    variants: ['points', 'tiers', 'achievements', 'referrals'],
    tags: ['loyalty', 'rewards', 'gamification', 'vip'],
    complexity: 'advanced',
    popularity: 68,
    usage: 'medium'
  },
  {
    id: 'ar-product-viewer',
    name: 'AR Product Viewer',
    description: 'Augmented reality product visualization',
    category: 'commerce',
    icon: Eye,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">AR Product View</div>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
            <Eye className="h-6 w-6 text-white" />
          </div>
          <div className="text-xs text-muted-foreground">
            <div>Try on virtually</div>
            <div>View in your space</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: { product: {}, arModels: [], tryOn: false, placeInRoom: false },
    variants: ['try-on', 'room-placement', 'measurements', 'customization'],
    tags: ['ar', 'augmented-reality', 'product-view', 'visualization'],
    complexity: 'advanced',
    popularity: 65,
    usage: 'medium'
  },
  {
    id: 'voice-search',
    name: 'Voice Search',
    description: 'Voice-activated search and commands',
    category: 'interactive',
    icon: Mic,
    preview: () => (
      <div className="w-full h-12 bg-muted rounded flex items-center justify-center space-x-3">
        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
          <Mic className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm">Listening...</span>
        <span className="text-xs text-muted-foreground">Say "Search for products"</span>
      </div>
    ),
    defaultProps: { commands: [], language: 'en', voice: 'female' },
    variants: ['search', 'commands', 'navigation', 'shopping'],
    tags: ['voice', 'search', 'commands', 'accessibility'],
    complexity: 'advanced',
    popularity: 70,
    usage: 'medium'
  },
  {
    id: 'blockchain-integration',
    name: 'Blockchain Integration',
    description: 'NFT marketplace and crypto payments',
    category: 'advanced',
    icon: Gem,
    preview: () => (
      <div className="w-full h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded p-3 text-white">
        <div className="text-sm font-medium mb-2">Web3 Integration</div>
        <div className="flex space-x-3 text-xs">
          <div className="px-2 py-1 bg-white/20 rounded">NFTs</div>
          <div className="px-2 py-1 bg-white/20 rounded">Crypto Payments</div>
          <div className="px-2 py-1 bg-white/20 rounded">Smart Contracts</div>
        </div>
      </div>
    ),
    defaultProps: { wallet: false, nfts: false, payments: false, contracts: false },
    variants: ['nft-marketplace', 'crypto-payments', 'token-gating', 'smart-contracts'],
    tags: ['blockchain', 'web3', 'nft', 'crypto'],
    complexity: 'advanced',
    popularity: 60,
    usage: 'medium'
  },
  {
    id: 'ai-personalization',
    name: 'AI Personalization',
    description: 'AI-driven content and experience personalization',
    category: 'advanced',
    icon: SparklesIcon,
    preview: () => (
      <div className="w-full h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded p-3 text-white">
        <div className="flex items-center space-x-3">
          <SparklesIcon className="h-6 w-6" />
          <div>
            <div className="text-sm font-medium">AI Personalization</div>
            <div className="text-xs opacity-80">Customized for each visitor</div>
          </div>
        </div>
        <div className="mt-2 flex space-x-2 text-xs">
          <div className="px-2 py-1 bg-white/20 rounded">Content</div>
          <div className="px-2 py-1 bg-white/20 rounded">Products</div>
          <div className="px-2 py-1 bg-white/20 rounded">Offers</div>
        </div>
      </div>
    ),
    defaultProps: { personalization: true, segments: [], behavior: true },
    variants: ['content', 'products', 'pricing', 'experience'],
    tags: ['ai', 'personalization', 'customization', 'behavior'],
    complexity: 'advanced',
    popularity: 78,
    usage: 'high'
  },
  {
    id: 'advanced-security',
    name: 'Advanced Security',
    description: 'Enterprise-grade security and compliance',
    category: 'utility',
    icon: Shield,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Security Dashboard</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <Shield className="h-4 w-4 text-green-500 mx-auto mb-1" />
            <div>SSL</div>
            <div className="text-muted-foreground">Active</div>
          </div>
          <div className="text-center">
            <Lock className="h-4 w-4 text-blue-500 mx-auto mb-1" />
            <div>Firewall</div>
            <div className="text-muted-foreground">Enabled</div>
          </div>
          <div className="text-center">
            <Eye className="h-4 w-4 text-purple-500 mx-auto mb-1" />
            <div>Monitoring</div>
            <div className="text-muted-foreground">24/7</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: { ssl: true, firewall: true, monitoring: true, backups: true },
    variants: ['ssl', 'firewall', 'monitoring', 'backups'],
    tags: ['security', 'protection', 'compliance', 'monitoring'],
    complexity: 'advanced',
    popularity: 85,
    usage: 'high'
  },
  {
    id: 'global-cdn',
    name: 'Global CDN',
    description: 'Worldwide content delivery and optimization',
    category: 'utility',
    icon: Globe,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Global CDN</div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">0.8s</div>
            <div className="text-muted-foreground">Load Time</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">50+</div>
            <div className="text-muted-foreground">Locations</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">99.9%</div>
            <div className="text-muted-foreground">Uptime</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: { locations: [], optimization: true, caching: true },
    variants: ['standard', 'premium', 'enterprise', 'global'],
    tags: ['cdn', 'performance', 'global', 'optimization'],
    complexity: 'advanced',
    popularity: 80,
    usage: 'high'
  },
  {
    id: 'multilingual-support',
    name: 'Multilingual Support',
    description: 'Multi-language website support with translation',
    category: 'utility',
    icon: Globe,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">Languages Supported</div>
        <div className="flex flex-wrap gap-2">
          <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">English</div>
          <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Español</div>
          <div className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Français</div>
          <div className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Deutsch</div>
          <div className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">日本語</div>
        </div>
      </div>
    ),
    defaultProps: { languages: [], autoTranslate: false, rtl: false },
    variants: ['manual', 'auto-translate', 'professional', 'rtl-support'],
    tags: ['multilingual', 'languages', 'translation', 'global'],
    complexity: 'advanced',
    popularity: 75,
    usage: 'medium'
  },
  {
    id: 'accessibility-suite',
    name: 'Accessibility Suite',
    description: 'Comprehensive accessibility compliance and tools',
    category: 'utility',
    icon: Eye,
    preview: () => (
      <div className="w-full h-16 bg-muted rounded p-3 space-y-2">
        <div className="text-sm font-medium">WCAG 2.1 AA Compliant</div>
        <div className="grid grid-cols-4 gap-1 text-xs">
          <div className="text-center">
            <Eye className="h-3 w-3 text-green-500 mx-auto mb-1" />
            <div>Screen Reader</div>
          </div>
          <div className="text-center">
            <div className="h-3 w-3 bg-blue-500 rounded mx-auto mb-1"></div>
            <div>Keyboard Nav</div>
          </div>
          <div className="text-center">
            <div className="h-3 w-3 bg-purple-500 rounded mx-auto mb-1"></div>
            <div>High Contrast</div>
          </div>
          <div className="text-center">
            <div className="h-3 w-3 bg-orange-500 rounded mx-auto mb-1"></div>
            <div>Alt Text</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: { wcag: '2.1aa', screenReader: true, keyboard: true, contrast: true },
    variants: ['basic', 'comprehensive', 'enterprise', 'auto-fix'],
    tags: ['accessibility', 'wcag', 'compliance', 'inclusive'],
    complexity: 'advanced',
    popularity: 78,
    usage: 'high'
  }
]

export function ComponentLibrary({
  onComponentSelect,
  currentContext = [],
  searchQuery = ''
}: ComponentLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'popularity' | 'name' | 'complexity'>('popularity')

  // Filter and sort components
  const filteredComponents = useMemo(() => {
    let filtered = componentDefinitions

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(comp => comp.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(comp =>
        comp.name.toLowerCase().includes(query) ||
        comp.description.toLowerCase().includes(query) ||
        comp.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Sort components
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'complexity':
          const complexityOrder = { basic: 0, intermediate: 1, advanced: 2 }
          return complexityOrder[a.complexity] - complexityOrder[b.complexity]
        case 'popularity':
        default:
          return b.popularity - a.popularity
      }
    })

    return filtered
  }, [selectedCategory, searchQuery, sortBy])

  // AI-powered component suggestions
  const aiSuggestions = useMemo(() => {
    if (!currentContext.length) return []

    return componentDefinitions
      .filter(comp =>
        comp.aiSuggestions?.some(suggestion =>
          suggestion.context.some(ctx =>
            currentContext.some(currentCtx =>
              ctx.toLowerCase().includes(currentCtx.toLowerCase()) ||
              currentCtx.toLowerCase().includes(ctx.toLowerCase())
            )
          )
        )
      )
      .sort((a, b) => {
        const aScore = a.aiSuggestions?.find(s =>
          s.context.some(ctx => currentContext.some(cc => cc.includes(ctx)))
        )?.score || 0
        const bScore = b.aiSuggestions?.find(s =>
          s.context.some(ctx => currentContext.some(cc => cc.includes(ctx)))
        )?.score || 0
        return bScore - aScore
      })
      .slice(0, 6)
  }, [currentContext])

  const handleComponentSelect = (component: ComponentDefinition) => {
    onComponentSelect(component)
  }

  const renderComponentPreview = (component: ComponentDefinition) => {
    const PreviewComponent = component.preview
    return <PreviewComponent />
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Component Library</h2>
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

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full h-auto p-1">
            <TabsTrigger value="all" className="flex-1">
              <Package className="h-4 w-4 mr-2" />
              All
            </TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="flex-1">
                <category.icon className="h-4 w-4 mr-2" />
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Filters */}
        <div className="flex items-center space-x-2 mt-4">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popular</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="complexity">Complexity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <div className="p-4 border-b border-border bg-primary/5">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-medium">AI Suggestions</h3>
            <Badge variant="secondary">Smart</Badge>
          </div>
          <ScrollArea className="w-full">
            <div className="flex space-x-4 pb-2">
              {aiSuggestions.map(component => (
                <Card
                  key={`ai-${component.id}`}
                  className="flex-shrink-0 w-48 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleComponentSelect(component)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <component.icon className="h-4 w-4" />
                      <span className="text-sm font-medium truncate">{component.name}</span>
                    </div>
                    <div className="h-12 mb-2">
                      {renderComponentPreview(component)}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {component.aiSuggestions?.[0]?.reasoning || 'Recommended'}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Component Grid/List */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'grid' ? (
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredComponents.map(component => (
                <Card
                  key={component.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 group"
                  onClick={() => handleComponentSelect(component)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <component.icon className="h-4 w-4" />
                        <CardTitle className="text-sm">{component.name}</CardTitle>
                      </div>
                      <div className="flex space-x-1">
                        {component.complexity === 'basic' && <Badge variant="secondary" className="text-xs">Basic</Badge>}
                        {component.complexity === 'advanced' && <Badge variant="destructive" className="text-xs">Advanced</Badge>}
                        {component.usage === 'high' && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{component.description}</p>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="h-16 mb-3 flex items-center justify-center bg-muted/30 rounded">
                      {renderComponentPreview(component)}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {component.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {component.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{component.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="space-y-2">
              {filteredComponents.map(component => (
                <Card
                  key={component.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleComponentSelect(component)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <component.icon className="h-6 w-6" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium">{component.name}</h3>
                          <div className="flex items-center space-x-2">
                            {component.complexity === 'basic' && <Badge variant="secondary" className="text-xs">Basic</Badge>}
                            {component.complexity === 'advanced' && <Badge variant="destructive" className="text-xs">Advanced</Badge>}
                            {component.usage === 'high' && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{component.description}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs capitalize">{component.category}</Badge>
                          {component.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex-shrink-0 w-32 h-12 flex items-center justify-center bg-muted/30 rounded">
                        {renderComponentPreview(component)}
                      </div>

                      <Button size="sm" variant="ghost">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {filteredComponents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No components found</h3>
            <p className="text-muted-foreground text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
