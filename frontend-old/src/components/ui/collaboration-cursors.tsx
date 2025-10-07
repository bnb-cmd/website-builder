import React, { useEffect, useRef } from 'react'
import { Collaborator } from '@/hooks/use-collaboration'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface CollaborationCursorsProps {
  collaborators: Collaborator[]
  containerRef?: React.RefObject<HTMLElement>
  className?: string
}

export function CollaborationCursors({
  collaborators,
  containerRef,
  className
}: CollaborationCursorsProps) {
  const cursorsRef = useRef<HTMLDivElement>(null)

  // Get container bounds for cursor positioning
  const getContainerBounds = () => {
    if (containerRef?.current) {
      return containerRef.current.getBoundingClientRect()
    }
    return { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight }
  }

  return (
    <div
      ref={cursorsRef}
      className={cn("pointer-events-none fixed inset-0 z-30", className)}
    >
      <TooltipProvider>
        {collaborators
          .filter(collab => collab.isOnline && collab.cursor)
          .map(collaborator => {
            const containerBounds = getContainerBounds()
            const cursor = collaborator.cursor!

            // Position cursor relative to container
            const x = cursor.x - containerBounds.left
            const y = cursor.y - containerBounds.top

            return (
              <Tooltip key={collaborator.id}>
                <TooltipTrigger asChild>
                  <div
                    className="absolute transition-all duration-100 ease-out"
                    style={{
                      left: x,
                      top: y,
                      transform: 'translate(-2px, -2px)'
                    }}
                  >
                    {/* Cursor pointer */}
                    <div
                      className="relative"
                      style={{
                        color: collaborator.color,
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                      }}
                    >
                      <svg
                        width="20"
                        height="24"
                        viewBox="0 0 20 24"
                        fill="none"
                        className="animate-pulse"
                      >
                        <path
                          d="M2 2L10 18L6 14L14 6L10 10L18 22L2 2Z"
                          fill="currentColor"
                          stroke="white"
                          strokeWidth="1"
                        />
                      </svg>

                      {/* User indicator */}
                      <div className="absolute -top-6 -left-1">
                        <Avatar className="h-5 w-5 border-2 border-white shadow-sm">
                          <AvatarImage src={collaborator.avatar} />
                          <AvatarFallback
                            className="text-xs font-semibold"
                            style={{ backgroundColor: collaborator.color, color: 'white' }}
                          >
                            {collaborator.avatar || collaborator.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>

                    {/* Action indicator */}
                    {collaborator.currentAction && (
                      <div
                        className="absolute top-6 left-0 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap shadow-sm"
                        style={{ backgroundColor: collaborator.color }}
                      >
                        {collaborator.currentAction}
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-popover text-popover-foreground">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={collaborator.avatar} />
                      <AvatarFallback
                        className="text-xs"
                        style={{ backgroundColor: collaborator.color, color: 'white' }}
                      >
                        {collaborator.avatar || collaborator.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm">{collaborator.name}</div>
                      {collaborator.currentAction && (
                        <div className="text-xs text-muted-foreground">
                          {collaborator.currentAction}
                        </div>
                      )}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            )
          })}
      </TooltipProvider>
    </div>
  )
}

interface CollaborationSelectionsProps {
  collaborators: Collaborator[]
  containerRef?: React.RefObject<HTMLElement>
  className?: string
}

export function CollaborationSelections({
  collaborators,
  containerRef,
  className
}: CollaborationSelectionsProps) {
  const getContainerBounds = () => {
    if (containerRef?.current) {
      return containerRef.current.getBoundingClientRect()
    }
    return { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight }
  }

  return (
    <div className={cn("pointer-events-none fixed inset-0 z-20", className)}>
      {collaborators
        .filter(collab => collab.isOnline && collab.selection?.bounds)
        .map(collaborator => {
          const containerBounds = getContainerBounds()
          const bounds = collaborator.selection!.bounds!

          // Position selection relative to container
          const x = bounds.x - containerBounds.left
          const y = bounds.y - containerBounds.top

          return (
            <div
              key={`selection-${collaborator.id}`}
              className="absolute border-2 border-dashed rounded-sm"
              style={{
                left: x,
                top: y,
                width: bounds.width,
                height: bounds.height,
                borderColor: collaborator.color,
                backgroundColor: `${collaborator.color}10`, // 10% opacity
                boxShadow: `0 0 0 1px ${collaborator.color}40`
              }}
            >
              {/* Selection label */}
              <div
                className="absolute -top-6 left-0 px-2 py-1 rounded text-xs font-medium text-white shadow-sm"
                style={{ backgroundColor: collaborator.color }}
              >
                {collaborator.name} {collaborator.currentAction ? `(${collaborator.currentAction})` : '(selecting)'}
              </div>
            </div>
          )
        })}
    </div>
  )
}

interface CollaborationPresenceProps {
  collaborators: Collaborator[]
  className?: string
  compact?: boolean
}

export function CollaborationPresence({
  collaborators,
  className,
  compact = false
}: CollaborationPresenceProps) {
  const activeCollaborators = collaborators.filter(c => c.isOnline)

  if (activeCollaborators.length === 0) return null

  if (compact) {
    return (
      <div className={cn("flex items-center space-x-1", className)}>
        <div className="flex -space-x-2">
          {activeCollaborators.slice(0, 3).map(collaborator => (
            <Avatar key={collaborator.id} className="h-6 w-6 border-2 border-background">
              <AvatarImage src={collaborator.avatar} />
              <AvatarFallback
                className="text-xs"
                style={{ backgroundColor: collaborator.color, color: 'white' }}
              >
                {collaborator.avatar || collaborator.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        {activeCollaborators.length > 3 && (
          <span className="text-xs text-muted-foreground ml-2">
            +{activeCollaborators.length - 3} more
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="text-sm font-medium">Active Collaborators</div>
      <div className="space-y-2">
        {activeCollaborators.map(collaborator => (
          <div key={collaborator.id} className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src={collaborator.avatar} />
                <AvatarFallback
                  style={{ backgroundColor: collaborator.color, color: 'white' }}
                >
                  {collaborator.avatar || collaborator.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div
                className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background"
                style={{ backgroundColor: collaborator.color }}
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">{collaborator.name}</div>
              {collaborator.currentAction && (
                <div className="text-xs text-muted-foreground">
                  {collaborator.currentAction}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
