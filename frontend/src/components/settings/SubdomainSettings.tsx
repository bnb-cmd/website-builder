'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader } from 'lucide-react'
import { toast } from 'sonner'

export function SubdomainSettings({ websiteId, currentSubdomain }: { 
  websiteId: string
  currentSubdomain?: string 
}) {
  const [subdomain, setSubdomain] = useState(currentSubdomain || '')
  const [checking, setChecking] = useState(false)
  const [available, setAvailable] = useState<boolean | null>(null)
  
  const checkAvailability = async (value: string) => {
    if (!value || value.length < 3) {
      setAvailable(null)
      return
    }
    
    setChecking(true)
    
    try {
      const response = await fetch(`/api/v1/websites/check-subdomain?subdomain=${value}`)
      const data = await response.json()
      
      if (data.success) {
        setAvailable(data.data.available)
      } else {
        setAvailable(false)
      }
    } catch (error) {
      console.error('Error checking subdomain:', error)
      setAvailable(false)
    } finally {
      setChecking(false)
    }
  }
  
  const saveSubdomain = async () => {
    if (!available) {
      toast.error('Please check subdomain availability first')
      return
    }
    
    try {
      const response = await fetch(`/api/v1/websites/${websiteId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ subdomain })
      })
      
      if (response.ok) {
        toast.success('Subdomain saved!')
      } else {
        throw new Error('Failed to save subdomain')
      }
    } catch (error) {
      console.error('Error saving subdomain:', error)
      toast.error('Failed to save subdomain')
    }
  }
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Choose your subdomain
        </label>
        <div className="flex items-center gap-2">
          <Input
            value={subdomain}
            onChange={(e) => {
              const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
              setSubdomain(value)
              checkAvailability(value)
            }}
            placeholder="my-awesome-site"
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground">
            .pakistanbuilder.com
          </span>
          {checking && <Loader className="w-4 h-4 animate-spin" />}
          {available === true && <CheckCircle className="w-4 h-4 text-green-500" />}
          {available === false && <XCircle className="w-4 h-4 text-red-500" />}
        </div>
        {available === false && (
          <p className="text-sm text-red-500 mt-1">
            This subdomain is already taken
          </p>
        )}
        {available === true && (
          <p className="text-sm text-green-500 mt-1">
            This subdomain is available!
          </p>
        )}
      </div>
      
      <Button onClick={saveSubdomain} disabled={!available || checking}>
        Save Subdomain
      </Button>
    </div>
  )
}
