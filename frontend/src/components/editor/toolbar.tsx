'use client'

import { ReactNode } from 'react'

interface ToolbarProps {
  children: ReactNode
}

export function Toolbar({ children }: ToolbarProps) {
  return (
    <div className="h-14 bg-background border-b border-border flex items-center justify-between px-4">
      {children}
    </div>
  )
}
