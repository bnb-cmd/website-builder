import { useState, useEffect, useCallback, useRef } from 'react'

export interface Collaborator {
  id: string
  name: string
  avatar?: string
  color: string
  isOnline: boolean
  lastSeen: Date
  cursor?: {
    x: number
    y: number
    elementId?: string
  }
  selection?: {
    elementIds: string[]
    bounds?: {
      x: number
      y: number
      width: number
      height: number
    }
  }
  currentAction?: string // e.g., "editing text", "moving element"
}

export interface CollaborationEvent {
  type: 'cursor' | 'selection' | 'action' | 'join' | 'leave' | 'update'
  userId: string
  data: any
  timestamp: Date
}

export interface UseCollaborationOptions {
  websiteId: string
  currentUserId: string
  currentUserName: string
  enabled?: boolean
  onCollaboratorUpdate?: (collaborators: Collaborator[]) => void
  onEvent?: (event: CollaborationEvent) => void
}

export function useCollaboration(options: UseCollaborationOptions) {
  const {
    websiteId,
    currentUserId,
    currentUserName,
    enabled = true,
    onCollaboratorUpdate,
    onEvent
  } = options

  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected')
  const [events, setEvents] = useState<CollaborationEvent[]>([])

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const heartbeatIntervalRef = useRef<NodeJS.Timeout>()
  const lastCursorUpdateRef = useRef<{ x: number; y: number; timestamp: number } | null>(null)

  // Generate random color for user
  const generateUserColor = useCallback(() => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }, [])

  // No mock collaborators - start with empty array
  const mockCollaborators: Collaborator[] = []

  // Initialize collaboration
  useEffect(() => {
    if (!enabled) return

    // Simulate connection for demo purposes
    setConnectionStatus('connecting')

    setTimeout(() => {
      setIsConnected(true)
      setConnectionStatus('connected')

      // Add mock collaborators
      setCollaborators(mockCollaborators)

      // Simulate real-time updates
      const interval = setInterval(() => {
        setCollaborators(prev => prev.map(collab => {
          if (collab.isOnline && Math.random() > 0.7) {
            // Randomly update cursor position
            return {
              ...collab,
              cursor: {
                x: 200 + Math.random() * 600,
                y: 100 + Math.random() * 400
              }
            }
          }
          return collab
        }))
      }, 2000)

      return () => clearInterval(interval)
    }, 1000)

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current)
      }
    }
  }, [enabled, websiteId])

  // Update current user cursor position
  const updateCursor = useCallback((x: number, y: number, elementId?: string) => {
    if (!isConnected) return

    const now = Date.now()

    // Throttle cursor updates to avoid spam
    if (lastCursorUpdateRef.current &&
        now - lastCursorUpdateRef.current.timestamp < 50 &&
        Math.abs(x - lastCursorUpdateRef.current.x) < 5 &&
        Math.abs(y - lastCursorUpdateRef.current.y) < 5) {
      return
    }

    lastCursorUpdateRef.current = { x, y, timestamp: now }

    // Update current user in collaborators list
    setCollaborators(prev => prev.map(collab =>
      collab.id === currentUserId
        ? { ...collab, cursor: { x, y, elementId } }
        : collab
    ))

    // Send cursor update (mock for demo)
    const event: CollaborationEvent = {
      type: 'cursor',
      userId: currentUserId,
      data: { x, y, elementId },
      timestamp: new Date()
    }

    onEvent?.(event)
    setEvents(prev => [...prev.slice(-9), event]) // Keep last 10 events
  }, [isConnected, currentUserId, onEvent])

  // Update selection
  const updateSelection = useCallback((elementIds: string[], bounds?: Collaborator['selection']['bounds']) => {
    if (!isConnected) return

    setCollaborators(prev => prev.map(collab =>
      collab.id === currentUserId
        ? { ...collab, selection: { elementIds, bounds } }
        : collab
    ))

    const event: CollaborationEvent = {
      type: 'selection',
      userId: currentUserId,
      data: { elementIds, bounds },
      timestamp: new Date()
    }

    onEvent?.(event)
    setEvents(prev => [...prev.slice(-9), event])
  }, [isConnected, currentUserId, onEvent])

  // Update current action
  const updateAction = useCallback((action: string) => {
    if (!isConnected) return

    setCollaborators(prev => prev.map(collab =>
      collab.id === currentUserId
        ? { ...collab, currentAction: action }
        : collab
    ))

    const event: CollaborationEvent = {
      type: 'action',
      userId: currentUserId,
      data: { action },
      timestamp: new Date()
    }

    onEvent?.(event)
    setEvents(prev => [...prev.slice(-9), event])
  }, [isConnected, currentUserId, onEvent])

  // Get current user
  const currentUser = collaborators.find(c => c.id === currentUserId) || {
    id: currentUserId,
    name: currentUserName,
    color: generateUserColor(),
    isOnline: true,
    lastSeen: new Date()
  }

  // Get active collaborators (online users)
  const activeCollaborators = collaborators.filter(c => c.isOnline && c.id !== currentUserId)

  // Notify parent of collaborator updates
  useEffect(() => {
    onCollaboratorUpdate?.(collaborators)
  }, [collaborators, onCollaboratorUpdate])

  return {
    collaborators,
    currentUser,
    activeCollaborators,
    isConnected,
    connectionStatus,
    events,
    updateCursor,
    updateSelection,
    updateAction
  }
}
