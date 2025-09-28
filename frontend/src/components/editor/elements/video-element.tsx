import { Element, ViewMode } from '@/types/editor'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Play, Video } from 'lucide-react'

interface VideoElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
}

export function VideoElement({ element, onUpdate, viewMode, style }: VideoElementProps) {
  const [isEditing, setIsEditing] = useState(!element.props.url)
  const [tempUrl, setTempUrl] = useState(element.props.url || '')

  const handleUrlUpdate = () => {
    onUpdate(element.id, {
      props: {
        ...element.props,
        url: tempUrl
      }
    })
    setIsEditing(false)
  }

  const getEmbedUrl = (url: string) => {
    // Convert YouTube URLs to embed format
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    // Convert Vimeo URLs to embed format
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      return `https://player.vimeo.com/video/${videoId}`
    }
    return url
  }

  if (isEditing || !element.props.url) {
    return (
      <div style={style} className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        <div className="space-y-4">
          <Video className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-lg font-medium">Add Video</h3>
            <p className="text-muted-foreground">Enter a YouTube or Vimeo URL</p>
          </div>
          
          <div className="space-y-2">
            <Input
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <Button onClick={handleUrlUpdate} disabled={!tempUrl}>
              Add Video
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={style} className="relative group">
      <div className="aspect-video rounded-lg overflow-hidden">
        <iframe
          src={getEmbedUrl(element.props.url)}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsEditing(true)}
        >
          Change Video
        </Button>
      </div>
    </div>
  )
}
