import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { CreditCard, MapPin, Truck, Lock, ArrowLeft, CheckCircle } from 'lucide-react'

interface CheckoutElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function CheckoutElement({ element, onUpdate, viewMode, style, children }: CheckoutElementProps) {
  const handleStepChange = (step: number) => {
    onUpdate(element.id, {
      props: {
        ...element.props,
        currentStep: step
      }
    })
  }

  const getVariantClass = () => {
    switch (element.props.variant) {
      case 'single-page':
        return 'max-w-4xl mx-auto'
      case 'multi-step':
        return 'max-w-6xl mx-auto'
      case 'sidebar':
        return 'grid grid-cols-1 lg:grid-cols-3 gap-8'
      default:
        return 'max-w-4xl mx-auto'
    }
  }

  const currentStep = element.props.currentStep || 1
  const steps = [
    { id: 1, title: 'Shipping', icon: MapPin },
    { id: 2, title: 'Payment', icon: CreditCard },
    { id: 3, title: 'Review', icon: CheckCircle }
  ]

  return (
    <div
      className={cn(
        'w-full p-6',
        getVariantClass()
      )}
      style={style}
    >
      {/* Header */}
      <div className="mb-8">
        <button className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Cart</span>
        </button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      {/* Progress Steps */}
      {element.props.showSteps && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isActive = step.id === currentStep
              const isCompleted = step.id < currentStep
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center">
                    <div className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors',
                      isCompleted ? 'bg-primary border-primary text-primary-foreground' :
                      isActive ? 'border-primary text-primary' :
                      'border-border text-muted-foreground'
                    )}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="ml-3">
                      <div className={cn(
                        'text-sm font-medium',
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      )}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="w-16 h-0.5 bg-border mx-4" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Checkout Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-8">
          {/* Shipping Information */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Shipping Information
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="px-4 py-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="px-4 py-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              
              <input
                type="text"
                placeholder="Address"
                className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  className="px-4 py-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="State"
                  className="px-4 py-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  className="px-4 py-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Information
            </h2>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Card Number"
                className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Expiry Date"
                  className="px-4 py-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="px-4 py-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <input
                type="text"
                placeholder="Cardholder Name"
                className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
          
          {/* Order Items */}
          <div className="space-y-4 mb-6">
            {[
              { name: 'Product 1', price: 29.99, quantity: 2 },
              { name: 'Product 2', price: 19.99, quantity: 1 }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                </div>
                <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          
          {/* Order Totals */}
          <div className="space-y-2 border-t border-border pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>$79.97</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>$9.99</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>$7.20</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
              <span>Total</span>
              <span>$97.16</span>
            </div>
          </div>
          
          {/* Place Order Button */}
          <button className="w-full mt-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium flex items-center justify-center">
            <Lock className="h-4 w-4 mr-2" />
            Place Order
          </button>
          
          {/* Security Notice */}
          <div className="mt-4 text-xs text-muted-foreground text-center">
            <Lock className="h-3 w-3 inline mr-1" />
            Your payment information is secure and encrypted
          </div>
        </div>
      </div>

      {!children && (
        <div className="absolute inset-0 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground pointer-events-none">
          <div className="text-center">
            <CreditCard className="h-8 w-8 mx-auto mb-2" />
            <p>Checkout Process</p>
            <p className="text-xs mt-1">
              Variant: {element.props.variant || 'single-page'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
