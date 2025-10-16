import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const PaymentMethodsConfig: ComponentConfig = {
  id: 'payment-methods',
  name: 'Payment Methods',
  category: 'ecommerce',
  icon: 'CreditCard',
  description: 'Display accepted payment methods',
  defaultProps: {
    title: 'Accepted Payment Methods',
    subtitle: 'Secure and convenient payment options',
    methods: [
      {
        id: '1',
        name: 'Credit Cards',
        description: 'Visa, Mastercard, American Express',
        icon: 'CreditCard',
        color: 'blue',
        enabled: true,
        fees: 'No additional fees'
      },
      {
        id: '2',
        name: 'PayPal',
        description: 'Pay securely with your PayPal account',
        icon: 'PayPal',
        color: 'blue',
        enabled: true,
        fees: 'No additional fees'
      },
      {
        id: '3',
        name: 'Apple Pay',
        description: 'Quick and secure payments with Apple Pay',
        icon: 'Apple',
        color: 'gray',
        enabled: true,
        fees: 'No additional fees'
      },
      {
        id: '4',
        name: 'Google Pay',
        description: 'Fast checkout with Google Pay',
        icon: 'Google',
        color: 'blue',
        enabled: true,
        fees: 'No additional fees'
      },
      {
        id: '5',
        name: 'Bank Transfer',
        description: 'Direct bank transfer for large orders',
        icon: 'Bank',
        color: 'green',
        enabled: true,
        fees: 'No additional fees'
      },
      {
        id: '6',
        name: 'Cryptocurrency',
        description: 'Pay with Bitcoin, Ethereum, and more',
        icon: 'Bitcoin',
        color: 'orange',
        enabled: false,
        fees: 'Coming soon'
      }
    ],
    columns: 3,
    showFees: true,
    showStatus: true,
    cardStyle: 'modern'
  },
  defaultSize: { width: 800, height: 600 },
  editableFields: [
    'title',
    'subtitle',
    'columns'
  ]
}

interface PaymentMethod {
  id: string
  name: string
  description: string
  icon?: string
  color: string
  enabled: boolean
  fees: string
}

interface PaymentMethodsProps extends WebsiteComponentProps {
  title?: string
  subtitle?: string
  methods?: PaymentMethod[]
  columns?: number
  showFees?: boolean
  showStatus?: boolean
  cardStyle?: 'modern' | 'minimal'
}

const getPaymentIcon = (iconName?: string) => {
  const icons: Record<string, React.ReactNode> = {
    CreditCard: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    PayPal: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.543-.68c-.013-.76-.298-1.407-.855-1.93C19.151 3.35 17.992 2.94 16.458 2.94h-7.46c-.524 0-.968.382-1.05.9L5.944 20.597h4.576c.524 0 .968-.382 1.05-.9l1.12-7.106h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437.292-1.867-.002-3.137-1.012-4.287z"/>
      </svg>
    ),
    Apple: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
    Google: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
    Bank: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    Bitcoin: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546z"/>
      </svg>
    )
  }
  
  return icons[iconName || 'CreditCard'] || icons.CreditCard
}

const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
    green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
    gray: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' }
  }
  
  return colors[color] || colors.blue
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({ 
  deviceMode = 'desktop',
  title = 'Accepted Payment Methods',
  subtitle = 'Secure and convenient payment options',
  methods = [],
  columns = 3,
  showFees = true,
  showStatus = true,
  cardStyle = 'modern'
}) => {
  const textSize = getResponsiveTextSize('text-sm', deviceMode)
  const titleSize = getResponsiveTextSize('text-xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-lg', deviceMode)
  const methodTitleSize = getResponsiveTextSize('text-lg', deviceMode)
  const padding = getResponsivePadding('p-6', deviceMode)
  
  const gridCols = columns === 1 ? 'grid-cols-1' : 
                   columns === 2 ? 'grid-cols-2' : 
                   columns === 3 ? 'grid-cols-3' : 
                   columns === 4 ? 'grid-cols-4' : 'grid-cols-3'
  
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
          {(methods || []).map((method) => {
            const colorClasses = getColorClasses(method.color)
            
            return (
              <div 
                key={method.id} 
                className={`${cardStyle === 'modern' ? 'bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow' : 'text-center'} ${!method.enabled ? 'opacity-50' : ''}`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 ${colorClasses?.bg || 'bg-gray-100'} rounded-lg flex items-center justify-center mb-4`}>
                    <div className={`${colorClasses?.text || 'text-gray-600'}`}>
                      {getPaymentIcon(method.icon)}
                    </div>
                  </div>
                  
                  <h4 className={`font-semibold mb-2 ${methodTitleSize}`}>{method.name}</h4>
                  <p className={`text-gray-600 mb-4 ${textSize}`}>{method.description}</p>
                  
                  {showFees && (
                    <div className={`mb-3 ${textSize} text-gray-500`}>
                      {method.fees}
                    </div>
                  )}
                  
                  {showStatus && (
                    <div className="flex items-center">
                      {method.enabled ? (
                        <div className="flex items-center text-green-600">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className={`${textSize}`}>Available</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-400">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className={`${textSize}`}>Coming Soon</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className={`${textSize} text-gray-600`}>
              All payments are processed securely with SSL encryption
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
