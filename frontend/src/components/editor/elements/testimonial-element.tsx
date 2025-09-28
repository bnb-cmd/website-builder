'use client'

import { Element } from '@/types/editor'
import { Quote, Star } from 'lucide-react'
import { useState } from 'react'

interface TestimonialElementProps {
  element: Element
  isSelected: boolean
  onSelect: () => void
}

export function TestimonialElement({ element, isSelected, onSelect }: TestimonialElementProps) {
  const { 
    testimonials = [],
    layout = 'carousel',
    showRating = true,
    autoRotate = true,
    rotateInterval = 5000
  } = element.props

  const defaultTestimonials = testimonials.length > 0 ? testimonials : [
    {
      name: 'Sarah Ahmed',
      role: 'CEO, Tech Startup',
      content: 'This platform transformed our online presence. The ease of use and professional results exceeded our expectations.',
      rating: 5,
      image: 'https://via.placeholder.com/100'
    },
    {
      name: 'Ali Hassan',
      role: 'Freelancer',
      content: 'As a freelancer, having a professional website is crucial. This builder made it incredibly simple and affordable.',
      rating: 5,
      image: 'https://via.placeholder.com/100'
    },
    {
      name: 'Fatima Khan',
      role: 'Small Business Owner',
      content: 'The local payment integration and Urdu support made this perfect for our Pakistani market.',
      rating: 5,
      image: 'https://via.placeholder.com/100'
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-rotate for carousel layout
  useState(() => {
    if (layout === 'carousel' && autoRotate) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % defaultTestimonials.length)
      }, rotateInterval)
      
      return () => clearInterval(interval)
    }
  }, [layout, autoRotate, rotateInterval, defaultTestimonials.length])

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${
              index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const renderTestimonial = (testimonial: any, index: number) => (
    <div 
      key={index}
      className="bg-card border border-border rounded-lg p-6 relative"
    >
      <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/20" />
      
      <div className="space-y-4">
        {showRating && (
          <div>{renderStars(testimonial.rating)}</div>
        )}
        
        <p className="text-muted-foreground italic">
          "{testimonial.content}"
        </p>
        
        <div className="flex items-center gap-3 pt-4">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold">{testimonial.name}</div>
            <div className="text-sm text-muted-foreground">{testimonial.role}</div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div
      onClick={onSelect}
      className={`
        p-8 cursor-pointer transition-all
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
      `}
    >
      {layout === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {defaultTestimonials.map((testimonial, index) => 
            renderTestimonial(testimonial, index)
          )}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          {renderTestimonial(defaultTestimonials[currentIndex], currentIndex)}
          
          {/* Carousel indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {defaultTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex(index)
                }}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-primary w-8' 
                    : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
