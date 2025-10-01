import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Award, Star, Trophy } from 'lucide-react'

interface AwardsElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function AwardsElement({ element, onUpdate, viewMode, style, children }: AwardsElementProps) {
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
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      case 'timeline':
        return 'space-y-6'
      case 'carousel':
        return 'flex overflow-x-auto space-x-6 pb-4'
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    }
  }

  const awards = element.props.awards || [
    {
      id: 1,
      title: 'Best Web Design 2024',
      organization: 'Web Design Awards',
      year: '2024',
      category: 'Design Excellence',
      description: 'Recognized for outstanding creativity and user experience design',
      icon: Award,
      featured: true
    },
    {
      id: 2,
      title: 'Top Developer Award',
      organization: 'Tech Innovation Summit',
      year: '2023',
      category: 'Technical Excellence',
      description: 'Awarded for innovative solutions and technical expertise',
      icon: Star,
      featured: false
    },
    {
      id: 3,
      title: 'Client Satisfaction Award',
      organization: 'Business Excellence Forum',
      year: '2023',
      category: 'Customer Service',
      description: 'Recognized for exceptional client satisfaction and service',
      icon: Trophy,
      featured: true
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
          {element.props.title || 'Awards & Recognition'}
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Proud to be recognized by industry leaders and organizations.
        </p>
      </div>

      {/* Awards */}
      <div className={getLayoutClass()}>
        {awards.map((award: any) => (
          <div
            key={award.id}
            className={cn(
              'group relative bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300',
              award.featured && 'ring-2 ring-primary'
            )}
          >
            {/* Featured Badge */}
            {award.featured && (
              <div className="absolute top-4 right-4">
                <div className="flex items-center space-x-1 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
                  <Star className="h-3 w-3" />
                  <span>Featured</span>
                </div>
              </div>
            )}

            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <award.icon className="h-8 w-8" />
            </div>

            {/* Award Title */}
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              {award.title}
            </h3>

            {/* Organization */}
            <div className="text-primary font-medium mb-2">
              {award.organization}
            </div>

            {/* Year */}
            <div className="text-sm text-muted-foreground mb-3">
              {award.year}
            </div>

            {/* Category */}
            <div className="mb-3">
              <span className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                {award.category}
              </span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-sm">
              {award.description}
            </p>
          </div>
        ))}
      </div>

      {/* Stats */}
      {element.props.showStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">15+</div>
            <div className="text-muted-foreground">Awards Won</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">5</div>
            <div className="text-muted-foreground">Years of Recognition</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">10+</div>
            <div className="text-muted-foreground">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">100%</div>
            <div className="text-muted-foreground">Client Satisfaction</div>
          </div>
        </div>
      )}

      {awards.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
          <Award className="h-12 w-12 mx-auto mb-4" />
          <p>Configure awards in properties panel</p>
          <p className="text-xs mt-2">
            Layout: {element.props.layout || 'grid'}
          </p>
        </div>
      )}
    </div>
  )
}
