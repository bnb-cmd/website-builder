"use client";
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  MoreHorizontal, 
  Globe,
  Calendar,
  Users,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

interface Website {
  id: string
  name: string
  description: string
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  subdomain: string
  customDomain?: string
  businessType: string
  language: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

const statusMap = {
  PUBLISHED: { label: 'Published', variant: 'default' as const },
  DRAFT: { label: 'Draft', variant: 'secondary' as const },
  ARCHIVED: { label: 'Archived', variant: 'destructive' as const }
}

const formatDate = (dateString: string | undefined | null) => {
  if (!dateString) return 'Not published'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Invalid date'
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const WebsitesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [websites, setWebsites] = useState<Website[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        setIsLoading(true)
        // Mock data for now - will be replaced with real API call
        const mockWebsites: Website[] = [
          {
            id: '1',
            name: 'My Business Website',
            description: 'Professional business website for my company',
            status: 'PUBLISHED',
            subdomain: 'mybusiness',
            customDomain: 'mybusiness.com',
            businessType: 'BUSINESS',
            language: 'ENGLISH',
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-20T15:30:00Z',
            publishedAt: '2024-01-20T15:30:00Z'
          },
          {
            id: '2',
            name: 'E-commerce Store',
            description: 'Online store for selling products',
            status: 'DRAFT',
            subdomain: 'mystore',
            businessType: 'ECOMMERCE',
            language: 'ENGLISH',
            createdAt: '2024-01-18T09:00:00Z',
            updatedAt: '2024-01-22T11:15:00Z'
          }
        ]
        setWebsites(mockWebsites)
      } catch (err) {
        console.error('Failed to fetch websites:', err)
        setError('Failed to load websites. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchWebsites()
  }, [])

  const filteredWebsites = websites.filter(website => {
    const matchesSearch = website.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         website.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (website.customDomain?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    const matchesStatus = statusFilter === 'all' || website.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Websites</h1>
            <p className="text-muted-foreground">Loading your websites...</p>
          </div>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            New Website
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-muted-foreground max-w-md">
          {error}
        </p>
        <Button onClick={() => window.location.reload()}>
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Websites</h1>
          <p className="text-muted-foreground">
            Create and manage your websites
          </p>
        </div>
        <Link href="/dashboard/websites/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Website
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Websites Grid */}
      {filteredWebsites.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No matching websites' : 'No websites yet'}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : "You haven't created any websites yet. Start building your first website!"
              }
            </p>
            <Link href="/dashboard/websites/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {searchQuery || statusFilter !== 'all' ? 'View All Websites' : 'Create Your First Website'}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWebsites.map((website) => {
            const status = statusMap[website.status] || statusMap.DRAFT
            return (
              <Card key={website.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Globe className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{website.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Globe className="h-3 w-3 mr-1" />
                        {website.subdomain}
                        {website.customDomain && ` (${website.customDomain})`}
                      </CardDescription>
                    </div>
                    <Badge variant={status.variant}>
                      {status.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {website.description || 'No description'}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Updated {formatDate(website.updatedAt)}
                      </span>
                      {website.publishedAt && (
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Published {formatDate(website.publishedAt)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                      <Link href={`/dashboard/websites/${website.id}/edit`} className="flex-1">
                        <Button size="sm" className="w-full">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      {website.status === 'PUBLISHED' && (
                        <a 
                          href={`https://${website.customDomain || `${website.subdomain}.yourdomain.com`}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button size="sm" variant="outline" className="w-full">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Websites</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{websites.length}</div>
            <p className="text-xs text-muted-foreground">
              {websites.filter((website: Website) => website.status === 'PUBLISHED').length} published
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {websites.filter(w => w.status === 'PUBLISHED').length}
            </div>
            <p className="text-xs text-muted-foreground">
              +1 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.7k</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default WebsitesPage