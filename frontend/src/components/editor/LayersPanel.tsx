"use client"

import React, { useState, useEffect } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { cn } from '../../lib/utils'
import { ComponentNode, PageSchema } from '../../lib/schema'
import { 
  Search,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  GripVertical,
  Trash2,
  Copy,
  Edit,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  Layers,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react'

interface LayersPanelProps {
  components: ComponentNode[]
  selectedComponent: ComponentNode | null
  onComponentSelect: (component: ComponentNode | null) => void
  onComponentUpdate: (component: ComponentNode) => void
  onComponentDelete: (componentId: string) => void
  onComponentDuplicate: (component: ComponentNode) => void
  pageSchema: PageSchema
  deviceMode: 'desktop' | 'tablet' | 'mobile'
}

interface LayerItem {
  id: string
  name: string
  type: string
  visible: boolean
  locked: boolean
  zIndex: number
  children?: LayerItem[]
  parentId?: string
}

const LayersPanel: React.FC<LayersPanelProps> = ({
  components,
  selectedComponent,
  onComponentSelect,
  onComponentUpdate,
  onComponentDelete,
  onComponentDuplicate,
  pageSchema,
  deviceMode
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'zIndex' | 'name' | 'type'>('zIndex')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [filterVisible, setFilterVisible] = useState(false)
  const [filterLocked, setFilterLocked] = useState(false)

  // Convert components to layer items
  const layerItems: LayerItem[] = components.map(component => {
    const layout = component.layout[deviceMode] || component.layout.default
    return {
      id: component.id,
      name: component.props.title || component.props.name || component.type,
      type: component.type,
      visible: component.visible ?? true,
      locked: component.locked ?? false,
      zIndex: layout.zIndex || 1,
      parentId: component.groupId
    }
  })

  // Group components by groupId
  const groupedItems = layerItems.reduce((acc, item) => {
    if (item.parentId) {
      if (!acc[item.parentId]) {
        acc[item.parentId] = []
      }
      acc[item.parentId].push(item)
    } else {
      acc['ungrouped'] = acc['ungrouped'] || []
      acc['ungrouped'].push(item)
    }
    return acc
  }, {} as Record<string, LayerItem[]>)

  // Sort items
  const sortedItems = Object.entries(groupedItems).map(([groupId, items]) => [
    groupId,
    items.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'zIndex':
          comparison = a.zIndex - b.zIndex
          break
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'type':
          comparison = a.type.localeCompare(b.type)
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })
  ])

  // Filter items
  const filteredItems = sortedItems.filter(([groupId, items]) => {
    if (searchQuery) {
      return items.some(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return true
  }).map(([groupId, items]) => [
    groupId,
    items.filter(item => {
      if (filterVisible && !item.visible) return false
      if (filterLocked && !item.locked) return false
      return true
    })
  ]).filter(([groupId, items]) => items.length > 0)

  const handleToggleVisibility = (componentId: string) => {
    const component = components.find(c => c.id === componentId)
    if (component) {
      const updatedComponent = {
        ...component,
        visible: !component.visible
      }
      onComponentUpdate(updatedComponent)
    }
  }

  const handleToggleLock = (componentId: string) => {
    const component = components.find(c => c.id === componentId)
    if (component) {
      const updatedComponent = {
        ...component,
        locked: !component.locked
      }
      onComponentUpdate(updatedComponent)
    }
  }

  const handleDelete = (componentId: string) => {
    onComponentDelete(componentId)
  }

  const handleDuplicate = (componentId: string) => {
    const component = components.find(c => c.id === componentId)
    if (component) {
      onComponentDuplicate(component)
    }
  }

  const handleRename = (componentId: string, newName: string) => {
    const component = components.find(c => c.id === componentId)
    if (component) {
      const updatedComponent = {
        ...component,
        props: {
          ...component.props,
          title: newName
        }
      }
      onComponentUpdate(updatedComponent)
    }
  }

  const toggleGroupExpansion = (groupId: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId)
    } else {
      newExpanded.add(groupId)
    }
    setExpandedGroups(newExpanded)
  }

  const LayerItemComponent: React.FC<{ item: LayerItem; isGroup?: boolean; groupId?: string }> = ({ 
    item, 
    isGroup = false, 
    groupId 
  }) => {
    const [isRenaming, setIsRenaming] = useState(false)
    const [renameValue, setRenameValue] = useState(item.name)
    const isSelected = selectedComponent?.id === item.id

    const handleRenameSubmit = () => {
      if (renameValue.trim() && renameValue !== item.name) {
        handleRename(item.id, renameValue.trim())
      }
      setIsRenaming(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleRenameSubmit()
      } else if (e.key === 'Escape') {
        setIsRenaming(false)
        setRenameValue(item.name)
      }
    }

    return (
      <div
        className={cn(
          "flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer group",
          isSelected && "bg-blue-50 border border-blue-200"
        )}
        onClick={() => onComponentSelect(components.find(c => c.id === item.id) || null)}
      >
        {/* Drag Handle */}
        <div className="flex-shrink-0 text-gray-400 group-hover:text-gray-600">
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Icon */}
        <div className="flex-shrink-0">
          {isGroup ? (
            <Folder className="w-4 h-4 text-gray-500" />
          ) : (
            <File className="w-4 h-4 text-gray-500" />
          )}
        </div>

        {/* Name */}
        <div className="flex-1 min-w-0">
          {isRenaming ? (
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={handleKeyDown}
              className="h-6 text-sm"
              autoFocus
            />
          ) : (
            <div className="text-sm font-medium text-gray-900 truncate">
              {item.name}
            </div>
          )}
          {!isGroup && (
            <div className="text-xs text-gray-500 truncate">
              {item.type}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Visibility Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation()
              handleToggleVisibility(item.id)
            }}
          >
            {item.visible ? (
              <Eye className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3" />
            )}
          </Button>

          {/* Lock Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation()
              handleToggleLock(item.id)
            }}
          >
            {item.locked ? (
              <Lock className="w-3 h-3" />
            ) : (
              <Unlock className="w-3 h-3" />
            )}
          </Button>

          {/* More Actions */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Component Actions</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setIsRenaming(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Rename
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleDuplicate(item.id)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Layers className="w-5 h-5 mr-2" />
            Layers
          </h3>
          <Badge variant="secondary" className="text-xs">
            {components.length}
          </Badge>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Sort */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </Button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'zIndex' | 'name' | 'type')}
              className="text-xs border border-gray-300 rounded px-2 py-1"
            >
              <option value="zIndex">Z-Index</option>
              <option value="name">Name</option>
              <option value="type">Type</option>
            </select>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2">
            <Button
              variant={filterVisible ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterVisible(!filterVisible)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant={filterLocked ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterLocked(!filterLocked)}
            >
              <Lock className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Layers List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <Layers className="w-8 h-8 mx-auto" />
              </div>
              <p className="text-sm text-gray-500">
                {searchQuery ? 'No layers found' : 'No layers yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map(([groupId, items]) => (
                <div key={groupId}>
                  {groupId !== 'ungrouped' && (
                    <div
                      className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleGroupExpansion(groupId)}
                    >
                      <div className="flex-shrink-0">
                        {expandedGroups.has(groupId) ? (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {expandedGroups.has(groupId) ? (
                          <FolderOpen className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Folder className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1 text-sm font-medium text-gray-900">
                        Group {groupId}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {items.length}
                      </Badge>
                    </div>
                  )}
                  
                  {expandedGroups.has(groupId) && (
                    <div className="ml-4 space-y-1">
                      {items.map((item) => (
                        <LayerItemComponent key={item.id} item={item} />
                      ))}
                    </div>
                  )}
                  
                  {groupId === 'ungrouped' && (
                    <div className="space-y-1">
                      {items.map((item) => (
                        <LayerItemComponent key={item.id} item={item} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}

export default LayersPanel
