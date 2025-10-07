import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Building2, Star, Quote } from 'lucide-react'

interface ClientsElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function ClientsElement({ element, onUpdate, viewMode, style, children }: ClientsElementProps) {
  const handleTitleChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newTitle = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        title: newTitle
      }
    })
  }

  const getLayoutClass = () => {
    switch (element.props.layout) {
      case 'grid':
        return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
      case 'carousel':
        return 'flex overflow-x-auto space-x-6 pb-4'
      case 'logos':
        return 'flex flex-wrap justify-center items-center gap-8'
      default:
        return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
    }
  }

  const clients = element.props.clients || [
    {
      id: 1,
      name: 'TechCorp',
      logo: '/placeholder-logo.png',
      website: '#',
      testimonial: 'Outstanding work! They delivered exactly what we needed.',
      rating: 5
    },
    {
      id: 2,
      name: 'StartupXYZ',
      logo: '/placeholder-logo.png',
      website: '#',
      testimonial: 'Professional team with great attention to detail.',
      rating: 5
    },
    {
      id: 3,
      name: 'Global Inc',
      logo: '/placeholder-logo.png',
      website: '#',
      testimonial: 'Exceeded our expectations in every way.',
      rating: 5
    },
    {
      id: 4,
      name: 'Innovate Co',
      logo: '/placeholder-logo.png',
      website: '#',
      testimonial: 'Highly recommended for any web project.',
      rating: 5
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
          {element.props.title || 'Our Clients'}
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Trusted by companies worldwide to deliver exceptional results.
        </p>
      </div>

      {/* Client Logos */}
      <div className={getLayoutClass()}>
        {clients.map((client: any) => (
          <div
            key={client.id}
            className="group flex flex-col items-center justify-center p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-300"
          >
            {/* Logo */}
            <div className="w-20 h-20 mb-4 flex items-center justify-center bg-muted rounded-lg overflow-hidden">
              <img
                src={client.logo}
                alt={client.name}
                className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </div>

            {/* Company Name */}
            <h3 className="text-lg font-semibold mb-2 text-center">
              {client.name}
            </h3>

            {/* Rating */}
            {element.props.showRating && (
              <div className="flex items-center space-x-1 mb-3">
                {Array.from({ length: client.rating }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            )}

            {/* Testimonial */}
            {element.props.showTestimonials && (
              <div className="text-center">
                <Quote className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground italic">
                  "{client.testimonial}"
                </p>
              </div>
            )}

            {/* Website Link */}
            {element.props.showWebsite && (
              <a
                href={client.website}
                className="mt-3 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Visit Website
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Stats */}
      {element.props.showStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">100+</div>
            <div className="text-muted-foreground">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-muted-foreground">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">5+</div>
            <div className="text-muted-foreground">Years Experience</div>
          </div>
        </div>
      )}

      {clients.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
          <Building2 className="h-12 w-12 mx-auto mb-4" />
          <p>Configure client logos in properties panel</p>
          <p className="text-xs mt-2">
            Layout: {element.props.layout || 'grid'}
          </p>
        </div>
      )}
    </div>
  )
}
