import React, { useState } from 'react'
import { Button } from '../../ui/button'
import { Label } from '../../ui/label'
import { Textarea } from '../../ui/textarea'
import { Card, CardContent } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  Quote,
  Link,
  Code
} from '@/lib/icons'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  fieldName: string
  fieldConfig?: any
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  fieldName,
  fieldConfig
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)

  const applyFormat = (format: string) => {
    const textarea = document.getElementById(`rich-text-${fieldName}`) as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = editValue.substring(start, end)
    
    let newText = ''
    switch (format) {
      case 'bold':
        newText = `**${selectedText}**`
        break
      case 'italic':
        newText = `*${selectedText}*`
        break
      case 'underline':
        newText = `<u>${selectedText}</u>`
        break
      case 'code':
        newText = `\`${selectedText}\``
        break
      case 'quote':
        newText = `> ${selectedText}`
        break
      case 'link':
        newText = `[${selectedText}](url)`
        break
      case 'list':
        newText = `- ${selectedText}`
        break
    }

    const newValue = editValue.substring(0, start) + newText + editValue.substring(end)
    setEditValue(newValue)
    onChange(newValue)
  }

  const handleSave = () => {
    onChange(editValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  const renderPreview = (text: string) => {
    // Simple markdown-like rendering
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/\n/g, '<br>')
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {fieldConfig?.label || fieldName}
      </Label>

      {isEditing ? (
        <Card>
          <CardContent className="p-3">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 mb-3 p-2 bg-gray-50 rounded">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => applyFormat('bold')}
                className="h-6 w-6 p-0"
                title="Bold"
              >
                <Bold className="w-3 h-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => applyFormat('italic')}
                className="h-6 w-6 p-0"
                title="Italic"
              >
                <Italic className="w-3 h-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => applyFormat('underline')}
                className="h-6 w-6 p-0"
                title="Underline"
              >
                <Underline className="w-3 h-3" />
              </Button>
              <div className="w-px h-4 bg-gray-300 mx-1" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => applyFormat('code')}
                className="h-6 w-6 p-0"
                title="Code"
              >
                <Code className="w-3 h-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => applyFormat('quote')}
                className="h-6 w-6 p-0"
                title="Quote"
              >
                <Quote className="w-3 h-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => applyFormat('link')}
                className="h-6 w-6 p-0"
                title="Link"
              >
                <Link className="w-3 h-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => applyFormat('list')}
                className="h-6 w-6 p-0"
                title="List"
              >
                <List className="w-3 h-3" />
              </Button>
            </div>

            {/* Text Editor */}
            <Textarea
              id={`rich-text-${fieldName}`}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={fieldConfig?.placeholder || 'Enter text...'}
              rows={4}
              className="mb-3"
            />

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <div
            className="min-h-16 p-3 border rounded bg-gray-50 cursor-pointer hover:bg-gray-100"
            onClick={() => setIsEditing(true)}
          >
            {value ? (
              <div 
                dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
                className="prose prose-sm max-w-none"
              />
            ) : (
              <p className="text-gray-500 text-sm">
                Click to edit {fieldConfig?.label || fieldName.toLowerCase()}
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="w-full"
          >
            Edit Text
          </Button>
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
