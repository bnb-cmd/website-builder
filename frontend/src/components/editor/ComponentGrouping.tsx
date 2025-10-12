"use client"

import React, { useState, useCallback } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { cn } from '../../lib/utils'
import { ComponentNode, PageSchema } from '../../lib/schema'
import { 
  Group,
  Ungroup,
  Move,
  RotateCcw,
  Copy,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  MoreHorizontal,
  Layers,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown
} from 'lucide-react'

interface ComponentGroupingProps {
  components: ComponentNode[]
  selectedComponents: ComponentNode[]
  onComponentsUpdate: (components: ComponentNode[]) => void
  onSelectionChange: (components: ComponentNode[]) => void
  pageSchema: PageSchema
  deviceMode: 'desktop' | 'tablet' | 'mobile'
}

interface ComponentGroup {
  id: string
  name: string
  components: ComponentNode[]
  layout: {
    x: number
    y: number
    width: number
    height: number
    zIndex: number
  }
  styles: Record<string, any>
  visible: boolean
  locked: boolean
}

const ComponentGrouping: React.FC<ComponentGroupingProps> = ({
  components,
  selectedComponents,
  onComponentsUpdate,
  onSelectionChange,
  pageSchema,
  deviceMode
}) => {
  const [isGrouping, setIsGrouping] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  // Extract groups from components
  const groups = components.reduce((acc, component) => {
    if (component.groupId) {
      if (!acc[component.groupId]) {
        acc[component.groupId] = {
          id: component.groupId,
          name: `Group ${component.groupId}`,
          components: [],
          layout: { x: 0, y: 0, width: 0, height: 0, zIndex: 1 },
          styles: {},
          visible: true,
          locked: false
        }
      }
      acc[component.groupId].components.push(component)
    }
    return acc
  }, {} as Record<string, ComponentGroup>)

  // Calculate group bounds
  const calculateGroupBounds = (groupComponents: ComponentNode[]) => {
    if (groupComponents.length === 0) return { x: 0, y: 0, width: 0, height: 0 }

    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    groupComponents.forEach(component => {
      const layout = component.layout[deviceMode] || component.layout.default
      minX = Math.min(minX, layout.x)
      minY = Math.min(minY, layout.y)
      maxX = Math.max(maxX, layout.x + layout.width)
      maxY = Math.max(maxY, layout.y + layout.height)
    })

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    }
  }

  // Create group from selected components
  const handleCreateGroup = useCallback(() => {
    if (selectedComponents.length < 2) return

    const groupId = `group_${Date.now()}`
    const groupName = groupName.trim() || `Group ${groupId.slice(-4)}`

    // Calculate group bounds
    const bounds = calculateGroupBounds(selectedComponents)

    // Update components with groupId and relative positions
    const updatedComponents = components.map(component => {
      if (selectedComponents.some(selected => selected.id === component.id)) {
        const layout = component.layout[deviceMode] || component.layout.default
        return {
          ...component,
          groupId,
          layout: {
            ...component.layout,
            [deviceMode]: {
              ...layout,
              x: layout.x - bounds.x,
              y: layout.y - bounds.y,
              zIndex: 1
            }
          }
        }
      }
      return component
    })

    onComponentsUpdate(updatedComponents)
    onSelectionChange([])
    setIsGrouping(false)
    setGroupName('')
  }, [selectedComponents, components, deviceMode, groupName, onComponentsUpdate, onSelectionChange])

  // Ungroup selected components
  const handleUngroup = useCallback(() => {
    const groupIds = new Set(selectedComponents.map(c => c.groupId).filter(Boolean))
    
    const updatedComponents = components.map(component => {
      if (groupIds.has(component.groupId)) {
        const layout = component.layout[deviceMode] || component.layout.default
        const groupBounds = calculateGroupBounds(components.filter(c => c.groupId === component.groupId))
        
        return {
          ...component,
          groupId: undefined,
          layout: {
            ...component.layout,
            [deviceMode]: {
              ...layout,
              x: layout.x + groupBounds.x,
              y: layout.y + groupBounds.y,
              zIndex: components.length + 1
            }
          }
        }
      }
      return component
    })

    onComponentsUpdate(updatedComponents)
    onSelectionChange([])
  }, [selectedComponents, components, deviceMode, onComponentsUpdate, onSelectionChange])

  // Move group
  const handleMoveGroup = useCallback((groupId: string, deltaX: number, deltaY: number) => {
    const updatedComponents = components.map(component => {
      if (component.groupId === groupId) {
        const layout = component.layout[deviceMode] || component.layout.default
        return {
          ...component,
          layout: {
            ...component.layout,
            [deviceMode]: {
              ...layout,
              x: layout.x + deltaX,
              y: layout.y + deltaY
            }
          }
        }
      }
      return component
    })

    onComponentsUpdate(updatedComponents)
  }, [components, deviceMode, onComponentsUpdate])

  // Resize group
  const handleResizeGroup = useCallback((groupId: string, deltaWidth: number, deltaHeight: number) => {
    const groupComponents = components.filter(c => c.groupId === groupId)
    const bounds = calculateGroupBounds(groupComponents)

    const updatedComponents = components.map(component => {
      if (component.groupId === groupId) {
        const layout = component.layout[deviceMode] || component.layout.default
        const scaleX = (bounds.width + deltaWidth) / bounds.width
        const scaleY = (bounds.height + deltaHeight) / bounds.height

        return {
          ...component,
          layout: {
            ...component.layout,
            [deviceMode]: {
              ...layout,
              width: layout.width * scaleX,
              height: layout.height * scaleY
            }
          }
        }
      }
      return component
    })

    onComponentsUpdate(updatedComponents)
  }, [components, deviceMode, onComponentsUpdate])

  // Toggle group visibility
  const handleToggleGroupVisibility = useCallback((groupId: string) => {
    const updatedComponents = components.map(component => {
      if (component.groupId === groupId) {
        return {
          ...component,
          visible: !component.visible
        }
      }
      return component
    })

    onComponentsUpdate(updatedComponents)
  }, [components, onComponentsUpdate])

  // Toggle group lock
  const handleToggleGroupLock = useCallback((groupId: string) => {
    const updatedComponents = components.map(component => {
      if (component.groupId === groupId) {
        return {
          ...component,
          locked: !component.locked
        }
      }
      return component
    })

    onComponentsUpdate(updatedComponents)
  }, [components, onComponentsUpdate])

  // Select group
  const handleSelectGroup = useCallback((groupId: string) => {
    const groupComponents = components.filter(c => c.groupId === groupId)
    onSelectionChange(groupComponents)
  }, [components, onSelectionChange])

  // Toggle group expansion
  const toggleGroupExpansion = (groupId: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId)
    } else {
      newExpanded.add(groupId)
    }
    setExpandedGroups(newExpanded)
  }

  // Check if selected components can be grouped
  const canGroup = selectedComponents.length >= 2 && 
    selectedComponents.every(c => !c.groupId || selectedComponents.every(s => s.groupId === c.groupId))

  // Check if selected components can be ungrouped
  const canUngroup = selectedComponents.length > 0 && 
    selectedComponents.some(c => c.groupId)

  return (
    <div className="space-y-4">
      {/* Grouping Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Group className="w-5 h-5 mr-2" />
            Component Grouping
          </h3>
          <Badge variant="secondary" className="text-xs">
            {selectedComponents.length} selected
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          <Dialog open={isGrouping} onOpenChange={setIsGrouping}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={!canGroup}
                className="flex items-center space-x-2"
              >
                <Group className="w-4 h-4" />
                <span>Group</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Name
                  </label>
                  <Input
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name..."
                    className="w-full"
                  />
                </div>
                <div className="text-sm text-gray-500">
                  {selectedComponents.length} components will be grouped together.
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsGrouping(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateGroup}
                    disabled={!canGroup}
                  >
                    Create Group
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="sm"
            disabled={!canUngroup}
            onClick={handleUngroup}
            className="flex items-center space-x-2"
          >
            <Ungroup className="w-4 h-4" />
            <span>Ungroup</span>
          </Button>
        </div>
      </Card>

      {/* Groups List */}
      {Object.keys(groups).length > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Layers className="w-5 h-5 mr-2" />
            Groups ({Object.keys(groups).length})
          </h3>

          <div className="space-y-2">
            {Object.values(groups).map((group) => {
              const bounds = calculateGroupBounds(group.components)
              const isExpanded = expandedGroups.has(group.id)
              const isSelected = selectedComponents.some(c => c.groupId === group.id)

              return (
                <div
                  key={group.id}
                  className={cn(
                    "border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors",
                    isSelected && "border-blue-300 bg-blue-50"
                  )}
                >
                  {/* Group Header */}
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleGroupExpansion(group.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {isExpanded ? (
                          <FolderOpen className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Folder className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {group.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {group.components.length} components • {bounds.width}×{bounds.height}px
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      {/* Visibility Toggle */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleGroupVisibility(group.id)
                        }}
                      >
                        {group.visible ? (
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
                          handleToggleGroupLock(group.id)
                        }}
                      >
                        {group.locked ? (
                          <Lock className="w-3 h-3" />
                        ) : (
                          <Unlock className="w-3 h-3" />
                        )}
                      </Button>

                      {/* Select Group */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelectGroup(group.id)
                        }}
                      >
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Group Components */}
                  {isExpanded && (
                    <div className="mt-3 ml-6 space-y-1">
                      {group.components.map((component) => {
                        const layout = component.layout[deviceMode] || component.layout.default
                        return (
                          <div
                            key={component.id}
                            className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50"
                          >
                            <div className="flex-shrink-0">
                              <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-gray-900 truncate">
                                {component.props.title || component.props.name || component.type}
                              </div>
                              <div className="text-xs text-gray-500">
                                {layout.width}×{layout.height}px
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Ungrouped Components */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Layers className="w-5 h-5 mr-2" />
          Ungrouped Components
        </h3>

        <div className="space-y-1">
          {components
            .filter(component => !component.groupId)
            .map((component) => {
              const layout = component.layout[deviceMode] || component.layout.default
              const isSelected = selectedComponents.some(c => c.id === component.id)

              return (
                <div
                  key={component.id}
                  className={cn(
                    "flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer",
                    isSelected && "bg-blue-50 border border-blue-200"
                  )}
                  onClick={() => {
                    if (isSelected) {
                      onSelectionChange(selectedComponents.filter(c => c.id !== component.id))
                    } else {
                      onSelectionChange([...selectedComponents, component])
                    }
                  }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {component.props.title || component.props.name || component.type}
                    </div>
                    <div className="text-xs text-gray-500">
                      {layout.width}×{layout.height}px
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {component.visible ? (
                      <Eye className="w-3 h-3 text-gray-400" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-gray-400" />
                    )}
                    {component.locked ? (
                      <Lock className="w-3 h-3 text-gray-400" />
                    ) : (
                      <Unlock className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
                </div>
              )
            })}
        </div>
      </Card>
    </div>
  )
}

export default ComponentGrouping
