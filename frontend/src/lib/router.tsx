"use client";

import React, { Suspense } from 'react'
import Link from 'next/link'
import { useRouter as useNextRouter, useSearchParams, useParams } from 'next/navigation'

// Wrapper component for useSearchParams
const SearchParamsWrapper = ({ children }: { children: (searchParams: URLSearchParams) => React.ReactNode }) => {
  const searchParams = useSearchParams()
  return <>{children(searchParams || new URLSearchParams())}</>
}

// Re-export Next.js router for compatibility
export const useRouter = () => {
  const router = useNextRouter()
  const params = useParams()
  
  return {
    currentPath: typeof window !== 'undefined' ? window.location.pathname : '/',
    navigate: (path: string) => router.push(path),
    params: params || {},
    // Remove direct useSearchParams call
    searchParams: new URLSearchParams()
  }
}

// Hook that safely uses search params
export const useSearchParamsSafe = () => {
  return {
    get: (key: string) => {
      if (typeof window !== 'undefined') {
        return new URLSearchParams(window.location.search).get(key)
      }
      return null
    }
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