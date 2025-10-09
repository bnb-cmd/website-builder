"use client";

import React from 'react'
import Link from 'next/link'
import { useRouter as useNextRouter, useSearchParams, useParams } from 'next/navigation'

// Re-export Next.js router for compatibility
export const useRouter = () => {
  const router = useNextRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  
  return {
    currentPath: typeof window !== 'undefined' ? window.location.pathname : '/',
    navigate: (path: string) => router.push(path),
    params: params || {},
    searchParams: searchParams || new URLSearchParams()
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