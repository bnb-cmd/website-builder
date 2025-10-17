import React from 'react'
import { Button } from '../../ui/button'
import { Label } from '../../ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { ScrollArea } from '../../ui/scroll-area'
import { Sparkles } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { getPresetsForComponent, applyPreset, PropertyPreset } from '@/lib/property-presets'

interface PresetSelectorProps {
  componentType: string
  currentProps: Record<string, any>
  onApplyPreset: (preset: PropertyPreset) => void
  fieldName?: string
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  componentType,
  currentProps,
  onApplyPreset,
  fieldName = 'presets'
}) => {
  const presets = getPresetsForComponent(componentType)

  if (presets.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        Quick Presets
      </Label>

      <ScrollArea className="max-h-48">
        <div className="space-y-2">
          {presets.map((preset, index) => (
            <Card key={index} className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">{preset.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {preset.description}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onApplyPreset(preset)}
                    className="h-7 px-2"
                  >
                    Apply
                  </Button>
                </div>

                {/* Show which properties will be changed */}
                <div className="flex flex-wrap gap-1">
                  {Object.keys(preset.properties).map((key) => (
                    <Badge key={key} variant="secondary" className="text-xs">
                      {key}: {String(preset.properties[key])}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <p className="text-xs text-muted-foreground">
        Apply preset configurations to quickly style your component
      </p>
    </div>
  )
}
