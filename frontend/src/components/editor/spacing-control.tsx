'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Link2, Unlink } from 'lucide-react'

interface SpacingControlProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function SpacingControl({ label, value, onChange }: SpacingControlProps) {
  const [isLinked, setIsLinked] = useState(true)
  const [values, setValues] = useState(() => {
    // Parse the current value
    const parts = value.split(' ')
    if (parts.length === 1) {
      return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] }
    } else if (parts.length === 2) {
      return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] }
    } else if (parts.length === 4) {
      return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] }
    }
    return { top: '0px', right: '0px', bottom: '0px', left: '0px' }
  })

  const updateValue = (side: 'top' | 'right' | 'bottom' | 'left', newValue: string) => {
    if (isLinked) {
      const newValues = { top: newValue, right: newValue, bottom: newValue, left: newValue }
      setValues(newValues)
      onChange(newValue)
    } else {
      const newValues = { ...values, [side]: newValue }
      setValues(newValues)
      onChange(`${newValues.top} ${newValues.right} ${newValues.bottom} ${newValues.left}`)
    }
  }

  const toggleLinked = () => {
    setIsLinked(!isLinked)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLinked}
          className="h-6 w-6 p-0"
        >
          {isLinked ? (
            <Link2 className="h-3 w-3" />
          ) : (
            <Unlink className="h-3 w-3" />
          )}
        </Button>
      </div>

      {isLinked ? (
        <Input
          value={values.top}
          onChange={(e) => updateValue('top', e.target.value)}
          placeholder="0px"
          className="text-center"
        />
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {/* Top */}
          <div></div>
          <Input
            value={values.top}
            onChange={(e) => updateValue('top', e.target.value)}
            placeholder="0px"
            className="text-center text-xs"
          />
          <div></div>

          {/* Left and Right */}
          <Input
            value={values.left}
            onChange={(e) => updateValue('left', e.target.value)}
            placeholder="0px"
            className="text-center text-xs"
          />
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border border-border rounded bg-muted"></div>
          </div>
          <Input
            value={values.right}
            onChange={(e) => updateValue('right', e.target.value)}
            placeholder="0px"
            className="text-center text-xs"
          />

          {/* Bottom */}
          <div></div>
          <Input
            value={values.bottom}
            onChange={(e) => updateValue('bottom', e.target.value)}
            placeholder="0px"
            className="text-center text-xs"
          />
          <div></div>
        </div>
      )}
    </div>
  )
}
