import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SliderElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function SliderElement({ element, onUpdate, viewMode, style, children }: SliderElementProps) {
  const slides = element.props.slides || []
  const currentSlide = element.props.currentSlide || 0
  const autoplay = element.props.autoplay || false
  const showArrows = element.props.showArrows !== false
  const showDots = element.props.showDots !== false

  const handleSlideChange = (index: number) => {
    onUpdate(element.id, {
      props: {
        ...element.props,
        currentSlide: index
      }
    })
  }

  const handleNext = () => {
    const nextSlide = (currentSlide + 1) % slides.length
    handleSlideChange(nextSlide)
  }

  const handlePrev = () => {
    const prevSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1
    handleSlideChange(prevSlide)
  }

  return (
    <div
      className="relative w-full overflow-hidden"
      style={style}
    >
      <div className="relative h-full">
        {/* Slides Container */}
        <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((slide: any, index: number) => (
            <div key={index} className="w-full flex-shrink-0">
              <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
                {slide.content || `Slide ${index + 1}`}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {showArrows && slides.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {showDots && slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {slides.map((_: any, index: number) => (
              <button
                key={index}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  index === currentSlide ? 'bg-primary' : 'bg-white/50'
                )}
                onClick={() => handleSlideChange(index)}
              />
            ))}
          </div>
        )}
      </div>

      {slides.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
          <p>Configure slides in properties panel</p>
          <p className="text-xs mt-2">
            Autoplay: {autoplay ? 'On' : 'Off'} | 
            Arrows: {showArrows ? 'On' : 'Off'} | 
            Dots: {showDots ? 'On' : 'Off'}
          </p>
        </div>
      )}
    </div>
  )
}
