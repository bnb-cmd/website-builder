import { Element, ViewMode } from '@/types/editor'
import { Button } from '@/components/ui/button'

interface CTAElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
}

export function CTAElement({ element, onUpdate, viewMode, style }: CTAElementProps) {
  return (
    <div style={style} className="bg-primary text-primary-foreground py-16 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 
          className="text-3xl md:text-4xl font-bold mb-4 outline-none"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onUpdate(element.id, {
            props: { ...element.props, title: e.target.innerText }
          })}
          dangerouslySetInnerHTML={{ __html: element.props.title || 'Ready to get started?' }}
        />
        
        <p 
          className="text-xl mb-8 text-primary-foreground/90 outline-none"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onUpdate(element.id, {
            props: { ...element.props, subtitle: e.target.innerText }
          })}
          dangerouslySetInnerHTML={{ __html: element.props.subtitle || 'Join thousands of satisfied customers today' }}
        />
        
        <Button 
          size="lg" 
          variant="secondary"
          className="mr-4 mb-4"
          onClick={(e) => e.preventDefault()}
        >
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate(element.id, {
              props: { ...element.props, primaryButtonText: e.target.innerText }
            })}
            dangerouslySetInnerHTML={{ __html: element.props.primaryButtonText || 'Get Started Now' }}
          />
        </Button>
        
        <Button 
          size="lg" 
          variant="outline"
          className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          onClick={(e) => e.preventDefault()}
        >
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate(element.id, {
              props: { ...element.props, secondaryButtonText: e.target.innerText }
            })}
            dangerouslySetInnerHTML={{ __html: element.props.secondaryButtonText || 'Learn More' }}
          />
        </Button>
      </div>
    </div>
  )
}
