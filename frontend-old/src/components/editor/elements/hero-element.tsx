import { Element, ViewMode } from '@/types/editor'
import { Button } from '@/components/ui/button'

interface HeroElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
}

export function HeroElement({ element, onUpdate, viewMode, style }: HeroElementProps) {
  return (
    <div 
      style={style}
      className="relative bg-gradient-to-r from-blue-900 to-purple-600 text-white py-20 px-6"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 
          className="text-4xl md:text-6xl font-bold mb-6 outline-none"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onUpdate(element.id, {
            props: { ...element.props, title: e.target.innerText }
          })}
          dangerouslySetInnerHTML={{ __html: element.props.title || 'Welcome to Our Website' }}
        />
        
        <p 
          className="text-xl md:text-2xl mb-8 text-slate-200 outline-none"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onUpdate(element.id, {
            props: { ...element.props, subtitle: e.target.innerText }
          })}
          dangerouslySetInnerHTML={{ __html: element.props.subtitle || 'Build amazing experiences with our platform' }}
        />
        
        <Button 
          size="lg" 
          className="bg-white text-blue-900 hover:bg-blue-100"
          onClick={(e) => e.preventDefault()}
        >
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate(element.id, {
              props: { ...element.props, buttonText: e.target.innerText }
            })}
            dangerouslySetInnerHTML={{ __html: element.props.buttonText || 'Get Started' }}
          />
        </Button>
      </div>
    </div>
  )
}
