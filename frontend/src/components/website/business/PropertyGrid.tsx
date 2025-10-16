import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const PropertyGridConfig: ComponentConfig = {
  id: 'property-grid',
  name: 'Property Grid',
  category: 'business',
  icon: 'Home',
  description: 'Display real estate properties in a grid',
  defaultProps: {
    title: 'Featured Properties',
    subtitle: 'Find your perfect home',
    properties: [
      {
        id: '1',
        title: 'Modern Downtown Apartment',
        price: 450000,
        location: 'Downtown, City',
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        image: '/properties/apartment1.jpg',
        features: ['Parking', 'Balcony', 'Gym'],
        status: 'For Sale',
        yearBuilt: 2020
      },
      {
        id: '2',
        title: 'Luxury Family Home',
        price: 750000,
        location: 'Suburbs, City',
        bedrooms: 4,
        bathrooms: 3,
        area: 2500,
        image: '/properties/house1.jpg',
        features: ['Garden', 'Garage', 'Pool'],
        status: 'For Sale',
        yearBuilt: 2018
      },
      {
        id: '3',
        title: 'Cozy Studio Apartment',
        price: 280000,
        location: 'Midtown, City',
        bedrooms: 1,
        bathrooms: 1,
        area: 600,
        image: '/properties/studio1.jpg',
        features: ['Parking', 'Laundry'],
        status: 'For Rent',
        yearBuilt: 2022
      },
      {
        id: '4',
        title: 'Executive Penthouse',
        price: 1200000,
        location: 'Financial District',
        bedrooms: 3,
        bathrooms: 3,
        area: 2000,
        image: '/properties/penthouse1.jpg',
        features: ['Parking', 'Balcony', 'Concierge', 'Gym'],
        status: 'For Sale',
        yearBuilt: 2021
      }
    ],
    columns: 4,
    showFilters: true,
    showPrice: true,
    showFeatures: true,
    cardStyle: 'modern'
  },
  defaultSize: { width: 1000, height: 800 },
  editableFields: [
    'title',
    'subtitle',
    'columns'
  ]
}

interface Property {
  id: string
  title: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  image?: string
  features?: string[]
  status: 'For Sale' | 'For Rent' | 'Sold' | 'Rented'
  yearBuilt?: number
}

interface PropertyGridProps extends WebsiteComponentProps {
  title?: string
  subtitle?: string
  properties?: Property[]
  columns?: number
  showFilters?: boolean
  showPrice?: boolean
  showFeatures?: boolean
  cardStyle?: 'modern' | 'minimal'
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({ 
  deviceMode = 'desktop',
  title = 'Featured Properties',
  subtitle = 'Find your perfect home',
  properties = [],
  columns = 4,
  showFilters = true,
  showPrice = true,
  showFeatures = true,
  cardStyle = 'modern'
}) => {
  const textSize = getResponsiveTextSize('text-sm', deviceMode)
  const titleSize = getResponsiveTextSize('text-xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-lg', deviceMode)
  const propertyTitleSize = getResponsiveTextSize('text-lg', deviceMode)
  const priceSize = getResponsiveTextSize('text-xl', deviceMode)
  const padding = getResponsivePadding('p-6', deviceMode)
  
  const gridCols = columns === 1 ? 'grid-cols-1' : 
                   columns === 2 ? 'grid-cols-2' : 
                   columns === 3 ? 'grid-cols-3' : 
                   columns === 4 ? 'grid-cols-4' : 'grid-cols-2'
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'For Sale': return 'bg-green-100 text-green-800'
      case 'For Rent': return 'bg-blue-100 text-blue-800'
      case 'Sold': return 'bg-gray-100 text-gray-800'
      case 'Rented': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <Card className={`w-full h-full flex flex-col ${padding}`}>
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && <h3 className={`font-bold mb-2 ${titleSize}`}>{title}</h3>}
          {subtitle && <p className={`${subtitleSize} text-gray-600`}>{subtitle}</p>}
        </div>
      )}

      {showFilters && (
        <div className="mb-6 flex justify-center space-x-4">
          <Button variant="outline" size="sm">All</Button>
          <Button variant="outline" size="sm">For Sale</Button>
          <Button variant="outline" size="sm">For Rent</Button>
          <Button variant="outline" size="sm">Houses</Button>
          <Button variant="outline" size="sm">Apartments</Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className={`grid ${gridCols} gap-6`}>
          {properties.map((property) => (
            <div key={property.id} className={`${cardStyle === 'modern' ? 'bg-white rounded-lg shadow-sm overflow-hidden' : ''}`}>
              <div className="relative">
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                  {property.image ? (
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Property</span>
                    </div>
                  )}
                </div>
                <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(property.status)}`}>
                  {property.status}
                </div>
              </div>
              
              <div className="p-4">
                <h4 className={`font-semibold mb-2 ${propertyTitleSize}`}>{property.title}</h4>
                <p className={`text-gray-600 mb-2 ${textSize}`}>{property.location}</p>
                
                {showPrice && (
                  <div className={`font-bold text-blue-600 mb-3 ${priceSize}`}>
                    {formatPrice(property.price)}
                  </div>
                )}
                
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    </svg>
                    <span className={`${textSize}`}>{property.bedrooms} bed</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10.5 3L12 2l1.5 1H21v6H3V3h7.5z" />
                    </svg>
                    <span className={`${textSize}`}>{property.bathrooms} bath</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <span className={`${textSize}`}>{property.area} sq ft</span>
                  </div>
                </div>
                
                {showFeatures && property.features && property.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {property.features.map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
                
                <Button className="w-full" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
