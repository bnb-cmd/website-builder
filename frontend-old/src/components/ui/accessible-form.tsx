import React, { useState, useEffect, useRef } from 'react'
import { useAccessibility } from '@/hooks/use-accessibility'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle, Info } from 'lucide-react'

interface FormField {
  id: string
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'radio'
  required?: boolean
  placeholder?: string
  description?: string
  options?: Array<{ value: string; label: string }>
  validation?: {
    pattern?: RegExp
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    custom?: (value: any) => string | null
  }
}

interface AccessibleFormProps {
  fields: FormField[]
  onSubmit: (data: Record<string, any>) => void
  onChange?: (data: Record<string, any>, errors: Record<string, string>) => void
  submitLabel?: string
  loading?: boolean
  className?: string
}

interface FieldState {
  value: any
  error: string | null
  touched: boolean
}

export function AccessibleForm({
  fields,
  onSubmit,
  onChange,
  submitLabel = 'Submit',
  loading = false,
  className
}: AccessibleFormProps) {
  const { settings, announcements, getAriaAttributes } = useAccessibility()
  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>(() => {
    const initial: Record<string, FieldState> = {}
    fields.forEach(field => {
      initial[field.id] = {
        value: field.type === 'checkbox' ? false : '',
        error: null,
        touched: false
      }
    })
    return initial
  })

  const formRef = useRef<HTMLFormElement>(null)

  // Validate field
  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || value === '')) {
      return `${field.label} is required`
    }

    if (!value || value === '') return null

    if (field.validation) {
      const { validation } = field

      if (validation.pattern && !validation.pattern.test(value)) {
        return `Please enter a valid ${field.label.toLowerCase()}`
      }

      if (validation.minLength && value.length < validation.minLength) {
        return `${field.label} must be at least ${validation.minLength} characters`
      }

      if (validation.maxLength && value.length > validation.maxLength) {
        return `${field.label} must be no more than ${validation.maxLength} characters`
      }

      if (validation.min !== undefined && Number(value) < validation.min) {
        return `${field.label} must be at least ${validation.min}`
      }

      if (validation.max !== undefined && Number(value) > validation.max) {
        return `${field.label} must be no more than ${validation.max}`
      }

      if (validation.custom) {
        const customError = validation.custom(value)
        if (customError) return customError
      }
    }

    return null
  }

  // Handle field change
  const handleFieldChange = (fieldId: string, value: any) => {
    const field = fields.find(f => f.id === fieldId)
    if (!field) return

    const error = validateField(field, value)

    setFieldStates(prev => ({
      ...prev,
      [fieldId]: {
        ...prev[fieldId],
        value,
        error,
        touched: true
      }
    }))

    // Announce validation errors for screen readers
    if (error && settings.screenReader) {
      announcements.announce(error, 'assertive')
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const errors: Record<string, string> = {}
    let hasErrors = false

    fields.forEach(field => {
      const state = fieldStates[field.id]
      const error = validateField(field, state.value)
      if (error) {
        errors[field.id] = error
        hasErrors = true
      }
    })

    if (hasErrors) {
      // Update field states with errors
      setFieldStates(prev => {
        const updated = { ...prev }
        Object.keys(errors).forEach(fieldId => {
          updated[fieldId] = {
            ...updated[fieldId],
            error: errors[fieldId],
            touched: true
          }
        })
        return updated
      })

      // Focus first error field
      const firstErrorField = Object.keys(errors)[0]
      const errorElement = formRef.current?.querySelector(`[name="${firstErrorField}"]`) as HTMLElement
      if (errorElement) {
        errorElement.focus()
      }

      announcements.announce('Form has errors. Please correct them and try again.', 'assertive')
      return
    }

    // Collect form data
    const formData: Record<string, any> = {}
    Object.keys(fieldStates).forEach(fieldId => {
      formData[fieldId] = fieldStates[fieldId].value
    })

    onSubmit(formData)
  }

  // Update parent component
  useEffect(() => {
    const formData: Record<string, any> = {}
    const errors: Record<string, string> = {}

    Object.keys(fieldStates).forEach(fieldId => {
      formData[fieldId] = fieldStates[fieldId].value
      if (fieldStates[fieldId].error) {
        errors[fieldId] = fieldStates[fieldId].error!
      }
    })

    onChange?.(formData, errors)
  }, [fieldStates, onChange])

  const renderField = (field: FormField) => {
    const state = fieldStates[field.id]
    const hasError = !!state.error
    const fieldId = `field-${field.id}`
    const errorId = `${fieldId}-error`
    const descriptionId = `${fieldId}-description`

    const ariaAttributes = getAriaAttributes({
      required: field.required,
      invalid: hasError,
      describedBy: field.description ? descriptionId : (hasError ? errorId : undefined)
    })

    const commonProps = {
      id: fieldId,
      name: field.name,
      'aria-required': field.required,
      'aria-invalid': hasError,
      'aria-describedby': ariaAttributes['aria-describedby'],
      className: cn(
        'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        settings.highContrast && 'border-2',
        settings.largeText && 'text-lg',
        hasError && 'border-red-500 focus-visible:ring-red-500'
      )
    }

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label
              htmlFor={fieldId}
              className={cn(
                settings.largeText && 'text-lg',
                settings.highContrast && 'text-current'
              )}
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
            </Label>

            <Textarea
              {...commonProps}
              placeholder={field.placeholder}
              value={state.value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              rows={4}
            />

            {field.description && (
              <p
                id={descriptionId}
                className={cn(
                  'text-sm text-muted-foreground',
                  settings.largeText && 'text-base'
                )}
              >
                {field.description}
              </p>
            )}

            {hasError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription id={errorId}>
                  {state.error}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label
              htmlFor={fieldId}
              className={cn(
                settings.largeText && 'text-lg',
                settings.highContrast && 'text-current'
              )}
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
            </Label>

            <Select
              value={state.value}
              onValueChange={(value) => handleFieldChange(field.id, value)}
            >
              <SelectTrigger {...commonProps}>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {field.description && (
              <p
                id={descriptionId}
                className={cn(
                  'text-sm text-muted-foreground',
                  settings.largeText && 'text-base'
                )}
              >
                {field.description}
              </p>
            )}

            {hasError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription id={errorId}>
                  {state.error}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )

      case 'checkbox':
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <Checkbox
              id={fieldId}
              checked={state.value}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
              {...ariaAttributes}
              className={cn(
                'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                settings.highContrast && 'border-2'
              )}
            />
            <Label
              htmlFor={fieldId}
              className={cn(
                'cursor-pointer',
                settings.largeText && 'text-lg',
                settings.highContrast && 'text-current'
              )}
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
            </Label>

            {field.description && (
              <p
                id={descriptionId}
                className={cn(
                  'text-sm text-muted-foreground',
                  settings.largeText && 'text-base'
                )}
              >
                {field.description}
              </p>
            )}

            {hasError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription id={errorId}>
                  {state.error}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )

      case 'radio':
        return (
          <div key={field.id} className="space-y-2">
            <Label
              className={cn(
                settings.largeText && 'text-lg',
                settings.highContrast && 'text-current'
              )}
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
            </Label>

            <RadioGroup
              value={state.value}
              onValueChange={(value) => handleFieldChange(field.id, value)}
              {...ariaAttributes}
            >
              {field.options?.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`${fieldId}-${option.value}`}
                    className={cn(
                      'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                      settings.highContrast && 'border-2'
                    )}
                  />
                  <Label
                    htmlFor={`${fieldId}-${option.value}`}
                    className={cn(
                      'cursor-pointer',
                      settings.largeText && 'text-lg'
                    )}
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {field.description && (
              <p
                id={descriptionId}
                className={cn(
                  'text-sm text-muted-foreground',
                  settings.largeText && 'text-base'
                )}
              >
                {field.description}
              </p>
            )}

            {hasError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription id={errorId}>
                  {state.error}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )

      default:
        return (
          <div key={field.id} className="space-y-2">
            <Label
              htmlFor={fieldId}
              className={cn(
                settings.largeText && 'text-lg',
                settings.highContrast && 'text-current'
              )}
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
            </Label>

            <Input
              {...commonProps}
              type={field.type}
              placeholder={field.placeholder}
              value={state.value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            />

            {field.description && (
              <p
                id={descriptionId}
                className={cn(
                  'text-sm text-muted-foreground',
                  settings.largeText && 'text-base'
                )}
              >
                {field.description}
              </p>
            )}

            {hasError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription id={errorId}>
                  {state.error}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={cn('space-y-6', className)}
      noValidate
    >
      {fields.map(renderField)}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={cn(
            'px-4 py-2 bg-primary text-primary-foreground rounded-md',
            'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            settings.highContrast && 'border-2 border-current',
            settings.largeText && 'text-lg px-6 py-3'
          )}
          {...getAriaAttributes({
            busy: loading
          })}
        >
          {loading ? 'Submitting...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
