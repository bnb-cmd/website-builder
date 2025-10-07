import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Users, Target, Award, Heart } from 'lucide-react'

interface AboutElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function AboutElement({ element, onUpdate, viewMode, style, children }: AboutElementProps) {
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

  const handleDescriptionChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newDescription = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        description: newDescription
      }
    })
  }

  const getLayoutClass = () => {
    switch (element.props.layout) {
      case 'side-by-side':
        return 'grid grid-cols-1 lg:grid-cols-2 gap-12'
      case 'centered':
        return 'max-w-4xl mx-auto text-center'
      case 'stacked':
        return 'flex flex-col space-y-8'
      default:
        return 'grid grid-cols-1 lg:grid-cols-2 gap-12'
    }
  }

  const stats = element.props.stats || [
    { label: 'Years Experience', value: '5+', icon: Award },
    { label: 'Happy Clients', value: '100+', icon: Users },
    { label: 'Projects Completed', value: '200+', icon: Target },
    { label: 'Team Members', value: '10+', icon: Heart }
  ]

  return (
    <div
      className={cn(
        'w-full py-16',
        getLayoutClass()
      )}
      style={style}
    >
      {/* Content Section */}
      <div className="space-y-6">
        <div>
          <div
            className="text-4xl font-bold mb-4"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleTitleChange}
          >
            {element.props.title || 'About Us'}
          </div>
          <div
            className="text-xl text-muted-foreground mb-6"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleSubtitleChange}
          >
            {element.props.subtitle || 'We are passionate about creating amazing digital experiences'}
          </div>
          <div
            className="text-muted-foreground leading-relaxed"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleDescriptionChange}
          >
            {element.props.description || 'Our team of experienced professionals is dedicated to delivering high-quality solutions that help businesses grow and succeed in the digital world. We combine creativity with technical expertise to create innovative solutions that make a difference.'}
          </div>
        </div>

        {/* Stats */}
        {element.props.showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {stats.map((stat: any, index: number) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3 mx-auto">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Button */}
        {element.props.showCTA && (
          <div className="mt-8">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              Learn More About Us
            </button>
          </div>
        )}
      </div>

      {/* Image Section */}
      {element.props.showImage && (
        <div className="relative">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <img
              src={element.props.image || '/placeholder-about.jpg'}
              alt="About us"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Image Overlay */}
          {element.props.showImageOverlay && (
            <div className="absolute inset-0 bg-primary/20 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-2xl font-bold mb-2">Our Team</div>
                <div className="text-sm opacity-90">Working together to achieve excellence</div>
              </div>
            </div>
          )}
        </div>
      )}

      {!children && (
        <div className="absolute inset-0 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground pointer-events-none">
          <div className="text-center">
            <p>About Component</p>
            <p className="text-xs mt-1">
              Layout: {element.props.layout || 'side-by-side'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
