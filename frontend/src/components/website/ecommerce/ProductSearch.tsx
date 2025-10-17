'use client'

import React, { useState } from 'react'
import { Search, Filter, Grid, List, SlidersHorizontal, Star, Heart, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ProductSearchProps {
  onSearch: (query: string, filters: any) => void
  onFilterChange: (filters: any) => void
  categories: string[]
  brands: string[]
  priceRange: { min: number; max: number }
  showFilters?: boolean
  showCategories?: boolean
  showBrands?: boolean
  showPriceRange?: boolean
  showSort?: boolean
  showViewToggle?: boolean
  searchPlaceholder?: string
  sortOptions?: Array<{
    value: string
    label: string
  }>
  layout?: 'horizontal' | 'vertical' | 'compact'
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  onSearch,
  onFilterChange,
  categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden'],
  brands = ['Apple', 'Samsung', 'Nike', 'Adidas'],
  priceRange = { min: 0, max: 10000 },
  showFilters = true,
  showCategories = true,
  showBrands = true,
  showPriceRange = true,
  showSort = true,
  showViewToggle = true,
  searchPlaceholder = 'Search products...',
  sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' }
  ],
  layout = 'horizontal'
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('relevance')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    priceMin: priceRange.min,
    priceMax: priceRange.max
  })

  const handleSearch = () => {
    onSearch(searchQuery, filters)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

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
      priceMax: priceRange.max
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`
  }

  if (layout === 'vertical') {
    return (
      <div className="w-64 bg-white border border-gray-200 rounded-lg p-4">
        <div className="space-y-6">
          {/* Search */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Search</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              className="w-full mt-2 bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>

          {/* Categories */}
          {showCategories && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price Range */}
          {showPriceRange && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
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
                  Range: {formatPrice(filters.priceMin)} - {formatPrice(filters.priceMax)}
                </div>
              </div>
            </div>
          )}

          {/* Brands */}
          {showBrands && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Brands</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="w-full text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    )
  }

  if (layout === 'compact') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {showCategories && (
              <div className="flex flex-wrap gap-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={cn(
                      'px-2 py-1 text-xs rounded-full border transition',
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
              <div className="flex flex-wrap gap-1">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => handleBrandChange(brand)}
                    className={cn(
                      'px-2 py-1 text-xs rounded-full border transition',
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
      </div>
    )
  }

  // Horizontal layout (default)
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Sort */}
        {showSort && (
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* View Toggle */}
        {showViewToggle && (
          <div className="flex gap-1 border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 transition',
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 transition',
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-4">
            {showCategories && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700">Categories:</span>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={cn(
                      'px-3 py-1 text-sm rounded-full border transition',
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
                      'px-3 py-1 text-sm rounded-full border transition',
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

            {showPriceRange && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Price:</span>
                <input
                  type="number"
                  value={filters.priceMin}
                  onChange={(e) => handlePriceChange('min', parseInt(e.target.value) || 0)}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Min"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  value={filters.priceMax}
                  onChange={(e) => handlePriceChange('max', parseInt(e.target.value) || priceRange.max)}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Max"
                />
              </div>
            )}

            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Component configuration for editor
export const ProductSearchConfig = {
  id: 'product-search',
  name: 'Product Search',
  description: 'Product search with filters and sorting options',
  category: 'ecommerce' as const,
  icon: 'search',
  defaultProps: {
    categories: ['Electronics', 'Clothing', 'Books', 'Home & Garden'],
    brands: ['Apple', 'Samsung', 'Nike', 'Adidas'],
    priceRange: { min: 0, max: 10000 },
    showFilters: true,
    showCategories: true,
    showBrands: true,
    showPriceRange: true,
    showSort: true,
    showViewToggle: true,
    searchPlaceholder: 'Search products...',
    layout: 'horizontal'
  },
  defaultSize: { width: 100, height: 200 },
  editableFields: [
    'categories',
    'brands',
    'priceRange',
    'showFilters',
    'showCategories',
    'showBrands',
    'showPriceRange',
    'showSort',
    'showViewToggle',
    'searchPlaceholder',
    'sortOptions',
    'layout'
  ]
}
