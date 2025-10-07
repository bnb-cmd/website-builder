import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Handshake, Award, Trophy } from 'lucide-react'

interface PartnersElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function PartnersElement({ element, onUpdate, viewMode, style, children }: PartnersElementProps) {
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

  const partners = element.props.partners || [
    {
      id: 1,
      name: 'Microsoft',
      logo: '/placeholder-logo.png',
      website: '#',
      description: 'Technology Partner',
      category: 'Technology'
    },
    {
      id: 2,
      name: 'Google',
      logo: '/placeholder-logo.png',
      website: '#',
      description: 'Cloud Services Partner',
      category: 'Cloud'
    },
    {
      id: 3,
      name: 'AWS',
      logo: '/placeholder-logo.png',
      website: '#',
      description: 'Infrastructure Partner',
      category: 'Infrastructure'
    },
    {
      id: 4,
      name: 'Salesforce',
      logo: '/placeholder-logo.png',
      website: '#',
      description: 'CRM Partner',
      category: 'CRM'
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
          {element.props.title || 'Our Partners'}
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We work with industry leaders to deliver the best solutions for our clients.
        </p>
      </div>

      {/* Partner Logos */}
      <div className={getLayoutClass()}>
        {partners.map((partner: any) => (
          <div
            key={partner.id}
            className="group flex flex-col items-center justify-center p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-300"
          >
            {/* Logo */}
            <div className="w-24 h-24 mb-4 flex items-center justify-center bg-muted rounded-lg overflow-hidden">
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </div>

            {/* Partner Name */}
            <h3 className="text-lg font-semibold mb-2 text-center">
              {partner.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground text-center mb-3">
              {partner.description}
            </p>

            {/* Category Badge */}
            <span className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full">
              {partner.category}
            </span>

            {/* Website Link */}
            {element.props.showWebsite && (
              <a
                href={partner.website}
                className="mt-3 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Learn More
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Partnership Benefits */}
      {element.props.showBenefits && (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Handshake className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Strategic Partnerships</h3>
            <p className="text-muted-foreground">Collaborating with industry leaders for better solutions</p>
          </div>
          <div className="text-center">
            <Award className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Certified Expertise</h3>
            <p className="text-muted-foreground">Certified professionals with deep platform knowledge</p>
          </div>
          <div className="text-center">
            <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Proven Results</h3>
            <p className="text-muted-foreground">Track record of successful implementations</p>
          </div>
        </div>
      )}

      {partners.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
          <Handshake className="h-12 w-12 mx-auto mb-4" />
          <p>Configure partner logos in properties panel</p>
          <p className="text-xs mt-2">
            Layout: {element.props.layout || 'grid'}
          </p>
        </div>
      )}
    </div>
  )
}
