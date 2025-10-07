'use client'

import { PwaSettingsForm } from '@/components/dashboard/pwa-settings-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSearchParams } from 'next/navigation'

export default function PwaSettingsPage() {
  const searchParams = useSearchParams()
  const websiteId = searchParams.get('websiteId')

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Progressive Web App (PWA) Settings</CardTitle>
          <CardDescription>
            Configure how your website behaves when installed as an app on a mobile device or desktop.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {websiteId ? (
            <PwaSettingsForm websiteId={websiteId} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Please select a website from your dashboard to configure its PWA settings.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
