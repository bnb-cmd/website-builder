'use client'

import React from 'react'
import { ShoppingBag, Package, Grid, List, Tag, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ProductCategoriesProps {
  categories: Array<{
    id: string
    name: string
    description?: string
    image?: string
    icon?: string
    productCount: number
    subcategories?: string[]
    trending?: boolean
    new?: boolean
  }>
  onCategoryClick: (categoryId: string) => void
  showDescription?: boolean
  showProductCount?: boolean
  showSubcategories?: boolean
  showIcons?: boolean
  showImages?: boolean
  showBadges?: boolean
  layout?: 'grid' | 'list' | 'carousel' | 'compact'
  columns?: 2 | 3 | 4 | 5 | 6
  maxCategories?: number
}

export const ProductCategories: React.FC<ProductCategoriesProps> = ({
  categories = [
    {
      id: 'electronics',
      name: 'Electronics',
      description: 'Latest tech gadgets and devices',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
      icon: '💻',
      productCount: 1250,
      subcategories: ['Phones', 'Laptops', 'Tablets', 'Accessories'],
      trending: true,
      new: false
    },
    {
      id: 'clothing',
      name: 'Clothing',
      description: 'Fashion and apparel for everyone',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop',
      icon: '👔',
      productCount: 2300,
      subcategories: ['Men', 'Women', 'Kids', 'Accessories'],
      trending: false,
      new: false
    },
    {
      id: 'home-garden',
      name: 'Home & Garden',
      description: 'Everything for your home',
      image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&h=300&fit=crop',
      icon: '🏠',
      productCount: 890,
      subcategories: ['Furniture', 'Decor', 'Kitchen', 'Garden'],
      trending: false,
      new: true
    },
    {
      id: 'sports',
      name: 'Sports & Outdoors',
      description: 'Gear for active lifestyle',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop',
      icon: '⚽',
      productCount: 670,
      subcategories: ['Fitness', 'Outdoor', 'Sports Equipment'],
      trending: true,
      new: false
    },
    {
      id: 'books',
      name: 'Books',
      description: 'Read and discover new worlds',
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop',
      icon: '📚',
      productCount: 1450,
      subcategories: ['Fiction', 'Non-Fiction', 'Educational'],
      trending: false,
      new: false
    },
    {
      id: 'beauty',
      name: 'Beauty & Health',
      description: 'Personal care products',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
      icon: '💄',
      productCount: 980,
      subcategories: ['Skincare', 'Makeup', 'Health'],
      trending: false,
      new: true
    }
  ],
  onCategoryClick,
  showDescription = true,
  showProductCount = true,
  showSubcategories = true,
  showIcons = true,
  showImages = true,
  showBadges = true,
  layout = 'grid',
  columns = 3,
  maxCategories = 12
}) => {
  const displayedCategories = categories.slice(0, maxCategories)

  const getGridCols = () => {
    switch (columns) {
      case 2: return 'grid-cols-1 md:grid-cols-2'
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      case 5: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
      case 6: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }

  const CategoryCard = ({ category }: { category: any }) => (
    <div
      onClick={() => onCategoryClick(category.id)}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer group"
    >
      {showImages && category.image && (
        <div className="relative h-48">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
          {showBadges && (
            <div className="absolute top-2 left-2 flex gap-2">
              {category.trending && (
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Trending
                </span>
              )}
              {category.new && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  New
                </span>
              )}
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {showIcons && category.icon && (
            <span className="text-2xl">{category.icon}</span>
          )}
          <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
        </div>

        {showDescription && category.description && (
          <p className="text-sm text-gray-600 mb-3">{category.description}</p>
        )}

        {showProductCount && (
          <div className="text-sm text-gray-500 mb-3">
            {category.productCount.toLocaleString()} products
          </div>
        )}

        {showSubcategories && category.subcategories && category.subcategories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {category.subcategories.slice(0, 3).map((sub: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {sub}
              </span>
            ))}
            {category.subcategories.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                +{category.subcategories.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )

  const CategoryListItem = ({ category }: { category: any }) => (
    <div
      onClick={() => onCategoryClick(category.id)}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
    >
      <div className="flex gap-4">
        {showImages && category.image && (
          <img
            src={category.image}
            alt={category.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {showIcons && category.icon && (
              <span className="text-2xl">{category.icon}</span>
            )}
            <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
            {showBadges && (
              <>
                {category.trending && (
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Trending
                  </span>
                )}
                {category.new && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    New
                  </span>
                )}
              </>
            )}
          </div>

          {showDescription && category.description && (
            <p className="text-sm text-gray-600 mb-2">{category.description}</p>
          )}

          {showProductCount && (
            <div className="text-sm text-gray-500 mb-2">
              {category.productCount.toLocaleString()} products
            </div>
          )}

          {showSubcategories && category.subcategories && category.subcategories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {category.subcategories.map((sub: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {sub}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const CompactCategory = ({ category }: { category: any }) => (
    <div
      onClick={() => onCategoryClick(category.id)}
      className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition cursor-pointer"
    >
      <div className="flex items-center gap-3">
        {showIcons && category.icon && (
          <span className="text-xl">{category.icon}</span>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{category.name}</h3>
          {showProductCount && (
            <div className="text-xs text-gray-500">
              {category.productCount.toLocaleString()} items
            </div>
          )}
        </div>
        {showBadges && (category.trending || category.new) && (
          <div className="flex gap-1">
            {category.trending && (
              <TrendingUp className="w-4 h-4 text-orange-500" />
            )}
            {category.new && (
              <span className="bg-green-100 text-green-800 text-xs px-1 py-0.5 rounded">
                New
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )

  if (layout === 'list') {
    return (
      <div className="space-y-4">
        {displayedCategories.map((category) => (
          <CategoryListItem key={category.id} category={category} />
        ))}
      </div>
    )
  }

  if (layout === 'compact') {
    return (
      <div className="space-y-2">
        {displayedCategories.map((category) => (
          <CompactCategory key={category.id} category={category} />
        ))}
      </div>
    )
  }

  if (layout === 'carousel') {
    return (
      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-4">
          {displayedCategories.map((category) => (
            <div key={category.id} className="flex-shrink-0 w-64">
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Grid layout (default)
  return (
    <div className={cn('gap-4', getGridCols())}>
      {displayedCategories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  )
}

// Component configuration for editor
export const ProductCategoriesConfig = {
  id: 'product-categories',
  name: 'Product Categories',
  description: 'Product categories display with subcategories and product counts',
  category: 'ecommerce' as const,
  icon: 'folder',
  defaultProps: {
    categories: [
      {
        id: 'electronics',
        name: 'Electronics',
        description: 'Latest tech gadgets and devices',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
        icon: '💻',
        productCount: 1250,
        subcategories: ['Phones', 'Laptops', 'Tablets', 'Accessories'],
        trending: true,
        new: false
      },
      {
        id: 'clothing',
        name: 'Clothing',
        description: 'Fashion and apparel for everyone',
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop',
        icon: '👔',
        productCount: 2300,
        subcategories: ['Men', 'Women', 'Kids', 'Accessories'],
        trending: false,
        new: false
      }
    ],
    showDescription: true,
    showProductCount: true,
    showSubcategories: true,
    showIcons: true,
    showImages: true,
    showBadges: true,
    layout: 'grid',
    columns: 3,
    maxCategories: 12
  },
  defaultSize: { width: 100, height: 400 },
  editableFields: [
    'categories',
    'showDescription',
    'showProductCount',
    'showSubcategories',
    'showIcons',
    'showImages',
    'showBadges',
    'layout',
    'columns',
    'maxCategories'
  ]
}
