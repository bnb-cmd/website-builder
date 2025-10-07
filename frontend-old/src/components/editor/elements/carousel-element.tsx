import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function CarouselElement({ element, onUpdate, viewMode, style, children }: CarouselElementProps) {
  const items = element.props.items || []
  const currentItem = element.props.currentItem || 0
  const itemsPerView = element.props.itemsPerView || 3
  const autoplay = element.props.autoplay || false
  const showArrows = element.props.showArrows !== false
  const showDots = element.props.showDots !== false

  const handleItemChange = (index: number) => {
    onUpdate(element.id, {
      props: {
        ...element.props,
        currentItem: index
      }
    })
  }

  const handleNext = () => {
    const maxIndex = Math.max(0, items.length - itemsPerView)
    const nextItem = Math.min(currentItem + 1, maxIndex)
    handleItemChange(nextItem)
  }

  const handlePrev = () => {
    const prevItem = Math.max(0, currentItem - 1)
    handleItemChange(prevItem)
  }

  const getResponsiveItemsPerView = () => {
    const responsive = element.props.responsive || {}
    return {
      desktop: itemsPerView,
      tablet: responsive.tablet || Math.min(itemsPerView, 2),
      mobile: responsive.mobile || 1
    }
  }

  const responsiveItems = getResponsiveItemsPerView()

  return (
    <div
      className="relative w-full overflow-hidden"
      style={style}
    >
      <div className="relative">
        {/* Items Container */}
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentItem * (100 / itemsPerView)}%)` }}
        >
          {items.map((item: any, index: number) => (
            <div 
              key={index} 
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg p-4">
                {item.content || `Item ${index + 1}`}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {showArrows && items.length > itemsPerView && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              onClick={handlePrev}
              disabled={currentItem === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              onClick={handleNext}
              disabled={currentItem >= items.length - itemsPerView}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {showDots && items.length > itemsPerView && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {Array.from({ length: Math.ceil(items.length / itemsPerView) }).map((_, index) => (
              <button
                key={index}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  index === Math.floor(currentItem / itemsPerView) ? 'bg-primary' : 'bg-white/50'
                )}
                onClick={() => handleItemChange(index * itemsPerView)}
              />
            ))}
          </div>
        )}
      </div>

      {items.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
          <p>Configure carousel items in properties panel</p>
          <p className="text-xs mt-2">
            Items per view: {itemsPerView} | 
            Autoplay: {autoplay ? 'On' : 'Off'} | 
            Arrows: {showArrows ? 'On' : 'Off'} | 
            Dots: {showDots ? 'On' : 'Off'}
          </p>
        </div>
      )}
    </div>
  )
}
