import React, { useState } from 'react'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import { Card, CardContent } from '../../ui/card'
import { cn } from '@/lib/utils'

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  fieldName: string
  fieldConfig?: any
}

const PRESET_COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000',
  '#808000', '#800000', '#008080', '#C0C0C0', '#FFD700'
]

const COMMON_COLORS = [
  { name: 'Primary', value: '#3B82F6' },
  { name: 'Secondary', value: '#6B7280' },
  { name: 'Success', value: '#10B981' },
  { name: 'Warning', value: '#F59E0B' },
  { name: 'Error', value: '#EF4444' },
  { name: 'Info', value: '#06B6D4' },
  { name: 'Gray 50', value: '#F9FAFB' },
  { name: 'Gray 100', value: '#F3F4F6' },
  { name: 'Gray 200', value: '#E5E7EB' },
  { name: 'Gray 300', value: '#D1D5DB' },
  { name: 'Gray 400', value: '#9CA3AF' },
  { name: 'Gray 500', value: '#6B7280' },
  { name: 'Gray 600', value: '#4B5563' },
  { name: 'Gray 700', value: '#374151' },
  { name: 'Gray 800', value: '#1F2937' },
  { name: 'Gray 900', value: '#111827' }
]

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value = '#000000',
  onChange,
  fieldName,
  fieldConfig
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [customColor, setCustomColor] = useState(value)

  const handleColorSelect = (color: string) => {
    onChange(color)
    setCustomColor(color)
    setIsOpen(false)
  }

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color)
    onChange(color)
  }

  const isValidColor = (color: string): boolean => {
    const s = new Option().style
    s.color = color
    return s.color !== ''
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {fieldConfig?.label || fieldName}
      </Label>
      
      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-10 w-20 p-1"
              style={{ backgroundColor: value }}
            >
              <div 
                className="w-full h-full rounded border"
                style={{ backgroundColor: value }}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              {/* Current Color Display */}
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded border-2 border-gray-200"
                  style={{ backgroundColor: value }}
                />
                <div className="flex-1">
                  <Label className="text-sm font-medium">Current Color</Label>
                  <Input
                    value={value}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    placeholder="#000000"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Preset Colors */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Preset Colors</Label>
                <div className="grid grid-cols-10 gap-1">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      className={cn(
                        "w-6 h-6 rounded border-2 hover:scale-110 transition-transform",
                        value === color ? "border-gray-800" : "border-gray-200"
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorSelect(color)}
                    />
                  ))}
                </div>
              </div>

              {/* Common Colors */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Common Colors</Label>
                <div className="grid grid-cols-2 gap-2">
                  {COMMON_COLORS.map((color) => (
                    <button
                      key={color.value}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded border hover:bg-gray-50 transition-colors",
                        value === color.value ? "border-blue-500 bg-blue-50" : "border-gray-200"
                      )}
                      onClick={() => handleColorSelect(color.value)}
                    >
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: color.value }}
                      />
                      <span className="text-xs">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Input */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Custom Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={customColor}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={customColor}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
                {!isValidColor(customColor) && (
                  <p className="text-xs text-red-500 mt-1">Invalid color format</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                >
                  Done
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleColorSelect('#000000')}
                >
                  Reset
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Input
          value={value}
          onChange={(e) => handleCustomColorChange(e.target.value)}
          placeholder="#000000"
          className="flex-1"
        />
      </div>

      {fieldConfig?.description && (
        <p className="text-xs text-muted-foreground">
          {fieldConfig.description}
        </p>
      )}
    </div>
  )
}
