"use client";

import React, { useState, useRef } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { cn } from '../../lib/utils'
import { useEditorStore } from '../../lib/store'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { 
  Trash2, 
  Move, 
  Copy,
  Edit,
  Eye,
  EyeOff,
  Lock,
  Unlock
} from 'lucide-react'

interface PageComponent {
  id: string
  type: string
  props: Record<string, any>
  children?: PageComponent[]
  style?: Record<string, any>
  position?: { x: number; y: number }
  locked?: boolean
  visible?: boolean
}

interface EditorCanvasProps {
  components: PageComponent[]
  onComponentsChange: (components: PageComponent[]) => void
  onComponentSelect: (component: PageComponent | null) => void
  selectedComponent: PageComponent | null
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  components,
  onComponentsChange,
  onComponentSelect,
  selectedComponent
}) => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [draggedComponent, setDraggedComponent] = useState<any>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const { isPreviewMode } = useEditorStore()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setIsDragOver(true)
    console.log('Drag over canvas')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    console.log('Drop event triggered')
    
    try {
      const componentData = JSON.parse(e.dataTransfer.getData('application/json'))
      console.log('Dropped component data:', componentData)
      const rect = canvasRef.current?.getBoundingClientRect()
      
      if (rect) {
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        const newComponent: PageComponent = {
          id: `${componentData.id}_${Date.now()}`,
          type: componentData.id,
          props: getDefaultProps(componentData.id),
          position: { x, y },
          visible: true,
          locked: false
        }
        
        console.log('Creating new component:', newComponent)
        onComponentsChange([...components, newComponent])
        onComponentSelect(newComponent)
      }
    } catch (error) {
      console.error('Failed to drop component:', error)
    }
  }

  const handleComponentClick = (component: PageComponent, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isPreviewMode) {
      onComponentSelect(component)
    }
  }

  const handleDeleteComponent = (componentId: string) => {
    const updatedComponents = components.filter(c => c.id !== componentId)
    onComponentsChange(updatedComponents)
    onComponentSelect(null)
  }

  const handleDuplicateComponent = (component: PageComponent) => {
    const duplicated: PageComponent = {
      ...component,
      id: `${component.type}_${Date.now()}`,
      position: component.position ? 
        { x: component.position.x + 20, y: component.position.y + 20 } : 
        undefined
    }
    onComponentsChange([...components, duplicated])
  }

  const handleToggleVisibility = (componentId: string) => {
    const updatedComponents = components.map(c => 
      c.id === componentId ? { ...c, visible: !c.visible } : c
    )
    onComponentsChange(updatedComponents)
  }

  const handleToggleLock = (componentId: string) => {
    const updatedComponents = components.map(c => 
      c.id === componentId ? { ...c, locked: !c.locked } : c
    )
    onComponentsChange(updatedComponents)
  }

  const renderComponent = (component: PageComponent) => {
    const isSelected = selectedComponent?.id === component.id
    const isHidden = !component.visible
    const isLocked = component.locked
    
    const componentStyle = {
      position: 'absolute' as const,
      left: component.position?.x || 0,
      top: component.position?.y || 0,
      opacity: isHidden ? 0.5 : 1,
      cursor: isLocked ? 'not-allowed' : 'pointer',
      ...component.style
    }

    return (
      <div
        key={component.id}
        style={componentStyle}
        onClick={(e) => handleComponentClick(component, e)}
        className={cn(
          'group relative',
          isSelected && !isPreviewMode && 'ring-2 ring-primary ring-offset-2',
          isHidden && 'pointer-events-none'
        )}
      >
        {/* Component Content */}
        <div className={cn(
          'transition-all duration-200',
          isSelected && !isPreviewMode && 'outline outline-2 outline-primary'
        )}>
          {renderComponentContent(component)}
        </div>
        
        {/* Component Controls */}
        {!isPreviewMode && isSelected && (
          <div className="absolute -top-8 left-0 flex items-center space-x-1 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
            <span>{component.type}</span>
            
            <div className="flex items-center space-x-1 ml-2">
              <Button
                size="sm"
                variant="ghost"
                className="h-5 w-5 p-0 text-primary-foreground hover:bg-primary/20"
                onClick={() => handleToggleVisibility(component.id)}
              >
                {component.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                className="h-5 w-5 p-0 text-primary-foreground hover:bg-primary/20"
                onClick={() => handleToggleLock(component.id)}
              >
                {component.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                className="h-5 w-5 p-0 text-primary-foreground hover:bg-primary/20"
                onClick={() => handleDuplicateComponent(component)}
              >
                <Copy className="h-3 w-3" />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                className="h-5 w-5 p-0 text-primary-foreground hover:bg-primary/20"
                onClick={() => handleDeleteComponent(component.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
        
        {/* Locked indicator */}
        {isLocked && !isPreviewMode && (
          <div className="absolute top-1 right-1">
            <Lock className="h-3 w-3 text-muted-foreground" />
          </div>
        )}
      </div>
    )
  }

  const renderComponentContent = (component: PageComponent) => {
    switch (component.type) {
      case 'heading':
        return (
          <h2 className="text-2xl font-bold">
            {component.props.text || 'Your Heading Here'}
          </h2>
        )
      
      case 'text':
        return (
          <p className="text-base">
            {component.props.text || 'Your text content goes here. Click to edit this text and make it your own.'}
          </p>
        )
      
      case 'image':
        return (
          <div className="w-64 h-40 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center bg-muted/50">
            {component.props.src ? (
              <ImageWithFallback
                src={component.props.src}
                alt={component.props.alt || 'Image'}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <ImageWithFallback 
                  src=""
                  alt="Placeholder"
                  className="w-12 h-12 mx-auto mb-2 opacity-50"
                />
                <p className="text-sm">Click to add image</p>
              </div>
            )}
          </div>
        )
      
      case 'button':
        return (
          <Button variant={component.props.variant || 'default'}>
            {component.props.text || 'Click Me'}
          </Button>
        )
      
      case 'container':
        return (
          <div className="min-w-64 min-h-32 border-2 border-dashed border-muted-foreground rounded-lg p-4 bg-muted/20">
            <p className="text-sm text-muted-foreground text-center">Container</p>
          </div>
        )
      
      case 'divider':
        return <hr className="w-64 border-t-2 border-muted-foreground" />
      
      case 'hero-section':
        return (
          <div className="w-96 h-64 bg-gradient-to-r from-primary to-primary/70 rounded-lg p-8 text-primary-foreground">
            <h1 className="text-3xl font-bold mb-4">
              {component.props.title || 'Your Hero Title'}
            </h1>
            <p className="mb-6">
              {component.props.subtitle || 'Compelling subtitle that describes your business'}
            </p>
            <Button variant="secondary">
              {component.props.buttonText || 'Get Started'}
            </Button>
          </div>
        )
      
      case 'contact-form':
        return (
          <Card className="w-80 p-6">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Name" 
                className="w-full p-2 border rounded"
                readOnly 
              />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full p-2 border rounded"
                readOnly 
              />
              <textarea 
                placeholder="Message" 
                className="w-full p-2 border rounded h-20"
                readOnly 
              />
              <Button className="w-full">Send Message</Button>
            </div>
          </Card>
        )
      
      default:
        return (
          <div className="w-32 h-20 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center bg-muted/50">
            <p className="text-sm text-muted-foreground">{component.type}</p>
          </div>
        )
    }
  }

  return (
    <div className="flex-1 bg-gray-50 relative overflow-auto">
      {/* Canvas */}
      <div
        ref={canvasRef}
        className={cn(
          "min-h-full min-w-full relative p-8 transition-colors",
          isDragOver && "bg-primary/5 border-2 border-dashed border-primary"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => onComponentSelect(null)}
      >
        {/* Canvas Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
        
        {/* Drop Zone Hint */}
        {components.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-muted-foreground">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <Move className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Start Building</h3>
              <p>Drag components from the sidebar to build your page</p>
            </div>
          </div>
        )}
        
        {/* Render Components */}
        {components.map(renderComponent)}
      </div>
    </div>
  )
}

// Helper function to get default props for components
function getDefaultProps(componentType: string): Record<string, any> {
  switch (componentType) {
    case 'heading':
      return { text: 'Your Heading Here', level: 2 }
    case 'text':
      return { text: 'Your text content goes here. Click to edit this text and make it your own.' }
    case 'button':
      return { text: 'Click Me', variant: 'default' }
    case 'image':
      return { src: '', alt: 'Image', width: 300, height: 200 }
    case 'hero-section':
      return {
        title: 'Your Hero Title',
        subtitle: 'Compelling subtitle that describes your business',
        buttonText: 'Get Started'
      }
    default:
      return {}
  }
}