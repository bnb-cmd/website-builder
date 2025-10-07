import { useState, useCallback, useEffect } from 'react'
import { ValidationRule } from '@/components/ui/smart-form-field'

export interface FormField {
  name: string
  value: any
  isValid: boolean
  touched: boolean
  errors: string[]
  warnings: string[]
}

export interface SmartFormConfig {
  [key: string]: {
    initialValue?: any
    validationRules?: ValidationRule[]
    required?: boolean
    transform?: (value: any) => any
  }
}

export interface UseSmartFormOptions {
  config: SmartFormConfig
  onSubmit?: (values: Record<string, any>, isValid: boolean) => void
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

export function useSmartForm({ config, onSubmit, validateOnChange = true, validateOnBlur = true }: UseSmartFormOptions) {
  const [fields, setFields] = useState<Record<string, FormField>>(() => {
    const initialFields: Record<string, FormField> = {}

    Object.keys(config).forEach(fieldName => {
      const fieldConfig = config[fieldName]
      initialFields[fieldName] = {
        name: fieldName,
        value: fieldConfig.initialValue || '',
        isValid: true,
        touched: false,
        errors: [],
        warnings: []
      }
    })

    return initialFields
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitCount, setSubmitCount] = useState(0)

  // Validate a single field
  const validateField = useCallback((fieldName: string, value: any): FormField => {
    const fieldConfig = config[fieldName]
    if (!fieldConfig) return fields[fieldName]

    const rules = fieldConfig.validationRules || []
    const errors: string[] = []
    const warnings: string[] = []

    // Check required validation
    if (fieldConfig.required && (!value || value === '')) {
      errors.push(`${fieldName} is required`)
    }

    // Apply custom validation rules
    rules.forEach(rule => {
      const isEmpty = !value || value === ''

      if (rule.type === 'required' && isEmpty) {
        errors.push(rule.message || `${fieldName} is required`)
      } else if (!isEmpty) {
        switch (rule.type) {
          case 'email':
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              errors.push(rule.message || 'Please enter a valid email address')
            }
            break
          case 'minLength':
            if (value.length < rule.value) {
              errors.push(rule.message || `Minimum ${rule.value} characters required`)
            }
            break
          case 'maxLength':
            if (value.length > rule.value) {
              errors.push(rule.message || `Maximum ${rule.value} characters allowed`)
            }
            break
          case 'pattern':
            if (!new RegExp(rule.value).test(value)) {
              errors.push(rule.message || 'Invalid format')
            }
            break
          case 'custom':
            if (rule.value && typeof rule.value === 'function') {
              const result = rule.value(value)
              if (!result.valid) {
                if (rule.level === 'warning') {
                  warnings.push(result.message || rule.message)
                } else {
                  errors.push(result.message || rule.message)
                }
              }
            }
            break
        }
      }
    })

    return {
      ...fields[fieldName],
      value: fieldConfig.transform ? fieldConfig.transform(value) : value,
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }, [config, fields])

  // Update field value
  const setFieldValue = useCallback((fieldName: string, value: any) => {
    setFields(prev => {
      const updatedField = { ...prev[fieldName], value }
      if (validateOnChange) {
        return {
          ...prev,
          [fieldName]: validateField(fieldName, value)
        }
      }
      return {
        ...prev,
        [fieldName]: updatedField
      }
    })
  }, [validateField, validateOnChange])

  // Mark field as touched
  const setFieldTouched = useCallback((fieldName: string) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        touched: true
      }
    }))

    if (validateOnBlur) {
      setFields(prev => ({
        ...prev,
        [fieldName]: validateField(fieldName, prev[fieldName].value)
      }))
    }
  }, [validateField, validateOnBlur])

  // Get field props for SmartFormField component
  const getFieldProps = useCallback((fieldName: string) => {
    const field = fields[fieldName]
    const fieldConfig = config[fieldName]

    return {
      name: fieldName,
      value: field.value,
      validationRules: fieldConfig?.validationRules,
      required: fieldConfig?.required,
      onChange: (value: any, isValid: boolean) => {
        setFieldValue(fieldName, value)
      },
      onBlur: () => setFieldTouched(fieldName),
      onFocus: () => {
        // Mark as touched when focused
        setFields(prev => ({
          ...prev,
          [fieldName]: { ...prev[fieldName], touched: true }
        }))
      }
    }
  }, [fields, config, setFieldValue, setFieldTouched])

  // Get form values
  const getValues = useCallback(() => {
    const values: Record<string, any> = {}
    Object.keys(fields).forEach(fieldName => {
      values[fieldName] = fields[fieldName].value
    })
    return values
  }, [fields])

  // Check if form is valid
  const isValid = Object.values(fields).every(field => field.isValid)

  // Check if form is dirty (has changes)
  const isDirty = Object.values(fields).some(field => field.touched)

  // Reset form
  const reset = useCallback(() => {
    setFields(prev => {
      const resetFields: Record<string, FormField> = {}
      Object.keys(prev).forEach(fieldName => {
        const fieldConfig = config[fieldName]
        resetFields[fieldName] = {
          name: fieldName,
          value: fieldConfig?.initialValue || '',
          isValid: true,
          touched: false,
          errors: [],
          warnings: []
        }
      })
      return resetFields
    })
    setSubmitCount(0)
  }, [config])

  // Submit form
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    // Validate all fields
    const updatedFields: Record<string, FormField> = {}
    Object.keys(fields).forEach(fieldName => {
      updatedFields[fieldName] = validateField(fieldName, fields[fieldName].value)
    })
    setFields(updatedFields)

    const allValid = Object.values(updatedFields).every(field => field.isValid)
    const values = getValues()

    if (allValid) {
      setIsSubmitting(true)
      try {
        await onSubmit?.(values, true)
        setSubmitCount(prev => prev + 1)
      } catch (error) {
        console.error('Form submission error:', error)
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // Mark all invalid fields as touched
      setFields(prev => {
        const touchedFields: Record<string, FormField> = {}
        Object.keys(prev).forEach(fieldName => {
          touchedFields[fieldName] = {
            ...prev[fieldName],
            touched: true
          }
        })
        return touchedFields
      })
    }
  }, [fields, validateField, getValues, onSubmit])

  // Get form state
  const getFormState = useCallback(() => ({
    isValid,
    isDirty,
    isSubmitting,
    submitCount,
    fields
  }), [isValid, isDirty, isSubmitting, submitCount, fields])

  return {
    fields,
    getFieldProps,
    getValues,
    setFieldValue,
    setFieldTouched,
    reset,
    handleSubmit,
    getFormState,
    isValid,
    isDirty,
    isSubmitting
  }
}
