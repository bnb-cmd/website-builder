'use client'

import { WebsiteEditor } from '@/components/editor/website-editor'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function EditWebsitePage() {
  const params = useParams()
  const router = useRouter()
  const websiteId = params.id as string

  useEffect(() => {
    // Redirect if no valid website ID
    if (!websiteId || websiteId === 'undefined') {
      console.warn('Invalid website ID, redirecting to dashboard')
      router.push('/dashboard/websites')
    }
  }, [websiteId, router])

  // Don't render if no valid website ID
  if (!websiteId || websiteId === 'undefined') {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Invalid Website ID</h2>
          <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen">
      <WebsiteEditor websiteId={websiteId} />
    </div>
  )
}
