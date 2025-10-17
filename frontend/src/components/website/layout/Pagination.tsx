import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { ChevronLeft, ChevronRight } from '@/lib/icons'
import { Button } from '../../ui/button'
import { cn } from '@/lib/utils'
import { getResponsiveTextSize } from '../renderer'

export const PaginationConfig: ComponentConfig = {
  id: 'pagination',
  name: 'Pagination',
  category: 'layout',
  icon: 'ChevronRight',
  description: 'Create pagination controls',
  defaultProps: { 
    currentPage: 1,
    totalPages: 10,
    showPrevNext: true,
    showFirstLast: false
  },
  defaultSize: { width: 400, height: 50 },
  editableFields: ['currentPage', 'totalPages', 'showPrevNext', 'showFirstLast']
}

interface PaginationProps extends WebsiteComponentProps {
  currentPage: number
  totalPages: number
  showPrevNext: boolean
  showFirstLast: boolean
}

export const WebsitePagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  showPrevNext, 
  showFirstLast,
  deviceMode = 'desktop'
}) => {
  const textSize = getResponsiveTextSize('text-sm', deviceMode)

  const getVisiblePages = () => {
    const pages = []
    const start = Math.max(1, currentPage - 2)
    const end = Math.min(totalPages, currentPage + 2)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="w-full h-full flex items-center justify-center">
      <nav className="flex items-center space-x-2">
        {/* First Page */}
        {showFirstLast && currentPage > 3 && (
          <>
            <Button variant="outline" size="sm" className={textSize}>
              1
            </Button>
            <span className="text-gray-400">...</span>
          </>
        )}

        {/* Previous Button */}
        {showPrevNext && currentPage > 1 && (
          <Button variant="outline" size="sm">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}

        {/* Page Numbers */}
        {visiblePages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            className={textSize}
          >
            {page}
          </Button>
        ))}

        {/* Next Button */}
        {showPrevNext && currentPage < totalPages && (
          <Button variant="outline" size="sm">
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}

        {/* Last Page */}
        {showFirstLast && currentPage < totalPages - 2 && (
          <>
            <span className="text-gray-400">...</span>
            <Button variant="outline" size="sm" className={textSize}>
              {totalPages}
            </Button>
          </>
        )}
      </nav>
    </div>
  )
}
