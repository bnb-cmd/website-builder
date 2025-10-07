import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ExternalLink, Play, Code } from 'lucide-react'

interface EmbedElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function EmbedElement({ element, onUpdate, viewMode, style, children }: EmbedElementProps) {
  const handleUrlChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const newUrl = e.target.value
    onUpdate(element.id, {
      props: {
        ...element.props,
        url: newUrl
      }
    })
  }

  const handleTitleChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newTitle = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        title: newTitle
      }
    })
  }

  const getAspectRatioClass = () => {
    switch (element.props.aspectRatio) {
      case 'square':
        return 'aspect-square'
      case 'video':
        return 'aspect-video'
      case 'wide':
        return 'aspect-[16/9]'
      case 'portrait':
        return 'aspect-[3/4]'
      default:
        return 'aspect-video'
    }
  }

  const getEmbedType = () => {
    const url = element.props.url || ''
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
    if (url.includes('vimeo.com')) return 'vimeo'
    if (url.includes('codepen.io')) return 'codepen'
    if (url.includes('jsfiddle.net')) return 'jsfiddle'
    if (url.includes('github.com')) return 'github'
    return 'iframe'
  }

  const embedType = getEmbedType()

  const renderEmbed = () => {
    const url = element.props.url || ''
    
    if (!url) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
          <div className="text-center text-muted-foreground">
            <ExternalLink className="h-12 w-12 mx-auto mb-4" />
            <p>Enter embed URL</p>
            <p className="text-xs mt-2">YouTube, Vimeo, CodePen, etc.</p>
          </div>
        </div>
      )
    }

    switch (embedType) {
      case 'youtube':
        const youtubeId = url.includes('youtu.be') 
          ? url.split('youtu.be/')[1]?.split('?')[0]
          : url.split('v=')[1]?.split('&')[0]
        
        return (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title="YouTube video"
            className="w-full h-full rounded-lg"
            allowFullScreen
          />
        )

      case 'vimeo':
        const vimeoId = url.split('vimeo.com/')[1]?.split('?')[0]
        
        return (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}`}
            title="Vimeo video"
            className="w-full h-full rounded-lg"
            allowFullScreen
          />
        )

      case 'codepen':
        const codepenId = url.split('codepen.io/')[1]?.split('/')[2]
        
        return (
          <iframe
            src={`https://codepen.io/embed/${codepenId}`}
            title="CodePen"
            className="w-full h-full rounded-lg"
            scrolling="no"
          />
        )

      default:
        return (
          <iframe
            src={url}
            title="Embedded content"
            className="w-full h-full rounded-lg"
            allowFullScreen
          />
        )
    }
  }

  return (
    <div
      className="w-full"
      style={style}
    >
      {/* Embed Header */}
      {element.props.showTitle && (
        <div className="mb-4">
          <div
            className="text-lg font-semibold"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleTitleChange}
          >
            {element.props.title || 'Embedded Content'}
          </div>
        </div>
      )}

      {/* URL Input */}
      <div className="mb-4">
        <input
          type="url"
          placeholder="Enter embed URL (YouTube, Vimeo, CodePen, etc.)"
          className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          value={element.props.url || ''}
          onChange={handleUrlChange}
        />
      </div>

      {/* Embed Container */}
      <div className={cn(
        'w-full bg-muted rounded-lg overflow-hidden',
        getAspectRatioClass()
      )}>
        {renderEmbed()}
      </div>

      {/* Embed Info */}
      <div className="mt-2 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Type: {embedType}</span>
          <span>Aspect: {element.props.aspectRatio || 'video'}</span>
        </div>
      </div>

      {/* Embed Controls */}
      {element.props.showControls && (
        <div className="mt-4 flex items-center space-x-2">
          <button className="px-3 py-1 text-sm border border-border rounded hover:bg-muted transition-colors">
            <Play className="h-4 w-4 mr-1 inline" />
            Preview
          </button>
          <button className="px-3 py-1 text-sm border border-border rounded hover:bg-muted transition-colors">
            <Code className="h-4 w-4 mr-1 inline" />
            Code
          </button>
        </div>
      )}
    </div>
  )
}
