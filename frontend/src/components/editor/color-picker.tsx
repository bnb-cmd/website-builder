'use client'

import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

const presetColors = [
  '#000000', '#ffffff', '#f3f4f6', '#e5e7eb', '#9ca3af', '#6b7280', '#374151', '#1f2937',
  '#fef2f2', '#fee2e2', '#fecaca', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b',
  '#fff7ed', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412',
  '#fefce8', '#fef08a', '#facc15', '#eab308', '#ca8a04', '#a16207', '#854d0e', '#713f12',
  '#f0fdf4', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534',
  '#ecfeff', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#059669', '#047857', '#065f46',
  '#f0f9ff', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#075985',
  '#ede9fe', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95',
  '#fdf2f8', '#fce7f3', '#fbcfe8', '#f9a8d4', '#ec4899', '#db2777', '#be185d', '#9d174d'
]

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue)
    if (newValue.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      onChange(newValue)
    }
  }

  const handlePresetClick = (color: string) => {
    setInputValue(color)
    onChange(color)
    setIsOpen(false)
  }

  return (
    <div className="flex items-center space-x-2 mt-1">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-12 h-10 p-0 border-2"
            style={{ backgroundColor: value }}
          >
            <span className="sr-only">Pick color</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4">
          <div className="space-y-4">
            <div>
              <Label>Color Value</Label>
              <Input
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="#000000"
                className="font-mono"
              />
            </div>
            
            <div>
              <Label>Preset Colors</Label>
              <div className="grid grid-cols-8 gap-2 mt-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => handlePresetClick(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label>Custom Color</Label>
              <input
                type="color"
                value={value}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  onChange(e.target.value)
                }}
                className="w-full h-10 rounded border border-border cursor-pointer"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Input
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="#000000"
        className="font-mono flex-1"
      />
    </div>
  )
}
