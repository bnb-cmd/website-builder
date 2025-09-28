import { Element, ViewMode } from '@/types/editor'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, X } from 'lucide-react'

interface ImageElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
}

export function ImageElement({ element, onUpdate, viewMode, style }: ImageElementProps) {
  const [isEditing, setIsEditing] = useState(!element.props.src)
  const [tempSrc, setTempSrc] = useState(element.props.src || '')

  const handleSrcUpdate = () => {
    onUpdate(element.id, {
      props: {
        ...element.props,
        src: tempSrc
      }
    })
    setIsEditing(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const src = e.target?.result as string
        setTempSrc(src)
        onUpdate(element.id, {
          props: {
            ...element.props,
            src
          }
        })
        setIsEditing(false)
      }
      reader.readAsDataURL(file)
    }
  }

  if (isEditing || !element.props.src) {
    return (
      <div style={style} className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        <div className="space-y-4">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-lg font-medium">Add Image</h3>
            <p className="text-muted-foreground">Upload an image or enter a URL</p>
          </div>
          
          <div className="space-y-2">
            <Input
              value={tempSrc}
              onChange={(e) => setTempSrc(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            <div className="flex space-x-2">
              <Button onClick={handleSrcUpdate} disabled={!tempSrc}>
                Add Image
              </Button>
              <label className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={style} className="relative group">
      <img
        src={element.props.src}
        alt={element.props.alt || 'Image'}
        className="w-full h-auto object-cover rounded"
        style={{
          width: style.width || 'auto',
          height: style.height || 'auto'
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsEditing(true)}
        >
          Change Image
        </Button>
      </div>
    </div>
  )
}
