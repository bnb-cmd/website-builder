'use client'

import { useState } from 'react'
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Trash2, 
  Copy, 
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Folder,
  Type,
  Image,
  Square,
  Layout,
  Zap
} from 'lucide-react'
import { Element } from '@/types/editor'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface LayerPanelProps {
  elements: Element[]
  selectedElement: Element | null
  onSelectElement: (elementId: string) => void
  onUpdateElement: (elementId: string, updates: Partial<Element>) => void
  onDeleteElement: (elementId: string) => void
  onDuplicateElement: (elementId: string) => void
  onReorderElements: (elements: Element[]) => void
}

interface LayerItemProps {
  element: Element
  depth: number
  isSelected: boolean
  onSelect: () => void
  onToggleVisibility: () => void
  onToggleLock: () => void
  onDelete: () => void
  onDuplicate: () => void
  onRename: (name: string) => void
  children?: React.ReactNode
}

function LayerItem({
  element,
  depth,
  isSelected,
  onSelect,
  onToggleVisibility,
  onToggleLock,
  onDelete,
  onDuplicate,
  onRename,
  children
}: LayerItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [editValue, setEditValue] = useState(element.props.name || element.type)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: element.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getElementIcon = () => {
    switch (element.type) {
      case 'text':
      case 'heading':
        return <Type className="h-3 w-3" />
      case 'image':
        return <Image className="h-3 w-3" />
      case 'button':
        return <Square className="h-3 w-3" />
      case 'container':
        return <Layout className="h-3 w-3" />
      default:
        return <Zap className="h-3 w-3" />
    }
  }

  const handleRename = () => {
    onRename(editValue)
    setIsEditing(false)
  }

  const isVisible = element.style?.display !== 'none'
  const isLocked = element.props.locked || false

  return (
    <div style={style} ref={setNodeRef}>
      <div
        className={cn(
          'group flex items-center px-2 py-1 hover:bg-muted/50 rounded cursor-pointer',
          isSelected && 'bg-primary/10 hover:bg-primary/20',
          !isVisible && 'opacity-50'
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={onSelect}
      >
        {/* Expand/Collapse for containers */}
        {element.children?.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 mr-1"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        )}

        {/* Drag Handle */}
        <div
          className="cursor-move mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
          {...attributes}
          {...listeners}
        >
          <svg width="6" height="10" viewBox="0 0 6 10" fill="currentColor" className="text-muted-foreground">
            <circle cx="1.5" cy="1.5" r="1" />
            <circle cx="4.5" cy="1.5" r="1" />
            <circle cx="1.5" cy="5" r="1" />
            <circle cx="4.5" cy="5" r="1" />
            <circle cx="1.5" cy="8.5" r="1" />
            <circle cx="4.5" cy="8.5" r="1" />
          </svg>
        </div>

        {/* Icon */}
        <div className="mr-2 text-muted-foreground">
          {getElementIcon()}
        </div>

        {/* Name */}
        {isEditing ? (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleRename}
            onKeyPress={(e) => e.key === 'Enter' && handleRename()}
            className="h-6 text-xs px-1 py-0"
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
        ) : (
          <span
            className="flex-1 text-sm truncate"
            onDoubleClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
            }}
          >
            {element.props.name || element.type}
          </span>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation()
              onToggleVisibility()
            }}
          >
            {isVisible ? (
              <Eye className="h-3 w-3" />
            ) : (
              <EyeOff className="h-3 w-3" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation()
              onToggleLock()
            }}
          >
            {isLocked ? (
              <Lock className="h-3 w-3" />
            ) : (
              <Unlock className="h-3 w-3" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="h-3 w-3 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setIsEditing(true)}
              >
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Children */}
      {isExpanded && children}
    </div>
  )
}

export function LayerPanel({
  elements,
  selectedElement,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onReorderElements
}: LayerPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showOnlyVisible, setShowOnlyVisible] = useState(false)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      // Find the elements and reorder them
      const activeIndex = elements.findIndex((el) => el.id === active.id)
      const overIndex = elements.findIndex((el) => el.id === over.id)

      if (activeIndex !== -1 && overIndex !== -1) {
        const newElements = [...elements]
        const [removed] = newElements.splice(activeIndex, 1)
        newElements.splice(overIndex, 0, removed)
        onReorderElements(newElements)
      }
    }
  }

  const toggleVisibility = (elementId: string) => {
    const element = findElement(elements, elementId)
    if (element) {
      onUpdateElement(elementId, {
        style: {
          ...element.style,
          display: element.style?.display === 'none' ? 'block' : 'none'
        }
      })
    }
  }

  const toggleLock = (elementId: string) => {
    const element = findElement(elements, elementId)
    if (element) {
      onUpdateElement(elementId, {
        props: {
          ...element.props,
          locked: !element.props.locked
        }
      })
    }
  }

  const renameElement = (elementId: string, name: string) => {
    onUpdateElement(elementId, {
      props: {
        ...findElement(elements, elementId)?.props,
        name
      }
    })
  }

  const findElement = (elements: Element[], id: string): Element | null => {
    for (const element of elements) {
      if (element.id === id) return element
      if (element.children) {
        const found = findElement(element.children, id)
        if (found) return found
      }
    }
    return null
  }

  const filterElements = (elements: Element[]): Element[] => {
    return elements.filter(element => {
      const matchesSearch = !searchQuery || 
        element.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        element.props.name?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesVisibility = !showOnlyVisible || element.style?.display !== 'none'
      
      return matchesSearch && matchesVisibility
    })
  }

  const renderElements = (elements: Element[], depth = 0): React.ReactNode => {
    const filteredElements = filterElements(elements)
    
    return (
      <SortableContext items={filteredElements.map(el => el.id)} strategy={verticalListSortingStrategy}>
        {filteredElements.map((element) => (
          <LayerItem
            key={element.id}
            element={element}
            depth={depth}
            isSelected={selectedElement?.id === element.id}
            onSelect={() => onSelectElement(element.id)}
            onToggleVisibility={() => toggleVisibility(element.id)}
            onToggleLock={() => toggleLock(element.id)}
            onDelete={() => onDeleteElement(element.id)}
            onDuplicate={() => onDuplicateElement(element.id)}
            onRename={(name) => renameElement(element.id, name)}
          >
            {element.children && renderElements(element.children, depth + 1)}
          </LayerItem>
        ))}
      </SortableContext>
    )
  }

  return (
    <Card className="w-64 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center">
            <Layers className="h-4 w-4 mr-2" />
            Layers
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {elements.length}
          </Badge>
        </div>

        {/* Search and Filters */}
        <div className="space-y-2 mt-3">
          <Input
            placeholder="Search layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 text-xs"
          />
          
          <div className="flex items-center space-x-2">
            <Button
              variant={showOnlyVisible ? 'default' : 'outline'}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setShowOnlyVisible(!showOnlyVisible)}
            >
              <Eye className="h-3 w-3 mr-1" />
              Visible Only
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="py-2">
              {elements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No layers yet</p>
                  <p className="text-xs">Add elements to see them here</p>
                </div>
              ) : (
                renderElements(elements)
              )}
            </div>
          </DndContext>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
