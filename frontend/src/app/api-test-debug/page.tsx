'use client'

import { useState } from 'react'
import { apiHelpers } from '@/lib/api'

export default function APITestPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testAPI = async () => {
    setLoading(true)
    setResult('Testing API...')
    
    try {
      console.log('🧪 Testing API connection...')
      
      // Test direct axios call
      const directResponse = await fetch('http://localhost:3002/v1/templates?limit=5')
      console.log('🧪 Direct fetch response:', directResponse.status)
      
      if (!directResponse.ok) {
        throw new Error(`Direct fetch failed: ${directResponse.status} ${directResponse.statusText}`)
      }
      
      const directData = await directResponse.json()
      console.log('🧪 Direct fetch data:', directData)
      
      // Test API helper
      const apiResponse = await apiHelpers.getTemplates({ limit: 5 })
      console.log('🧪 API helper response:', apiResponse)
      
      setResult(`✅ SUCCESS!
Direct fetch: ${directResponse.status} OK
API helper: ${apiResponse.status} OK
Templates found: ${apiResponse.data.templates?.length || 0}`)
      
    } catch (error: any) {
      console.error('🧪 Test failed:', error)
      setResult(`❌ FAILED: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <button 
        onClick={testAPI}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test API Connection'}
      </button>
      
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <pre className="whitespace-pre-wrap">{result}</pre>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Check browser console for detailed logs</p>
        <p>Backend should be running on: http://localhost:3002</p>
        <p>Frontend should be running on: http://localhost:3001</p>
      </div>
    </div>
  )
}
