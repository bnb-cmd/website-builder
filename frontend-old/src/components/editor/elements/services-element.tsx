import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Settings, CheckCircle, ArrowRight } from 'lucide-react'

interface ServicesElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function ServicesElement({ element, onUpdate, viewMode, style, children }: ServicesElementProps) {
  const handleTitleChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newTitle = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        title: newTitle
      }
    })
  }

  const handleSubtitleChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newSubtitle = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        subtitle: newSubtitle
      }
    })
  }

  const getLayoutClass = () => {
    switch (element.props.layout) {
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      case 'list':
        return 'space-y-6'
      case 'cards':
        return 'grid grid-cols-1 md:grid-cols-2 gap-6'
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    }
  }

  const services = element.props.services || [
    {
      id: 1,
      title: 'Web Development',
      description: 'Custom websites and web applications built with modern technologies',
      icon: Settings,
      features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Mobile Friendly'],
      price: 'Starting at $2,500'
    },
    {
      id: 2,
      title: 'UI/UX Design',
      description: 'Beautiful and intuitive user interfaces that enhance user experience',
      icon: CheckCircle,
      features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
      price: 'Starting at $1,500'
    },
    {
      id: 3,
      title: 'Brand Identity',
      description: 'Complete brand identity design including logo, colors, and guidelines',
      icon: ArrowRight,
      features: ['Logo Design', 'Brand Guidelines', 'Color Palette', 'Typography'],
      price: 'Starting at $800'
    }
  ]

  return (
    <div
      className="w-full"
      style={style}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <div
          className="text-4xl font-bold mb-4"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTitleChange}
        >
          {element.props.title || 'Our Services'}
        </div>
        <div
          className="text-muted-foreground max-w-2xl mx-auto"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleSubtitleChange}
        >
          {element.props.subtitle || 'We provide comprehensive solutions to help your business grow and succeed.'}
        </div>
      </div>

      {/* Services */}
      <div className={getLayoutClass()}>
        {services.map((service: any) => (
          <div
            key={service.id}
            className="group bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/20"
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <service.icon className="h-8 w-8" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
              {service.title}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground mb-4">
              {service.description}
            </p>

            {/* Features */}
            {element.props.showFeatures && (
              <ul className="space-y-2 mb-4">
                {service.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Price */}
            {element.props.showPricing && (
              <div className="text-lg font-semibold text-primary mb-4">
                {service.price}
              </div>
            )}

            {/* CTA Button */}
            <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2">
              <span>Learn More</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      {element.props.showBottomCTA && (
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            Get Started Today
          </button>
        </div>
      )}

      {services.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
          <Settings className="h-12 w-12 mx-auto mb-4" />
          <p>Configure services in properties panel</p>
          <p className="text-xs mt-2">
            Layout: {element.props.layout || 'grid'}
          </p>
        </div>
      )}
    </div>
  )
}
