"use client"

import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react'
import { FixedSizeList as List } from 'react-window'
import { debounce } from 'lodash'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { cn } from '../../lib/utils'
import { ComponentNode, PageSchema } from '../../lib/schema'
import { 
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  MoreHorizontal,
  Plus,
  Save,
  Undo,
  Redo,
  Settings,
  Palette,
  Layout,
  Type,
  Image,
  Video,
  Music,
  MapPin,
  Calendar,
  Users,
  Star,
  Heart,
  MessageCircle,
  Mail,
  Phone,
  Globe,
  Download,
  Upload,
  Code,
  Database,
  BarChart,
  PieChart,
  TrendingUp,
  Zap,
  Shield,
  Folder,
  Tag
} from '@/lib/icons'

// Lazy load heavy components
const EditorCanvas = lazy(() => import('./EditorCanvas'))
const ComponentPalette = lazy(() => import('./ComponentPalette'))
const LayersPanel = lazy(() => import('./LayersPanel'))
const ResponsiveDesign = lazy(() => import('./ResponsiveDesign'))
const RTLSupport = lazy(() => import('./RTLSupport'))
const SaveTemplateDialog = lazy(() => import('./SaveTemplateDialog'))

interface OptimizedEditorProps {
  components: ComponentNode[]
  onComponentsChange: (components: ComponentNode[]) => void
  onComponentSelect: (component: ComponentNode | null) => void
  selectedComponent: ComponentNode | null
  pageSchema: PageSchema
  onPageSchemaChange: (schema: PageSchema) => void
}

// Virtualized component list item
const ComponentListItem: React.FC<{
  index: number
  style: React.CSSProperties
  data: {
    components: ComponentNode[]
    selectedComponent: ComponentNode | null
    onComponentSelect: (component: ComponentNode | null) => void
    onComponentUpdate: (component: ComponentNode) => void
  }
}> = ({ index, style, data }) => {
  const { components, selectedComponent, onComponentSelect, onComponentUpdate } = data
  const component = components[index]
  
  if (!component) return null
  
  const isSelected = selectedComponent?.id === component.id
  
  const handleClick = useCallback(() => {
    onComponentSelect(component)
  }, [component, onComponentSelect])
  
  const handleToggleVisibility = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onComponentUpdate({
      ...component,
      visible: !component.visible
    })
  }, [component, onComponentUpdate])
  
  const handleToggleLock = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onComponentUpdate({
      ...component,
      locked: !component.locked
    })
  }, [component, onComponentUpdate])
  
  return (
    <div
      style={style}
      className={cn(
        "flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer",
        isSelected && "bg-blue-50 border border-blue-200"
      )}
      onClick={handleClick}
    >
      <div className="flex-shrink-0">
        <div className="w-2 h-2 bg-gray-400 rounded-full" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          {component.props.title || component.props.name || component.type}
        </div>
        <div className="text-xs text-gray-500">
          {component.type}
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={handleToggleVisibility}
        >
          {component.visible ? (
            <Eye className="w-3 h-3" />
          ) : (
            <EyeOff className="w-3 h-3" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={handleToggleLock}
        >
          {component.locked ? (
            <Lock className="w-3 h-3" />
          ) : (
            <Unlock className="w-3 h-3" />
          )}
        </Button>
      </div>
    </div>
  )
}

// Debounced search hook
const useDebouncedSearch = (value: string, delay: number = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  
  return debouncedValue
}

// Optimized editor component
const OptimizedEditor: React.FC<OptimizedEditorProps> = ({
  components,
  onComponentsChange,
  onComponentSelect,
  selectedComponent,
  pageSchema,
  onPageSchemaChange
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [showLayersPanel, setShowLayersPanel] = useState(true)
  const [showComponentPalette, setShowComponentPalette] = useState(true)
  const [showResponsiveDesign, setShowResponsiveDesign] = useState(false)
  const [showRTLSupport, setShowRTLSupport] = useState(false)
  const [showSaveTemplate, setShowSaveTemplate] = useState(false)
  
  // Debounced search
  const debouncedSearchQuery = useDebouncedSearch(searchQuery)
  
  // Memoized filtered components
  const filteredComponents = useMemo(() => {
    if (!debouncedSearchQuery) return components
    
    return components.filter(component =>
      component.type.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      (component.props.title || '').toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      (component.props.name || '').toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    )
  }, [components, debouncedSearchQuery])
  
  // Memoized device dimensions
  const deviceDimensions = useMemo(() => {
    switch (deviceMode) {
      case 'tablet':
        return { width: 768, height: 1024 }
      case 'mobile':
        return { width: 375, height: 667 }
      default:
        return { width: 1200, height: 800 }
    }
  }, [deviceMode])
  
  // Debounced component update
  const debouncedComponentUpdate = useCallback(
    debounce((component: ComponentNode) => {
      onComponentsChange(
        components.map(c => c.id === component.id ? component : c)
      )
    }, 100),
    [components, onComponentsChange]
  )
  
  // Debounced page schema update
  const debouncedPageSchemaUpdate = useCallback(
    debounce((schema: PageSchema) => {
      onPageSchemaChange(schema)
    }, 200),
    [onPageSchemaChange]
  )
  
  // Handle component drag with RAF
  const handleComponentDrag = useCallback((component: ComponentNode, newPosition: { x: number; y: number }) => {
    requestAnimationFrame(() => {
      const updatedComponent = {
        ...component,
        layout: {
          ...component.layout,
          [deviceMode === 'desktop' ? 'default' : deviceMode]: {
            ...(deviceMode === 'desktop' ? component.layout.default : component.layout[deviceMode]),
            x: newPosition.x,
            y: newPosition.y
          }
        }
      }
      debouncedComponentUpdate(updatedComponent)
    })
  }, [deviceMode, debouncedComponentUpdate])
  
  // Handle component resize with RAF
  const handleComponentResize = useCallback((component: ComponentNode, newSize: { width: number; height: number }) => {
    requestAnimationFrame(() => {
      const updatedComponent = {
        ...component,
        layout: {
          ...component.layout,
          [deviceMode === 'desktop' ? 'default' : deviceMode]: {
            ...(deviceMode === 'desktop' ? component.layout.default : component.layout[deviceMode]),
            width: newSize.width,
            height: newSize.height
          }
        }
      }
      debouncedComponentUpdate(updatedComponent)
    })
  }, [deviceMode, debouncedComponentUpdate])
  
  // Handle component property change with RAF
  const handleComponentPropertyChange = useCallback((component: ComponentNode, property: string, value: any) => {
    requestAnimationFrame(() => {
      const updatedComponent = {
        ...component,
        props: {
          ...component.props,
          [property]: value
        }
      }
      debouncedComponentUpdate(updatedComponent)
    })
  }, [debouncedComponentUpdate])
  
  // Handle device mode change
  const handleDeviceModeChange = useCallback((mode: 'desktop' | 'tablet' | 'mobile') => {
    setDeviceMode(mode)
  }, [])
  
  // Handle save template
  const handleSaveTemplate = useCallback((template: any) => {
    console.log('Saving template:', template)
    setShowSaveTemplate(false)
  }, [])
  
  // Memoized component list data
  const componentListData = useMemo(() => ({
    components: filteredComponents,
    selectedComponent,
    onComponentSelect,
    onComponentUpdate: debouncedComponentUpdate
  }), [filteredComponents, selectedComponent, onComponentSelect, debouncedComponentUpdate])
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Component Palette */}
      {showComponentPalette && (
        <Suspense fallback={<div className="w-80 bg-white border-r border-gray-200 flex items-center justify-center">Loading...</div>}>
          <ComponentPalette
            onComponentDragStart={(component) => {
              // Handle component drag start
              console.log('Component drag start:', component)
            }}
            onSaveAsTemplate={() => setShowSaveTemplate(true)}
            pageSchema={pageSchema}
          />
        </Suspense>
      )}
      
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComponentPalette(!showComponentPalette)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLayersPanel(!showLayersPanel)}
            >
              <Layout className="w-4 h-4 mr-2" />
              Layers
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResponsiveDesign(!showResponsiveDesign)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Responsive
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRTLSupport(!showRTLSupport)}
            >
              <Type className="w-4 h-4 mr-2" />
              RTL
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {deviceMode.toUpperCase()}
            </Badge>
            <Badge variant="outline">
              {components.length} components
            </Badge>
          </div>
        </div>
        
        {/* Editor Content */}
        <div className="flex-1 flex">
          {/* Canvas Area */}
          <div className="flex-1">
            <Suspense fallback={<div className="h-full bg-white flex items-center justify-center">Loading canvas...</div>}>
              <EditorCanvas
                components={components}
                onComponentsChange={onComponentsChange}
                onComponentSelect={onComponentSelect}
                selectedComponent={selectedComponent}
                deviceMode={deviceMode}
                deviceDimensions={deviceDimensions}
                pageSchema={pageSchema}
                onPageSchemaChange={debouncedPageSchemaUpdate}
              />
            </Suspense>
          </div>
          
          {/* Right Sidebar - Layers Panel */}
          {showLayersPanel && (
            <Suspense fallback={<div className="w-80 bg-white border-l border-gray-200 flex items-center justify-center">Loading...</div>}>
              <LayersPanel
                components={components}
                selectedComponent={selectedComponent}
                onComponentSelect={onComponentSelect}
                onComponentUpdate={debouncedComponentUpdate}
                onComponentDelete={(componentId) => {
                  onComponentsChange(components.filter(c => c.id !== componentId))
                }}
                onComponentDuplicate={(component) => {
                  const newComponent = {
                    ...component,
                    id: `${component.id}_copy_${Date.now()}`
                  }
                  onComponentsChange([...components, newComponent])
                }}
                pageSchema={pageSchema}
                deviceMode={deviceMode}
              />
            </Suspense>
          )}
        </div>
      </div>
      
      {/* Responsive Design Panel */}
      {showResponsiveDesign && (
        <Suspense fallback={<div className="w-80 bg-white border-l border-gray-200 flex items-center justify-center">Loading...</div>}>
          <ResponsiveDesign
            components={components}
            selectedComponent={selectedComponent}
            onComponentUpdate={debouncedComponentUpdate}
            onComponentsUpdate={onComponentsChange}
            pageSchema={pageSchema}
            deviceMode={deviceMode}
            onDeviceModeChange={handleDeviceModeChange}
          />
        </Suspense>
      )}
      
      {/* RTL Support Panel */}
      {showRTLSupport && (
        <Suspense fallback={<div className="w-80 bg-white border-l border-gray-200 flex items-center justify-center">Loading...</div>}>
          <RTLSupport
            components={components}
            selectedComponent={selectedComponent}
            onComponentUpdate={debouncedComponentUpdate}
            onComponentsUpdate={onComponentsChange}
            pageSchema={pageSchema}
            onPageSchemaUpdate={debouncedPageSchemaUpdate}
          />
        </Suspense>
      )}
      
      {/* Save Template Dialog */}
      {showSaveTemplate && (
        <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">Loading...</div>}>
          <SaveTemplateDialog
            components={components}
            pageSchema={pageSchema}
            onSaveTemplate={handleSaveTemplate}
            onClose={() => setShowSaveTemplate(false)}
          />
        </Suspense>
      )}
    </div>
  )
}

export default OptimizedEditor
