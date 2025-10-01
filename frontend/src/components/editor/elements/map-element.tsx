import { Element, ViewMode } from '@/types/editor'
import { cn } from '@/lib/utils'
import { MapPin } from 'lucide-react'

interface MapElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
}

export function MapElement({ element, onUpdate, viewMode, style }: MapElementProps) {
  const handleAddressChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newAddress = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        address: newAddress
      }
    })
  }

  const getMapHeight = () => {
    const height = element.props.height || 'medium'
    switch (height) {
      case 'small':
        return 'h-48'
      case 'medium':
        return 'h-64'
      case 'large':
        return 'h-80'
      case 'xl':
        return 'h-96'
      default:
        return 'h-64'
    }
  }

  const getMapType = () => {
    return element.props.mapType || 'roadmap'
  }

  const getZoom = () => {
    return element.props.zoom || 15
  }

  return (
    <div
      className={cn(
        'w-full bg-muted rounded-lg overflow-hidden',
        getMapHeight()
      )}
      style={style}
    >
      {/* Map Placeholder */}
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
        <MapPin className="h-12 w-12 text-blue-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Interactive Map</h3>
        
        <div
          className="text-sm text-gray-600 text-center max-w-xs"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleAddressChange}
        >
          {element.props.address || 'Enter address or location'}
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>Map Type: {getMapType()}</p>
          <p>Zoom Level: {getZoom()}</p>
          <p>Height: {element.props.height || 'medium'}</p>
        </div>
      </div>
      
      {/* Map Integration Note */}
      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        Configure with Google Maps API
      </div>
    </div>
  )
}
