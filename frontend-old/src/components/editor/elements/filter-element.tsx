import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Filter, SortAsc, Grid, List } from 'lucide-react'

interface FilterElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function FilterElement({ element, onUpdate, viewMode, style, children }: FilterElementProps) {
  const handleFilterChange = (filterType: string, value: string) => {
    onUpdate(element.id, {
      props: {
        ...element.props,
        [filterType]: value
      }
    })
  }

  const getLayoutClass = () => {
    switch (element.props.layout) {
      case 'horizontal':
        return 'flex flex-wrap items-center gap-4'
      case 'vertical':
        return 'flex flex-col space-y-4'
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
      default:
        return 'flex flex-wrap items-center gap-4'
    }
  }

  const categories = element.props.categories || ['All', 'Web Design', 'Development', 'Marketing', 'Branding']
  const sortOptions = element.props.sortOptions || ['Newest', 'Oldest', 'Name A-Z', 'Name Z-A', 'Price Low-High', 'Price High-Low']
  const viewModes = element.props.viewModes || ['grid', 'list']

  return (
    <div
      className={cn(
        'w-full p-4 bg-card border border-border rounded-lg',
        getLayoutClass()
      )}
      style={style}
    >
      {/* Category Filter */}
      {element.props.showCategories && (
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category: string, index: number) => (
              <button
                key={index}
                className={cn(
                  'px-3 py-1 text-sm rounded-full transition-colors',
                  element.props.selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
                onClick={() => handleFilterChange('selectedCategory', category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sort Options */}
      {element.props.showSort && (
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Sort By</label>
          <select
            className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            value={element.props.selectedSort || 'Newest'}
            onChange={(e) => handleFilterChange('selectedSort', e.target.value)}
          >
            {sortOptions.map((option: string, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* View Mode Toggle */}
      {element.props.showViewMode && (
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">View</label>
          <div className="flex border border-border rounded-md overflow-hidden">
            {viewModes.map((mode: string, index: number) => (
              <button
                key={index}
                className={cn(
                  'px-3 py-2 text-sm transition-colors',
                  element.props.selectedViewMode === mode
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-foreground hover:bg-muted'
                )}
                onClick={() => handleFilterChange('selectedViewMode', mode)}
              >
                {mode === 'grid' ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      {element.props.showPriceRange && (
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Price Range</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              className="w-20 px-2 py-1 text-sm border border-border rounded bg-background text-foreground"
              value={element.props.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
            <span className="text-muted-foreground">-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-20 px-2 py-1 text-sm border border-border rounded bg-background text-foreground"
              value={element.props.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Clear Filters */}
      {element.props.showClear && (
        <button
          className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => {
            onUpdate(element.id, {
              props: {
                ...element.props,
                selectedCategory: 'All',
                selectedSort: 'Newest',
                selectedViewMode: 'grid',
                minPrice: '',
                maxPrice: ''
              }
            })
          }}
        >
          Clear All Filters
        </button>
      )}

      {!children && (
        <div className="absolute inset-0 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground pointer-events-none">
          <div className="text-center">
            <Filter className="h-8 w-8 mx-auto mb-2" />
            <p>Filter Component</p>
            <p className="text-xs mt-1">
              Layout: {element.props.layout || 'horizontal'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
