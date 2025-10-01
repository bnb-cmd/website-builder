import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react'

interface AudioElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function AudioElement({ element, onUpdate, viewMode, style, children }: AudioElementProps) {
  const handleTitleChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newTitle = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        title: newTitle
      }
    })
  }

  const getVariantClass = () => {
    switch (element.props.variant) {
      case 'minimal':
        return 'bg-transparent border-0'
      case 'card':
        return 'bg-card border border-border rounded-lg'
      case 'player':
        return 'bg-muted border border-border rounded-lg'
      default:
        return 'bg-card border border-border rounded-lg'
    }
  }

  const getSizeClass = () => {
    switch (element.props.size) {
      case 'sm':
        return 'h-12'
      case 'lg':
        return 'h-20'
      case 'xl':
        return 'h-24'
      case 'md':
      default:
        return 'h-16'
    }
  }

  return (
    <div
      className={cn(
        'w-full p-4',
        getVariantClass(),
        getSizeClass()
      )}
      style={style}
    >
      {/* Audio Player */}
      <div className="flex items-center space-x-4">
        {/* Play/Pause Button */}
        <button className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
          <Play className="h-6 w-6" />
        </button>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <div
            className="font-medium text-foreground truncate"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleTitleChange}
          >
            {element.props.title || 'Audio Track'}
          </div>
          <div className="text-sm text-muted-foreground">
            {element.props.artist || 'Unknown Artist'} • {element.props.duration || '0:00'}
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-muted rounded transition-colors">
            <Volume2 className="h-4 w-4" />
          </button>
          <div className="w-20 h-1 bg-muted rounded-full">
            <div className="w-3/4 h-full bg-primary rounded-full"></div>
          </div>
        </div>

        {/* Fullscreen */}
        <button className="p-2 hover:bg-muted rounded transition-colors">
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full h-1 bg-muted rounded-full">
          <div className="w-1/3 h-full bg-primary rounded-full"></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0:00</span>
          <span>{element.props.duration || '0:00'}</span>
        </div>
      </div>

      {/* Audio Controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-muted rounded transition-colors">
            <span className="text-xs">Shuffle</span>
          </button>
          <button className="p-2 hover:bg-muted rounded transition-colors">
            <span className="text-xs">Repeat</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-muted rounded transition-colors">
            <span className="text-xs">Previous</span>
          </button>
          <button className="p-2 hover:bg-muted rounded transition-colors">
            <span className="text-xs">Next</span>
          </button>
        </div>
      </div>

      {!element.props.title && (
        <div className="absolute inset-0 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground pointer-events-none">
          <div className="text-center">
            <Play className="h-8 w-8 mx-auto mb-2" />
            <p>Audio Player</p>
            <p className="text-xs mt-1">
              Variant: {element.props.variant || 'card'} | 
              Size: {element.props.size || 'md'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}