import React, { forwardRef } from 'react'
import { useAccessibility } from '@/hooks/use-accessibility'
import { cn } from '@/lib/utils'
import { Button, ButtonProps } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface AccessibleButtonProps extends Omit<ButtonProps, 'onKeyDown'> {
  loading?: boolean
  loadingText?: string
  tooltip?: string
  ariaLabel?: string
  ariaDescribedBy?: string
  keyboardShortcut?: string
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({
    children,
    loading = false,
    loadingText,
    tooltip,
    ariaLabel,
    ariaDescribedBy,
    keyboardShortcut,
    disabled,
    className,
    onClick,
    ...props
  }, ref) => {
    const { settings, getAriaAttributes, handleKeyboardNavigation } = useAccessibility()

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      handleKeyboardNavigation(event, {
        onEnter: () => !disabled && !loading && onClick?.(event as any),
        onSpace: () => !disabled && !loading && onClick?.(event as any)
      })
    }

    const ariaAttributes = getAriaAttributes({
      label: ariaLabel,
      describedBy: ariaDescribedBy,
      busy: loading,
      disabled: disabled || loading
    })

    return (
      <>
        <Button
          ref={ref}
          className={cn(
            // Enhanced focus styles for accessibility
            'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            // High contrast mode support
            settings.highContrast && 'border-2 border-current',
            // Reduced motion support
            !settings.reducedMotion && 'transition-all duration-200',
            className
          )}
          disabled={disabled || loading}
          onKeyDown={handleKeyDown}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          {...ariaAttributes}
          {...props}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              <span>{loadingText || 'Loading...'}</span>
            </>
          ) : (
            children
          )}
        </Button>

        {/* Keyboard shortcut hint for screen readers */}
        {keyboardShortcut && settings.screenReader && (
          <span className="sr-only">
            Keyboard shortcut: {keyboardShortcut}
          </span>
        )}

        {/* Tooltip for screen readers */}
        {tooltip && settings.screenReader && (
          <span className="sr-only">
            {tooltip}
          </span>
        )}
      </>
    )
  }
)

AccessibleButton.displayName = 'AccessibleButton'
