import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

interface PaginationElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function PaginationElement({ element, onUpdate, viewMode, style, children }: PaginationElementProps) {
  const handlePageChange = (page: number) => {
    onUpdate(element.id, {
      props: {
        ...element.props,
        currentPage: page
      }
    })
  }

  const getVariantClass = () => {
    switch (element.props.variant) {
      case 'outlined':
        return 'border border-border'
      case 'filled':
        return 'bg-muted'
      case 'minimal':
        return 'bg-transparent'
      default:
        return 'border border-border'
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
        return 'h-10 px-4'
    }
  }

  const currentPage = element.props.currentPage || 1
  const totalPages = element.props.totalPages || 10
  const showPages = element.props.showPages || 5

  const getPageNumbers = () => {
    const pages = []
    const halfShow = Math.floor(showPages / 2)
    let start = Math.max(1, currentPage - halfShow)
    let end = Math.min(totalPages, start + showPages - 1)

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div
      className="flex items-center justify-center space-x-2"
      style={style}
    >
      {/* Previous Button */}
      <button
        className={cn(
          'flex items-center justify-center rounded-md transition-colors',
          getVariantClass(),
          getSizeClass(),
          currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'
        )}
        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        {element.props.showLabels && <span className="ml-1">Previous</span>}
      </button>

      {/* First Page */}
      {pageNumbers[0] > 1 && (
        <>
          <button
            className={cn(
              'flex items-center justify-center rounded-md transition-colors',
              getVariantClass(),
              getSizeClass(),
              'hover:bg-muted'
            )}
            onClick={() => handlePageChange(1)}
          >
            1
          </button>
          {pageNumbers[0] > 2 && (
            <span className="flex items-center justify-center">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          className={cn(
            'flex items-center justify-center rounded-md transition-colors',
            getVariantClass(),
            getSizeClass(),
            page === currentPage
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-muted'
          )}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* Last Page */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="flex items-center justify-center">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </span>
          )}
          <button
            className={cn(
              'flex items-center justify-center rounded-md transition-colors',
              getVariantClass(),
              getSizeClass(),
              'hover:bg-muted'
            )}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        className={cn(
          'flex items-center justify-center rounded-md transition-colors',
          getVariantClass(),
          getSizeClass(),
          currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'
        )}
        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {element.props.showLabels && <span className="mr-1">Next</span>}
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Page Info */}
      {element.props.showInfo && (
        <div className="ml-4 text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
      )}
    </div>
  )
}
