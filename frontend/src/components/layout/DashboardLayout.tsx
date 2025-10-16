"use client";

import React, { useState, useEffect } from 'react'
// import { Header } from './Header'
import { DashboardSidebar } from './DashboardSidebar'
import { useAuthStore } from '@/lib/store'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const { user, autoLogin, _hasHydrated } = useAuthStore()

  // Auto-login on mount if not already logged in and store is hydrated
  useEffect(() => {
    console.log('🔧 DashboardLayout useEffect triggered:', { _hasHydrated, user: !!user })
    
    if (_hasHydrated && !user) {
      console.log('🚀 Starting auto-login...')
      autoLogin().then(result => {
        console.log('🔐 Auto-login result:', result)
      })
    }
  }, [user, autoLogin, _hasHydrated])

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebar-collapsed')
      if (savedState !== null) {
        setSidebarCollapsed(JSON.parse(savedState))
      }
    }
    setIsHydrated(true)
  }, [])

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(sidebarCollapsed))
    }
  }, [sidebarCollapsed, isHydrated])

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="h-screen bg-background">
      {/* <Header 
        variant="dashboard" 
        onMenuClick={() => setSidebarOpen(true)}
        onToggleSidebar={toggleSidebarCollapse}
        sidebarCollapsed={sidebarCollapsed}
      /> */}
      
      <div className="flex h-[calc(100vh-4rem)]">
        {isHydrated && _hasHydrated ? (
          <DashboardSidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)}
            collapsed={sidebarCollapsed}
          />
        ) : (
          <div className="w-64 border-r bg-sidebar border-sidebar-border" />
        )}
        
        <main className="flex-1 overflow-auto bg-background">
          <div className="h-full">
            {!_hasHydrated ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              </div>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  )
}