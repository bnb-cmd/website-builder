import React, { useState } from 'react'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Textarea } from '../../ui/textarea'
import { Card, CardContent } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Image as ImageIcon, Upload, X } from '@/lib/icons'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  value: string
  onChange: (value: string) => void
  fieldName: string
  fieldConfig?: any
  onImagePickerOpen?: (category?: string, title?: string) => void
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value = '',
  onChange,
  fieldName,
  fieldConfig,
  onImagePickerOpen
}) => {
  const [dragOver, setDragOver] = useState(false)

  const handleFileUpload = (file: File) => {
    // In a real implementation, you would upload the file to a server
    // For now, we'll create a local URL
    const url = URL.createObjectURL(file)
    onChange(url)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      handleFileUpload(imageFile)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file)
    }
  }

  const clearImage = () => {
    onChange('')
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {fieldConfig?.label || fieldName}
      </Label>

      {value ? (
        <div className="space-y-2">
          <div className="relative">
            <img
              src={value}
              alt="Preview"
              className="w-full h-32 object-cover rounded border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0"
              onClick={clearImage}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL"
            className="text-xs"
          />
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          )}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
        >
          <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">
            Drop an image here or click to upload
          </p>
          <div className="flex gap-2 justify-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id={`file-upload-${fieldName}`}
            />
            <label htmlFor={`file-upload-${fieldName}`}>
              <Button type="button" variant="outline" size="sm" asChild>
                <span>
                  <Upload className="w-3 h-3 mr-1" />
                  Upload
                </span>
              </Button>
            </label>
            {onImagePickerOpen && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onImagePickerOpen('hero', 'Choose Image')}
              >
                <ImageIcon className="w-3 h-3 mr-1" />
                Browse
              </Button>
            )}
          </div>
        </div>
      )}

      {fieldConfig?.description && (
        <p className="text-xs text-muted-foreground">
          {fieldConfig.description}
        </p>
      )}
    </div>
  )
}
