import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Table, Plus, Edit, Trash2 } from 'lucide-react'

interface TableElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function TableElement({ element, onUpdate, viewMode, style, children }: TableElementProps) {
  const handleTitleChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newTitle = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        title: newTitle
      }
    })
  }

  const getVariantClass = () => {
    switch (element.props.variant) {
      case 'striped':
        return 'table-striped'
      case 'bordered':
        return 'table-bordered'
      case 'hover':
        return 'table-hover'
      case 'compact':
        return 'table-compact'
      default:
        return ''
    }
  }

  const getSizeClass = () => {
    switch (element.props.size) {
      case 'sm':
        return 'text-sm'
      case 'lg':
        return 'text-lg'
      case 'md':
      default:
        return 'text-base'
    }
  }

  const columns = element.props.columns || ['Name', 'Email', 'Role', 'Status']
  const rows = element.props.rows || [
    ['John Doe', 'john@example.com', 'Admin', 'Active'],
    ['Jane Smith', 'jane@example.com', 'User', 'Active'],
    ['Mike Johnson', 'mike@example.com', 'Editor', 'Inactive']
  ]

  return (
    <div
      className="w-full overflow-hidden"
      style={style}
    >
      {/* Table Header */}
      {element.props.showTitle && (
        <div className="mb-4">
          <div
            className="text-xl font-semibold"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleTitleChange}
          >
            {element.props.title || 'Data Table'}
          </div>
        </div>
      )}

      {/* Table Actions */}
      {element.props.showActions && (
        <div className="mb-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4 mr-1 inline" />
              Add Row
            </button>
            <button className="px-3 py-1 text-sm border border-border rounded hover:bg-muted transition-colors">
              Export
            </button>
          </div>
          <div className="text-sm text-muted-foreground">
            {rows.length} rows
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className={cn(
          'w-full border-collapse',
          getVariantClass(),
          getSizeClass()
        )}>
          {/* Table Header */}
          <thead>
            <tr className="border-b border-border">
              {columns.map((column: string, index: number) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left font-semibold text-foreground bg-muted/50"
                >
                  {column}
                </th>
              ))}
              {element.props.showActions && (
                <th className="px-4 py-3 text-left font-semibold text-foreground bg-muted/50">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {rows.map((row: string[], rowIndex: number) => (
              <tr
                key={rowIndex}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                {row.map((cell: string, cellIndex: number) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3 text-foreground"
                  >
                    {cell}
                  </td>
                ))}
                {element.props.showActions && (
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button className="p-1 text-muted-foreground hover:text-primary transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {element.props.showPagination && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing 1 to {rows.length} of {rows.length} entries
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm border border-border rounded hover:bg-muted transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded">
              1
            </button>
            <button className="px-3 py-1 text-sm border border-border rounded hover:bg-muted transition-colors">
              Next
            </button>
          </div>
        </div>
      )}

      {rows.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
          <Table className="h-12 w-12 mx-auto mb-4" />
          <p>Configure table data in properties panel</p>
          <p className="text-xs mt-2">
            Variant: {element.props.variant || 'default'} | 
            Size: {element.props.size || 'md'}
          </p>
        </div>
      )}
    </div>
  )
}
