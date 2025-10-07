'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Filter, X } from 'lucide-react'

interface ProductFiltersProps {
  onFiltersChange?: (filters: any) => void
}

export function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 10000],
    inStock: false,
    sortBy: 'name',
    sortOrder: 'asc'
  })

  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange?.(newFilters)
    
    // Count active filters
    const count = Object.values(newFilters).filter(v => 
      v !== '' && v !== false && !(Array.isArray(v) && v[0] === 0 && v[1] === 10000)
    ).length
    setActiveFiltersCount(count)
  }

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      priceRange: [0, 10000],
      inStock: false,
      sortBy: 'name',
      sortOrder: 'asc'
    }
    setFilters(clearedFilters)
    setActiveFiltersCount(0)
    onFiltersChange?.(clearedFilters)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Filter */}
        <div>
          <Label>Category</Label>
          <Select 
            value={filters.category} 
            onValueChange={(value) => handleFilterChange('category', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="food">Food & Beverages</SelectItem>
              <SelectItem value="books">Books</SelectItem>
              <SelectItem value="home">Home & Garden</SelectItem>
              <SelectItem value="sports">Sports & Fitness</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <Label>Price Range (PKR)</Label>
          <div className="px-2 mt-3">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => handleFilterChange('priceRange', value)}
              max={10000}
              min={0}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>PKR {filters.priceRange[0].toLocaleString()}</span>
              <span>PKR {filters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* In Stock Filter */}
        <div className="flex items-center justify-between">
          <Label htmlFor="inStock">In Stock Only</Label>
          <Switch
            id="inStock"
            checked={filters.inStock}
            onCheckedChange={(checked) => handleFilterChange('inStock', checked)}
          />
        </div>

        {/* Sort Options */}
        <div>
          <Label>Sort By</Label>
          <Select 
            value={filters.sortBy} 
            onValueChange={(value) => handleFilterChange('sortBy', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="createdAt">Date Added</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Sort Order</Label>
          <Select 
            value={filters.sortOrder} 
            onValueChange={(value) => handleFilterChange('sortOrder', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
