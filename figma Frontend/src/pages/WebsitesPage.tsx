import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Link, useRouter } from '../lib/router'
import { useWebsiteStore } from '../lib/store'
import { formatDate } from '../lib/utils'
import { ImageWithFallback } from '../components/figma/ImageWithFallback'
import { 
  Plus, 
  Search, 
  Filter,
  Grid3X3,
  List,
  Edit,
  Eye,
  MoreVertical,
  Copy,
  Download,
  Trash2,
  Globe,
  Clock,
  BarChart3,
  Settings
} from 'lucide-react'

type ViewMode = 'grid' | 'list'
type FilterOption = 'all' | 'published' | 'draft' | 'archived'

export const WebsitesPage: React.FC = () => {
  const { websites, fetchWebsites, deleteWebsite, isLoading } = useWebsiteStore()
  const { navigate } = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<FilterOption>('all')

  useEffect(() => {
    fetchWebsites()
  }, [fetchWebsites])

  const filteredWebsites = websites.filter(website => {
    const matchesSearch = website.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'all' || website.status === filter
    return matchesSearch && matchesFilter
  })

  const handleDeleteWebsite = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this website?')) {
      await deleteWebsite(id)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'default'
      case 'draft':
        return 'secondary'
      case 'archived':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">My Websites</h1>
                <p className="text-muted-foreground">Manage your website projects</p>
              </div>
              <Button disabled>
                <Plus className="mr-2 h-4 w-4" />
                Create Website
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="w-full h-48 bg-muted animate-pulse" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">My Websites</h1>
            <p className="text-muted-foreground">
              Manage your website projects ({filteredWebsites.length} websites)
            </p>
          </div>
          
          <Link to="/dashboard/websites/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Website
            </Button>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search websites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-[300px]"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilter('all')}>
                  All Websites
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('published')}>
                  Published
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('draft')}>
                  Draft
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('archived')}>
                  Archived
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Website Grid/List */}
        {filteredWebsites.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">
              {searchQuery || filter !== 'all' ? 'No websites found' : 'No websites yet'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first website to get started'
              }
            </p>
            {(!searchQuery && filter === 'all') && (
              <Link to="/dashboard/websites/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Website
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
              : 'space-y-4'
          }>
            {filteredWebsites.map((website) => (
              <Card key={website.id} className="overflow-hidden group hover:shadow-md transition-shadow duration-200">
                {viewMode === 'grid' ? (
                  <>
                    <div className="relative">
                      <ImageWithFallback
                        src={website.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'}
                        alt={website.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge 
                        variant={getStatusBadgeVariant(website.status)}
                        className="absolute top-3 right-3"
                      >
                        {website.status}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium truncate pr-2">{website.name}</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/websites/${website.id}/edit`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Export
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteWebsite(website.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-3">
                        <Clock className="h-3 w-3" />
                        <span>Updated {formatDate(website.lastModified)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => navigate(`/dashboard/websites/${website.id}/edit`)}
                          className="flex-1"
                        >
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-1 h-3 w-3" />
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <ImageWithFallback
                        src={website.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'}
                        alt={website.name}
                        className="w-16 h-12 object-cover rounded"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium truncate">{website.name}</h3>
                          <Badge variant={getStatusBadgeVariant(website.status)} className="text-xs">
                            {website.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>Updated {formatDate(website.lastModified)}</span>
                          </div>
                          {website.domain && (
                            <div className="flex items-center space-x-1">
                              <Globe className="h-3 w-3" />
                              <span className="truncate">{website.domain}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/dashboard/websites/${website.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Export
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteWebsite(website.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}