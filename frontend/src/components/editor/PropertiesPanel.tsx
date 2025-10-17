import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'
import { Slider } from '../ui/slider'
import { cn } from '../../lib/utils'
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles
} from '@/lib/icons'
import ImagePicker from './ImagePicker'
import { ComponentNode } from '../../lib/schema'
import { PropertyControls } from './PropertyControls'
import { PresetSelector } from './controls/PresetSelector'
import { getComponentConfig, getEditableFields } from '../website/registry'
import { getPropertyGroups } from '../../lib/property-validation'
import { applyPreset } from '../../lib/property-presets'

interface PropertiesPanelProps {
  selectedComponent: ComponentNode | null
  onComponentUpdate: (component: ComponentNode) => void
  onComponentDelete: () => void
  onComponentDuplicate: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedComponent,
  onComponentUpdate,
  onComponentDelete,
  onComponentDuplicate,
  collapsed = false,
  onToggleCollapse
}) => {
  const [imagePickerOpen, setImagePickerOpen] = useState(false)
  const [imagePickerCategory, setImagePickerCategory] = useState<string | undefined>()
  const [imagePickerTitle, setImagePickerTitle] = useState('Choose Image')
  const [searchQuery, setSearchQuery] = useState('')
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())
  if (!selectedComponent) {
    return (
      <div className={cn(
        "bg-background border-l transition-all duration-300",
        collapsed ? "w-16" : "w-80"
      )}>
        <div className="p-6 text-center">
          <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          {!collapsed && (
            <>
              <h3 className="font-semibold mb-2">No Selection</h3>
              <p className="text-sm text-muted-foreground">
                Select a component to edit its properties
              </p>
            </>
          )}
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="mt-4 h-8 w-8 p-0"
              title={collapsed ? "Expand properties" : "Collapse properties"}
            >
              {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          )}
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
      styles: {
        ...selectedComponent.styles,
        default: {
          ...selectedComponent.styles.default,
          [key]: value
        }
      }
    })
  }

  const updatePosition = (x: number, y: number) => {
    onComponentUpdate({
      ...selectedComponent,
      layout: {
        ...selectedComponent.layout,
        default: {
          ...selectedComponent.layout.default,
          x,
          y
        }
      }
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

  // Get component configuration
  const componentConfig = getComponentConfig(selectedComponent.type)
  const editableFields = getEditableFields(selectedComponent.type)
  
  // Get property groups
  const propertyGroups = getPropertyGroups(editableFields, componentConfig?.propertyConfig)
  
  // Filter properties based on search
  const filteredGroups = Object.entries(propertyGroups).reduce((acc, [groupName, fields]) => {
    const filteredFields = fields.filter(field => 
      field.toLowerCase().includes(searchQuery.toLowerCase()) ||
      componentConfig?.propertyConfig?.[field]?.label?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    if (filteredFields.length > 0) {
      acc[groupName] = filteredFields
    }
    return acc
  }, {} as Record<string, string[]>)

  const toggleGroup = (groupName: string) => {
    const newCollapsed = new Set(collapsedGroups)
    if (newCollapsed.has(groupName)) {
      newCollapsed.delete(groupName)
    } else {
      newCollapsed.add(groupName)
    }
    setCollapsedGroups(newCollapsed)
  }

  const handlePresetApply = (preset: any) => {
    const updatedProps = applyPreset(selectedComponent.props, preset)
    onComponentUpdate({
      ...selectedComponent,
      props: updatedProps
    })
  }

  const renderPropertyGroup = (groupName: string, fields: string[]) => {
    const isCollapsed = collapsedGroups.has(groupName)
    
    return (
      <Card key={groupName}>
        <CardHeader 
          className="pb-3 cursor-pointer"
          onClick={() => toggleGroup(groupName)}
        >
          <CardTitle className="text-sm flex items-center justify-between">
            <span className="flex items-center gap-2">
              {groupName === 'Content' && <Type className="w-4 h-4" />}
              {groupName === 'Behavior' && <Settings className="w-4 h-4" />}
              {groupName === 'Layout' && <Layout className="w-4 h-4" />}
              {groupName === 'Style' && <Palette className="w-4 h-4" />}
              {groupName === 'Advanced' && <Settings className="w-4 h-4" />}
              {groupName}
            </span>
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </CardTitle>
        </CardHeader>
        {!isCollapsed && (
          <CardContent className="space-y-4">
            {fields.map(field => (
              <PropertyControls
                key={field}
                value={selectedComponent.props[field]}
                onChange={(value) => updateProp(field, value)}
                fieldName={field}
                fieldConfig={componentConfig?.propertyConfig?.[field]}
                componentProps={selectedComponent.props}
                onImagePickerOpen={openImagePicker}
              />
            ))}
          </CardContent>
        )}
      </Card>
    )
  }

  return (
    <div className={cn(
      "bg-background border-l transition-all duration-300",
      collapsed ? "w-16" : "w-80"
    )}>
      <div className="p-4 border-b">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Type className="w-4 h-4" />
              <h2 className="font-semibold">Properties</h2>
            </div>
            <Badge variant="outline">{selectedComponent.type}</Badge>
            {onToggleCollapse && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                className="h-8 w-8 p-0"
                title={collapsed ? "Expand properties" : "Collapse properties"}
              >
                {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <Settings className="w-6 h-6 text-blue-600" />
            {onToggleCollapse && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                className="h-6 w-6 p-0"
                title={collapsed ? "Expand properties" : "Collapse properties"}
              >
                {collapsed ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </Button>
            )}
          </div>
        )}
      </div>
      
      {!collapsed && (
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="p-4 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

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

            {/* Presets */}
            <PresetSelector
              componentType={selectedComponent.type}
              currentProps={selectedComponent.props}
              onApplyPreset={handlePresetApply}
            />

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
                      value={selectedComponent.layout?.default?.x || 0}
                      onChange={(e) => updatePosition(
                        parseInt(e.target.value), 
                        selectedComponent.layout?.default?.y || 0
                      )}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="pos-y">Y Position</Label>
                    <Input
                      id="pos-y"
                      type="number"
                      value={selectedComponent.layout?.default?.y || 0}
                      onChange={(e) => updatePosition(
                        selectedComponent.layout?.default?.x || 0,
                        parseInt(e.target.value)
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Component Properties */}
            {Object.entries(filteredGroups).map(([groupName, fields]) => 
              renderPropertyGroup(groupName, fields)
            )}

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
                    value={selectedComponent.styles?.default?.color || '#000000'}
                    onChange={(e) => updateStyle('color', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="bg-color">Background Color</Label>
                  <Input
                    id="bg-color"
                    type="color"
                    value={selectedComponent.styles?.default?.backgroundColor || '#ffffff'}
                    onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="opacity">Opacity</Label>
                  <Slider
                    value={[selectedComponent.styles?.default?.opacity || 1]}
                    onValueChange={(value) => updateStyle('opacity', value[0])}
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {Math.round((selectedComponent.styles?.default?.opacity || 1) * 100)}%
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="border-radius">Border Radius</Label>
                  <Input
                    id="border-radius"
                    type="number"
                    value={parseInt(selectedComponent.styles?.default?.borderRadius?.toString() || '0') || 0}
                    onChange={(e) => updateStyle('borderRadius', `${e.target.value}px`)}
                    placeholder="0"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      )}
      
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