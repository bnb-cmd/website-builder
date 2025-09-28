'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { BlockchainDashboard } from '@/components/blockchain/blockchain-dashboard'

export default function BlockchainPage() {
  const searchParams = useSearchParams()
  const websiteId = searchParams.get('websiteId') || ''

  if (!websiteId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Website ID Required
          </h2>
          <p className="text-gray-500">
            Please select a website to access the Blockchain features.
          </p>
        </div>
      </div>
    )
  }

  return <BlockchainDashboard websiteId={websiteId} />
}
