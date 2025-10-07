'use client'

import { InputHTMLAttributes, useState, forwardRef } from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FloatingInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string
  error?: string
  helperText?: string
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  size?: 'sm' | 'md' | 'lg'
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, error, helperText, icon: Icon, iconPosition = 'left', size = 'md', className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue)

    const sizeClasses = {
      sm: 'h-10 text-sm',
      md: 'h-12 text-base',
      lg: 'h-14 text-lg'
    }

    const labelSizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    }

    return (
      <div className="w-full">
        <div className="relative">
          {/* Icon */}
          {Icon && iconPosition === 'left' && (
            <Icon className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200',
              isFocused ? 'text-primary' : 'text-muted-foreground',
              error && 'text-red-500'
            )} />
          )}

          {/* Input */}
          <input
            ref={ref}
            className={cn(
              'peer w-full rounded-lg border bg-background transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary/20',
              sizeClasses[size],
              Icon && iconPosition === 'left' && 'pl-11',
              Icon && iconPosition === 'right' && 'pr-11',
              !Icon && 'px-4',
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-border focus:border-primary',
              'placeholder-transparent',
              className
            )}
            placeholder={label}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false)
              setHasValue(!!e.target.value)
            }}
            onChange={(e) => {
              setHasValue(!!e.target.value)
              props.onChange?.(e)
            }}
            {...props}
          />

          {/* Floating Label */}
          <label
            className={cn(
              'absolute left-3 transition-all duration-200 pointer-events-none',
              Icon && iconPosition === 'left' && 'left-11',
              labelSizeClasses[size],
              'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2',
              'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:bg-background peer-focus:px-2',
              (isFocused || hasValue) && 'top-0 -translate-y-1/2 bg-background px-2 text-xs',
              isFocused ? 'text-primary font-medium' : 'text-muted-foreground',
              error && 'text-red-500'
            )}
          >
            {label}
          </label>

          {/* Icon Right */}
          {Icon && iconPosition === 'right' && (
            <Icon className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200',
              isFocused ? 'text-primary' : 'text-muted-foreground',
              error && 'text-red-500'
            )} />
          )}
        </div>

        {/* Helper Text / Error */}
        {(helperText || error) && (
          <p className={cn(
            'mt-1.5 text-xs',
            error ? 'text-red-500' : 'text-muted-foreground'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

FloatingInput.displayName = 'FloatingInput'

// Floating Textarea
interface FloatingTextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  helperText?: string
  rows?: number
}

export const FloatingTextarea = forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  ({ label, error, helperText, rows = 4, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue)

    return (
      <div className="w-full">
        <div className="relative">
          <textarea
            ref={ref}
            rows={rows}
            className={cn(
              'peer w-full rounded-lg border bg-background px-4 py-3 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary/20',
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-border focus:border-primary',
              'placeholder-transparent resize-none',
              className
            )}
            placeholder={label}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false)
              setHasValue(!!e.target.value)
            }}
            onChange={(e) => {
              setHasValue(!!e.target.value)
              props.onChange?.(e as any)
            }}
            {...(props as any)}
          />

          <label
            className={cn(
              'absolute left-3 transition-all duration-200 pointer-events-none text-sm',
              'peer-placeholder-shown:top-3',
              'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:bg-background peer-focus:px-2',
              (isFocused || hasValue) && 'top-0 -translate-y-1/2 bg-background px-2 text-xs',
              isFocused ? 'text-primary font-medium' : 'text-muted-foreground',
              error && 'text-red-500'
            )}
          >
            {label}
          </label>
        </div>

        {(helperText || error) && (
          <p className={cn(
            'mt-1.5 text-xs',
            error ? 'text-red-500' : 'text-muted-foreground'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

FloatingTextarea.displayName = 'FloatingTextarea'
