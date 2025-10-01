import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ImageIcon } from 'lucide-react'

interface GalleryElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function GalleryElement({ element, onUpdate, viewMode, style, children }: GalleryElementProps) {
  const images = element.props.images || []
  const columns = element.props.columns || 3
  const gap = element.props.gap || '16px'
  const aspectRatio = element.props.aspectRatio || 'square'

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square'
      case 'portrait':
        return 'aspect-[3/4]'
      case 'landscape':
        return 'aspect-[4/3]'
      case 'wide':
        return 'aspect-[16/9]'
      default:
        return 'aspect-square'
    }
  }

  const getColumnsClass = () => {
    const responsive = element.props.responsive || {}
    return {
      desktop: `grid-cols-${columns}`,
      tablet: `md:grid-cols-${responsive.tablet || Math.min(columns, 2)}`,
      mobile: `sm:grid-cols-${responsive.mobile || 1}`
    }
  }

  const columnsClass = getColumnsClass()

  return (
    <div
      className={cn(
        'grid w-full gap-4',
        columnsClass.desktop,
        columnsClass.tablet,
        columnsClass.mobile
      )}
      style={{ gap, ...style }}
    >
      {images.map((image: any, index: number) => (
        <div
          key={index}
          className={cn(
            'relative overflow-hidden rounded-lg bg-muted',
            getAspectRatioClass()
          )}
        >
          <img
            src={image.url || image.src || '/placeholder-image.jpg'}
            alt={image.alt || `Gallery image ${index + 1}`}
            className="w-full h-full object-cover"
          />
          {image.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-sm">
              {image.caption}
            </div>
          )}
        </div>
      ))}
      
      {images.length === 0 && (
        <div className="col-span-full border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-4" />
          <p>Configure gallery images in properties panel</p>
          <p className="text-xs mt-2">
            Columns: {columns} | Aspect Ratio: {aspectRatio}
          </p>
        </div>
      )}
    </div>
  )
}