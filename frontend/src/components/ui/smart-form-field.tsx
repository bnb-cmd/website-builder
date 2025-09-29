'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Info,
  Lightbulb,
  Shield,
  Zap,
  Lock,
  Mail,
  Phone,
  Globe,
  CreditCard,
  User,
  Calendar,
  MapPin
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type ValidationRule = {
  type: 'required' | 'email' | 'phone' | 'url' | 'password' | 'minLength' | 'maxLength' | 'pattern' | 'custom'
  value?: any
  message: string
  level?: 'error' | 'warning' | 'info'
}

export type SmartFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'phone'
  | 'url'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'slider'
  | 'date'
  | 'file'

export interface SmartFormFieldProps {
  name: string
  label?: string
  type?: SmartFieldType
  placeholder?: string
  value?: any
  defaultValue?: any
  onChange?: (value: any, isValid: boolean) => void
  onBlur?: () => void
  onFocus?: () => void
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  validationRules?: ValidationRule[]
  suggestions?: string[]
  autoComplete?: string
  className?: string
  helpText?: string
  icon?: any
  showPasswordToggle?: boolean
  showValidation?: boolean
  realTimeValidation?: boolean
  aiSuggestions?: boolean
  context?: string[]
  options?: Array<{ value: string; label: string; disabled?: boolean }>
  min?: number
  max?: number
  step?: number
  multiple?: boolean
  accept?: string
}

interface ValidationResult {
  isValid: boolean
  errors: Array<{ rule: ValidationRule; message: string }>
  warnings: Array<{ rule: ValidationRule; message: string }>
  suggestions: string[]
}

// Smart validation function
const validateField = (value: any, rules: ValidationRule[], fieldType: SmartFieldType): ValidationResult => {
  const errors: Array<{ rule: ValidationRule; message: string }> = []
  const warnings: Array<{ rule: ValidationRule; message: string }> = []
  const suggestions: string[] = []

  if (!rules || rules.length === 0) {
    return { isValid: true, errors, warnings, suggestions }
  }

  rules.forEach(rule => {
    const isEmpty = value === '' || value === null || value === undefined

    switch (rule.type) {
      case 'required':
        if (isEmpty) {
          errors.push({ rule, message: rule.message || 'This field is required' })
        }
        break

      case 'email':
        if (!isEmpty && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push({ rule, message: rule.message || 'Please enter a valid email address' })
        }
        break

      case 'phone':
        if (!isEmpty && !/^[\+]?[\d\s\-\(\)]{10,}$/.test(value)) {
          errors.push({ rule, message: rule.message || 'Please enter a valid phone number' })
        }
        break

      case 'url':
        if (!isEmpty && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(value)) {
          errors.push({ rule, message: rule.message || 'Please enter a valid URL' })
        }
        break

      case 'password':
        if (!isEmpty) {
          const strength = calculatePasswordStrength(value)
          if (strength.score < 3) {
            warnings.push({
              rule,
              message: rule.message || getPasswordStrengthMessage(strength.score)
            })
            suggestions.push(...strength.suggestions)
          }
        }
        break

      case 'minLength':
        if (!isEmpty && value.length < rule.value) {
          errors.push({
            rule,
            message: rule.message || `Minimum ${rule.value} characters required`
          })
        }
        break

      case 'maxLength':
        if (!isEmpty && value.length > rule.value) {
          errors.push({
            rule,
            message: rule.message || `Maximum ${rule.value} characters allowed`
          })
        }
        break

      case 'pattern':
        if (!isEmpty && !new RegExp(rule.value).test(value)) {
          errors.push({ rule, message: rule.message || 'Invalid format' })
        }
        break

      case 'custom':
        if (rule.value && typeof rule.value === 'function') {
          const result = rule.value(value)
          if (!result.valid) {
            if (rule.level === 'warning') {
              warnings.push({ rule, message: result.message || rule.message })
            } else {
              errors.push({ rule, message: result.message || rule.message })
            }
          }
        }
        break
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  }
}

// Password strength calculation
const calculatePasswordStrength = (password: string) => {
  let score = 0
  const suggestions: string[] = []

  if (password.length >= 8) score++
  else suggestions.push('Use at least 8 characters')

  if (/[a-z]/.test(password)) score++
  else suggestions.push('Add lowercase letters')

  if (/[A-Z]/.test(password)) score++
  else suggestions.push('Add uppercase letters')

  if (/[0-9]/.test(password)) score++
  else suggestions.push('Add numbers')

  if (/[^A-Za-z0-9]/.test(password)) score++
  else suggestions.push('Add special characters')

  return { score, suggestions }
}

const getPasswordStrengthMessage = (score: number) => {
  switch (score) {
    case 0: return 'Very weak password'
    case 1: return 'Weak password'
    case 2: return 'Fair password'
    case 3: return 'Good password'
    case 4: return 'Strong password'
    default: return 'Very strong password'
  }
}

// AI-powered suggestions based on context
const getAISuggestions = (fieldType: SmartFieldType, context: string[], currentValue: string) => {
  const suggestions: string[] = []

  switch (fieldType) {
    case 'email':
      if (context.includes('business')) {
        suggestions.push('info@company.com', 'contact@company.com', 'hello@company.com')
      } else if (context.includes('personal')) {
        suggestions.push('your.name@email.com', 'firstname.lastname@gmail.com')
      }
      break

    case 'phone':
      if (context.includes('pakistan')) {
        suggestions.push('+92 300 1234567', '+92 321 7654321')
      }
      break

    case 'url':
      if (context.includes('social')) {
        suggestions.push('https://facebook.com/company', 'https://instagram.com/company', 'https://linkedin.com/company')
      } else if (context.includes('business')) {
        suggestions.push('https://company.com', 'https://www.company.com')
      }
      break

    case 'text':
      if (context.includes('business-name')) {
        suggestions.push('Tech Solutions Inc.', 'Digital Marketing Agency', 'Creative Studio')
      } else if (context.includes('headline')) {
        suggestions.push('Welcome to Our Platform', 'Transform Your Business', 'Build Something Amazing')
      }
      break
  }

  return suggestions.filter(s => !currentValue || s.toLowerCase().includes(currentValue.toLowerCase()))
}

export function SmartFormField({
  name,
  label,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  required,
  disabled,
  readonly,
  validationRules = [],
  suggestions: customSuggestions = [],
  autoComplete,
  className,
  helpText,
  icon: Icon,
  showPasswordToggle = false,
  showValidation = true,
  realTimeValidation = true,
  aiSuggestions = false,
  context = [],
  options = [],
  min,
  max,
  step,
  multiple,
  accept,
  ...props
}: SmartFormFieldProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [touched, setTouched] = useState(false)
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, errors: [], warnings: [], suggestions: [] })
  const [aiSuggestionsList, setAiSuggestionsList] = useState<string[]>([])

  const currentValue = value !== undefined ? value : internalValue

  // Combine validation rules
  const allRules = [
    ...validationRules,
    ...(required ? [{ type: 'required' as const, message: `${label || name} is required` }] : [])
  ]

  // Real-time validation
  const validate = useCallback((val: any) => {
    const result = validateField(val, allRules, type)
    setValidation(result)
    return result
  }, [allRules, type])

  // Update validation on value change
  useEffect(() => {
    if (realTimeValidation || touched) {
      validate(currentValue)
    }
  }, [currentValue, validate, realTimeValidation, touched])

  // AI suggestions
  useEffect(() => {
    if (aiSuggestions && isFocused && currentValue.length < 3) {
      const suggestions = getAISuggestions(type, context, currentValue)
      setAiSuggestionsList(suggestions.slice(0, 5))
    } else {
      setAiSuggestionsList([])
    }
  }, [type, context, currentValue, isFocused, aiSuggestions])

  const handleChange = (newValue: any) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onChange?.(newValue, validation.isValid)
  }

  const handleFocus = () => {
    setIsFocused(true)
    setTouched(true)
    onFocus?.()
  }

  const handleBlur = () => {
    setIsFocused(false)
    validate(currentValue)
    onBlur?.()
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleChange(suggestion)
    setAiSuggestionsList([])
  }

  const getFieldIcon = () => {
    if (Icon) return Icon

    switch (type) {
      case 'email': return Mail
      case 'password': return Lock
      case 'phone': return Phone
      case 'url': return Globe
      case 'date': return Calendar
      case 'file': return Upload
      default: return User
    }
  }

  const FieldIcon = getFieldIcon()

  const renderField = () => {
    const commonProps = {
      id: name,
      name,
      placeholder,
      disabled,
      readOnly: readonly,
      autoComplete,
      className: cn(
        'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        validation.errors.length > 0 && 'border-destructive focus-visible:ring-destructive',
        validation.warnings.length > 0 && validation.errors.length === 0 && 'border-yellow-500 focus-visible:ring-yellow-500',
        FieldIcon && 'pl-10',
        type === 'password' && showPasswordToggle && 'pr-10',
        className
      ),
      onFocus: handleFocus,
      onBlur: handleBlur
    }

    switch (type) {
      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            value={currentValue}
            onChange={(e) => handleChange(e.target.value)}
            className={cn(commonProps.className, 'min-h-[80px]')}
          />
        )

      case 'select':
        return (
          <Select value={currentValue} onValueChange={handleChange}>
            <SelectTrigger className={commonProps.className}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={name}
              checked={currentValue}
              onCheckedChange={handleChange}
              disabled={disabled}
            />
            <Label htmlFor={name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {label}
            </Label>
          </div>
        )

      case 'radio':
        return (
          <RadioGroup value={currentValue} onValueChange={handleChange}>
            {options.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${name}-${option.value}`} disabled={option.disabled} />
                <Label htmlFor={`${name}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case 'slider':
        return (
          <div className="space-y-2">
            <Slider
              value={[currentValue || 0]}
              onValueChange={(values) => handleChange(values[0])}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{min}</span>
              <span>{currentValue}</span>
              <span>{max}</span>
            </div>
          </div>
        )

      case 'file':
        return (
          <Input
            {...commonProps}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={(e) => handleChange(e.target.files)}
          />
        )

      default:
        return (
          <div className="relative">
            {FieldIcon && (
              <FieldIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            )}
            <Input
              {...commonProps}
              type={type === 'password' && showPassword ? 'text' : type}
              value={currentValue}
              onChange={(e) => handleChange(e.target.value)}
            />
            {type === 'password' && showPasswordToggle && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            )}
          </div>
        )
    }
  }

  const hasValidationIssues = validation.errors.length > 0 || validation.warnings.length > 0

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && type !== 'checkbox' && (
        <Label htmlFor={name} className="text-sm font-medium leading-none">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      {/* Field */}
      {renderField()}

      {/* AI Suggestions */}
      {aiSuggestions && aiSuggestionsList.length > 0 && isFocused && (
        <div className="relative">
          <div className="absolute z-10 w-full bg-popover border border-border rounded-md shadow-lg p-2">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">AI Suggestions</span>
            </div>
            <div className="space-y-1">
              {aiSuggestionsList.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-auto p-2 text-left"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <Lightbulb className="h-3 w-3 mr-2 text-yellow-500" />
                  <span className="text-xs">{suggestion}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom Suggestions */}
      {customSuggestions.length > 0 && !aiSuggestionsList.length && (
        <div className="flex flex-wrap gap-1">
          {customSuggestions.map((suggestion, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-accent"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      )}

      {/* Help Text */}
      {helpText && !hasValidationIssues && (
        <p className="text-xs text-muted-foreground flex items-center">
          <Info className="h-3 w-3 mr-1" />
          {helpText}
        </p>
      )}

      {/* Validation Messages */}
      {showValidation && hasValidationIssues && (
        <div className="space-y-1">
          {validation.errors.map((error, index) => (
            <p key={`error-${index}`} className="text-xs text-destructive flex items-center">
              <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
              {error.message}
            </p>
          ))}
          {validation.warnings.map((warning, index) => (
            <p key={`warning-${index}`} className="text-xs text-yellow-600 flex items-center">
              <Shield className="h-3 w-3 mr-1 flex-shrink-0" />
              {warning.message}
            </p>
          ))}
        </div>
      )}

      {/* Success Indicator */}
      {showValidation && touched && validation.isValid && currentValue && (
        <p className="text-xs text-green-600 flex items-center">
          <CheckCircle className="h-3 w-3 mr-1" />
          Looks good!
        </p>
      )}

      {/* Validation Suggestions */}
      {validation.suggestions.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Suggestions:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            {validation.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-center">
                <Lightbulb className="h-3 w-3 mr-1 text-yellow-500" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
