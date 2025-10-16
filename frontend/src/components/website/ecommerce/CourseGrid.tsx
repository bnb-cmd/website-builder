import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const CourseGridConfig: ComponentConfig = {
  id: 'course-grid',
  name: 'Course Grid',
  category: 'ecommerce',
  icon: 'BookOpen',
  description: 'Display online courses in a grid layout',
  defaultProps: {
    title: 'Featured Courses',
    subtitle: 'Learn new skills with our expert instructors',
    courses: [
      {
        id: '1',
        title: 'Complete Web Development Bootcamp',
        description: 'Master HTML, CSS, JavaScript, React, Node.js, and more in this comprehensive course.',
        instructor: {
          name: 'Sarah Johnson',
          avatar: '/instructors/sarah-johnson.jpg',
          rating: 4.9,
          students: 12500
        },
        price: 199.99,
        originalPrice: 299.99,
        duration: '40 hours',
        level: 'Beginner',
        rating: 4.8,
        students: 15420,
        image: '/courses/web-development.jpg',
        category: 'Web Development',
        language: 'English',
        lastUpdated: '2024-01-15',
        features: ['Lifetime access', 'Certificate', 'Mobile app', '30-day money back']
      },
      {
        id: '2',
        title: 'Data Science with Python',
        description: 'Learn data analysis, machine learning, and visualization using Python.',
        instructor: {
          name: 'Dr. Michael Chen',
          avatar: '/instructors/michael-chen.jpg',
          rating: 4.9,
          students: 8900
        },
        price: 179.99,
        originalPrice: 249.99,
        duration: '35 hours',
        level: 'Intermediate',
        rating: 4.7,
        students: 11200,
        image: '/courses/data-science.jpg',
        category: 'Data Science',
        language: 'English',
        lastUpdated: '2024-01-10',
        features: ['Lifetime access', 'Certificate', 'Downloadable resources', '30-day money back']
      },
      {
        id: '3',
        title: 'Digital Marketing Mastery',
        description: 'Complete guide to digital marketing including SEO, social media, and PPC.',
        instructor: {
          name: 'Emily Rodriguez',
          avatar: '/instructors/emily-rodriguez.jpg',
          rating: 4.8,
          students: 9800
        },
        price: 149.99,
        originalPrice: 199.99,
        duration: '25 hours',
        level: 'Beginner',
        rating: 4.6,
        students: 8750,
        image: '/courses/digital-marketing.jpg',
        category: 'Marketing',
        language: 'English',
        lastUpdated: '2024-01-08',
        features: ['Lifetime access', 'Certificate', 'Templates', '30-day money back']
      },
      {
        id: '4',
        title: 'UI/UX Design Fundamentals',
        description: 'Learn user interface and user experience design principles and tools.',
        instructor: {
          name: 'Alex Thompson',
          avatar: '/instructors/alex-thompson.jpg',
          rating: 4.9,
          students: 7200
        },
        price: 129.99,
        originalPrice: 179.99,
        duration: '30 hours',
        level: 'Beginner',
        rating: 4.8,
        students: 6800,
        image: '/courses/ui-ux-design.jpg',
        category: 'Design',
        language: 'English',
        lastUpdated: '2024-01-05',
        features: ['Lifetime access', 'Certificate', 'Design files', '30-day money back']
      },
      {
        id: '5',
        title: 'Mobile App Development',
        description: 'Build iOS and Android apps using React Native and Flutter.',
        instructor: {
          name: 'David Kim',
          avatar: '/instructors/david-kim.jpg',
          rating: 4.7,
          students: 5600
        },
        price: 219.99,
        originalPrice: 299.99,
        duration: '45 hours',
        level: 'Intermediate',
        rating: 4.5,
        students: 4200,
        image: '/courses/mobile-development.jpg',
        category: 'Mobile Development',
        language: 'English',
        lastUpdated: '2024-01-12',
        features: ['Lifetime access', 'Certificate', 'Source code', '30-day money back']
      },
      {
        id: '6',
        title: 'Cybersecurity Essentials',
        description: 'Learn about network security, ethical hacking, and cyber defense.',
        instructor: {
          name: 'Lisa Wang',
          avatar: '/instructors/lisa-wang.jpg',
          rating: 4.9,
          students: 3400
        },
        price: 189.99,
        originalPrice: 249.99,
        duration: '28 hours',
        level: 'Intermediate',
        rating: 4.7,
        students: 2800,
        image: '/courses/cybersecurity.jpg',
        category: 'Cybersecurity',
        language: 'English',
        lastUpdated: '2024-01-14',
        features: ['Lifetime access', 'Certificate', 'Lab exercises', '30-day money back']
      }
    ],
    columns: 3,
    showInstructor: true,
    showRating: true,
    showStudents: true,
    showPrice: true,
    showFeatures: true,
    showCategory: true,
    showLevel: true
  },
  defaultSize: { width: 1200, height: 1000 },
  editableFields: [
    'title',
    'subtitle',
    'columns'
  ]
}

interface Instructor {
  name: string
  avatar?: string
  rating: number
  students: number
}

interface Course {
  id: string
  title: string
  description: string
  instructor: Instructor
  price: number
  originalPrice?: number
  duration: string
  level: string
  rating: number
  students: number
  image?: string
  category: string
  language: string
  lastUpdated: string
  features: string[]
}

interface CourseGridProps extends WebsiteComponentProps {
  title?: string
  subtitle?: string
  courses?: Course[]
  columns?: number
  showInstructor?: boolean
  showRating?: boolean
  showStudents?: boolean
  showPrice?: boolean
  showFeatures?: boolean
  showCategory?: boolean
  showLevel?: boolean
}

export const CourseGrid: React.FC<CourseGridProps> = ({ 
  deviceMode = 'desktop',
  title = 'Featured Courses',
  subtitle = 'Learn new skills with our expert instructors',
  courses = [],
  columns = 3,
  showInstructor = true,
  showRating = true,
  showStudents = true,
  showPrice = true,
  showFeatures = true,
  showCategory = true,
  showLevel = true
}) => {
  const textSize = getResponsiveTextSize('text-sm', deviceMode)
  const titleSize = getResponsiveTextSize('text-xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-lg', deviceMode)
  const courseTitleSize = getResponsiveTextSize('text-lg', deviceMode)
  const priceSize = getResponsiveTextSize('text-xl', deviceMode)
  const padding = getResponsivePadding('p-6', deviceMode)
  
  const gridCols = columns === 1 ? 'grid-cols-1' : 
                   columns === 2 ? 'grid-cols-2' : 
                   columns === 3 ? 'grid-cols-3' : 
                   columns === 4 ? 'grid-cols-4' : 'grid-cols-3'
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price)
  }
  
  const getLevelColor = (level: string) => {
    if (!level) return 'bg-gray-100 text-gray-800'
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getCategoryColor = (category: string) => {
    if (!category) return 'bg-gray-100 text-gray-800'
    switch (category.toLowerCase()) {
      case 'web development': return 'bg-blue-100 text-blue-800'
      case 'data science': return 'bg-purple-100 text-purple-800'
      case 'marketing': return 'bg-pink-100 text-pink-800'
      case 'design': return 'bg-orange-100 text-orange-800'
      case 'mobile development': return 'bg-indigo-100 text-indigo-800'
      case 'cybersecurity': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <Card className={`w-full h-full flex flex-col ${padding}`}>
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && <h3 className={`font-bold mb-2 ${titleSize}`}>{title}</h3>}
          {subtitle && <p className={`${subtitleSize} text-gray-600`}>{subtitle}</p>}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className={`grid ${gridCols} gap-6`}>
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                  {course.image ? (
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Course</span>
                    </div>
                  )}
                </div>
                
                <div className="absolute top-2 left-2 flex space-x-2">
                  {showCategory && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(course.category)}`}>
                      {course.category}
                    </span>
                  )}
                  {showLevel && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                  )}
                </div>
                
                {course.originalPrice && course.price < course.originalPrice && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded text-xs font-medium">
                    {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h4 className={`font-semibold mb-2 ${courseTitleSize}`}>{course.title}</h4>
                <p className={`text-gray-600 mb-4 ${textSize}`}>{course.description}</p>
                
                {showInstructor && (
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mr-3">
                      {course.instructor.avatar ? (
                        <img 
                          src={course.instructor.avatar} 
                          alt={course.instructor.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 font-bold text-sm">
                          {course.instructor.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className={`font-medium ${textSize}`}>{course.instructor.name}</div>
                      <div className={`text-gray-500 text-xs`}>
                        {course.duration} • {course.language}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4">
                    {showRating && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className={`${textSize}`}>{course.rating}</span>
                      </div>
                    )}
                    {showStudents && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className={`${textSize}`}>{course.students.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  
                  {showPrice && (
                    <div className="text-right">
                      <div className={`font-bold text-blue-600 ${priceSize}`}>
                        {formatPrice(course.price)}
                      </div>
                      {course.originalPrice && course.price < course.originalPrice && (
                        <div className={`text-gray-500 line-through text-sm`}>
                          {formatPrice(course.originalPrice)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {showFeatures && course.features.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {course.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {feature}
                        </span>
                      ))}
                      {course.features.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          +{course.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <Button className="w-full" size="sm">
                  Enroll Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
