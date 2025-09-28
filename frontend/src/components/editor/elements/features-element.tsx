import { Element, ViewMode } from '@/types/editor'
import { Star, Zap, Shield } from 'lucide-react'

interface FeaturesElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
}

export function FeaturesElement({ element, onUpdate, viewMode, style }: FeaturesElementProps) {
  const features = element.props.features || [
    { icon: 'star', title: 'Amazing Feature', description: 'This feature will blow your mind' },
    { icon: 'zap', title: 'Lightning Fast', description: 'Get results in seconds, not hours' },
    { icon: 'shield', title: 'Secure & Safe', description: 'Your data is protected with us' }
  ]

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'star':
        return Star
      case 'zap':
        return Zap
      case 'shield':
        return Shield
      default:
        return Star
    }
  }

  return (
    <div style={style} className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl font-bold mb-4 outline-none"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate(element.id, {
              props: { ...element.props, title: e.target.innerText }
            })}
            dangerouslySetInnerHTML={{ __html: element.props.title || 'Our Amazing Features' }}
          />
          <p 
            className="text-muted-foreground text-lg outline-none"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate(element.id, {
              props: { ...element.props, subtitle: e.target.innerText }
            })}
            dangerouslySetInnerHTML={{ __html: element.props.subtitle || 'Discover what makes us special' }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature: any, index: number) => {
            const IconComponent = getIcon(feature.icon)
            return (
              <div key={index} className="text-center p-6 rounded-lg border border-border">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-4">
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
