'use client'

import React, { useState } from 'react'
import { Filter, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ProductFilterProps {
  categories: string[]
  priceRange: { min: number; max: number }
  brands?: string[]
  attributes?: Record<string, string[]>
  onFilterChange: (filters: any) => void
  showBrands?: boolean
  showAttributes?: boolean
  showPriceRange?: boolean
  showCategories?: boolean
  layout?: 'sidebar' | 'horizontal' | 'dropdown'
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden'],
  priceRange = { min: 0, max: 10000 },
  brands = ['Apple', 'Samsung', 'Nike', 'Adidas'],
  attributes = {
    'Size': ['S', 'M', 'L', 'XL'],
    'Color': ['Red', 'Blue', 'Green', 'Black'],
    'Material': ['Cotton', 'Polyester', 'Leather', 'Silk']
  },
  onFilterChange,
  showBrands = true,
  showAttributes = true,
  showPriceRange = true,
  showCategories = true,
  layout = 'sidebar'
}) => {
  const [filters, setFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    priceMin: priceRange.min,
    priceMax: priceRange.max,
    attributes: {} as Record<string, string[]>
  })

  const [isOpen, setIsOpen] = useState(false)

  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    
    const newFilters = { ...filters, categories: newCategories }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleBrandChange = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand]
    
    const newFilters = { ...filters, brands: newBrands }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleAttributeChange = (attribute: string, value: string) => {
    const currentValues = filters.attributes[attribute] || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    
    const newFilters = {
      ...filters,
      attributes: { ...filters.attributes, [attribute]: newValues }
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    const newFilters = {
      ...filters,
      [`price${type === 'min' ? 'Min' : 'Max'}`]: value
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      categories: [],
      brands: [],
      priceMin: priceRange.min,
      priceMax: priceRange.max,
      attributes: {}
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
      {children}
    </div>
  )

  const CheckboxList = ({ items, selectedItems, onChange }: {
    items: string[]
    selectedItems: string[]
    onChange: (item: string) => void
  }) => (
    <div className="space-y-2">
      {items.map((item) => (
        <label key={item} className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedItems.includes(item)}
            onChange={() => onChange(item)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">{item}</span>
        </label>
      ))}
    </div>
  )

  const PriceRange = () => (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <input
          type="number"
          value={filters.priceMin}
          onChange={(e) => handlePriceChange('min', parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          placeholder="Min"
        />
        <input
          type="number"
          value={filters.priceMax}
          onChange={(e) => handlePriceChange('max', parseInt(e.target.value) || priceRange.max)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          placeholder="Max"
        />
      </div>
      <div className="text-xs text-gray-500">
        Range: PKR {filters.priceMin.toLocaleString()} - PKR {filters.priceMax.toLocaleString()}
      </div>
    </div>
  )

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Clear Filters */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear All
        </button>
      </div>

      {/* Categories */}
      {showCategories && (
        <FilterSection title="Categories">
          <CheckboxList
            items={categories}
            selectedItems={filters.categories}
            onChange={handleCategoryChange}
          />
        </FilterSection>
      )}

      {/* Price Range */}
      {showPriceRange && (
        <FilterSection title="Price Range">
          <PriceRange />
        </FilterSection>
      )}

      {/* Brands */}
      {showBrands && (
        <FilterSection title="Brands">
          <CheckboxList
            items={brands}
            selectedItems={filters.brands}
            onChange={handleBrandChange}
          />
        </FilterSection>
      )}

      {/* Attributes */}
      {showAttributes && Object.entries(attributes).map(([attribute, values]) => (
        <FilterSection key={attribute} title={attribute}>
          <CheckboxList
            items={values}
            selectedItems={filters.attributes[attribute] || []}
            onChange={(value) => handleAttributeChange(attribute, value)}
          />
        </FilterSection>
      ))}
    </div>
  )

  if (layout === 'dropdown') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-20 p-4">
              <FilterContent />
            </div>
          </>
        )}
      </div>
    )
  }

  if (layout === 'horizontal') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap gap-4">
          {showCategories && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">Categories:</span>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={cn(
                    'px-3 py-1 text-sm rounded-full border transition-colors',
                    filters.categories.includes(category)
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {showBrands && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">Brands:</span>
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => handleBrandChange(brand)}
                  className={cn(
                    'px-3 py-1 text-sm rounded-full border transition-colors',
                    filters.brands.includes(brand)
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {brand}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Sidebar layout (default)
  return (
    <div className="w-64 bg-white border border-gray-200 rounded-lg p-4">
      <FilterContent />
    </div>
  )
}

// Component configuration for editor
export const ProductFilterConfig = {
  id: 'product-filter',
  name: 'Product Filter',
  description: 'Advanced product filtering with categories, brands, and attributes',
  category: 'ecommerce' as const,
  icon: 'filter',
  defaultProps: {
    categories: ['Electronics', 'Clothing', 'Books', 'Home & Garden'],
    priceRange: { min: 0, max: 10000 },
    brands: ['Apple', 'Samsung', 'Nike', 'Adidas'],
    attributes: {
      'Size': ['S', 'M', 'L', 'XL'],
      'Color': ['Red', 'Blue', 'Green', 'Black'],
      'Material': ['Cotton', 'Polyester', 'Leather', 'Silk']
    },
    showBrands: true,
    showAttributes: true,
    showPriceRange: true,
    showCategories: true,
    layout: 'sidebar'
  },
  defaultSize: { width: 100, height: 400 },
  editableFields: [
    'categories',
    'priceRange',
    'brands',
    'attributes',
    'showBrands',
    'showAttributes',
    'showPriceRange',
    'showCategories',
    'layout'
  ]
}
