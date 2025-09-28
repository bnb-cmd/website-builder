'use client'

import { useState } from 'react'
import { Element, ViewMode } from '@/types/editor'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Trash2, Copy, Move, Settings, Eye, EyeOff } from 'lucide-react'

// Element Components
import { TextElement } from './elements/text-element'
import { HeadingElement } from './elements/heading-element'
import { ImageElement } from './elements/image-element'
import { ButtonElement } from './elements/button-element'
import { ContainerElement } from './elements/container-element'
import { FormElement } from './elements/form-element'
import { VideoElement } from './elements/video-element'
import { DividerElement } from './elements/divider-element'
import { SpacerElement } from './elements/spacer-element'
import { HeroElement } from './elements/hero-element'
import { FeaturesElement } from './elements/features-element'
import { CTAElement } from './elements/cta-element'
import { TimelineElement } from './elements/timeline-element'
import { StatsElement } from './elements/stats-element'
import { AccordionElement } from './elements/accordion-element'
import { TabsElement } from './elements/tabs-element'
import { ProgressElement } from './elements/progress-element'
import { CountdownElement } from './elements/countdown-element'
import { TestimonialElement } from './elements/testimonial-element'
import { PricingElement } from './elements/pricing-element'
import { TeamElement } from './elements/team-element'
import { FAQElement } from './elements/faq-element'

interface ElementRendererProps {
  element: Element
  isSelected: boolean
  onSelect: (elementId: string | null) => void
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  onDelete: (elementId: string) => void
  viewMode: ViewMode
  depth?: number
}

export function ElementRenderer({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  viewMode,
  depth = 0
}: ElementRendererProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDragHovered, setIsDragHovered] = useState(false)

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect(element.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(element.id)
  }

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation()
    // This would be handled by the parent component
    console.log('Duplicate element:', element.id)
  }

  const getResponsiveStyle = () => {
    if (element.responsive) {
      switch (viewMode) {
        case 'mobile':
          return { ...element.style, ...element.responsive.mobile }
        case 'tablet':
          return { ...element.style, ...element.responsive.tablet }
        case 'desktop':
        default:
          return { ...element.style, ...element.responsive.desktop }
      }
    }
    return element.style
  }

  const renderElement = () => {
    const commonProps = {
      element,
      isSelected,
      onSelect: () => onSelect(element.id)
    }

    switch (element.type) {
      case 'text':
        return <TextElement {...commonProps} />
      case 'heading':
        return <HeadingElement {...commonProps} />
      case 'image':
        return <ImageElement {...commonProps} />
      case 'button':
        return <ButtonElement {...commonProps} />
      case 'container':
        return (
          <ContainerElement {...commonProps}>
            {element.children?.map((child) => (
              <ElementRenderer
                key={child.id}
                element={child}
                isSelected={false}
                onSelect={onSelect}
                onUpdate={onUpdate}
                onDelete={onDelete}
                viewMode={viewMode}
                depth={depth + 1}
              />
            ))}
          </ContainerElement>
        )
      case 'form':
        return <FormElement {...commonProps} />
      case 'video':
        return <VideoElement {...commonProps} />
      case 'divider':
        return <DividerElement {...commonProps} />
      case 'spacer':
        return <SpacerElement {...commonProps} />
      case 'hero':
        return <HeroElement {...commonProps} />
      case 'features':
        return <FeaturesElement {...commonProps} />
      case 'cta':
        return <CTAElement {...commonProps} />
      case 'timeline':
        return <TimelineElement {...commonProps} />
      case 'stats':
        return <StatsElement {...commonProps} />
      case 'accordion':
        return <AccordionElement {...commonProps} />
      case 'tabs':
        return <TabsElement {...commonProps} />
      case 'progress':
        return <ProgressElement {...commonProps} />
      case 'countdown':
        return <CountdownElement {...commonProps} />
      case 'testimonial':
        return <TestimonialElement {...commonProps} />
      case 'pricing':
        return <PricingElement {...commonProps} />
      case 'team':
        return <TeamElement {...commonProps} />
      case 'faq':
        return <FAQElement {...commonProps} />
      // TODO: Add more element types as we create them
      default:
        return (
          <div className="p-4 border border-dashed border-muted-foreground rounded">
            <p className="text-sm text-muted-foreground">
              Element type "{element.type}" coming soon
            </p>
          </div>
        )
    }
  }

  return (
    <div
      className={cn(
        'relative group transition-all duration-200',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        isHovered && !isSelected && 'ring-1 ring-slate-300',
        isDragHovered && 'ring-2 ring-green-400'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleSelect}
      style={getResponsiveStyle()}
    >
      {/* Element Content */}
      {renderElement()}

      {/* Element Controls */}
      {(isSelected || isHovered) && (
        <div className="absolute -top-8 left-0 flex items-center space-x-1 bg-background border border-border rounded-md shadow-sm px-2 py-1 z-50">
          <span className="text-xs font-medium text-muted-foreground capitalize">
            {element.type}
          </span>
          <div className="w-px h-4 bg-border mx-1" />
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation()
              // Open properties panel or show settings
            }}
          >
            <Settings className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={handleDuplicate}
          >
            <Copy className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Drag Handle */}
      {isSelected && (
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-primary rounded-full border-2 border-background cursor-move">
          <Move className="h-2 w-2 text-primary-foreground m-1" />
        </div>
      )}

      {/* Element Label */}
      {isSelected && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl">
          {element.type}
        </div>
      )}
    </div>
  )
}
