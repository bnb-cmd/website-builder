'use client'

import { useDroppable } from '@dnd-kit/core'
import { Element, ViewMode } from '@/types/editor'
import { ElementRenderer } from './element-renderer'
import { cn } from '@/lib/utils'

interface CanvasProps {
  elements: Element[]
  selectedElement: Element | null
  viewMode: ViewMode
  onSelectElement: (elementId: string | null) => void
  onUpdateElement: (elementId: string, updates: Partial<Element>) => void
  onDeleteElement: (elementId: string) => void
}

export function Canvas({
  elements,
  selectedElement,
  viewMode,
  onSelectElement,
  onUpdateElement,
  onDeleteElement
}: CanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
    data: {
      dropZone: 'canvas'
    }
  })

  const getCanvasWidth = () => {
    switch (viewMode) {
      case 'mobile':
        return '375px'
      case 'tablet':
        return '768px'
      case 'desktop':
      default:
        return '100%'
    }
  }

  const getCanvasMaxWidth = () => {
    switch (viewMode) {
      case 'mobile':
        return '375px'
      case 'tablet':
        return '768px'
      case 'desktop':
      default:
        return '1200px'
    }
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if clicking on canvas background
    if (e.target === e.currentTarget) {
      onSelectElement(null)
    }
  }

  return (
    <div className="flex-1 bg-muted/30 overflow-auto">
      <div className="min-h-full flex justify-center p-8">
        <div
          ref={setNodeRef}
          className={cn(
            'bg-background shadow-lg transition-all duration-300 min-h-screen',
            'border border-border rounded-lg overflow-hidden',
            isOver && 'ring-2 ring-primary ring-opacity-50',
            viewMode === 'mobile' && 'mx-auto',
            viewMode === 'tablet' && 'mx-auto'
          )}
          style={{
            width: getCanvasWidth(),
            maxWidth: getCanvasMaxWidth()
          }}
          onClick={handleCanvasClick}
        >
          {/* Canvas Content */}
          <div className="relative">
            {elements.length === 0 ? (
              <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
                <div className="text-center">
                  <div className="text-6xl mb-4">📱</div>
                  <h3 className="text-lg font-medium mb-2">Start Building Your Website</h3>
                  <p className="text-sm">
                    Drag components from the sidebar to get started
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-0">
                {elements.map((element) => (
                  <ElementRenderer
                    key={element.id}
                    element={element}
                    isSelected={selectedElement?.id === element.id}
                    onSelect={onSelectElement}
                    onUpdate={onUpdateElement}
                    onDelete={onDeleteElement}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}

            {/* Drop Zone Indicator */}
            {isOver && (
              <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center">
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
                  Drop component here
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Canvas Tools */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-background border border-border rounded-lg shadow-lg px-4 py-2 flex items-center space-x-4">
        <span className="text-sm text-muted-foreground">
          {viewMode === 'desktop' && '🖥️ Desktop'}
          {viewMode === 'tablet' && '📱 Tablet'} 
          {viewMode === 'mobile' && '📱 Mobile'}
        </span>
        <div className="w-px h-4 bg-border" />
        <span className="text-sm text-muted-foreground">
          {elements.length} element{elements.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
