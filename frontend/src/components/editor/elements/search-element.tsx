import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Search, Filter, SortAsc } from 'lucide-react'

interface SearchElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function SearchElement({ element, onUpdate, viewMode, style, children }: SearchElementProps) {
  const handlePlaceholderChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const newPlaceholder = e.target.value
    onUpdate(element.id, {
      props: {
        ...element.props,
        placeholder: newPlaceholder
      }
    })
  }

  const getVariantClass = () => {
    switch (element.props.variant) {
      case 'outlined':
        return 'border border-input bg-background'
      case 'filled':
        return 'bg-muted border-0'
      case 'underline':
        return 'border-0 border-b border-input bg-transparent rounded-none'
      default:
        return 'border border-input bg-background'
    }
  }

  const getSizeClass = () => {
    switch (element.props.size) {
      case 'sm':
        return 'h-8 px-3 text-sm'
      case 'lg':
        return 'h-12 px-4 text-lg'
      case 'md':
      default:
        return 'h-10 px-3'
    }
  }

  const getRoundedClass = () => {
    switch (element.props.rounded) {
      case 'none':
        return 'rounded-none'
      case 'sm':
        return 'rounded-sm'
      case 'md':
        return 'rounded-md'
      case 'lg':
        return 'rounded-lg'
      case 'full':
        return 'rounded-full'
      default:
        return 'rounded-md'
    }
  }

  return (
    <div
      className="w-full"
      style={style}
    >
      <div className="relative">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={element.props.placeholder || 'Search...'}
            className={cn(
              'w-full pl-10 pr-4 py-2',
              getVariantClass(),
              getSizeClass(),
              getRoundedClass(),
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
            )}
            onChange={handlePlaceholderChange}
          />
          
          {/* Clear Button */}
          {element.props.showClear && (
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
              ×
            </button>
          )}
        </div>

        {/* Filter Options */}
        {element.props.showFilters && (
          <div className="mt-2 flex items-center space-x-2">
            <button className="flex items-center space-x-1 px-3 py-1 text-sm border border-border rounded-md hover:bg-muted">
              <Filter className="h-3 w-3" />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-1 text-sm border border-border rounded-md hover:bg-muted">
              <SortAsc className="h-3 w-3" />
              <span>Sort</span>
            </button>
          </div>
        )}

        {/* Search Suggestions */}
        {element.props.showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50">
            <div className="p-2">
              <div className="text-xs text-muted-foreground mb-2">Recent searches</div>
              {['Recent search 1', 'Recent search 2', 'Recent search 3'].map((suggestion, index) => (
                <div key={index} className="px-2 py-1 hover:bg-muted rounded cursor-pointer">
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {!children && (
        <div className="mt-4 border-2 border-dashed border-border rounded-lg p-4 text-center text-muted-foreground">
          <p>Search Component</p>
          <p className="text-xs mt-1">
            Variant: {element.props.variant || 'outlined'} | 
            Size: {element.props.size || 'md'} |
            Filters: {element.props.showFilters ? 'On' : 'Off'}
          </p>
        </div>
      )}
    </div>
  )
}
