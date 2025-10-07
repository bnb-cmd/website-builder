"use client";

import React from 'react'
import Link from 'next/link'
import { useRouter as useNextRouter } from 'next/navigation'

// Re-export Next.js router for compatibility
export const useRouter = () => {
  const router = useNextRouter()
  
  return {
    currentPath: typeof window !== 'undefined' ? window.location.pathname : '/',
    navigate: (path: string) => router.push(path),
    params: {} // Will be handled by Next.js
  }
}

// Route component - not needed with Next.js App Router
export const Route: React.FC<{ path: string; children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}

// RouterProvider - not needed with Next.js App Router
export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}

// Link component - use Next.js Link
export { Link }