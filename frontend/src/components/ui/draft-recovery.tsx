import React, { useState } from 'react'
import { DraftVersion } from '@/hooks/use-auto-save'
import { cn } from '@/lib/utils'
import {
  History,
  RotateCcw,
  Trash2,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

interface DraftRecoveryProps {
  draftVersions: DraftVersion[]
  onRecoverDraft: (draftId: string) => void
  onDeleteDraft: (draftId: string) => void
  onClearAllDrafts: () => void
  className?: string
}

export function DraftRecovery({
  draftVersions,
  onRecoverDraft,
  onDeleteDraft,
  onClearAllDrafts,
  className
}: DraftRecoveryProps) {
  const [selectedDraft, setSelectedDraft] = useState<DraftVersion | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - timestamp.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return timestamp.toLocaleDateString()
  }

  const handleRecoverDraft = (draft: DraftVersion) => {
    setSelectedDraft(draft)
    setIsDialogOpen(true)
  }

  const confirmRecovery = () => {
    if (selectedDraft) {
      onRecoverDraft(selectedDraft.id)
      setIsDialogOpen(false)
      setSelectedDraft(null)
    }
  }

  const getDraftTypeColor = (isAutoSave: boolean) => {
    return isAutoSave ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
  }

  const getDraftTypeIcon = (isAutoSave: boolean) => {
    return isAutoSave ? <RotateCcw className="h-3 w-3" /> : <FileText className="h-3 w-3" />
  }

  if (draftVersions.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No Drafts Available</h3>
        <p className="text-muted-foreground">
          Your changes are automatically saved. Draft versions will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <History className="h-5 w-5" />
          <h3 className="text-lg font-medium">Draft Recovery</h3>
          <Badge variant="secondary">{draftVersions.length}</Badge>
        </div>
        {draftVersions.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAllDrafts}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Drafts are stored locally in your browser. Clear your browser data may remove them.
        </AlertDescription>
      </Alert>

      <ScrollArea className="h-96">
        <div className="space-y-3">
          {draftVersions.map((draft, index) => (
            <Card key={draft.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className={cn("text-xs", getDraftTypeColor(draft.isAutoSave))}
                    >
                      {getDraftTypeIcon(draft.isAutoSave)}
                      <span className="ml-1">
                        {draft.isAutoSave ? 'Auto-save' : 'Manual save'}
                      </span>
                    </Badge>
                    {index === 0 && (
                      <Badge variant="default" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Latest
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimestamp(draft.timestamp)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRecoverDraft(draft)}
                      className="h-8 w-8 p-0"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteDraft(draft.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm text-muted-foreground">
                  {draft.description || 'No description'}
                </div>
                <Separator className="my-3" />
                <div className="text-xs text-muted-foreground">
                  Version ID: {draft.id.slice(-8)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recover Draft Version</DialogTitle>
            <DialogDescription>
              Are you sure you want to recover this draft version? This will replace your current unsaved changes.
            </DialogDescription>
          </DialogHeader>

          {selectedDraft && (
            <div className="py-4">
              <div className="flex items-center space-x-2 mb-2">
                <Badge
                  variant="secondary"
                  className={getDraftTypeColor(selectedDraft.isAutoSave)}
                >
                  {getDraftTypeIcon(selectedDraft.isAutoSave)}
                  <span className="ml-1">
                    {selectedDraft.isAutoSave ? 'Auto-save' : 'Manual save'}
                  </span>
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatTimestamp(selectedDraft.timestamp)}
                </span>
              </div>
              <div className="text-sm">
                {selectedDraft.description || 'No description available'}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRecovery}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Recover Draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
