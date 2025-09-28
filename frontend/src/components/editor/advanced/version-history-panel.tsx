'use client'

import { useState } from 'react'
import { WebsiteData, Element } from '@/types/editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useWebsiteStore } from '@/store/website-store'
import { 
  History,
  Save,
  Undo,
  Eye,
  Plus,
  Tag,
  Clock,
  GitCommit
} from 'lucide-react'

interface VersionHistoryPanelProps {
  onClose?: () => void
}

interface Version {
  id: string
  name: string
  timestamp: Date
  snapshot: Element[]
}

export function VersionHistoryPanel({ onClose }: VersionHistoryPanelProps) {
  const { elements, history, setElements } = useWebsiteStore()
  const [versions, setVersions] = useState<Version[]>([])
  const [versionName, setVersionName] = useState('')

  const saveVersion = () => {
    if (!versionName.trim()) {
      // Add toast notification here in a real app
      return
    }
    const newVersion: Version = {
      id: `v_${Date.now()}`,
      name: versionName,
      timestamp: new Date(),
      snapshot: JSON.parse(JSON.stringify(elements)) // Deep copy
    }
    setVersions([newVersion, ...versions])
    setVersionName('')
  }

  const restoreVersion = (version: Version) => {
    // This is a destructive action, so a confirmation modal would be good in a real app
    setElements(JSON.parse(JSON.stringify(version.snapshot)))
  }

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center gap-2">
            <History className="h-5 w-5" />
            Version History
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            ×
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Save, view, and restore previous versions of your site.
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Save New Version */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Save Current Version
            </h4>
            <div className="space-y-2">
              <Label htmlFor="version-name">Version Name</Label>
              <Input
                id="version-name"
                placeholder="e.g., 'Before hero section redesign'"
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
              />
              <Button className="w-full" onClick={saveVersion}>
                <Save className="h-4 w-4 mr-2" />
                Save Version
              </Button>
            </div>
          </div>

          {/* Saved Versions */}
          <div>
            <h4 className="font-medium mb-3">Saved Versions</h4>
            <div className="space-y-3">
              {versions.length > 0 ? (
                versions.map((version) => (
                  <div key={version.id} className="p-3 border rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          {version.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(version.timestamp)}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => restoreVersion(version)}>
                          <Undo className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground py-8">
                  No saved versions yet.
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Changes (from undo/redo stack) */}
          <div>
            <h4 className="font-medium mb-3">Recent Auto-saves</h4>
            <div className="space-y-2">
              {history.past.slice(-5).reverse().map((_, index) => {
                const step = history.past.length - index
                return (
                  <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                    <p className="text-sm flex items-center gap-2">
                      <GitCommit className="h-4 w-4 text-muted-foreground" />
                      Change #{step}
                    </p>
                    <Button size="sm" variant="ghost" onClick={() => {
                      // This would need a more complex undo system to jump to a state
                    }}>
                      Revert
                    </Button>
                  </div>
                )
              })}
              {history.past.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-4">
                  No recent changes recorded.
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
