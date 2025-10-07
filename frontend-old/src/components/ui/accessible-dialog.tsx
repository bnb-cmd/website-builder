import React, { useEffect, useRef } from 'react'
import { useAccessibility } from '@/hooks/use-accessibility'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogProps
} from '@/components/ui/dialog'
import { X } from 'lucide-react'

interface AccessibleDialogProps extends DialogProps {
  title: string
  description?: string
  children: React.ReactNode
  trigger?: React.ReactNode
  onOpenChange?: (open: boolean) => void
}

export function AccessibleDialog({
  title,
  description,
  children,
  trigger,
  onOpenChange,
  ...props
}: AccessibleDialogProps) {
  const { settings, focusManagement, announcements, getAriaAttributes } = useAccessibility()
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (props.open && dialogRef.current) {
      // Trap focus when dialog opens
      const cleanup = focusManagement.trapFocus(dialogRef.current)

      // Announce dialog opening
      announcements.announce(`Dialog opened: ${title}`, 'assertive')

      return cleanup
    }
  }, [props.open, title, focusManagement, announcements])

  const handleOpenChange = (open: boolean) => {
    if (open) {
      announcements.announce(`Opening dialog: ${title}`)
    } else {
      announcements.announce(`Closing dialog: ${title}`)
      focusManagement.restoreFocus()
    }
    onOpenChange?.(open)
  }

  const ariaAttributes = getAriaAttributes({
    label: title,
    describedBy: description ? 'dialog-description' : undefined
  })

  return (
    <Dialog {...props} onOpenChange={handleOpenChange}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}

      <DialogContent
        ref={dialogRef}
        className={cn(
          // Enhanced focus and accessibility styles
          'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          settings.highContrast && 'border-2 border-current bg-background'
        )}
        {...ariaAttributes}
      >
        <DialogHeader>
          <DialogTitle
            className={cn(
              settings.largeText && 'text-xl',
              settings.highContrast && 'text-current'
            )}
          >
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription
              id="dialog-description"
              className={cn(
                settings.largeText && 'text-base',
                settings.highContrast && 'text-current'
              )}
            >
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div
          className={cn(
            settings.largeText && 'text-lg',
            settings.highContrast && 'text-current'
          )}
        >
          {children}
        </div>

        {/* Accessible close button */}
        <DialogClose
          className={cn(
            'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
            settings.highContrast && 'border border-current'
          )}
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
