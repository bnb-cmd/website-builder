import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Briefcase, Star, ExternalLink } from 'lucide-react'

interface PortfolioElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function PortfolioElement({ element, onUpdate, viewMode, style, children }: PortfolioElementProps) {
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
      case 'masonry':
        return 'columns-1 md:columns-2 lg:columns-3 gap-6'
      case 'carousel':
        return 'flex overflow-x-auto space-x-6 pb-4'
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    }
  }

  const projects = element.props.projects || [
    {
      id: 1,
      title: 'E-commerce Website',
      description: 'A modern e-commerce platform built with React and Node.js',
      image: '/placeholder-portfolio.jpg',
      category: 'Web Development',
      tags: ['React', 'Node.js', 'MongoDB'],
      link: '#',
      featured: true
    },
    {
      id: 2,
      title: 'Mobile App Design',
      description: 'UI/UX design for a fitness tracking mobile application',
      image: '/placeholder-portfolio.jpg',
      category: 'UI/UX Design',
      tags: ['Figma', 'Adobe XD', 'Prototyping'],
      link: '#',
      featured: false
    },
    {
      id: 3,
      title: 'Brand Identity',
      description: 'Complete brand identity design for a tech startup',
      image: '/placeholder-portfolio.jpg',
      category: 'Branding',
      tags: ['Logo Design', 'Brand Guidelines', 'Print Design'],
      link: '#',
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
          {element.props.title || 'Our Portfolio'}
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our latest projects and creative work.
        </p>
      </div>

      {/* Filter Tabs */}
      {element.props.showFilters && (
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {['All', 'Web Development', 'UI/UX Design', 'Branding'].map((category, index) => (
              <button
                key={index}
                className={cn(
                  'px-4 py-2 rounded-md text-sm transition-colors',
                  index === 0 ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio Items */}
      <div className={getLayoutClass()}>
        {projects.map((project: any) => (
          <div
            key={project.id}
            className={cn(
              'group relative overflow-hidden rounded-lg bg-card border border-border hover:shadow-lg transition-all duration-300',
              project.featured && 'ring-2 ring-primary'
            )}
          >
            {/* Featured Badge */}
            {project.featured && (
              <div className="absolute top-4 left-4 z-10">
                <div className="flex items-center space-x-1 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
                  <Star className="h-3 w-3" />
                  <span>Featured</span>
                </div>
              </div>
            )}

            {/* Project Image */}
            <div className="aspect-video bg-muted overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <a
                  href={project.link}
                  className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View Project</span>
                </a>
              </div>
            </div>

            {/* Project Info */}
            <div className="p-6">
              {/* Category */}
              <div className="flex items-center space-x-2 mb-2">
                <Briefcase className="h-4 w-4 text-primary" />
                <span className="text-sm text-primary font-medium">{project.category}</span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {project.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
          <Briefcase className="h-12 w-12 mx-auto mb-4" />
          <p>Configure portfolio projects in properties panel</p>
          <p className="text-xs mt-2">
            Layout: {element.props.layout || 'grid'}
          </p>
        </div>
      )}
    </div>
  )
}
