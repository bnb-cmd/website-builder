import { useCallback, useEffect, useRef, useState } from 'react'
import { EditorHistoryManager, PatchManager, ImmerStateManager, KeyboardShortcutsManager } from './history'
import { ComponentNode, PageSchema, ComponentOperation, PatchOperation } from './schema'

// Get API base URL for Railway backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://website-builder-production-e38b.up.railway.app'

export interface UseUndoRedoOptions {
  maxStates?: number
  debounceMs?: number
  onStateChange?: (state: PageSchema) => void
  onPatchCreated?: (patch: PatchOperation[]) => void
}

export interface UseUndoRedoReturn {
  // State
  currentState: PageSchema
  canUndo: boolean
  canRedo: boolean
  historyInfo: {
    states: number
    currentIndex: number
    maxStates: number
  }
  
  // Actions
  undo: () => void
  redo: () => void
  addState: (operation: ComponentOperation, components: ComponentNode[]) => void
  clearHistory: () => void
  
  // State management
  updateState: (updater: (draft: PageSchema) => void) => void
  setState: (newState: PageSchema) => void
  
  // Patch management
  createPatch: (before: any, after: any) => PatchOperation[]
  applyPatch: (patch: PatchOperation[]) => void
}

export function useUndoRedo(
  initialState: PageSchema,
  options: UseUndoRedoOptions = {}
): UseUndoRedoReturn {
  const {
    maxStates = 50,
    debounceMs = 300,
    onStateChange,
    onPatchCreated
  } = options

  // Refs for managers
  const historyManagerRef = useRef<EditorHistoryManager | null>(null)
  const stateManagerRef = useRef<ImmerStateManager | null>(null)
  const keyboardShortcutsRef = useRef<KeyboardShortcutsManager | null>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize managers
  useEffect(() => {
    historyManagerRef.current = new EditorHistoryManager(maxStates)
    stateManagerRef.current = new ImmerStateManager(initialState)
    keyboardShortcutsRef.current = new KeyboardShortcutsManager()

    // Setup keyboard shortcuts
    const handleKeyDown = (event: KeyboardEvent) => {
      keyboardShortcutsRef.current?.handleKeyDown(event)
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [maxStates])

  // Update keyboard shortcuts with current handlers
  useEffect(() => {
    if (!keyboardShortcutsRef.current) return

    // Update undo shortcut
    keyboardShortcutsRef.current.addShortcut('ctrl+z', () => {
      undo()
    })

    keyboardShortcutsRef.current.addShortcut('meta+z', () => {
      undo()
    })

    // Update redo shortcuts
    keyboardShortcutsRef.current.addShortcut('ctrl+shift+z', () => {
      redo()
    })

    keyboardShortcutsRef.current.addShortcut('meta+shift+z', () => {
      redo()
    })

    keyboardShortcutsRef.current.addShortcut('ctrl+y', () => {
      redo()
    })

    keyboardShortcutsRef.current.addShortcut('meta+y', () => {
      redo()
    })
  }, [])

  // Undo function
  const undo = useCallback(() => {
    if (!historyManagerRef.current) return

    const previousState = historyManagerRef.current.undo()
    if (previousState && stateManagerRef.current) {
      stateManagerRef.current.setState(previousState)
      onStateChange?.(previousState)
    }
  }, [onStateChange])

  // Redo function
  const redo = useCallback(() => {
    if (!historyManagerRef.current) return

    const nextState = historyManagerRef.current.redo()
    if (nextState && stateManagerRef.current) {
      stateManagerRef.current.setState(nextState)
      onStateChange?.(nextState)
    }
  }, [onStateChange])

  // Add state to history
  const addState = useCallback((
    operation: ComponentOperation,
    components: ComponentNode[]
  ) => {
    if (!historyManagerRef.current || !stateManagerRef.current) return

    const currentState = stateManagerRef.current.getState()
    
    // Clear debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Debounce state addition
    debounceTimeoutRef.current = setTimeout(() => {
      historyManagerRef.current?.push(currentState)
    }, debounceMs)
  }, [debounceMs])

  // Clear history
  const clearHistory = useCallback(() => {
    historyManagerRef.current?.clear()
  }, [])

  // Update state using Immer
  const updateState = useCallback((updater: (draft: PageSchema) => void) => {
    if (!stateManagerRef.current) return

    const beforeState = stateManagerRef.current.getState()
    const afterState = stateManagerRef.current.updateState((state) => {
      updater(state)
      return state
    })
    
    // Create patch
    const patch = PatchManager.createPatch(beforeState, afterState)
    onPatchCreated?.(patch)
    
    onStateChange?.(afterState)
  }, [onStateChange, onPatchCreated])

  // Set state directly
  const setState = useCallback((newState: PageSchema) => {
    if (!stateManagerRef.current) return

    const beforeState = stateManagerRef.current.getState()
    stateManagerRef.current.setState(newState)
    
    // Create patch
    const patch = PatchManager.createPatch(beforeState, newState)
    onPatchCreated?.(patch)
    
    onStateChange?.(newState)
  }, [onStateChange, onPatchCreated])

  // Create patch utility
  const createPatch = useCallback((before: any, after: any) => {
    return PatchManager.createPatch(before, after)
  }, [])

  // Apply patch utility
  const applyPatch = useCallback((patch: PatchOperation[]) => {
    if (!stateManagerRef.current) return

    const beforeState = stateManagerRef.current.getState()
    const afterState = PatchManager.applyPatch(beforeState, patch)
    stateManagerRef.current.setState(afterState)
    
    onStateChange?.(afterState)
  }, [onStateChange])

  // Get current state
  const currentState = stateManagerRef.current?.getState() || initialState

  // Get history info
  const historyInfo = {
    canUndo: historyManagerRef.current?.canUndo() || false,
    canRedo: historyManagerRef.current?.canRedo() || false,
    currentState: historyManagerRef.current?.getCurrentState() || null
  }

  return {
    currentState,
    canUndo: historyInfo.canUndo,
    canRedo: historyInfo.canRedo,
    historyInfo: {
      states: 0,
      currentIndex: -1,
      maxStates
    },
    undo,
    redo,
    addState,
    clearHistory,
    updateState,
    setState,
    createPatch,
    applyPatch
  }
}

// Hook for autosave functionality
export interface UseAutosaveOptions {
  intervalMs?: number
  onSave?: (state: PageSchema) => Promise<void>
  onError?: (error: Error) => void
  enabled?: boolean
}

export function useAutosave(
  state: PageSchema,
  options: UseAutosaveOptions = {}
) {
  const {
    intervalMs = 5000,
    onSave,
    onError,
    enabled = true
  } = options

  const lastSavedStateRef = useRef<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Check if state has changed
  const hasStateChanged = useCallback(() => {
    const currentStateString = JSON.stringify(state)
    return currentStateString !== lastSavedStateRef.current
  }, [state])

  // Save function
  const save = useCallback(async () => {
    if (!hasStateChanged() || !onSave) return

    try {
      await onSave(state)
      lastSavedStateRef.current = JSON.stringify(state)
    } catch (error) {
      onError?.(error as Error)
    }
  }, [state, hasStateChanged, onSave, onError])

  // Setup autosave interval
  useEffect(() => {
    if (!enabled || !onSave) return

    intervalRef.current = setInterval(save, intervalMs)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, intervalMs, save, onSave])

  // Save on unmount
  useEffect(() => {
    return () => {
      if (hasStateChanged() && onSave) {
        onSave(state).catch(onError)
      }
    }
  }, [state, hasStateChanged, onSave, onError])

  return {
    save,
    hasUnsavedChanges: hasStateChanged()
  }
}

// Hook for version history
export interface UseVersionHistoryOptions {
  onVersionCreate?: (version: any) => Promise<void>
  onVersionRestore?: (version: any) => Promise<void>
  onError?: (error: Error) => void
}

export function useVersionHistory(
  pageId: string,
  options: UseVersionHistoryOptions = {}
) {
  const {
    onVersionCreate,
    onVersionRestore,
    onError
  } = options

  const [versions, setVersions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load versions
  const loadVersions = useCallback(async () => {
    if (!pageId) return

    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/v1/versions/pages/${pageId}`)
      const data = await response.json()
      
      if (data.success) {
        setVersions(data.data)
      }
    } catch (error) {
      onError?.(error as Error)
    } finally {
      setIsLoading(false)
    }
  }, [pageId, onError])

  // Create version
  const createVersion = useCallback(async (
    content: string,
    changes: string
  ) => {
    if (!pageId) return

    try {
      const response = await fetch(`${API_BASE_URL}/v1/versions/pages/${pageId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content, changes })
      })

      const data = await response.json()
      
      if (data.success) {
        await loadVersions()
        onVersionCreate?.(data.data)
      }
    } catch (error) {
      onError?.(error as Error)
    }
  }, [pageId, loadVersions, onVersionCreate, onError])

  // Restore version
  const restoreVersion = useCallback(async (versionNumber: number) => {
    if (!pageId) return

    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/versions/pages/${pageId}/restore/${versionNumber}`,
        {
          method: 'POST'
        }
      )

      const data = await response.json()
      
      if (data.success) {
        onVersionRestore?.(data.data)
      }
    } catch (error) {
      onError?.(error as Error)
    }
  }, [pageId, onVersionRestore, onError])

  // Load versions on mount
  useEffect(() => {
    loadVersions()
  }, [loadVersions])

  return {
    versions,
    isLoading,
    loadVersions,
    createVersion,
    restoreVersion
  }
}
