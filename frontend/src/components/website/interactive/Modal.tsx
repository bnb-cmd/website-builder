'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ModalProps {
  trigger: React.ReactNode
  title: string
  content: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  centered?: boolean
  scrollable?: boolean
}

export const Modal: React.FC<ModalProps> = ({
  trigger,
  title = 'Modal Title',
  content = <div className="p-4">Modal content goes here</div>,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  centered = true,
  scrollable = true
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
  }

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscape])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <>
      {/* Trigger */}
      <div onClick={handleOpen} className="cursor-pointer">
        {trigger}
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          {/* Modal Content */}
          <div
            className={cn(
              'relative bg-white rounded-lg shadow-xl w-full',
              sizeClasses[size],
              centered && 'mx-auto',
              scrollable && 'max-h-[90vh] overflow-hidden flex flex-col'
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
                {title}
              </h2>
              {showCloseButton && (
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className={cn(
              'flex-1',
              scrollable ? 'overflow-y-auto' : 'overflow-hidden'
            )}>
              {content}
            </div>

            {/* Footer */}
            {footer && (
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                {footer}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

// Component configuration for editor
export const ModalConfig = {
  id: 'modal',
  name: 'Modal',
  description: 'Popup dialog with customizable content and behavior',
  category: 'interactive' as const,
  icon: 'maximize',
  defaultProps: {
    trigger: '<button class="px-4 py-2 bg-blue-500 text-white rounded">Open Modal</button>',
    title: 'Modal Title',
    content: '<div class="p-4">Modal content goes here</div>',
    footer: '<div class="flex gap-2"><button class="px-4 py-2 bg-gray-200 rounded">Cancel</button><button class="px-4 py-2 bg-blue-500 text-white rounded">Save</button></div>',
    size: 'md',
    closeOnBackdrop: true,
    closeOnEscape: true,
    showCloseButton: true,
    centered: true,
    scrollable: true
  },
  defaultSize: { width: 100, height: 200 },
  editableFields: [
    'trigger',
    'title',
    'content',
    'footer',
    'size',
    'closeOnBackdrop',
    'closeOnEscape',
    'showCloseButton',
    'centered',
    'scrollable'
  ]
}
