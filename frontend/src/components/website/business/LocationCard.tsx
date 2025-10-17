import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { MapPin, Navigation, Clock, Phone } from '@/lib/icons'
import { Button } from '../../ui/button'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const LocationCardConfig: ComponentConfig = {
  id: 'location-card',
  name: 'Location Card',
  category: 'business',
  icon: 'MapPin',
  description: 'Display business location details',
  defaultProps: { 
    name: 'Main Office',
    address: '123 Business Street, Suite 100',
    city: 'New York, NY 10001',
    phone: '+1 (555) 123-4567',
    hours: 'Monday - Friday: 9:00 AM - 6:00 PM',
    mapUrl: 'https://maps.google.com',
    showMap: true,
    showDirections: true
  },
  defaultSize: { width: 350, height: 300 },
  editableFields: ['name', 'address', 'city', 'phone', 'hours', 'mapUrl', 'showMap', 'showDirections']
}

interface LocationCardProps extends WebsiteComponentProps {
  name: string
  address: string
  city: string
  phone: string
  hours: string
  mapUrl: string
  showMap: boolean
  showDirections: boolean
}

export const WebsiteLocationCard: React.FC<LocationCardProps> = ({ 
  name, 
  address, 
  city, 
  phone, 
  hours, 
  mapUrl, 
  showMap, 
  showDirections,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const padding = getResponsivePadding('p-4', deviceMode)
  const nameSize = getResponsiveTextSize('text-lg', deviceMode)
  const addressSize = getResponsiveTextSize('text-sm', deviceMode)
  const infoSize = getResponsiveTextSize('text-sm', deviceMode)

  return (
    <div className={cn("w-full h-full bg-white border border-gray-200 rounded-lg overflow-hidden", padding)}>
      <div className="space-y-4">
        <div>
          <h3 
            className={cn("font-bold mb-2", nameSize)}
            onDoubleClick={onTextDoubleClick}
          >
            {name}
          </h3>
          <div className="space-y-1">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p 
                  className={cn("text-gray-700", addressSize)}
                  onDoubleClick={onTextDoubleClick}
                >
                  {address}
                </p>
                <p 
                  className={cn("text-gray-600", addressSize)}
                  onDoubleClick={onTextDoubleClick}
                >
                  {city}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-primary flex-shrink-0" />
            <a 
              href={`tel:${phone}`}
              className={cn("text-gray-700 hover:text-primary transition-colors", infoSize)}
              onDoubleClick={onTextDoubleClick}
            >
              {phone}
            </a>
          </div>
          
          <div className="flex items-start space-x-2">
            <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <span 
              className={cn("text-gray-700", infoSize)}
              onDoubleClick={onTextDoubleClick}
            >
              {hours}
            </span>
          </div>
        </div>
        
        {showMap && (
          <div className="h-24 bg-gray-200 rounded-md flex items-center justify-center">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
        )}
        
        {showDirections && (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Navigation className="w-4 h-4 mr-2" />
              Directions
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              View Map
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
