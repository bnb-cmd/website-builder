'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  TrendingUp
} from 'lucide-react'

// Demo data
const demoWebsites = [
  {
    id: 'web-1',
    name: 'My Restaurant',
    domain: 'myrestaurant.com',
    template: 'Restaurant Deluxe',
    status: 'published',
    visitors: '2.4k',
    lastModified: '2 hours ago',
    thumbnail: '/placeholder-website.png'
  },
  {
    id: 'web-2', 
    name: 'Tech Solutions',
    domain: 'techsolutions.pk',
    template: 'Modern Business',
    status: 'draft',
    visitors: '1.2k',
    lastModified: '1 day ago',
    thumbnail: '/placeholder-website.png'
  },
  {
    id: 'web-3',
    name: 'Fashion Store',
    domain: 'fashionstore.com',
    template: 'E-commerce Pro',
    status: 'published',
    visitors: '5.1k',
    lastModified: '3 days ago',
    thumbnail: '/placeholder-website.png'
  }
]

export default function WebsitesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredWebsites = demoWebsites.filter(website => {
    const matchesSearch = website.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         website.domain.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || website.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search websites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Websites Grid */}
      {filteredWebsites.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No websites found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : "You haven't created any websites yet. Start building your first website!"
              }
            </p>
            <Link href="/dashboard/websites/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Website
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWebsites.map((website) => (
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
                      {website.domain}
                    </CardDescription>
                  </div>
                  <Badge variant={website.status === 'published' ? 'default' : 'secondary'}>
                    {website.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {website.visitors} visitors
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {website.lastModified}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Template: {website.template}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Link href={`/dashboard/websites/${website.id}/edit`}>
                      <Button size="sm" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
            <div className="text-2xl font-bold">{demoWebsites.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
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
              {demoWebsites.filter(w => w.status === 'published').length}
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
