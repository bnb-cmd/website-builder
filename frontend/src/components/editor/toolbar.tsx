'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ToolbarProps {
  children: ReactNode
  className?: string
}

export function Toolbar({ children, className }: ToolbarProps) {
  return (
    <div className={cn(
      "h-14 sm:h-16 bg-gradient-to-b from-background to-muted/20 border-b border-border/50",
      "flex items-center justify-between",
      "px-2 sm:px-4 gap-2",
      "overflow-x-auto scrollbar-hide",
      "shadow-sm backdrop-blur-sm",
      className
    )}>
      {children}
    </div>
  )
}
