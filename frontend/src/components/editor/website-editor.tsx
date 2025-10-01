'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { cn } from '@/lib/utils'
import { Sidebar } from './sidebar'
import { Canvas } from './canvas'
import { PropertiesPanel } from './properties-panel'
import { Toolbar } from './toolbar'
import { TooltipWrapper } from './tooltip-wrapper'
import { TooltipProvider } from '@/components/ui/tooltip'
import { LayerPanel } from './advanced/layer-panel'
import { DesignTools } from './advanced/design-tools'
import { AIWebsiteAssistant } from './advanced/ai-website-assistant'
import { TemplateLibrary } from './template-library'
import { ComponentLibrary } from './component-library'
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
import { useAutoSave } from '@/hooks/use-auto-save'
import { AutoSaveIndicator } from '@/components/ui/auto-save-indicator'
import { DraftRecovery } from '@/components/ui/draft-recovery'
import { useGuidedEditor } from '@/hooks/use-guided-editor'
import { GuidedTour } from '@/components/ui/guided-tour'
import { GuidedWorkflowsPanel } from '@/components/ui/guided-workflows-panel'
import { useCollaboration } from '@/hooks/use-collaboration'
import { CollaborationCursors, CollaborationSelections, CollaborationPresence } from '@/components/ui/collaboration-cursors'
import { CollaborationPanel } from '@/components/ui/collaboration-panel'
import { useTouchInteractions } from '@/hooks/use-touch-interactions'
import { GestureZone, SwipeAction } from '@/components/ui/gesture-manager'
import { Button } from '@/components/ui/button'
import { 
  Save, 
  Eye, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Undo, 
  Redo, 
  Menu, 
  Copy, 
  Trash2, 
  Settings,
  Users,
  Globe
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface WebsiteEditorProps {
  websiteId: string
  initialData?: WebsiteData
}

export function WebsiteEditor({ websiteId, initialData }: WebsiteEditorProps) {
  // Store state
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
    isLoading,
    loadWebsite
  } = useWebsiteStore()

  // Local state
  const [draggedElement, setDraggedElement] = useState<ElementType | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
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
  const [showComponentLibrary, setShowComponentLibrary] = useState(true)
  const [showDraftRecovery, setShowDraftRecovery] = useState(false)
  const [showGuidedLearning, setShowGuidedLearning] = useState(false)
  const [showCollaboration, setShowCollaboration] = useState(false)
  const [collaborationVisible, setCollaborationVisible] = useState(true)

  // Refs
  const canvasRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  // Load website data on mount
  useEffect(() => {
    if (websiteId) {
      loadWebsite(websiteId).catch(error => {
        console.error('Failed to load website:', error)
        toast.error('Failed to load website. Please try again.')
      })
    }
  }, [websiteId, loadWebsite])

  // Auto-save functionality
  const {
    saveState,
    draftVersions,
    onDataChange,
    manualSave,
    recoverDraft,
    deleteDraft,
    toggleAutoSave,
    createDraft
  } = useAutoSave({
    websiteId,
    autoSaveInterval: 30000, // 30 seconds
    onSaveSuccess: (data) => {
      toast.success('Website saved successfully!')
    },
    onSaveError: (error) => {
      toast.error(`Save failed: ${error.message}`)
    },
    onDraftRecovered: (draft) => {
      toast.success('Draft recovered successfully!')
    }
  })

  // Manual save handler
  const handleManualSave = useCallback(async () => {
    try {
      await manualSave({ elements, viewMode })
      toast.success('Website saved manually!')
    } catch (error) {
      toast.error('Failed to save website')
    }
  }, [manualSave, elements, viewMode])

  // Handle draft recovery
  const handleRecoverDraft = useCallback((draftId: string) => {
    const recoveredData = recoverDraft(draftId)
    if (recoveredData) {
      // Update the website store with recovered data
      // This would need to be implemented based on how the store works
      toast.success('Draft recovered successfully!')
    }
  }, [recoverDraft])

  // Clear all drafts
  const handleClearAllDrafts = useCallback(() => {
    draftVersions.forEach(draft => deleteDraft(draft.id))
    toast.success('All drafts cleared!')
  }, [draftVersions, deleteDraft])

  // Guided editor functionality
  const {
    workflows,
    currentWorkflow,
    progress,
    isActive: isGuidedTourActive,
    startWorkflow,
    completeStep,
    skipStep,
    completeWorkflow,
    getAvailableWorkflows,
    getWorkflowProgress
  } = useGuidedEditor({
    userId: undefined, // No demo user - will be set when real user is available
    autoStart: false, // Don't auto-start without real user
    showHints: true,
    enableTutorials: true
  })

  // Collaboration functionality
  const {
    collaborators,
    currentUser,
    activeCollaborators,
    isConnected,
    connectionStatus,
    events,
    updateCursor,
    updateSelection,
    updateAction
  } = useCollaboration({
    websiteId,
    currentUserId: undefined, // No demo user - will be set when real user is available
    currentUserName: 'Guest', // Default guest name
    enabled: false, // Disable collaboration until real user is available
    onCollaboratorUpdate: (updatedCollaborators) => {
      console.log('Collaborators updated:', updatedCollaborators)
    },
    onEvent: (event) => {
      console.log('Collaboration event:', event)
    }
  })

  // Touch interactions for canvas
  useTouchInteractions(
    canvasRef,
    {
      enableSwipe: true,
      enablePinch: true,
      enableDoubleTap: true,
      swipeThreshold: 50
    },
    {
      onSwipe: (gesture) => {
        // Swipe to navigate between panels on mobile
        if (gesture.direction === 'left' && showComponentLibrary) {
          setShowComponentLibrary(false)
          setShowProperties(true)
        } else if (gesture.direction === 'right' && showProperties) {
          setShowProperties(false)
          setShowComponentLibrary(true)
        }
      },
      onPinch: (pinch) => {
        // Pinch to zoom canvas (future enhancement)
        console.log('Pinch gesture:', pinch)
      },
      onDoubleTap: () => {
        // Double tap to reset zoom or center canvas
        console.log('Double tap on canvas')
      }
    }
  )

  // Touch interactions for editor layout
  useTouchInteractions(
    editorRef,
    { enableSwipe: true, swipeThreshold: 100 },
    {
      onSwipe: (gesture) => {
        // Swipe between different editor modes
        if (gesture.direction === 'up') {
          // Swipe up to show/hide panels
          setShowComponentLibrary(!showComponentLibrary)
        }
      }
    }
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event
    setDraggedElement(active.data.current?.type || null)
  }, [])

  // Handle mouse movement for collaboration cursors
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isConnected && collaborationVisible) {
      const canvasElement = document.querySelector('[data-canvas]')
      if (canvasElement) {
        const rect = canvasElement.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          updateCursor(x, y)
        }
      }
    }
  }, [isConnected, collaborationVisible, updateCursor])

  const handleElementSelect = useCallback((elementId: string) => {
    if (isConnected) {
      updateSelection([elementId])
      updateAction('selecting element')
    }
  }, [isConnected, updateSelection, updateAction])

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

        // Track data change for auto-save
        onDataChange({ elements: [...elements, newElement], viewMode })
      }
    }

    setDraggedElement(null)
  }, [addElement, elements, viewMode, onDataChange])

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
    <TooltipProvider>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div ref={editorRef} className="h-screen flex flex-col bg-background overflow-hidden">
          {/* Header Toolbar */}
          <Toolbar data-toolbar>
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden h-8 w-8 p-0"
                title="Toggle Sidebar"
              >
                <Menu className="h-4 w-4" />
              </Button>

              {/* Undo/Redo Controls */}
              <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1 shadow-sm">
                <TooltipWrapper content="Undo" shortcut="⌘Z">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={undo}
                    disabled={!canUndo}
                    className="h-8 w-8 p-0 hover:bg-background hover:shadow-sm transition-all duration-200"
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                </TooltipWrapper>
                <TooltipWrapper content="Redo" shortcut="⌘⇧Z">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={redo}
                    disabled={!canRedo}
                    className="h-8 w-8 p-0 hover:bg-background hover:shadow-sm transition-all duration-200"
                  >
                    <Redo className="h-4 w-4" />
                  </Button>
                </TooltipWrapper>
              </div>

              {/* View Mode */}
              <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1 shadow-sm" data-view-modes>
                <TooltipWrapper content="Desktop View" shortcut="⌘1">
                  <Button
                    variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setViewMode('desktop')
                      onDataChange({ elements, viewMode: 'desktop' })
                    }}
                    className={cn(
                      "h-8 w-8 p-0 transition-all duration-200",
                      viewMode === 'desktop' ? "shadow-md" : "hover:bg-background hover:shadow-sm"
                    )}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </TooltipWrapper>
                <TooltipWrapper content="Tablet View" shortcut="⌘2">
                  <Button
                    variant={viewMode === 'tablet' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setViewMode('tablet')
                      onDataChange({ elements, viewMode: 'tablet' })
                    }}
                    className={cn(
                      "h-8 w-8 p-0 transition-all duration-200",
                      viewMode === 'tablet' ? "shadow-md" : "hover:bg-background hover:shadow-sm"
                    )}
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                </TooltipWrapper>
                <TooltipWrapper content="Mobile View" shortcut="⌘3">
                  <Button
                    variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setViewMode('mobile')
                      onDataChange({ elements, viewMode: 'mobile' })
                    }}
                    className={cn(
                      "h-8 w-8 p-0 transition-all duration-200",
                      viewMode === 'mobile' ? "shadow-md" : "hover:bg-background hover:shadow-sm"
                    )}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </TooltipWrapper>
              </div>

              {/* Contextual Actions for Selected Element */}
              {selectedElement && (
                <div className="hidden md:flex items-center space-x-1 bg-blue-50 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => duplicateElement(selectedElement.id)}
                    className="h-8 w-8 p-0 hover:bg-blue-100"
                    title="Duplicate Element"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteElement(selectedElement.id)}
                    className="h-8 w-8 p-0 hover:bg-blue-100"
                    title="Delete Element"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Collaboration Presence */}
              {isConnected && (
                <div className="flex items-center space-x-1">
                  <div className="flex -space-x-1">
                    {activeCollaborators.map((collaborator) => (
                      <div
                        key={collaborator.id}
                        className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center border-2 border-background"
                        title={collaborator.name}
                      >
                        {collaborator.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {activeCollaborators.length} online
                  </span>
                </div>
              )}

              {/* Auto-save Indicator */}
              <AutoSaveIndicator saveState={saveState} />

              {/* Save Button */}
              <TooltipWrapper content="Save" shortcut="⌘S">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className="h-8 px-3 hover:bg-background hover:shadow-sm transition-all duration-200"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </TooltipWrapper>

              {/* Preview Button */}
              <TooltipWrapper content="Preview" shortcut="⌘P">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreview}
                  className="h-8 px-3 hover:bg-background hover:shadow-sm transition-all duration-200"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
              </TooltipWrapper>

              {/* Settings */}
              {selectedElement && (
                <TooltipWrapper content="Element Settings">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowProperties(!showProperties)}
                    className="h-8 w-8 p-0 hover:bg-background hover:shadow-sm transition-all duration-200"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipWrapper>
              )}
            </div>
          </Toolbar>

          {/* Editor Layout - 3 Panel Design */}
          <div className="flex-1 flex overflow-hidden min-h-0">
            {/* Left Panel - Component Library (Fixed Width) */}
            <div className="w-80 bg-background border-r border-border/50 flex flex-col overflow-hidden">
              {showComponentLibrary ? (
                <ComponentLibrary
                  data-component-library
                  onComponentSelect={(component) => {
                    console.log('Selected component:', component)
                    // Add component to canvas logic here
                    addElement({
                      id: `${component.id}-${Date.now()}`,
                      type: component.id as ElementType,
                      props: component.defaultProps || {},
                      style: {},
                      children: [],
                      position: { x: 0, y: 0 }
                    })
                  }}
                  currentContext={['landing-page', 'content']} // This could be dynamic based on current page context
                />
              ) : showTemplates ? (
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
                <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
              )}
            </div>

            {/* Middle Section - Canvas (Main Area) */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              {/* Layers Panel (Optional - Top of Canvas) */}
              {showLayers && (
                <div className="h-48 border-b border-border/50">
                  <LayerPanel
                    elements={elements}
                    selectedElement={selectedElement}
                    onSelectElement={selectElement}
                    onUpdateElement={updateElement}
                    onDeleteElement={deleteElement}
                    onDuplicateElement={duplicateElement}
                    onReorderElements={handleReorderElements}
                  />
                </div>
              )}

              {/* Main Canvas */}
              <div
                ref={canvasRef}
                className="flex-1 flex flex-col min-w-0 overflow-hidden"
                onMouseMove={handleMouseMove}
              >
                <Canvas
                  data-canvas
                  elements={elements}
                  selectedElement={selectedElement}
                  viewMode={viewMode}
                  onSelectElement={selectElement}
                  onUpdateElement={updateElement}
                  onDeleteElement={deleteElement}
                />
              </div>
            </div>

            {/* Right Panel - Properties (Fixed Width) */}
            <div className="w-80 bg-background border-l border-border/50 flex flex-col overflow-hidden">
              {selectedElement ? (
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
                ) : showDraftRecovery ? (
                  <DraftRecovery
                    draftVersions={draftVersions}
                    onRecoverDraft={handleRecoverDraft}
                    onDeleteDraft={deleteDraft}
                    onClearAllDrafts={handleClearAllDrafts}
                  />
                ) : showCollaboration ? (
                  <CollaborationPanel
                    collaborators={collaborators}
                    currentUser={currentUser}
                    isConnected={isConnected}
                    connectionStatus={connectionStatus}
                    events={events}
                    onToggleVisibility={() => setCollaborationVisible(!collaborationVisible)}
                    onShareLink={() => {
                      navigator.clipboard.writeText(window.location.href)
                      toast.success('Collaboration link copied!')
                    }}
                    onCopyLink={() => {
                      navigator.clipboard.writeText(window.location.href)
                      toast.success('Link copied!')
                    }}
                  />
                ) : showGuidedLearning ? (
                  <GuidedWorkflowsPanel
                    workflows={workflows}
                    availableWorkflows={getAvailableWorkflows()}
                    getWorkflowProgress={getWorkflowProgress}
                    onStartWorkflow={startWorkflow}
                    currentWorkflow={progress.currentWorkflow}
                  />
                ) : showDesignTools ? (
                  <DesignTools
                    selectedElement={selectedElement}
                    onUpdateElement={updateElement}
                    onAddElement={addElement}
                  />
                ) : (
                  <PropertiesPanel
                    element={selectedElement}
                    onUpdateElement={updateElement}
                    onDeleteElement={deleteElement}
                    onDuplicateElement={duplicateElement}
                  />
                )
              ) : (
                <div className="flex-1 flex items-center justify-center p-8 text-center">
                  <div className="max-w-sm">
                    <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Select an Element</h3>
                    <p className="text-sm text-muted-foreground">
                      Click on any element in the canvas to see its properties and settings here.
                    </p>
                  </div>
                </div>
              )}
            </div>
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

        {/* Enhanced Drag Overlay */}
        <DragOverlay>
          {draggedElement && (
            <div className="bg-primary text-primary-foreground px-4 py-3 rounded-lg shadow-xl border border-primary/20 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary-foreground/20 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">{draggedElement.charAt(0).toUpperCase()}</span>
                </div>
                <span className="font-medium text-sm">{draggedElement}</span>
              </div>
              <div className="text-xs opacity-80 mt-1">Drop to add component</div>
            </div>
          )}
        </DragOverlay>

        {/* Guided Tour Overlay */}
        <GuidedTour
          workflow={currentWorkflow}
          currentStep={progress.currentStep}
          isActive={isGuidedTourActive}
          onComplete={completeStep}
          onSkip={skipStep}
          onClose={() => {
            // Close the current workflow
            completeWorkflow()
          }}
        />

        {/* Collaboration Overlays */}
        {collaborationVisible && (
          <>
            <CollaborationCursors
              collaborators={activeCollaborators}
              containerRef={{ current: document.querySelector('[data-canvas]') as HTMLElement }}
            />
            <CollaborationSelections
              collaborators={activeCollaborators}
              containerRef={{ current: document.querySelector('[data-canvas]') as HTMLElement }}
            />
          </>
        )}
      </DndContext>
    </TooltipProvider>
  )
}