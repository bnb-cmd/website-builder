"use client";

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEcommerceStore } from '@/lib/stores/ecommerceStore'
import { useWebsiteStore } from '@/lib/store'
import { 
  Users, 
  Search, 
  Eye,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  ArrowLeft
} from '@/lib/icons'
import Link from 'next/link'

export default function CustomersPage() {
  const { 
    customers, 
    isLoading, 
    selectedWebsite, 
    setSelectedWebsite,
    customerFilters,
    setCustomerFilters,
    fetchCustomers
  } = useEcommerceStore()
  
  const { websites } = useWebsiteStore()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (selectedWebsite) {
      fetchCustomers()
    }
  }, [selectedWebsite, customerFilters])

  const handleWebsiteChange = (websiteId: string) => {
    setSelectedWebsite(websiteId)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCustomerFilters({ search: value, page: 1 })
  }

  const handleSort = (sortBy: string) => {
    setCustomerFilters({ sortBy, page: 1 })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCustomerValueBadge = (totalSpent: number) => {
    if (totalSpent >= 50000) {
      return <Badge variant="default" className="bg-purple-600">VIP</Badge>
    } else if (totalSpent >= 20000) {
      return <Badge variant="default" className="bg-blue-600">Premium</Badge>
    } else if (totalSpent >= 5000) {
      return <Badge variant="default" className="bg-green-600">Regular</Badge>
    } else {
      return <Badge variant="outline">New</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer relationships
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Website Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Website:</label>
            <select
              value={selectedWebsite || ''}
              onChange={(e) => handleWebsiteChange(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="">Select a website</option>
              {websites.map((website) => (
                <option key={website.id} value={website.id}>
                  {website.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {!selectedWebsite ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Website Selected</h3>
            <p className="text-muted-foreground text-center mb-4">
              Select a website to view and manage its customers.
            </p>
            <Button asChild>
              <Link href="/dashboard/websites">
                Go to Websites
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Customers</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="sm:w-48">
                  <Label>Sort By</Label>
                  <select
                    value={customerFilters.sortBy}
                    onChange={(e) => handleSort(e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="createdAt">Date Joined</option>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="totalSpent">Total Spent</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customers List */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      <div className="h-3 bg-muted rounded w-1/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : customers.length > 0 ? (
              customers.map((customer) => (
                <Card key={customer.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Customer Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold">
                            {customer.name || 'Anonymous Customer'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {customer.email}
                          </p>
                        </div>
                        {getCustomerValueBadge(customer.totalSpent)}
                      </div>

                      {/* Customer Stats */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1">
                            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                            <span>Orders:</span>
                          </div>
                          <span className="font-medium">{customer.totalOrders}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span>Total Spent:</span>
                          </div>
                          <span className="font-medium">{formatCurrency(customer.totalSpent)}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-4 h-4 text-muted-foreground" />
                            <span>Avg Order:</span>
                          </div>
                          <span className="font-medium">{formatCurrency(customer.averageOrderValue)}</span>
                        </div>
                      </div>

                      {/* Customer Timeline */}
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>First order: {formatDate(customer.firstOrder)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Last order: {formatDate(customer.lastOrder)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-2">
                        <Button asChild variant="outline" size="sm" className="w-full">
                          <Link href={`/dashboard/ecommerce/customers/${customer.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Customers Found</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    {searchTerm 
                      ? 'No customers match your search criteria.' 
                      : 'Customers will appear here when they make their first purchase.'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pagination */}
          {customers.length > 0 && (
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {customers.length} customers
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={customerFilters.page === 1}
                      onClick={() => setCustomerFilters({ page: customerFilters.page - 1 })}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCustomerFilters({ page: customerFilters.page + 1 })}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
