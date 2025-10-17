'use client'

import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Building, Globe, Calendar, Clock, CheckCircle, Star, DollarSign, CreditCard, MessageSquare, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SurveyFormProps {
  onSubmit: (formData: any) => void
  title?: string
  subtitle?: string
  questions: Array<{
    id: string
    question: string
    type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'rating' | 'scale'
    required?: boolean
    options?: string[]
    scaleLabels?: {
      min: string
      max: string
    }
  }>
  showProgress?: boolean
  showContactInfo?: boolean
  submitButtonText?: string
  successMessage?: string
  errorMessage?: string
  layout?: 'single' | 'multi-step' | 'compact'
  theme?: 'light' | 'dark' | 'colored'
  allowSaveProgress?: boolean
}

export const SurveyForm: React.FC<SurveyFormProps> = ({
  onSubmit,
  title = 'Customer Survey',
  subtitle = 'Help us understand your needs better',
  questions = [
    {
      id: '1',
      question: 'How satisfied are you with our service?',
      type: 'rating',
      required: true
    },
    {
      id: '2',
      question: 'What is your primary reason for using our service?',
      type: 'radio',
      required: true,
      options: ['Quality', 'Price', 'Convenience', 'Customer Service', 'Other']
    },
    {
      id: '3',
      question: 'Which features do you find most valuable?',
      type: 'checkbox',
      required: false,
      options: ['Feature A', 'Feature B', 'Feature C', 'Feature D']
    },
    {
      id: '4',
      question: 'How likely are you to recommend us to others?',
      type: 'scale',
      required: true,
      scaleLabels: {
        min: 'Not likely',
        max: 'Very likely'
      }
    },
    {
      id: '5',
      question: 'Any additional comments or suggestions?',
      type: 'textarea',
      required: false
    }
  ],
  showProgress = true,
  showContactInfo = false,
  submitButtonText = 'Submit Survey',
  successMessage = 'Thank you for completing our survey!',
  errorMessage = 'Sorry, there was an error submitting your survey. Please try again.',
  layout = 'single',
  theme = 'light',
  allowSaveProgress = false
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const handleInputChange = (questionId: string, value: any) => {
    setFormData(prev => ({ ...prev, [questionId]: value }))
    if (errors[questionId]) {
      setErrors(prev => ({ ...prev, [questionId]: '' }))
    }
  }

  const validateQuestion = (question: any) => {
    if (!question.required) return true
    
    const value = formData[question.id]
    if (value === undefined || value === null || value === '') {
      return false
    }
    
    if (Array.isArray(value) && value.length === 0) {
      return false
    }
    
    return true
  }

  const validateAllQuestions = () => {
    const newErrors: Record<string, string> = {}
    
    questions.forEach(question => {
      if (!validateQuestion(question)) {
        newErrors[question.id] = 'This question is required'
      }
    })
    
    return newErrors
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      const currentQ = questions[currentQuestion]
      if (!validateQuestion(currentQ)) {
        setErrors(prev => ({ ...prev, [currentQ.id]: 'This question is required' }))
        return
      }
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = validateAllQuestions()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      await onSubmit(formData)
      setSubmitStatus('success')
    } catch (error) {
      console.error('Error submitting survey:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = cn(
    'w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition',
    theme === 'dark' 
      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
      : theme === 'colored'
      ? 'bg-blue-50 border-blue-200 text-gray-900'
      : 'bg-white border-gray-300 text-gray-900'
  )

  const labelClass = cn(
    'block text-sm font-medium mb-2',
    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
  )

  const containerClass = cn(
    'p-6 rounded-lg border',
    theme === 'dark' 
      ? 'bg-gray-900 border-gray-700'
      : theme === 'colored'
      ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
      : 'bg-white border-gray-200'
  )

  const titleClass = cn(
    'text-xl font-bold mb-2',
    theme === 'dark' ? 'text-white' : 'text-gray-900'
  )

  const subtitleClass = cn(
    'text-sm mb-4',
    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  )

  const renderQuestion = (question: any) => {
    const value = formData[question.id]

    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className={inputClass}
            placeholder="Your answer..."
          />
        )

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className={cn(inputClass, 'min-h-[120px] resize-y')}
            placeholder="Your answer..."
          />
        )

      case 'radio':
        return (
          <div className="space-y-2">
            {question.options?.map((option: string) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                  {option}
                </span>
              </label>
            ))}
          </div>
        )

      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option: string) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) ? value.includes(option) : false}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : []
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter(v => v !== option)
                    handleInputChange(question.id, newValues)
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                  {option}
                </span>
              </label>
            ))}
          </div>
        )

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className={inputClass}
          >
            <option value="">Select an option</option>
            {question.options?.map((option: string) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )

      case 'rating':
        return (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleInputChange(question.id, star)}
                className={cn(
                  'text-3xl transition hover:scale-110',
                  star <= (value || 0) ? 'text-yellow-400' : 'text-gray-300'
                )}
              >
                ★
              </button>
            ))}
          </div>
        )

      case 'scale':
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{question.scaleLabels?.min || '1'}</span>
              <span>{question.scaleLabels?.max || '10'}</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleInputChange(question.id, num)}
                  className={cn(
                    'w-10 h-10 rounded-full border-2 flex items-center justify-center font-medium transition',
                    value === num
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  )}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (layout === 'multi-step') {
    const currentQ = questions[currentQuestion]
    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
      <div className={containerClass}>
        <div className="mb-6">
          <h2 className={titleClass}>{title}</h2>
          <p className={subtitleClass}>{subtitle}</p>
          {showProgress && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {currentQ.question}
              {currentQ.required && <span className="text-red-500 ml-1">*</span>}
            </h3>
            
            {renderQuestion(currentQ)}
            
            {errors[currentQ.id] && (
              <p className="text-red-600 text-sm mt-2">{errors[currentQ.id]}</p>
            )}
          </div>

          <div className="flex justify-between">
            {currentQuestion > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Back
              </button>
            )}
            
            {currentQuestion < questions.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'ml-auto px-6 py-2 rounded-lg font-medium transition',
                  isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                )}
              >
                {isSubmitting ? 'Submitting...' : submitButtonText}
              </button>
            )}
          </div>
        </form>

        {/* Submit Status */}
        {submitStatus === 'success' && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {errorMessage}
          </div>
        )}
      </div>
    )
  }

  if (layout === 'compact') {
    return (
      <div className={containerClass}>
        <div className="mb-4">
          <h3 className={titleClass}>{title}</h3>
          <p className={subtitleClass}>{subtitle}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {questions.slice(0, 3).map((question) => (
            <div key={question.id}>
              <label className={labelClass}>
                {question.question}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderQuestion(question)}
              {errors[question.id] && (
                <p className="text-red-600 text-sm mt-1">{errors[question.id]}</p>
              )}
            </div>
          ))}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'w-full py-3 px-6 rounded-lg font-medium transition',
              isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            {isSubmitting ? 'Submitting...' : submitButtonText}
          </button>
        </form>
      </div>
    )
  }

  // Single layout (default)
  return (
    <div className={containerClass}>
      <div className="mb-6">
        <h2 className={titleClass}>{title}</h2>
        <p className={subtitleClass}>{subtitle}</p>
        {showProgress && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{questions.length} questions</span>
              <span>Estimated time: 5 minutes</span>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((question, index) => (
          <div key={question.id}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {index + 1}. {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </h3>
            
            {renderQuestion(question)}
            
            {errors[question.id] && (
              <p className="text-red-600 text-sm mt-2">{errors[question.id]}</p>
            )}
          </div>
        ))}

        {showContactInfo && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={cn(inputClass, 'pl-11')}
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={cn(inputClass, 'pl-11')}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Status */}
        {submitStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'w-full py-3 px-6 rounded-lg font-medium transition',
            isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          )}
        >
          {isSubmitting ? 'Submitting...' : submitButtonText}
        </button>
      </form>
    </div>
  )
}

// Component configuration for editor
export const SurveyFormConfig = {
  id: 'survey-form',
  name: 'Survey Form',
  description: 'Interactive survey form with multiple question types and progress tracking',
  category: 'business' as const,
  icon: 'file-text',
  defaultProps: {
    title: 'Customer Survey',
    subtitle: 'Help us understand your needs better',
    questions: [
      {
        id: '1',
        question: 'How satisfied are you with our service?',
        type: 'rating',
        required: true
      },
      {
        id: '2',
        question: 'What is your primary reason for using our service?',
        type: 'radio',
        required: true,
        options: ['Quality', 'Price', 'Convenience', 'Customer Service', 'Other']
      },
      {
        id: '3',
        question: 'Which features do you find most valuable?',
        type: 'checkbox',
        required: false,
        options: ['Feature A', 'Feature B', 'Feature C', 'Feature D']
      },
      {
        id: '4',
        question: 'How likely are you to recommend us to others?',
        type: 'scale',
        required: true,
        scaleLabels: {
          min: 'Not likely',
          max: 'Very likely'
        }
      },
      {
        id: '5',
        question: 'Any additional comments or suggestions?',
        type: 'textarea',
        required: false
      }
    ],
    showProgress: true,
    showContactInfo: false,
    submitButtonText: 'Submit Survey',
    successMessage: 'Thank you for completing our survey!',
    errorMessage: 'Sorry, there was an error submitting your survey. Please try again.',
    layout: 'single',
    theme: 'light',
    allowSaveProgress: false
  },
  defaultSize: { width: 100, height: 700 },
  editableFields: [
    'title',
    'subtitle',
    'questions',
    'showProgress',
    'showContactInfo',
    'submitButtonText',
    'successMessage',
    'errorMessage',
    'layout',
    'theme',
    'allowSaveProgress'
  ]
}
