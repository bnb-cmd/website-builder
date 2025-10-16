import { ComponentNode, PageSchema, ComponentOperation, PatchOperation } from './schema'

export class EditorHistoryManager {
  private states: PageSchema[] = []
  private currentIndex: number = -1
  private maxStates: number

  constructor(maxStates: number = 50) {
    this.maxStates = maxStates
  }

  push(state: PageSchema): void {
    // Remove any states after current index
    this.states = this.states.slice(0, this.currentIndex + 1)
    
    // Add new state
    this.states.push(JSON.parse(JSON.stringify(state)))
    this.currentIndex++
    
    // Limit history size
    if (this.states.length > this.maxStates) {
      this.states.shift()
      this.currentIndex--
    }
  }

  undo(): PageSchema | null {
    if (this.currentIndex > 0) {
      this.currentIndex--
      return JSON.parse(JSON.stringify(this.states[this.currentIndex]))
    }
    return null
  }

  redo(): PageSchema | null {
    if (this.currentIndex < this.states.length - 1) {
      this.currentIndex++
      return JSON.parse(JSON.stringify(this.states[this.currentIndex]))
    }
    return null
  }

  canUndo(): boolean {
    return this.currentIndex > 0
  }

  canRedo(): boolean {
    return this.currentIndex < this.states.length - 1
  }

  getCurrentState(): PageSchema | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.states.length) {
      return JSON.parse(JSON.stringify(this.states[this.currentIndex]))
    }
    return null
  }

  clear(): void {
    this.states = []
    this.currentIndex = -1
  }
}

export class PatchManager {
  static createPatch(before: PageSchema, after: PageSchema): PatchOperation[] {
    const patches: PatchOperation[] = []
    
    // Simple implementation - in a real app, you'd use a proper diff algorithm
    if (JSON.stringify(before) !== JSON.stringify(after)) {
      patches.push({
        type: 'replace',
        path: '/',
        value: after
      })
    }
    
    return patches
  }

  static applyPatch(state: PageSchema, patches: PatchOperation[]): PageSchema {
    let result = JSON.parse(JSON.stringify(state))
    
    for (const patch of patches) {
      switch (patch.type) {
        case 'replace':
          if (patch.path === '/') {
            result = patch.value as PageSchema
          }
          break
        case 'add':
          // Implement add operation
          break
        case 'remove':
          // Implement remove operation
          break
        case 'move':
          // Implement move operation
          break
      }
    }
    
    return result
  }
}

export class ImmerStateManager {
  private state: PageSchema

  constructor(initialState: PageSchema) {
    this.state = JSON.parse(JSON.stringify(initialState))
  }

  getState(): PageSchema {
    return JSON.parse(JSON.stringify(this.state))
  }

  setState(newState: PageSchema): void {
    this.state = JSON.parse(JSON.stringify(newState))
  }

  updateState(updater: (state: PageSchema) => PageSchema): PageSchema {
    const newState = updater(this.getState())
    this.setState(newState)
    return this.getState()
  }
}

export class KeyboardShortcutsManager {
  private shortcuts: Map<string, () => void> = new Map()

  constructor() {
    this.setupDefaultShortcuts()
  }

  private setupDefaultShortcuts(): void {
    // Default keyboard shortcuts
    this.addShortcut('ctrl+z', () => {
      // Undo action
    })
    
    this.addShortcut('ctrl+y', () => {
      // Redo action
    })
    
    this.addShortcut('ctrl+s', () => {
      // Save action
    })
  }

  addShortcut(key: string, callback: () => void): void {
    this.shortcuts.set(key, callback)
  }

  removeShortcut(key: string): void {
    this.shortcuts.delete(key)
  }

  handleKeyDown(event: KeyboardEvent): void {
    const key = this.getKeyString(event)
    const callback = this.shortcuts.get(key)
    
    if (callback) {
      event.preventDefault()
      callback()
    }
  }

  private getKeyString(event: KeyboardEvent): string {
    const modifiers = []
    if (event.ctrlKey) modifiers.push('ctrl')
    if (event.altKey) modifiers.push('alt')
    if (event.shiftKey) modifiers.push('shift')
    if (event.metaKey) modifiers.push('meta')
    
    return modifiers.length > 0 
      ? `${modifiers.join('+')}+${event.key.toLowerCase()}`
      : event.key.toLowerCase()
  }
}
