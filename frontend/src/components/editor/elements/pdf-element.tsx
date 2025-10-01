import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { FileText, Download, Eye } from 'lucide-react'

interface PdfElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function PdfElement({ element, onUpdate, viewMode, style, children }: PdfElementProps) {
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
      case 'card':
        return 'bg-card border border-border rounded-lg'
      case 'minimal':
        return 'bg-transparent border-0'
      case 'bordered':
        return 'border border-border rounded-lg'
      default:
        return 'bg-card border border-border rounded-lg'
    }
  }

  const getSizeClass = () => {
    switch (element.props.size) {
      case 'sm':
        return 'h-32'
      case 'lg':
        return 'h-64'
      case 'xl':
        return 'h-80'
      case 'md':
      default:
        return 'h-48'
    }
  }

  return (
    <div
      className={cn(
        'w-full p-4',
        getVariantClass(),
        getSizeClass()
      )}
      style={style}
    >
      {/* PDF Preview */}
      <div className="flex items-center space-x-4">
        {/* PDF Icon */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
            <FileText className="h-8 w-8 text-red-600" />
          </div>
        </div>

        {/* PDF Info */}
        <div className="flex-1 min-w-0">
          <div
            className="font-medium text-foreground truncate"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleTitleChange}
          >
            {element.props.title || 'Document.pdf'}
          </div>
          <div className="text-sm text-muted-foreground">
            PDF Document • {element.props.size || '2.4 MB'} • {element.props.pages || '5'} pages
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Last modified: {element.props.lastModified || '2 days ago'}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {element.props.showPreview && (
            <button className="p-2 hover:bg-muted rounded transition-colors">
              <Eye className="h-4 w-4" />
            </button>
          )}
          
          {element.props.showDownload && (
            <button className="p-2 hover:bg-muted rounded transition-colors">
              <Download className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* PDF Preview Thumbnail */}
      {element.props.showThumbnail && (
        <div className="mt-4">
          <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-white">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-600">PDF Preview</div>
                <div className="text-xs text-gray-500 mt-1">Page 1 of {element.props.pages || '5'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Actions */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm">
            Open PDF
          </button>
          <button className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm">
            Share
          </button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          {element.props.downloads || '0'} downloads
        </div>
      </div>

      {!element.props.title && (
        <div className="absolute inset-0 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground pointer-events-none">
          <div className="text-center">
            <FileText className="h-8 w-8 mx-auto mb-2" />
            <p>PDF Document</p>
            <p className="text-xs mt-1">
              Variant: {element.props.variant || 'card'} | 
              Size: {element.props.size || 'md'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
