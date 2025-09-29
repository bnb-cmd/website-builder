'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  businessType?: string
  city?: string
  companyName?: string
  role: string
  status: string
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
  businessType?: string
  city?: string
  companyName?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        setIsLoading(false)
        return
      }

      // Use real API call to get user data
      const response = await api.get('/auth/me')
      setUser(response.data.data.user)
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { user: userData, accessToken, refreshToken } = response.data.data

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      
      setUser(userData)
      toast.success('Welcome back!')
      router.push('/dashboard')
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Login failed'
      toast.error(message)
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await api.post('/auth/register', data)
      const { user: userData, accessToken, refreshToken } = response.data.data

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      
      setUser(userData)
      toast.success('Account created successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Registration failed'
      toast.error(message)
      throw error
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      toast.success('Logged out successfully')
      router.push('/')
    }
  }

  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken')
      if (!refreshTokenValue) {
        throw new Error('No refresh token')
      }

      const response = await api.post('/auth/refresh', {
        refreshToken: refreshTokenValue
      })

      const { accessToken, refreshToken: newRefreshToken } = response.data.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', newRefreshToken)
    } catch (error) {
      console.error('Token refresh failed:', error)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      router.push('/login')
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await api.put('/auth/profile', data)
      setUser(response.data.data.user)
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Profile update failed'
      toast.error(message)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
