'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Save, 
  Eye, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Undo, 
  Redo, 
  Layers,
  Wand2,
  Palette,
  Settings,
  X,
  Sparkles,
  MousePointer,
  Code,
  History,
  Bot,
  GitBranch,
  Terminal,
  Webhook,
  Shield,
  Globe,
  GraduationCap,
  BookOpen,
  Users,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  RotateCcw,
  Copy,
  Trash2,
  Move,
  Resize,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Link,
  Image,
  Type,
  Square,
  Circle,
  Triangle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface EnhancedEditorToolbarProps {
  viewMode: 'desktop' | 'tablet' | 'mobile'
  onViewModeChange: (mode: 'desktop' | 'tablet' | 'mobile') => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onSave: () => void
  onPreview: () => void
  selectedElement?: any
  onTogglePanel: (panel: string) => void
  activePanels: Set<string>
}

export function EnhancedEditorToolbar({
  viewMode,
  onViewModeChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  onPreview,
  selectedElement,
  onTogglePanel,
  activePanels
}: EnhancedEditorToolbarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const primaryActions = [
    { id: 'undo', icon: Undo, onClick: onUndo, disabled: !canUndo, tooltip: 'Undo' },
    { id: 'redo', icon: Redo, onClick: onRedo, disabled: !canRedo, tooltip: 'Redo' },
    { id: 'save', icon: Save, onClick: onSave, tooltip: 'Save' },
    { id: 'preview', icon: Eye, onClick: onPreview, tooltip: 'Preview' }
  ]

  const viewModes = [
    { id: 'desktop', icon: Monitor, label: 'Desktop' },
    { id: 'tablet', icon: Tablet, label: 'Tablet' },
    { id: 'mobile', icon: Smartphone, label: 'Mobile' }
  ]

  const contextualActions = selectedElement ? [
    { id: 'copy', icon: Copy, tooltip: 'Copy Element' },
    { id: 'duplicate', icon: Copy, tooltip: 'Duplicate Element' },
    { id: 'delete', icon: Trash2, tooltip: 'Delete Element' },
    { id: 'move', icon: Move, tooltip: 'Move Element' },
    { id: 'resize', icon: Resize, tooltip: 'Resize Element' }
  ] : []

  const alignmentActions = selectedElement?.type === 'text' ? [
    { id: 'align-left', icon: AlignLeft, tooltip: 'Align Left' },
    { id: 'align-center', icon: AlignCenter, tooltip: 'Align Center' },
    { id: 'align-right', icon: AlignRight, tooltip: 'Align Right' }
  ] : []

  const textFormattingActions = selectedElement?.type === 'text' ? [
    { id: 'bold', icon: Bold, tooltip: 'Bold' },
    { id: 'italic', icon: Italic, tooltip: 'Italic' },
    { id: 'underline', icon: Underline, tooltip: 'Underline' },
    { id: 'link', icon: Link, tooltip: 'Add Link' }
  ] : []

  return (
    <div className={cn(
      "bg-white/95 backdrop-blur-sm border-b border-gray-200/50 transition-all duration-300",
      isCollapsed ? "h-16" : "h-20"
    )}>
      <div className="flex items-center justify-between px-4 h-full">
        {/* Left Section - Primary Actions */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {primaryActions.map((action) => (
              <Button
                key={action.id}
                variant="ghost"
                size="sm"
                onClick={action.onClick}
                disabled={action.disabled}
                className="h-8 w-8 p-0 hover:bg-white"
                title={action.tooltip}
              >
                <action.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* View Mode Selector */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {viewModes.map((mode) => (
              <Button
                key={mode.id}
                variant={viewMode === mode.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange(mode.id as any)}
                className="h-8 w-8 p-0 hover:bg-white"
                title={mode.label}
              >
                <mode.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>

        {/* Center Section - Contextual Actions */}
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            {contextualActions.length > 0 && (
              <>
                <div className="flex items-center space-x-1 bg-blue-50 rounded-lg p-1">
                  {contextualActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-blue-100"
                      title={action.tooltip}
                    >
                      <action.icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
                <Separator orientation="vertical" className="h-8" />
              </>
            )}

            {alignmentActions.length > 0 && (
              <>
                <div className="flex items-center space-x-1 bg-green-50 rounded-lg p-1">
                  {alignmentActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-green-100"
                      title={action.tooltip}
                    >
                      <action.icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
                <Separator orientation="vertical" className="h-8" />
              </>
            )}

            {textFormattingActions.length > 0 && (
              <div className="flex items-center space-x-1 bg-purple-50 rounded-lg p-1">
                {textFormattingActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-purple-100"
                    title={action.tooltip}
                  >
                    <action.icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Right Section - Panel Toggles */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'layers', icon: Layers, tooltip: 'Layers' },
              { id: 'properties', icon: Settings, tooltip: 'Properties' },
              { id: 'ai-assistant', icon: Bot, tooltip: 'AI Assistant' },
              { id: 'components', icon: MousePointer, tooltip: 'Components' }
            ].map((panel) => (
              <Button
                key={panel.id}
                variant={activePanels.has(panel.id) ? "default" : "ghost"}
                size="sm"
                onClick={() => onTogglePanel(panel.id)}
                className="h-8 w-8 p-0 hover:bg-white"
                title={panel.tooltip}
              >
                <panel.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
            title={isCollapsed ? "Expand toolbar" : "Collapse toolbar"}
          >
            {isCollapsed ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Selected Element Info */}
      {selectedElement && !isCollapsed && (
        <div className="px-4 py-2 bg-blue-50/50 border-t border-blue-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {selectedElement.type}
              </Badge>
              <span className="text-sm text-gray-600">
                {selectedElement.id}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>Position: {selectedElement.position?.x || 0}, {selectedElement.position?.y || 0}</span>
              <span>Size: {selectedElement.size?.width || 'auto'} × {selectedElement.size?.height || 'auto'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface FloatingActionPanelProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title: string
  position?: 'left' | 'right'
}

export function FloatingActionPanel({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  position = 'right' 
}: FloatingActionPanelProps) {
  if (!isOpen) return null

  return (
    <div className={cn(
      "fixed top-20 z-50 w-80 h-[calc(100vh-5rem)] bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-lg shadow-xl transition-all duration-300",
      position === 'right' ? 'right-4' : 'left-4'
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4 h-[calc(100%-4rem)] overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

interface EnhancedCanvasProps {
  children: React.ReactNode
  viewMode: 'desktop' | 'tablet' | 'mobile'
  onElementSelect: (elementId: string) => void
  selectedElement?: any
}

export function EnhancedCanvas({ 
  children, 
  viewMode, 
  onElementSelect, 
  selectedElement 
}: EnhancedCanvasProps) {
  const getCanvasSize = () => {
    switch (viewMode) {
      case 'mobile': return 'max-w-sm'
      case 'tablet': return 'max-w-2xl'
      case 'desktop': return 'max-w-6xl'
      default: return 'max-w-6xl'
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50/50 p-8">
      <div className={cn(
        "relative bg-white rounded-lg shadow-lg border border-gray-200/50 transition-all duration-300",
        getCanvasSize()
      )}>
        {/* Canvas Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200/50 bg-gray-50/50 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-xs text-gray-500 font-mono">
            {viewMode.toUpperCase()}
          </div>
        </div>

        {/* Canvas Content */}
        <div 
          className="relative min-h-[600px] p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onElementSelect('')
            }
          }}
        >
          {children}
        </div>

        {/* Canvas Overlay Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm"
            title="Reset zoom"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm"
            title="Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}