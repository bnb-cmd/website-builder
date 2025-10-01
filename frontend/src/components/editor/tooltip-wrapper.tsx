'use client'

import { ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface TooltipWrapperProps {
  content: string
  shortcut?: string
  children: ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function TooltipWrapper({ content, shortcut, children, side = 'bottom' }: TooltipWrapperProps) {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} className="flex items-center gap-2 bg-gray-900 text-white border-gray-800">
        <span className="text-xs">{content}</span>
        {shortcut && (
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-gray-800 rounded border border-gray-700">
            {shortcut}
          </kbd>
        )}
      </TooltipContent>
    </Tooltip>
  )
}
