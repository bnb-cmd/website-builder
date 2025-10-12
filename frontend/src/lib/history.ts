import { applyPatch, createPatch, Operation } from 'fast-json-patch'
import { produce } from 'immer'
import { ComponentNode, PageSchema, HistoryState, ComponentOperation } from './schema'

export interface PatchOperation {
  op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test'
  path: string
  value?: any
  from?: string
}

export interface HistoryManager {
  states: HistoryState[]
  currentIndex: number
  maxStates: number
  canUndo: boolean
  canRedo: boolean
}

export class EditorHistoryManager {
  private states: HistoryState[] = []
  private currentIndex: number = -1
  private maxStates: number = 50
  private isUndoRedo: boolean = false

  constructor(maxStates: number = 50) {
    this.maxStates = maxStates
  }

  // Add a new state to history
  addState(operation: ComponentOperation, components: ComponentNode[], pageSchema: PageSchema): void {
    if (this.isUndoRedo) {
      this.isUndoRedo = false
      return
    }

    // Remove any states after current index (when branching)
    this.states = this.states.slice(0, this.currentIndex + 1)

    const newState: HistoryState = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      operation,
      components: JSON.parse(JSON.stringify(components)), // Deep clone
      pageSchema: JSON.parse(JSON.stringify(pageSchema)) // Deep clone
    }

    this.states.push(newState)
    this.currentIndex = this.states.length - 1

    // Limit history size
    if (this.states.length > this.maxStates) {
      this.states.shift()
      this.currentIndex--
    }
  }

  // Undo last operation
  undo(): HistoryState | null {
    if (!this.canUndo()) {
      return null
    }

    this.isUndoRedo = true
    this.currentIndex--
    return this.states[this.currentIndex]
  }

  // Redo next operation
  redo(): HistoryState | null {
    if (!this.canRedo()) {
      return null
    }

    this.isUndoRedo = true
    this.currentIndex++
    return this.states[this.currentIndex]
  }

  // Check if undo is possible
  canUndo(): boolean {
    return this.currentIndex > 0
  }

  // Check if redo is possible
  canRedo(): boolean {
    return this.currentIndex < this.states.length - 1
  }

  // Get current state
  getCurrentState(): HistoryState | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.states.length) {
      return this.states[this.currentIndex]
    }
    return null
  }

  // Get all states
  getAllStates(): HistoryState[] {
    return [...this.states]
  }

  // Clear history
  clear(): void {
    this.states = []
    this.currentIndex = -1
  }

  // Get history info
  getHistoryInfo(): HistoryManager {
    return {
      states: this.states,
      currentIndex: this.currentIndex,
      maxStates: this.maxStates,
      canUndo: this.canUndo(),
      canRedo: this.canRedo()
    }
  }
}

// JSON Patch utilities
export class PatchManager {
  // Create patch between two objects
  static createPatch(before: any, after: any): PatchOperation[] {
    return createPatch(before, after) as PatchOperation[]
  }

  // Apply patch to object
  static applyPatch(target: any, patch: PatchOperation[]): any {
    const result = applyPatch(target, patch)
    return result.newDocument
  }

  // Create component-specific patches
  static createComponentPatch(
    operation: ComponentOperation,
    beforeComponents: ComponentNode[],
    afterComponents: ComponentNode[]
  ): PatchOperation[] {
    const patches: PatchOperation[] = []

    switch (operation.type) {
      case 'add':
        patches.push({
          op: 'add',
          path: `/components/-`,
          value: afterComponents[afterComponents.length - 1]
        })
        break

      case 'remove':
        const removedIndex = beforeComponents.findIndex(c => c.id === operation.componentId)
        if (removedIndex !== -1) {
          patches.push({
            op: 'remove',
            path: `/components/${removedIndex}`
          })
        }
        break

      case 'update':
        const updatedIndex = afterComponents.findIndex(c => c.id === operation.componentId)
        if (updatedIndex !== -1) {
          patches.push({
            op: 'replace',
            path: `/components/${updatedIndex}`,
            value: afterComponents[updatedIndex]
          })
        }
        break

      case 'move':
        const fromIndex = beforeComponents.findIndex(c => c.id === operation.componentId)
        const toIndex = operation.targetIndex || 0
        if (fromIndex !== -1) {
          patches.push({
            op: 'move',
            from: `/components/${fromIndex}`,
            path: `/components/${toIndex}`
          })
        }
        break

      case 'duplicate':
        const duplicatedIndex = afterComponents.findIndex(c => c.id === operation.componentId)
        if (duplicatedIndex !== -1) {
          patches.push({
            op: 'add',
            path: `/components/${duplicatedIndex + 1}`,
            value: afterComponents[duplicatedIndex]
          })
        }
        break

      case 'group':
        // Handle grouping logic
        const groupedComponents = afterComponents.filter(c => c.groupId === operation.data.groupId)
        groupedComponents.forEach((component, index) => {
          patches.push({
            op: 'replace',
            path: `/components/${afterComponents.findIndex(c => c.id === component.id)}/groupId`,
            value: operation.data.groupId
          })
        })
        break

      case 'ungroup':
        // Handle ungrouping logic
        const ungroupedComponents = afterComponents.filter(c => c.groupId === operation.componentId)
        ungroupedComponents.forEach(component => {
          patches.push({
            op: 'remove',
            path: `/components/${afterComponents.findIndex(c => c.id === component.id)}/groupId`
          })
        })
        break
    }

    return patches
  }

  // Create page-level patches
  static createPagePatch(
    beforePage: PageSchema,
    afterPage: PageSchema
  ): PatchOperation[] {
    return createPatch(beforePage, afterPage) as PatchOperation[]
  }

  // Optimize patches (remove redundant operations)
  static optimizePatches(patches: PatchOperation[]): PatchOperation[] {
    const optimized: PatchOperation[] = []
    
    for (let i = 0; i < patches.length; i++) {
      const current = patches[i]
      const next = patches[i + 1]
      
      // Skip redundant operations
      if (next && 
          current.op === 'replace' && 
          next.op === 'replace' && 
          current.path === next.path) {
        i++ // Skip the next patch
        optimized.push(next) // Use the later value
      } else {
        optimized.push(current)
      }
    }
    
    return optimized
  }

  // Validate patch
  static validatePatch(patch: PatchOperation[]): boolean {
    try {
      // Basic validation
      for (const operation of patch) {
        if (!operation.op || !operation.path) {
          return false
        }
        
        if (['add', 'replace'].includes(operation.op) && operation.value === undefined) {
          return false
        }
        
        if (['move', 'copy'].includes(operation.op) && !operation.from) {
          return false
        }
      }
      
      return true
    } catch {
      return false
    }
  }
}

// Immer-based state management
export class ImmerStateManager {
  private state: PageSchema

  constructor(initialState: PageSchema) {
    this.state = initialState
  }

  // Update state using Immer
  updateState(updater: (draft: PageSchema) => void): PageSchema {
    this.state = produce(this.state, updater)
    return this.state
  }

  // Get current state
  getState(): PageSchema {
    return this.state
  }

  // Set state directly
  setState(newState: PageSchema): void {
    this.state = newState
  }

  // Create patch from state change
  createPatchFromChange(
    beforeState: PageSchema,
    afterState: PageSchema
  ): PatchOperation[] {
    return PatchManager.createPatch(beforeState, afterState)
  }

  // Apply patch to state
  applyPatchToState(patch: PatchOperation[]): PageSchema {
    this.state = PatchManager.applyPatch(this.state, patch)
    return this.state
  }
}

// Keyboard shortcuts manager
export class KeyboardShortcutsManager {
  private shortcuts: Map<string, () => void> = new Map()

  constructor() {
    this.setupDefaultShortcuts()
  }

  private setupDefaultShortcuts(): void {
    // Undo/Redo shortcuts
    this.addShortcut('ctrl+z', () => {
      // Will be connected to history manager
    })

    this.addShortcut('ctrl+shift+z', () => {
      // Will be connected to history manager
    })

    this.addShortcut('ctrl+y', () => {
      // Alternative redo shortcut
    })

    // Copy/Paste shortcuts
    this.addShortcut('ctrl+c', () => {
      // Copy selected component
    })

    this.addShortcut('ctrl+v', () => {
      // Paste component
    })

    this.addShortcut('ctrl+d', () => {
      // Duplicate component
    })

    // Delete shortcut
    this.addShortcut('delete', () => {
      // Delete selected component
    })

    this.addShortcut('backspace', () => {
      // Delete selected component
    })

    // Select all
    this.addShortcut('ctrl+a', () => {
      // Select all components
    })

    // Save shortcut
    this.addShortcut('ctrl+s', () => {
      // Save page
    })
  }

  addShortcut(key: string, handler: () => void): void {
    this.shortcuts.set(key, handler)
  }

  removeShortcut(key: string): void {
    this.shortcuts.delete(key)
  }

  handleKeyDown(event: KeyboardEvent): void {
    const key = this.getKeyString(event)
    const handler = this.shortcuts.get(key)
    
    if (handler) {
      event.preventDefault()
      handler()
    }
  }

  private getKeyString(event: KeyboardEvent): string {
    const parts: string[] = []
    
    if (event.ctrlKey) parts.push('ctrl')
    if (event.metaKey) parts.push('meta')
    if (event.altKey) parts.push('alt')
    if (event.shiftKey) parts.push('shift')
    
    parts.push(event.key.toLowerCase())
    
    return parts.join('+')
  }
}

// Export utilities
export const createHistoryManager = (maxStates: number = 50) => 
  new EditorHistoryManager(maxStates)

export const createStateManager = (initialState: PageSchema) => 
  new ImmerStateManager(initialState)

export const createKeyboardShortcuts = () => 
  new KeyboardShortcutsManager()
