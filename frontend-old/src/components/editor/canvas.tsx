'use client'

import { useDroppable } from '@dnd-kit/core'
import { Element, ViewMode } from '@/types/editor'
import { ElementRenderer } from './element-renderer'
import { ZoomControls } from './zoom-controls'
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
        return '1600px' // Increased from 1200px to 1600px
    }
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if clicking on canvas background
    if (e.target === e.currentTarget) {
      onSelectElement(null)
    }
  }

  return (
    <div className="flex-1 bg-muted/30 overflow-auto min-w-0 relative">
      {/* Dot Grid Background Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />
      
      <div className="min-h-full flex justify-center p-2 sm:p-4 md:p-6 lg:p-8 relative z-10">
        <div
          ref={setNodeRef}
          className={cn(
            'bg-background shadow-2xl transition-all duration-300 min-h-screen relative',
            'border border-border/50 rounded-xl overflow-hidden',
            'hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]',
            isOver && 'ring-2 ring-primary ring-opacity-50 shadow-[0_0_30px_rgba(59,130,246,0.3)]',
            viewMode === 'mobile' && 'mx-auto',
            viewMode === 'tablet' && 'mx-auto'
          )}
          style={{
            width: getCanvasWidth(),
            maxWidth: getCanvasMaxWidth()
          }}
          onClick={handleCanvasClick}
        >
          {/* Enhanced Drop Zone Indicator */}
          {isOver && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
              <div className="bg-primary/10 border-2 border-dashed border-primary rounded-xl p-12 text-center backdrop-blur-sm">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="text-primary font-semibold text-lg mb-2">Drop Component Here</div>
                <div className="text-primary/70 text-sm">Release to add to canvas</div>
              </div>
            </div>
          )}
          {/* Canvas Content */}
          <div className="relative">
            {elements.length === 0 ? (
              <div className="flex items-center justify-center min-h-[500px] text-muted-foreground p-8">
                <div className="text-center max-w-md">
                  {/* Illustration */}
                  <div className="relative mb-6">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl flex items-center justify-center animate-pulse">
                      <svg
                        className="w-16 h-16 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                        />
                      </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full animate-bounce" />
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-100" />
                  </div>

                  {/* Text Content */}
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    Start Building Your Website
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Drag and drop components from the sidebar to create your perfect website
                  </p>

                  {/* Quick Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium">
                      Browse Templates
                    </button>
                    <button className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-all duration-200 text-sm font-medium">
                      Watch Tutorial
                    </button>
                  </div>

                  {/* Tips */}
                  <div className="mt-8 pt-6 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-3 font-medium">Quick Tips:</p>
                    <div className="space-y-2 text-xs text-muted-foreground text-left">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span>Drag components from the left sidebar</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span>Click elements to edit their properties</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span>Use Cmd+Z to undo changes</span>
                      </div>
                    </div>
                  </div>
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
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-background/95 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl px-3 py-2 sm:px-4 flex items-center space-x-2 sm:space-x-4 z-30 hover:shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition-all duration-200">
        <span className="text-xs sm:text-sm text-muted-foreground">
          {viewMode === 'desktop' && '🖥️ Desktop'}
          {viewMode === 'tablet' && '📱 Tablet'} 
          {viewMode === 'mobile' && '📱 Mobile'}
        </span>
        <div className="w-px h-4 bg-border" />
        <span className="text-xs sm:text-sm text-muted-foreground">
          {elements.length} element{elements.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Zoom Controls */}
      <ZoomControls />
    </div>
  )
}
