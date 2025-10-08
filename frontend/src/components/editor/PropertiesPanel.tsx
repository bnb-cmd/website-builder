import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Switch } from '../ui/switch'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'
import { Slider } from '../ui/slider'
import { 
  Type, 
  Palette, 
  Layout, 
  Settings,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Image as ImageIcon,
  Upload
} from 'lucide-react'
import ImagePicker from './ImagePicker'

interface PageComponent {
  id: string
  type: string
  props: Record<string, any>
  children?: PageComponent[]
  style?: Record<string, any>
  position?: { x: number; y: number }
  locked?: boolean
  visible?: boolean
}

interface PropertiesPanelProps {
  selectedComponent: PageComponent | null
  onComponentUpdate: (component: PageComponent) => void
  onComponentDelete: () => void
  onComponentDuplicate: () => void
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedComponent,
  onComponentUpdate,
  onComponentDelete,
  onComponentDuplicate
}) => {
  const [imagePickerOpen, setImagePickerOpen] = useState(false)
  const [imagePickerCategory, setImagePickerCategory] = useState<string | undefined>()
  const [imagePickerTitle, setImagePickerTitle] = useState('Choose Image')
  if (!selectedComponent) {
    return (
      <div className="w-80 bg-background border-l">
        <div className="p-6 text-center">
          <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No Selection</h3>
          <p className="text-sm text-muted-foreground">
            Select a component to edit its properties
          </p>
        </div>
      </div>
    )
  }

  const updateProp = (key: string, value: any) => {
    onComponentUpdate({
      ...selectedComponent,
      props: {
        ...selectedComponent.props,
        [key]: value
      }
    })
  }

  const updateStyle = (key: string, value: any) => {
    onComponentUpdate({
      ...selectedComponent,
      style: {
        ...selectedComponent.style,
        [key]: value
      }
    })
  }

  const updatePosition = (x: number, y: number) => {
    onComponentUpdate({
      ...selectedComponent,
      position: { x, y }
    })
  }

  const toggleVisibility = () => {
    onComponentUpdate({
      ...selectedComponent,
      visible: !selectedComponent.visible
    })
  }

  const toggleLock = () => {
    onComponentUpdate({
      ...selectedComponent,
      locked: !selectedComponent.locked
    })
  }

  const openImagePicker = (category?: string, title?: string) => {
    setImagePickerCategory(category)
    setImagePickerTitle(title || 'Choose Image')
    setImagePickerOpen(true)
  }

  const handleImageSelect = (image: any) => {
    // Determine which property to update based on component type
    if (selectedComponent.type === 'hero') {
      updateProp('backgroundImage', image.url)
    } else if (selectedComponent.type === 'image') {
      updateProp('src', image.url)
      updateProp('alt', image.name)
    } else if (selectedComponent.type === 'about-section') {
      updateProp('imageUrl', image.url)
    } else {
      // Default to backgroundImage for other components
      updateProp('backgroundImage', image.url)
    }
    setImagePickerOpen(false)
  }

  const renderComponentSpecificProps = () => {
    switch (selectedComponent.type) {
      case 'heading':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="heading-text">Text</Label>
              <Input
                id="heading-text"
                value={selectedComponent.props.text || ''}
                onChange={(e) => updateProp('text', e.target.value)}
                placeholder="Enter heading text"
              />
            </div>
            
            <div>
              <Label htmlFor="heading-level">Heading Level</Label>
              <Select
                value={selectedComponent.props.level?.toString() || '2'}
                onValueChange={(value) => updateProp('level', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">H1 - Main Title</SelectItem>
                  <SelectItem value="2">H2 - Section Title</SelectItem>
                  <SelectItem value="3">H3 - Subsection</SelectItem>
                  <SelectItem value="4">H4 - Minor Heading</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text-content">Text Content</Label>
              <Textarea
                id="text-content"
                value={selectedComponent.props.text || ''}
                onChange={(e) => updateProp('text', e.target.value)}
                placeholder="Enter your text content"
                rows={4}
              />
            </div>
          </div>
        )

      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="button-text">Button Text</Label>
              <Input
                id="button-text"
                value={selectedComponent.props.text || ''}
                onChange={(e) => updateProp('text', e.target.value)}
                placeholder="Enter button text"
              />
            </div>
            
            <div>
              <Label htmlFor="button-variant">Style</Label>
              <Select
                value={selectedComponent.props.variant || 'default'}
                onValueChange={(value) => updateProp('variant', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="button-link">Link URL</Label>
              <Input
                id="button-link"
                value={selectedComponent.props.href || ''}
                onChange={(e) => updateProp('href', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
        )

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-src">Image URL</Label>
              <div className="flex gap-2">
                <Input
                  id="image-src"
                  value={selectedComponent.props.src || ''}
                  onChange={(e) => updateProp('src', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openImagePicker('hero', 'Choose Image')}
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="image-alt">Alt Text</Label>
              <Input
                id="image-alt"
                value={selectedComponent.props.alt || ''}
                onChange={(e) => updateProp('alt', e.target.value)}
                placeholder="Describe the image"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="image-width">Width</Label>
                <Input
                  id="image-width"
                  type="number"
                  value={selectedComponent.props.width || 300}
                  onChange={(e) => updateProp('width', parseInt(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="image-height">Height</Label>
                <Input
                  id="image-height"
                  type="number"
                  value={selectedComponent.props.height || 200}
                  onChange={(e) => updateProp('height', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        )

      case 'hero-section':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="hero-title">Title</Label>
              <Input
                id="hero-title"
                value={selectedComponent.props.title || ''}
                onChange={(e) => updateProp('title', e.target.value)}
                placeholder="Enter hero title"
              />
            </div>
            
            <div>
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Textarea
                id="hero-subtitle"
                value={selectedComponent.props.subtitle || ''}
                onChange={(e) => updateProp('subtitle', e.target.value)}
                placeholder="Enter hero subtitle"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="hero-button">Button Text</Label>
              <Input
                id="hero-button"
                value={selectedComponent.props.buttonText || ''}
                onChange={(e) => updateProp('buttonText', e.target.value)}
                placeholder="Enter button text"
              />
            </div>
            
            <div>
              <Label htmlFor="hero-background">Background Image</Label>
              <div className="flex gap-2">
                <Input
                  id="hero-background"
                  value={selectedComponent.props.backgroundImage || ''}
                  onChange={(e) => updateProp('backgroundImage', e.target.value)}
                  placeholder="https://example.com/background.jpg"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openImagePicker('hero', 'Choose Hero Background')}
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              No specific properties available for this component
            </p>
          </div>
        )
    }
  }

  return (
    <div className="w-80 bg-background border-l">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Type className="w-4 h-4" />
            <h2 className="font-semibold">Properties</h2>
          </div>
          <Badge variant="outline">{selectedComponent.type}</Badge>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4 space-y-6">
          {/* Component Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleVisibility}
                  className="flex items-center gap-2"
                >
                  {selectedComponent.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {selectedComponent.visible ? 'Hide' : 'Show'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleLock}
                  className="flex items-center gap-2"
                >
                  {selectedComponent.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  {selectedComponent.locked ? 'Unlock' : 'Lock'}
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onComponentDuplicate}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-3 h-3" />
                  Duplicate
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onComponentDelete}
                  className="flex items-center gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Position */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Layout className="w-4 h-4" />
                Position
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pos-x">X Position</Label>
                  <Input
                    id="pos-x"
                    type="number"
                    value={selectedComponent.position?.x || 0}
                    onChange={(e) => updatePosition(
                      parseInt(e.target.value), 
                      selectedComponent.position?.y || 0
                    )}
                  />
                </div>
                
                <div>
                  <Label htmlFor="pos-y">Y Position</Label>
                  <Input
                    id="pos-y"
                    type="number"
                    value={selectedComponent.position?.y || 0}
                    onChange={(e) => updatePosition(
                      selectedComponent.position?.x || 0,
                      parseInt(e.target.value)
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Component Properties */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderComponentSpecificProps()}
            </CardContent>
          </Card>

          {/* Styling */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Styling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="text-color">Text Color</Label>
                <Input
                  id="text-color"
                  type="color"
                  value={selectedComponent.style?.color || '#000000'}
                  onChange={(e) => updateStyle('color', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="bg-color">Background Color</Label>
                <Input
                  id="bg-color"
                  type="color"
                  value={selectedComponent.style?.backgroundColor || '#ffffff'}
                  onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="opacity">Opacity</Label>
                <Slider
                  value={[selectedComponent.style?.opacity || 1]}
                  onValueChange={(value) => updateStyle('opacity', value[0])}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round((selectedComponent.style?.opacity || 1) * 100)}%
                </div>
              </div>
              
              <div>
                <Label htmlFor="border-radius">Border Radius</Label>
                <Input
                  id="border-radius"
                  type="number"
                  value={parseInt(selectedComponent.style?.borderRadius) || 0}
                  onChange={(e) => updateStyle('borderRadius', `${e.target.value}px`)}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
      
      {/* Image Picker Modal */}
      <ImagePicker
        isOpen={imagePickerOpen}
        onClose={() => setImagePickerOpen(false)}
        onSelect={handleImageSelect}
        category={imagePickerCategory}
        title={imagePickerTitle}
      />
    </div>
  )
}