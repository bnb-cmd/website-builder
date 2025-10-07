import { Element, ViewMode } from '@/types/editor'

interface SpacerElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
}

export function SpacerElement({ element, onUpdate, viewMode, style }: SpacerElementProps) {
  const height = element.props.height || '40px'

  return (
    <div 
      style={{ ...style, height }}
      className="w-full border border-dashed border-transparent hover:border-border transition-colors"
    >
      {/* Empty spacer - just for spacing */}
    </div>
  )
}
