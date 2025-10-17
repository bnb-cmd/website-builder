import React, { useState } from 'react'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Card, CardContent } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { ScrollArea } from '../../ui/scroll-area'
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  ChevronDown, 
  ChevronRight 
} from '@/lib/icons'
import { cn } from '@/lib/utils'

interface ArrayEditorProps {
  value: any[]
  onChange: (value: any[]) => void
  fieldName: string
  fieldConfig?: any
  componentProps?: Record<string, any>
}

export const ArrayEditor: React.FC<ArrayEditorProps> = ({
  value = [],
  onChange,
  fieldName,
  fieldConfig,
  componentProps
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const addItem = () => {
    const newItem = getDefaultValueForArrayItem(fieldName, value)
    onChange([...value, newItem])
  }

  const removeItem = (index: number) => {
    const newValue = value.filter((_, i) => i !== index)
    onChange(newValue)
  }

  const updateItem = (index: number, newItem: any) => {
    const newValue = [...value]
    newValue[index] = newItem
    onChange(newValue)
  }

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newValue = [...value]
    const [movedItem] = newValue.splice(fromIndex, 1)
    newValue.splice(toIndex, 0, movedItem)
    onChange(newValue)
  }

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  const isPrimitiveArray = value.length === 0 || typeof value[0] !== 'object'

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {fieldConfig?.label || fieldName} ({value.length} items)
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          className="h-8"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Item
        </Button>
      </div>

      <ScrollArea className="max-h-64">
        <div className="space-y-2">
          {value.map((item, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 cursor-move"
                  onMouseDown={(e) => {
                    // Simple drag handle - could be enhanced with proper drag & drop
                    e.preventDefault()
                  }}
                >
                  <GripVertical className="w-3 h-3" />
                </Button>

                {isPrimitiveArray ? (
                  <div className="flex-1">
                    <Input
                      value={item || ''}
                      onChange={(e) => updateItem(index, e.target.value)}
                      placeholder={`Enter ${fieldName.slice(0, -1)}`}
                      className="h-8"
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(index)}
                        className="h-6 w-6 p-0"
                      >
                        {expandedItems.has(index) ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronRight className="w-3 h-3" />
                        )}
                      </Button>
                      <Badge variant="outline" className="text-xs">
                        Item {index + 1}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {getObjectSummary(item)}
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>

              {!isPrimitiveArray && expandedItems.has(index) && (
                <div className="mt-3 ml-8 space-y-2">
                  <ObjectEditor
                    value={item}
                    onChange={(newItem) => updateItem(index, newItem)}
                    fieldName={`${fieldName}[${index}]`}
                    componentProps={componentProps}
                  />
                </div>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>

      {value.length === 0 && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          No items yet. Click "Add Item" to get started.
        </div>
      )}
    </div>
  )
}

// Helper function to get default value for array items
const getDefaultValueForArrayItem = (fieldName: string, existingArray: any[]): any => {
  if (existingArray.length > 0) {
    const firstItem = existingArray[0]
    if (typeof firstItem === 'object' && firstItem !== null) {
      // Return empty object with same structure
      return {}
    }
    return ''
  }

  // Infer from field name
  const lowerFieldName = fieldName.toLowerCase()
  if (lowerFieldName.includes('menu') || lowerFieldName.includes('link')) {
    return { label: 'New Item', link: '/' }
  }
  if (lowerFieldName.includes('product')) {
    return {
      id: '',
      name: 'New Product',
      price: 0,
      image: '',
      inStock: true
    }
  }
  if (lowerFieldName.includes('social')) {
    return { platform: 'Facebook', url: '' }
  }
  
  return ''
}

// Helper function to get summary of object for display
const getObjectSummary = (obj: any): string => {
  if (typeof obj !== 'object' || obj === null) {
    return String(obj)
  }
  
  const keys = Object.keys(obj)
  if (keys.length === 0) {
    return 'Empty object'
  }
  
  const firstKey = keys[0]
  const firstValue = obj[firstKey]
  
  if (typeof firstValue === 'string' && firstValue.length > 0) {
    return `${firstKey}: ${firstValue.substring(0, 20)}${firstValue.length > 20 ? '...' : ''}`
  }
  
  return `${keys.length} properties`
}

// Import ObjectEditor here to avoid circular dependency
import { ObjectEditor } from './ObjectEditor'
