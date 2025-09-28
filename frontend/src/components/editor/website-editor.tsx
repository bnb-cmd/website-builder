'use client'

import { useState, useCallback } from 'react'
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Sidebar } from './sidebar'
import { Canvas } from './canvas'
import { PropertiesPanel } from './properties-panel'
import { Toolbar } from './toolbar'
import { LayerPanel } from './advanced/layer-panel'
import { DesignTools } from './advanced/design-tools'
import { AIWebsiteAssistant } from './advanced/ai-website-assistant'
import { TemplateLibrary } from './template-library'
import { AnimationEditor } from './advanced/animation-editor'
import { InteractionsPanel } from './advanced/interactions-panel'
import { CustomCSSEditor } from './advanced/custom-css-editor'
import { VersionHistoryPanel } from './advanced/version-history-panel'
import { AIDesignAssistantPanel } from './advanced/ai-design-assistant-panel'
import { ABTestingPanel } from './advanced/ab-testing-panel'
import { CustomJavaScriptPanel } from './advanced/custom-javascript-panel'
import { APIIntegrationsPanel } from './advanced/api-integrations-panel'
import { WhiteLabelPanel } from './advanced/white-label-panel'
import { SecurityCompliancePanel } from './advanced/security-compliance-panel'
import { DeveloperPortalPanel } from './advanced/developer-portal-panel'
import { CustomDomainPanel } from './advanced/custom-domain-panel'
import { ElementType, Element, WebsiteData } from '@/types/editor'
import { useWebsiteStore } from '@/store/website-store'
import { Button } from '@/components/ui/button'
import { 
  Save, 
  Eye, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Undo, 
  Redo, 
  Layers,
  Wand2,
  Palette,
  Settings,
  X,
  Sparkles,
  MousePointer,
  Code,
  History,
  Bot,
  GitBranch,
  Terminal,
  Webhook,
  Palette,
  Shield,
  Code,
  Globe
} from 'lucide-react'
import toast from 'react-hot-toast'

interface WebsiteEditorProps {
  websiteId: string
  initialData?: WebsiteData
}

export function WebsiteEditor({ websiteId, initialData }: WebsiteEditorProps) {
  const {
    elements,
    selectedElement,
    activeElement,
    viewMode,
    history,
    canUndo,
    canRedo,
    setActiveElement,
    addElement,
    updateElement,
    deleteElement,
    selectElement,
    setViewMode,
    undo,
    redo,
    saveWebsite,
    duplicateElement,
    isLoading
  } = useWebsiteStore()

  const [draggedElement, setDraggedElement] = useState<ElementType | null>(null)
  const [showLayers, setShowLayers] = useState(false)
  const [showDesignTools, setShowDesignTools] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(true)
  const [showAnimationEditor, setShowAnimationEditor] = useState(false)
  const [showInteractionsPanel, setShowInteractionsPanel] = useState(false)
  const [showCustomCssEditor, setShowCustomCssEditor] = useState(false)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [showAIDesignAssistant, setShowAIDesignAssistant] = useState(false)
  const [showABTesting, setShowABTesting] = useState(false)
  const [showCustomJavaScript, setShowCustomJavaScript] = useState(false)
  const [showAPIIntegrations, setShowAPIIntegrations] = useState(false)
  const [showWhiteLabel, setShowWhiteLabel] = useState(false)
  const [showSecurityCompliance, setShowSecurityCompliance] = useState(false)
  const [showDeveloperPortal, setShowDeveloperPortal] = useState(false)
  const [showCustomDomain, setShowCustomDomain] = useState(false)
  const [showProperties, setShowProperties] = useState(true)

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event
    setDraggedElement(active.data.current?.type || null)
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) {
      setDraggedElement(null)
      return
    }

    // If dropping a new element from sidebar
    if (active.id.toString().startsWith('sidebar-')) {
      const elementType = active.data.current?.type as ElementType
      const dropZone = over.data.current?.dropZone

      if (dropZone === 'canvas') {
        const newElement: Element = {
          id: `element-${Date.now()}`,
          type: elementType,
          props: getDefaultProps(elementType),
          children: [],
          style: {},
          position: { x: 0, y: 0 }
        }
        addElement(newElement)
      }
    }

    setDraggedElement(null)
  }, [addElement])

  const getDefaultProps = (type: ElementType): Record<string, any> => {
    switch (type) {
      case 'text':
        return { content: 'Enter your text here', fontSize: '16px', color: '#000000' }
      case 'heading':
        return { content: 'Your Heading', level: 'h2', fontSize: '32px', color: '#000000' }
      case 'image':
        return { src: '', alt: 'Image', width: '100%', height: 'auto' }
      case 'button':
        return { text: 'Click me', variant: 'primary', size: 'medium' }
      case 'container':
        return { layout: 'vertical', padding: '20px', gap: '10px' }
      case 'form':
        return { title: 'Contact Form', fields: [] }
      default:
        return {}
    }
  }

  const handleSave = async () => {
    try {
      await saveWebsite(websiteId)
      toast.success('Website saved successfully!')
    } catch (error) {
      toast.error('Failed to save website')
    }
  }

  const handlePreview = () => {
    window.open(`/preview/${websiteId}`, '_blank')
  }

  const handleReorderElements = (newElements: Element[]) => {
    // In real implementation, this would update the element order in the store
    console.log('Reordering elements:', newElements)
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-screen flex flex-col bg-background">
        {/* Header Toolbar */}
        <Toolbar>
          <div className="flex items-center space-x-4">
            {/* Undo/Redo */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={!canUndo}
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={!canRedo}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>

            {/* View Mode */}
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('desktop')}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('tablet')}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('mobile')}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>

            {/* Advanced Tools */}
            <div className="flex items-center space-x-2">
              <Button
                variant={showLayers ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowLayers(!showLayers)}
                title="Layers Panel"
              >
                <Layers className="h-4 w-4" />
              </Button>
              <Button
                variant={showDesignTools ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowDesignTools(!showDesignTools)}
                title="Design Tools"
              >
                <Wand2 className="h-4 w-4" />
              </Button>
              <Button
                variant={showTemplates ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowTemplates(!showTemplates)}
                title="Templates"
              >
                <Palette className="h-4 w-4" />
              </Button>
              <Button
                variant={showProperties ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowProperties(!showProperties)}
                title="Properties"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant={showAnimationEditor ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowAnimationEditor(!showAnimationEditor)}
                title="Animations"
              >
                <Sparkles className="h-4 w-4" />
              </Button>
              <Button
                variant={showInteractionsPanel ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowInteractionsPanel(!showInteractionsPanel)}
                title="Interactions"
              >
                <MousePointer className="h-4 w-4" />
              </Button>
              <Button
                variant={showCustomCssEditor ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowCustomCssEditor(!showCustomCssEditor)}
                title="Custom CSS"
              >
                <Code className="h-4 w-4" />
              </Button>
              <Button
                variant={showVersionHistory ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowVersionHistory(!showVersionHistory)}
                title="Version History"
              >
                <History className="h-4 w-4" />
              </Button>
              <Button
                variant={showAIDesignAssistant ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowAIDesignAssistant(!showAIDesignAssistant)}
                title="AI Design Assistant"
              >
                <Bot className="h-4 w-4" />
              </Button>
              <Button
                variant={showABTesting ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowABTesting(!showABTesting)}
                title="A/B Testing"
              >
                <GitBranch className="h-4 w-4" />
              </Button>
              <Button
                variant={showCustomJavaScript ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowCustomJavaScript(!showCustomJavaScript)}
                title="Custom JavaScript"
              >
                <Terminal className="h-4 w-4" />
              </Button>
              <Button
                variant={showAPIIntegrations ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowAPIIntegrations(!showAPIIntegrations)}
                title="API Integrations"
              >
                <Webhook className="h-4 w-4" />
              </Button>
              <Button
                variant={showWhiteLabel ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowWhiteLabel(!showWhiteLabel)}
                title="White-Label"
              >
                <Palette className="h-4 w-4" />
              </Button>
              <Button
                variant={showSecurityCompliance ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowSecurityCompliance(!showSecurityCompliance)}
                title="Security & Compliance"
              >
                <Shield className="h-4 w-4" />
              </Button>
              <Button
                variant={showDeveloperPortal ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowDeveloperPortal(!showDeveloperPortal)}
                title="Developer Portal"
              >
                <Code className="h-4 w-4" />
              </Button>
              <Button
                variant={showCustomDomain ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowCustomDomain(!showCustomDomain)}
                title="Custom Domains"
              >
                <Globe className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </Toolbar>

        {/* Editor Layout */}
        <div className="flex-1 flex">
          {/* Left Panel - Components or Templates */}
          {showTemplates ? (
            <TemplateLibrary
              onSelectTemplate={(template) => {
                console.log('Selected template:', template)
                setShowTemplates(false)
              }}
              onSelectBlock={(block) => {
                console.log('Selected block:', block)
              }}
            />
          ) : (
            <Sidebar />
          )}

          {/* Middle Section - Layers and Canvas */}
          <div className="flex-1 flex">
            {/* Layers Panel */}
            {showLayers && (
              <LayerPanel
                elements={elements}
                selectedElement={selectedElement}
                onSelectElement={selectElement}
                onUpdateElement={updateElement}
                onDeleteElement={deleteElement}
                onDuplicateElement={duplicateElement}
                onReorderElements={handleReorderElements}
              />
            )}

            {/* Main Canvas */}
            <div className="flex-1 flex flex-col">
              <Canvas
                elements={elements}
                selectedElement={selectedElement}
                viewMode={viewMode}
                onSelectElement={selectElement}
                onUpdateElement={updateElement}
                onDeleteElement={deleteElement}
              />
            </div>
          </div>

          {/* Right Panel - Properties or Design Tools */}
          {selectedElement && (
            showAnimationEditor ? (
              <AnimationEditor
                element={selectedElement}
                onUpdateElement={updateElement}
                onClose={() => setShowAnimationEditor(false)}
              />
            ) : showInteractionsPanel ? (
              <InteractionsPanel
                element={selectedElement}
                onUpdateElement={updateElement}
                onClose={() => setShowInteractionsPanel(false)}
              />
            ) : showCustomCssEditor ? (
              <CustomCSSEditor
                element={selectedElement}
                onUpdateElement={updateElement}
                onClose={() => setShowCustomCssEditor(false)}
              />
            ) : showVersionHistory ? (
              <VersionHistoryPanel
                onClose={() => setShowVersionHistory(false)}
              />
            ) : showAIDesignAssistant ? (
              <AIDesignAssistantPanel
                onClose={() => setShowAIDesignAssistant(false)}
              />
            ) : showABTesting ? (
              <ABTestingPanel
                onClose={() => setShowABTesting(false)}
              />
            ) : showCustomJavaScript ? (
              <CustomJavaScriptPanel
                element={selectedElement}
                onUpdateElement={updateElement}
                onClose={() => setShowCustomJavaScript(false)}
              />
            ) : showAPIIntegrations ? (
              <APIIntegrationsPanel
                element={selectedElement}
                onUpdateElement={updateElement}
                onClose={() => setShowAPIIntegrations(false)}
              />
            ) : showWhiteLabel ? (
              <WhiteLabelPanel
                onClose={() => setShowWhiteLabel(false)}
              />
            ) : showSecurityCompliance ? (
              <SecurityCompliancePanel
                onClose={() => setShowSecurityCompliance(false)}
              />
            ) : showDeveloperPortal ? (
              <DeveloperPortalPanel
                onClose={() => setShowDeveloperPortal(false)}
              />
            ) : showCustomDomain ? (
              <CustomDomainPanel
                onClose={() => setShowCustomDomain(false)}
              />
            ) : showDesignTools ? (
              <DesignTools
                selectedElement={selectedElement}
                onUpdateElement={updateElement}
                onAddElement={addElement}
              />
            ) : (
              showProperties && (
                <PropertiesPanel
                  element={selectedElement}
                  onUpdate={(updates) => updateElement(selectedElement.id, updates)}
                  onClose={() => setShowProperties(false)}
                />
              )
            )
          )}
        </div>

        {/* AI Assistant (Floating) */}
        {showAIAssistant && (
          <AIWebsiteAssistant
            websiteId={websiteId}
            onSuggestion={(suggestion) => {
              console.log('AI suggestion:', suggestion)
            }}
          />
        )}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {draggedElement && (
          <div className="bg-primary text-primary-foreground px-3 py-2 rounded shadow-lg">
            {draggedElement}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
