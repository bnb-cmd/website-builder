'use client'

import { useState } from 'react'
import { Product } from '@/types/ecommerce'
import { ProductCard } from './product-card'
import { ProductFilters } from './product-filters'
import { Pagination } from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { Grid, List, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  onProductClick?: (product: Product) => void
  onAddToCart?: (product: Product, quantity: number) => void
  showFilters?: boolean
  viewMode?: 'grid' | 'list'
  pagination?: {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
  }
  onFiltersChange?: (filters: any) => void
  onSearch?: (query: string) => void
}

export function ProductGrid({
  products,
  loading = false,
  onProductClick,
  onAddToCart,
  showFilters = true,
  viewMode: initialViewMode = 'grid',
  pagination,
  onFiltersChange,
  onSearch
}: ProductGridProps) {
  const [viewMode, setViewMode] = useState(initialViewMode)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {showFilters && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-8 w-48 bg-muted animate-pulse rounded" />
              <div className="flex space-x-2">
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              </div>
            </div>
            <div className="h-10 bg-muted animate-pulse rounded" />
          </div>
        )}
        
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-square bg-muted animate-pulse rounded-lg" />
              <div className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                <div className="h-6 bg-muted animate-pulse rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {showFilters && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Products</h2>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <ProductFilters onFiltersChange={onFiltersChange} />
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛍️</div>
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? 'Try adjusting your search or filters' : 'Add some products to get started'}
          </p>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
              onClick={() => onProductClick?.(product)}
              onAddToCart={(quantity) => onAddToCart?.(product, quantity)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
          />
        </div>
      )}
    </div>
  )
}
