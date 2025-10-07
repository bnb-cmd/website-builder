'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Globe, ExternalLink, Edit, MoreVertical } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface Website {
  id: string
  name: string
  status: string
  subdomain?: string
  customDomain?: string
  updatedAt: string
}

interface RecentWebsitesProps {
  websites: Website[]
}

export function RecentWebsites({ websites }: RecentWebsitesProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getWebsiteUrl = (website: Website) => {
    if (website.customDomain) {
      return `https://${website.customDomain}`
    }
    if (website.subdomain) {
      return `https://${website.subdomain}.pakistanbuilder.com`
    }
    return '#'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Globe className="h-5 w-5" />
          <span>Recent Websites</span>
        </CardTitle>
        <Link href="/dashboard/websites">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {websites.length === 0 ? (
          <div className="text-center py-8">
            <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No websites yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Create your first website to get started
            </p>
            <Link href="/dashboard/websites/new">
              <Button>Create Website</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {websites.map((website) => (
              <div
                key={website.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{website.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(website.status)}>
                        {website.status.toLowerCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Updated {formatDate(website.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {website.status === 'PUBLISHED' && (
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={getWebsiteUrl(website)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}

                  <Link href={`/dashboard/websites/${website.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Link href={`/dashboard/websites/${website.id}`} className="flex items-center w-full">
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/dashboard/websites/${website.id}/analytics`} className="flex items-center w-full">
                          Analytics
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
