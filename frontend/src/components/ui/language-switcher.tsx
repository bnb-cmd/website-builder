'use client'

import React, { useState } from 'react'
import { useI18n } from '@/hooks/use-internationalization'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDown, Globe } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface LanguageSwitcherProps {
  variant?: 'button' | 'dropdown' | 'minimal'
  className?: string
  showFlag?: boolean
  showNativeName?: boolean
}

export function LanguageSwitcher({
  variant = 'dropdown',
  className,
  showFlag = true,
  showNativeName = true
}: LanguageSwitcherProps) {
  const { currentLanguage, setLanguage, supportedLanguages, isRTL } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  const currentLangInfo = supportedLanguages[currentLanguage]

  if (variant === 'minimal') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn("flex items-center space-x-1", className)}
          >
            {showFlag && <span className="text-sm">{currentLangInfo.flag}</span>}
            <span className="text-xs font-medium uppercase">{currentLangInfo.code}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {Object.values(supportedLanguages).map(lang => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={cn(
                "flex items-center space-x-3 cursor-pointer",
                currentLanguage === lang.code && "bg-accent"
              )}
            >
              {showFlag && <span className="text-sm">{lang.flag}</span>}
              <div className="flex flex-col">
                <span className="text-sm font-medium">{lang.name}</span>
                {showNativeName && (
                  <span className={cn(
                    "text-xs text-muted-foreground",
                    isRTL && "text-right"
                  )}>
                    {lang.nativeName}
                  </span>
                )}
              </div>
              {currentLanguage === lang.code && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  ✓
                </Badge>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  if (variant === 'button') {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        {Object.values(supportedLanguages).map(lang => (
          <Button
            key={lang.code}
            variant={currentLanguage === lang.code ? "default" : "outline"}
            size="sm"
            onClick={() => setLanguage(lang.code)}
            className="flex items-center space-x-2"
          >
            {showFlag && <span className="text-sm">{lang.flag}</span>}
            <span className="text-xs">{lang.code.toUpperCase()}</span>
          </Button>
        ))}
      </div>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex items-center space-x-2",
            isRTL && "flex-row-reverse",
            className
          )}
        >
          <Globe className="h-4 w-4" />
          {showFlag && <span className="text-sm">{currentLangInfo.flag}</span>}
          <span className="text-sm font-medium">
            {showNativeName ? currentLangInfo.nativeName : currentLangInfo.name}
          </span>
          <ChevronDown className={cn("h-4 w-4", isRTL && "rotate-180")} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={isRTL ? "start" : "end"}
        className="w-56"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {Object.values(supportedLanguages).map(lang => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn(
              "flex items-center space-x-3 cursor-pointer",
              currentLanguage === lang.code && "bg-accent",
              isRTL && "flex-row-reverse"
            )}
          >
            {showFlag && <span className="text-sm">{lang.flag}</span>}
            <div className={cn(
              "flex flex-col",
              isRTL && "text-right"
            )}>
              <span className="text-sm font-medium">{lang.name}</span>
              {showNativeName && (
                <span className={cn(
                  "text-xs text-muted-foreground",
                  lang.rtl && "text-right"
                )}>
                  {lang.nativeName}
                </span>
              )}
            </div>
            {currentLanguage === lang.code && (
              <Badge variant="secondary" className={cn(
                "ml-auto text-xs",
                isRTL && "ml-0 mr-auto"
              )}>
                ✓
              </Badge>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
