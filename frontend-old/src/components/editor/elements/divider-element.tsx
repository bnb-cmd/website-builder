import { Element, ViewMode } from '@/types/editor'

interface DividerElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
}

export function DividerElement({ element, onUpdate, viewMode, style }: DividerElementProps) {
  const dividerStyle = element.props.style || 'solid'
  const color = element.props.color || '#e5e7eb'
  const thickness = element.props.thickness || '1px'

  return (
    <div style={style} className="w-full py-4">
      <hr 
        style={{
          borderStyle: dividerStyle,
          borderColor: color,
          borderWidth: `${thickness} 0 0 0`,
          margin: 0
        }}
      />
    </div>
  )
}
