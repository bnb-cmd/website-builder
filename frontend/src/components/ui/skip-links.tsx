'use client'

import React from 'react'
import { useAccessibility } from '@/hooks/use-accessibility'
import { useI18n } from '@/hooks/use-internationalization'
import { cn } from '@/lib/utils'

interface SkipLinksProps {
  links?: Array<{
    targetId: string
    labelKey: string
  }>
  className?: string
}

export function SkipLinks({
  links = [
    { targetId: 'main-content', labelKey: 'a11y.skip_to_main' },
    { targetId: 'navigation', labelKey: 'a11y.skip_to_nav' },
    { targetId: 'search', labelKey: 'a11y.skip_to_search' }
  ],
  className
}: SkipLinksProps) {
  const { settings } = useAccessibility()
  const { t } = useI18n()

  if (!settings.skipLinks) return null

  if (!settings.skipLinks) return null

  return (
    <div
      className={cn(
        'fixed top-0 left-0 z-50 flex flex-col space-y-2 p-4',
        className
      )}
      role="navigation"
      aria-label={t('a11y.skip_links')}
    >
      {links.map((link, index) => (
        <a
          key={link.targetId}
          href={`#${link.targetId}`}
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded z-50 font-medium"
          onClick={(e) => {
            e.preventDefault()
            const target = document.getElementById(link.targetId)
            if (target) {
              target.focus()
              target.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }}
        >
          {t(link.labelKey)}
        </a>
      ))}
    </div>
  )
}

// Hook for managing skip links dynamically
export function useSkipLinks() {
  const { settings } = useAccessibility()

  const addSkipLink = React.useCallback((targetId: string, label: string) => {
    if (!settings.skipLinks) return null

    return (
      <a
        href={`#${targetId}`}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded z-50 font-medium"
        onClick={(e) => {
          e.preventDefault()
          const target = document.getElementById(targetId)
          if (target) {
            target.focus()
            target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }}
      >
        {label}
      </a>
    )
  }, [settings.skipLinks])

  return { addSkipLink, skipLinksEnabled: settings.skipLinks }
}
