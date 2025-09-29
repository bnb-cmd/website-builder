'use client'

import React from 'react'
import { I18nProvider as BaseI18nProvider } from '@/hooks/use-internationalization'
import type { SupportedLanguage } from '@/hooks/use-internationalization'

interface I18nProviderProps {
  children: React.ReactNode
  defaultLanguage?: SupportedLanguage
}

export function I18nProvider({ children, defaultLanguage = 'en' }: I18nProviderProps) {
  return (
    <BaseI18nProvider defaultLanguage={defaultLanguage}>
      {children}
    </BaseI18nProvider>
  )
}
