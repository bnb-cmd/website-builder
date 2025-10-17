'use client'

import React, { useState } from 'react'
import { Star, Heart, ShoppingCart, Eye, Share2, CheckCircle, Truck, Shield, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ProductSpecificationsProps {
  product: {
    id: string
    name: string
    specifications: Record<string, string | number | boolean>
    categories: string[]
    features: string[]
    dimensions?: {
      length: number
      width: number
      height: number
      weight: number
      unit: 'cm' | 'in' | 'mm'
    }
    warranty?: {
      period: string
      type: string
      coverage: string[]
    }
    shipping?: {
      weight: number
      dimensions: string
      origin: string
      deliveryTime: string
    }
  }
  showCategories?: boolean
  showFeatures?: boolean
  showDimensions?: boolean
  showWarranty?: boolean
  showShipping?: boolean
  showComparison?: boolean
  layout?: 'table' | 'list' | 'cards' | 'compact'
  maxSpecifications?: number
  showAllSpecs?: boolean
  onSpecificationClick?: (spec: string, value: string | number | boolean) => void
}

export const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({
  product = {
    id: '1',
    name: 'Premium Wireless Headphones',
    specifications: {
      'Driver Size': '40mm',
      'Frequency Response': '20Hz - 20kHz',
      'Impedance': '32 Ohms',
      'Battery Life': '30 hours',
      'Charging Time': '2 hours',
      'Weight': '250g',
      'Connectivity': 'Bluetooth 5.0',
      'Noise Cancellation': true,
      'Water Resistance': 'IPX4',
      'Microphone': true,
      'Quick Charge': true,
      'Foldable': true
    },
    categories: ['Electronics', 'Audio', 'Wireless'],
    features: [
      'Active Noise Cancellation',
      '30-hour Battery Life',
      'Quick Charge Technology',
      'Premium Sound Quality',
      'Comfortable Over-Ear Design',
      'Foldable for Portability'
    ],
    dimensions: {
      length: 20,
      width: 18,
      height: 8,
      weight: 250,
      unit: 'cm'
    },
    warranty: {
      period: '1 Year',
      type: 'Manufacturer Warranty',
      coverage: ['Hardware defects', 'Manufacturing faults', 'Battery replacement']
    },
    shipping: {
      weight: 0.5,
      dimensions: '20 x 18 x 8 cm',
      origin: 'Pakistan',
      deliveryTime: '2-3 business days'
    }
  },
  showCategories = true,
  showFeatures = true,
  showDimensions = true,
  showWarranty = true,
  showShipping = true,
  showComparison = true,
  layout = 'table',
  maxSpecifications = 20,
  showAllSpecs = false,
  onSpecificationClick
}) => {
  const [expandedSpecs, setExpandedSpecs] = useState(false)

  const formatValue = (value: string | number | boolean) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }
    return value.toString()
  }

  const getValueColor = (value: string | number | boolean) => {
    if (typeof value === 'boolean') {
      return value ? 'text-green-600' : 'text-red-600'
    }
    return 'text-gray-900'
  }

  const toggleExpandedSpecs = () => {
    setExpandedSpecs(!expandedSpecs)
  }

  const displayedSpecs = showAllSpecs 
    ? Object.entries(product.specifications)
    : Object.entries(product.specifications).slice(0, maxSpecifications)

  const TableView = () => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <tbody>
          {displayedSpecs.map(([key, value]) => (
            <tr key={key} className="border-b border-gray-100 last:border-b-0">
              <td className="p-4 font-medium text-gray-700 bg-gray-50 w-1/3">
                {key}
              </td>
              <td 
                className={cn(
                  'p-4 text-gray-900 cursor-pointer hover:bg-gray-50 transition',
                  getValueColor(value)
                )}
                onClick={() => onSpecificationClick?.(key, value)}
              >
                {formatValue(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {!showAllSpecs && Object.entries(product.specifications).length > maxSpecifications && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={toggleExpandedSpecs}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {expandedSpecs ? 'Show Less' : `Show All ${Object.entries(product.specifications).length} Specifications`}
          </button>
        </div>
      )}
    </div>
  )

  const ListView = () => (
    <div className="space-y-4">
      {displayedSpecs.map(([key, value]) => (
        <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-700">{key}</span>
          <span 
            className={cn(
              'text-gray-900 cursor-pointer hover:text-blue-600 transition',
              getValueColor(value)
            )}
            onClick={() => onSpecificationClick?.(key, value)}
          >
            {formatValue(value)}
          </span>
        </div>
      ))}
      
      {!showAllSpecs && Object.entries(product.specifications).length > maxSpecifications && (
        <button
          onClick={toggleExpandedSpecs}
          className="w-full p-3 text-blue-600 hover:text-blue-800 font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition"
        >
          {expandedSpecs ? 'Show Less' : `Show All ${Object.entries(product.specifications).length} Specifications`}
        </button>
      )}
    </div>
  )

  const CardsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayedSpecs.map(([key, value]) => (
        <div key={key} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
          <h4 className="font-medium text-gray-900 mb-2">{key}</h4>
          <p 
            className={cn(
              'text-gray-700 cursor-pointer hover:text-blue-600 transition',
              getValueColor(value)
            )}
            onClick={() => onSpecificationClick?.(key, value)}
          >
            {formatValue(value)}
          </p>
        </div>
      ))}
      
      {!showAllSpecs && Object.entries(product.specifications).length > maxSpecifications && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center">
          <button
            onClick={toggleExpandedSpecs}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {expandedSpecs ? 'Show Less' : `Show All ${Object.entries(product.specifications).length} Specifications`}
          </button>
        </div>
      )}
    </div>
  )

  const CompactView = () => (
    <div className="space-y-2">
      {displayedSpecs.map(([key, value]) => (
        <div key={key} className="flex justify-between items-center text-sm">
          <span className="text-gray-600">{key}:</span>
          <span 
            className={cn(
              'font-medium cursor-pointer hover:text-blue-600 transition',
              getValueColor(value)
            )}
            onClick={() => onSpecificationClick?.(key, value)}
          >
            {formatValue(value)}
          </span>
        </div>
      ))}
      
      {!showAllSpecs && Object.entries(product.specifications).length > maxSpecifications && (
        <button
          onClick={toggleExpandedSpecs}
          className="w-full text-xs text-blue-600 hover:text-blue-800 font-medium py-2"
        >
          {expandedSpecs ? 'Show Less' : `Show All ${Object.entries(product.specifications).length} Specifications`}
        </button>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Categories */}
      {showCategories && product.categories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {product.categories.map((category, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      {showFeatures && product.features.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Dimensions */}
      {showDimensions && product.dimensions && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Dimensions</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{product.dimensions.length}</div>
                <div className="text-sm text-gray-600">Length ({product.dimensions.unit})</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{product.dimensions.width}</div>
                <div className="text-sm text-gray-600">Width ({product.dimensions.unit})</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{product.dimensions.height}</div>
                <div className="text-sm text-gray-600">Height ({product.dimensions.unit})</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{product.dimensions.weight}</div>
                <div className="text-sm text-gray-600">Weight (g)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warranty */}
      {showWarranty && product.warranty && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Warranty</h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">{product.warranty.period} {product.warranty.type}</span>
            </div>
            <ul className="text-sm text-green-800 space-y-1">
              {product.warranty.coverage.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Shipping */}
      {showShipping && product.shipping && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Information</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Delivery Time</span>
                </div>
                <p className="text-sm text-blue-800">{product.shipping.deliveryTime}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-blue-900">Origin</span>
                </div>
                <p className="text-sm text-blue-800">{product.shipping.origin}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-blue-900">Weight</span>
                </div>
                <p className="text-sm text-blue-800">{product.shipping.weight} kg</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-blue-900">Dimensions</span>
                </div>
                <p className="text-sm text-blue-800">{product.shipping.dimensions}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Specifications */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Specifications</h3>
        {layout === 'table' && <TableView />}
        {layout === 'list' && <ListView />}
        {layout === 'cards' && <CardsView />}
        {layout === 'compact' && <CompactView />}
      </div>
    </div>
  )
}

// Component configuration for editor
export const ProductSpecificationsConfig = {
  id: 'product-specifications',
  name: 'Product Specifications',
  description: 'Product specifications with technical details and features',
  category: 'ecommerce' as const,
  icon: 'list',
  defaultProps: {
    product: {
      id: '1',
      name: 'Premium Wireless Headphones',
      specifications: {
        'Driver Size': '40mm',
        'Frequency Response': '20Hz - 20kHz',
        'Impedance': '32 Ohms',
        'Battery Life': '30 hours',
        'Charging Time': '2 hours',
        'Weight': '250g',
        'Connectivity': 'Bluetooth 5.0',
        'Noise Cancellation': true,
        'Water Resistance': 'IPX4',
        'Microphone': true,
        'Quick Charge': true,
        'Foldable': true
      },
      categories: ['Electronics', 'Audio', 'Wireless'],
      features: [
        'Active Noise Cancellation',
        '30-hour Battery Life',
        'Quick Charge Technology',
        'Premium Sound Quality'
      ],
      dimensions: {
        length: 20,
        width: 18,
        height: 8,
        weight: 250,
        unit: 'cm'
      },
      warranty: {
        period: '1 Year',
        type: 'Manufacturer Warranty',
        coverage: ['Hardware defects', 'Manufacturing faults', 'Battery replacement']
      },
      shipping: {
        weight: 0.5,
        dimensions: '20 x 18 x 8 cm',
        origin: 'Pakistan',
        deliveryTime: '2-3 business days'
      }
    },
    showCategories: true,
    showFeatures: true,
    showDimensions: true,
    showWarranty: true,
    showShipping: true,
    showComparison: true,
    layout: 'table',
    maxSpecifications: 20,
    showAllSpecs: false
  },
  defaultSize: { width: 100, height: 600 },
  editableFields: [
    'product',
    'showCategories',
    'showFeatures',
    'showDimensions',
    'showWarranty',
    'showShipping',
    'showComparison',
    'layout',
    'maxSpecifications',
    'showAllSpecs'
  ]
}
