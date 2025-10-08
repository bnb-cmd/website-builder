import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Search, Filter } from 'lucide-react'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const SearchConfig: ComponentConfig = {
  id: 'search',
  name: 'Search',
  category: 'content',
  icon: 'Search',
  description: 'Search input with filters',
  defaultProps: { 
    placeholder: 'Search...',
    showFilters: true,
    filters: ['All', 'Products', 'Articles', 'Pages'],
    activeFilter: 'All',
    showButton: true,
    buttonText: 'Search'
  },
  defaultSize: { width: 400, height: 80 },
  editableFields: ['placeholder', 'showFilters', 'filters', 'activeFilter', 'showButton', 'buttonText']
}

interface SearchProps extends WebsiteComponentProps {
  placeholder: string
  showFilters: boolean
  filters: string[]
  activeFilter: string
  showButton: boolean
  buttonText: string
}

export const WebsiteSearch: React.FC<SearchProps> = ({ 
  placeholder, 
  showFilters, 
  filters, 
  activeFilter, 
  showButton, 
  buttonText,
  deviceMode = 'desktop'
}) => {
  const padding = getResponsivePadding('p-4', deviceMode)
  const inputSize = getResponsiveTextSize('text-sm', deviceMode)
  const filterSize = getResponsiveTextSize('text-xs', deviceMode)

  return (
    <div className={cn("w-full h-full", padding)}>
      <div className="space-y-3">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              type="text"
              placeholder={placeholder}
              className={cn("pl-10", inputSize)}
              readOnly
            />
          </div>
          {showButton && (
            <Button size="sm">
              {buttonText}
            </Button>
          )}
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <div className="flex gap-1">
              {filters.map((filter, index) => (
                <button
                  key={index}
                  className={cn(
                    "px-3 py-1 rounded-full transition-colors",
                    filterSize,
                    filter === activeFilter 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
