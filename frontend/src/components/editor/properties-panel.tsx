'use client'

import { useState } from 'react'
import { Element, ViewMode } from '@/types/editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { ColorPicker } from './color-picker'
import { SpacingControl } from './spacing-control'
import { 
  Palette, 
  Type, 
  Layout, 
  Sparkles, 
  X,
  ChevronDown,
  ChevronRight,
  Monitor,
  Tablet,
  Smartphone
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PropertiesPanelProps {
  element: Element
  onUpdate: (updates: Partial<Element>) => void
  onClose?: () => void
  isOpen?: boolean  // ADD THIS LINE
}

interface PropertyGroupProps {
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  defaultOpen?: boolean
}

function PropertyGroup({ title, icon: Icon, children, defaultOpen = true }: PropertyGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-border rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{title}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="p-3 border-t border-border space-y-3">
          {children}
        </div>
      )}
    </div>
  )
}

export function PropertiesPanel({ element, onUpdate, onClose, isOpen = true }: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState('content')
  const [activeBreakpoint, setActiveBreakpoint] = useState<ViewMode>('desktop')

  const updateProps = (key: string, value: any) => {
    onUpdate({
      props: {
        ...element.props,
        [key]: value
      }
    })
  }

  const updateStyle = (key: string, value: any) => {
    if (activeBreakpoint === 'desktop') {
      onUpdate({
        style: {
          ...element.style,
          [key]: value
        }
      })
    } else {
      onUpdate({
        responsive: {
          ...element.responsive,
          [activeBreakpoint]: {
            ...element.responsive?.[activeBreakpoint],
            [key]: value
          }
        }
      })
    }
  }

  const getCurrentStyle = () => {
    if (activeBreakpoint === 'desktop') {
      return element.style
    }
    return {
      ...element.style,
      ...element.responsive?.[activeBreakpoint]
    }
  }

  const renderContentProperties = () => {
    switch (element.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content">Text Content</Label>
              <Textarea
                id="content"
                value={element.props.content || ''}
                onChange={(e) => updateProps('content', e.target.value)}
                rows={4}
              />
            </div>
          </div>
        )

      case 'heading':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content">Heading Text</Label>
              <Input
                id="content"
                value={element.props.content || ''}
                onChange={(e) => updateProps('content', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="level">Heading Level</Label>
              <Select
                value={element.props.level || 'h2'}
                onValueChange={(value) => updateProps('level', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">H1 - Main Title</SelectItem>
                  <SelectItem value="h2">H2 - Section Title</SelectItem>
                  <SelectItem value="h3">H3 - Subsection</SelectItem>
                  <SelectItem value="h4">H4 - Small Title</SelectItem>
                  <SelectItem value="h5">H5 - Subtitle</SelectItem>
                  <SelectItem value="h6">H6 - Caption</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="src">Image URL</Label>
              <Input
                id="src"
                value={element.props.src || ''}
                onChange={(e) => updateProps('src', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                value={element.props.alt || ''}
                onChange={(e) => updateProps('alt', e.target.value)}
                placeholder="Describe the image"
              />
            </div>
          </div>
        )

      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Button Text</Label>
              <Input
                id="text"
                value={element.props.text || ''}
                onChange={(e) => updateProps('text', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="variant">Button Style</Label>
              <Select
                value={element.props.variant || 'primary'}
                onValueChange={(value) => updateProps('variant', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="href">Link URL</Label>
              <Input
                id="href"
                value={element.props.href || ''}
                onChange={(e) => updateProps('href', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
        )

      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Main Title</Label>
              <Input
                id="title"
                value={element.props.title || ''}
                onChange={(e) => updateProps('title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={element.props.subtitle || ''}
                onChange={(e) => updateProps('subtitle', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={element.props.buttonText || ''}
                onChange={(e) => updateProps('buttonText', e.target.value)}
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <p>No content properties available for this element type.</p>
          </div>
        )
    }
  }

  const currentStyle = getCurrentStyle()

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Properties Panel */}
      <div className={`
        fixed lg:relative inset-y-0 right-0 z-50
        w-full sm:w-96 lg:w-80
        bg-card/95 backdrop-blur-md border-l border-border/50
        flex flex-col
        shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Properties</h3>
            <p className="text-sm text-muted-foreground capitalize">
              {element.type} Element
            </p>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Breakpoint Selector */}
      <div className="p-4 border-b border-border">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          Device Preview
        </Label>
        <div className="flex items-center space-x-1 mt-2 bg-muted/50 rounded-lg p-1 shadow-inner">
          <Button
            variant={activeBreakpoint === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveBreakpoint('desktop')}
            className={cn(
              "flex-1 transition-all duration-200",
              activeBreakpoint === 'desktop' && "shadow-md"
            )}
          >
            <Monitor className="h-3 w-3" />
          </Button>
          <Button
            variant={activeBreakpoint === 'tablet' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveBreakpoint('tablet')}
            className={cn(
              "flex-1 transition-all duration-200",
              activeBreakpoint === 'tablet' && "shadow-md"
            )}
          >
            <Tablet className="h-3 w-3" />
          </Button>
          <Button
            variant={activeBreakpoint === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveBreakpoint('mobile')}
            className={cn(
              "flex-1 transition-all duration-200",
              activeBreakpoint === 'mobile' && "shadow-md"
            )}
          >
            <Smartphone className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Properties Tabs */}
      <div className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-4 py-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content" className="text-xs">
                <Type className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Content</span>
              </TabsTrigger>
              <TabsTrigger value="style" className="text-xs">
                <Palette className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Style</span>
              </TabsTrigger>
              <TabsTrigger value="layout" className="text-xs">
                <Layout className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Layout</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 px-4">
            <TabsContent value="content" className="mt-0 space-y-4">
              {renderContentProperties()}
            </TabsContent>

            <TabsContent value="style" className="mt-0 space-y-4">
              <PropertyGroup title="Typography" icon={Type}>
                <div>
                  <Label>Font Size</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Slider
                      value={[parseInt(currentStyle.fontSize as string) || 16]}
                      onValueChange={([value]) => updateStyle('fontSize', `${value}px`)}
                      min={8}
                      max={72}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-12">
                      {parseInt(currentStyle.fontSize as string) || 16}px
                    </span>
                  </div>
                </div>

                <div>
                  <Label>Font Weight</Label>
                  <Select
                    value={currentStyle.fontWeight as string || 'normal'}
                    onValueChange={(value) => updateStyle('fontWeight', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="semibold">Semibold</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Text Color</Label>
                  <ColorPicker
                    value={currentStyle.color as string || '#000000'}
                    onChange={(color) => updateStyle('color', color)}
                  />
                </div>
              </PropertyGroup>

              <PropertyGroup title="Background" icon={Palette}>
                <div>
                  <Label>Background Color</Label>
                  <ColorPicker
                    value={currentStyle.backgroundColor as string || 'transparent'}
                    onChange={(color) => updateStyle('backgroundColor', color)}
                  />
                </div>
              </PropertyGroup>

              <PropertyGroup title="Border" icon={Layout}>
                <div>
                  <Label>Border Width</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Slider
                      value={[parseInt(currentStyle.borderWidth as string) || 0]}
                      onValueChange={([value]) => updateStyle('borderWidth', `${value}px`)}
                      min={0}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-12">
                      {parseInt(currentStyle.borderWidth as string) || 0}px
                    </span>
                  </div>
                </div>

                <div>
                  <Label>Border Color</Label>
                  <ColorPicker
                    value={currentStyle.borderColor as string || '#e5e7eb'}
                    onChange={(color) => updateStyle('borderColor', color)}
                  />
                </div>

                <div>
                  <Label>Border Radius</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Slider
                      value={[parseInt(currentStyle.borderRadius as string) || 0]}
                      onValueChange={([value]) => updateStyle('borderRadius', `${value}px`)}
                      min={0}
                      max={50}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-12">
                      {parseInt(currentStyle.borderRadius as string) || 0}px
                    </span>
                  </div>
                </div>
              </PropertyGroup>
            </TabsContent>

            <TabsContent value="layout" className="mt-0 space-y-4">
              <PropertyGroup title="Spacing" icon={Layout}>
                <SpacingControl
                  label="Padding"
                  value={currentStyle.padding as string || '0px'}
                  onChange={(value) => updateStyle('padding', value)}
                />
                <SpacingControl
                  label="Margin"
                  value={currentStyle.margin as string || '0px'}
                  onChange={(value) => updateStyle('margin', value)}
                />
              </PropertyGroup>

              <PropertyGroup title="Size" icon={Layout}>
                <div>
                  <Label>Width</Label>
                  <Input
                    value={currentStyle.width as string || 'auto'}
                    onChange={(e) => updateStyle('width', e.target.value)}
                    placeholder="auto, 100px, 50%"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Height</Label>
                  <Input
                    value={currentStyle.height as string || 'auto'}
                    onChange={(e) => updateStyle('height', e.target.value)}
                    placeholder="auto, 100px, 50vh"
                    className="mt-1"
                  />
                </div>
              </PropertyGroup>

              <PropertyGroup title="Position" icon={Layout}>
                <div>
                  <Label>Display</Label>
                  <Select
                    value={currentStyle.display as string || 'block'}
                    onValueChange={(value) => updateStyle('display', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="block">Block</SelectItem>
                      <SelectItem value="inline">Inline</SelectItem>
                      <SelectItem value="inline-block">Inline Block</SelectItem>
                      <SelectItem value="flex">Flex</SelectItem>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="none">Hidden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Text Align</Label>
                  <Select
                    value={currentStyle.textAlign as string || 'left'}
                    onValueChange={(value) => updateStyle('textAlign', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="justify">Justify</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </PropertyGroup>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>

      {/* AI Assistant */}
      <div className="p-4 border-t border-border">
        <Button variant="outline" size="sm" className="w-full">
          <Sparkles className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">AI Optimize</span>
          <span className="sm:hidden">Optimize</span>
        </Button>
      </div>
      </div>
    </>
  )
}
