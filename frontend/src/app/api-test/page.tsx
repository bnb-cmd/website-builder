'use client'

import { useState } from 'react'

export default function APITest() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResult('Testing login...')
    
    try {
      const response = await fetch('http://localhost:3005/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setResult(`✅ Login successful! User: ${data.data.user.name}`)
      } else {
        setResult(`❌ Login failed: ${data.error?.message || 'Unknown error'}`)
      }
    } catch (error: any) {
      setResult(`❌ Login error: ${error.message}`)
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  const testRegister = async () => {
    setLoading(true)
    setResult('Testing registration...')
    
    try {
      const response = await fetch('http://localhost:3005/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User 3',
          email: 'test3@example.com',
          password: 'password123'
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setResult(`✅ Registration successful! User: ${data.data.user.name}`)
      } else {
        setResult(`❌ Registration failed: ${data.error?.message || 'Unknown error'}`)
      }
    } catch (error: any) {
      setResult(`❌ Registration error: ${error.message}`)
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-center">API Test</h1>
        
        <div className="space-y-2">
          <button
            onClick={testLogin}
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
          >
            Test Login
          </button>
          
          <button
            onClick={testRegister}
            disabled={loading}
            className="w-full bg-green-500 text-white p-2 rounded disabled:opacity-50"
          >
            Test Register
          </button>
        </div>
        
        <div className="p-4 bg-gray-100 rounded">
          <pre className="text-sm">{result}</pre>
        </div>
      </div>
    </div>
  )
}
