import React from 'react'
import { RouterProvider, Route } from './lib/router'
import { Toaster } from './components/ui/sonner'

// Import pages
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { WebsitesPage } from './pages/WebsitesPage'
import { TemplatesPage } from './pages/TemplatesPage'
import { EditorPage } from './pages/EditorPage'
import { OnboardingPage } from './pages/OnboardingPage'

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">Please refresh the page to try again</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider>
        <div className="min-h-screen bg-background">
          {/* Landing page */}
          <Route path="/">
            <LandingPage />
          </Route>

          {/* Auth pages */}
          <Route path="/login">
            <LoginPage />
          </Route>
          
          <Route path="/register">
            <RegisterPage />
          </Route>

          {/* AI Onboarding */}
          <Route path="/onboarding">
            <OnboardingPage />
          </Route>

          {/* Dashboard pages */}
          <Route path="/dashboard">
            <DashboardPage />
          </Route>

          <Route path="/dashboard/websites">
            <WebsitesPage />
          </Route>

          <Route path="/dashboard/templates">
            <TemplatesPage />
          </Route>

          {/* Editor pages */}
          <Route path="/dashboard/websites/new">
            <EditorPage />
          </Route>

          <Route path="/dashboard/websites/:id/edit">
            <EditorPage />
          </Route>

          {/* Toast notifications */}
          <Toaster position="bottom-right" />
        </div>
      </RouterProvider>
    </ErrorBoundary>
  )
}