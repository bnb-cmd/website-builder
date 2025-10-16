import React, { useState } from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const PropertySearchConfig: ComponentConfig = {
  id: 'property-search',
  name: 'Property Search',
  category: 'business',
  icon: 'Search',
  description: 'Search and filter properties',
  defaultProps: {
    title: 'Find Your Perfect Property',
    subtitle: 'Search from thousands of properties',
    searchFields: [
      { type: 'location', label: 'Location', placeholder: 'Enter city or neighborhood' },
      { type: 'price-min', label: 'Min Price', placeholder: 'Minimum price' },
      { type: 'price-max', label: 'Max Price', placeholder: 'Maximum price' },
      { type: 'bedrooms', label: 'Bedrooms', placeholder: 'Number of bedrooms' },
      { type: 'bathrooms', label: 'Bathrooms', placeholder: 'Number of bathrooms' },
      { type: 'property-type', label: 'Property Type', placeholder: 'House, Apartment, etc.' }
    ],
    propertyTypes: ['House', 'Apartment', 'Condo', 'Townhouse', 'Studio'],
    priceRanges: [
      { label: 'Under $300k', min: 0, max: 300000 },
      { label: '$300k - $500k', min: 300000, max: 500000 },
      { label: '$500k - $750k', min: 500000, max: 750000 },
      { label: '$750k - $1M', min: 750000, max: 1000000 },
      { label: 'Over $1M', min: 1000000, max: 999999999 }
    ],
    showAdvancedFilters: true,
    showMapView: true,
    showSavedSearches: true
  },
  defaultSize: { width: 500, height: 600 },
  editableFields: [
    'title',
    'subtitle'
  ]
}

interface PropertySearchProps extends WebsiteComponentProps {
  title?: string
  subtitle?: string
  searchFields?: Array<{
    type: string
    label: string
    placeholder: string
  }>
  propertyTypes?: string[]
  priceRanges?: Array<{
    label: string
    min: number
    max: number
  }>
  showAdvancedFilters?: boolean
  showMapView?: boolean
  showSavedSearches?: boolean
}

export const PropertySearch: React.FC<PropertySearchProps> = ({ 
  deviceMode = 'desktop',
  title = 'Find Your Perfect Property',
  subtitle = 'Search from thousands of properties',
  searchFields = [],
  propertyTypes = [],
  priceRanges = [],
  showAdvancedFilters = true,
  showMapView = true,
  showSavedSearches = true
}) => {
  const [searchCriteria, setSearchCriteria] = useState({
    location: '',
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    features: [] as string[]
  })
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isMapView, setIsMapView] = useState(false)

  const textSize = getResponsiveTextSize('text-sm', deviceMode)
  const titleSize = getResponsiveTextSize('text-xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-lg', deviceMode)
  const padding = getResponsivePadding('p-6', deviceMode)
  
  const handleSearch = () => {
    console.log('Searching with criteria:', searchCriteria)
  }
  
  const handleInputChange = (field: string, value: string) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const toggleFeature = (feature: string) => {
    setSearchCriteria(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }
  
  return (
    <Card className={`w-full h-full flex flex-col ${padding}`}>
      <div className="mb-6">
        <h3 className={`font-bold mb-2 ${titleSize}`}>{title}</h3>
        <p className={`${subtitleSize} text-gray-600`}>{subtitle}</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Basic Search Fields */}
        <div className="space-y-3">
          <div>
            <label className={`block font-medium mb-1 ${textSize}`}>Location</label>
            <Input
              type="text"
              value={searchCriteria.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Enter city or neighborhood"
              className={`w-full p-2 border rounded ${textSize}`}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block font-medium mb-1 ${textSize}`}>Min Price</label>
              <Input
                type="number"
                value={searchCriteria.priceMin}
                onChange={(e) => handleInputChange('priceMin', e.target.value)}
                placeholder="Min price"
                className={`w-full p-2 border rounded ${textSize}`}
              />
            </div>
            <div>
              <label className={`block font-medium mb-1 ${textSize}`}>Max Price</label>
              <Input
                type="number"
                value={searchCriteria.priceMax}
                onChange={(e) => handleInputChange('priceMax', e.target.value)}
                placeholder="Max price"
                className={`w-full p-2 border rounded ${textSize}`}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block font-medium mb-1 ${textSize}`}>Bedrooms</label>
              <select
                value={searchCriteria.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                className={`w-full p-2 border rounded ${textSize}`}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
            <div>
              <label className={`block font-medium mb-1 ${textSize}`}>Bathrooms</label>
              <select
                value={searchCriteria.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                className={`w-full p-2 border rounded ${textSize}`}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className={`block font-medium mb-1 ${textSize}`}>Property Type</label>
            <select
              value={searchCriteria.propertyType}
              onChange={(e) => handleInputChange('propertyType', e.target.value)}
              className={`w-full p-2 border rounded ${textSize}`}
            >
              <option value="">Any Type</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center justify-between w-full p-3 border rounded ${textSize} hover:bg-gray-50`}
            >
              <span className="font-medium">Advanced Filters</span>
              <svg 
                className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showAdvanced && (
              <div className="mt-3 space-y-3 p-3 bg-gray-50 rounded">
                <div>
                  <label className={`block font-medium mb-2 ${textSize}`}>Features</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Parking', 'Garden', 'Balcony', 'Pool', 'Gym', 'Garage'].map((feature) => (
                      <label key={feature} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={searchCriteria.features.includes(feature)}
                          onChange={() => toggleFeature(feature)}
                          className="mr-2"
                        />
                        <span className={`${textSize}`}>{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className={`block font-medium mb-2 ${textSize}`}>Quick Price Ranges</label>
                  <div className="space-y-1">
                    {priceRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => {
                          setSearchCriteria(prev => ({
                            ...prev,
                            priceMin: range.min.toString(),
                            priceMax: range.max === 999999999 ? '' : range.max.toString()
                          }))
                        }}
                        className={`w-full text-left p-2 rounded hover:bg-gray-200 ${textSize}`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* View Options */}
        <div className="flex justify-between items-center">
          {showMapView && (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsMapView(false)}
                className={`px-3 py-1 rounded text-sm ${!isMapView ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                List
              </button>
              <button
                onClick={() => setIsMapView(true)}
                className={`px-3 py-1 rounded text-sm ${isMapView ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Map
              </button>
            </div>
          )}
          
          {showSavedSearches && (
            <button className={`text-blue-600 hover:text-blue-800 ${textSize}`}>
              Save Search
            </button>
          )}
        </div>
      </div>

      <Button onClick={handleSearch} className="w-full mt-4">
        Search Properties
      </Button>
    </Card>
  )
}
