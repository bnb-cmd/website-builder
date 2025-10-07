"use client";

import React, { useState, useEffect } from 'react'
import { Header } from './Header'
import { DashboardSidebar } from './DashboardSidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed')
    if (savedState !== null) {
      setSidebarCollapsed(JSON.parse(savedState))
    }
    setIsHydrated(true)
  }, [])

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(sidebarCollapsed))
    }
  }, [sidebarCollapsed, isHydrated])

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="h-screen bg-background">
      <Header 
        variant="dashboard" 
        onMenuClick={() => setSidebarOpen(true)}
        onToggleSidebar={toggleSidebarCollapse}
        sidebarCollapsed={sidebarCollapsed}
      />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {isHydrated ? (
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
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}