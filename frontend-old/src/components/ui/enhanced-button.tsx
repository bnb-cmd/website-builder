'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { LucideIcon, Loader2, Check, X } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface EnhancedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  loading?: boolean
  success?: boolean
  error?: boolean
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  fullWidth?: boolean
}

export function EnhancedButton({
  children,
  loading = false,
  success = false,
  error = false,
  icon: Icon,
  iconPosition = 'left',
  variant = 'default',
  size = 'default',
  fullWidth = false,
  className,
  disabled,
  ...props
}: EnhancedButtonProps) {
  const isDisabled = disabled || loading || success

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isDisabled}
      className={cn(
        'relative transition-all duration-200',
        fullWidth && 'w-full',
        loading && 'cursor-wait',
        success && 'bg-green-600 hover:bg-green-600 border-green-600',
        error && 'bg-red-600 hover:bg-red-600 border-red-600',
        className
      )}
      {...props}
    >
      {/* Loading State */}
      {loading && (
        <Loader2 className={cn(
          'h-4 w-4 animate-spin',
          iconPosition === 'left' ? 'mr-2' : 'ml-2'
        )} />
      )}

      {/* Success State */}
      {success && !loading && (
        <Check className={cn(
          'h-4 w-4',
          iconPosition === 'left' ? 'mr-2' : 'ml-2'
        )} />
      )}

      {/* Error State */}
      {error && !loading && !success && (
        <X className={cn(
          'h-4 w-4',
          iconPosition === 'left' ? 'mr-2' : 'ml-2'
        )} />
      )}

      {/* Normal Icon */}
      {!loading && !success && !error && Icon && iconPosition === 'left' && (
        <Icon className="h-4 w-4 mr-2" />
      )}

      {/* Button Text */}
      <span className={cn(
        'transition-opacity duration-200',
        (loading || success || error) && 'opacity-90'
      )}>
        {success ? 'Success!' : error ? 'Error' : children}
      </span>

      {/* Normal Icon (Right) */}
      {!loading && !success && !error && Icon && iconPosition === 'right' && (
        <Icon className="h-4 w-4 ml-2" />
      )}

      {/* Ripple Effect */}
      <span className="absolute inset-0 overflow-hidden rounded-md">
        <span className="absolute inset-0 bg-white/20 transform scale-0 group-active:scale-100 transition-transform duration-300 rounded-full" />
      </span>
    </Button>
  )
}
