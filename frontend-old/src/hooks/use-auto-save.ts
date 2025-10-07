import { useState, useEffect, useCallback, useRef } from 'react'
import { apiHelpers } from '@/lib/api'

export interface SaveState {
  status: 'idle' | 'saving' | 'saved' | 'error'
  lastSaved: Date | null
  error: string | null
  hasUnsavedChanges: boolean
  autoSaveEnabled: boolean
}

export interface DraftVersion {
  id: string
  timestamp: Date
  data: any
  description: string
  isAutoSave: boolean
}

export interface UseAutoSaveOptions {
  websiteId: string
  autoSaveInterval?: number // in milliseconds, default 30 seconds
  maxDraftVersions?: number // default 10
  onSaveSuccess?: (data: any) => void
  onSaveError?: (error: any) => void
  onDraftRecovered?: (draft: DraftVersion) => void
}

export function useAutoSave(options: UseAutoSaveOptions) {
  const {
    websiteId,
    autoSaveInterval = 30000, // 30 seconds
    maxDraftVersions = 10,
    onSaveSuccess,
    onSaveError,
    onDraftRecovered
  } = options

  const [saveState, setSaveState] = useState<SaveState>({
    status: 'idle',
    lastSaved: null,
    error: null,
    hasUnsavedChanges: false,
    autoSaveEnabled: true
  })

  const [draftVersions, setDraftVersions] = useState<DraftVersion[]>([])
  const [currentData, setCurrentData] = useState<any>(null)
  const [originalData, setOriginalData] = useState<any>(null)

  const saveTimeoutRef = useRef<NodeJS.Timeout>()
  const lastSavedDataRef = useRef<any>(null)

  // Check if data has changed
  const hasChanges = useCallback((data: any) => {
    return JSON.stringify(data) !== JSON.stringify(lastSavedDataRef.current)
  }, [])

  // Load draft versions from localStorage
  const loadDraftVersions = useCallback(() => {
    try {
      const drafts = localStorage.getItem(`website_drafts_${websiteId}`)
      if (drafts) {
        const parsedDrafts = JSON.parse(drafts).map((draft: any) => ({
          ...draft,
          timestamp: new Date(draft.timestamp)
        }))
        setDraftVersions(parsedDrafts)
        return parsedDrafts
      }
    } catch (error) {
      console.error('Failed to load draft versions:', error)
    }
    return []
  }, [websiteId])

  // Save draft versions to localStorage
  const saveDraftVersions = useCallback((drafts: DraftVersion[]) => {
    try {
      localStorage.setItem(`website_drafts_${websiteId}`, JSON.stringify(drafts))
    } catch (error) {
      console.error('Failed to save draft versions:', error)
    }
  }, [websiteId])

  // Create a new draft version
  const createDraft = useCallback((data: any, description: string, isAutoSave = false) => {
    const newDraft: DraftVersion = {
      id: `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      data: JSON.parse(JSON.stringify(data)), // Deep clone
      description,
      isAutoSave
    }

    setDraftVersions(prev => {
      const updated = [newDraft, ...prev].slice(0, maxDraftVersions)
      saveDraftVersions(updated)
      return updated
    })

    return newDraft
  }, [maxDraftVersions, saveDraftVersions])

  // Save website data
  const saveWebsite = useCallback(async (data: any, isAutoSave = false) => {
    if (!data || !websiteId) return

    setSaveState(prev => ({ ...prev, status: 'saving', error: null }))

    try {
      const response = await apiHelpers.updateWebsite(websiteId, {
        data,
        lastModified: new Date().toISOString()
      })

      const saveTime = new Date()
      lastSavedDataRef.current = JSON.parse(JSON.stringify(data))

      setSaveState(prev => ({
        ...prev,
        status: 'saved',
        lastSaved: saveTime,
        hasUnsavedChanges: false,
        error: null
      }))

      // Create a draft version
      createDraft(data, isAutoSave ? 'Auto-saved' : 'Manual save', isAutoSave)

      onSaveSuccess?.(response.data)

      // Reset to idle after showing "saved" status briefly
      setTimeout(() => {
        setSaveState(prev => ({ ...prev, status: 'idle' }))
      }, 2000)

    } catch (error: any) {
      console.error('Save failed:', error)
      setSaveState(prev => ({
        ...prev,
        status: 'error',
        error: error.message || 'Failed to save website',
        hasUnsavedChanges: true
      }))

      onSaveError?.(error)
    }
  }, [websiteId, createDraft, onSaveSuccess, onSaveError])

  // Manual save
  const manualSave = useCallback((data: any) => {
    return saveWebsite(data, false)
  }, [saveWebsite])

  // Auto-save logic
  const scheduleAutoSave = useCallback((data: any) => {
    if (!saveState.autoSaveEnabled || !hasChanges(data)) return

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Schedule auto-save
    saveTimeoutRef.current = setTimeout(() => {
      if (hasChanges(data)) {
        saveWebsite(data, true)
      }
    }, autoSaveInterval)
  }, [saveState.autoSaveEnabled, hasChanges, autoSaveInterval, saveWebsite])

  // Data changed handler
  const onDataChange = useCallback((newData: any) => {
    setCurrentData(newData)

    const changed = hasChanges(newData)
    setSaveState(prev => ({
      ...prev,
      hasUnsavedChanges: changed
    }))

    if (changed && saveState.autoSaveEnabled) {
      scheduleAutoSave(newData)
    }
  }, [hasChanges, saveState.autoSaveEnabled, scheduleAutoSave])

  // Recover draft
  const recoverDraft = useCallback((draftId: string) => {
    const draft = draftVersions.find(d => d.id === draftId)
    if (draft) {
      setCurrentData(draft.data)
      setSaveState(prev => ({
        ...prev,
        hasUnsavedChanges: true
      }))
      onDraftRecovered?.(draft)
      return draft.data
    }
    return null
  }, [draftVersions, onDraftRecovered])

  // Delete draft
  const deleteDraft = useCallback((draftId: string) => {
    setDraftVersions(prev => {
      const updated = prev.filter(d => d.id !== draftId)
      saveDraftVersions(updated)
      return updated
    })
  }, [saveDraftVersions])

  // Toggle auto-save
  const toggleAutoSave = useCallback((enabled: boolean) => {
    setSaveState(prev => ({ ...prev, autoSaveEnabled: enabled }))

    if (!enabled && saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
  }, [])

  // Initialize
  useEffect(() => {
    loadDraftVersions()

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [loadDraftVersions])

  // Set original data when website is loaded
  useEffect(() => {
    if (currentData && !originalData) {
      setOriginalData(JSON.parse(JSON.stringify(currentData)))
      lastSavedDataRef.current = JSON.parse(JSON.stringify(currentData))
    }
  }, [currentData, originalData])

  return {
    saveState,
    draftVersions,
    currentData,
    onDataChange,
    manualSave,
    recoverDraft,
    deleteDraft,
    toggleAutoSave,
    createDraft
  }
}
