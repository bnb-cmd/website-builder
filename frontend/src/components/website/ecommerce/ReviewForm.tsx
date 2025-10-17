'use client'

import React, { useState } from 'react'
import { Star, ThumbsUp, ThumbsDown, Flag, CheckCircle, User, Calendar } from '@/lib/icons'
import { cn } from '@/lib/utils'

export interface ReviewFormProps {
  onSubmit: (reviewData: any) => void
  product: {
    id: string
    name: string
    image: string
  }
  user?: {
    name: string
    email: string
    avatar?: string
  }
  showImages?: boolean
  showVariant?: boolean
  showVerified?: boolean
  showHelpful?: boolean
  showReport?: boolean
  maxImages?: number
  maxImageSize?: number
  allowAnonymous?: boolean
  requireVerification?: boolean
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  product = {
    id: '1',
    name: 'Premium Wireless Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'
  },
  user = {
    name: 'Ahmed Ali',
    email: 'ahmed@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  },
  showImages = true,
  showVariant = true,
  showVerified = true,
  showHelpful = true,
  showReport = true,
  maxImages = 5,
  maxImageSize = 5 * 1024 * 1024, // 5MB
  allowAnonymous = false,
  requireVerification = false
}) => {
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    variant: '',
    size: '',
    color: '',
    images: [] as File[],
    isAnonymous: false,
    isVerified: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }))
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => {
      if (file.size > maxImageSize) {
        setErrors(prev => ({ ...prev, images: `Image size must be less than ${maxImageSize / (1024 * 1024)}MB` }))
        return false
      }
      return true
    })

    if (formData.images.length + validFiles.length > maxImages) {
      setErrors(prev => ({ ...prev, images: `Maximum ${maxImages} images allowed` }))
      return
    }

    setFormData(prev => ({ ...prev, images: [...prev.images, ...validFiles] }))
    setErrors(prev => ({ ...prev, images: '' }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const newErrors: Record<string, string> = {}
    
    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating'
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a review title'
    }
    
    if (!formData.comment.trim()) {
      newErrors.comment = 'Please write your review'
    }
    
    if (requireVerification && !formData.isVerified) {
      newErrors.verification = 'Please verify your purchase'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
      // Reset form after successful submission
      setFormData({
        rating: 0,
        title: '',
        comment: '',
        variant: '',
        size: '',
        color: '',
        images: [],
        isAnonymous: false,
        isVerified: false
      })
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => interactive && handleRatingChange(i + 1)}
        className={cn(
          'w-6 h-6 transition',
          interactive && 'hover:scale-110',
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        )}
      >
        <Star className="w-full h-full" />
      </button>
    ))
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 object-cover rounded-lg"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>
          <p className="text-gray-600">{product.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Rating *
          </label>
          <div className="flex gap-1">
            {renderStars(formData.rating, true)}
          </div>
          {errors.rating && (
            <p className="text-red-600 text-sm mt-1">{errors.rating}</p>
          )}
        </div>

        {/* Review Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Summarize your experience"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Review Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => handleInputChange('comment', e.target.value)}
            placeholder="Tell others about your experience with this product..."
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.comment && (
            <p className="text-red-600 text-sm mt-1">{errors.comment}</p>
          )}
        </div>

        {/* Product Variants */}
        {showVariant && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variant
              </label>
              <input
                type="text"
                value={formData.variant}
                onChange={(e) => handleInputChange('variant', e.target.value)}
                placeholder="e.g., Black, White"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size
              </label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => handleInputChange('size', e.target.value)}
                placeholder="e.g., M, L, XL"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                placeholder="e.g., Red, Blue"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Image Upload */}
        {showImages && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Photos ({formData.images.length}/{maxImages})
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.images && (
              <p className="text-red-600 text-sm mt-1">{errors.images}</p>
            )}
            
            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="flex gap-2 mt-3">
                {formData.images.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Verification */}
        {requireVerification && (
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isVerified}
                onChange={(e) => handleInputChange('isVerified', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                I confirm that I have purchased this product
              </span>
            </label>
            {errors.verification && (
              <p className="text-red-600 text-sm mt-1">{errors.verification}</p>
            )}
          </div>
        )}

        {/* Anonymous Review */}
        {allowAnonymous && (
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isAnonymous}
                onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Submit as anonymous review
              </span>
            </label>
          </div>
        )}

        {/* User Info */}
        {!formData.isAnonymous && user && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <img
              src={user.avatar || 'https://via.placeholder.com/40x40'}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-600">Reviewing as {user.email}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  )
}

// Component configuration for editor
export const ReviewFormConfig = {
  id: 'review-form',
  name: 'Review Form',
  description: 'Product review submission form with ratings and images',
  category: 'ecommerce' as const,
  icon: 'star',
  defaultProps: {
    product: {
      id: '1',
      name: 'Premium Wireless Headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'
    },
    user: {
      name: 'Ahmed Ali',
      email: 'ahmed@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    showImages: true,
    showVariant: true,
    showVerified: true,
    showHelpful: true,
    showReport: true,
    maxImages: 5,
    maxImageSize: 5 * 1024 * 1024,
    allowAnonymous: false,
    requireVerification: false
  },
  defaultSize: { width: 100, height: 600 },
  editableFields: [
    'product',
    'user',
    'showImages',
    'showVariant',
    'showVerified',
    'showHelpful',
    'showReport',
    'maxImages',
    'maxImageSize',
    'allowAnonymous',
    'requireVerification'
  ]
}
