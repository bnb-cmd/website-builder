'use client'

import { useState } from 'react'

export default function SimpleAPITest() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testDirectFetch = async () => {
    setLoading(true)
    setResult('Testing direct fetch...')
    
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
        setResult(`✅ Direct fetch successful! User: ${data.data.user.name}`)
      } else {
        setResult(`❌ Direct fetch failed: ${data.error?.message || 'Unknown error'}`)
      }
    } catch (error: any) {
      setResult(`❌ Direct fetch error: ${error.message}`)
      console.error('Direct fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const testAxios = async () => {
    setLoading(true)
    setResult('Testing axios...')
    
    try {
      // Import axios dynamically to avoid SSR issues
      const axios = (await import('axios')).default
      
      const response = await axios.post('http://localhost:3005/v1/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      })
      
      setResult(`✅ Axios successful! User: ${response.data.data.user.name}`)
    } catch (error: any) {
      setResult(`❌ Axios failed: ${error.response?.data?.error?.message || error.message}`)
      console.error('Axios error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-center">Simple API Test</h1>
        
        <div className="space-y-2">
          <button
            onClick={testDirectFetch}
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
          >
            Test Direct Fetch
          </button>
          
          <button
            onClick={testAxios}
            disabled={loading}
            className="w-full bg-green-500 text-white p-2 rounded disabled:opacity-50"
          >
            Test Axios
          </button>
        </div>
        
        <div className="p-4 bg-gray-100 rounded">
          <pre className="text-sm">{result}</pre>
        </div>
      </div>
    </div>
  )
}
