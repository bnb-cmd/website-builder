'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { SmartFormField } from '@/components/ui/smart-form-field'
import { useSmartForm } from '@/hooks/use-smart-form'
import { Globe, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const router = useRouter()
  const [error, setError] = useState('')

  const smartForm = useSmartForm({
    config: {
      email: {
        initialValue: '',
        validationRules: [
          { type: 'email', message: 'Please enter a valid email address' }
        ],
        required: true
      },
      password: {
        initialValue: '',
        validationRules: [
          { type: 'minLength', value: 6, message: 'Password must be at least 6 characters' }
        ],
        required: true
      }
    },
    onSubmit: async (values) => {
      setError('')
      try {
        await login(values.email, values.password)
        router.push('/dashboard')
      } catch (error: any) {
        setError(error.response?.data?.error?.message || 'Login failed')
        throw error // Re-throw to keep form in submitting state
      }
    },
    validateOnChange: true,
    validateOnBlur: true
  })

  const { handleSubmit, isSubmitting, getFieldProps } = smartForm

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Globe className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold gradient-text">Pakistan Builder</span>
          </Link>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue building amazing websites
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <SmartFormField
                label="Email"
                type="email"
                placeholder="john@example.com"
                aiSuggestions={true}
                context={['login', 'pakistan']}
                showValidation={true}
                realTimeValidation={true}
                helpText="We'll never share your email with anyone else."
                {...getFieldProps('email')}
              />

              {/* Password */}
              <SmartFormField
                label="Password"
                type="password"
                placeholder="Enter your password"
                showPasswordToggle={true}
                showValidation={true}
                realTimeValidation={true}
                helpText="Minimum 6 characters required."
                {...getFieldProps('password')}
              />

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>

              {/* Forgot Password */}
              <div className="text-center">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Sign up for free
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Demo Account */}
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <CardContent className="pt-6">
            <h3 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
              Try Demo Account
            </h3>
            <p className="text-sm text-amber-600 dark:text-amber-300 mb-3">
              Email: demo@pakistanbuilder.com<br />
              Password: demo123
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                smartForm.setFieldValue('email', 'demo@pakistanbuilder.com')
                smartForm.setFieldValue('password', 'demo123')
              }}
              className="w-full border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              Use Demo Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
