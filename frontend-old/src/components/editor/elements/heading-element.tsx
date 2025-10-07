import { Element, ViewMode } from '@/types/editor'

interface HeadingElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
}

export function HeadingElement({ element, onUpdate, viewMode, style }: HeadingElementProps) {
  const handleContentChange = (e: React.FocusEvent<HTMLHeadingElement>) => {
    const newContent = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        content: newContent
      }
    })
  }

  const HeadingTag = element.props.level || 'h2'

  return (
    <HeadingTag
      style={style}
      className="outline-none"
      contentEditable
      suppressContentEditableWarning
      onBlur={handleContentChange}
      dangerouslySetInnerHTML={{ __html: element.props.content || 'Your Heading' }}
    />
  )
}
