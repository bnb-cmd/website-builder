import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Download, FileText, Image, Video, Music } from 'lucide-react'

interface DownloadElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function DownloadElement({ element, onUpdate, viewMode, style, children }: DownloadElementProps) {
  const handleTitleChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newTitle = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        title: newTitle
      }
    })
  }

  const handleDescriptionChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newDescription = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        description: newDescription
      }
    })
  }

  const getFileIcon = () => {
    switch (element.props.fileType) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-600" />
      case 'image':
        return <Image className="h-8 w-8 text-blue-600" />
      case 'video':
        return <Video className="h-8 w-8 text-purple-600" />
      case 'audio':
        return <Music className="h-8 w-8 text-green-600" />
      default:
        return <FileText className="h-8 w-8 text-gray-600" />
    }
  }

  const getVariantClass = () => {
    switch (element.props.variant) {
      case 'card':
        return 'bg-card border border-border rounded-lg'
      case 'button':
        return 'bg-primary text-primary-foreground rounded-md'
      case 'minimal':
        return 'bg-transparent border-0'
      default:
        return 'bg-card border border-border rounded-lg'
    }
  }

  const getSizeClass = () => {
    switch (element.props.size) {
      case 'sm':
        return 'p-3'
      case 'lg':
        return 'p-6'
      case 'xl':
        return 'p-8'
      case 'md':
      default:
        return 'p-4'
    }
  }

  return (
    <div
      className={cn(
        'w-full',
        getVariantClass(),
        getSizeClass()
      )}
      style={style}
    >
      <div className="flex items-center space-x-4">
        {/* File Icon */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
            {getFileIcon()}
          </div>
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div
            className="font-medium text-foreground truncate"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleTitleChange}
          >
            {element.props.title || 'Download File'}
          </div>
          <div
            className="text-sm text-muted-foreground"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleDescriptionChange}
          >
            {element.props.description || 'Click to download this file'}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {element.props.fileSize || '2.4 MB'} • {element.props.fileType || 'PDF'} • {element.props.downloads || '0'} downloads
          </div>
        </div>

        {/* Download Button */}
        <div className="flex-shrink-0">
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Progress Bar (if downloading) */}
      {element.props.showProgress && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Downloading...</span>
            <span>{element.props.progress || '0'}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${element.props.progress || 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Additional Info */}
      {element.props.showAdditionalInfo && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">File Type:</span> {element.props.fileType || 'PDF'}
            </div>
            <div>
              <span className="font-medium">Size:</span> {element.props.fileSize || '2.4 MB'}
            </div>
            <div>
              <span className="font-medium">Downloads:</span> {element.props.downloads || '0'}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span> {element.props.lastUpdated || '2 days ago'}
            </div>
          </div>
        </div>
      )}

      {!element.props.title && (
        <div className="absolute inset-0 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground pointer-events-none">
          <div className="text-center">
            <Download className="h-8 w-8 mx-auto mb-2" />
            <p>Download Component</p>
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
