"use client";
import React, { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { useRouter } from '../lib/router'
import { useWebsiteStore, useEditorStore } from '../lib/store'
import { ComponentPalette } from '../components/editor/ComponentPalette'
import { EditorCanvas } from '../components/editor/EditorCanvas'
import { PropertiesPanel } from '../components/editor/PropertiesPanel'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Smartphone, 
  Tablet, 
  Monitor,
  Undo,
  Redo,
  Settings,
  Share,
  Rocket
} from 'lucide-react'

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

type DeviceMode = 'desktop' | 'tablet' | 'mobile'

export const EditorPage: React.FC = () => {
  const { navigate, params } = useRouter()
  const { currentWebsite, updateWebsite } = useWebsiteStore()
  const { isPreviewMode, togglePreviewMode } = useEditorStore()
  
  const [components, setComponents] = useState<PageComponent[]>([])
  const [selectedComponent, setSelectedComponent] = useState<PageComponent | null>(null)
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const websiteId = params.id

  useEffect(() => {
    if (websiteId && currentWebsite?.id !== websiteId) {
      // In a real app, you'd fetch the website data here
      console.log('Loading website:', websiteId)
    }
  }, [websiteId, currentWebsite])

  useEffect(() => {
    setHasUnsavedChanges(true)
  }, [components])

  const handleSave = async () => {
    try {
      if (currentWebsite) {
        const updatedWebsite = {
          ...currentWebsite,
          pages: [
            {
              id: 'home',
              name: 'Home',
              path: '/',
              components,
              seo: {
                title: 'Home',
                description: '',
                keywords: []
              }
            }
          ]
        }
        
        await updateWebsite(currentWebsite.id, updatedWebsite)
        setHasUnsavedChanges(false)
      }
    } catch (error) {
      console.error('Failed to save website:', error)
    }
  }

  const handlePublish = async () => {
    await handleSave()
    if (currentWebsite) {
      await updateWebsite(currentWebsite.id, { status: 'published' })
    }
  }

  const handleComponentDragStart = (component: any) => {
    console.log('Dragging component:', component)
  }

  const handleComponentUpdate = (updatedComponent: PageComponent) => {
    setComponents(prev => 
      prev.map(comp => 
        comp.id === updatedComponent.id ? updatedComponent : comp
      )
    )
    setSelectedComponent(updatedComponent)
  }

  const handleComponentDelete = () => {
    if (selectedComponent) {
      setComponents(prev => prev.filter(comp => comp.id !== selectedComponent.id))
      setSelectedComponent(null)
    }
  }

  const handleComponentDuplicate = () => {
    if (selectedComponent) {
      const duplicated: PageComponent = {
        ...selectedComponent,
        id: `${selectedComponent.type}_${Date.now()}`,
        position: selectedComponent.position ? 
          { x: selectedComponent.position.x + 20, y: selectedComponent.position.y + 20 } : 
          undefined
      }
      setComponents(prev => [...prev, duplicated])
      setSelectedComponent(duplicated)
    }
  }

  const getDeviceClass = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'max-w-sm mx-auto'
      case 'tablet':
        return 'max-w-2xl mx-auto'
      default:
        return 'w-full'
    }
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Top Toolbar */}
      <div className="border-b bg-background">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard/websites')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Websites
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <div>
              <h1 className="font-semibold">
                {currentWebsite?.name || 'Untitled Website'}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Last saved 2 minutes ago</span>
                {hasUnsavedChanges && (
                  <Badge variant="secondary">Unsaved changes</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Device Mode Toggle */}
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={deviceMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceMode('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={deviceMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceMode('tablet')}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={deviceMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceMode('mobile')}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Action Buttons */}
            <Button variant="ghost" size="sm" disabled>
              <Undo className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm" disabled>
              <Redo className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <Button 
              variant="ghost" 
              size="sm"
              onClick={togglePreviewMode}
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>

            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>

            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>

            <Button size="sm" onClick={handlePublish}>
              <Rocket className="w-4 h-4 mr-2" />
              Publish
            </Button>

            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Component Palette */}
        {!isPreviewMode && (
          <ComponentPalette onDragStart={handleComponentDragStart} />
        )}

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div className={`flex-1 ${getDeviceClass()}`}>
            <EditorCanvas
              components={components}
              onComponentsChange={setComponents}
              onComponentSelect={setSelectedComponent}
              selectedComponent={selectedComponent}
            />
          </div>
        </div>

        {/* Properties Panel */}
        {!isPreviewMode && (
          <PropertiesPanel
            selectedComponent={selectedComponent}
            onComponentUpdate={handleComponentUpdate}
            onComponentDelete={handleComponentDelete}
            onComponentDuplicate={handleComponentDuplicate}
          />
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="border-t bg-muted/50 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>{components.length} component{components.length === 1 ? '' : 's'}</span>
            {selectedComponent && (
              <span>Selected: {selectedComponent.type}</span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <span>WebBuilder Editor</span>
            <Badge variant="outline" className="text-xs">
              {isPreviewMode ? 'Preview Mode' : 'Edit Mode'}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}