import { Element, ViewMode } from '@/types/editor'

interface TextElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
}

export function TextElement({ element, onUpdate, viewMode, style }: TextElementProps) {
  const handleContentChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newContent = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        content: newContent
      }
    })
  }

  return (
    <div
      style={style}
      className="outline-none"
      contentEditable
      suppressContentEditableWarning
      onBlur={handleContentChange}
      dangerouslySetInnerHTML={{ __html: element.props.content || 'Enter your text here' }}
    />
  )
}
