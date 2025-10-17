'use client'

import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Building, Globe, Calendar, Clock, CheckCircle, Star, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface JobApplicationFormProps {
  onSubmit: (formData: any) => void
  jobTitle?: string
  companyName?: string
  showPersonalInfo?: boolean
  showExperience?: boolean
  showEducation?: boolean
  showSkills?: boolean
  showReferences?: boolean
  showCoverLetter?: boolean
  showResume?: boolean
  showPortfolio?: boolean
  showSalary?: boolean
  showAvailability?: boolean
  showWorkPermit?: boolean
  skills?: string[]
  experienceLevels?: string[]
  educationLevels?: string[]
  submitButtonText?: string
  successMessage?: string
  errorMessage?: string
  layout?: 'single' | 'multi-step' | 'compact'
  theme?: 'light' | 'dark' | 'colored'
}

export const JobApplicationForm: React.FC<JobApplicationFormProps> = ({
  onSubmit,
  jobTitle = 'Software Developer',
  companyName = 'Tech Company',
  showPersonalInfo = true,
  showExperience = true,
  showEducation = true,
  showSkills = true,
  showReferences = false,
  showCoverLetter = true,
  showResume = true,
  showPortfolio = false,
  showSalary = false,
  showAvailability = true,
  showWorkPermit = true,
  skills = ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'AWS', 'Docker'],
  experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead/Manager'],
  educationLevels = ['High School', 'Associate', 'Bachelor', 'Master', 'PhD'],
  submitButtonText = 'Submit Application',
  successMessage = 'Thank you! Your application has been submitted successfully.',
  errorMessage = 'Sorry, there was an error submitting your application. Please try again.',
  layout = 'single',
  theme = 'light'
}) => {
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Pakistan',
    
    // Experience
    experienceLevel: '',
    yearsOfExperience: '',
    currentCompany: '',
    currentPosition: '',
    previousExperience: '',
    
    // Education
    educationLevel: '',
    university: '',
    degree: '',
    graduationYear: '',
    
    // Skills
    selectedSkills: [] as string[],
    additionalSkills: '',
    
    // References
    references: '',
    
    // Cover Letter
    coverLetter: '',
    
    // Resume
    resumeFile: null as File | null,
    
    // Portfolio
    portfolioUrl: '',
    
    // Salary
    expectedSalary: '',
    currentSalary: '',
    
    // Availability
    availability: '',
    startDate: '',
    
    // Work Permit
    workPermit: '',
    visaStatus: '',
    
    // Consent
    privacyConsent: false,
    dataProcessingConsent: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [currentStep, setCurrentStep] = useState(1)

  const handleInputChange = (field: string, value: string | boolean | File | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSkillToggle = (skill: string) => {
    const newSkills = formData.selectedSkills.includes(skill)
      ? formData.selectedSkills.filter(s => s !== skill)
      : [...formData.selectedSkills, skill]
    handleInputChange('selectedSkills', newSkills)
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1 && showPersonalInfo) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email'
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    }

    if (step === 2 && showExperience) {
      if (!formData.experienceLevel) newErrors.experienceLevel = 'Experience level is required'
      if (!formData.yearsOfExperience) newErrors.yearsOfExperience = 'Years of experience is required'
    }

    if (step === 3 && showEducation) {
      if (!formData.educationLevel) newErrors.educationLevel = 'Education level is required'
      if (!formData.university.trim()) newErrors.university = 'University is required'
    }

    if (step === 4) {
      if (!formData.privacyConsent) newErrors.privacyConsent = 'You must accept the privacy policy'
    }

    return newErrors
  }

  const handleNext = () => {
    const newErrors = validateStep(currentStep)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setCurrentStep(prev => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = validateStep(4)
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
      console.error('Error submitting application:', error)
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

  const PersonalInfoStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={cn(inputClass, 'pl-11')}
                placeholder="John"
              />
            </div>
            {errors.firstName && (
              <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Last Name *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={inputClass}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={cn(inputClass, 'pl-11')}
                placeholder="john@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Phone *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={cn(inputClass, 'pl-11')}
                placeholder="+92 300 1234567"
              />
            </div>
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={cn(inputClass, 'pl-11')}
                placeholder="123 Main Street, Karachi"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className={inputClass}
              placeholder="Karachi"
            />
          </div>

          <div>
            <label className={labelClass}>Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className={inputClass}
              placeholder="Pakistan"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const ExperienceStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience</h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Experience Level *</label>
            <select
              value={formData.experienceLevel}
              onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
              className={inputClass}
            >
              <option value="">Select experience level</option>
              {experienceLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            {errors.experienceLevel && (
              <p className="text-red-600 text-sm mt-1">{errors.experienceLevel}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Years of Experience *</label>
            <select
              value={formData.yearsOfExperience}
              onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
              className={inputClass}
            >
              <option value="">Select years</option>
              <option value="0-1">0-1 years</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">10+ years</option>
            </select>
            {errors.yearsOfExperience && (
              <p className="text-red-600 text-sm mt-1">{errors.yearsOfExperience}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Current Company</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.currentCompany}
                onChange={(e) => handleInputChange('currentCompany', e.target.value)}
                className={cn(inputClass, 'pl-11')}
                placeholder="Current company name"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Current Position</label>
            <input
              type="text"
              value={formData.currentPosition}
              onChange={(e) => handleInputChange('currentPosition', e.target.value)}
              className={inputClass}
              placeholder="Current job title"
            />
          </div>

          <div>
            <label className={labelClass}>Previous Experience</label>
            <textarea
              value={formData.previousExperience}
              onChange={(e) => handleInputChange('previousExperience', e.target.value)}
              className={cn(inputClass, 'min-h-[120px] resize-y')}
              placeholder="Describe your previous work experience..."
            />
          </div>
        </div>
      </div>
    </div>
  )

  const EducationStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Education Level *</label>
            <select
              value={formData.educationLevel}
              onChange={(e) => handleInputChange('educationLevel', e.target.value)}
              className={inputClass}
            >
              <option value="">Select education level</option>
              {educationLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            {errors.educationLevel && (
              <p className="text-red-600 text-sm mt-1">{errors.educationLevel}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>University *</label>
            <input
              type="text"
              value={formData.university}
              onChange={(e) => handleInputChange('university', e.target.value)}
              className={inputClass}
              placeholder="University name"
            />
            {errors.university && (
              <p className="text-red-600 text-sm mt-1">{errors.university}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Degree</label>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) => handleInputChange('degree', e.target.value)}
              className={inputClass}
              placeholder="Bachelor of Science in Computer Science"
            />
          </div>

          <div>
            <label className={labelClass}>Graduation Year</label>
            <input
              type="number"
              value={formData.graduationYear}
              onChange={(e) => handleInputChange('graduationYear', e.target.value)}
              className={inputClass}
              placeholder="2020"
              min="1950"
              max="2030"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const SkillsStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Technical Skills</label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm border transition',
                    formData.selectedSkills.includes(skill)
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Additional Skills</label>
            <textarea
              value={formData.additionalSkills}
              onChange={(e) => handleInputChange('additionalSkills', e.target.value)}
              className={cn(inputClass, 'min-h-[100px] resize-y')}
              placeholder="Any other skills or certifications..."
            />
          </div>
        </div>
      </div>
    </div>
  )

  const AdditionalInfoStep = () => (
    <div className="space-y-6">
      {showCoverLetter && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cover Letter</h3>
          <div>
            <label className={labelClass}>Cover Letter</label>
            <textarea
              value={formData.coverLetter}
              onChange={(e) => handleInputChange('coverLetter', e.target.value)}
              className={cn(inputClass, 'min-h-[200px] resize-y')}
              placeholder="Tell us why you're interested in this position..."
            />
          </div>
        </div>
      )}

      {showResume && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume</h3>
          <div>
            <label className={labelClass}>Upload Resume</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleInputChange('resumeFile', e.target.files?.[0] || null)}
              className={inputClass}
            />
          </div>
        </div>
      )}

      {showPortfolio && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio</h3>
          <div>
            <label className={labelClass}>Portfolio URL</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={formData.portfolioUrl}
                onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                className={cn(inputClass, 'pl-11')}
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>
        </div>
      )}

      {showSalary && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Expectations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Expected Salary</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.expectedSalary}
                  onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                  className={cn(inputClass, 'pl-11')}
                  placeholder="50000"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Current Salary</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.currentSalary}
                  onChange={(e) => handleInputChange('currentSalary', e.target.value)}
                  className={cn(inputClass, 'pl-11')}
                  placeholder="40000"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {showAvailability && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Availability</label>
              <select
                value={formData.availability}
                onChange={(e) => handleInputChange('availability', e.target.value)}
                className={inputClass}
              >
                <option value="">Select availability</option>
                <option value="immediate">Immediate</option>
                <option value="2-weeks">2 weeks notice</option>
                <option value="1-month">1 month notice</option>
                <option value="2-months">2 months notice</option>
                <option value="3-months">3+ months notice</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Preferred Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={cn(inputClass, 'pl-11')}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {showWorkPermit && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Authorization</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Work Permit Status</label>
              <select
                value={formData.workPermit}
                onChange={(e) => handleInputChange('workPermit', e.target.value)}
                className={inputClass}
              >
                <option value="">Select status</option>
                <option value="citizen">Citizen</option>
                <option value="permanent-resident">Permanent Resident</option>
                <option value="work-permit">Work Permit</option>
                <option value="student-visa">Student Visa</option>
                <option value="visitor-visa">Visitor Visa</option>
                <option value="no-permit">No Work Permit</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Visa Status</label>
              <input
                type="text"
                value={formData.visaStatus}
                onChange={(e) => handleInputChange('visaStatus', e.target.value)}
                className={inputClass}
                placeholder="Visa details if applicable"
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Consent</h3>
        <div className="space-y-3">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.privacyConsent}
              onChange={(e) => handleInputChange('privacyConsent', e.target.checked)}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
              I agree to the privacy policy and consent to the processing of my personal data *
            </span>
          </label>
          {errors.privacyConsent && (
            <p className="text-red-600 text-sm">{errors.privacyConsent}</p>
          )}

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.dataProcessingConsent}
              onChange={(e) => handleInputChange('dataProcessingConsent', e.target.checked)}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
              I consent to the processing of my data for recruitment purposes
            </span>
          </label>
        </div>
      </div>
    </div>
  )

  if (layout === 'multi-step') {
    return (
      <div className={containerClass}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Apply for {jobTitle}</h2>
          <p className="text-gray-600">{companyName}</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              )}>
                {step}
              </div>
              {step < 4 && (
                <div className={cn(
                  'w-16 h-0.5 mx-2',
                  currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                )} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && <PersonalInfoStep />}
          {currentStep === 2 && <ExperienceStep />}
          {currentStep === 3 && <EducationStep />}
          {currentStep === 4 && <AdditionalInfoStep />}

          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Back
              </button>
            )}
            
            {currentStep < 4 ? (
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
          <h2 className="text-xl font-bold text-gray-900 mb-1">Apply for {jobTitle}</h2>
          <p className="text-sm text-gray-600">{companyName}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name *</label>
              <input
                type="text"
                value={`${formData.firstName} ${formData.lastName}`}
                onChange={(e) => {
                  const [first, ...last] = e.target.value.split(' ')
                  handleInputChange('firstName', first || '')
                  handleInputChange('lastName', last.join(' ') || '')
                }}
                className={inputClass}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className={labelClass}>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={inputClass}
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className={labelClass}>Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={inputClass}
                placeholder="+92 300 1234567"
              />
            </div>

            <div>
              <label className={labelClass}>Experience Level</label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                className={inputClass}
              >
                <option value="">Select level</option>
                {experienceLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Cover Letter</label>
            <textarea
              value={formData.coverLetter}
              onChange={(e) => handleInputChange('coverLetter', e.target.value)}
              className={cn(inputClass, 'min-h-[100px] resize-y')}
              placeholder="Brief cover letter..."
            />
          </div>

          <div>
            <label className={labelClass}>Resume</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleInputChange('resumeFile', e.target.files?.[0] || null)}
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.privacyConsent}
              onChange={(e) => handleInputChange('privacyConsent', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
              I agree to the privacy policy *
            </span>
          </div>

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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Apply for {jobTitle}</h2>
        <p className="text-gray-600">{companyName}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {showPersonalInfo && <PersonalInfoStep />}
        {showExperience && <ExperienceStep />}
        {showEducation && <EducationStep />}
        {showSkills && <SkillsStep />}
        <AdditionalInfoStep />

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
export const JobApplicationFormConfig = {
  id: 'job-application-form',
  name: 'Job Application Form',
  description: 'Comprehensive job application form with multiple sections',
  category: 'business' as const,
  icon: 'briefcase',
  defaultProps: {
    jobTitle: 'Software Developer',
    companyName: 'Tech Company',
    showPersonalInfo: true,
    showExperience: true,
    showEducation: true,
    showSkills: true,
    showReferences: false,
    showCoverLetter: true,
    showResume: true,
    showPortfolio: false,
    showSalary: false,
    showAvailability: true,
    showWorkPermit: true,
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'AWS', 'Docker'],
    experienceLevels: ['Entry Level', 'Mid Level', 'Senior Level', 'Lead/Manager'],
    educationLevels: ['High School', 'Associate', 'Bachelor', 'Master', 'PhD'],
    submitButtonText: 'Submit Application',
    successMessage: 'Thank you! Your application has been submitted successfully.',
    errorMessage: 'Sorry, there was an error submitting your application. Please try again.',
    layout: 'single',
    theme: 'light'
  },
  defaultSize: { width: 100, height: 800 },
  editableFields: [
    'jobTitle',
    'companyName',
    'showPersonalInfo',
    'showExperience',
    'showEducation',
    'showSkills',
    'showReferences',
    'showCoverLetter',
    'showResume',
    'showPortfolio',
    'showSalary',
    'showAvailability',
    'showWorkPermit',
    'skills',
    'experienceLevels',
    'educationLevels',
    'submitButtonText',
    'successMessage',
    'errorMessage',
    'layout',
    'theme'
  ]
}
