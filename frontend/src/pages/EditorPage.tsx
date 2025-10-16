"use client";

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { useRouter } from '../lib/router'
import { useWebsiteStore, useEditorStore } from '../lib/store'
import { ComponentPalette } from '../components/editor/ComponentPalette'
import EditorCanvas from '../components/editor/EditorCanvas'
import { PropertiesPanel } from '../components/editor/PropertiesPanel'
import { ComponentMetadata } from '@/lib/component-config'
import { ComponentNode, PageSchema } from '@/lib/schema'
import { apiHelpers } from '../lib/api'
// Import website components to ensure they get registered
import '../components/website'
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

// Remove PageComponent interface - use ComponentNode instead

type DeviceMode = 'desktop' | 'tablet' | 'mobile'

const EditorPage: React.FC = () => {
  const { navigate, params, searchParams } = useRouter()
  const { currentWebsite, updateWebsite, createWebsite } = useWebsiteStore()
  const { isPreviewMode, togglePreviewMode } = useEditorStore()
  
  const [components, setComponents] = useState<ComponentNode[]>([])
  const [selectedComponent, setSelectedComponent] = useState<ComponentNode | null>(null)
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false)
  const [templateName, setTemplateName] = useState<string>('')
  
  // Initialize pageSchema with default values
  const [pageSchema, setPageSchema] = useState<PageSchema>({
    id: 'home',
    name: 'Home',
    slug: '/',
    schemaVersion: 1,
    components: [],
    settings: {
      language: 'ENGLISH',
      direction: 'ltr',
      theme: 'light'
    },
    responsive: {
      breakpoints: {
        tablet: 768,
        mobile: 480
      },
      defaultDevice: 'desktop'
    },
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: 'user',
      version: 1
    },
    publishing: {
      status: 'draft'
    }
  })

  const websiteId = params.id
  const templateId = searchParams.get('template')

  // Sync components with pageSchema
  useEffect(() => {
    setPageSchema(prev => ({
      ...prev,
      components: components
    }))
  }, [components])

  // Initialize template when templateId is provided
  useEffect(() => {
    const initializeTemplate = async () => {
      if (templateId && !websiteId) {
        setIsLoadingTemplate(true)
        try {
          console.log('🔧 Initializing template:', templateId)
          
          // Fetch template data
          const templateData = await apiHelpers.getTemplate(templateId)
          console.log('🔧 Template data:', templateData)
          
          // Extract template from response - handle both old and new response formats
          const template = templateData.success ? templateData.data : (templateData.template || templateData)
          
          if (template.elements && template.elements.length > 0) {
            // Convert template elements to ComponentNode format
            const templateComponents: ComponentNode[] = template.elements.map((element: any, index: number) => ({
              id: element.id || `${element.type}-${index}`,
              type: element.type,
              props: element.props || {},
              layout: {
                default: {
                  x: 0,
                  y: index * 100,
                  width: element.width || 200,
                  height: element.height || 100,
                  zIndex: 1
                }
              },
              styles: {
                default: element.style || {}
              },
              locked: element.locked || false,
              visible: element.visible !== false,
              children: element.children?.map((child: any, childIndex: number) => ({
                id: child.id || `${child.type}-${childIndex}`,
                type: child.type,
                props: child.props || {},
                layout: {
                  default: {
                    x: child.position?.x || 0,
                    y: child.position?.y || 0,
                    width: child.width || 200,
                    height: child.height || 100,
                    zIndex: 1
                  }
                },
                styles: {
                  default: child.style || {}
                },
                locked: child.locked || false,
                visible: child.visible !== false
              })) || []
            }))
            
            console.log('🔧 Converted template components:', templateComponents)
            setComponents(templateComponents)
            setTemplateName(template.name || 'Template')
            
            // Create website record with template data
            const newWebsite = await createWebsite({
              name: `${template.name} Website`,
              template: templateId,
              thumbnail: template.thumbnail,
              pages: [{
                  id: 'home',
                  name: 'Home',
                  path: '/',
                  components: templateComponents,
                  seo: {
                    title: template.name,
                    description: template.description,
                    keywords: template.tags || []
                }
              }],
            })
            
            console.log('🔧 Created website:', newWebsite)
            
            // Navigate to the new website editor
            navigate(`/dashboard/websites/${newWebsite.id}/edit`)
          } else {
            console.warn('⚠️ Template has no elements:', template)
          }
        } catch (error) {
          console.error('❌ Failed to initialize template:', error)
        } finally {
          setIsLoadingTemplate(false)
        }
      }
    }

    initializeTemplate()
  }, [templateId, websiteId, createWebsite, navigate])

  useEffect(() => {
    if (websiteId && currentWebsite?.id !== websiteId) {
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
    console.log('Publishing website:', currentWebsite?.name)
    // Implement publish logic here
  }

  const handleComponentDragStart = (component: ComponentMetadata) => {
    console.log('EditorPage: Dragging component:', component.config.name)
  }

  const handleSaveAsTemplate = (components: ComponentNode[]) => {
    // TODO: Implement save as template functionality
    console.log('Save as template:', components)
  }

  const handleComponentUpdate = useCallback((updatedComponent: ComponentNode) => {
    setComponents(prev => 
      prev.map(c => (c.id === updatedComponent.id ? updatedComponent : c))
    )
    setSelectedComponent(updatedComponent)
  }, [])

  const handleComponentDelete = () => {
    if (selectedComponent) {
      setComponents(prev => prev.filter(c => c.id !== selectedComponent.id))
      setSelectedComponent(null)
    }
  }

  const handleComponentDuplicate = () => {
    if (selectedComponent) {
      const duplicated: ComponentNode = {
        ...selectedComponent,
        id: `${selectedComponent.id}_copy_${Date.now()}`,
        layout: {
          ...selectedComponent.layout,
          default: {
            ...selectedComponent.layout.default,
            x: selectedComponent.layout.default.x + 20,
            y: selectedComponent.layout.default.y + 20
          }
        }
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

  const getDeviceDimensions = () => {
    switch (deviceMode) {
      case 'mobile':
        return { width: 375, height: 667 };
      case 'tablet':
        return { width: 768, height: 1024 };
      default:
        return { width: 1200, height: 1200 }; // Default desktop size
    }
  };

  const deviceDimensions = getDeviceDimensions();

  // Show loading overlay when initializing template
  if (isLoadingTemplate) {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-xl font-semibold">Loading Template</h2>
          <p className="text-muted-foreground">Setting up your website with the {templateId} template...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Top Toolbar */}
      <div className="border-b bg-background">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/websites')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Websites
            </Button>
            <h1 className="text-lg font-semibold">
              {isLoadingTemplate ? 'Loading Template...' : templateName || 'Untitled Website'}
            </h1>
            {hasUnsavedChanges && <Badge variant="secondary">Unsaved changes</Badge>}
            {isLoadingTemplate && <Badge variant="outline">Initializing...</Badge>}
          </div>

          <div className="flex items-center space-x-2">
            {/* Device Mode Toggle */}
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={deviceMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceMode('desktop')}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={deviceMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceMode('tablet')}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={deviceMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceMode('mobile')}
                title="Mobile View"
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
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Component Palette */}
        {!isPreviewMode && (
          <ComponentPalette onComponentDragStart={handleComponentDragStart} onSaveAsTemplate={handleSaveAsTemplate} pageSchema={pageSchema} />
        )}

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div className={`flex-1 ${getDeviceClass()} flex justify-center items-start overflow-auto`}>
            <EditorCanvas
              components={components}
              onComponentsChange={setComponents}
              onComponentSelect={setSelectedComponent}
              selectedComponent={selectedComponent}
              deviceMode={deviceMode}
              deviceDimensions={deviceDimensions}
              pageSchema={pageSchema}
              onPageSchemaChange={setPageSchema}
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
            <span className="flex items-center gap-1">
              <span>View:</span>
              <Badge variant="outline" className="text-xs">
                {deviceMode} ({deviceDimensions.width}×{deviceDimensions.height})
              </Badge>
            </span>
            {deviceMode !== 'desktop' && (
              <span className="text-green-600">📱 Components auto-adjust</span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <span>WebBuilder Editor</span>
            <Badge variant="outline" className="text-xs">
              {isPreviewMode ? 'Preview Mode' : 'Edit Mode'}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Responsive Design
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorPage