'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ZoomControlsProps {
  onZoomChange?: (zoom: number) => void
  className?: string
}

export function ZoomControls({ onZoomChange, className }: ZoomControlsProps) {
  const [zoom, setZoom] = useState(100)

  const zoomLevels = [25, 50, 75, 100, 125, 150, 200, 300, 400, 500, 600]

  const handleZoomIn = () => {
    const currentIndex = zoomLevels.indexOf(zoom)
    if (currentIndex < zoomLevels.length - 1) {
      const newZoom = zoomLevels[currentIndex + 1]
      setZoom(newZoom)
      onZoomChange?.(newZoom)
    }
  }

  const handleZoomOut = () => {
    const currentIndex = zoomLevels.indexOf(zoom)
    if (currentIndex > 0) {
      const newZoom = zoomLevels[currentIndex - 1]
      setZoom(newZoom)
      onZoomChange?.(newZoom)
    }
  }

  const handleReset = () => {
    setZoom(100)
    onZoomChange?.(100)
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-30',
        'bg-background/95 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl',
        'flex items-center gap-1 p-1',
        'hover:shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition-all duration-200',
        className
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={handleZoomOut}
        disabled={zoom <= zoomLevels[0]}
        className="h-8 w-8 p-0 hover:bg-muted transition-all duration-200"
        title="Zoom Out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>

      <button
        onClick={handleReset}
        className="px-3 h-8 text-sm font-medium hover:bg-muted rounded-md transition-all duration-200 min-w-[60px]"
        title="Reset Zoom (100%)"
      >
        {zoom}%
      </button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleZoomIn}
        disabled={zoom >= zoomLevels[zoomLevels.length - 1]}
        className="h-8 w-8 p-0 hover:bg-muted transition-all duration-200"
        title="Zoom In"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        variant="ghost"
        size="sm"
        onClick={handleReset}
        className="h-8 w-8 p-0 hover:bg-muted transition-all duration-200"
        title="Fit to Screen"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
