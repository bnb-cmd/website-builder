'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { apiHelpers } from '@/lib/api'

interface PublishStatus {
  jobId: string | null
  status: 'idle' | 'publishing' | 'completed' | 'failed'
  progress: number
  message: string
  deploymentUrl: string | null
  error: string | null
}

export function usePublish() {
  const [state, setState] = useState<PublishStatus>({
    jobId: null,
    status: 'idle',
    progress: 0,
    message: '',
    deploymentUrl: null,
    error: null
  })
  
  const publish = useCallback(async (websiteId: string, customDomain?: string) => {
    try {
      setState(prev => ({ ...prev, status: 'publishing', progress: 0 }))
      
      // Start publish job using API helpers
      const response = await apiHelpers.publishWebsite(websiteId, customDomain)
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to start publish')
      }
      
      const { jobId, deploymentUrl } = response.data
      
      setState(prev => ({ 
        ...prev, 
        jobId, 
        deploymentUrl,
        message: 'Publishing...' 
      }))
      
      // Poll for status
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await apiHelpers.getPublishJobStatus(jobId)
          
          if (statusResponse.success) {
            const jobStatus = statusResponse.data
            
            setState(prev => ({
              ...prev,
              progress: jobStatus.progress,
              message: jobStatus.message,
              status: jobStatus.status as any
            }))
            
            if (jobStatus.status === 'completed') {
              clearInterval(pollInterval)
              toast.success('Site published successfully!')
            } else if (jobStatus.status === 'failed') {
              clearInterval(pollInterval)
              toast.error('Publishing failed: ' + jobStatus.message)
            }
          }
        } catch (error) {
          console.error('Error polling status:', error)
        }
      }, 2000) // Poll every 2 seconds
      
      // Cleanup after 5 minutes
      setTimeout(() => clearInterval(pollInterval), 300000)
      
      return { success: true, jobId, deploymentUrl }
      
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        status: 'failed',
        error: error.message
      }))
      toast.error('Failed to publish: ' + error.message)
      return { success: false, error: error.message }
    }
  }, [])
  
  return { ...state, publish }
}
