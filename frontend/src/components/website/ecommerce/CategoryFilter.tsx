import React, { useState } from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Filter, X } from '@/lib/icons'
import { Button } from '../../ui/button'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const CategoryFilterConfig: ComponentConfig = {
  id: 'category-filter',
  name: 'Category Filter',
  category: 'ecommerce',
  icon: 'Filter',
  description: 'Filter products by category',
  defaultProps: { 
    title: 'Filter by Category',
    categories: [
      { name: 'Electronics', count: 45 },
      { name: 'Clothing', count: 32 },
      { name: 'Home & Garden', count: 28 },
      { name: 'Sports', count: 15 },
      { name: 'Books', count: 22 }
    ],
    priceRange: { min: 0, max: 1000 },
    showPriceRange: true,
    showClearAll: true
  },
  defaultSize: { width: 250, height: 400 },
  editableFields: ['title', 'categories', 'priceRange', 'showPriceRange', 'showClearAll']
}

interface Category {
  name: string
  count: number
}

interface PriceRange {
  min: number
  max: number
}

interface CategoryFilterProps extends WebsiteComponentProps {
  title: string
  categories: Category[]
  priceRange: PriceRange
  showPriceRange: boolean
  showClearAll: boolean
}

export const WebsiteCategoryFilter: React.FC<CategoryFilterProps> = ({ 
  title, 
  categories, 
  priceRange, 
  showPriceRange, 
  showClearAll,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    )
  }

  const clearAll = () => {
    setSelectedCategories([])
  }

  const padding = getResponsivePadding('p-4', deviceMode)
  const titleSize = getResponsiveTextSize('text-lg', deviceMode)
  const categorySize = getResponsiveTextSize('text-sm', deviceMode)
  const labelSize = getResponsiveTextSize('text-sm', deviceMode)

  return (
    <div className={cn("w-full h-full bg-white border border-gray-200 rounded-lg", padding)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 
            className={cn("font-semibold", titleSize)}
            onDoubleClick={onTextDoubleClick}
          >
            {title}
          </h3>
          {showClearAll && selectedCategories.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
        
        {/* Categories */}
        <div className="space-y-2">
          <h4 className={cn("font-medium text-gray-700", labelSize)}>Categories</h4>
          <div className="space-y-1">
            {categories.map((category, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.name)}
                  onChange={() => toggleCategory(category.name)}
                  className="rounded border-gray-300"
                />
                <span className={cn("flex-1", categorySize)}>{category.name}</span>
                <span className={cn("text-gray-500", categorySize)}>({category.count})</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Price Range */}
        {showPriceRange && (
          <div className="space-y-2">
            <h4 className={cn("font-medium text-gray-700", labelSize)}>Price Range</h4>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  readOnly
                  className={cn("w-full px-2 py-1 border border-gray-300 rounded text-sm", categorySize)}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  readOnly
                  className={cn("w-full px-2 py-1 border border-gray-300 rounded text-sm", categorySize)}
                />
              </div>
              <div className="text-center">
                <Button variant="outline" size="sm" className="w-full">
                  Apply Filter
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
