import React from 'react'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Switch } from '../../ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { PropertyControls } from '../PropertyControls'
import { inferPropertyType } from '@/lib/property-validation'

interface ObjectEditorProps {
  value: Record<string, any>
  onChange: (value: Record<string, any>) => void
  fieldName: string
  componentProps?: Record<string, any>
}

export const ObjectEditor: React.FC<ObjectEditorProps> = ({
  value = {},
  onChange,
  fieldName,
  componentProps
}) => {
  const updateProperty = (key: string, newValue: any) => {
    onChange({
      ...value,
      [key]: newValue
    })
  }

  const addProperty = () => {
    const newKey = `newProperty${Object.keys(value).length + 1}`
    updateProperty(newKey, '')
  }

  const removeProperty = (key: string) => {
    const newValue = { ...value }
    delete newValue[key]
    onChange(newValue)
  }

  const getObjectProperties = (obj: Record<string, any>): Array<{ key: string; value: any; type: string }> => {
    return Object.entries(obj).map(([key, value]) => ({
      key,
      value,
      type: inferPropertyType(value, key)
    }))
  }

  const properties = getObjectProperties(value)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {fieldName} ({properties.length} properties)
        </Label>
        <Badge variant="outline" className="text-xs">
          Object
        </Badge>
      </div>

      <div className="space-y-2">
        {properties.map(({ key, value, type }) => (
          <Card key={key} className="p-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {key}
                </Label>
                <Badge variant="secondary" className="text-xs">
                  {type}
                </Badge>
              </div>
              
              <PropertyControls
                value={value}
                onChange={(newValue) => updateProperty(key, newValue)}
                fieldName={key}
                fieldConfig={{ type }}
                componentProps={componentProps}
              />
            </div>
          </Card>
        ))}
      </div>

      {properties.length === 0 && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          No properties yet. This object is empty.
        </div>
      )}
    </div>
  )
}
