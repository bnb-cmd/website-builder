'use client'

import { WebsiteEditor } from '@/components/editor/website-editor'
import { useParams } from 'next/navigation'

export default function EditWebsitePage() {
  const params = useParams()
  const websiteId = params.id as string

  return (
    <div className="h-screen">
      <WebsiteEditor websiteId={websiteId} />
    </div>
  )
}
