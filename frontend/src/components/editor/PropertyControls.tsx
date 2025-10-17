import React from 'react'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Switch } from '../../ui/switch'
import { Slider } from '../../ui/slider'
import { Badge } from '../../ui/badge'
import { AlertCircle } from '@/lib/icons'
import { cn } from '@/lib/utils'

// Import control components
import { ArrayEditor } from './controls/ArrayEditor'
import { ObjectEditor } from './controls/ObjectEditor'
import { ColorPicker } from './controls/ColorPicker'
import { IconPicker } from './controls/IconPicker'
import { ImageUploader } from './controls/ImageUploader'
import { RichTextEditor } from './controls/RichTextEditor'

// Import utilities
import { inferPropertyType, validateProperty } from '@/lib/property-validation'

interface PropertyControlsProps {
  value: any
  onChange: (value: any) => void
  fieldName: string
  fieldConfig?: any
  componentProps?: Record<string, any>
  onImagePickerOpen?: (category?: string, title?: string) => void
}

export const PropertyControls: React.FC<PropertyControlsProps> = ({
  value,
  onChange,
  fieldName,
  fieldConfig,
  componentProps,
  onImagePickerOpen
}) => {
  // Determine the control type
  const controlType = fieldConfig?.type || inferPropertyType(value, fieldName)
  
  // Validate the current value
  const validation = validateProperty(value, fieldConfig)
  
  // Handle different control types
  const renderControl = () => {
    switch (controlType) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={Boolean(value)}
              onCheckedChange={onChange}
            />
            <Label className="text-sm">
              {fieldConfig?.label || fieldName}
            </Label>
          </div>
        )

      case 'number':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {fieldConfig?.label || fieldName}
            </Label>
            {fieldConfig?.min !== undefined || fieldConfig?.max !== undefined ? (
              <div className="space-y-2">
                <Slider
                  value={[Number(value) || 0]}
                  onValueChange={(vals) => onChange(vals[0])}
                  min={fieldConfig?.min || 0}
                  max={fieldConfig?.max || 100}
                  step={fieldConfig?.step || 1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground text-center">
                  {Number(value) || 0}
                </div>
              </div>
            ) : (
              <Input
                type="number"
                value={value || ''}
                onChange={(e) => onChange(Number(e.target.value))}
                placeholder={fieldConfig?.placeholder || 'Enter number'}
                min={fieldConfig?.min}
                max={fieldConfig?.max}
                step={fieldConfig?.step}
              />
            )}
          </div>
        )

      case 'select':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {fieldConfig?.label || fieldName}
            </Label>
            <Select
              value={String(value || '')}
              onValueChange={onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={fieldConfig?.placeholder || 'Select option'} />
              </SelectTrigger>
              <SelectContent>
                {fieldConfig?.options?.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case 'textarea':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {fieldConfig?.label || fieldName}
            </Label>
            <Textarea
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={fieldConfig?.placeholder || 'Enter text'}
              rows={fieldConfig?.rows || 3}
            />
          </div>
        )

      case 'array':
        return (
          <ArrayEditor
            value={value || []}
            onChange={onChange}
            fieldName={fieldName}
            fieldConfig={fieldConfig}
            componentProps={componentProps}
          />
        )

      case 'object':
        return (
          <ObjectEditor
            value={value || {}}
            onChange={onChange}
            fieldName={fieldName}
            componentProps={componentProps}
          />
        )

      case 'color':
        return (
          <ColorPicker
            value={value || '#000000'}
            onChange={onChange}
            fieldName={fieldName}
            fieldConfig={fieldConfig}
          />
        )

      case 'image':
        return (
          <ImageUploader
            value={value || ''}
            onChange={onChange}
            fieldName={fieldName}
            fieldConfig={fieldConfig}
            onImagePickerOpen={onImagePickerOpen}
          />
        )

      case 'url':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {fieldConfig?.label || fieldName}
            </Label>
            <Input
              type="url"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={fieldConfig?.placeholder || 'https://example.com'}
            />
          </div>
        )

      case 'email':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {fieldConfig?.label || fieldName}
            </Label>
            <Input
              type="email"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={fieldConfig?.placeholder || 'email@example.com'}
            />
          </div>
        )

      case 'tel':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {fieldConfig?.label || fieldName}
            </Label>
            <Input
              type="tel"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={fieldConfig?.placeholder || '+1 (555) 123-4567'}
            />
          </div>
        )

      case 'richtext':
        return (
          <RichTextEditor
            value={value || ''}
            onChange={onChange}
            fieldName={fieldName}
            fieldConfig={fieldConfig}
          />
        )

      case 'icon':
        return (
          <IconPicker
            value={value || 'Home'}
            onChange={onChange}
            fieldName={fieldName}
            fieldConfig={fieldConfig}
          />
        )

      default: // 'text'
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {fieldConfig?.label || fieldName}
            </Label>
            <Input
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={fieldConfig?.placeholder || 'Enter text'}
            />
          </div>
        )
    }
  }

  return (
    <div className="space-y-2">
      {renderControl()}
      
      {/* Validation Error */}
      {!validation.isValid && (
        <div className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="w-3 h-3" />
          {validation.error}
        </div>
      )}

      {/* Field Description */}
      {fieldConfig?.description && (
        <p className="text-xs text-muted-foreground">
          {fieldConfig.description}
        </p>
      )}

      {/* Required Indicator */}
      {fieldConfig?.required && (
        <Badge variant="outline" className="text-xs">
          Required
        </Badge>
      )}
    </div>
  )
}
